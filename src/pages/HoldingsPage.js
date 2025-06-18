import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Typography, Card, Button, Avatar, Chip, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Divider, Stack, Tooltip, Select, MenuItem, TextField } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArticleIcon from '@mui/icons-material/Article';
const defaultAssets = [
    { id: '1', name: 'Home', value: 350000, type: 'property', status: 'active' },
    { id: '2', name: 'Savings Account', value: 50000, type: 'bank', status: 'active' },
    { id: '3', name: 'Car', value: 20000, type: 'vehicle', status: 'active' },
];
const assetTypeToIcon = (type) => {
    if (type === 'property')
        return '🏠';
    if (type === 'bank')
        return '💳';
    if (type === 'vehicle')
        return '🚗';
    return '💼';
};
const defaultLiabilities = [
    { id: '1', name: 'Credit Card Debt', value: 2000, type: 'current', status: 'active' },
    { id: '2', name: 'Mortgage', value: 50000, type: 'long-term', status: 'active' },
    { id: '3', name: 'Car Loan', value: 10000, type: 'contingent', status: 'active' },
];
const liabilityTypeToIcon = (type) => {
    if (type === 'contingent')
        return '🤔';
    if (type === 'current')
        return '⏱️';
    if (type === 'long-term')
        return '📉';
    return '😢';
};
const gradientBg = 'linear-gradient(120deg,#e3eaf0 60%,#5C7C89 100%)';
export default function HoldingsPage() {
    const [assets, setAssets] = useState(defaultAssets);
    const [assetDialogOpen, setAssetDialogOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [removeAssetId, setRemoveAssetId] = useState(null);
    const [assetForm, setAssetForm] = useState({ name: "", value: 0, type: "property", status: "active" });
    const [liabilities, setLiabilities] = useState(defaultLiabilities);
    const [liabilityDialogOpen, setLiabilityDialogOpen] = useState(false);
    const [editingLiability, setEditingLiability] = useState(null);
    const [removeLiabilityId, setRemoveLiabilityId] = useState(null);
    const [liabilityForm, setLiabilityForm] = useState({ name: "", value: 0, type: "contingent", status: "active" });
    const handleAssetFormChange = (field, value) => setAssetForm(prev => ({ ...prev, [field]: value }));
    const handleLiabilityFormChange = (field, value) => setLiabilityForm(prev => ({ ...prev, [field]: value }));
    const handleSaveAsset = () => {
        if (!assetForm.name || !assetForm.type || !assetForm.value)
            return;
        if (editingAsset) {
            setAssets(prevAssets => prevAssets.map(a => a.id === editingAsset.id
                ? { ...editingAsset, ...assetForm, value: Number(assetForm.value) }
                : a));
        }
        else {
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
        if (!liabilityForm.name || !liabilityForm.type || !liabilityForm.value)
            return;
        if (editingLiability) {
            setLiabilities(prevLiabilities => prevLiabilities.map(l => l.id === editingLiability.id
                ? { ...editingLiability, ...liabilityForm, value: Number(liabilityForm.value) }
                : l));
        }
        else {
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
    const handleEditAsset = (asset) => {
        setEditingAsset(asset);
        setAssetForm(asset);
        setAssetDialogOpen(true);
    };
    const handleEditLiability = (liability) => {
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
    };
    return (_jsxs(Card, { sx: { p: { xs: 2, md: 4 }, mb: 3, borderRadius: 5, background: "#FFFFFF", border: "1px solid #5C7C89" }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(MonetizationOnIcon, { color: "primary", sx: { fontSize: 32, mr: 1 } }), _jsx(Typography, { variant: "h5", fontWeight: 800, children: "Your Assets" })] }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddCircleIcon, {}), onClick: () => {
                            setEditingAsset(null);
                            setAssetForm({ name: "", value: 0, type: "property", status: "active" });
                            setAssetDialogOpen(true);
                        }, children: "Add Holding" })] }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Table, { size: "small", sx: { background: gradientBg, borderRadius: 3 }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Value" }), _jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: assets.map(asset => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Avatar, { alt: asset.name, sx: { width: 28, height: 28, bgcolor: '#e7f5ff', color: '#1971c2', fontWeight: 700, fontSize: 16 }, children: assetTypeToIcon(asset.type) }), _jsx("span", { style: { fontWeight: 700, fontSize: 16 }, children: asset.name })] }) }), _jsx(TableCell, { children: _jsx(Chip, { label: asset.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), sx: { fontWeight: 700, bgcolor: '#edf2ff' }, color: "primary", variant: "outlined", size: "small" }) }), _jsx(TableCell, { children: _jsx(Chip, { label: asset.type.charAt(0).toUpperCase() + asset.type.slice(1), size: "small", variant: "filled", sx: {
                                            fontWeight: 700,
                                            color: "#fff",
                                            backgroundColor: asset.type === "property"
                                                ? "#3b5bdb"
                                                : asset.type === "bank"
                                                    ? "#228be6"
                                                    : asset.type === "vehicle"
                                                        ? "#51cf66"
                                                        : "#fab005"
                                        } }) }), _jsx(TableCell, { children: _jsx(Chip, { label: asset.status || 'Active', color: asset.status === 'active' ? 'success' : asset.status === 'pending' ? 'warning' : 'default', size: "small", sx: { fontWeight: 700 } }) }), _jsx(TableCell, { align: "center", children: _jsxs(Stack, { direction: "row", spacing: 1, justifyContent: "center", children: [_jsx(Tooltip, { title: "Edit Holding", children: _jsx(IconButton, { size: "small", onClick: () => handleEditAsset(asset), children: _jsx(ArticleIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Remove Holding", children: _jsx(IconButton, { size: "small", onClick: () => setRemoveAssetId(asset.id), children: _jsx(DeleteIcon, { color: "error", fontSize: "small" }) }) })] }) })] }, asset.id))) })] }), assetDialogOpen && (_jsx(Box, { sx: {
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
                }, onClick: () => setAssetDialogOpen(false), children: _jsxs(Card, { sx: popupCardSx, onClick: e => e.stopPropagation(), children: [_jsx(Typography, { variant: "h6", fontWeight: 800, children: editingAsset ? "Update Holding" : "Add Holding" }), _jsx(TextField, { label: "Holding Name", fullWidth: true, margin: "dense", value: assetForm.name, onChange: e => handleAssetFormChange('name', e.target.value) }), _jsx(TextField, { label: "Value", type: "number", fullWidth: true, margin: "dense", value: assetForm.value, onChange: e => handleAssetFormChange('value', Number(e.target.value)) }), _jsxs(Select, { fullWidth: true, margin: "dense", value: assetForm.type, onChange: e => handleAssetFormChange('type', e.target.value), MenuProps: {
                                disablePortal: true,
                                PaperProps: { sx: { zIndex: 10000 } }
                            }, children: [_jsx(MenuItem, { value: "property", children: "Property" }), _jsx(MenuItem, { value: "bank", children: "Bank" }), _jsx(MenuItem, { value: "vehicle", children: "Vehicle" }), _jsx(MenuItem, { value: "other", children: "Other" })] }), _jsxs(Select, { fullWidth: true, margin: "dense", value: assetForm.status, onChange: e => handleAssetFormChange('status', e.target.value), MenuProps: {
                                disablePortal: true,
                                PaperProps: { sx: { zIndex: 10000 } }
                            }, children: [_jsx(MenuItem, { value: "active", children: "Active" }), _jsx(MenuItem, { value: "pending", children: "Pending" }), _jsx(MenuItem, { value: "inactive", children: "Inactive" })] }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mt: 1 }, children: [_jsx(Button, { onClick: handleSaveAsset, variant: "contained", color: "primary", fullWidth: true, children: editingAsset ? "Update" : "Add" }), _jsx(Button, { onClick: () => setAssetDialogOpen(false), variant: "outlined", fullWidth: true, children: "Cancel" })] })] }) })), removeAssetId && (_jsx(Box, { sx: {
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
                }, onClick: () => setRemoveAssetId(null), children: _jsxs(Card, { sx: { ...popupCardSx, minWidth: 300, maxWidth: 350 }, onClick: e => e.stopPropagation(), children: [_jsx(Typography, { variant: "h6", children: "Remove Holding" }), _jsx(Typography, { children: "Are you sure you want to remove this holding?" }), _jsxs(Stack, { direction: "row", spacing: 2, children: [_jsx(Button, { onClick: handleRemoveAsset, variant: "contained", color: "error", fullWidth: true, children: "Remove" }), _jsx(Button, { onClick: () => setRemoveAssetId(null), variant: "outlined", fullWidth: true, children: "Cancel" })] })] }) })), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mt: 6, mb: 2, justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(MonetizationOnIcon, { color: "primary", sx: { fontSize: 32, mr: 1 } }), _jsx(Typography, { variant: "h5", fontWeight: 800, children: "Your Liabilities" })] }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddCircleIcon, {}), onClick: () => {
                            setEditingLiability(null);
                            setLiabilityForm({ name: "", value: 0, type: "contingent", status: "active" });
                            setLiabilityDialogOpen(true);
                        }, children: "Add Liability" })] }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Table, { size: "small", sx: { background: gradientBg, borderRadius: 3 }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Value" }), _jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: liabilities.map(liability => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Avatar, { alt: liability.name, sx: { width: 28, height: 28, bgcolor: '#e7f5ff', color: '#1971c2', fontWeight: 700, fontSize: 16 }, children: liabilityTypeToIcon(liability.type) }), _jsx("span", { style: { fontWeight: 700, fontSize: 16 }, children: liability.name })] }) }), _jsx(TableCell, { children: _jsx(Chip, { label: liability.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), sx: { fontWeight: 700, bgcolor: '#edf2ff' }, color: "primary", variant: "outlined", size: "small" }) }), _jsx(TableCell, { children: _jsx(Chip, { label: liability.type.charAt(0).toUpperCase() + liability.type.slice(1), size: "small", variant: "filled", sx: {
                                            fontWeight: 700,
                                            color: "#fff",
                                            backgroundColor: liability.type === "current"
                                                ? "#3b5bdb"
                                                : liability.type === "long-term"
                                                    ? "#228be6"
                                                    : liability.type === "contingent"
                                                        ? "#51cf66"
                                                        : "#fab005"
                                        } }) }), _jsx(TableCell, { children: _jsx(Chip, { label: liability.status || 'Active', color: liability.status === 'active' ? 'success' : liability.status === 'pending' ? 'warning' : 'default', size: "small", sx: { fontWeight: 700 } }) }), _jsx(TableCell, { align: "center", children: _jsxs(Stack, { direction: "row", spacing: 1, justifyContent: "center", children: [_jsx(Tooltip, { title: "Edit Liability", children: _jsx(IconButton, { size: "small", onClick: () => handleEditLiability(liability), children: _jsx(ArticleIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Remove Liability", children: _jsx(IconButton, { size: "small", onClick: () => setRemoveLiabilityId(liability.id), children: _jsx(DeleteIcon, { color: "error", fontSize: "small" }) }) })] }) })] }, liability.id))) })] }), liabilityDialogOpen && (_jsx(Box, { sx: {
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
                }, onClick: () => setLiabilityDialogOpen(false), children: _jsxs(Card, { sx: popupCardSx, onClick: e => e.stopPropagation(), children: [_jsx(Typography, { variant: "h6", fontWeight: 800, children: editingLiability ? "Update Liability" : "Add Liability" }), _jsx(TextField, { label: "Liability Name", fullWidth: true, margin: "dense", value: liabilityForm.name, onChange: e => handleLiabilityFormChange('name', e.target.value) }), _jsx(TextField, { label: "Value", type: "number", fullWidth: true, margin: "dense", value: liabilityForm.value, onChange: e => handleLiabilityFormChange('value', Number(e.target.value)) }), _jsxs(Select, { fullWidth: true, margin: "dense", value: liabilityForm.type, onChange: e => handleLiabilityFormChange('type', e.target.value), MenuProps: {
                                disablePortal: true,
                                PaperProps: { sx: { zIndex: 10000 } }
                            }, children: [_jsx(MenuItem, { value: "current", children: "Current" }), _jsx(MenuItem, { value: "long-term", children: "Long-term" }), _jsx(MenuItem, { value: "contingent", children: "Contingent" })] }), _jsxs(Select, { fullWidth: true, margin: "dense", value: liabilityForm.status, onChange: e => handleLiabilityFormChange('status', e.target.value), MenuProps: {
                                disablePortal: true,
                                PaperProps: { sx: { zIndex: 10000 } }
                            }, children: [_jsx(MenuItem, { value: "active", children: "Active" }), _jsx(MenuItem, { value: "pending", children: "Pending" }), _jsx(MenuItem, { value: "inactive", children: "Inactive" })] }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mt: 1 }, children: [_jsx(Button, { onClick: handleSaveLiability, variant: "contained", color: "primary", fullWidth: true, children: editingLiability ? "Update" : "Add" }), _jsx(Button, { onClick: () => setLiabilityDialogOpen(false), variant: "outlined", fullWidth: true, children: "Cancel" })] })] }) })), removeLiabilityId && (_jsx(Box, { sx: {
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
                }, onClick: () => setRemoveLiabilityId(null), children: _jsxs(Card, { sx: { ...popupCardSx, minWidth: 300, maxWidth: 350 }, onClick: e => e.stopPropagation(), children: [_jsx(Typography, { variant: "h6", children: "Remove Liability" }), _jsx(Typography, { children: "Are you sure you want to remove this liability?" }), _jsxs(Stack, { direction: "row", spacing: 2, children: [_jsx(Button, { onClick: handleRemoveLiability, variant: "contained", color: "error", fullWidth: true, children: "Remove" }), _jsx(Button, { onClick: () => setRemoveLiabilityId(null), variant: "outlined", fullWidth: true, children: "Cancel" })] })] }) }))] }));
}
