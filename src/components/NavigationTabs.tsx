import {
  Box,
  Tabs,
  Tab,
  Badge,
} from '@mui/material'

interface NavigationTabsProps {
  activeTab: number
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void
}

function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        borderRadius: 2,
        border: '1px solid #333',
        mb: 3,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: '#C0FF92',
          },
          '& .MuiTab-root': {
            color: '#888',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'medium',
            minHeight: 48,
            '&.Mui-selected': {
              color: '#C0FF92',
            },
          },
        }}
      >
        <Tab label="Summary" />
        <Tab label="Research Details" />
        <Tab label="Publications" />
        <Tab label="Projects" />
        <Tab 
          label={
            <Badge badgeContent={3} color="primary">
              Collaborations
            </Badge>
          } 
        />
        <Tab label="Settings" />
      </Tabs>
    </Box>
  )
}

export default NavigationTabs 