import { useState } from "react";
import {
  Box, Typography, Card, Button, Avatar, Chip, Table, TableBody,
  TableCell, TableHead, TableRow, IconButton, Divider, Stack, Tooltip, Select, MenuItem, TextField
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArticleIcon from '@mui/icons-material/Article';

interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'property' | 'bank' | 'vehicle' | 'other';
  status: 'active' | 'inactive' | 'pending';
}

const defaultAssets: Asset[] = [
  { id: '1', name: 'Home', value: 350000, type: 'property', status: 'active' },
  { id: '2', name: 'Savings Account', value: 50000, type: 'bank', status: 'active' },
  { id: '3', name: 'Car', value: 20000, type: 'vehicle', status: 'active' },
];

const assetTypeToIcon = (type: Asset['type']) => {
  if (type === 'property') return '🏠';
  if (type === 'bank') return '💳';
  if (type === 'vehicle') return '🚗';
  return '💼';
};

interface Liability {
  id: string;
  name: string;
  value: number;
  type: 'contingent' | 'current' | 'long-term';
  status: 'active' | 'inactive' | 'pending';
}

const defaultLiabilities: Liability[] = [
  { id: '1', name: 'Credit Card Debt', value: 2000, type: 'current', status: 'active' },
  { id: '2', name: 'Mortgage', value: 50000, type: 'long-term', status: 'active' },
  { id: '3', name: 'Car Loan', value: 10000, type: 'contingent', status: 'active' },
];

const liabilityTypeToIcon = (type: Liability['type']) => {
  if (type === 'contingent') return '🤔';
  if (type === 'current') return '⏱️';
  if (type === 'long-term') return '📉';
  return '😢';
};

const gradientBg = 'linear-gradient(120deg,#e3eaf0 60%,#5C7C89 100%)';

