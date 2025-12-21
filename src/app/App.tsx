import { useState } from 'react';
import { ContentCard } from './components/ContentCard';
import { ContentDetail } from './components/ContentDetail';

interface Content {
  id: number;
  title: string;
  image: string;
  videoId?: string;
  imageUrl?: string;
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
  },
  {
    id: 4,
    title: '도로 위의 \'느리게 가기\'가 주는 여유',
    image: '/driving-slow.jpg',
    imageUrl: '/driving-slow.jpg',
    comment: '초보운전을 막 떼던 그날, 핸들을 잡고 도로 위에 처음 나섰을 때가 아직도 생생해요.\n창밖으로 스치는 바람이 긴장으로 딱 굳어 있던 어깨를 살짝 풀어주던 그 느낌이 아직도 기억나요.\n\n그때 깨달은 게 있어요.\n운전은 꼭 빠르고 효율적으로만 해야 하는 게 아니구나, 하는 생각이었어요.\n속도를 욕심내지 않고, 제한 속도에 맞춰 천천히 흐르듯 달리다 보면\n그 이동 시간은 단순한 \'이동\'이 아니라 나만의 작은 명상이 되더라고요.\n\n도로 위에서 속도를 내지 않고 천천히 가는 그 리듬.\n바람 소리, 엔진 소리, 멀리 보이는 풍경이 겹겹이 쌓이면서\n몸이 스르륵 풀어지고, 마음도 같이 느려져요.\n빨리 가려고 애쓰지 않아도 제시간에만 도착하면, 그 순간이 더 소중하게 느껴져요.\n\'오늘도 잘 왔다\'라는 안도감까지 덤으로 따라와요.\n\n저는 가끔 출퇴근길이나 주말 드라이브를 할 때\n일부러 좋아하는 노래만 골라 틀고, 창문을 살짝 내려요.\n그러면 하루의 피로가 바람 따라 뒤로 흘러가버리는 것 같아요.\n운전이 더 이상 스트레스가 아니라, 나를 위한 **힐링 타임**이 되는 거예요.\n완벽한 드라이브 코스가 아니어도, 그 느린 여유가 조금씩 차곡차곡 쌓인다는 건 확실한 것 같아요.\n\n그 느린 리듬을 더 오래 느끼기 좋은 곳으로, 하남의 **흠커피 HCR**을 추천해요.\n서하남에 자리한 3층짜리 대형 베이커리 카페라 드라이브 코스로도 딱 좋고,\n주차장도 넓어서 서두르지 않고 천천히 차를 세울 수 있어요.\n루프탑에 올라가 바람 쐬며 앉아 있으면, 방금까지 도로 위에서 타고 오던 그 속도가\n조용히 식어가면서 진짜 \'쉼\'으로 바뀌는 느낌이 들어요.\n\n소금빵이나 휘낭시에 같은 디저트가 듬뿍 기다리고 있어서\n천천히 운전해 도착하면, 그 시간까지도 모두 포함해서 더 행복해지는 것 같아요.\n저는 이곳에 앉아 커피 한 모금 마실 때마다\n방금 운전하며 유지했던 그 느린 리듬이 그대로 이어지는 기분이 들어요.\n엔진 소리 대신 잔잔한 음악과 카페 소음이 배경이 되는, 두 번째 드라이브 같다고 느껴져요.\n\n요즘 운전하면서는 어떤 노래를 가장 자주 듣고 있나요?\n그 플레이리스트 하나만으로도 분위기와 속도가 달라지지 않나요?\n조금은 느리게, 조금은 부드럽게.\n\n**오늘 해볼 만한 작은 실천 하나예요.**\n다음에 드라이브를 갈 때는 내비 속 예상 도착 시간보다\n마음을 먼저 앞서 보내지 말고, 오히려 속도를 한 번 낮춰보는 거예요.\n창문을 살짝 내리고, 좋아하는 노래 한 곡만 제대로 들어보세요.\n\n그 바람과 멜로디에 몸을 살짝 맡겨봐요.\n목적지보다 \'가는 시간\'에 초점을 두고 달려 보면,\n작은 여유가 천천히 쌓여 가는 기분을 분명 느끼게 될 거예요.',
    products: [
      { name: '하남 흠커피 HCR', link: 'https://naver.me/F9NjkaVS' }
    ]
  }
];

export default function App() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  if (selectedContent) {
    return (
      <ContentDetail
        title={selectedContent.title}
        videoId={selectedContent.videoId}
        imageUrl={selectedContent.imageUrl}
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
