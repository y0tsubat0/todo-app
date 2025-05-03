// 클라이언트 사이드 렌더링을 위한 지시자
'use client'

// 전역 상태 관리를 위한 Zustand 스토어와 컴포넌트들을 import
import { useEffect } from 'react'
import useAuthStore from '@/store/useAuthStore'
import useTodoStore from '@/store/useTodoStore'
import { Navbar } from '@/components/Navbar'
import { TodoForm } from '@/components/TodoForm'
import { TodoList } from '@/components/TodoList'
import { AuthForm } from '@/components/AuthForm'

export default function Home() {
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

  // 인증 로딩 중
  if (authLoading) {
    return <div className="text-center p-4">로딩 중...</div>
  }

  // 비로그인 상태
  if (!user) {
    return (
      <div>
        <Navbar />
        <AuthForm />
      </div>
    )
  }

  // 할 일 목록을 진행중/완료된 항목으로 필터링
  const activeTodos = todos.filter(todo => !todo.completed && !todo.is_deleted)
  const completedTodos = todos.filter(todo => todo.completed && !todo.is_deleted)
  const deletedTodos = todos.filter(todo => todo.is_deleted)

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">To Do List</h1>
        
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
              onRestore={restoreTodo}
              showDeleted={false}
              onToggleShowDeleted={toggleShowDeleted}
              emptyMessage="진행중인 할 일이 없습니다."
            />

            <TodoList
              title="완료된 할 일"
              todos={completedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onRestore={restoreTodo}
              showDeleted={false}
              onToggleShowDeleted={toggleShowDeleted}
              emptyMessage="완료된 할 일이 없습니다."
            />

            <TodoList
              title="삭제된 할 일"
              todos={deletedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onRestore={restoreTodo}
              showDeleted={true}
              onToggleShowDeleted={toggleShowDeleted}
              emptyMessage="삭제된 할 일이 없습니다."
            />
          </>
        )}
      </main>
    </div>
  )
}
