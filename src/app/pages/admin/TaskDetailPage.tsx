import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Save, Send, Sparkles, FileText, Link as LinkIcon } from 'lucide-react';

export function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [feedbackTemplate, setFeedbackTemplate] = useState('week1');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [internalMemo, setInternalMemo] = useState('');

  // 실제로는 API에서 가져올 데이터
  const taskData = {
    id: 1,
    menteeName: '김멘티',
    menteeEmail: 'kim@example.com',
    week: 1,
    brand: '브랜드A',
    submittedAt: '2024-01-15 14:30',
    status: 'pending_feedback',
    submission: {
      textSummary: `
1. 페르소나 분석
- 타겟: 20-30대 직장인 여성
- 니즈: 업무 효율성 향상, 자기계발
- 페인포인트: 시간 부족, 정보 과다

2. 타겟 정의
- 명확한 페르소나 설정 완료
- 구체적인 니즈 파악

3. 체크리스트 결과
- 페르소나 분석: 완료
- 타겟 정의: 완료
- 경쟁사 분석: 미완료
      `,
      files: [
        { name: '페르소나_분석.pdf', url: 'https://example.com/file1.pdf' },
        { name: '타겟_정의.docx', url: 'https://example.com/file2.docx' },
      ],
      links: ['https://notion.so/example'],
      checklist: [
        { item: '페르소나 분석', checked: true },
        { item: '타겟 정의', checked: true },
        { item: '경쟁사 분석', checked: false },
        { item: '시장 조사', checked: true },
      ],
    },
  };

  // 피드백 템플릿 (실제로는 노션에서 가져올 구조)
  const feedbackTemplates = {
    week1: {
      title: '1주차 피드백 템플릿',
      sections: [
        {
          title: '✔️ [페르소나 분석]',
          guide: '페르소나가 구체적이고 명확한지 확인하세요. 연령, 직업, 니즈, 페인포인트가 잘 드러나는지 평가합니다.',
        },
        {
          title: '✔️ [타겟 정의]',
          guide: '타겟이 명확하게 정의되었는지 확인하세요. 페르소나와 일관성이 있는지 검토합니다.',
        },
      ],
    },
    week2: {
      title: '2주차 피드백 템플릿',
      sections: [
        {
          title: '✔️ [CJM 설계]',
          guide: '고객 여정 맵이 논리적으로 구성되었는지 확인하세요.',
        },
      ],
    },
  };

  const handleAutoGenerate = () => {
    // 자동 피드백 생성 로직 (향후 API 연동)
    const template = feedbackTemplates[feedbackTemplate as keyof typeof feedbackTemplates];
    let generatedContent = `안녕하세요 ${taskData.menteeName}님,\n\n1주차 과제 피드백을 드립니다.\n\n`;
    
    template.sections.forEach((section, index) => {
      generatedContent += `\n${section.title}\n`;
      generatedContent += `${section.guide}\n`;
      // 실제로는 과제 내용을 분석하여 맞춤형 피드백 생성
      generatedContent += `[자동 생성된 피드백 내용]\n`;
    });
    
    setFeedbackContent(generatedContent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div>
            <h1 className="text-3xl font-bold">과제 상세</h1>
            <p className="text-muted-foreground mt-1">
              {taskData.menteeName}님의 {taskData.week}주차 과제
            </p>
          </div>
        </div>
        <Badge variant="destructive">{taskData.status === 'pending_feedback' ? '피드백 대기' : '피드백 완료'}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 좌측: 멘티 제출 내용 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>멘티 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-muted-foreground">이름</Label>
                <div className="font-medium">{taskData.menteeName}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">이메일</Label>
                <div className="font-medium">{taskData.menteeEmail}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">주차</Label>
                <div className="font-medium">{taskData.week}주차</div>
              </div>
              <div>
                <Label className="text-muted-foreground">브랜드</Label>
                <div className="font-medium">{taskData.brand}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">제출 일시</Label>
                <div className="font-medium">{taskData.submittedAt}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>제출 내용</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">텍스트 요약</Label>
                <div className="whitespace-pre-wrap text-sm p-3 bg-muted rounded-lg">
                  {taskData.submission.textSummary}
                </div>
              </div>

              {taskData.submission.files.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    업로드 파일
                  </Label>
                  <div className="space-y-2">
                    {taskData.submission.files.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {taskData.submission.links.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    링크
                  </Label>
                  <div className="space-y-2">
                    {taskData.submission.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground mb-2 block">자기진단 체크리스트</Label>
                <div className="space-y-2">
                  {taskData.submission.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          item.checked ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`}
                      >
                        {item.checked && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={item.checked ? '' : 'text-muted-foreground'}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 피드백 작성 영역 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>피드백 작성</CardTitle>
              <CardDescription>템플릿을 선택하고 피드백을 작성하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">템플릿 선택</Label>
                <Select value={feedbackTemplate} onValueChange={setFeedbackTemplate}>
                  <SelectTrigger id="template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week1">1주차 템플릿</SelectItem>
                    <SelectItem value="week2">2주차 템플릿</SelectItem>
                    <SelectItem value="week3">3주차 템플릿</SelectItem>
                    <SelectItem value="week4">4주차 템플릿</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 템플릿 가이드 표시 */}
              {feedbackTemplates[feedbackTemplate as keyof typeof feedbackTemplates] && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {feedbackTemplates[feedbackTemplate as keyof typeof feedbackTemplates].title}
                  </div>
                  <div className="space-y-2 text-sm">
                    {feedbackTemplates[feedbackTemplate as keyof typeof feedbackTemplates].sections.map(
                      (section, index) => (
                        <div key={index}>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {section.guide}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <Button onClick={handleAutoGenerate} variant="outline" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                자동 초안 생성
              </Button>

              <div>
                <Label htmlFor="feedback">피드백 내용</Label>
                <Textarea
                  id="feedback"
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder="피드백을 작성하세요..."
                  className="min-h-[300px] mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  임시 저장
                </Button>
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  멘티에게 공개
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 내부 메모 */}
          <Card>
            <CardHeader>
              <CardTitle>내부 메모</CardTitle>
              <CardDescription>멘티에게는 보이지 않는 메모입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={internalMemo}
                onChange={(e) => setInternalMemo(e.target.value)}
                placeholder="진도, 커뮤니케이션 메모 등을 작성하세요..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

