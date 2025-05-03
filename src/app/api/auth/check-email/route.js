import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email } = await request.json()
    console.log('받은 이메일:', email)
    
    if (!email) {
      console.log('이메일이 없음')
      return NextResponse.json(
        { error: '이메일은 필수입니다.' },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 생성 - service_role 키 사용
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    console.log('Supabase 연결 테스트:', { url: process.env.NEXT_PUBLIC_SUPABASE_URL })
    
    // 이메일로 사용자 검색 시도
    let userExists = false
    
    // 방법 1: auth.users에 직접 접근 대신 profiles 테이블 확인 시도
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1)
    
    if (!profileError && profileData && profileData.length > 0) {
      userExists = true
    } else {
      console.log('프로필 검색 결과 또는 에러:', { profileData, profileError })
      
      // 방법 2: 서비스 롤 키로 Supabase Auth API 직접 호출
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?search=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          }
        })
        
        const userData = await res.json()
        console.log('Supabase Auth API 응답:', userData)
        
        if (userData && Array.isArray(userData.users) && userData.users.length > 0) {
          const matchingUser = userData.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
          )
          
          userExists = !!matchingUser
        }
      } catch (authError) {
        console.error('Auth API 직접 호출 에러:', authError)
      }
    }

    console.log('이메일 존재 여부:', userExists)

    return NextResponse.json({ 
      exists: userExists,
      message: userExists 
        ? '이미 등록된 이메일입니다.' 
        : '등록되지 않은 이메일입니다.'
    })
  } catch (error) {
    console.error('이메일 확인 에러:', error)
    return NextResponse.json(
      { error: '이메일 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 