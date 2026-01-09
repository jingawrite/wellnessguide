import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, ArrowRight, Users, BookOpen, Target, Award, Briefcase, GraduationCap, Star } from 'lucide-react';

const curriculum = [
  { id: 1, title: '콘텐츠 마케팅 직무란?', description: '직무 이해와 기본 개념' },
  { id: 2, title: '콘텐츠 마케팅 전략 수립', description: '전략 기획과 목표 설정' },
  { id: 3, title: '콘텐츠 기획과 제작', description: '기획부터 제작까지' },
  { id: 4, title: '채널 운영', description: '다양한 채널별 운영법' },
  { id: 5, title: '캠페인 기획', description: '캠페인 설계와 실행' },
  { id: 6, title: '실무 팁', description: '실전 노하우와 팁' },
];

const benefits = [
  '30일 동안 체계적인 커리큘럼',
  '주차별 실습 과제와 피드백',
  '실무형 콘텐츠 마케터로 성장',
  '포트폴리오 구축',
];

const targets = [
  { icon: Users, title: '입문자', description: '콘텐츠 마케팅을 처음 시작하는 분' },
  { icon: BookOpen, title: '주니어 마케터', description: '실무 경험을 쌓고 싶은 분' },
  { icon: Target, title: '이직 준비자', description: '포트폴리오를 만들고 싶은 분' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              콘텐츠마케팅 30일 플레이북
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              30일 동안 따라 하면 실무형 콘텐츠 마케터로 성장할 수 있습니다
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate('/signup')}>
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/mentee/dashboard')}>
                커리큘럼 자세히 보기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">이렇게 변화합니다</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardHeader>
                <CheckCircle2 className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">{benefit}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">커리큘럼 요약</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {chapter.id}
                    </span>
                    {chapter.title}
                  </CardTitle>
                  <CardDescription>{chapter.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">이런 분들을 위해 만들었어요</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {targets.map((target) => {
            const Icon = target.icon;
            return (
              <Card key={target.title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{target.title}</CardTitle>
                  <CardDescription>{target.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mentor Profile Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">진가 이력</h2>
            <p className="text-muted-foreground">실무 경험과 강의 노하우를 바탕으로 만든 커리큘럼입니다</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                현재 직무
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">코멘토 콘텐츠마케팅 직무부트캠프 멘토</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-muted-foreground">강의 만족도 4.9점 / 5.0점</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <p className="font-medium">IT 기업 C사 Product Owner</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                경력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">전) IT 기업 S사 콘텐츠/그로스 마케터</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    인스타그램 15만 채널 운영 · 페이스북 30만 채널 운영
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                출간 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">&lt;Simplify Me&gt; 출간</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    와비사비클럽, 2023.12 · 독립서점 4곳 입고 · 텀블벅 펀딩 목표비 245% 달성
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">독립출판 서적 출간</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    2020 · 독립서점 3곳 입고 · 업무용 다이어리 텀블벅 펀딩 목표비 175% 달성
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">콘텐츠 마케팅 전자책 출간</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Class101, 탈잉, 프립, 크몽, 2021.10
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">&lt;AI활용 PPT 스킬업&gt; 전자책 발간</p>
                  <p className="text-sm text-muted-foreground mt-1">탈잉, 2024.10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                강의 및 멘토링
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">코멘토 콘텐츠마케팅 직무부트캠프 멘토</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    300명+ 수강 · 99% 만족도 달성 · 과제 피드백 1천건+ 제공
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">프립 '피카타임' 호스트</p>
                  <p className="text-sm text-muted-foreground mt-1">정리 워크숍 진행, 2021</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                기관 제휴 강의
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                코멘토 기관제휴강의 진행 기관:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '서울대학교 대학원',
                  '연세대학교',
                  '한국외국어대학교',
                  '건국대학교',
                  '강남대학교',
                  '단국대학교',
                  '용인대학교',
                  '수원대학교',
                  '서울신학대학교',
                  '충북대학교',
                  '호서대학교',
                  '한신대학교',
                  '김포시청',
                  '고양시청일자리센터',
                  '충주여성인력개발센터',
                  '스마트공동체사업단',
                  '광주여자상업고등학교',
                ].map((institution) => (
                  <Badge key={institution} variant="secondary" className="text-xs">
                    {institution}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">지금 시작하세요</h2>
          <p className="text-lg opacity-90">
            30일 동안 체계적으로 학습하고 실무 역량을 키워보세요
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
            무료로 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

