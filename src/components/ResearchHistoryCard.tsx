import {
  Box,
  Typography,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

function ResearchHistoryCard() {
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
        p: 3,
        width: '100%',
        maxWidth: 'none',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          Research Activity
        </Typography>
        <Typography
          sx={{
            color: '#888',
            fontSize: '14px',
          }}
        >
          Last 12 months
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
        <Box>
          <Typography
            sx={{
              color: '#C0FF92',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            42 papers
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: '12px',
            }}
          >
            this year
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              color: '#888',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            30 papers
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: '12px',
            }}
          >
            last year
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 400, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="month" 
              stroke="#888"
              fontSize={12}
            />
            <YAxis 
              stroke="#888"
              fontSize={12}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="thisYear" 
              stroke="#C0FF92" 
              strokeWidth={2}
              name="This Year"
              dot={{ fill: '#C0FF92', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="lastYear" 
              stroke="#888" 
              strokeWidth={2}
              name="Last Year"
              dot={{ fill: '#888', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              sx={{
                color: '#888',
                '&.Mui-checked': {
                  color: '#C0FF92',
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: '#888', fontSize: '14px' }}>
              Compare to previous period
            </Typography>
          }
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#333',
              color: '#888',
              textTransform: 'none',
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