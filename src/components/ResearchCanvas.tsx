import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Divider,
  useMediaQuery,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { useState } from 'react'

function ResearchCanvas() {
  const [isEditing, setIsEditing] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('Spaceship Crew Psychology Analysis')
  const isMobile = useMediaQuery('(max-width:767px)')
  const [documentContent, setDocumentContent] = useState(`Spaceship Crew Psychology Analysis

Executive Summary

This comprehensive analysis examines the psychological dynamics, leadership structures, and team cohesion strategies essential for successful long-duration Mars missions.

1. Leadership Structures in Space Missions

Clear command hierarchies are essential for Mars missions. Research indicates that successful long-duration missions require both formal authority structures and informal leadership emergence mechanisms.

Key considerations:
• Establish clear chain of command before mission launch
• Allow for situational leadership flexibility
• Implement regular leadership assessment protocols
• Balance autocratic and democratic decision-making styles

2. Psychological Dynamics in Isolated Environments

Crew psychology in isolated environments shows predictable patterns: initial excitement, reality adjustment, potential conflict periods, and stabilization phases.

Mission phases typically include:
• Honeymoon phase (weeks 1-4)
• Reality adjustment (months 2-6)
• Potential conflict period (months 6-12)
• Stabilization and adaptation (months 12+)

3. Conflict Resolution Protocols

Implementation of structured communication protocols and private retreat spaces significantly reduces interpersonal tensions in confined environments.

Recommended strategies:
• Weekly one-on-one counseling sessions
• Structured conflict mediation processes
• Private communication channels with Earth
• Regular team building exercises

4. Team Cohesion Maintenance

Regular group activities, shared goals, and rotation of responsibilities help maintain social bonds during extended isolation periods.

Effective approaches:
• Rotating meal preparation duties
• Collaborative research projects
• Recreational activities and games
• Celebration of personal milestones

Conclusions

Successful Mars mission crews require balanced leadership, structured conflict resolution, regular psychological support, and deliberate team cohesion activities to maintain effectiveness during extended isolation.`)

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend/context
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#1a1a1a',
        borderLeft: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 }, 
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ 
            color: '#C0FF92', 
            fontSize: { xs: 18, sm: 20 } 
          }} />
          <Typography
            variant="h6"
            sx={{
              color: '#C0FF92',
              fontWeight: 'bold',
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
            }}
          >
            Research Document
          </Typography>
        </Box>
        
        <IconButton
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            color: '#C0FF92',
            bgcolor: 'transparent',
            border: '1px solid #333',
            '&:hover': {
              bgcolor: '#333',
            },
          }}
        >
          {isEditing ? (
            <SaveIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          ) : (
            <EditIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          )}
        </IconButton>
      </Box>

      {/* Document Editor */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        '-webkit-overflow-scrolling': 'touch',
      }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#111111',
            minHeight: '100%',
            borderRadius: 0,
            border: 'none',
          }}
        >
          {/* Document Title */}
          {isEditing ? (
            <TextField
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              variant="standard"
              sx={{
                width: '100%',
                px: { xs: 2, sm: 3, md: 4 },
                pt: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 1.5, sm: 2 },
                '& .MuiInputBase-root': {
                  color: '#fff',
                  fontSize: { xs: '16px', sm: '18px', md: '24px' },
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#333',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#C0FF92',
                },
              }}
            />
          ) : (
            <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: { xs: '16px', sm: '18px', md: '24px' },
                px: { xs: 2, sm: 3, md: 4 },
                pt: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 1.5, sm: 2 },
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {documentTitle}
            </Typography>
          )}

          <Divider sx={{ 
            borderColor: '#333', 
            mx: { xs: 2, sm: 3, md: 4 }, 
            mb: { xs: 2, sm: 3 } 
          }} />

          {/* Document Content */}
          {isEditing ? (
            <TextField
              multiline
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              variant="standard"
              sx={{
                width: '100%',
                px: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 2, sm: 3, md: 4 },
                '& .MuiInputBase-root': {
                  color: '#ccc',
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  lineHeight: { xs: 1.6, sm: 1.8 },
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                },
                '& .MuiInput-underline:before': {
                  display: 'none',
                },
                '& .MuiInput-underline:after': {
                  display: 'none',
                },
                '& .MuiInputBase-input': {
                  resize: 'none',
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
          ) : (
            <Box
              sx={{
                px: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 2, sm: 3, md: 4 },
                color: '#ccc',
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                lineHeight: { xs: 1.6, sm: 1.8 },
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                whiteSpace: 'pre-wrap',
                '& h1': {
                  fontSize: { xs: '20px', sm: '22px', md: '24px' },
                  color: '#fff',
                  fontWeight: 'bold',
                  mb: 3,
                },
                '& h2': {
                  fontSize: { xs: '18px', sm: '19px', md: '20px' },
                  color: '#fff',
                  fontWeight: 'bold',
                  mb: 2,
                  mt: 4,
                },
                '& p': {
                  mb: 2,
                },
                '& ul': {
                  pl: 3,
                  mb: 2,
                },
                '& li': {
                  mb: 1,
                },
              }}
            >
              {documentContent}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

export default ResearchCanvas 