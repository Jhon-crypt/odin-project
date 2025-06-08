import {
  Box,
  Typography,
  Avatar,
  Badge,
  Stack,
  Divider,
} from '@mui/material'

interface TeamMember {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away' | 'dnd' | 'offline'
  statusText?: string
  lastSeen?: string
}

function UserStatus() {
  const onlineMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Emily Liu',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'online',
      statusText: 'Exploring',
    },
    {
      id: '2',
      name: 'Marcus Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: 'away',
      statusText: 'Away',
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: 'dnd',
      statusText: 'Do Not Disturb',
    },
  ]

  const offlineMembers: TeamMember[] = [
    {
      id: '4',
      name: 'Alex Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=4',
      status: 'offline',
      lastSeen: '2 hours ago',
    },
    {
      id: '5',
      name: 'Maya Patel',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'offline',
      lastSeen: 'Yesterday',
    },
    {
      id: '6',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=6',
      status: 'offline',
      lastSeen: '3 days ago',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#C0FF92'
      case 'away':
        return '#FFB347'
      case 'dnd':
        return '#FF6B6B'
      case 'offline':
        return '#666'
      default:
        return '#666'
    }
  }

  const StatusBadge = ({ status, children }: { status: string; children: React.ReactNode }) => (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: getStatusColor(status),
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '2px solid #111111',
        },
      }}
    >
      {children}
    </Badge>
  )

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: 320, lg: 280 },
        height: '100vh',
        bgcolor: '#1a1a1a',
        borderLeft: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: { xs: 'fixed', lg: 'static' },
        top: 0,
        right: 0,
        zIndex: { xs: 1000, lg: 'auto' },
      }}
    >
      {/* Currently Online Section */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '14px', md: '16px' },
          }}
        >
          Currently Online ({onlineMembers.length})
        </Typography>

        <Stack spacing={{ xs: 1.5, md: 2 }}>
          {onlineMembers.map((member) => (
            <Box
              key={member.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#333',
                },
                cursor: 'pointer',
              }}
            >
              <StatusBadge status={member.status}>
                <Avatar
                  src={member.avatar}
                  sx={{
                    width: { xs: 32, md: 36 },
                    height: { xs: 32, md: 36 },
                  }}
                />
              </StatusBadge>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '13px', md: '14px' },
                    fontWeight: 'medium',
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  sx={{
                    color: getStatusColor(member.status),
                    fontSize: { xs: '11px', md: '12px' },
                  }}
                >
                  {member.statusText}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: '#333', mx: 3 }} />

      {/* Offline Section */}
      <Box sx={{ p: { xs: 2, md: 3 }, flex: 1, overflow: 'auto' }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#888',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '14px', md: '16px' },
          }}
        >
          Offline ({offlineMembers.length})
        </Typography>

        <Stack spacing={{ xs: 1.5, md: 2 }}>
          {offlineMembers.map((member) => (
            <Box
              key={member.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#333',
                },
                cursor: 'pointer',
              }}
            >
              <Avatar
                src={member.avatar}
                sx={{
                  width: { xs: 32, md: 36 },
                  height: { xs: 32, md: 36 },
                  filter: 'grayscale(50%)',
                  opacity: 0.7,
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#888',
                    fontSize: { xs: '13px', md: '14px' },
                    fontWeight: 'medium',
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: { xs: '11px', md: '12px' },
                  }}
                >
                  {member.lastSeen}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default UserStatus 