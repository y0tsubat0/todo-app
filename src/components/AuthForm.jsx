import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/useAuthStore'

export function AuthForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, error, checkEmailExists } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        // 회원가입 시 이메일 중복 체크
        const emailExists = await checkEmailExists(email)
        if (emailExists) {
          useAuthStore.setState({ error: '이미 가입된 이메일입니다. 로그인을 시도해보세요.' })
          return
        }
        await signUp(email, password, displayName)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">SimpleTodo</CardTitle>
          <CardDescription>
            {isLogin ? '로그인하여 할 일을 관리하세요.' : '회원가입하여 시작하세요.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">이메일</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium">이름</label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                required
              />
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/auth/reset-password"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              {isLogin ? '아직 계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin)
                  useAuthStore.setState({ error: null })
                }}
              >
                {isLogin ? '회원가입하기' : '로그인하기'}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 