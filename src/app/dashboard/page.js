'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'
import useTodoStore from '@/store/useTodoStore'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, BarChart, LineChart, Activity, CheckCircle, Clock, AlertCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format, isSameDay, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading, checkSession } = useAuthStore()
  const { todos, isLoading: todosLoading, error, fetchTodos } = useTodoStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [monthlyStats, setMonthlyStats] = useState([])
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideRef = useRef(null)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (user) {
      fetchTodos()
      fetchMonthlyStats()
    }
  }, [user, fetchTodos])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [authLoading, user, router])

  // 월별 통계 데이터 가져오기
  const fetchMonthlyStats = async () => {
    if (!user) return
    
    try {
      setIsLoadingStats(true)
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('monthly_todo_stats')
        .select('*')
        .order('month', { ascending: false })
        .limit(6)
      
      if (error) throw error
      
      setMonthlyStats(data || [])
    } catch (error) {
      console.error('월별 통계를 가져오는 중 오류 발생:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // 슬라이드 이동 함수
  const handleSlide = (direction) => {
    if (direction === 'prev' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else if (direction === 'next' && currentSlide < monthlyStats.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  if (authLoading) {
    return <div className="text-center p-4">로딩 중...</div>
  }

  if (!user) {
    return <div className="text-center p-4">로그인 페이지로 이동 중...</div>
  }

  // 데이터 분석 및 통계
  const activeTodos = todos.filter(todo => !todo.completed && !todo.is_deleted)
  const completedTodos = todos.filter(todo => todo.completed && !todo.is_deleted)
  const deletedTodos = todos.filter(todo => todo.is_deleted)
  const totalTodos = activeTodos.length + completedTodos.length
  const completionRate = totalTodos > 0 ? Math.round((completedTodos.length / totalTodos) * 100) : 0

  // 선택한 날짜의 할 일 필터링
  const todosForSelectedDate = todos.filter(todo => {
    if (todo.is_deleted) return false
    
    // created_at이 문자열이라 가정하고 Date 객체로 변환
    const todoDate = todo.created_at ? new Date(todo.created_at) : null
    return todoDate && isSameDay(todoDate, selectedDate)
  })

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">대시보드</h1>
          <p className="text-muted-foreground">
            {user.user_metadata?.display_name || '사용자'}님의 할 일 통계 및 분석
          </p>
        </div>

        {todosLoading ? (
          <div className="text-center p-4">로딩 중...</div>
        ) : (
          <>
            {/* 월별 할 일 통계 섹션 */}
            <div className="mb-8">
              <div className="relative">
                {isLoadingStats ? (
                  <div className="text-center py-8">통계 로딩 중...</div>
                ) : monthlyStats.length > 0 ? (
                  <div className="relative">
                    <div className="overflow-hidden" ref={slideRef}>
                      <div className="flex justify-center">
                        {monthlyStats.length > 0 && currentSlide < monthlyStats.length && (
                          <Card className="w-full max-w-md shadow-sm" key={currentSlide}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-medium flex items-center justify-center space-x-4">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleSlide('prev')} 
                                  disabled={currentSlide === 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span>
                                  {format(parseISO(monthlyStats[currentSlide].month), 'yyyy년 M월', { locale: ko })}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleSlide('next')} 
                                  disabled={currentSlide === monthlyStats.length - 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">전체</span>
                                  <span className="font-medium">{monthlyStats[currentSlide].total_todos}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">완료</span>
                                  <span className="font-medium text-green-600">{monthlyStats[currentSlide].completed_todos}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">진행중</span>
                                  <span className="font-medium text-blue-600">{monthlyStats[currentSlide].active_todos}</span>
                                </div>
                                <div className="mt-4">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">완료율</span>
                                    <span className="text-xs font-medium">{monthlyStats[currentSlide].completion_rate}%</span>
                                  </div>
                                  <Progress value={monthlyStats[currentSlide].completion_rate} className="h-2" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                    

                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    월별 통계 데이터가 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 캘린더 및 날짜별 할 일 섹션 */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>캘린더</CardTitle>
                  <CardDescription>날짜를 선택하여 해당 날짜의 할 일을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                  <div className="mx-auto">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={date => setSelectedDate(date || new Date())}
                      locale={ko}
                      className="w-full max-w-full rounded-md border"
                    />
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  {format(selectedDate, 'PPP', { locale: ko })}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      <span>{format(selectedDate, 'PPP', { locale: ko })}의 할 일</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todosForSelectedDate.length > 0 ? (
                    <ul className="space-y-2">
                      {todosForSelectedDate.map(todo => (
                        <li key={todo.id} className="flex items-center p-2 border rounded-md">
                          <div className={`w-2 h-2 rounded-full mr-3 ${todo.completed ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                            {todo.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      해당 날짜에 등록된 할 일이 없습니다
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}