interface Author {
  name: string
  avatar: string
  institution: string
  department?: string
}

interface Comment {
  id: number
  author: Author
  content: string
  timestamp: string
  likes: number
  replies?: Reply[]
}

interface Reply {
  id: number
  author: Author
  content: string
  timestamp: string
  likes: number
}

interface ResearchStats {
  likes: number
  comments: number
  shares: number
}

export interface ResearchProject {
  id: string
  title: string
  author: Author
  content: string
  type: 'paper' | 'project' | 'collaboration'
  lastUpdated: string
  status: 'published' | 'in-review' | 'draft' | 'active'
  collaborators: string[]
  stats: ResearchStats
  comments: Comment[]
}

// Mock data - Replace with actual API calls in production
const mockResearchProjects: ResearchProject[] = [
  {
    id: '1',
    title: 'Spaceship Crew Psychology Analysis',
    author: {
      name: 'Emily Liu',
      avatar: 'EL',
      institution: 'Stanford University',
      department: 'Computer Science Department'
    },
    content: `Executive Summary

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

Successful Mars mission crews require balanced leadership, structured conflict resolution, regular psychological support, and deliberate team cohesion activities to maintain effectiveness during extended isolation.`,
    type: 'project',
    lastUpdated: 'December 15, 2024',
    status: 'active',
    collaborators: ['Emily Liu', 'Marcus Chen'],
    stats: {
      likes: 128,
      comments: 45,
      shares: 23
    },
    comments: [
      {
        id: 1,
        author: {
          name: 'Dr. James Wilson',
          avatar: 'JW',
          institution: 'NASA Research'
        },
        content: 'Excellent analysis of the psychological challenges in long-duration space missions. The emphasis on leadership flexibility is particularly important.',
        timestamp: '2 hours ago',
        likes: 12,
        replies: [
          {
            id: 101,
            author: {
              name: 'Emily Liu',
              avatar: 'EL',
              institution: 'Stanford University'
            },
            content: 'Thank you Dr. Wilson! Your insights from NASA\'s research have been invaluable.',
            timestamp: '1 hour ago',
            likes: 5
          }
        ]
      }
    ]
  },
  // Add more mock research projects here
]

export const getResearchProjects = () => {
  return Promise.resolve(mockResearchProjects)
}

export const getResearchProjectById = (id: string) => {
  const project = mockResearchProjects.find(p => p.id === id)
  return Promise.resolve(project)
}

export const addComment = (projectId: string, content: string, author: Author) => {
  const project = mockResearchProjects.find(p => p.id === projectId)
  if (!project) return Promise.reject('Project not found')

  const newComment = {
    id: Math.max(...project.comments.map(c => c.id)) + 1,
    author,
    content,
    timestamp: 'Just now',
    likes: 0
  }

  project.comments.unshift(newComment)
  project.stats.comments++

  return Promise.resolve(newComment)
}

export const addReply = (projectId: string, commentId: number, content: string, author: Author) => {
  const project = mockResearchProjects.find(p => p.id === projectId)
  if (!project) return Promise.reject('Project not found')

  const comment = project.comments.find(c => c.id === commentId)
  if (!comment) return Promise.reject('Comment not found')

  if (!comment.replies) comment.replies = []

  const newReply = {
    id: comment.replies.length ? Math.max(...comment.replies.map(r => r.id)) + 1 : 1,
    author,
    content,
    timestamp: 'Just now',
    likes: 0
  }

  comment.replies.push(newReply)
  project.stats.comments++

  return Promise.resolve(newReply)
}

export const likeResearch = (projectId: string) => {
  const project = mockResearchProjects.find(p => p.id === projectId)
  if (!project) return Promise.reject('Project not found')

  project.stats.likes++
  return Promise.resolve(project.stats.likes)
}

export const likeComment = (projectId: string, commentId: number) => {
  const project = mockResearchProjects.find(p => p.id === projectId)
  if (!project) return Promise.reject('Project not found')

  const comment = project.comments.find(c => c.id === commentId)
  if (!comment) return Promise.reject('Comment not found')

  comment.likes++
  return Promise.resolve(comment.likes)
}

export const likeReply = (projectId: string, commentId: number, replyId: number) => {
  const project = mockResearchProjects.find(p => p.id === projectId)
  if (!project) return Promise.reject('Project not found')

  const comment = project.comments.find(c => c.id === commentId)
  if (!comment) return Promise.reject('Comment not found')

  const reply = comment.replies?.find(r => r.id === replyId)
  if (!reply) return Promise.reject('Reply not found')

  reply.likes++
  return Promise.resolve(reply.likes)
}

export const shareResearch = (projectId: string) => {
  const project = mockResearchProjects.find(p => p.id === projectId)
  if (!project) return Promise.reject('Project not found')

  project.stats.shares++
  return Promise.resolve(project.stats.shares)
} 