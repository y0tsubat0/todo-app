export const metadata = {
  title: '대시보드 | SimpleTodo',
  description: '할 일 통계 및 분석 대시보드',
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  )
} 