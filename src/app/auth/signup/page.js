'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useAuthStore from '@/store/useAuthStore'
import { supabase } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const { signUp, checkEmailExists, emailCheckResult, error, clearError, clearEmailCheckResult } = useAuthStore()

  // 전역 에러를 로컬에 복사
  useEffect(() => {
    if (error) {
      console.log('전역 에러 감지:', error)
      setLocalError(error)
    } else {
      setLocalError(null)
    }
  }, [error])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 이메일이 변경될 때마다 결과 초기화
    if (name === 'email') {
      clearEmailCheckResult()
      setLocalError(null)
      setIsSuccess(false)
    }
  }

  const handleEmailBlur = async () => {
    if (formData.email) {
      try {
        console.log('이메일 포커스 아웃, 체크 시작:', formData.email)
        const result = await checkEmailExists(formData.email, { 
          messageType: 'signup',
          setError: true 
        })
        console.log('이메일 체크 완료 (blur):', result)
      } catch (error) {
        console.error('이메일 체크 에러 (blur):', error)
        setLocalError(error.message || '이메일 확인 중 오류가 발생했습니다.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    clearError()
    setLocalError(null)
    setIsSuccess(false)

    try {
      console.log('폼 제출, 이메일:', formData.email)
      
      if (!formData.email || !formData.password || !formData.displayName) {
        setLocalError('모든 필드를 입력해주세요.')
        return
      }

      // 이메일 중복 체크 - API 직접 호출
      console.log('API로 이메일 중복 체크 시작')
      const emailCheckResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });
      
      const emailCheckData = await emailCheckResponse.json();
      console.log('이메일 체크 API 응답:', emailCheckData);
      
      if (emailCheckData.exists) {
        console.log('이미 존재하는 이메일, 회원가입 중단');
        setLocalError('이미 가입된 이메일입니다. 로그인을 시도해보세요.');
        return;
      }

      // 회원가입 - supabase 직접 호출
      console.log('Supabase로 회원가입 직접 호출');
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?display_name=${encodeURIComponent(formData.displayName)}`,
          data: {
            display_name: formData.displayName
          }
        }
      });
      
      console.log('회원가입 직접 응답:', data, '에러:', signUpError);
      
      if (signUpError) {
        throw new Error(signUpError.message || '회원가입 처리 중 오류가 발생했습니다.');
      }

      // 회원가입 성공 메시지
      console.log('회원가입 요청 완료, 확인 이메일 발송됨');
      setIsSuccess(true);
      setLocalError(null);
      
      // 이메일 확인 안내 메시지
      setLocalError('이메일을 확인해주세요. 확인 링크를 보냈습니다. (링크는 1시간 동안 유효합니다)');
      
    } catch (err) {
      console.error('회원가입 처리 에러:', err)
      setLocalError(err.message || '회원가입 중 오류가 발생했습니다.')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 실제 표시할 에러 메시지 (로컬 에러 우선)
  const displayError = localError || error

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">SimpleTodo</CardTitle>
          <CardDescription>
            회원가입하여 시작하세요.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSuccess && (
              <div className="text-sm text-green-500">
                이메일을 확인해주세요. 확인 링크를 보냈습니다. (링크는 1시간 동안 유효합니다)
              </div>
            )}
            {displayError && !isSuccess && (
              <div className="text-sm text-red-500">
                {displayError}
              </div>
            )}
            {emailCheckResult && !displayError && !emailCheckResult.exists && !isSuccess && (
              <div className="text-sm text-green-500">
                {emailCheckResult.message}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">이메일</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                required
                disabled={isSuccess}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isSuccess}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">이름</label>
              <Input
                id="displayName"
                type="text"
                name="displayName"
                placeholder="이름을 입력해주세요"
                value={formData.displayName}
                onChange={handleChange}
                required
                disabled={isSuccess}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (emailCheckResult?.exists) || isSuccess}
            >
              {isLoading ? '처리 중...' : isSuccess ? '이메일 확인 필요' : '가입하기'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Button
                type="button"
                variant="link"
                className="px-0 text-primary hover:underline"
                onClick={() => router.push('/auth/signin')}
              >
                로그인하기
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 