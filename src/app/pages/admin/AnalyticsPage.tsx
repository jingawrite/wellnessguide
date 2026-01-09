import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react';

export function AnalyticsPage() {
  // 실제로는 API에서 가져올 데이터
  const sectionAnalytics = [
    {
      chapter: '1장',
      section: '직무 이해',
      part: '1-1',
      avgTime: 25,
      dropoutRate: 5,
      completionRate: 95,
    },
    {
      chapter: '2장',
      section: '전략 수립',
      part: '3-2',
      avgTime: 35,
      dropoutRate: 40,
      completionRate: 60,
    },
    {
      chapter: '4장',
      section: '채널 운영',
      part: '2-1',
      avgTime: 30,
      dropoutRate: 35,
      completionRate: 65,
    },
  ];

  const weeklySubmissions = [
    { week: 1, submissions: 78, feedbackCompleted: 65 },
    { week: 2, submissions: 65, feedbackCompleted: 52 },
    { week: 3, submissions: 52, feedbackCompleted: 38 },
    { week: 4, submissions: 38, feedbackCompleted: 25 },
  ];

  const feedbackSpeed = {
    average: 2.5,
    median: 2,
    fastest: 0.5,
    slowest: 7,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">통계 / 인사이트</h1>
        <p className="text-muted-foreground mt-2">학습 데이터를 분석하고 인사이트를 확인하세요</p>
      </div>

      {/* 섹션별 체류 시간 및 이탈률 */}
      <Card>
        <CardHeader>
          <CardTitle>섹션별 분석</CardTitle>
          <CardDescription>체류 시간, 이탈률, 완주율을 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectionAnalytics.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {section.chapter} {section.section} {section.part}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      평균 체류 시간: {section.avgTime}분
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">이탈률</div>
                    <div
                      className={`text-lg font-bold ${
                        section.dropoutRate > 30 ? 'text-destructive' : 'text-foreground'
                      }`}
                    >
                      {section.dropoutRate}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>완주율</span>
                    <span className="font-medium">{section.completionRate}%</span>
                  </div>
                  <Progress value={section.completionRate} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 주차별 과제 제출률 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>주차별 과제 제출률</CardTitle>
          <CardDescription>주간/월간 과제 제출 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklySubmissions.map((week) => (
              <div key={week.week} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{week.week}주차</span>
                  <span className="text-muted-foreground">
                    제출: {week.submissions}건 / 피드백 완료: {week.feedbackCompleted}건
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>제출률</span>
                      <span>{week.submissions}%</span>
                    </div>
                    <Progress value={week.submissions} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>피드백 완료율</span>
                      <span>
                        {Math.round((week.feedbackCompleted / week.submissions) * 100)}%
                      </span>
                    </div>
                    <Progress value={(week.feedbackCompleted / week.submissions) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 피드백 처리 속도 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            피드백 처리 속도
          </CardTitle>
          <CardDescription>제출일부터 피드백 공개까지 평균 시간</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{feedbackSpeed.average}일</div>
              <div className="text-sm text-muted-foreground mt-1">평균</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{feedbackSpeed.median}일</div>
              <div className="text-sm text-muted-foreground mt-1">중앙값</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{feedbackSpeed.fastest}일</div>
              <div className="text-sm text-muted-foreground mt-1">최단</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{feedbackSpeed.slowest}일</div>
              <div className="text-sm text-muted-foreground mt-1">최장</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 향후: 과제 패턴 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>과제 패턴 분석 (향후)</CardTitle>
          <CardDescription>멘티들이 많이 막히는 항목 분석</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            향후 구현 예정: 페르소나/타겟 정의 누락 빈도, CJM 단계별 누락 패턴 등
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

