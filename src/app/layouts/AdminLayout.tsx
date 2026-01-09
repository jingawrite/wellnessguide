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
import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const menuItems = [
  {
    title: '대시보드',
    icon: LayoutDashboard,
    url: '/admin/dashboard',
  },
  {
    title: '캠프 관리',
    icon: Calendar,
    url: '/admin/camps',
  },
  {
    title: '통계/인사이트',
    icon: BarChart3,
    url: '/admin/analytics',
  },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">관</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">진가 구조화 캠프</h2>
              <p className="text-xs text-muted-foreground">관리자</p>
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

