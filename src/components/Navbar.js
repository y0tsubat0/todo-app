import { usePathname } from 'next/navigation'
import { Home, Trash2, User } from 'lucide-react'
import useAuthStore from '@/store/useAuthStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const getInitials = (email) => {
    return email
      .split('@')[0]
      .split(/[._-]/)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xl font-bold">Todo App</a>
            {user && (
              <div className="flex items-center gap-4">
                <a 
                  href="/" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  할 일 목록
                </a>
                <a 
                  href="/trash" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/trash' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                  휴지통
                </a>
              </div>
            )}
          </div>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full hover:bg-gray-100 transition-colors">
                <Avatar>
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">계정</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
} 