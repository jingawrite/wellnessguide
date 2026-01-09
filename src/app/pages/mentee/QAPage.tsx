import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { MessageSquare, ExternalLink, Search } from 'lucide-react';

const faqs = [
  {
    category: '플레이북 사용 방법',
    items: [
      {
        question: '플레이북을 어떻게 사용하나요?',
        answer: '대시보드에서 오늘의 미션을 확인하고, 학습하기 메뉴에서 챕터를 순서대로 학습하세요. 각 챕터를 완료한 후 실습 과제를 진행하면 됩니다.',
      },
      {
        question: '진도를 어디서 확인할 수 있나요?',
        answer: '대시보드 상단에 전체 진도 바가 표시됩니다. 각 챕터의 학습 진행률도 챕터 뷰어에서 확인할 수 있습니다.',
      },
      {
        question: '노트 기능은 어떻게 사용하나요?',
        answer: '챕터 뷰어에서 "노트 열기" 버튼을 클릭하면 개인 메모를 작성할 수 있습니다. 메모는 자동으로 저장됩니다.',
      },
    ],
  },
  {
    category: '과제 관련 질문',
    items: [
      {
        question: '과제는 언제 제출해야 하나요?',
        answer: '각 주차별로 과제가 배정됩니다. 주차별 마감일을 확인하고 그 전에 제출하시면 됩니다.',
      },
      {
        question: '과제 제출 후 수정할 수 있나요?',
        answer: '제출 후에는 수정할 수 없습니다. 제출 전에 임시 저장 기능을 활용하여 충분히 검토한 후 제출하세요.',
      },
      {
        question: '피드백은 언제 받을 수 있나요?',
        answer: '과제 제출 후 운영자가 검토하여 피드백을 제공합니다. 피드백 상태는 과제 상세 페이지에서 확인할 수 있습니다.',
      },
      {
        question: '자기 진단 체크리스트는 필수인가요?',
        answer: '자기 진단 체크리스트는 필수는 아니지만, 과제의 완성도를 높이기 위해 제출 전에 확인하는 것을 권장합니다.',
      },
    ],
  },
  {
    category: '커리어/직무 관련 FAQ',
    items: [
      {
        question: '포트폴리오는 어떻게 만들 수 있나요?',
        answer: '각 주차별 과제를 완료하고 피드백을 받아 개선하면, 이를 포트폴리오로 활용할 수 있습니다. 리소스 센터에서 포트폴리오 가이드를 확인하세요.',
      },
      {
        question: '이직 준비에 도움이 되나요?',
        answer: '네, 실무형 콘텐츠 마케팅 역량을 키우고 포트폴리오를 구축할 수 있어 이직 준비에 도움이 됩니다.',
      },
    ],
  },
];

export function QAPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">자주 묻는 질문</h1>
        <p className="text-muted-foreground mt-2">궁금한 점을 빠르게 찾아보세요</p>
      </div>

      {/* 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ 목록 */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              검색 결과가 없습니다.
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 오픈채팅 바로가기 */}
      <Card>
        <CardHeader>
          <CardTitle>더 궁금한 점이 있나요?</CardTitle>
          <CardDescription>
            오픈채팅방에서 다른 멘티들과 함께 소통하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => window.open('https://open.kakao.com/o/...', '_blank')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            오픈채팅방 바로가기
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            비밀번호: <span className="font-mono font-semibold">0185</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

