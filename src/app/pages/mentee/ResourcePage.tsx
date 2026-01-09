import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Search, ExternalLink, FileText, BarChart, TrendingUp, Users, BookOpen } from 'lucide-react';

const resources = {
  toolkit: [
    {
      id: 1,
      title: '콘텐츠 기획 템플릿',
      description: '콘텐츠 기획 시 사용할 수 있는 실무 템플릿 모음',
      link: 'https://notion.so/...',
      tags: ['템플릿', '기획'],
    },
    {
      id: 2,
      title: '캠페인 체크리스트',
      description: '캠페인 기획 시 확인해야 할 항목들',
      link: 'https://notion.so/...',
      tags: ['체크리스트', '캠페인'],
    },
  ],
  thread: [
    {
      id: 1,
      title: '인스타그램 스레드 운영법',
      description: '인스타그램 스레드로 브랜드 스토리텔링하기',
      link: 'https://notion.so/...',
      tags: ['인스타그램', '스레드'],
    },
    {
      id: 2,
      title: '스레드 기획 가이드',
      description: '효과적인 스레드 기획 방법',
      link: 'https://notion.so/...',
      tags: ['스레드', '기획'],
    },
  ],
  metrics: [
    {
      id: 1,
      title: '콘텐츠 마케팅 지표 가이드',
      description: '주요 지표와 측정 방법',
      link: 'https://notion.so/...',
      tags: ['지표', '분석'],
    },
    {
      id: 2,
      title: '대시보드 구축 방법',
      description: '효과적인 대시보드 설계 가이드',
      link: 'https://notion.so/...',
      tags: ['대시보드', '분석'],
    },
  ],
  reference: [
    {
      id: 1,
      title: '브랜드 A 콘텐츠 마케팅 사례',
      description: '성공적인 콘텐츠 마케팅 사례 분석',
      link: 'https://notion.so/...',
      tags: ['사례', '인스타그램'],
      channel: '인스타그램',
    },
    {
      id: 2,
      title: '브랜드 B 유튜브 전략',
      description: '유튜브를 활용한 브랜드 마케팅 전략',
      link: 'https://notion.so/...',
      tags: ['사례', '유튜브'],
      channel: '유튜브',
    },
  ],
  trends: [
    {
      id: 1,
      title: '2024 콘텐츠 마케팅 트렌드',
      description: '올해 주목해야 할 콘텐츠 마케팅 트렌드',
      link: 'https://notion.so/...',
      tags: ['트렌드', '2024'],
    },
    {
      id: 2,
      title: '쇼츠 콘텐츠 전략',
      description: '쇼츠 콘텐츠 기획과 제작 가이드',
      link: 'https://notion.so/...',
      tags: ['트렌드', '쇼츠'],
    },
  ],
};

const categoryIcons = {
  toolkit: FileText,
  thread: Users,
  metrics: BarChart,
  reference: BookOpen,
  trends: TrendingUp,
};

export function ResourcePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  const channels = ['인스타그램', '유튜브', '블로그', '틱톡'];

  const filterResources = (category: keyof typeof resources) => {
    let filtered = resources[category];

    if (searchQuery) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedChannel !== 'all') {
      filtered = filtered.filter(
        (resource) =>
          resource.tags.includes(selectedChannel) ||
          (resource as any).channel === selectedChannel
      );
    }

    return filtered;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">리소스 센터</h1>
        <p className="text-muted-foreground mt-2">
          실무에 도움이 되는 자료와 가이드를 확인하세요
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="리소스 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">모든 채널</option>
                {channels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 탭 */}
      <Tabs defaultValue="toolkit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="toolkit">실무 도움 키트</TabsTrigger>
          <TabsTrigger value="thread">스레드 운영법</TabsTrigger>
          <TabsTrigger value="metrics">지표/대시보드</TabsTrigger>
          <TabsTrigger value="reference">추천 레퍼런스</TabsTrigger>
          <TabsTrigger value="trends">마케팅 트렌드</TabsTrigger>
        </TabsList>

        {Object.keys(resources).map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const filteredResources = filterResources(category as keyof typeof resources);

          return (
            <TabsContent key={category} value={category} className="space-y-4">
              {filteredResources.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    검색 결과가 없습니다.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((resource) => (
                    <Card
                      key={resource.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => window.open(resource.link, '_blank')}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Icon className="h-5 w-5 text-primary mb-2" />
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

