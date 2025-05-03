import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  emailCheckResult: null,

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

  // 이메일 중복 체크
  checkEmailExists: async (email, options = {}) => {
    const { 
      setError = true,
      messageType = 'default'  // 'default' | 'signup' | 'reset'
    } = options

    try {
      set({ emailCheckResult: null, error: null })
      
      console.log('이메일 체크 요청:', email, '옵션:', options)
      
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      console.log('서버 응답:', { status: response.status, data })
      
      if (!response.ok) {
        throw new Error(data.error || '이메일 확인 중 오류가 발생했습니다.')
      }

      // 응답 데이터에서 존재 여부 확인
      const exists = !!data.exists // 불리언 타입으로 확실하게 변환
      let message = ''

      // 상황별 메시지 설정
      switch (messageType) {
        case 'signup':
          message = exists 
            ? '이미 가입된 이메일입니다. 로그인을 시도해보세요.' 
            : '사용 가능한 이메일입니다.'
          break
        case 'reset':
          message = exists 
            ? '비밀번호 재설정 링크를 보내드리겠습니다.' 
            : '등록되지 않은 이메일입니다. 이메일을 확인해주세요.'
          break
        default:
          message = data.message || (exists 
            ? '등록된 이메일입니다.' 
            : '등록되지 않은 이메일입니다.')
      }

      const result = { exists, message }
      console.log('이메일 체크 결과 처리 전:', { exists, message, messageType, setError })

      // 결과를 상태에 저장
      set({ emailCheckResult: result })

      // 개선된 에러 메시지 설정 로직 
      if (setError) {
        // setError가 true이고 특정 조건에 맞을 때만 error 상태를 설정
        if (messageType === 'signup') {
          if (exists) {
            console.log('[signup] 이미 존재하는 이메일, 에러 설정:', message)
            set({ error: message }) // 이미 존재하는 이메일인 경우에만 에러 설정
          } else {
            console.log('[signup] 사용 가능한 이메일, 에러 초기화')
            set({ error: null })
          }
        } else if (messageType === 'reset') {
          if (!exists) {
            console.log('[reset] 존재하지 않는 이메일, 에러 설정:', message)
            set({ error: message }) // 존재하지 않는 이메일인 경우에만 에러 설정
          } else {
            console.log('[reset] 존재하는 이메일, 에러 초기화')
            set({ error: null })
          }
        } else {
          // default 케이스는 에러 초기화
          console.log('[default] 에러 초기화')
          set({ error: null })
        }
      } else {
        console.log('setError가 false이므로 에러 상태를 변경하지 않음')
      }

      console.log('최종 반환 결과:', result)
      return result
    } catch (error) {
      console.error('이메일 체크 에러:', error)
      const errorMessage = error.message || '이메일 확인 중 오류가 발생했습니다.'
      
      if (setError) {
        set({ error: errorMessage })
      }
      
      const result = { exists: false, message: errorMessage }
      set({ emailCheckResult: result })
      return result
    }
  },

  // 이메일 체크 결과 초기화
  clearEmailCheckResult: () => {
    console.log('이메일 체크 결과 초기화')
    set({ emailCheckResult: null, error: null })
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

  // 비밀번호 재설정 이메일 전송
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password/confirm`
      })
      
      if (error) {
        console.error('Supabase 비밀번호 재설정 에러:', error)
        // User not allowed 에러 처리
        if (error.message?.includes('User not allowed')) {
          set({ error: '등록되지 않은 이메일입니다. 이메일을 확인해주세요.' })
          return false
        }
        throw error
      }
      
      set({ 
        error: '비밀번호 재설정 링크를 이메일로 전송했습니다. 이메일을 확인해주세요.'
      })
      return true
    } catch (error) {
      console.error('비밀번호 재설정 처리 에러:', error)
      set({ error: error.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.' })
      return false
    }
  },

  // 새 비밀번호로 업데이트
  updatePassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      
      set({ error: '비밀번호가 성공적으로 변경되었습니다.' })
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null })
}))

export default useAuthStore 