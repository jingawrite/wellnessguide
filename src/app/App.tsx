import { useState } from 'react';
import { ContentCard } from './components/ContentCard';
import { ContentDetail } from './components/ContentDetail';

interface Content {
  id: number;
  title: string;
  image: string;
  videoId: string;
  comment: string;
  products?: { name: string; link: string; }[];
}

const contents: Content[] = [
  {
    id: 1,
    title: '나에게 잘 맞는 여행지를 찾는법',
    image: 'https://images.unsplash.com/photo-1721908919568-4003760b6c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMGJlYWNofGVufDF8fHx8MTc2NjI2ODA4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    videoId: 'dQw4w9WgXcQ',
    comment: '여행지를 선택할 때는 자신의 에너지 레벨과 선호하는 활동 유형을 먼저 파악하는 것이 중요합니다.\n\n조용한 힐링을 원한다면 자연 속 리조트를, 활력을 원한다면 도시 탐험을 추천합니다. 계절과 예산도 고려하여 최적의 타이밍을 찾아보세요.',
    products: [
      { name: '트래블 가이드북 세트', link: '#' },
      { name: '여행용 아로마 디퓨저', link: '#' }
    ]
  },
  {
    id: 2,
    title: '잡티 없는 피부로 가꾸는 법',
    image: 'https://images.unsplash.com/photo-1566812335496-af416725bc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGJlYXV0eSUyMG5hdHVyYWx8ZW58MXx8fHwxNzY2MzAzMDY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    videoId: 'dQw4w9WgXcQ',
    comment: '잡티 개선의 핵심은 꾸준한 자외선 차단과 각질 관리입니다.\n\n매일 SPF 50+ 선크림을 사용하고, 일주일에 2-3회 순한 각질 제거제로 피부 턴오버를 도와주세요. 비타민 C 세럼을 아침 루틴에 추가하면 더욱 효과적입니다.',
    products: [
      { name: '비타민 C 세럼', link: '#' },
      { name: '저자극 각질 제거 토너', link: '#' },
      { name: 'SPF 50+ 선크림', link: '#' }
    ]
  },
  {
    id: 3,
    title: '피부 좋아지는 방법',
    image: 'https://images.unsplash.com/photo-1759216852567-5e1dd25f79f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHNwYSUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzY2MzAzMDY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    videoId: 'dQw4w9WgXcQ',
    comment: '건강한 피부의 기본은 충분한 수분 섭취와 숙면입니다.\n\n하루 2리터 이상의 물을 마시고, 저녁 10시~새벽 2시 사이에는 꼭 수면을 취하세요. 스트레스 관리도 중요합니다. 명상이나 요가로 마음의 평온을 유지하면 피부 상태도 자연스럽게 개선됩니다.'
  }
];

export default function App() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  if (selectedContent) {
    return (
      <ContentDetail
        title={selectedContent.title}
        videoId={selectedContent.videoId}
        comment={selectedContent.comment}
        products={selectedContent.products}
        onBack={() => setSelectedContent(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-foreground mb-2">웰니스 가이드</h1>
          <p className="text-muted-foreground">큐레이터 진가가 전하는 웰니스 꿀팁</p>
        </header>

        <div className="space-y-4">
          {contents.map((content) => (
            <ContentCard
              key={content.id}
              id={content.id}
              title={content.title}
              image={content.image}
              onClick={() => setSelectedContent(content)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
