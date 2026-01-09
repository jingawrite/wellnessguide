import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  FileText,
  List,
  Plus,
  Edit,
  Trash2,
  Clock,
} from 'lucide-react';
import { format, addWeeks, addDays } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Calendar } from '../../components/ui/calendar';
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
  interval: number;
  intervalUnit: '주' | '일';
  repeatDays: number[]; // 0=일요일, 1=월요일, ..., 6=토요일
  endCondition: 'none' | 'count';
  repeatCount?: number;
}

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// 미리 지정된 캠프 유형 목록
const CAMP_TYPES = [
  'Co-Work',
  '진로부트캠프',
  '직무부트캠프(자율일정)',
  '직무부트캠프',
] as const;

// 캠프 유형별 색상
const campTypeColors: Record<string, string> = {
  'Co-Work': 'bg-green-500',
  '진로부트캠프': 'bg-blue-500',
  '직무부트캠프(자율일정)': 'bg-purple-500',
  '직무부트캠프': 'bg-indigo-500',
};

export function CampManagementPage() {
  const navigate = useNavigate();
  
  // localStorage에서 캠프 데이터 로드 (실제로는 API 호출)
  const loadCampsFromStorage = (): Camp[] => {
    const storedCamps = JSON.parse(localStorage.getItem('camps') || '[]');
    if (storedCamps.length > 0) {
      return storedCamps.map((c: any) => ({
        ...c,
        startDate: new Date(c.startDate),
        endDate: c.endDate ? new Date(c.endDate) : undefined,
      }));
    }
    // 샘플 데이터 (fallback)
    return [
      {
        id: 1,
        name: '연세대학교 Co-work',
        type: 'Co-Work',
        clientName: '연세대학교',
        startDate: new Date('2026-01-04T21:00:00'),
        status: '진행중',
        note: '- 매주 줌 미팅 진행\n- 개인과제 2회, 팀과제 1회\n- 피드백은 세션 때 제공',
      },
      {
        id: 2,
        name: '251221 직무부트캠프',
        type: '직무부트캠프',
        startDate: new Date('2025-12-21T21:00:00'),
        status: '진행중',
      },
    ];
  };

  const [camps, setCamps] = useState<Camp[]>([]);

  // 컴포넌트 마운트 시 localStorage에서 캠프 데이터 로드
  useEffect(() => {
    const loadedCamps = loadCampsFromStorage();
    // 중복 ID 제거 (같은 ID가 있으면 첫 번째 것만 유지)
    const uniqueCamps = loadedCamps.filter((camp, index, self) =>
      index === self.findIndex((c) => c.id === camp.id)
    );
    setCamps(uniqueCamps);
  }, []);

  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 새 캠프 기본값
  const [newCamp, setNewCamp] = useState<Partial<Camp>>({
    name: '',
    type: '',
    startDate: new Date(),
    status: '준비중',
    note: '',
  });

  // 반복 설정 상태 (새 캠프 추가 시에만 사용)
  const [repeatSettings, setRepeatSettings] = useState<RepeatSettings>({
    enabled: false,
    interval: 2,
    intervalUnit: '주',
    repeatDays: [],
    endCondition: 'count',
    repeatCount: 5,
  });

  // 새 캠프 추가 시 세션 리스트 (새 캠프 추가 시에만 사용)
  const [newCampSessions, setNewCampSessions] = useState<CampSession[]>([]);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CampSession | null>(null);
  const [sessionForm, setSessionForm] = useState<Partial<CampSession>>({
    weekNo: 1,
    sessionDate: new Date(),
    note: '',
  });

  // 캠프 이름 자동 채우기: YYYYMMDD_캠프유형
  useEffect(() => {
    if (!isEditing && newCamp.startDate && newCamp.type) {
      const dateStr = format(newCamp.startDate, 'yyyyMMdd');
      const autoName = `${dateStr}_${newCamp.type}`;
      setNewCamp((prev) => ({ ...prev, name: autoName }));
    }
  }, [newCamp.startDate, newCamp.type, isEditing]);

  // 종료일이 지나면 상태를 자동으로 '종료'로 설정
  useEffect(() => {
    if (newCamp.endDate && newCamp.endDate < new Date()) {
      setNewCamp((prev) => ({ ...prev, status: '종료' }));
    } else if (newCamp.endDate && newCamp.endDate >= new Date() && newCamp.status === '종료') {
      // 종료일이 미래인데 상태가 종료면 진행중으로 변경
      setNewCamp((prev) => ({ ...prev, status: '진행중' }));
    }
  }, [newCamp.endDate]);

  const handleAddCamp = () => {
    setIsEditing(false);
    setSelectedCamp(null);
    const today = new Date();
    setNewCamp({
      name: '',
      type: '',
      startDate: today,
      status: '준비중',
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
    setNewCampSessions([]);
    setIsSessionDialogOpen(false);
    setEditingSession(null);
    setIsDialogOpen(true);
  };

  const handleEditCamp = (camp: Camp) => {
    setIsEditing(true);
    setSelectedCamp(camp);
    // 종료일이 지났으면 상태를 종료로 설정
    const status = camp.endDate && camp.endDate < new Date() ? '종료' : camp.status;
    setNewCamp({
      name: camp.name,
      type: camp.type,
      startDate: camp.startDate,
      endDate: camp.endDate,
      status: status,
      note: camp.note || '',
    });
    setIsDialogOpen(true);
  };

  // 반복 설정으로 세션 생성 및 종료일 계산
  const generateSessionsFromRepeat = (
    campId: number,
    startDate: Date,
    repeatSettings: RepeatSettings
  ): { sessions: CampSession[]; endDate: Date | undefined } => {
    if (!repeatSettings.enabled || repeatSettings.repeatDays.length === 0) {
      return { sessions: [], endDate: undefined };
    }

    const newSessions: CampSession[] = [];
    let sessionCount = 0;
    let maxCount = Infinity;
    let calculatedEndDate: Date | undefined = undefined;

    if (repeatSettings.endCondition === 'count') {
      maxCount = repeatSettings.repeatCount || 5;
    }

    const selectedDays = [...repeatSettings.repeatDays].sort((a, b) => a - b);
    const startDayOfWeek = startDate.getDay();

    let currentWeekStart = new Date(startDate);
    if (!selectedDays.includes(startDayOfWeek)) {
      const nextDay = selectedDays.find((day) => day > startDayOfWeek) || selectedDays[0];
      const daysToAdd = (nextDay - startDayOfWeek + 7) % 7;
      currentWeekStart = addDays(startDate, daysToAdd);
    }

    while (sessionCount < maxCount) {
      for (const dayIndex of selectedDays) {
        if (sessionCount >= maxCount) break;

        const sessionDate = new Date(currentWeekStart);
        const currentDayOfWeek = sessionDate.getDay();
        const daysToAdd = (dayIndex - currentDayOfWeek + 7) % 7;
        const finalDate = addDays(sessionDate, daysToAdd);

        newSessions.push({
          id: Date.now() + sessionCount + Math.random(), // 임시 ID
          campId: campId,
          weekNo: 0, // 임시로 0으로 설정, 나중에 날짜 순으로 정렬 후 재할당
          title: '', // 임시로 빈 문자열
          sessionDate: finalDate,
          mode: '온라인',
          location: '',
          note: '',
        });

        calculatedEndDate = finalDate;
        sessionCount++;
      }

      if (repeatSettings.intervalUnit === '주') {
        currentWeekStart = addWeeks(currentWeekStart, repeatSettings.interval);
        const firstDay = selectedDays[0];
        const currentDayOfWeek = currentWeekStart.getDay();
        const daysToAdd = (firstDay - currentDayOfWeek + 7) % 7;
        currentWeekStart = addDays(currentWeekStart, daysToAdd);
      } else {
        currentWeekStart = addDays(currentWeekStart, repeatSettings.interval);
      }

      if (sessionCount >= maxCount) break;
    }

    // 날짜 순으로 정렬 후 가장 빠른 날짜가 1주차가 되도록 weekNo 재할당
    const sortedSessions = newSessions.sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime());
    const sessionsWithWeekNo = sortedSessions.map((session, index) => ({
      ...session,
      weekNo: index + 1,
      title: `${index + 1}주차`,
    }));

    return { sessions: sessionsWithWeekNo, endDate: calculatedEndDate };
  };

  // 세션 추가 핸들러
  const handleAddSession = () => {
    setEditingSession(null);
    setSessionForm({
      weekNo: newCampSessions.length > 0 ? Math.max(...newCampSessions.map(s => s.weekNo)) + 1 : 1,
      sessionDate: newCamp.startDate || new Date(),
      note: '',
    });
    setIsSessionDialogOpen(true);
  };

  // 세션 수정 핸들러
  const handleEditSession = (session: CampSession) => {
    setEditingSession(session);
    setSessionForm({
      weekNo: session.weekNo,
      sessionDate: session.sessionDate,
      note: session.note || '',
    });
    setIsSessionDialogOpen(true);
  };

  // 세션 삭제 핸들러
  const handleDeleteSession = (sessionId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updatedSessions = newCampSessions.filter(s => s.id !== sessionId);
      setNewCampSessions(updatedSessions);
      
      // 세션이 있으면 마지막 세션 날짜를 종료일로 설정
      if (updatedSessions.length > 0) {
        const lastSessionDate = updatedSessions
          .map(s => s.sessionDate)
          .sort((a, b) => b.getTime() - a.getTime())[0];
        setNewCamp({ ...newCamp, endDate: lastSessionDate });
      } else {
        setNewCamp({ ...newCamp, endDate: undefined });
      }
    }
  };

  // 세션 저장 핸들러
  const handleSaveSession = () => {
    if (!sessionForm.sessionDate) {
      alert('세션 날짜를 입력해주세요.');
      return;
    }

    if (editingSession) {
      // 수정
      const updatedSessions = newCampSessions.map(s =>
        s.id === editingSession.id
          ? {
              ...s,
              weekNo: sessionForm.weekNo!,
              sessionDate: sessionForm.sessionDate!,
              note: sessionForm.note,
            }
          : s
      );
      setNewCampSessions(updatedSessions);
      
      // 마지막 세션 날짜를 종료일로 설정
      const lastSessionDate = updatedSessions
        .map(s => s.sessionDate)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      setNewCamp({ ...newCamp, endDate: lastSessionDate });
    } else {
      // 추가
      const newSession: CampSession = {
        id: Date.now() + Math.random(),
        campId: 0, // 임시 ID
        weekNo: sessionForm.weekNo!,
        title: `${sessionForm.weekNo}주차`,
        sessionDate: sessionForm.sessionDate!,
        mode: '온라인',
        location: '',
        note: sessionForm.note,
      };
      const updatedSessions = [...newCampSessions, newSession];
      setNewCampSessions(updatedSessions);
      
      // 마지막 세션 날짜를 종료일로 설정
      const lastSessionDate = updatedSessions
        .map(s => s.sessionDate)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      setNewCamp({ ...newCamp, endDate: lastSessionDate });
    }

    setIsSessionDialogOpen(false);
    setEditingSession(null);
  };

  // 반복 설정 적용 핸들러
  const handleApplyRepeat = () => {
    if (repeatSettings.repeatDays.length === 0) {
      alert('반복 요일을 선택해주세요.');
      return;
    }

    const result = generateSessionsFromRepeat(0, newCamp.startDate || new Date(), repeatSettings);
    
    // 기존 세션과 새 세션을 합치고 날짜 순으로 정렬
    const allSessions = [...newCampSessions, ...result.sessions];
    const sortedSessions = allSessions.sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime());
    
    // 모든 세션을 날짜 순으로 정렬한 후 1주차부터 순차적으로 weekNo 재할당
    const sessionsWithWeekNo = sortedSessions.map((session, index) => ({
      ...session,
      weekNo: index + 1,
      title: `${index + 1}주차`,
    }));
    
    setNewCampSessions(sessionsWithWeekNo);
    
    // 마지막 세션 날짜를 종료일로 설정
    if (sessionsWithWeekNo.length > 0) {
      const lastSessionDate = sessionsWithWeekNo[sessionsWithWeekNo.length - 1].sessionDate;
      setNewCamp({ ...newCamp, endDate: lastSessionDate });
    }
    
    // 반복 설정 초기화
    setRepeatSettings({
      enabled: false,
      interval: 2,
      intervalUnit: '주',
      repeatDays: [],
      endCondition: 'count',
      repeatCount: 5,
    });
  };

  const handleSaveCamp = () => {
    if (!newCamp.name || !newCamp.type || !newCamp.startDate) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    // 종료일이 지났으면 상태를 자동으로 '종료'로 설정
    let finalStatus = newCamp.status || '준비중';
    let finalEndDate = newCamp.endDate;

    if (isEditing && selectedCamp) {
      // 수정
      if (finalEndDate && finalEndDate < new Date()) {
        finalStatus = '종료';
      }
      const updatedCamp = {
        ...selectedCamp,
        name: newCamp.name!,
        type: newCamp.type!,
        startDate: newCamp.startDate!,
        endDate: finalEndDate,
        status: finalStatus as '준비중' | '진행중' | '종료',
        note: newCamp.note,
      };
      
      // localStorage 업데이트 (실제로는 API 호출)
      const storedCamps = JSON.parse(localStorage.getItem('camps') || '[]');
      const updatedStoredCamps = storedCamps.map((c: any) =>
        c.id === selectedCamp.id
          ? {
              ...updatedCamp,
              startDate: updatedCamp.startDate.toISOString(),
              endDate: updatedCamp.endDate?.toISOString(),
            }
          : c
      );
      localStorage.setItem('camps', JSON.stringify(updatedStoredCamps));
      
      // 상태 업데이트
      setCamps(
        camps.map((camp) =>
          camp.id === selectedCamp.id ? updatedCamp : camp
        )
      );
    } else {
      // 새 캠프 추가
      // localStorage에서 최대 ID를 가져와서 새 ID 생성
      const storedCamps = JSON.parse(localStorage.getItem('camps') || '[]');
      const maxId = storedCamps.length > 0 
        ? Math.max(...storedCamps.map((c: any) => c.id), 0)
        : Math.max(...camps.map((c) => c.id), 0);
      const newId = maxId + 1;

      // 세션이 있으면 마지막 세션 날짜를 종료일로 설정
      if (newCampSessions.length > 0) {
        const lastSessionDate = newCampSessions
          .map(s => s.sessionDate)
          .sort((a, b) => b.getTime() - a.getTime())[0];
        finalEndDate = lastSessionDate;
      } else if (repeatSettings.enabled && repeatSettings.repeatDays.length > 0) {
        // 반복 설정이 활성화되어 있으면 세션 생성 및 종료일 계산
        const result = generateSessionsFromRepeat(newId, newCamp.startDate!, repeatSettings);
        if (result.endDate) {
          finalEndDate = result.endDate;
        }
      }

      // 종료일이 지났으면 상태를 종료로 설정
      if (finalEndDate && finalEndDate < new Date()) {
        finalStatus = '종료';
      } else if (finalEndDate && finalEndDate >= new Date()) {
        finalStatus = '진행중';
      }

      const newCampData: Camp = {
        id: newId,
        name: newCamp.name!,
        type: newCamp.type!,
        startDate: newCamp.startDate!,
        endDate: finalEndDate,
        status: finalStatus as '준비중' | '진행중' | '종료',
        note: newCamp.note,
      };

      // 캠프 데이터를 localStorage에 저장 (실제로는 API 호출)
      const campsToSave = JSON.parse(localStorage.getItem('camps') || '[]');
      campsToSave.push({
        ...newCampData,
        startDate: newCampData.startDate.toISOString(),
        endDate: newCampData.endDate?.toISOString(),
      });
      localStorage.setItem('camps', JSON.stringify(campsToSave));
      
      // 상태 업데이트
      setCamps([...camps, newCampData]);

      // 세션이 있으면 localStorage에 저장 (실제로는 API 호출)
      const sessionsToSave = newCampSessions.length > 0 
        ? newCampSessions 
        : (repeatSettings.enabled && repeatSettings.repeatDays.length > 0
            ? generateSessionsFromRepeat(newId, newCamp.startDate!, repeatSettings).sessions
            : []);
      
      if (sessionsToSave.length > 0) {
        const storedSessions = JSON.parse(localStorage.getItem('campSessions') || '[]');
        const sessionsWithCampId = sessionsToSave.map((s) => ({
          ...s,
          campId: newId,
          sessionDate: s.sessionDate.toISOString(),
        }));
        localStorage.setItem('campSessions', JSON.stringify([...storedSessions, ...sessionsWithCampId]));
      }
    }

    setIsDialogOpen(false);
    setSelectedCamp(null);
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

  const handleDeleteCamp = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // localStorage에서 삭제 (실제로는 API 호출)
      const storedCamps = JSON.parse(localStorage.getItem('camps') || '[]');
      const filteredCamps = storedCamps.filter((c: any) => c.id !== id);
      localStorage.setItem('camps', JSON.stringify(filteredCamps));
      
      // 세션도 함께 삭제
      const storedSessions = JSON.parse(localStorage.getItem('campSessions') || '[]');
      const filteredSessions = storedSessions.filter((s: any) => s.campId !== id);
      localStorage.setItem('campSessions', JSON.stringify(filteredSessions));
      
      // 상태 업데이트
      setCamps(camps.filter((camp) => camp.id !== id));
    }
  };

  const handleRowClick = (camp: Camp) => {
    navigate(`/admin/camps/${camp.id}`);
  };

  const getCampTypeColor = (type: string) => {
    return campTypeColors[type] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">캠프 관리</h1>
          <p className="text-muted-foreground mt-2">진행중인 캠프 정보를 입력하고 관리하세요</p>
        </div>
        <Button onClick={handleAddCamp}>
          <Plus className="h-4 w-4 mr-2" />
          새 캠프 추가
        </Button>
      </div>

      {/* 캠프 리스트 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>캠프 리스트</CardTitle>
          <CardDescription>캠프를 클릭하여 수정할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    날짜
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    캠프유형
                  </div>
                </TableHead>
                <TableHead className="min-w-[300px]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    이름
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    비고
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {camps.map((camp) => (
                <TableRow
                  key={camp.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(camp)}
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-red-500 font-medium">
                        {format(camp.startDate, 'yyyy.MM.dd')}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {camp.endDate
                          ? `${format(camp.endDate, 'yyyy.MM.dd')}까지`
                          : '진행중'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getCampTypeColor(camp.type)} text-white border-0`}
                    >
                      {camp.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{camp.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {camp.note ? (
                      <div className="space-y-1">
                        {camp.note.split('\n').map((line, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {line.startsWith('-') ? line : `- ${line}`}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCamp(camp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCamp(camp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 캠프 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? '캠프 수정' : '새 캠프 추가'}</DialogTitle>
            <DialogDescription>
              캠프 정보를 입력하세요. 캠프 유형은 지정된 4가지 중에서 선택하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 날짜 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">시작일 *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={
                    newCamp.startDate
                      ? format(newCamp.startDate, "yyyy-MM-dd'T'HH:mm")
                      : ''
                  }
                  onChange={(e) =>
                    setNewCamp({
                      ...newCamp,
                      startDate: e.target.value ? new Date(e.target.value) : new Date(),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">종료일</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={
                    newCamp.endDate
                      ? format(newCamp.endDate, "yyyy-MM-dd'T'HH:mm")
                      : ''
                  }
                  onChange={(e) =>
                    setNewCamp({
                      ...newCamp,
                      endDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* 캠프 유형 */}
            <div className="space-y-2">
              <Label htmlFor="type">캠프 유형 *</Label>
              <Select
                value={newCamp.type || ''}
                onValueChange={(value) => setNewCamp({ ...newCamp, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {CAMP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 캠프 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">캠프 이름 *</Label>
              <Input
                id="name"
                value={newCamp.name || ''}
                onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                placeholder="YYYYMMDD_캠프유형 형식으로 자동 채워집니다"
              />
              {!isEditing && newCamp.startDate && newCamp.type && (
                <p className="text-xs text-muted-foreground">
                  날짜와 유형을 선택하면 자동으로 채워집니다. 필요시 수정 가능합니다.
                </p>
              )}
            </div>

            {/* 반복 설정 (새 캠프 추가 시에만 표시) */}
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
                    반복 설정으로 세션 자동 생성
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

                    {repeatSettings.enabled && repeatSettings.repeatDays.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleApplyRepeat}
                        >
                          반복 세션 생성
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          반복 설정으로 세션을 생성합니다.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 세션 리스트 */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">세션 일정</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSession}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      세션 추가
                    </Button>
                  </div>

                  {newCampSessions.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                      등록된 세션이 없습니다. 세션을 추가하거나 반복 설정을 사용하세요.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {newCampSessions
                        .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime())
                        .map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">{session.weekNo}주차</Badge>
                              <span className="text-sm font-medium">
                                {format(session.sessionDate, 'yyyy.MM.dd')}
                              </span>
                              {session.note && (
                                <span className="text-xs text-muted-foreground">
                                  {session.note}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSession(session)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSession(session.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {newCampSessions.length > 0 && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      세션 일정의 마지막 날짜가 종료일로 자동 설정됩니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 상태 (히든 - 수정 시에만 표시) */}
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={newCamp.status || '준비중'}
                  onValueChange={(value: '준비중' | '진행중' | '종료') =>
                    setNewCamp({ ...newCamp, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="준비중">준비중</SelectItem>
                    <SelectItem value="진행중">진행중</SelectItem>
                    <SelectItem value="종료">종료</SelectItem>
                  </SelectContent>
                </Select>
                {newCamp.endDate && newCamp.endDate < new Date() && (
                  <p className="text-xs text-muted-foreground">
                    종료일이 지나서 상태가 자동으로 '종료'로 설정됩니다.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="note">비고</Label>
              <Textarea
                id="note"
                value={newCamp.note || ''}
                onChange={(e) => setNewCamp({ ...newCamp, note: e.target.value })}
                placeholder="운영 특이사항을 입력하세요. 각 줄은 자동으로 불릿 포인트로 표시됩니다."
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                각 줄은 자동으로 불릿 포인트로 표시됩니다.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveCamp}>
              {isEditing ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 세션 추가/수정 다이얼로그 */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSession ? '세션 수정' : '새 세션 추가'}</DialogTitle>
            <DialogDescription>
              세션 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-weekNo">주차 번호 *</Label>
              <Input
                id="session-weekNo"
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
              <Label htmlFor="session-note">비고</Label>
              <Textarea
                id="session-note"
                value={sessionForm.note || ''}
                onChange={(e) => setSessionForm({ ...sessionForm, note: e.target.value })}
                placeholder="운영 메모"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveSession}>
              {editingSession ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

