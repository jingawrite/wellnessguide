import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  BookOpen,
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';

export function ContentManagementPage() {
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: '1장. 콘텐츠 마케팅 직무란?',
      sections: [
        { id: 1, title: '1-1. 직무 이해', published: true, updatedAt: '2024-01-10' },
        { id: 2, title: '1-2. 기본 개념', published: true, updatedAt: '2024-01-10' },
      ],
      published: true,
      updatedAt: '2024-01-10',
    },
    {
      id: 2,
      title: '2장. 콘텐츠 마케팅 전략 수립',
      sections: [
        { id: 3, title: '2-1. 전략 기획', published: true, updatedAt: '2024-01-12' },
        { id: 4, title: '2-2. 목표 설정', published: false, updatedAt: '2024-01-13' },
      ],
      published: true,
      updatedAt: '2024-01-13',
    },
  ]);

  const [resources, setResources] = useState([
    {
      id: 1,
      title: '실무 도움 키트',
      description: '콘텐츠 마케팅 실무에 필요한 템플릿 모음',
      link: 'https://example.com',
      tags: ['템플릿', '실무'],
      order: 1,
    },
    {
      id: 2,
      title: '스레드 운영법',
      description: '스레드 기반 콘텐츠 운영 가이드',
      link: 'https://example.com',
      tags: ['채널', '운영'],
      order: 2,
    },
  ]);

  const toggleChapterPublish = (chapterId: number) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, published: !ch.published } : ch
      )
    );
  };

  const toggleSectionPublish = (chapterId: number, sectionId: number) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              sections: ch.sections.map((sec) =>
                sec.id === sectionId ? { ...sec, published: !sec.published } : sec
              ),
            }
          : ch
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">콘텐츠 관리</h1>
        <p className="text-muted-foreground mt-2">챕터와 리소스를 관리하세요</p>
      </div>

      <Tabs defaultValue="chapters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chapters">챕터 관리</TabsTrigger>
          <TabsTrigger value="resources">부록·리소스 관리</TabsTrigger>
        </TabsList>

        {/* 챕터 관리 탭 */}
        <TabsContent value="chapters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>챕터 리스트</CardTitle>
                  <CardDescription>장/섹션을 관리하고 공개 여부를 설정하세요</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 챕터 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <Card key={chapter.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                          <div>
                            <CardTitle className="text-lg">{chapter.title}</CardTitle>
                            <CardDescription>수정일: {chapter.updatedAt}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={chapter.published}
                            onCheckedChange={() => toggleChapterPublish(chapter.id)}
                          />
                          {chapter.published ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 pl-8">
                        {chapter.sections.map((section) => (
                          <div
                            key={section.id}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{section.title}</div>
                              <div className="text-sm text-muted-foreground">
                                수정일: {section.updatedAt}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={section.published}
                                onCheckedChange={() =>
                                  toggleSectionPublish(chapter.id, section.id)
                                }
                              />
                              {section.published ? (
                                <Eye className="h-4 w-4 text-green-500" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          새 섹션 추가
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 부록·리소스 관리 탭 */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>리소스 카드 관리</CardTitle>
                  <CardDescription>부록 리소스를 관리하고 정렬 순서를 조정하세요</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 리소스 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center gap-3 p-4 border rounded-lg"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div className="flex-1">
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {resource.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {resource.link}
                        </a>
                        <div className="flex gap-1">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

