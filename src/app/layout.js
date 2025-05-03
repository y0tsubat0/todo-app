import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata = {
  title: 'SimpleTodo',
  description: '간단한 할 일 관리',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  )
}
