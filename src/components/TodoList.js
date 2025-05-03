export function TodoList({
  title,
  todos,
  onToggle,
  onDelete,
  onRestore,
  showDeleted,
  showDaysLeft,
  emptyMessage
}) {
  if (todos.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              {!showDeleted && (
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                  className="w-5 h-5"
                />
              )}
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.title}
              </span>
              {showDaysLeft && todo.timeLeft && (
                <span className="text-sm text-gray-500">
                  {todo.timeLeft.value} 후 영구 삭제
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {showDeleted ? (
                <button
                  onClick={() => onRestore(todo.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  복구
                </button>
              ) : (
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 