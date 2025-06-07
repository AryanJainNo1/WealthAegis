import * as React from "react";
import { useState } from "react";
import {
  Card,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  Fade,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Avatar,
  IconButton
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import jsPDF from 'jspdf';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  category: 'executor' | 'alternateExecutor' | 'witness' | 'guardian' | 'beneficiary';
  address?: string;
}

interface Asset {
  id: string;
  name: string;
  value: number;
  type: string;
  status?: 'active' | 'pending' | 'inactive';
}

type WillStep = 0 | 1 | 2 | 3 | 4;

interface WillWizardState {
  step: WillStep;
  contacts: Contact[];
  selectedAssets: string[];
  assetBeneficiaries: {
    [assetId: string]: {
      [beneficiaryId: string]: number;
    }
  };
  roleAssignments: {
    [role: string]: string[];
  };
  slotAssignments: {
    [role: string]: string[];
  };
}

const wizardSteps: string[] = [
  'Contact Book',
  'Assign Roles',
  'Select Assets',
  'Assign Beneficiaries',
  'Review'
];

const assignableRoles = [
  'executor',
  'alternateExecutor',
  'witness',
  'guardian',
  'beneficiary'
];

const gradientBg = 'linear-gradient(120deg,#e3eaf0 60%,#5C7C89 100%)';

const assetTypeToIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'real estate':
      return '🏠';
    case 'vehicle':
      return '🚗';
    case 'bank account':
      return '💰';
    case 'investment':
      return '📈';
    case 'jewelry':
      return '💎';
    default:
      return '📦';
  }
};

