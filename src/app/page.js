// 클라이언트 사이드 렌더링을 위한 지시자
'use client'

// 전역 상태 관리를 위한 Zustand 스토어와 컴포넌트들을 import
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'
import useTodoStore from '@/store/useTodoStore'
import { Navbar } from '@/components/Navbar'
import { TodoForm } from '@/components/TodoForm'
import { TodoList } from '@/components/TodoList'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const { user, isLoading: authLoading, checkSession } = useAuthStore()
  const { 
    todos, 
    isLoading: todosLoading, 
    error,
    showDeleted,
    fetchTodos, 
    addTodo, 
    toggleTodo, 
    deleteTodo,
    restoreTodo,
    toggleShowDeleted
  } = useTodoStore()

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    checkSession()
  }, [checkSession])

  // 로그인 상태가 변경될 때 할 일 목록 불러오기
  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user, fetchTodos])

  // 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [authLoading, user, router])

  // 인증 로딩 중
  if (authLoading) {
    return <div className="text-center p-4">로딩 중...</div>
  }

  // 비로그인 상태 - 로그인 페이지로 리다이렉트 중
  if (!user) {
    return <div className="text-center p-4">로그인 페이지로 이동 중...</div>
  }

  // 할 일 목록을 진행중/완료된 항목으로 필터링
  const activeTodos = todos.filter(todo => !todo.completed && !todo.is_deleted)
  const completedTodos = todos.filter(todo => todo.completed && !todo.is_deleted)

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Hi, {user.user_metadata?.display_name || '사용자'} 👋</h1>
        
        <TodoForm onSubmit={addTodo} />

        {todosLoading ? (
          <div className="text-center p-4">로딩 중...</div>
        ) : (
          <>
            <TodoList
              title="진행중인 할 일"
              todos={activeTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              showDeleted={false}
              emptyMessage="진행중인 할 일이 없습니다."
            />

            <TodoList
              title="완료된 할 일"
              todos={completedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              showDeleted={false}
              emptyMessage="완료된 할 일이 없습니다."
            />
          </>
        )}
      </main>
    </div>
  )
}


