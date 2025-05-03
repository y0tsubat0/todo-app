'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { X, RotateCcw } from 'lucide-react'

export function TodoItem({ todo, onToggle, onDelete, onRestore, isDeleted }) {
  return (
    <div className={`flex items-center space-x-2 ${isDeleted ? 'opacity-50' : ''}`}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        disabled={isDeleted}
      />
      <span 
        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''} ${
          isDeleted ? 'text-gray-400' : ''
        }`}
      >
        {todo.title}
      </span>
      {isDeleted ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRestore(todo.id)}
          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 