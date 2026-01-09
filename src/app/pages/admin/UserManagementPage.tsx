import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Users, Search, Eye, Tag } from 'lucide-react';

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // 유저 데이터 (실제로는 API에서 가져올 데이터)
  const users = [
    {
      id: 1,
      name: '김멘티',
      email: 'kim@example.com',
      joinedAt: '2024-01-01',
      source: '랜딩페이지',
      status: 'in_progress',
      statusText: '진행 중',
      progress: 45,
      tags: ['직무 전환 준비'],
    },
    {
      id: 2,
      name: '이멘티',
      email: 'lee@example.com',
      joinedAt: '2024-01-05',
      source: '추천',
      status: 'completed',
      statusText: '완주',
      progress: 100,
      tags: ['재직자'],
    },
    {
      id: 3,
      name: '박멘티',
      email: 'park@example.com',
      joinedAt: '2024-01-10',
      source: '랜딩페이지',
      status: 'not_started',
      statusText: '시작 전',
      progress: 0,
      tags: [],
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || user.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'not_started':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">유저 관리</h1>
        <p className="text-muted-foreground mt-2">멘티 정보와 학습 현황을 관리하세요</p>
      </div>

      {/* 필터 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름/이메일 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="학습 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="not_started">시작 전</SelectItem>
                <SelectItem value="in_progress">진행 중</SelectItem>
                <SelectItem value="completed">완주</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="가입 경로" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 경로</SelectItem>
                <SelectItem value="랜딩페이지">랜딩페이지</SelectItem>
                <SelectItem value="추천">추천</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 유저 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>유저 리스트</CardTitle>
          <CardDescription>총 {filteredUsers.length}명</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-4 p-3 border-b font-medium text-sm text-muted-foreground">
              <div className="col-span-3">이름 / 이메일</div>
              <div className="col-span-2">가입일</div>
              <div className="col-span-2">가입 경로</div>
              <div className="col-span-2">학습 상태</div>
              <div className="col-span-2">진도율</div>
              <div className="col-span-1 text-right">작업</div>
            </div>

            {/* 테이블 바디 */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 유저가 없습니다.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-accent transition-colors"
                >
                  <div className="col-span-3">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">{user.joinedAt}</div>
                  <div className="col-span-2">{user.source}</div>
                  <div className="col-span-2">
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.statusText}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {user.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

