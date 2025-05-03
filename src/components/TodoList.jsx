import { Card } from '@/components/ui/card'
import { TodoItem } from '@/components/TodoItem'
import { Button } from '@/components/ui/button'

export function TodoList({ 
  title, 
  todos, 
  onToggle, 
  onDelete, 
  onRestore,
  showDeleted,
  onToggleShowDeleted,
  emptyMessage 
}) {
  const filteredTodos = showDeleted 
    ? todos.filter(todo => todo.is_deleted)
    : todos.filter(todo => !todo.is_deleted)

  return (
    <Card className="p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleShowDeleted}
        >
          {showDeleted ? '활성 항목 보기' : '삭제된 항목 보기'}
        </Button>
      </div>
      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onRestore={onRestore}
            isDeleted={todo.is_deleted}
          />
        ))}
        {filteredTodos.length === 0 && (
          <p className="text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </Card>
  )
} 