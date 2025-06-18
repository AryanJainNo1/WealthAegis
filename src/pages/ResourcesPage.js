import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, Typography, Box, Button } from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useNavigate } from "react-router-dom";
const defaultResources = [
    {
        id: 'r1',
        title: 'Estate Planning Basics',
        description: 'A comprehensive and beginner-friendly guide to estate planning.',
        type: 'article',
        url: '/resources/estate-planning-basics',
    },
    {
        id: 'r2',
        title: 'Understanding Wills',
        description: 'What is a will and how does it work? Learn the essentials.',
        type: 'article',
        url: '/resources/estate-planning-basics',
    },
    {
        id: 'r3',
        title: 'How to Write a Will: The Complete Guide',
        description: 'Step-by-step guide to writing a legally valid will in your jurisdiction.',
        type: 'article',
        url: '/resources/estate-planning-basics',
    },
    {
        id: 'r4',
        title: 'Estate Planning: 16 Things to Do Before You Die',
        description: 'An actionable checklist and tips for a smooth estate plan.',
        type: 'article',
        url: '/resources/estate-planning-basics',
    },
    {
        id: 'r5',
        title: 'Asset Protection 101 (Video)',
        description: 'A clear and concise video on why estate planning is important.',
        type: 'video',
        url: 'https://youtu.be/8mfPgeGl0rk?si=_wtktXhSYGWlHKqh',
        duration: '6:41'
    },
    {
        id: 'r6',
        title: 'Importance of Asset management? (Video)',
        description: 'A short video explaining  "What is asset management?" in an easy, animated way..',
        type: 'video',
        url: 'https://youtu.be/Cx8obMWYg-c?si=Ejw8PbUY61F1WjqK',
        duration: '9:04'
    }
];
const gradientBg = 'linear-gradient(120deg,#e3eaf0 60%,#5C7C89 100%)';
export default function ResourcesPage() {
    const navigate = useNavigate();
    const resources = defaultResources;
    return (_jsxs(Card, { sx: { p: 3, mb: 3, borderRadius: 5, background: gradientBg }, children: [_jsxs(Typography, { variant: "h4", fontWeight: 900, gutterBottom: true, children: [_jsx(VideoLibraryIcon, { sx: { mr: 1, verticalAlign: 'middle', color: 'primary.main' } }), " Educational Resources"] }), _jsx(Box, { sx: {
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 4,
                    mt: 2
                }, children: resources.map(resource => (_jsxs(Card, { sx: { p: 3, display: 'flex', flexDirection: 'column', minHeight: 190, borderRadius: 4, background: '#fff', border: '1.5px solid #e9ecef' }, children: [_jsxs(Box, { sx: { mb: 1, display: 'flex', alignItems: 'center' }, children: [resource.type === 'video'
                                    ? _jsx(VideoLibraryIcon, { color: "secondary", sx: { mr: 1 } })
                                    : _jsx(ArticleIcon, { color: "primary", sx: { mr: 1 } }), _jsx(Typography, { variant: "h6", fontWeight: 800, children: resource.title })] }), _jsx(Typography, { color: "text.secondary", sx: { mb: 2, fontWeight: 700 }, children: resource.description }), _jsx(Box, { sx: { flexGrow: 1 } }), resource.title === "Estate Planning Basics" ? (_jsx(Button, { variant: "outlined", size: "medium", sx: { alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }, onClick: () => navigate('/estate-planning-basics'), children: "Read Article" })) : resource.title === "Understanding Wills" ? (_jsx(Button, { variant: "outlined", size: "medium", sx: { alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }, onClick: () => navigate('/understanding-wills'), children: "Read Article" })) : resource.title === "How to Write a Will: The Complete Guide" ? (_jsx(Button, { variant: "outlined", size: "medium", sx: { alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }, onClick: () => navigate('/how-to-write-a-will'), children: "Read Article" })) : resource.title === "Estate Planning: 16 Things to Do Before You Die" ? (_jsx(Button, { variant: "outlined", size: "medium", sx: { alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }, onClick: () => navigate('/estate-planning-16-things'), children: "Read Article" })) : resource.type === 'video' ? (_jsxs(_Fragment, { children: [_jsx(Box, { sx: { position: "relative", paddingTop: "56.25%" }, children: _jsx("img", { src: `https://img.youtube.com/vi/${resource.url.split('/embed/')[1]}/hqdefault.jpg`, alt: resource.title, style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 } }) }), _jsx(Button, { href: resource.url.replace("/embed/", "/watch?v="), target: "_blank", rel: "noopener noreferrer", variant: "outlined", sx: { mt: 1, borderRadius: 6, fontWeight: 900 }, children: "Open on YouTube" }), _jsx(Box, { sx: { color: "#c00", fontWeight: 600, mt: 2 }, children: "Video embed is unavailable on this network." })] })) : (_jsx(Button, { href: resource.url, target: "_blank", rel: "noopener noreferrer", variant: "outlined", size: "medium", sx: { alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }, children: "Read Article" }))] }, resource.id))) })] }));
}
