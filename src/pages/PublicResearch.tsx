import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material'
import {
  ThumbUp as LikeIcon,
  Reply as ReplyIcon,
  AutoAwesome as AiIcon,
  Psychology as InsightIcon,
  TipsAndUpdates as KeyPointsIcon,
  Timeline as TimelineIcon,
  CloseOutlined as CloseIcon,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { ResearchProject } from '../api/research'
import { getResearchProjectById, addComment, addReply, likeResearch, likeComment, likeReply } from '../api/research'
import { Link } from 'react-router-dom'

function PublicResearch() {
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const [research, setResearch] = useState<ResearchProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [showAiAnalysis, setShowAiAnalysis] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchResearch = async () => {
      try {
        const data = await getResearchProjectById(id)
        if (!data) {
          setError('Research project not found')
          return
        }
        setResearch(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load research project')
      } finally {
        setLoading(false)
      }
    }

    fetchResearch()
  }, [id])

  const handleComment = async () => {
    if (!comment.trim() || !research || !id) return

    try {
      const newComment = await addComment(id, comment.trim(), {
        name: 'Current User', // Replace with actual user data
        avatar: 'CU',
        institution: 'Guest'
      })
      setResearch({
        ...research,
        comments: [newComment, ...research.comments],
        stats: {
          ...research.stats,
          comments: research.stats.comments + 1
        }
      })
      setComment('')
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  const handleReply = async (commentId: number) => {
    if (!research || !id) return

    const replyContent = prompt('Enter your reply:')
    if (!replyContent?.trim()) return

    try {
      const newReply = await addReply(id, commentId, replyContent.trim(), {
        name: 'Current User', // Replace with actual user data
        avatar: 'CU',
        institution: 'Guest'
      })
      
      const updatedComments = research.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          }
        }
        return comment
      })

      setResearch({
        ...research,
        comments: updatedComments,
        stats: {
          ...research.stats,
          comments: research.stats.comments + 1
        }
      })
    } catch (err) {
      console.error('Failed to add reply:', err)
    }
  }

  const handleLike = async () => {
    if (!research || !id) return

    try {
      const newLikes = await likeResearch(id)
      setResearch({
        ...research,
        stats: {
          ...research.stats,
          likes: newLikes
        }
      })
    } catch (err) {
      console.error('Failed to like research:', err)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    if (!research || !id) return

    try {
      const newLikes = await likeComment(id, commentId)
      const updatedComments = research.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: newLikes
          }
        }
        return comment
      })

      setResearch({
        ...research,
        comments: updatedComments
      })
    } catch (err) {
      console.error('Failed to like comment:', err)
    }
  }

  const handleLikeReply = async (commentId: number, replyId: number) => {
    if (!research || !id) return

    try {
      const newLikes = await likeReply(id, commentId, replyId)
      const updatedComments = research.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: newLikes
                }
              }
              return reply
            })
          }
        }
        return comment
      })

      setResearch({
        ...research,
        comments: updatedComments
      })
    } catch (err) {
      console.error('Failed to like reply:', err)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#111111',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (error || !research) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#111111',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="error">{error || 'Research not found'}</Typography>
      </Box>
    )
  }

  // Mock AI summary data - Replace with actual AI analysis
  const aiSummary = {
    summary: "This research paper presents a comprehensive analysis of psychological factors in long-duration space missions, focusing on crew dynamics and leadership structures. The study emphasizes the importance of balanced command hierarchies and adaptive leadership approaches.",
    keyPoints: [
      "Leadership flexibility is crucial for mission success",
      "Psychological phases follow predictable patterns",
      "Team cohesion requires structured support systems",
      "Communication protocols impact conflict resolution"
    ],
    timeline: [
      { phase: "Initial Phase", duration: "Weeks 1-4", focus: "Team adaptation and excitement" },
      { phase: "Adjustment", duration: "Months 2-6", focus: "Reality setting in" },
      { phase: "Critical Period", duration: "Months 6-12", focus: "Potential conflicts" },
      { phase: "Stabilization", duration: "Months 12+", focus: "Team equilibrium" }
    ],
    insights: [
      "Strong correlation between leadership style and crew morale",
      "Regular assessment protocols improve mission outcomes",
      "Balance between structure and flexibility is key"
    ]
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#111111',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          maxWidth: '1600px',
          margin: '0 auto',
          p: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          gap: 4,
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Author Info */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#C0FF92',
                  color: '#000',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  fontSize: { xs: '18px', sm: '20px' },
                  fontWeight: 'bold',
                }}
              >
                {research.author.avatar}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    mb: 0.5,
                  }}
                >
                  {research.author.name}
                </Typography>
                <Typography
                  sx={{
                    color: '#888',
                    fontSize: { xs: '12px', sm: '14px' },
                  }}
                >
                  {research.author.institution} • {research.author.department}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Contributors Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#C0FF92', mb: 2, fontSize: '1rem' }}>
              Contributors
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {[
                {
                  name: 'Dr. Sarah Chen',
                  role: 'Lead Researcher - Psychological Assessment',
                  affiliation: 'NASA Behavioral Sciences Division'
                },
                {
                  name: 'Prof. James Martinez',
                  role: 'Space Psychology Expert',
                  affiliation: 'International Space University'
                },
                {
                  name: 'Dr. Yuki Tanaka',
                  role: 'Mission Planning Specialist',
                  affiliation: 'JAXA Human Factors Research'
                }
              ].map((contributor, index) => (
                <Paper
                  key={index}
                  sx={{
                    bgcolor: '#1a1a1a',
                    border: '1px solid #333',
                    p: 2,
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                    minWidth: 0
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 500, mb: 0.5 }}>
                    {contributor.name}
                  </Typography>
                  <Typography sx={{ color: '#C0FF92', fontSize: '14px', mb: 0.5 }}>
                    {contributor.role}
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '13px' }}>
                    {contributor.affiliation}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Research Content */}
          <Paper
            sx={{
              bgcolor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 2,
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#C0FF92',
                fontWeight: 'bold',
                fontSize: { xs: '24px', sm: '28px', md: '32px' },
                mb: 4,
                borderBottom: '1px solid #333',
                pb: 2,
              }}
            >
              {research.title}
            </Typography>
            <Typography
              sx={{
                color: '#ccc',
                fontSize: { xs: '14px', sm: '16px' },
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {research.content}
            </Typography>
          </Paper>

          {/* Engagement Stats */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              mb: 4,
              color: '#888',
            }}
          >
            <Button
              startIcon={<LikeIcon />}
              onClick={handleLike}
              sx={{
                color: '#888',
                '&:hover': { color: '#C0FF92' },
              }}
            >
              {research.stats.likes}
            </Button>
            <Typography>{research.stats.comments} Comments</Typography>
            <Typography>{research.stats.shares} Shares</Typography>
          </Box>

          {/* Comment Input */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#333',
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                }}
              >
                CU
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <TextField
                  multiline
                  rows={2}
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1a1a1a',
                      color: '#fff',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#444',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#C0FF92',
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    sx={{
                      bgcolor: '#C0FF92',
                      color: '#000',
                      '&:hover': {
                        bgcolor: '#A8E87C',
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#333',
                        color: '#666',
                      },
                    }}
                  >
                    Comment
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Comments Section */}
          <Stack spacing={3}>
            {research.comments.map((comment) => (
              <Box key={comment.id}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: '#333',
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                    }}
                  >
                    {comment.author.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '13px', sm: '14px' },
                        }}
                      >
                        {comment.author.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#888',
                          fontSize: { xs: '12px', sm: '13px' },
                        }}
                      >
                        • {comment.author.institution}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#666',
                          fontSize: { xs: '12px', sm: '13px' },
                          ml: 'auto',
                        }}
                      >
                        {comment.timestamp}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: '#ccc',
                        fontSize: { xs: '13px', sm: '14px' },
                        lineHeight: 1.6,
                        mb: 1,
                      }}
                    >
                      {comment.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                        startIcon={<LikeIcon />}
                        size="small"
                        onClick={() => handleLikeComment(comment.id)}
                        sx={{
                          color: '#888',
                          fontSize: { xs: '12px', sm: '13px' },
                          '&:hover': { color: '#C0FF92' },
                        }}
                      >
                        {comment.likes}
                      </Button>
                      <Button
                        startIcon={<ReplyIcon />}
                        size="small"
                        onClick={() => handleReply(comment.id)}
                        sx={{
                          color: '#888',
                          fontSize: { xs: '12px', sm: '13px' },
                          '&:hover': { color: '#C0FF92' },
                        }}
                      >
                        Reply
                      </Button>
                    </Box>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box sx={{ ml: { xs: 2, sm: 4 }, mt: 2 }}>
                        {comment.replies.map((reply) => (
                          <Box key={reply.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: '#333',
                                width: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                              }}
                            >
                              {reply.author.avatar}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: { xs: '12px', sm: '13px' },
                                  }}
                                >
                                  {reply.author.name}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#888',
                                    fontSize: { xs: '11px', sm: '12px' },
                                  }}
                                >
                                  • {reply.author.institution}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#666',
                                    fontSize: { xs: '11px', sm: '12px' },
                                    ml: 'auto',
                                  }}
                                >
                                  {reply.timestamp}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  color: '#ccc',
                                  fontSize: { xs: '12px', sm: '13px' },
                                  lineHeight: 1.6,
                                  mb: 1,
                                }}
                              >
                                {reply.content}
                              </Typography>
                              <Button
                                startIcon={<LikeIcon />}
                                size="small"
                                onClick={() => handleLikeReply(comment.id, reply.id)}
                                sx={{
                                  color: '#888',
                                  fontSize: { xs: '11px', sm: '12px' },
                                  '&:hover': { color: '#C0FF92' },
                                }}
                              >
                                {reply.likes}
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Create Your Own Research CTA */}
          <Box
            sx={{
              mt: 6,
              p: 3,
              bgcolor: 'rgba(192, 255, 146, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(192, 255, 146, 0.2)',
              maxWidth: '600px',
              mx: 'auto',
              textAlign: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
              <AiIcon style={{ fontSize: 20, color: '#C0FF92' }} />
              <Typography sx={{ color: '#C0FF92', fontWeight: 500, fontSize: '1.25rem' }}>
                Create Your Own AI-Powered Research
              </Typography>
            </Box>
            <Typography sx={{ color: '#ccc', mb: 2.5, lineHeight: 1.5, fontSize: '0.95rem' }}>
              Transform your research with our advanced AI tools. Get instant analysis, discover patterns, and generate insights automatically.
            </Typography>
            <Button
              variant="contained"
              size="medium"
              component={Link}
              to="/create-research"
              sx={{
                bgcolor: '#C0FF92',
                color: '#111',
                '&:hover': {
                  bgcolor: '#a8ff66',
                },
                fontWeight: 500,
                px: 3,
                py: 1,
                fontSize: '0.9rem',
              }}
            >
              Start Your Research
            </Button>
          </Box>
        </Box>

        {/* AI Summary Sidebar - Only show on large screens */}
        {isLargeScreen && showAiAnalysis && (
          <Box
            sx={{
              width: '380px',
              flexShrink: 0,
            }}
          >
            <Paper
              sx={{
                bgcolor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: 2,
                p: 3,
                position: 'sticky',
                top: 24,
              }}
            >
              {/* AI Badge with Close Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AiIcon sx={{ color: '#C0FF92' }} />
                  <Typography
                    sx={{
                      color: '#C0FF92',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    AI-Powered Analysis
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setShowAiAnalysis(false)}
                  size="small"
                  sx={{
                    color: '#888',
                    '&:hover': {
                      color: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Summary */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {aiSummary.summary}
                </Typography>
              </Box>

              {/* Key Points */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <KeyPointsIcon sx={{ color: '#888', fontSize: 20 }} />
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Key Points
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {aiSummary.keyPoints.map((point, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#C0FF92',
                          fontSize: '12px',
                          lineHeight: 1.8,
                        }}
                      >
                        •
                      </Typography>
                      <Typography
                        sx={{
                          color: '#ccc',
                          fontSize: '13px',
                          lineHeight: 1.6,
                        }}
                      >
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Timeline */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TimelineIcon sx={{ color: '#888', fontSize: 20 }} />
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Research Timeline
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  {aiSummary.timeline.map((item, index) => (
                    <Box key={index}>
                      <Typography
                        sx={{
                          color: '#C0FF92',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          mb: 0.5,
                        }}
                      >
                        {item.phase}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#888',
                          fontSize: '12px',
                          mb: 0.5,
                        }}
                      >
                        {item.duration}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#ccc',
                          fontSize: '13px',
                        }}
                      >
                        {item.focus}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Key Insights */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <InsightIcon sx={{ color: '#888', fontSize: 20 }} />
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Key Insights
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {aiSummary.insights.map((insight, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#C0FF92',
                          fontSize: '12px',
                          lineHeight: 1.8,
                        }}
                      >
                        •
                      </Typography>
                      <Typography
                        sx={{
                          color: '#ccc',
                          fontSize: '13px',
                          lineHeight: 1.6,
                        }}
                      >
                        {insight}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Show a button to restore AI panel when closed */}
        {isLargeScreen && !showAiAnalysis && (
          <IconButton
            onClick={() => setShowAiAnalysis(true)}
            sx={{
              position: 'fixed',
              right: 24,
              top: 24,
              bgcolor: '#1a1a1a',
              border: '1px solid #333',
              color: '#C0FF92',
              '&:hover': {
                bgcolor: '#252525',
              },
              width: 40,
              height: 40,
            }}
          >
            <AiIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}

export default PublicResearch 