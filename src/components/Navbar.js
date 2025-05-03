import useAuthStore from '@/store/useAuthStore'

export function Navbar() {
  const { user, signOut } = useAuthStore()

  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Todo App</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-white">{user.email}</span>
            <button
              onClick={signOut}
              className="text-white hover:text-indigo-200"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  )
} 