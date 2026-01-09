import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Clock, FileText, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const progress = 23; // 30일 중 7일 완료
  const completedDays = 7;

  const todayMission = {
    chapter: '2장',
    section: '전략 수립 파트',
    time: '30분',
    url: '/mentee/chapter/2/1',
  };

  const weeklyTasks = [
    {
      week: 1,
      title: '1주차 과제: 페르소나 분석',
      brand: '나의 브랜드',
      status: 'feedback_completed',
      statusText: '피드백 확인 완료',
    },
    {
      week: 2,
      title: '2주차 과제: CJM 설계',
      brand: '나의 브랜드',
      status: 'submitted',
      statusText: '피드백 대기',
    },
  ];

  const recentChapters = [
    { id: 1, title: '콘텐츠 마케팅 직무란?', section: '1-1. 직무 이해', progress: 100 },
    { id: 2, title: '전략 수립', section: '2-1. 전략 기획', progress: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Brown님, 오늘은 Day {completedDays + 1}</h1>
        <p className="text-muted-foreground mt-2">
          {todayMission.chapter} {todayMission.section} 진행해볼까요?
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>전체 진도</CardTitle>
          <CardDescription>전체 30일 중 {completedDays}일 완료</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행률</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      {/* Today's Mission */}
      <Card>
        <CardHeader>
          <CardTitle>오늘의 미션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{todayMission.chapter} {todayMission.section}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>예상 소요 시간: {todayMission.time}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate(todayMission.url)} className="w-full">
            바로 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Tasks Status */}
      <Card>
        <CardHeader>
          <CardTitle>이번 주 실습 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyTasks.map((task) => (
            <div
              key={task.week}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  브랜드: {task.brand} · {task.statusText}
                </div>
              </div>
              <Badge
                variant={
                  task.status === 'feedback_completed'
                    ? 'default'
                    : task.status === 'submitted'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {task.statusText}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Chapters */}
      <Card>
        <CardHeader>
          <CardTitle>최근 본 챕터 이어보기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentChapters.map((chapter) => (
            <div
              key={chapter.id}
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate(`/mentee/chapter/${chapter.id}`)}
            >
              <div className="flex-1">
                <div className="font-medium">{chapter.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{chapter.section}</div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={chapter.progress} className="w-24 h-2" />
                <span className="text-sm text-muted-foreground">{chapter.progress}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>최근 제출한 과제</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyTasks.map((task) => (
            <div
              key={task.week}
              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate(`/mentee/feedback/${task.week}`)}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {task.brand} · {task.week}주차
                  </div>
                </div>
              </div>
              <Badge variant="outline">{task.statusText}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Q&A Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Q&A / 오픈채팅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/mentee/qa')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            자주 묻는 질문 보기
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open('https://open.kakao.com/o/...', '_blank')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            오픈채팅방 바로가기 (비밀번호: 0185)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

