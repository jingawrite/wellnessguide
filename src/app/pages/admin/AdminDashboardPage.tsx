import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Calendar } from '../../components/ui/calendar';
import {
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  AlertTriangle,
  Clock,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface Camp {
  id: number;
  name: string;
  type: string;
  clientName?: string;
  startDate: Date;
  endDate?: Date;
  status: '준비중' | '진행중' | '종료';
  note?: string;
}

interface CampSession {
  id: number;
  campId: number;
  weekNo: number;
  title: string;
  sessionDate: Date;
  mode: '온라인' | '오프라인' | '하이브리드';
  location?: string;
  note?: string;
}

// 캠프 유형별 색상
const campTypeColors: Record<string, string> = {
  'Co-Work': 'bg-green-500',
  '진로부트캠프': 'bg-blue-500',
  '직무부트캠프(자율일정)': 'bg-purple-500',
  '직무부트캠프': 'bg-indigo-500',
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [camps, setCamps] = useState<Camp[]>([]);
  const [sessions, setSessions] = useState<CampSession[]>([]);

  // 캠프 및 세션 데이터 로드 (localStorage에서 가져오기)
  useEffect(() => {
    // 캠프 데이터 로드
    const storedCamps = JSON.parse(localStorage.getItem('camps') || '[]');
    const loadedCamps: Camp[] = storedCamps.map((c: any) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: c.endDate ? new Date(c.endDate) : undefined,
    }));
    
    // 샘플 데이터가 없으면 기본 샘플 데이터 사용
    if (loadedCamps.length === 0) {
      const sampleCamps: Camp[] = [
        {
          id: 1,
          name: '연세대학교 Co-work',
          type: 'Co-Work',
          clientName: '연세대학교',
          startDate: new Date('2026-01-04T21:00:00'),
          status: '진행중',
          note: '- 매주 줌 미팅 진행\n- 개인과제 2회, 팀과제 1회\n- 피드백은 세션 때 제공',
        },
        {
          id: 2,
          name: '251221 직무부트캠프',
          type: '직무부트캠프',
          startDate: new Date('2025-12-21T21:00:00'),
          status: '진행중',
        },
      ];
      setCamps(sampleCamps);
    } else {
      setCamps(loadedCamps);
    }

    // 세션 데이터 로드
    const storedSessions = JSON.parse(localStorage.getItem('campSessions') || '[]');
    const loadedSessions: CampSession[] = storedSessions.map((s: any) => ({
      ...s,
      sessionDate: new Date(s.sessionDate),
    }));
    setSessions(loadedSessions);
  }, []);

  // 세션 일자 기준으로 날짜별 캠프 매핑
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, { camp: Camp; session: CampSession }[]>();
    sessions.forEach((session) => {
      const camp = camps.find((c) => c.id === session.campId);
      if (camp) {
        const dateKey = format(session.sessionDate, 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push({ camp, session });
      }
    });
    return map;
  }, [sessions, camps]);

  // 세션 일자가 있는 날짜들
  const sessionDates = useMemo(() => {
    return sessions.map((s) => s.sessionDate);
  }, [sessions]);

  // 선택된 날짜의 캠프 목록 (세션 일자 기준)
  const campsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dateSessions = sessionsByDate.get(dateKey) || [];
    return dateSessions.map((item) => item.camp);
  }, [selectedDate, sessionsByDate]);

  // 특정 날짜의 캠프들 가져오기 (세션 일자 기준)
  const getCampsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dateSessions = sessionsByDate.get(dateKey) || [];
    return dateSessions.map((item) => item.camp);
  };

  // 특정 날짜의 세션들 가져오기
  const getSessionsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return sessionsByDate.get(dateKey) || [];
  };

  // 지표 데이터 (실제로는 API에서 가져올 데이터)
  const stats = {
    totalUsers: 156,
    activeUsers: 89,
    chapterCompletion: {
      chapter1: 85,
      chapter2: 72,
      chapter3: 65,
      chapter4: 58,
      chapter5: 45,
      chapter6: 38,
      appendix: 92,
    },
    weeklySubmissionRate: {
      week1: 78,
      week2: 65,
      week3: 52,
      week4: 38,
    },
    recent7Days: {
      submissions: 24,
      feedbackCompleted: 18,
    },
  };

  // 피드백 미작성 과제 리스트
  const pendingFeedback = [
    {
      id: 1,
      menteeName: '김멘티',
      week: 1,
      brand: '브랜드A',
      submittedAt: '2024-01-15 14:30',
      daysSince: 2,
    },
    {
      id: 2,
      menteeName: '이멘티',
      week: 2,
      brand: '브랜드B',
      submittedAt: '2024-01-14 10:15',
      daysSince: 3,
    },
    {
      id: 3,
      menteeName: '박멘티',
      week: 1,
      brand: '브랜드C',
      submittedAt: '2024-01-13 16:45',
      daysSince: 4,
    },
  ];

  // 이탈 구간 높은 섹션
  const highDropoutSections = [
    {
      chapter: '2장',
      section: '전략 수립',
      part: '3-2 파트',
      dropoutRate: 40,
    },
    {
      chapter: '4장',
      section: '채널 운영',
      part: '2-1 파트',
      dropoutRate: 35,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="text-muted-foreground mt-2">전체 운영 상태와 멘티 학습 현황을 확인하세요</p>
      </div>

      {/* 캘린더 뷰 */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            캠프 일정 캘린더
          </CardTitle>
          <CardDescription>세션 일자가 있는 날짜에 캠프 제목이 표시됩니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
                modifiers={{
                  hasSession: sessionDates,
                }}
                modifiersClassNames={{
                  hasSession: 'bg-primary/10 border-primary border-2 font-semibold',
                }}
                classNames={{
                  cell: 'h-auto',
                  day: 'h-auto min-h-[120px]',
                }}
                components={{
                  Day: (dayProps: any) => {
                    const dateSessions = getSessionsForDate(dayProps.date);
                    const hasSession = dateSessions.length > 0;
                    
                    return (
                      <div className="relative w-full h-full min-h-[120px]">
                        <button
                          type="button"
                          className={`w-full h-full p-2 text-sm font-normal aria-selected:opacity-100 flex flex-col items-center justify-start min-h-[120px] ${
                            dayProps.selected ? 'bg-primary text-primary-foreground' : ''
                          } hover:bg-accent`}
                          onClick={() => dayProps.onClick?.(dayProps.date)}
                          aria-selected={dayProps.selected}
                          aria-label={format(dayProps.date, 'yyyy-MM-dd')}
                        >
                          <span className="mb-2 font-semibold">{format(dayProps.date, 'd')}</span>
                          {hasSession && (
                            <div className="w-full flex flex-col gap-1 mt-auto px-1">
                              {dateSessions.slice(0, 3).map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs px-1.5 py-1 rounded truncate w-full ${
                                    campTypeColors[item.camp.type] || 'bg-gray-500'
                                  } text-white shadow-sm`}
                                  title={item.camp.name}
                                >
                                  {item.camp.name}
                                </div>
                              ))}
                              {dateSessions.length > 3 && (
                                <div className="text-xs px-1.5 py-1 rounded bg-gray-400 text-white shadow-sm">
                                  +{dateSessions.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  },
                }}
              />
            </div>
          </div>
          {/* 캠프 유형 범례 */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">캠프 유형</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(campTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-xs text-muted-foreground">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 선택된 날짜의 캠프 목록 */}
      {selectedDate && campsOnSelectedDate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>선택된 날짜의 캠프</CardTitle>
            <CardDescription>
              {format(selectedDate, 'yyyy년 MM월 dd일')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getSessionsForDate(selectedDate).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/admin/camps/${item.camp.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={`${
                        campTypeColors[item.camp.type] || 'bg-gray-500'
                      } text-white border-0`}
                    >
                      {item.camp.type}
                    </Badge>
                    <Badge
                      variant={
                        item.camp.status === '진행중'
                          ? 'default'
                          : item.camp.status === '준비중'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {item.camp.status}
                    </Badge>
                  </div>
                  <div className="font-medium">{item.camp.name}</div>
                  {item.camp.clientName && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.camp.clientName}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.session.weekNo}주차 · {format(item.session.sessionDate, 'yyyy.MM.dd HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지표 블록 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 가입자 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">명</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 멘티 수</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              전체의 {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 7일 과제 제출</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent7Days.submissions}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 7일 피드백 완료</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent7Days.feedbackCompleted}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>
      </div>

      {/* 챕터별 완주율 */}
      <Card>
        <CardHeader>
          <CardTitle>챕터별 완주율</CardTitle>
          <CardDescription>각 챕터를 완료한 멘티 비율</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(stats.chapterCompletion).map(([chapter, rate]) => (
            <div key={chapter} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {chapter === 'chapter1'
                    ? '1장'
                    : chapter === 'chapter2'
                    ? '2장'
                    : chapter === 'chapter3'
                    ? '3장'
                    : chapter === 'chapter4'
                    ? '4장'
                    : chapter === 'chapter5'
                    ? '5장'
                    : chapter === 'chapter6'
                    ? '6장'
                    : '부록'}
                </span>
                <span className="font-medium">{rate}%</span>
              </div>
              <Progress value={rate} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 주차별 과제 제출률 */}
      <Card>
        <CardHeader>
          <CardTitle>주차별 과제 제출률</CardTitle>
          <CardDescription>각 주차별 과제 제출 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(stats.weeklySubmissionRate).map(([week, rate]) => (
              <div key={week} className="text-center space-y-2">
                <div className="text-2xl font-bold">{rate}%</div>
                <div className="text-sm text-muted-foreground">
                  {week.replace('week', '')}주차
                </div>
                <Progress value={rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 피드백 미작성 과제 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>피드백 미작성 과제</CardTitle>
          <CardDescription>우선 처리 필요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingFeedback.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{task.menteeName}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {task.week}주차 · {task.brand} · {task.submittedAt}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{task.daysSince}일 전 제출</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 이탈 구간 높은 섹션 알림 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            이탈 구간 높은 섹션
          </CardTitle>
          <CardDescription>이탈률이 높은 섹션을 확인하고 개선하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highDropoutSections.map((section, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/20"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {section.chapter} {section.section} {section.part}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    이탈률: {section.dropoutRate}%
                  </div>
                </div>
                <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30">
                  높음
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

