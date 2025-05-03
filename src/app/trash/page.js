'use client'

import { useEffect } from 'react'
import useAuthStore from '@/store/useAuthStore'
import useTodoStore from '@/store/useTodoStore'
import { Navbar } from '@/components/Navbar'
import { TodoList } from '@/components/TodoList'
import { Home } from 'lucide-react'

export default function TrashPage() {
  const { user, isLoading: authLoading, checkSession } = useAuthStore()
  const { 
    todos, 
    isLoading: todosLoading, 
    error,
    fetchTodos, 
    deleteTodo,
    restoreTodo,
  } = useTodoStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user, fetchTodos])

  if (authLoading || !user) {
    return (
      <div>
        <Navbar />
        <div className="text-center p-4">로그인이 필요합니다.</div>
      </div>
    )
  }

  const deletedTodos = todos
    .filter(todo => todo.is_deleted)
    .map(todo => {
      const deletedDate = new Date(todo.deleted_at)
      const now = new Date()
      const diffInMilliseconds = (30 * 24 * 60 * 60 * 1000) - (now - deletedDate)
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
      
      let timeLeft
      if (diffInDays >= 1) {
        timeLeft = {
          type: 'days',
          value: `${diffInDays}일`
        }
      } else {
        const hours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
        
        if (hours > 0) {
          timeLeft = {
            type: 'time',
            value: `${hours}시간 ${minutes}분`
          }
        } else {
          timeLeft = {
            type: 'time',
            value: `${minutes}분`
          }
        }
      }

      return {
        ...todo,
        timeLeft
      }
    })

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">휴지통</h1>
        <p className="text-gray-600 mb-4">삭제된 항목은 30일 동안 보관됩니다.</p>
        
        {todosLoading ? (
          <div className="text-center p-4">로딩 중...</div>
        ) : (
          <TodoList
            title="삭제된 할 일"
            todos={deletedTodos}
            onDelete={deleteTodo}
            onRestore={restoreTodo}
            showDeleted={true}
            showDaysLeft={true}
            emptyMessage="휴지통이 비어있습니다."
          />
        )}
      </main>
    </div>
  )
} 