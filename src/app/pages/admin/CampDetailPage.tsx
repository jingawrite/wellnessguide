import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Calendar } from '../../components/ui/calendar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Video,
  Users,
} from 'lucide-react';
import { format, addWeeks, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';

interface Camp {
  id: number;
  name: string;
  type: string;
  clientName?: string;
  startDate: Date;
  endDate?: Date;
  status: '준비중' | '진행중' | '종료';
  note?: string;
}

interface CampSession {
  id: number;
  campId: number;
  weekNo: number;
  title: string;
  sessionDate: Date;
  mode: '온라인' | '오프라인' | '하이브리드';
  location?: string;
  note?: string;
}

interface RepeatSettings {
  enabled: boolean;
  interval: number; // 반복 주기
  intervalUnit: '주' | '일';
  repeatDays: number[]; // 0=일요일, 1=월요일, ..., 6=토요일
  endCondition: 'none' | 'count';
  repeatCount?: number;
}

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export function CampDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [camp, setCamp] = useState<Camp | null>(null);
  const [sessions, setSessions] = useState<CampSession[]>([]);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CampSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 세션 추가/수정 폼 상태
  const [sessionForm, setSessionForm] = useState<Partial<CampSession>>({
    weekNo: 1,
    sessionDate: new Date(),
    note: '',
  });

  // 반복 설정 상태
  const [repeatSettings, setRepeatSettings] = useState<RepeatSettings>({
    enabled: false,
    interval: 2,
    intervalUnit: '주',
    repeatDays: [],
    endCondition: 'count',
    repeatCount: 5,
  });

  // 캠프 데이터 및 세션 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    // localStorage에서 캠프 데이터 로드 (실제로는 API 호출)
    const storedCamps = JSON.parse(localStorage.getItem('camps') || '[]');
    const foundCamp = storedCamps.find((c: any) => c.id === Number(id));
    
    if (foundCamp) {
      setCamp({
        ...foundCamp,
        startDate: new Date(foundCamp.startDate),
        endDate: foundCamp.endDate ? new Date(foundCamp.endDate) : undefined,
      });
    } else {
      // 샘플 데이터 (fallback)
      const sampleCamp: Camp = {
        id: Number(id),
        name: '연세대학교 Co-work',
        type: 'Co-Work',
        clientName: '연세대학교',
        startDate: new Date('2026-01-04T21:00:00'),
        status: '진행중',
        note: '- 매주 줌 미팅 진행\n- 개인과제 2회, 팀과제 1회\n- 피드백은 세션 때 제공',
      };
      setCamp(sampleCamp);
    }

    // localStorage에서 세션 데이터 로드 (실제로는 API 호출)
    const storedSessions = JSON.parse(localStorage.getItem('campSessions') || '[]');
    const campId = Number(id);
    const campSessions = storedSessions
      .filter((s: any) => {
        // campId를 숫자로 비교하여 정확히 필터링
        return Number(s.campId) === campId;
      })
      .map((s: any) => ({
        ...s,
        sessionDate: new Date(s.sessionDate),
      }))
      .sort((a: CampSession, b: CampSession) => a.weekNo - b.weekNo);
    setSessions(campSessions);
  }, [id]);

  const handleAddSession = () => {
    setIsEditing(false);
    setSelectedSession(null);
    setSessionForm({
      weekNo: sessions.length + 1,
      sessionDate: camp?.startDate || new Date(),
      note: '',
    });
    setRepeatSettings({
      enabled: false,
      interval: 2,
      intervalUnit: '주',
      repeatDays: [],
      endCondition: 'count',
      repeatCount: 5,
    });
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (session: CampSession) => {
    setIsEditing(true);
    setSelectedSession(session);
    setSessionForm({
      weekNo: session.weekNo,
      sessionDate: session.sessionDate,
      note: session.note || '',
    });
    setIsSessionDialogOpen(true);
  };

  const handleSaveSession = () => {
    if (!sessionForm.sessionDate) {
      alert('세션 날짜를 입력해주세요.');
      return;
    }

    if (isEditing && selectedSession) {
      // 수정
      setSessions(
        sessions.map((s) =>
          s.id === selectedSession.id
            ? {
                ...s,
                weekNo: sessionForm.weekNo!,
                sessionDate: sessionForm.sessionDate!,
                note: sessionForm.note,
              }
            : s
        )
      );
      setIsSessionDialogOpen(false);
      setSelectedSession(null);
      setIsEditing(false);
    } else {
      // 반복 설정이 활성화되어 있으면 여러 세션 생성
      if (repeatSettings.enabled && repeatSettings.repeatDays.length > 0) {
        handleApplyRepeat();
      } else {
        // 단일 세션 추가
        const newId = Math.max(...sessions.map((s) => s.id), 0) + 1;
        setSessions([
          ...sessions,
          {
            id: newId,
            campId: Number(id),
            weekNo: sessionForm.weekNo!,
            title: `${sessionForm.weekNo}주차`,
            sessionDate: sessionForm.sessionDate!,
            mode: '온라인',
            location: '',
            note: sessionForm.note,
          },
        ]);
        setIsSessionDialogOpen(false);
        setIsEditing(false);
      }
    }
  };

  const handleDeleteSession = (sessionId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);
      
      // localStorage 업데이트 (실제로는 API 호출)
      const storedSessions = JSON.parse(localStorage.getItem('campSessions') || '[]');
      const filteredSessions = storedSessions.filter((s: any) => s.id !== sessionId);
      localStorage.setItem('campSessions', JSON.stringify(filteredSessions));
    }
  };

  const handleApplyRepeat = () => {
    if (!camp || !sessionForm.sessionDate || repeatSettings.repeatDays.length === 0) {
      alert('반복 요일을 선택해주세요.');
      return;
    }

    const newSessions: CampSession[] = [];
    let startDate = new Date(sessionForm.sessionDate);
    let sessionCount = 0;
    let weekNo = sessionForm.weekNo || 1;
    
    // 종료 조건 설정
    let maxCount = Infinity;
    if (repeatSettings.endCondition === 'count') {
      maxCount = repeatSettings.repeatCount || 5;
    }

    // 시작 날짜 기준으로 첫 번째 세션 날짜 계산
    const selectedDays = [...repeatSettings.repeatDays].sort((a, b) => a - b);
    const startDayOfWeek = startDate.getDay();
    
    // 시작 날짜가 선택된 요일 중 하나인지 확인
    let currentWeekStart = new Date(startDate);
    if (!selectedDays.includes(startDayOfWeek)) {
      // 시작 날짜가 선택된 요일이 아니면 가장 가까운 다음 요일로
      const nextDay = selectedDays.find((day) => day > startDayOfWeek) || selectedDays[0];
      const daysToAdd = (nextDay - startDayOfWeek + 7) % 7;
      currentWeekStart = addDays(startDate, daysToAdd);
    }

    while (sessionCount < maxCount) {
      // 현재 주기의 선택된 요일들에 대해 세션 생성
      for (const dayIndex of selectedDays) {
        if (sessionCount >= maxCount) break;
        
        const sessionDate = new Date(currentWeekStart);
        // 요일 맞추기
        const currentDayOfWeek = sessionDate.getDay();
        const daysToAdd = (dayIndex - currentDayOfWeek + 7) % 7;
        const finalDate = addDays(sessionDate, daysToAdd);

        newSessions.push({
          id: sessions.length + sessionCount + 1,
          campId: Number(id),
          weekNo: weekNo,
          title: `${weekNo}주차`,
          sessionDate: finalDate,
          mode: '온라인',
          location: '',
          note: sessionForm.note,
        });

        sessionCount++;
        weekNo++;
      }

      // 다음 주기로 이동
      if (repeatSettings.intervalUnit === '주') {
        currentWeekStart = addWeeks(currentWeekStart, repeatSettings.interval);
        // 주 단위일 때는 첫 번째 선택된 요일로 맞춤
        const firstDay = selectedDays[0];
        const currentDayOfWeek = currentWeekStart.getDay();
        const daysToAdd = (firstDay - currentDayOfWeek + 7) % 7;
        currentWeekStart = addDays(currentWeekStart, daysToAdd);
      } else {
        currentWeekStart = addDays(currentWeekStart, repeatSettings.interval);
      }

      if (sessionCount >= maxCount) break;
    }

    setSessions([...sessions, ...newSessions]);
    
    // localStorage 업데이트 (실제로는 API 호출)
    const storedSessions = JSON.parse(localStorage.getItem('campSessions') || '[]');
    const sessionsToAdd = newSessions.map((s) => ({
      ...s,
      sessionDate: s.sessionDate.toISOString(),
    }));
    localStorage.setItem('campSessions', JSON.stringify([...storedSessions, ...sessionsToAdd]));
    
    setIsSessionDialogOpen(false);
    setIsEditing(false);
  };

  const toggleRepeatDay = (dayIndex: number) => {
    setRepeatSettings({
      ...repeatSettings,
      repeatDays: repeatSettings.repeatDays.includes(dayIndex)
        ? repeatSettings.repeatDays.filter((d) => d !== dayIndex)
        : [...repeatSettings.repeatDays, dayIndex],
    });
  };

  if (!camp) {
    return <div>캠프를 불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/camps')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{camp.name}</h1>
            <p className="text-muted-foreground mt-2">
              {camp.type} · {camp.clientName || '클라이언트 미지정'}
            </p>
          </div>
        </div>
        <Button onClick={handleAddSession}>
          <Plus className="h-4 w-4 mr-2" />
          세션 추가
        </Button>
      </div>

      {/* 캠프 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>캠프 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">시작일</Label>
              <div className="font-medium">{format(camp.startDate, 'yyyy.MM.dd')}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">상태</Label>
              <div>
                <Badge
                  variant={
                    camp.status === '진행중'
                      ? 'default'
                      : camp.status === '준비중'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {camp.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 세션 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>세션/주차 리스트</CardTitle>
          <CardDescription>캠프의 주차별 세션을 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">주차</TableHead>
                <TableHead className="w-[150px]">날짜</TableHead>
                <TableHead>비고</TableHead>
                <TableHead className="w-[100px]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    등록된 세션이 없습니다. 세션을 추가해주세요.
                  </TableCell>
                </TableRow>
              ) : (
                sessions
                  .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime())
                  .map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <Badge variant="outline">{session.weekNo}주차</Badge>
                      </TableCell>
                      <TableCell>{format(session.sessionDate, 'yyyy.MM.dd')}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {session.note || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 세션 추가/수정 다이얼로그 */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? '세션 수정' : '새 세션 추가'}</DialogTitle>
            <DialogDescription>
              세션 정보를 입력하고 반복 설정을 통해 여러 주차를 한 번에 추가할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="weekNo">주차 번호 *</Label>
              <Input
                id="weekNo"
                type="number"
                min="1"
                value={sessionForm.weekNo || ''}
                onChange={(e) =>
                  setSessionForm({ ...sessionForm, weekNo: parseInt(e.target.value) || 1 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>세션 날짜 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {sessionForm.sessionDate
                      ? format(sessionForm.sessionDate, 'yyyy.MM.dd')
                      : '날짜 선택'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={sessionForm.sessionDate}
                    onSelect={(date) => date && setSessionForm({ ...sessionForm, sessionDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">비고</Label>
              <Textarea
                id="note"
                value={sessionForm.note || ''}
                onChange={(e) => setSessionForm({ ...sessionForm, note: e.target.value })}
                placeholder="운영 메모"
                rows={3}
              />
            </div>

            {!isEditing && (
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable-repeat"
                    checked={repeatSettings.enabled}
                    onCheckedChange={(checked) =>
                      setRepeatSettings({ ...repeatSettings, enabled: checked === true })
                    }
                  />
                  <Label htmlFor="enable-repeat" className="font-normal cursor-pointer">
                    반복 설정으로 여러 주차 추가
                  </Label>
                </div>

                {repeatSettings.enabled && (
                  <div className="space-y-4 pl-6 border-l-2">
                    {/* 반복 주기 */}
                    <div className="space-y-2">
                      <Label>반복 주기</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={repeatSettings.interval}
                          onChange={(e) =>
                            setRepeatSettings({
                              ...repeatSettings,
                              interval: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-20"
                        />
                        <Select
                          value={repeatSettings.intervalUnit}
                          onValueChange={(value: '주' | '일') =>
                            setRepeatSettings({ ...repeatSettings, intervalUnit: value })
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="주">주</SelectItem>
                            <SelectItem value="일">일</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* 반복 요일 */}
                    <div className="space-y-2">
                      <Label>반복 요일</Label>
                      <div className="flex gap-2">
                        {DAYS_OF_WEEK.map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => toggleRepeatDay(index)}
                            className={`flex-1 h-10 rounded-md border transition-colors ${
                              repeatSettings.repeatDays.includes(index)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background hover:bg-accent'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 종료 조건 */}
                    <div className="space-y-3">
                      <Label>종료</Label>
                      <RadioGroup
                        value={repeatSettings.endCondition}
                        onValueChange={(value: 'none' | 'count') =>
                          setRepeatSettings({ ...repeatSettings, endCondition: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="end-none" />
                          <Label htmlFor="end-none" className="font-normal cursor-pointer">
                            없음
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="count" id="end-count" />
                          <Label htmlFor="end-count" className="font-normal cursor-pointer">
                            다음
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={repeatSettings.repeatCount || 5}
                            onChange={(e) =>
                              setRepeatSettings({
                                ...repeatSettings,
                                repeatCount: parseInt(e.target.value) || 5,
                              })
                            }
                            className="w-20"
                            disabled={repeatSettings.endCondition !== 'count'}
                          />
                          <span className="text-sm text-muted-foreground">회 반복</span>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveSession}>
              {isEditing ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

