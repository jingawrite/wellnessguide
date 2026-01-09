import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { FileText, Upload, Link as LinkIcon, Save, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';

const weekTasks: Record<string, any> = {
  '1': {
    week: 1,
    title: '1주차 과제: 페르소나 분석',
    description: `
이번 주차에서는 브랜드의 타겟 고객을 명확히 정의하는 페르소나 분석을 진행합니다.

## 과제 내용
1. 브랜드를 선택하세요
2. 타겟 고객의 페르소나를 정의하세요
3. 페르소나의 니즈와 페인포인트를 분석하세요
4. 분석 결과를 문서로 정리하세요

## 유의사항
- 실제 데이터 기반으로 분석하세요
- 단순 주장이 아닌 근거를 제시하세요
- 리뷰, 프로모션, 협업 타겟 등에서 근거를 가져오세요
    `,
    examples: `
## 예시
- 페르소나: 20대 후반 직장인 여성
- 니즈: 시간 절약, 효율적인 쇼핑
- 페인포인트: 쇼핑 시간 부족, 제품 정보 부족
    `,
  },
  '2': {
    week: 2,
    title: '2주차 과제: CJM 설계',
    description: `
고객 여정 맵(Customer Journey Map)을 설계하여 각 단계별 콘텐츠와 채널을 배치합니다.

## 과제 내용
1. 페르소나를 기반으로 CJM을 설계하세요
2. 각 단계(인지-관심-비교-구매-재구매)에 채널과 콘텐츠를 배치하세요
3. 서비스 기획 관점이 아닌 콘텐츠 마케팅 관점에서 작성하세요

## 유의사항
- 각 단계별로 구체적인 콘텐츠를 제시하세요
- 채널별 특성을 고려하세요
    `,
    examples: `
## 예시
- 인지 단계: 인스타그램 광고, 인플루언서 협업
- 관심 단계: 블로그 리뷰, 유튜브 제품 소개
- 비교 단계: 비교 가이드, 사용자 후기
    `,
  },
};

const selfChecklist = {
  '1': [
    { id: 'data-based', label: '데이터 기반 근거를 썼는가?' },
    { id: 'no-claim', label: '단순 주장/느낌만 있는 부분은 없는가?' },
    { id: 'persona-source', label: '페르소나 설정 근거를 리뷰/프로모션/협업 타겟 등에서 가져왔는가?' },
    { id: 'persona-meaningful', label: '해당 페르소나가 브랜드에 유의미한 공통 특성을 가지고 있는가?' },
  ],
  '2': [
    { id: 'cjm-stages', label: '각 단계별(인지–관심–비교–구매–재구매)에 채널·콘텐츠를 배치했는가?' },
    { id: 'content-perspective', label: '서비스 기획 관점이 아니라 콘텐츠 마케팅 관점에서 보완점을 썼는가?' },
  ],
};

export function TaskPage() {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const task = weekTasks[weekId || '1'] || weekTasks['1'];
  const checklist = selfChecklist[weekId || '1'] || selfChecklist['1'];

  const [brand, setBrand] = useState('');
  const [summary, setSummary] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showExamples, setShowExamples] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    // TODO: 실제 제출 로직 구현
    alert('과제가 제출되었습니다.');
    navigate('/mentee/dashboard');
  };

  const handleSaveDraft = () => {
    // TODO: 임시 저장 로직 구현
    alert('임시 저장되었습니다.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{task.week}주차</Badge>
          <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="brand">브랜드명</Label>
          <Input
            id="brand"
            placeholder="브랜드명을 입력하세요"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 과제 설명 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>과제 설명</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{task.description}</pre>
              </div>

              <Collapsible open={showExamples} onOpenChange={setShowExamples}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span>유의사항/예시 보기</span>
                    {showExamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-4 bg-muted rounded-md">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{task.examples}</pre>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* 자기 진단 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>자기 진단 체크리스트</CardTitle>
              <CardDescription>제출 전에 스스로 확인해보세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={(checked) =>
                      setCheckedItems({ ...checkedItems, [item.id]: checked === true })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor={item.id} className="cursor-pointer text-sm">
                    {item.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 우측: 제출 영역 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>과제 제출</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 텍스트 에디터 */}
              <div className="space-y-2">
                <Label htmlFor="summary">기획서 요약 / 핵심 내용</Label>
                <Textarea
                  id="summary"
                  placeholder="과제의 핵심 내용을 요약하여 작성하세요..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {/* 파일 업로드 */}
              <div className="space-y-2">
                <Label>파일 업로드</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      클릭하여 파일 업로드 (PDF, PPT, 이미지)
                    </span>
                  </label>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 외부 링크 */}
              <div className="space-y-2">
                <Label htmlFor="link">외부 링크 (노션, 구글슬라이드 등)</Label>
                <div className="flex gap-2">
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://..."
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => externalLink && window.open(externalLink, '_blank')}
                    disabled={!externalLink}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  임시 저장
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={!summary || !brand}>
                  <Send className="h-4 w-4 mr-2" />
                  제출하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

