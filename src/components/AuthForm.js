import { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, error, clearError } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    try {
      if (isSignUp) {
        console.log('회원가입 시도:', { email, password })
        await signUp(email, password)
        console.log('회원가입 완료')
      } else {
        console.log('로그인 시도:', { email })
        await signIn(email, password)
        console.log('로그인 완료')
      }
    } catch (err) {
      console.error('인증 에러:', err)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? '회원가입' : '로그인'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSignUp ? '가입하기' : '로그인'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            clearError()
            setEmail('')
            setPassword('')
          }}
          className="w-full text-sm text-indigo-600 hover:text-indigo-500"
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </form>
    </div>
  )
} 