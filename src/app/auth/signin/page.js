'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/useAuthStore'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState(null)
  const { signIn, error, clearError } = useAuthStore()

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setLocalError(null)
    clearError()
  }

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setLocalError(null)
    clearError()

    try {
      console.log('로그인 시도:', formData.email)
      
      if (!formData.email || !formData.password) {
        setLocalError('이메일과 비밀번호를 모두 입력해주세요.')
        return
      }

      // 로그인 요청
      await signIn(formData.email, formData.password)
      console.log('로그인 성공, 메인 페이지로 이동')
      router.push('/')
    } catch (err) {
      console.error('로그인 처리 에러:', err)
      setLocalError(err.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 실제 표시할 에러 메시지
  const displayError = localError || error

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">SimpleTodo</CardTitle>
          <CardDescription>
            로그인하여 할 일을 관리하세요.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {displayError && (
              <div className="text-sm text-red-500">
                {displayError}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">이메일</label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                required
              />
              <div className="text-right">
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '로그인'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              아직 계정이 없으신가요?{' '}
              <Button
                type="button"
                variant="link"
                className="px-0 text-primary hover:underline"
                onClick={() => router.push('/auth/signup')}
              >
                회원가입하기
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 