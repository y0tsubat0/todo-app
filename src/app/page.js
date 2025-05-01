'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TodoItem } from '@/components/TodoItem'
import useTodoStore from '@/store/useTodoStore'

export default function Home() {
  const [newTodo, setNewTodo] = useState('')
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      addTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  return (
    <div>
      <nav className="border-b">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="flex gap-4">
            <a
              href="/"
              className="text-emerald-600 font-medium"
              aria-current="page"
            >
              홈
            </a>
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              대시보드
            </a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">To Do List</h1>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새로운 할 일을 입력하세요"
          />
          <Button type="submit">추가</Button>
        </form>

        <Card className="p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">진행중인 할 일</h2>
          <div className="space-y-2">
            {activeTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
            {activeTodos.length === 0 && (
              <p className="text-gray-500">진행중인 할 일이 없습니다.</p>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">완료된 할 일</h2>
          <div className="space-y-2">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
            {completedTodos.length === 0 && (
              <p className="text-gray-500">완료된 할 일이 없습니다.</p>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
