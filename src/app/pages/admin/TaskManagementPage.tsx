import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FileText, Search, Eye } from 'lucide-react';

export function TaskManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 과제 데이터 (실제로는 API에서 가져올 데이터)
  const tasks = [
    {
      id: 1,
      menteeName: '김멘티',
      menteeEmail: 'kim@example.com',
      week: 1,
      brand: '브랜드A',
      submittedAt: '2024-01-15 14:30',
      status: 'pending_feedback',
      statusText: '피드백 대기',
    },
    {
      id: 2,
      menteeName: '이멘티',
      menteeEmail: 'lee@example.com',
      week: 2,
      brand: '브랜드B',
      submittedAt: '2024-01-14 10:15',
      status: 'pending_feedback',
      statusText: '피드백 대기',
    },
    {
      id: 3,
      menteeName: '박멘티',
      menteeEmail: 'park@example.com',
      week: 1,
      brand: '브랜드C',
      submittedAt: '2024-01-13 16:45',
      status: 'feedback_completed',
      statusText: '피드백 완료',
    },
    {
      id: 4,
      menteeName: '최멘티',
      menteeEmail: 'choi@example.com',
      week: 3,
      brand: '브랜드D',
      submittedAt: null,
      status: 'not_submitted',
      statusText: '미제출',
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.menteeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.menteeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWeek = weekFilter === 'all' || task.week.toString() === weekFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesWeek && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'feedback_completed':
        return 'default';
      case 'pending_feedback':
        return 'destructive';
      case 'not_submitted':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">과제 관리</h1>
        <p className="text-muted-foreground mt-2">멘티들의 과제 제출 현황을 확인하고 피드백을 작성하세요</p>
      </div>

      {/* 필터 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="멘티 이름/이메일 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={weekFilter} onValueChange={setWeekFilter}>
              <SelectTrigger>
                <SelectValue placeholder="주차 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 주차</SelectItem>
                <SelectItem value="1">1주차</SelectItem>
                <SelectItem value="2">2주차</SelectItem>
                <SelectItem value="3">3주차</SelectItem>
                <SelectItem value="4">4주차</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="not_submitted">미제출</SelectItem>
                <SelectItem value="pending_feedback">피드백 대기</SelectItem>
                <SelectItem value="feedback_completed">피드백 완료</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="브랜드 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 브랜드</SelectItem>
                <SelectItem value="brandA">브랜드A</SelectItem>
                <SelectItem value="brandB">브랜드B</SelectItem>
                <SelectItem value="brandC">브랜드C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 과제 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>과제 리스트</CardTitle>
          <CardDescription>총 {filteredTasks.length}건</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-4 p-3 border-b font-medium text-sm text-muted-foreground">
              <div className="col-span-2">멘티명</div>
              <div className="col-span-1">주차</div>
              <div className="col-span-2">브랜드</div>
              <div className="col-span-3">제출 일시</div>
              <div className="col-span-2">상태</div>
              <div className="col-span-2 text-right">작업</div>
            </div>

            {/* 테이블 바디 */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                조건에 맞는 과제가 없습니다.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/tasks/${task.id}`)}
                >
                  <div className="col-span-2">
                    <div className="font-medium">{task.menteeName}</div>
                    <div className="text-sm text-muted-foreground">{task.menteeEmail}</div>
                  </div>
                  <div className="col-span-1">{task.week}주차</div>
                  <div className="col-span-2">{task.brand}</div>
                  <div className="col-span-3">
                    {task.submittedAt || <span className="text-muted-foreground">-</span>}
                  </div>
                  <div className="col-span-2">
                    <Badge variant={getStatusBadgeVariant(task.status)}>{task.statusText}</Badge>
                  </div>
                  <div className="col-span-2 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      보기
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

