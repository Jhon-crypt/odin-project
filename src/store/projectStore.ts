import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

interface Project {
  id: string
  name: string
  description: string | null
  status: 'active' | 'archived' | 'deleted'
  created_by: string
  created_at: string
  updated_at: string
}

interface ProjectStore {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  createProject: () => Promise<string | null>
}

const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ projects: data || [], loading: false })
    } catch (error) {
      console.error('Error fetching projects:', error)
      set({ error: 'Failed to fetch projects', loading: false })
    }
  },
  createProject: async () => {
    set({ loading: true, error: null })
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No user found')

      // Check if user exists in users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: createUserError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            display_name: user.email?.split('@')[0] || 'Anonymous',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || null
          }])
        if (createUserError) throw createUserError
      }

      // Now create the project
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: 'Untitled',
            description: '',
            status: 'active',
            created_by: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Add the new project to the state
      const projects = get().projects
      set({ projects: [data, ...projects], loading: false })
      
      return data.id
    } catch (error) {
      console.error('Error creating project:', error)
      set({ error: 'Failed to create project', loading: false })
      return null
    }
  }
}))

export default useProjectStore 