export default function HoldingsPage() {
  const [assets, setAssets] = useState(defaultAssets);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [removeAssetId, setRemoveAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState<{
    name: string;
    value: number;
    type: Asset['type'];
    status: Asset['status'];
  }>({ name: "", value: 0, type: "property", status: "active" });

  const [liabilities, setLiabilities] = useState(defaultLiabilities);
  const [liabilityDialogOpen, setLiabilityDialogOpen] = useState(false);
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);
  const [removeLiabilityId, setRemoveLiabilityId] = useState<string | null>(null);
  const [liabilityForm, setLiabilityForm] = useState<{
    name: string;
    value: number;
    type: Liability['type'];
    status: Liability['status'];
  }>({ name: "", value: 0, type: "contingent", status: "active" });

  const handleAssetFormChange = (field: keyof typeof assetForm, value: string | number) => setAssetForm(prev => ({ ...prev, [field]: value }));
  const handleLiabilityFormChange = (field: keyof typeof liabilityForm, value: string | number) => setLiabilityForm(prev => ({ ...prev, [field]: value }));

  const handleSaveAsset = () => {
    if (!assetForm.name || !assetForm.type || !assetForm.value) return;
    if (editingAsset) {
      setAssets(prevAssets => prevAssets.map(a =>
        a.id === editingAsset.id
          ? { ...editingAsset, ...assetForm, value: Number(assetForm.value) }
          : a
      ));
    } else {
      setAssets(prevAssets => [
        ...prevAssets,
        {
          id: `${Date.now()}`,
          name: assetForm.name,
          value: Number(assetForm.value),
          type: assetForm.type,
          status: assetForm.status || "active"
        }
      ]);
    }
    setAssetDialogOpen(false);
    setEditingAsset(null);
    setAssetForm({ name: "", value: 0, type: "property", status: "active" });
  };
  
  const handleSaveLiability = () => {
    if (!liabilityForm.name || !liabilityForm.type || !liabilityForm.value) return;
    if (editingLiability) {
      setLiabilities(prevLiabilities => prevLiabilities.map(l =>
        l.id === editingLiability.id
          ? { ...editingLiability, ...liabilityForm, value: Number(liabilityForm.value) }
          : l
      ));
    } else {
      setLiabilities(prevLiabilities => [
        ...prevLiabilities,
        {
          id: `${Date.now()}`,
          name: liabilityForm.name,
          value: Number(liabilityForm.value),
          type: liabilityForm.type,
          status: liabilityForm.status || "active"
        }
      ]);
    }
    setLiabilityDialogOpen(false);
    setEditingLiability(null);
    setLiabilityForm({ name: "", value: 0, type: "contingent", status: "active" });
  };

  const handleRemoveAsset = () => {
    if (removeAssetId) {
      setAssets(prev => prev.filter(a => a.id !== removeAssetId));
      setRemoveAssetId(null);
    }
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setAssetForm(asset);
    setAssetDialogOpen(true);
  };

  const handleEditLiability = (liability: Liability) => {
    setEditingLiability(liability);
    setLiabilityForm(liability);
    setLiabilityDialogOpen(true);
  };

  const handleRemoveLiability = () => {
    if (removeLiabilityId) {
      setLiabilities(prev => prev.filter(l => l.id !== removeLiabilityId));
      setRemoveLiabilityId(null);
    }
  };

  // Spacing/gap style for popups
  const popupCardSx = {
    minWidth: 320,
    maxWidth: 400,
    p: 3,
    borderRadius: 3,
    boxShadow: 6,
    display: 'flex',
    flexDirection: 'column',
    gap: 2 // add consistent gap between fields
  } as const;

  return (
    <Card sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 5, background: "#FFFFFF", border: "1px solid #5C7C89" }}>
      {/* Holdings Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MonetizationOnIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight={800}>Your Assets</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setEditingAsset(null);
            setAssetForm({ name: "", value: 0, type: "property", status: "active" });
            setAssetDialogOpen(true);
          }}
        >
          Add Holding
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ background: gradientBg, borderRadius: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map(asset => (
            <TableRow key={asset.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar alt={asset.name} sx={{ width: 28, height: 28, bgcolor: '#e7f5ff', color: '#1971c2', fontWeight: 700, fontSize: 16 }}>
                    {assetTypeToIcon(asset.type)}
                  </Avatar>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{asset.name}</span>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={asset.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  sx={{ fontWeight: 700, bgcolor: '#edf2ff' }}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                  size="small"
                  variant="filled"
                  sx={{
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor:
                      asset.type === "property"
                        ? "#3b5bdb"
                        : asset.type === "bank"
                        ? "#228be6"
                        : asset.type === "vehicle"
                        ? "#51cf66"
                        : "#fab005"
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={asset.status || 'Active'}
                  color={asset.status === 'active' ? 'success' : asset.status === 'pending' ? 'warning' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Edit Holding">
                    <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                      <ArticleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove Holding">
                    <IconButton
                      size="small"
                      onClick={() => setRemoveAssetId(asset.id)}
                    >
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Asset Add/Edit Dialog */}
      {assetDialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setAssetDialogOpen(false)}
        >
          <Card
            sx={popupCardSx}
            onClick={e => e.stopPropagation()}
          >
            <Typography variant="h6" fontWeight={800}>
              {editingAsset ? "Update Holding" : "Add Holding"}
            </Typography>
            <TextField
              label="Holding Name"
              fullWidth
              margin="dense"
              value={assetForm.name}
              onChange={e => handleAssetFormChange('name', e.target.value)}
            />
            <TextField
              label="Value"
              type="number"
              fullWidth
              margin="dense"
              value={assetForm.value}
              onChange={e => handleAssetFormChange('value', Number(e.target.value))}
            />
            <Select
              fullWidth
              margin="dense"
              value={assetForm.type}
              onChange={e => handleAssetFormChange('type', e.target.value)}
              MenuProps={{
                disablePortal: true,
                PaperProps: { sx: { zIndex: 10000 } }
              }}
            >
              <MenuItem value="property">Property</MenuItem>
              <MenuItem value="bank">Bank</MenuItem>
              <MenuItem value="vehicle">Vehicle</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <Select
              fullWidth
              margin="dense"
              value={assetForm.status}
              onChange={e => handleAssetFormChange('status', e.target.value)}
              MenuProps={{
                disablePortal: true,
                PaperProps: { sx: { zIndex: 10000 } }
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                onClick={handleSaveAsset}
                variant="contained"
                color="primary"
                fullWidth
              >
                {editingAsset ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => setAssetDialogOpen(false)}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Card>
        </Box>
      )}
      {/* Remove Asset Confirm Dialog */}
      {removeAssetId && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setRemoveAssetId(null)}
        >
          <Card
            sx={{ ...popupCardSx, minWidth: 300, maxWidth: 350 }}
            onClick={e => e.stopPropagation()}
          >
            <Typography variant="h6">
              Remove Holding
            </Typography>
            <Typography>
              Are you sure you want to remove this holding?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleRemoveAsset}
                variant="contained"
                color="error"
                fullWidth
              >
                Remove
              </Button>
              <Button
                onClick={() => setRemoveAssetId(null)}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Card>
        </Box>
      )}

      {/* Liabilities Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 6, mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MonetizationOnIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h5" fontWeight={800}>Your Liabilities</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setEditingLiability(null);
            setLiabilityForm({ name: "", value: 0, type: "contingent", status: "active" });
            setLiabilityDialogOpen(true);
          }}
        >
          Add Liability
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Table size="small" sx={{ background: gradientBg, borderRadius: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {liabilities.map(liability => (
            <TableRow key={liability.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar alt={liability.name} sx={{ width: 28, height: 28, bgcolor: '#e7f5ff', color: '#1971c2', fontWeight: 700, fontSize: 16 }}>
                    {liabilityTypeToIcon(liability.type)}
                  </Avatar>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{liability.name}</span>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={liability.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  sx={{ fontWeight: 700, bgcolor: '#edf2ff' }}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={liability.type.charAt(0).toUpperCase() + liability.type.slice(1)}
                  size="small"
                  variant="filled"
                  sx={{
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor:
                      liability.type === "current"
                        ? "#3b5bdb"
                        : liability.type === "long-term"
                        ? "#228be6"
                        : liability.type === "contingent"
                        ? "#51cf66"
                        : "#fab005"
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={liability.status || 'Active'}
                  color={liability.status === 'active' ? 'success' : liability.status === 'pending' ? 'warning' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Edit Liability">
                    <IconButton size="small" onClick={() => handleEditLiability(liability)}>
                      <ArticleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove Liability">
                    <IconButton
                      size="small"
                      onClick={() => setRemoveLiabilityId(liability.id)}
                    >
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Liability Add/Edit Dialog */}
      {liabilityDialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setLiabilityDialogOpen(false)}
        >
          <Card
            sx={popupCardSx}
            onClick={e => e.stopPropagation()}
          >
            <Typography variant="h6" fontWeight={800}>
              {editingLiability ? "Update Liability" : "Add Liability"}
            </Typography>
            <TextField
              label="Liability Name"
              fullWidth
              margin="dense"
              value={liabilityForm.name}
              onChange={e => handleLiabilityFormChange('name', e.target.value)}
            />
            <TextField
              label="Value"
              type="number"
              fullWidth
              margin="dense"
              value={liabilityForm.value}
              onChange={e => handleLiabilityFormChange('value', Number(e.target.value))}
            />
            <Select
              fullWidth
              margin="dense"
              value={liabilityForm.type}
              onChange={e => handleLiabilityFormChange('type', e.target.value)}
              MenuProps={{
                disablePortal: true,
                PaperProps: { sx: { zIndex: 10000 } }
              }}
            >
              <MenuItem value="current">Current</MenuItem>
              <MenuItem value="long-term">Long-term</MenuItem>
              <MenuItem value="contingent">Contingent</MenuItem>
            </Select>
            <Select
              fullWidth
              margin="dense"
              value={liabilityForm.status}
              onChange={e => handleLiabilityFormChange('status', e.target.value)}
              MenuProps={{
                disablePortal: true,
                PaperProps: { sx: { zIndex: 10000 } }
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                onClick={handleSaveLiability}
                variant="contained"
                color="primary"
                fullWidth
              >
                {editingLiability ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => setLiabilityDialogOpen(false)}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Card>
        </Box>
      )}
      {/* Remove Liability Confirm Dialog */}
      {removeLiabilityId && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setRemoveLiabilityId(null)}
        >
          <Card
            sx={{ ...popupCardSx, minWidth: 300, maxWidth: 350 }}
            onClick={e => e.stopPropagation()}
          >
            <Typography variant="h6">
              Remove Liability
            </Typography>
            <Typography>
              Are you sure you want to remove this liability?
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleRemoveLiability}
                variant="contained"
                color="error"
                fullWidth
              >
                Remove
              </Button>
              <Button
                onClick={() => setRemoveLiabilityId(null)}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Card>
        </Box>
      )}
    </Card>
  );
}