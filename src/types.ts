export type EventCategory = 
  | 'fest' 
  | 'hackathon' 
  | 'freshers' 
  | 'cultural' 
  | 'sports' 
  | 'workshop';

export type EventStatus = 'live' | 'upcoming' | 'completed';

export interface ScheduleItem {
  id: string;
  time: string;
  stage: string;
  title: string;
  description: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  categoryLabel: string;
  categoryIcon: string;
  status: EventStatus;
  isHappeningNow: boolean;
  activeDayLabel?: string;
  liveStudentsCount?: number;
  featured: boolean;
  date: string;
  displayDate: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
  venueId: string;
  venueName: string;
  venueDetails: string;
  organizerName: string;
  organizerRole: string;
  organizerRegNo: string;
  department: string;
  cashPrize?: string;
  bannerImage: string;
  bannerAlt?: string;
  shortDescription: string;
  fullDescription: string;
  perks: string[];
  requiresStudentId: boolean;
  isFreeForStudents: boolean;
  capacity: number;
  registeredCount: number;
  lineup: ScheduleItem[];
  createdAt: string;
}

export interface StudentUser {
  id: string;
  fullName: string;
  rollNumber: string;
  phoneNumber: string;
  department: string;
  year: string;
  avatarUrl: string;
  isOrganizer: boolean;
  organizerBadge?: string;
  isOwner?: boolean;
  role?: 'owner' | 'student';
  registeredPassIds: string[];
}

export interface StudentPass {
  id: string;
  passNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  studentName: string;
  studentRollNumber: string;
  studentPhone: string;
  gateName: string;
  qrCodeValue: string;
  issuedAt: string;
  status: 'confirmed' | 'checked_in' | 'cancelled';
}
