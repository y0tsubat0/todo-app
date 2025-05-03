'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function TodoForm({ onSubmit }) {
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      onSubmit(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="새로운 할 일을 입력하세요"
      />
      <Button type="submit">추가</Button>
    </form>
  )
} 