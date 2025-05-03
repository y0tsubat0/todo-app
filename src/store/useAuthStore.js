import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  // 현재 세션 상태 확인
  checkSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      set({ user: session?.user || null, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // 이메일/비밀번호로 회원가입
  signUp: async (email, password, displayName) => {
    try {
      console.log('회원가입 시작:', { email, displayName })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?display_name=${encodeURIComponent(displayName)}`,
          data: {
            display_name: displayName
          }
        }
      })

      console.log('회원가입 응답:', { data, error })

      if (error) throw error
      
      // 이메일 확인이 필요한 경우
      if (!data?.user?.email_confirmed_at) {
        set({ 
          error: '이메일을 확인해주세요. 확인 링크를 보냈습니다. (링크는 1시간 동안 유효합니다)',
          user: null 
        })
        return
      }
      
      set({ user: data.user, error: null })
    } catch (error) {
      console.error('회원가입 에러:', error)
      set({ error: error.message })
    }
  },

  // 이메일/비밀번호로 로그인
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, error: null })
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, error: null })
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null })
}))

export default useAuthStore 