const WillPage: React.FC = () => {
  const theme = useTheme();

  // Step 1: Contacts
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  // Store a snapshot of contacts after step 1 for later PDF use
  const [contactsData, setContactsData] = useState<Contact[]>([]);

  const [willWizard, setWillWizard] = useState<WillWizardState>({
    step: 0 as WillStep,
    contacts: [],
    selectedAssets: [],
    assetBeneficiaries: {},
    roleAssignments: {},
    slotAssignments: {}
  });

  const [assets] = useState<Asset[]>([
    { id: '1', name: 'House', value: 500000, type: 'real estate', status: 'active' },
    { id: '2', name: 'Car', value: 25000, type: 'vehicle', status: 'active' },
    { id: '3', name: 'Savings Account', value: 100000, type: 'bank account', status: 'active' },
    { id: '4', name: 'Investment Portfolio', value: 250000, type: 'investment', status: 'active' },
    { id: '5', name: 'Family Heirlooms', value: 75000, type: 'jewelry', status: 'active' }
  ]);

  const beneficiaryIds = willWizard.roleAssignments['beneficiary'] || [];
  const beneficiaries = contactsData.filter(c => beneficiaryIds.includes(c.id));

  // Step 1 handlers
  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    setAllContacts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const handleAddContact = () => {
    setAllContacts(prev => [
      ...prev,
      {
        id: `contact-${prev.length + 1}`,
        name: '',
        relationship: '',
        email: '',
        phone: '',
        category: 'beneficiary',
        address: ''
      }
    ]);
  };
  const handleRemoveContact = (index: number) => {
    setAllContacts(prev => prev.filter((_, idx) => idx !== index));
  };

  // Freeze contacts when leaving step 1
  const goToNextStep = () => {
    if (willWizard.step === 0) setContactsData([...allContacts]);
    setWillWizard(prev => ({
      ...prev,
      step: Math.min(wizardSteps.length - 1, prev.step + 1) as WillStep
    }));
  };

  // Step 2: Assign roles
  const handleRoleAssignmentsChange = (role: string, selected: string[]) => {
    setWillWizard(prev => ({
      ...prev,
      roleAssignments: {
        ...prev.roleAssignments,
        [role]: selected
      },
      slotAssignments: {
        ...prev.slotAssignments,
        [role]: selected
      }
    }));
  };

  // Step 2: Witness validation (AT LEAST 2 witnesses who are not beneficiaries)
  const witnessIds = willWizard.roleAssignments['witness'] || [];
  const witnessesNotBeneficiaries = witnessIds.filter(id => !beneficiaryIds.includes(id));
  const witnessWarning = witnessesNotBeneficiaries.length < 2;

  // Step 3: Asset selection
  const handleSelectAsset = (assetId: string) => {
    setWillWizard(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetId)
        ? prev.selectedAssets.filter(id => id !== assetId)
        : [...prev.selectedAssets, assetId]
    }));
  };

  // Step 4: Asset beneficiary percentages
  const handleAssetBeneficiaryPercent = (
    assetId: string,
    beneficiaryId: string,
    percent: number
  ) => {
    setWillWizard(prev => ({
      ...prev,
      assetBeneficiaries: {
        ...prev.assetBeneficiaries,
        [assetId]: {
          ...prev.assetBeneficiaries[assetId],
          [beneficiaryId]: percent
        }
      }
    }));
  };

  // Validate shares sum to exactly 100% per asset
  const validateAssetShares = () => {
    const errors: { [assetId: string]: boolean } = {};
    willWizard.selectedAssets.forEach(assetId => {
      const shares = Object.values(willWizard.assetBeneficiaries[assetId] || {});
      const sum = shares.reduce((acc, val) => acc + val, 0);
      errors[assetId] = sum !== 100;
    });
    return Object.values(errors).every(v => !v);
  };

  // Only allow Next/Finish if asset shares are valid and witness rule is satisfied
  const handleNextOrFinish = () => {
    if (willWizard.step === 1 && witnessWarning) return;
    if (willWizard.step === 3) {
      if (!validateAssetShares()) return;
      goToNextStep();
    } else if (willWizard.step === wizardSteps.length - 1) {
      handleFinish();
    } else {
      goToNextStep();
    }
  };

  // PDF Generation (Official Indian Will Format)
  const generatePDF = () => {
    const doc = new jsPDF();

    // Use first contact as testator for demo
    const mainTestator = contactsData[0] || { name: "[Your Full Name]", address: "[Your Address]", relationship: "", phone: "", email: "", category: "beneficiary" };
    const TESTATOR_NAME = mainTestator.name || "[Your Full Name]";
    const TESTATOR_AGE = "[Your Age]";
    const TESTATOR_ADDRESS = mainTestator.address || "[Your Address]";
    const WILL_DATE = "[Date]";
    const WILL_PLACE = "[Place]";

    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.text('LAST WILL AND TESTAMENT', 105, 18, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let y = 30;

    // 1. Declaration
    doc.text(
      `I, ${TESTATOR_NAME}, aged ${TESTATOR_AGE} years, residing at ${TESTATOR_ADDRESS}, of sound mind and memory, `,
      14, y
    );
    y += 7;
    doc.text(
      `do hereby declare this to be my last will and testament, executed at ${WILL_PLACE} on this day of ${WILL_DATE}.`,
      14, y
    );
    y += 7;
    doc.text(
      `I revoke all former wills and codicils made by me at any time heretofore. I am making this will voluntarily, without any coercion or undue influence.`,
      14, y
    );

    // 2. Executors
    y += 10;
    const executors = (willWizard.roleAssignments['executor'] || [])
      .map(cid => contactsData.find(c => c.id === cid))
      .filter(Boolean) as Contact[];
    if (executors.length) {
      doc.setFont('times', 'bold');
      doc.text('APPOINTMENT OF EXECUTOR(S):', 14, y);
      y += 6;
      doc.setFont('times', 'normal');
      executors.forEach(e => {
        doc.text(
          `${e.name}${e.address ? ', ' + e.address : ''}`,
          18, y
        );
        y += 6;
      });
    }

    // 3. Alternate Executors
    const altExecutors = (willWizard.roleAssignments['alternateExecutor'] || [])
      .map(cid => contactsData.find(c => c.id === cid))
      .filter(Boolean) as Contact[];
    if (altExecutors.length) {
      doc.setFont('times', 'bold');
      doc.text('ALTERNATE EXECUTOR(S):', 14, y);
      y += 6;
      doc.setFont('times', 'normal');
      altExecutors.forEach(e => {
        doc.text(
          `${e.name}${e.address ? ', ' + e.address : ''}`,
          18, y
        );
        y += 6;
      });
    }

    // 4. Guardian(s)
    const guardians = (willWizard.roleAssignments['guardian'] || [])
      .map(cid => contactsData.find(c => c.id === cid))
      .filter(Boolean) as Contact[];
    if (guardians.length) {
      doc.setFont('times', 'bold');
      doc.text('GUARDIAN(S):', 14, y);
      y += 6;
      doc.setFont('times', 'normal');
      guardians.forEach(g => {
        doc.text(
          `${g.name}${g.address ? ', ' + g.address : ''}`,
          18, y
        );
        y += 6;
      });
    }

    // 5. Bequests/Distribution
    y += 8;
    doc.setFont('times', 'bold');
    doc.text('BEQUESTS AND DISTRIBUTION OF PROPERTY:', 14, y);
    y += 6;
    doc.setFont('times', 'normal');
    willWizard.selectedAssets.forEach(assetId => {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) return;
      doc.text(`${asset.name} (${asset.type}, ₹${asset.value.toLocaleString()}):`, 18, y);
      y += 6;
      const beneficiariesList = (willWizard.roleAssignments['beneficiary'] || [])
        .map(bid => contactsData.find(c => c.id === bid))
        .filter(Boolean) as Contact[];
      beneficiariesList.forEach(b => {
        const pct = willWizard.assetBeneficiaries[asset.id]?.[b.id] || 0;
        if (pct > 0) {
          doc.text(`To ${b.name} - ${pct}%`, 22, y);
          y += 6;
        }
      });
      y += 2;
    });

    // 6. Residual Clause
    y += 6;
    doc.setFont('times', 'bold');
    doc.text('RESIDUARY CLAUSE:', 14, y);
    y += 6;
    doc.setFont('times', 'normal');
    doc.text(
      'I bequeath all the rest, residue and remainder of my estate, of whatsoever nature and wheresoever situated, to my beneficiaries as per proportions mentioned above.',
      18, y, { maxWidth: 170 }
    );
    y += 12;

    // 7. Self-Proving Clause
    doc.setFont('times', 'bold');
    doc.text('SELF-PROVING CLAUSE:', 14, y);
    y += 6;
    doc.setFont('times', 'normal');
    doc.text('I declare that this will was signed by me in the presence of the witnesses named below, who have attested the same in my presence and in the presence of each other.', 18, y, { maxWidth: 170 });
    y += 12;

    // 8. Signature Section
    doc.setFont('times', 'bold');
    doc.text('IN WITNESS WHEREOF', 14, y);
    y += 7;
    doc.setFont('times', 'normal');
    doc.text(
      `I have hereunto set my hand and signature on this day of ${WILL_DATE} at ${WILL_PLACE}.`,
      14, y
    );
    y += 14;
    doc.setFont('times', 'bold');
    doc.text('Signature of Testator:', 14, y);
    doc.setFont('times', 'normal');
    doc.text('_________________________', 70, y);

    y += 17;
    doc.setFont('times', 'bold');
    doc.text('WITNESSES:', 14, y);
    y += 6;
    doc.setFont('times', 'normal');
    const witnesses = (willWizard.roleAssignments['witness'] || [])
      .map(cid => contactsData.find(c => c.id === cid))
      .filter(Boolean) as Contact[];
    witnesses.forEach((w, i) => {
      doc.text(`${i + 1}. ${w.name}${w.address ? ', ' + w.address : ""}`, 18, y);
      y += 6;
      doc.text('   Signature: ____________________', 18, y);
      y += 8;
    });

    // Footer
    y += 7;
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    doc.text(
      'NOTE: As per Indian law, this Will must be signed by the testator and at least two witnesses (who are not beneficiaries). Registration is not mandatory but recommended.',
      14, y, { maxWidth: 180 }
    );

    doc.save('Official-Will-India.pdf');
  };

  const handleFinish = () => {
    generatePDF();
  };

  return (
    <Fade in>
      <Card sx={{ maxWidth: 1060, bgcolor: '#fff', border: '1.5px solid #e9ecef', p: { xs: 2, md: 4 }, mb: 3, position: 'relative', mx: 'auto', boxShadow: '0 8px 36px 0 rgba(54,79,219,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <AssignmentIcon color="primary" sx={{ fontSize: 38 }} />
          <Typography variant="h4" fontWeight={900} letterSpacing="-0.04em">
            Will Creation Wizard
          </Typography>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={(willWizard.step / (wizardSteps.length - 1)) * 100} 
          sx={{ mb: 3, borderRadius: 1 }} 
        />

        <Stepper activeStep={willWizard.step} sx={{ mb: 4 }}>
          {wizardSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 4 }} />

        {/* Step content */}
        <Box sx={{ minHeight: 400 }}>
          {willWizard.step === 0 && (
            <Box>
              <Typography fontWeight={700} variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Contact Book
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Add people who will be involved in your will. You'll assign their roles in the next step.
              </Typography>

              <Table sx={{ mb: 2, background: gradientBg }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Relationship</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allContacts.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={c.name}
                          onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={c.relationship}
                          onChange={(e) => handleContactChange(idx, 'relationship', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={c.email}
                          onChange={(e) => handleContactChange(idx, 'email', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={c.phone}
                          onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={c.address || ""}
                          onChange={(e) => handleContactChange(idx, 'address', e.target.value)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveContact(idx)}
                          disabled={allContacts.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button
                startIcon={<AddCircleIcon />}
                onClick={handleAddContact}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Add Contact
              </Button>
            </Box>
          )}

          {willWizard.step === 1 && (
            <Box>
              <Typography fontWeight={700} variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Assign Roles
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Assign roles to your contacts. Each contact can have multiple roles, and any contact assigned the "beneficiary" role will receive inheritance even if they have other roles.
              </Typography>

              <Table sx={{ mb: 2, background: gradientBg }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Assigned Contacts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignableRoles.map((cat) => (
                    <TableRow key={cat}>
                      <TableCell>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </TableCell>
                      <TableCell>
                        <Select
                          multiple
                          fullWidth
                          value={willWizard.roleAssignments[cat] || []}
                          onChange={(e) => {
                            const selected = e.target.value as string[];
                            handleRoleAssignmentsChange(cat, selected);
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {contactsData
                                .filter(c => selected.includes(c.id))
                                .map(c => (
                                  <Chip key={c.id} label={c.name} />
                                ))}
                            </Box>
                          )}
                        >
                          {contactsData.map(c => (
                            <MenuItem key={c.id} value={c.id}>
                              <Checkbox checked={willWizard.roleAssignments[cat]?.includes(c.id)} />
                              {c.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {willWizard.slotAssignments[cat] && willWizard.slotAssignments[cat].length > 0 && (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {willWizard.slotAssignments[cat].map(cid => {
                              const person = contactsData.find(c => c.id === cid);
                              return person ? <Chip key={cid} label={person.name} /> : null;
                            })}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {witnessWarning && (
                <Typography color="error" sx={{ mt: 2, fontWeight: 700 }}>
                  There must be at least 2 witnesses who are not beneficiaries.
                </Typography>
              )}
            </Box>
          )}

          {willWizard.step === 2 && (
            <Box>
              <Typography fontWeight={700} variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Select Assets
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Select which assets you want to include in your will.
              </Typography>

              <Table sx={{ mb: 2, background: gradientBg }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <Checkbox
                          checked={willWizard.selectedAssets.includes(asset.id)}
                          onChange={() => handleSelectAsset(asset.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {assetTypeToIcon(asset.type)}
                          </Avatar>
                          {asset.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={asset.type}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`₹${asset.value.toLocaleString()}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {willWizard.step === 3 && (
            <Box>
              <Typography fontWeight={700} variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Assign Beneficiaries
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                For each selected asset, specify how it should be distributed among beneficiaries. Beneficiaries are anyone assigned the "beneficiary" role, even if they have other roles.
              </Typography>

              {willWizard.selectedAssets.length === 0 && (
                <Typography color="error">Please select at least one asset first.</Typography>
              )}

              {beneficiaries.length === 0 && (
                <Typography color="error">Please add at least one beneficiary (via the roles step) first.</Typography>
              )}

              {willWizard.selectedAssets.length > 0 && beneficiaries.length > 0 && (
                willWizard.selectedAssets.map(assetId => {
                  const asset = assets.find(a => a.id === assetId);
                  if (!asset) return null;

                  const shares = Object.values(willWizard.assetBeneficiaries[asset.id] || {});
                  const sum = shares.reduce((acc, val) => acc + val, 0);

                  return (
                    <Box key={asset.id} sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, background: gradientBg }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {assetTypeToIcon(asset.type)}
                        </Avatar>
                        <Typography variant="h6">{asset.name}</Typography>
                      </Box>

                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Beneficiary</TableCell>
                            <TableCell>Percentage Share</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {beneficiaries.map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>
                                <Chip label={b.name} />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  InputProps={{
                                    endAdornment: '%',
                                    inputProps: { min: 0, max: 100 }
                                  }}
                                  value={willWizard.assetBeneficiaries[asset.id]?.[b.id] || 0}
                                  onChange={(e) => handleAssetBeneficiaryPercent(
                                    asset.id,
                                    b.id,
                                    Number(e.target.value)
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell>Total</TableCell>
                            <TableCell sx={sum !== 100 ? { color: 'error.main', fontWeight: 700 } : {}}>
                              {sum}%
                              {sum !== 100 && (
                                <Typography component="span" color="error" sx={{ ml: 1, fontSize: 13 }}>
                                  (Total must be exactly 100%)
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  );
                })
              )}
            </Box>
          )}

          {willWizard.step === 4 && (
            <Box>
              <Typography fontWeight={700} variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Review
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Review all details before finalizing your will.
              </Typography>
              <Stack spacing={3}>
                {/* Show only names grouped by role */}
                {assignableRoles.map(role => {
                  const ids = willWizard.roleAssignments[role] || [];
                  if (!ids.length) return null;
                  return (
                    <Box key={role} sx={{ mb: 2 }}>
                      <Typography fontWeight={700} sx={{ mb: 1 }}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}{ids.length > 1 ? "s" : ""}
                      </Typography>
                      {ids.map(cid => {
                        const c = contactsData.find(contact => contact.id === cid);
                        return c ? (
                          <Chip key={cid} label={c.name} sx={{ mr: 1, mb: 1 }} />
                        ) : null;
                      })}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() =>
              setWillWizard(prev => ({
                ...prev,
                step: Math.max(0, prev.step - 1) as WillStep
              }))
            }
            disabled={willWizard.step === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNextOrFinish}
            disabled={
              (willWizard.step === 1 && witnessWarning) ||
              (willWizard.step === 3 &&
                willWizard.selectedAssets.some(assetId => {
                  const shares = Object.values(willWizard.assetBeneficiaries[assetId] || {});
                  return shares.reduce((acc, val) => acc + val, 0) !== 100;
                })
              )
            }
          >
            {willWizard.step === wizardSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Card>
    </Fade>
  );
};

export default WillPage;