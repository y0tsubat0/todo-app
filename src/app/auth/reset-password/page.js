'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import useAuthStore from '@/store/useAuthStore'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword, checkEmailExists, error, clearError } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    clearError()

    try {
      // 이메일 존재 여부 확인
      const { exists } = await checkEmailExists(email, { 
        messageType: 'reset',
        setError: true 
      })

      if (!exists) {
        setIsLoading(false)
        return
      }

      const success = await resetPassword(email)
      if (success) {
        setEmail('')
      }
    } catch (error) {
      // 에러는 이미 checkEmailExists에서 처리됨
      console.error('비밀번호 재설정 에러:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>비밀번호 재설정</CardTitle>
          <CardDescription>
            가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="on">
          <CardContent>
            {error && (
              <div className="mb-4 text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                name="email"
                id="email"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '처리중...' : '재설정 링크 받기'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              로그인으로 돌아가기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 