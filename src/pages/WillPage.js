import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, Typography, Box, Button, Chip, Divider, LinearProgress, Stack, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableHead, TableRow, useTheme, Fade, TextField, Select, MenuItem, Checkbox, Avatar, IconButton } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import jsPDF from 'jspdf';
const wizardSteps = [
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
const assetTypeToIcon = (type) => {
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
const WillPage = () => {
    const theme = useTheme();
    // Step 1: Contacts
    const [allContacts, setAllContacts] = useState([]);
    // Store a snapshot of contacts after step 1 for later PDF use
    const [contactsData, setContactsData] = useState([]);
    const [willWizard, setWillWizard] = useState({
        step: 0,
        contacts: [],
        selectedAssets: [],
        assetBeneficiaries: {},
        roleAssignments: {},
        slotAssignments: {}
    });
    const [assets] = useState([
        { id: '1', name: 'House', value: 500000, type: 'real estate', status: 'active' },
        { id: '2', name: 'Car', value: 25000, type: 'vehicle', status: 'active' },
        { id: '3', name: 'Savings Account', value: 100000, type: 'bank account', status: 'active' },
        { id: '4', name: 'Investment Portfolio', value: 250000, type: 'investment', status: 'active' },
        { id: '5', name: 'Family Heirlooms', value: 75000, type: 'jewelry', status: 'active' }
    ]);
    const beneficiaryIds = willWizard.roleAssignments['beneficiary'] || [];
    const beneficiaries = contactsData.filter(c => beneficiaryIds.includes(c.id));
    // Step 1 handlers
    const handleContactChange = (index, field, value) => {
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
    const handleRemoveContact = (index) => {
        setAllContacts(prev => prev.filter((_, idx) => idx !== index));
    };
    // Freeze contacts when leaving step 1
    const goToNextStep = () => {
        if (willWizard.step === 0)
            setContactsData([...allContacts]);
        setWillWizard(prev => ({
            ...prev,
            step: Math.min(wizardSteps.length - 1, prev.step + 1)
        }));
    };
    // Step 2: Assign roles
    const handleRoleAssignmentsChange = (role, selected) => {
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
    const handleSelectAsset = (assetId) => {
        setWillWizard(prev => ({
            ...prev,
            selectedAssets: prev.selectedAssets.includes(assetId)
                ? prev.selectedAssets.filter(id => id !== assetId)
                : [...prev.selectedAssets, assetId]
        }));
    };
    // Step 4: Asset beneficiary percentages
    const handleAssetBeneficiaryPercent = (assetId, beneficiaryId, percent) => {
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
        const errors = {};
        willWizard.selectedAssets.forEach(assetId => {
            const shares = Object.values(willWizard.assetBeneficiaries[assetId] || {});
            const sum = shares.reduce((acc, val) => acc + val, 0);
            errors[assetId] = sum !== 100;
        });
        return Object.values(errors).every(v => !v);
    };
    // Only allow Next/Finish if asset shares are valid and witness rule is satisfied
    const handleNextOrFinish = () => {
        if (willWizard.step === 1 && witnessWarning)
            return;
        if (willWizard.step === 3) {
            if (!validateAssetShares())
                return;
            goToNextStep();
        }
        else if (willWizard.step === wizardSteps.length - 1) {
            handleFinish();
        }
        else {
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
        doc.text(`I, ${TESTATOR_NAME}, aged ${TESTATOR_AGE} years, residing at ${TESTATOR_ADDRESS}, of sound mind and memory, `, 14, y);
        y += 7;
        doc.text(`do hereby declare this to be my last will and testament, executed at ${WILL_PLACE} on this day of ${WILL_DATE}.`, 14, y);
        y += 7;
        doc.text(`I revoke all former wills and codicils made by me at any time heretofore. I am making this will voluntarily, without any coercion or undue influence.`, 14, y);
        // 2. Executors
        y += 10;
        const executors = (willWizard.roleAssignments['executor'] || [])
            .map(cid => contactsData.find(c => c.id === cid))
            .filter(Boolean);
        if (executors.length) {
            doc.setFont('times', 'bold');
            doc.text('APPOINTMENT OF EXECUTOR(S):', 14, y);
            y += 6;
            doc.setFont('times', 'normal');
            executors.forEach(e => {
                doc.text(`${e.name}${e.address ? ', ' + e.address : ''}`, 18, y);
                y += 6;
            });
        }
        // 3. Alternate Executors
        const altExecutors = (willWizard.roleAssignments['alternateExecutor'] || [])
            .map(cid => contactsData.find(c => c.id === cid))
            .filter(Boolean);
        if (altExecutors.length) {
            doc.setFont('times', 'bold');
            doc.text('ALTERNATE EXECUTOR(S):', 14, y);
            y += 6;
            doc.setFont('times', 'normal');
            altExecutors.forEach(e => {
                doc.text(`${e.name}${e.address ? ', ' + e.address : ''}`, 18, y);
                y += 6;
            });
        }
        // 4. Guardian(s)
        const guardians = (willWizard.roleAssignments['guardian'] || [])
            .map(cid => contactsData.find(c => c.id === cid))
            .filter(Boolean);
        if (guardians.length) {
            doc.setFont('times', 'bold');
            doc.text('GUARDIAN(S):', 14, y);
            y += 6;
            doc.setFont('times', 'normal');
            guardians.forEach(g => {
                doc.text(`${g.name}${g.address ? ', ' + g.address : ''}`, 18, y);
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
            if (!asset)
                return;
            doc.text(`${asset.name} (${asset.type}, ₹${asset.value.toLocaleString()}):`, 18, y);
            y += 6;
            const beneficiariesList = (willWizard.roleAssignments['beneficiary'] || [])
                .map(bid => contactsData.find(c => c.id === bid))
                .filter(Boolean);
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
        doc.text('I bequeath all the rest, residue and remainder of my estate, of whatsoever nature and wheresoever situated, to my beneficiaries as per proportions mentioned above.', 18, y, { maxWidth: 170 });
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
        doc.text(`I have hereunto set my hand and signature on this day of ${WILL_DATE} at ${WILL_PLACE}.`, 14, y);
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
            .filter(Boolean);
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
        doc.text('NOTE: As per Indian law, this Will must be signed by the testator and at least two witnesses (who are not beneficiaries). Registration is not mandatory but recommended.', 14, y, { maxWidth: 180 });
        doc.save('Official-Will-India.pdf');
    };
    const handleFinish = () => {
        generatePDF();
    };
    return (_jsx(Fade, { in: true, children: _jsxs(Card, { sx: { maxWidth: 1060, bgcolor: '#fff', border: '1.5px solid #e9ecef', p: { xs: 2, md: 4 }, mb: 3, position: 'relative', mx: 'auto', boxShadow: '0 8px 36px 0 rgba(54,79,219,0.06)' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 }, children: [_jsx(AssignmentIcon, { color: "primary", sx: { fontSize: 38 } }), _jsx(Typography, { variant: "h4", fontWeight: 900, letterSpacing: "-0.04em", children: "Will Creation Wizard" })] }), _jsx(LinearProgress, { variant: "determinate", value: (willWizard.step / (wizardSteps.length - 1)) * 100, sx: { mb: 3, borderRadius: 1 } }), _jsx(Stepper, { activeStep: willWizard.step, sx: { mb: 4 }, children: wizardSteps.map((step, index) => (_jsx(Step, { children: _jsx(StepLabel, { children: step }) }, index))) }), _jsx(Divider, { sx: { mb: 4 } }), _jsxs(Box, { sx: { minHeight: 400 }, children: [willWizard.step === 0 && (_jsxs(Box, { children: [_jsx(Typography, { fontWeight: 700, variant: "h5", sx: { mb: 2, color: theme.palette.primary.main }, children: "Contact Book" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Add people who will be involved in your will. You'll assign their roles in the next step." }), _jsxs(Table, { sx: { mb: 2, background: gradientBg }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Relationship" }), _jsx(TableCell, { children: "Email" }), _jsx(TableCell, { children: "Phone" }), _jsx(TableCell, { children: "Address" }), _jsx(TableCell, { align: "right", children: "Actions" })] }) }), _jsx(TableBody, { children: allContacts.map((c, idx) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(TextField, { fullWidth: true, size: "small", value: c.name, onChange: (e) => handleContactChange(idx, 'name', e.target.value) }) }), _jsx(TableCell, { children: _jsx(TextField, { fullWidth: true, size: "small", value: c.relationship, onChange: (e) => handleContactChange(idx, 'relationship', e.target.value) }) }), _jsx(TableCell, { children: _jsx(TextField, { fullWidth: true, size: "small", value: c.email, onChange: (e) => handleContactChange(idx, 'email', e.target.value) }) }), _jsx(TableCell, { children: _jsx(TextField, { fullWidth: true, size: "small", value: c.phone, onChange: (e) => handleContactChange(idx, 'phone', e.target.value) }) }), _jsx(TableCell, { children: _jsx(TextField, { fullWidth: true, size: "small", value: c.address || "", onChange: (e) => handleContactChange(idx, 'address', e.target.value) }) }), _jsx(TableCell, { align: "right", children: _jsx(IconButton, { color: "error", onClick: () => handleRemoveContact(idx), disabled: allContacts.length <= 1, children: _jsx(DeleteIcon, {}) }) })] }, idx))) })] }), _jsx(Button, { startIcon: _jsx(AddCircleIcon, {}), onClick: handleAddContact, variant: "outlined", sx: { mb: 2 }, children: "Add Contact" })] })), willWizard.step === 1 && (_jsxs(Box, { children: [_jsx(Typography, { fontWeight: 700, variant: "h5", sx: { mb: 2, color: theme.palette.primary.main }, children: "Assign Roles" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Assign roles to your contacts. Each contact can have multiple roles, and any contact assigned the \"beneficiary\" role will receive inheritance even if they have other roles." }), _jsxs(Table, { sx: { mb: 2, background: gradientBg }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Role" }), _jsx(TableCell, { children: "Assigned Contacts" })] }) }), _jsx(TableBody, { children: assignableRoles.map((cat) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: cat.charAt(0).toUpperCase() + cat.slice(1) }), _jsxs(TableCell, { children: [_jsx(Select, { multiple: true, fullWidth: true, value: willWizard.roleAssignments[cat] || [], onChange: (e) => {
                                                                    const selected = e.target.value;
                                                                    handleRoleAssignmentsChange(cat, selected);
                                                                }, renderValue: (selected) => (_jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: contactsData
                                                                        .filter(c => selected.includes(c.id))
                                                                        .map(c => (_jsx(Chip, { label: c.name }, c.id))) })), children: contactsData.map(c => (_jsxs(MenuItem, { value: c.id, children: [_jsx(Checkbox, { checked: willWizard.roleAssignments[cat]?.includes(c.id) }), c.name] }, c.id))) }), willWizard.slotAssignments[cat] && willWizard.slotAssignments[cat].length > 0 && (_jsx(Box, { sx: { mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: willWizard.slotAssignments[cat].map(cid => {
                                                                    const person = contactsData.find(c => c.id === cid);
                                                                    return person ? _jsx(Chip, { label: person.name }, cid) : null;
                                                                }) }))] })] }, cat))) })] }), witnessWarning && (_jsx(Typography, { color: "error", sx: { mt: 2, fontWeight: 700 }, children: "There must be at least 2 witnesses who are not beneficiaries." }))] })), willWizard.step === 2 && (_jsxs(Box, { children: [_jsx(Typography, { fontWeight: 700, variant: "h5", sx: { mb: 2, color: theme.palette.primary.main }, children: "Select Assets" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Select which assets you want to include in your will." }), _jsxs(Table, { sx: { mb: 2, background: gradientBg }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { padding: "checkbox" }), _jsx(TableCell, { children: "Asset" }), _jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Value" })] }) }), _jsx(TableBody, { children: assets.map((asset) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Checkbox, { checked: willWizard.selectedAssets.includes(asset.id), onChange: () => handleSelectAsset(asset.id) }) }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx(Avatar, { sx: { bgcolor: 'primary.light' }, children: assetTypeToIcon(asset.type) }), asset.name] }) }), _jsx(TableCell, { children: _jsx(Chip, { label: asset.type, size: "small", sx: { textTransform: 'capitalize' } }) }), _jsx(TableCell, { children: _jsx(Chip, { label: `₹${asset.value.toLocaleString()}`, size: "small", color: "primary", variant: "outlined" }) })] }, asset.id))) })] })] })), willWizard.step === 3 && (_jsxs(Box, { children: [_jsx(Typography, { fontWeight: 700, variant: "h5", sx: { mb: 2, color: theme.palette.primary.main }, children: "Assign Beneficiaries" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "For each selected asset, specify how it should be distributed among beneficiaries. Beneficiaries are anyone assigned the \"beneficiary\" role, even if they have other roles." }), willWizard.selectedAssets.length === 0 && (_jsx(Typography, { color: "error", children: "Please select at least one asset first." })), beneficiaries.length === 0 && (_jsx(Typography, { color: "error", children: "Please add at least one beneficiary (via the roles step) first." })), willWizard.selectedAssets.length > 0 && beneficiaries.length > 0 && (willWizard.selectedAssets.map(assetId => {
                                    const asset = assets.find(a => a.id === assetId);
                                    if (!asset)
                                        return null;
                                    const shares = Object.values(willWizard.assetBeneficiaries[asset.id] || {});
                                    const sum = shares.reduce((acc, val) => acc + val, 0);
                                    return (_jsxs(Box, { sx: { mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, background: gradientBg }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, mb: 3 }, children: [_jsx(Avatar, { sx: { bgcolor: 'primary.light' }, children: assetTypeToIcon(asset.type) }), _jsx(Typography, { variant: "h6", children: asset.name })] }), _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Beneficiary" }), _jsx(TableCell, { children: "Percentage Share" })] }) }), _jsxs(TableBody, { children: [beneficiaries.map((b) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Chip, { label: b.name }) }), _jsx(TableCell, { children: _jsx(TextField, { type: "number", size: "small", InputProps: {
                                                                                endAdornment: '%',
                                                                                inputProps: { min: 0, max: 100 }
                                                                            }, value: willWizard.assetBeneficiaries[asset.id]?.[b.id] || 0, onChange: (e) => handleAssetBeneficiaryPercent(asset.id, b.id, Number(e.target.value)) }) })] }, b.id))), _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Total" }), _jsxs(TableCell, { sx: sum !== 100 ? { color: 'error.main', fontWeight: 700 } : {}, children: [sum, "%", sum !== 100 && (_jsx(Typography, { component: "span", color: "error", sx: { ml: 1, fontSize: 13 }, children: "(Total must be exactly 100%)" }))] })] })] })] })] }, asset.id));
                                }))] })), willWizard.step === 4 && (_jsxs(Box, { children: [_jsx(Typography, { fontWeight: 700, variant: "h5", sx: { mb: 2, color: theme.palette.primary.main }, children: "Review" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 3 }, children: "Review all details before finalizing your will." }), _jsx(Stack, { spacing: 3, children: assignableRoles.map(role => {
                                        const ids = willWizard.roleAssignments[role] || [];
                                        if (!ids.length)
                                            return null;
                                        return (_jsxs(Box, { sx: { mb: 2 }, children: [_jsxs(Typography, { fontWeight: 700, sx: { mb: 1 }, children: [role.charAt(0).toUpperCase() + role.slice(1), ids.length > 1 ? "s" : ""] }), ids.map(cid => {
                                                    const c = contactsData.find(contact => contact.id === cid);
                                                    return c ? (_jsx(Chip, { label: c.name, sx: { mr: 1, mb: 1 } }, cid)) : null;
                                                })] }, role));
                                    }) })] }))] }), _jsx(Divider, { sx: { my: 4 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Button, { variant: "outlined", onClick: () => setWillWizard(prev => ({
                                ...prev,
                                step: Math.max(0, prev.step - 1)
                            })), disabled: willWizard.step === 0, children: "Previous" }), _jsx(Button, { variant: "contained", onClick: handleNextOrFinish, disabled: (willWizard.step === 1 && witnessWarning) ||
                                (willWizard.step === 3 &&
                                    willWizard.selectedAssets.some(assetId => {
                                        const shares = Object.values(willWizard.assetBeneficiaries[assetId] || {});
                                        return shares.reduce((acc, val) => acc + val, 0) !== 100;
                                    })), children: willWizard.step === wizardSteps.length - 1 ? 'Finish' : 'Next' })] })] }) }));
};
export default WillPage;
