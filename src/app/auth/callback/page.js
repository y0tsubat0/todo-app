'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL의 해시 파라미터 처리
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        // 에러 체크
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')
        
        if (error) {
          if (error === 'access_denied' && hashParams.get('error_code') === 'otp_expired') {
            throw new Error('이메일 링크가 만료되었습니다. 다시 회원가입을 시도해주세요.')
          }
          throw new Error(errorDescription || '인증 처리 중 오류가 발생했습니다.')
        }

        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const displayName = hashParams.get('display_name')
        
        if (accessToken && refreshToken) {
          // 세션 설정
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (sessionError) throw sessionError

          // display name이 있는 경우 프로필 업데이트
          if (displayName) {
            const { error: updateError } = await supabase.auth.updateUser({
              data: { display_name: displayName }
            })

            if (updateError) {
              console.error('프로필 업데이트 오류:', updateError)
            }
          }

          // 메인 페이지로 리다이렉트
          router.push('/')
        } else {
          throw new Error('인증 토큰이 없습니다.')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setError(error.message)
        // 3초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">인증 오류</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600">3초 후 메인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">인증 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  )
} 