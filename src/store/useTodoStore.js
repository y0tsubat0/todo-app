import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  showDeleted: false,

  // 할 일 목록 불러오기
  fetchTodos: async () => {
    set({ isLoading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ todos: data, error: null })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  // 새로운 할 일 추가
  addTodo: async (title) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title,
          user_id: user.id 
        }])
        .select()
        .single()

      if (error) throw error
      set(state => ({ todos: [data, ...state.todos] }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 할 일 상태 토글
  toggleTodo: async (id) => {
    try {
      const todo = get().todos.find(t => t.id === id)
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        todos: state.todos.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 할 일 삭제 (소프트 삭제)
  deleteTodo: async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_deleted: true })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        todos: state.todos.map(t =>
          t.id === id ? { ...t, is_deleted: true } : t
        )
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 삭제된 할 일 복구
  restoreTodo: async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_deleted: false })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        todos: state.todos.map(t =>
          t.id === id ? { ...t, is_deleted: false } : t
        )
      }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 삭제된 항목 표시 토글
  toggleShowDeleted: () => {
    set(state => ({ showDeleted: !state.showDeleted }))
  }
}))

export default useTodoStore 