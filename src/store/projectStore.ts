import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

interface Project {
  id: string
  name: string
  created_by: string
  created_at: string
  updated_at: string
}

interface ProjectStore {
  projects: Project[]
  isLoading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  createProject: () => Promise<string | null>
  updateProject: (id: string, name: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Always update the projects to ensure we have the latest data
      set({ projects: projects || [] });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async () => {
    try {
      set({ isLoading: true, error: null })
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: 'Untitled',
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Update local state immediately
      set(state => ({
        projects: [data, ...state.projects]
      }))

      return data.id
    } catch (error) {
      console.error('Error creating project:', error)
      set({ error: (error as Error).message })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  updateProject: async (id: string, name: string) => {
    try {
      set({ isLoading: true, error: null })
      const { error } = await supabase
        .from('projects')
        .update({ name })
        .eq('id', id)

      if (error) throw error

      // Update local state immediately
      set(state => ({
        projects: state.projects.map(project =>
          project.id === id ? { ...project, name } : project
        )
      }))
    } catch (error) {
      console.error('Error updating project:', error)
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteProject: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      
      // Delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update local state immediately
      set(state => ({
        projects: state.projects.filter(project => project.id !== id)
      }))
    } catch (error) {
      console.error('Error deleting project:', error)
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useProjectStore 