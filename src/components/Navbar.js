import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
import { Button } from '@/components/ui/button'

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuthStore()

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
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-lg">SimpleTodo</div>
          {user && (
            <div className="flex items-center ml-6 space-x-1">
              <Link href="/" className={`p-2 rounded-md hover:bg-slate-100 transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Home size={20} />
              </Link>
              <Link href="/trash" className={`p-2 rounded-md hover:bg-slate-100 transition-colors ${pathname === '/trash' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Trash2 size={20} />
              </Link>
            </div>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="사용자 메뉴">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs text-muted-foreground">사용자</p>
                    <p className="text-sm font-medium">{user.user_metadata?.display_name || '사용자'} ({user.email})</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  )
} 