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
}

const useProjectStore = create<ProjectStore>((set) => ({
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
}))

export default useProjectStore 