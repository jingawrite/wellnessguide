import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { FileText, Link as LinkIcon, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

// 샘플 데이터
const sampleSubmission = {
  taskId: '1',
  week: 1,
  title: '1주차 과제: 페르소나 분석',
  brand: '나의 브랜드',
  summary: `
브랜드의 타겟 고객은 20대 후반~30대 초반 직장인 여성입니다.
이들은 시간이 부족하고 효율적인 쇼핑을 선호합니다.
리뷰 분석 결과, 제품의 실용성과 가성비를 중시하는 것으로 나타났습니다.
  `,
  files: ['페르소나_분석.pdf'],
  links: ['https://notion.so/...'],
  submittedAt: '2024-01-15',
};

const sampleFeedback = {
  status: 'completed', // 'submitted' | 'feedback_waiting' | 'completed'
  evaluationCriteria: `
## 수행목적 및 평가 기준
- 페르소나 설정의 명확성
- 데이터 기반 근거의 충실성
- 브랜드와의 연관성
  `,
  goodPoints: `
## 잘한 점
- 리뷰 데이터를 활용한 페르소나 분석이 잘 되어 있습니다.
- 구체적인 니즈와 페인포인트를 잘 파악했습니다.
- 브랜드 특성과 잘 연결되어 있습니다.
  `,
  improvements: `
## 개선할 점
- 페르소나의 구체적인 행동 패턴을 더 자세히 작성하면 좋겠습니다.
- 경쟁사 분석 관점을 추가하면 더욱 완성도 높은 분석이 될 것 같습니다.
  `,
  nextSteps: `
## 다음 주차와 연결되는 코멘트
다음 주차에서는 이 페르소나를 기반으로 CJM을 설계하게 됩니다.
페르소나의 니즈와 페인포인트를 CJM의 각 단계에 반영해보세요.
  `,
  feedbackDate: '2024-01-16',
};

const reflectionChecklist = [
  '피드백의 잘한 점을 확인했다',
  '개선할 점을 이해했다',
  '다음 주차 연결 코멘트를 확인했다',
  '수정이 필요한 부분을 파악했다',
];

export function FeedbackPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleChecklistChange = (item: string, checked: boolean) => {
    setCheckedItems({ ...checkedItems, [item]: checked });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/mentee/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <div className="mt-4">
            <Badge variant="secondary" className="mb-2">
              {sampleSubmission.week}주차
            </Badge>
            <h1 className="text-3xl font-bold">{sampleSubmission.title}</h1>
            <p className="text-muted-foreground mt-2">브랜드: {sampleSubmission.brand}</p>
          </div>
        </div>
        <Badge
          variant={
            sampleFeedback.status === 'completed'
              ? 'default'
              : sampleFeedback.status === 'feedback_waiting'
              ? 'secondary'
              : 'outline'
          }
        >
          {sampleFeedback.status === 'completed'
            ? '피드백 확인 완료'
            : sampleFeedback.status === 'feedback_waiting'
            ? '피드백 대기'
            : '제출 완료'}
        </Badge>
      </div>

      {/* 멘티 제출 내용 */}
      <Card>
        <CardHeader>
          <CardTitle>제출한 내용</CardTitle>
          <CardDescription>제출일: {sampleSubmission.submittedAt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">요약</h3>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{sampleSubmission.summary}</pre>
            </div>
          </div>

          {sampleSubmission.files.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">업로드 파일</h3>
              <div className="space-y-2">
                {sampleSubmission.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sampleSubmission.links.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">외부 링크</h3>
              <div className="space-y-2">
                {sampleSubmission.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 피드백 블록 */}
      {sampleFeedback.status !== 'submitted' && (
        <Card>
          <CardHeader>
            <CardTitle>피드백</CardTitle>
            <CardDescription>피드백일: {sampleFeedback.feedbackDate}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 수행목적 및 평가 기준 */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                수행목적 및 평가 기준
              </h3>
              <div className="prose prose-sm max-w-none mt-2">
                <pre className="whitespace-pre-wrap font-sans">{sampleFeedback.evaluationCriteria}</pre>
              </div>
            </div>

            <Separator />

            {/* 잘한 점 */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                잘한 점
              </h3>
              <div className="prose prose-sm max-w-none mt-2">
                <pre className="whitespace-pre-wrap font-sans">{sampleFeedback.goodPoints}</pre>
              </div>
            </div>

            <Separator />

            {/* 개선할 점 */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                개선할 점
              </h3>
              <div className="prose prose-sm max-w-none mt-2">
                <pre className="whitespace-pre-wrap font-sans">{sampleFeedback.improvements}</pre>
              </div>
            </div>

            <Separator />

            {/* 다음 주차 연결 */}
            <div>
              <h3 className="font-semibold mb-2">다음 주차와 연결되는 코멘트</h3>
              <div className="prose prose-sm max-w-none mt-2">
                <pre className="whitespace-pre-wrap font-sans">{sampleFeedback.nextSteps}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 피드백 반영 체크리스트 */}
      {sampleFeedback.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>피드백 반영 체크리스트</CardTitle>
            <CardDescription>피드백을 확인하고 스스로 체크해보세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reflectionChecklist.map((item) => (
              <div key={item} className="flex items-start space-x-2">
                <Checkbox
                  id={item}
                  checked={checkedItems[item] || false}
                  onCheckedChange={(checked) => handleChecklistChange(item, checked === true)}
                  className="mt-1"
                />
                <Label htmlFor={item} className="cursor-pointer text-sm">
                  {item}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 수정본 다시 정리하기 */}
      {sampleFeedback.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>수정본 다시 정리해보기</CardTitle>
            <CardDescription>피드백을 반영한 수정 사항을 메모해보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="피드백을 반영한 수정 사항을 작성하세요..."
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

