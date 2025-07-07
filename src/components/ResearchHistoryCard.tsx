import {
  Box,
  Typography,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

interface ResearchHistoryCardProps {
  userId?: string;
}

function ResearchHistoryCard({ userId }: ResearchHistoryCardProps) {
  const data = [
    { month: 'Jan', thisYear: 5, lastYear: 3 },
    { month: 'Feb', thisYear: 8, lastYear: 4 },
    { month: 'Mar', thisYear: 12, lastYear: 7 },
    { month: 'Apr', thisYear: 15, lastYear: 9 },
    { month: 'May', thisYear: 18, lastYear: 12 },
    { month: 'Jun', thisYear: 22, lastYear: 15 },
    { month: 'Jul', thisYear: 25, lastYear: 18 },
    { month: 'Aug', thisYear: 28, lastYear: 20 },
    { month: 'Sep', thisYear: 32, lastYear: 23 },
    { month: 'Oct', thisYear: 35, lastYear: 25 },
    { month: 'Nov', thisYear: 38, lastYear: 28 },
    { month: 'Dec', thisYear: 42, lastYear: 30 },
  ]

  return (
    <Paper
      sx={{
        bgcolor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 2,
        p: { xs: 1.5, sm: 2, md: 3 },
        width: '100%',
        maxWidth: 'none',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        mb: { xs: 2, sm: 3 },
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '14px', sm: '16px', md: '18px' },
          }}
        >
          Research Activity
        </Typography>
        <Typography
          sx={{
            color: '#888',
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
          }}
        >
          Last 12 months
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'row', sm: 'row' },
        gap: { xs: 3, sm: 4 }, 
        mb: { xs: 2, sm: 3 },
        justifyContent: { xs: 'space-around', sm: 'flex-start' }
      }}>
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography
            sx={{
              color: '#C0FF92',
              fontSize: { xs: '18px', sm: '20px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            42 papers
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: { xs: '10px', sm: '11px', md: '12px' },
              mt: 0.5,
            }}
          >
            this year
          </Typography>
        </Box>
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography
            sx={{
              color: '#888',
              fontSize: { xs: '18px', sm: '20px', md: '24px' },
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            30 papers
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: { xs: '10px', sm: '11px', md: '12px' },
              mt: 0.5,
            }}
          >
            last year
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ 
        height: { xs: 200, sm: 250, md: 300, lg: 400 }, 
        mb: { xs: 2, sm: 3 },
        overflow: 'hidden'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="month" 
              stroke="#888"
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              stroke="#888"
              fontSize={10}
              tick={{ fontSize: 10 }}
              width={30}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="thisYear" 
              stroke="#C0FF92" 
              strokeWidth={2}
              name="This Year"
              dot={{ fill: '#C0FF92', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="lastYear" 
              stroke="#888" 
              strokeWidth={2}
              name="Last Year"
              dot={{ fill: '#888', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Controls */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 0 }
      }}>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              size="small"
              sx={{
                color: '#888',
                '&.Mui-checked': {
                  color: '#C0FF92',
                },
              }}
            />
          }
          label={
            <Typography sx={{ 
              color: '#888', 
              fontSize: { xs: '12px', sm: '13px', md: '14px' }
            }}>
              Compare to previous period
            </Typography>
          }
        />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#333',
              color: '#888',
              textTransform: 'none',
              fontSize: { xs: '11px', sm: '12px' },
              minWidth: { xs: 'unset', sm: 'auto' },
              '&:hover': {
                borderColor: '#C0FF92',
                color: '#C0FF92',
              },
            }}
          >
            View Research Method
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#C0FF92',
              color: '#000',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: { xs: '11px', sm: '12px' },
              minWidth: { xs: 'unset', sm: 'auto' },
              '&:hover': {
                bgcolor: '#A8E87C',
              },
            }}
          >
            View History
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ResearchHistoryCard 