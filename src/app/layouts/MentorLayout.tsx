import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar';
import { BookOpen, Home, FileText, MessageSquare, FolderOpen, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';

const menuItems = [
  {
    title: '대시보드',
    icon: Home,
    url: '/mentee/dashboard',
  },
  {
    title: '학습하기',
    icon: BookOpen,
    url: '/mentee/chapter/1',
  },
  {
    title: '실습 과제',
    icon: FileText,
    url: '/mentee/task/1',
  },
  {
    title: '리소스 센터',
    icon: FolderOpen,
    url: '/mentee/resources',
  },
  {
    title: 'Q&A',
    icon: HelpCircle,
    url: '/mentee/qa',
  },
];

export function MentorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">진</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">진가 구조화 캠프</h2>
              <p className="text-xs text-muted-foreground">멘티용</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>메뉴</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={isActive}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <LogOut className="h-4 w-4" />
            <span className="ml-2">로그아웃</span>
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

