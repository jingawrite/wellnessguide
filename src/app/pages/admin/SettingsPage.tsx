import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Settings, Palette, Bell, Link as LinkIcon, BarChart } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    serviceName: '진가 구조화 캠프',
    logo: '',
    primaryColor: '#3b82f6',
    noticeBanner: '',
    notionTemplateLink: 'https://notion.so/example',
    kakaoOpenChatLink: 'https://open.kakao.com/o/...',
    gaTrackingId: '',
  });

  const handleSave = () => {
    // 실제로는 API 호출
    console.log('설정 저장:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">시스템 설정</h1>
        <p className="text-muted-foreground mt-2">서비스 기본 설정과 외부 연동을 관리하세요</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">기본 설정</TabsTrigger>
          <TabsTrigger value="external">외부 연동</TabsTrigger>
        </TabsList>

        {/* 기본 설정 탭 */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                기본 정보
              </CardTitle>
              <CardDescription>서비스명, 로고, 컬러셋을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceName">서비스명</Label>
                <Input
                  id="serviceName"
                  value={settings.serviceName}
                  onChange={(e) => setSettings({ ...settings, serviceName: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="logo">로고 URL</Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">기본 컬러</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                공지 배너
              </CardTitle>
              <CardDescription>메인 화면에 표시될 공지사항을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="noticeBanner">배너 문구</Label>
                <Textarea
                  id="noticeBanner"
                  value={settings.noticeBanner}
                  onChange={(e) => setSettings({ ...settings, noticeBanner: e.target.value })}
                  placeholder="예: 휴강 안내, 업데이트 안내 등"
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 외부 연동 탭 */}
        <TabsContent value="external" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                외부 링크 설정
              </CardTitle>
              <CardDescription>노션 템플릿, 카카오 오픈채팅 등 외부 링크를 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notionTemplateLink">노션 템플릿 링크</Label>
                <Input
                  id="notionTemplateLink"
                  value={settings.notionTemplateLink}
                  onChange={(e) =>
                    setSettings({ ...settings, notionTemplateLink: e.target.value })
                  }
                  placeholder="https://notion.so/..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="kakaoOpenChatLink">카카오 오픈채팅 링크</Label>
                <Input
                  id="kakaoOpenChatLink"
                  value={settings.kakaoOpenChatLink}
                  onChange={(e) =>
                    setSettings({ ...settings, kakaoOpenChatLink: e.target.value })
                  }
                  placeholder="https://open.kakao.com/o/..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                분석 툴 설정
              </CardTitle>
              <CardDescription>Google Analytics 등 분석 툴을 연동하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="gaTrackingId">Google Analytics Tracking ID</Label>
                <Input
                  id="gaTrackingId"
                  value={settings.gaTrackingId}
                  onChange={(e) => setSettings({ ...settings, gaTrackingId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          설정 저장
        </Button>
      </div>
    </div>
  );
}

