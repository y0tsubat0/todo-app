export function Navbar() {
  return (
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
  )
} 