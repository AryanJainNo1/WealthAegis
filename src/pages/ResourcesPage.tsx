import { Card, Typography, Box, Button } from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useNavigate } from "react-router-dom";

interface BaseResource {
  id: string;
  title: string;
  description: string;
}

interface ArticleResource extends BaseResource {
  type: 'article';
  url: string;
}

interface VideoResource extends BaseResource {
  type: 'video';
  url: string;
  duration: string;
}

type Resource = ArticleResource | VideoResource;

const defaultResources: Resource[] = [
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

  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 5, background: gradientBg }}>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        <VideoLibraryIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} /> Educational Resources
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          mt: 2
        }}
      >
        {resources.map(resource => (
          <Card key={resource.id} sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: 190, borderRadius: 4, background: '#fff', border: '1.5px solid #e9ecef' }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              {resource.type === 'video'
                ? <VideoLibraryIcon color="secondary" sx={{ mr: 1 }} />
                : <ArticleIcon color="primary" sx={{ mr: 1 }} />}
              <Typography variant="h6" fontWeight={800}>
                {resource.title}
              </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ mb: 2, fontWeight: 700 }}>
              {resource.description}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {resource.title === "Estate Planning Basics" ? (
              <Button
                variant="outlined"
                size="medium"
                sx={{ alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }}
                onClick={() => navigate('/estate-planning-basics')}
              >
                Read Article
              </Button>
            ) : resource.title === "Understanding Wills" ? (
              <Button
                variant="outlined"
                size="medium"
                sx={{ alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }}
                onClick={() => navigate('/understanding-wills')}
              >
                Read Article
              </Button>
            ) : resource.title === "How to Write a Will: The Complete Guide" ? (
              <Button
                variant="outlined"
                size="medium"
                sx={{ alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }}
                onClick={() => navigate('/how-to-write-a-will')}
              >
                Read Article
              </Button>
            ): resource.title === "Estate Planning: 16 Things to Do Before You Die" ? (
              <Button
                variant="outlined"
                size="medium"
                sx={{ alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }}
                onClick={() => navigate('/estate-planning-16-things')}
              >
                Read Article
              </Button>
            ) : resource.type === 'video' ? (
              <>
                <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                  <img
                    src={`https://img.youtube.com/vi/${resource.url.split('/embed/')[1]}/hqdefault.jpg`}
                    alt={resource.title}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                  />
                </Box>
                <Button
                  href={resource.url.replace("/embed/", "/watch?v=")}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{ mt: 1, borderRadius: 6, fontWeight: 900 }}
                >
                  Open on YouTube
                </Button>
                <Box sx={{ color: "#c00", fontWeight: 600, mt: 2 }}>
                  Video embed is unavailable on this network.
                </Box>
              </>
            ) : (
              <Button
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="medium"
                sx={{ alignSelf: 'flex-start', mt: 1, borderRadius: 6, fontWeight: 900 }}
              >
                Read Article
              </Button>
            )}
          </Card>
        ))}
      </Box>
    </Card>
  );
}