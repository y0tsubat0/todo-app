import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  showDeleted: false,

  // 할 일 목록 불러오기
  fetchTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      // 30일이 지난 삭제된 할 일 자동 제거
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: expiredTodos } = await supabase
        .from('todos')
        .delete()
        .match({ is_deleted: true })
        .lt('deleted_at', thirtyDaysAgo.toISOString())

      // 남은 할 일 목록 가져오기
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ todos: data || [], isLoading: false })
    } catch (error) {
      set({ error: '할 일 목록을 불러오는데 실패했습니다.', isLoading: false })
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
      set({ error: '할 일을 추가하는데 실패했습니다.' })
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
      set({ error: '할 일 상태를 변경하는데 실패했습니다.' })
    }
  },

  // 할 일 삭제 (소프트 삭제)
  deleteTodo: async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        todos: state.todos.map(t =>
          t.id === id ? { ...t, is_deleted: true, deleted_at: new Date().toISOString() } : t
        )
      }))
    } catch (error) {
      set({ error: '할 일을 삭제하는데 실패했습니다.' })
    }
  },

  // 삭제된 할 일 복구
  restoreTodo: async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          is_deleted: false,
          deleted_at: null
        })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        todos: state.todos.map(t =>
          t.id === id ? { ...t, is_deleted: false, deleted_at: null } : t
        )
      }))
    } catch (error) {
      set({ error: '할 일을 복구하는데 실패했습니다.' })
    }
  },

  // 삭제된 항목 표시 토글
  toggleShowDeleted: () => {
    set(state => ({ showDeleted: !state.showDeleted }))
  }
}))

export default useTodoStore 