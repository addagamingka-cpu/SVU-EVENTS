import { CampusEvent, StudentUser, StudentPass } from './types';

export const INITIAL_STUDENTS: StudentUser[] = [
  {
    id: 'user-1',
    fullName: 'AYUSH JANA',
    rollNumber: '006-121-2023-305',
    phoneNumber: '9876543210',
    department: 'Department of Computer Science & Engineering',
    year: '3rd Year (B.Tech)',
    avatarUrl: '',
    isOrganizer: true,
    organizerBadge: 'Chief Admin & Website Owner',
    isOwner: true,
    role: 'owner',
    registeredPassIds: ['pass-1', 'pass-2']
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'svu-live-01',
    title: "SVU 'INDEPENDANCE DAY' SPECIAL 2026",
    category: 'fest',
    categoryLabel: 'College Fest',
    categoryIcon: '🎉',
    status: 'live',
    isHappeningNow: true,
    activeDayLabel: 'Day 2 Active',
    liveStudentsCount: 1420,
    featured: true,
    date: '2026-08-15',
    displayDate: 'Today, 6:00 PM onwards',
    startTime: '18:00',
    endTime: '23:30',
    timeLabel: 'Today, 6:00 PM onwards',
    venueId: 'mukta_mancha',
    venueName: 'MUKTA MANCHA',
    venueDetails: 'SVU Central Open Air Stage, Barrackpore Campus',
    organizerName: 'SVU Student Council',
    organizerRole: 'Central Student Union',
    organizerRegNo: 'SVU/COUNCIL/2026',
    department: 'All University Faculties',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdglItc7ZXe0ePV9hX27MPYEgXDSD9ziGOLdRuNwJ-m6XhxYvNewLv4_e_InjnE9g6e9hkNZVcFYrwFSKU5kbWAglSglB-Drvnsv0AJr1dZ3SuU0JKf5E_Q6qXpMVVGwrO-VmIr7LOGZ2_P5fcux_-umlTDMkqv6l3PBxuoYqCop7GL5GS1JIHVRPJGbYhNvBRjJWK3zWIKMrYKBCHIvkesR1nSByn9CFBIlR1knIEnRf6ieyBiMchDcaVv8CFqlzFzogIZUA9-TBw3w',
    shortDescription: 'Day 2 — Rock Night & Band Faceoff. 80 Years of Freedom campus grand celebration.',
    fullDescription: "Experience the monumental celebration of the year! SVU Barrackpore lights up with electrifying inter-college music battles, adrenaline-charged DJ sets, premier theatrical performances by the SVU Drama Club, and mouth-watering culinary hubs. Join thousands of students celebrating unity and creativity.",
    perks: ['18+ Rock Bands', 'Laser & Drone Show', '24 Food Stalls', 'Street Plays'],
    requiresStudentId: true,
    isFreeForStudents: true,
    capacity: 2500,
    registeredCount: 1420,
    lineup: [
      {
        id: 'sch-1',
        time: '05:00 PM',
        stage: 'Amphi Main',
        title: 'Inauguration & Lamp Lighting',
        description: "Keynote addresses by Hon'ble Vice Chancellor & Academic Deans."
      },
      {
        id: 'sch-2',
        time: '06:30 PM',
        stage: 'Acoustic Arena',
        title: 'Battle of the Bands',
        description: '12 top colleges competing live for the coveted SVU Trophy & ₹50K prize.'
      },
      {
        id: 'sch-3',
        time: '08:30 PM',
        stage: 'Headliner Zone',
        title: 'Rock Band & Grand Laser Extravaganza',
        description: 'Live celebrity headline concert followed by the midnight synchronized laser show.'
      }
    ],
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'svu-hack-02',
    title: 'HackSVU 2026: 36-Hr Inter-College Hackathon',
    category: 'hackathon',
    categoryLabel: 'Hackathons',
    categoryIcon: '⚡',
    status: 'upcoming',
    isHappeningNow: false,
    activeDayLabel: 'Next Friday • 36h',
    featured: true,
    date: '2026-10-12',
    displayDate: 'Oct 12 - 14, 2026',
    startTime: '09:00',
    endTime: '21:00',
    timeLabel: 'Oct 12, 09:00 AM – Oct 14, 09:00 PM',
    venueId: 'auditorium_a',
    venueName: 'Auditorium Block A',
    venueDetails: 'Main Auditorium & CS Labs, Swami Vivekananda University',
    organizerName: 'AYUSH JANA',
    organizerRole: 'Tech Wing Lead',
    organizerRegNo: '006-121-2023-305',
    department: 'Department of CSE & IT',
    cashPrize: '₹50,000 Cash Prize',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjQB5r7wEyQjTYrQdiHGqj5Z_MGgiPy1dbP7_uw9h-VdMBf6Hc54BK5LmT_qAlkM0pNNW2-NufyDXnstHSUu178yRJ8AaCpxc0B2VFjn0YeWMxx7F3nRmEwFq_ceRpent6LuSjii9s1ol9U3J5t9enj6b7eo9qZb6K2QZXMkDirbO6VYWSB3SJsHKlL005vAepMGQjtIT0mQ1JymFWb800srhfiomiO7GtWHZ59IKq2lxaBdeTWuPfELVXZzA4ZKZXlZilVM6v2BNlQ',
    shortDescription: 'Build disruptive tech across AI, Web3, and HealthTech. Mentored by premier tech founders and industry engineers.',
    fullDescription: 'Join 500+ student innovators for a grueling yet exhilarating 36-hour sprint. Tackle real-world university and societal problem statements. All meals, midnight snacks, RedBull refills, and official certificates will be provided.',
    perks: ['Free Food & Swag', 'Open to all departments', 'Mentorship Sessions', '₹50K Prize Pool'],
    requiresStudentId: true,
    isFreeForStudents: true,
    capacity: 600,
    registeredCount: 482,
    lineup: [
      {
        id: 'sch-h1',
        time: 'Day 1 - 09:00 AM',
        stage: 'Block A Hall',
        title: 'Team Check-in & Hardware Kit Distribution',
        description: 'ID verification, credential check and desk allocation.'
      },
      {
        id: 'sch-h2',
        time: 'Day 1 - 11:00 AM',
        stage: 'Main Stage',
        title: 'Hacking Commences & Problem Statements Reveal',
        description: 'Track disclosures across Generative AI, Smart City & IoT.'
      },
      {
        id: 'sch-h3',
        time: 'Day 2 - 04:00 PM',
        stage: 'Jury Arena',
        title: 'Final Pitches & Winner Felicitation',
        description: 'Top 10 teams pitch to VC & university investor jury.'
      }
    ],
    createdAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'svu-fresh-03',
    title: 'Freshers Welcome 2026: "Aarohan"',
    category: 'freshers',
    categoryLabel: 'Freshers 2026',
    categoryIcon: '🌟',
    status: 'upcoming',
    isHappeningNow: false,
    activeDayLabel: 'Nov 02, 2026',
    featured: false,
    date: '2026-11-02',
    displayDate: 'Nov 02, 2026',
    startTime: '16:00',
    endTime: '22:00',
    timeLabel: 'Nov 02, 4:00 PM – 10:00 PM',
    venueId: 'central_lawn',
    venueName: 'SVU Central Lawn Garden',
    venueDetails: 'Under the "We Love SVU" landmark pavilion',
    organizerName: 'Department of Engineering & Technology',
    organizerRole: 'Faculty & Senior Student Council',
    organizerRegNo: 'SVU/ENGG/2026',
    department: 'Department of Engineering & Technology',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw',
    shortDescription: 'Welcoming the Batch of 2026-2030 with musical galas, department fashion walks, and Mr & Ms Fresher crownings.',
    fullDescription: 'The biggest induction night in Eastern India collegiate history. Celebrate new beginnings with your peers, seniors, and professors. Enjoy cultural dances, acoustic solos, and an exclusive DJ night to conclude.',
    perks: ['Student ID Required', 'Welcome Refreshments', 'Department Badges', 'Photobooth'],
    requiresStudentId: true,
    isFreeForStudents: true,
    capacity: 1200,
    registeredCount: 890,
    lineup: [
      {
        id: 'sch-f1',
        time: '04:00 PM',
        stage: 'Lawn Pavilion',
        title: 'Fresher Induction & Senior Address',
        description: 'Inspiring journey stories from university alumni and rank holders.'
      },
      {
        id: 'sch-f2',
        time: '06:00 PM',
        stage: 'Central Ramp',
        title: 'Mr. & Ms. Fresher 2026 Talent Rounds',
        description: 'Cosplay, instrumental solos, and spontaneous quiz challenges.'
      },
      {
        id: 'sch-f3',
        time: '08:30 PM',
        stage: 'DJ Enclosure',
        title: 'Open EDM Glow Night',
        description: 'Campus open dance floor under neon lasers.'
      }
    ],
    createdAt: '2026-09-10T14:30:00Z'
  },
  {
    id: 'svu-fest-04',
    title: 'SVU Annual Cultural Fest: Aakash 2026',
    category: 'cultural',
    categoryLabel: 'Cultural & Drama',
    categoryIcon: '🎭',
    status: 'upcoming',
    isHappeningNow: false,
    activeDayLabel: 'Oct 24, 2026',
    featured: true,
    date: '2026-10-24',
    displayDate: 'Friday, Oct 24, 2026',
    startTime: '17:00',
    endTime: '23:45',
    timeLabel: '5:00 PM onwards • Overnight Gala',
    venueId: 'amphi_lawns',
    venueName: 'SVU Main Amphitheatre & Lawns',
    venueDetails: 'Barrackpore Campus, West Bengal',
    organizerName: 'SVU Central Student Union & Cultural Committee',
    organizerRole: 'Cultural Secretary',
    organizerRegNo: 'SVU/CULT/2026-09',
    department: 'University Cultural Wing',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeMMrKqfba7AWZebctS-6V8cUauEGNTzrqF1sdCKSSXnI_2nlYnnEVA_4QveTxROT9BlSJgtgkQG67BKN89-cPKTebj2f6RkqHGvl8Ay8gCPOpW1idABpTf5vRL_QZPHKDo5QIaOlhzXV_IBMP0i_dyo9Re0NHL0tuI37soP15c8GQWJWhrMPAJhBepDjm_Lx64BhPW5F-YbrI9bRnKpTQ-LpVlUMkW1KVQ--R55LNgQxp31U7KkLELdKlusaKir4X-g',
    shortDescription: 'The mega annual cultural extravaganza featuring 18+ rock bands, drone night displays, and international food streets.',
    fullDescription: 'Experience the flagship university extravaganza of the year! SVU Barrackpore lights up with electrifying inter-college music battles, adrenaline-charged DJ sets, premier theatrical performances by the SVU Drama Club, and mouth-watering culinary hubs. Join thousands of students celebrating unity and creativity.',
    perks: ['18+ Rock Bands', 'Laser & Drone Show', '24 Food Stalls', 'Street Plays'],
    requiresStudentId: true,
    isFreeForStudents: true,
    capacity: 3500,
    registeredCount: 2190,
    lineup: [
      {
        id: 'sch-a1',
        time: '05:00 PM',
        stage: 'Amphi Main',
        title: 'Inauguration & Lamp Lighting',
        description: "Keynote addresses by Hon'ble Vice Chancellor & Academic Deans."
      },
      {
        id: 'sch-a2',
        time: '06:30 PM',
        stage: 'Acoustic Arena',
        title: 'Battle of the Bands',
        description: '12 top colleges competing live for the coveted SVU Trophy & ₹50K prize.'
      },
      {
        id: 'sch-a3',
        time: '08:30 PM',
        stage: 'Headliner',
        title: 'Rock Band & Grand Laser Extravaganza',
        description: 'Live celebrity headline concert followed by the midnight synchronized laser show.'
      }
    ],
    createdAt: '2026-09-12T16:00:00Z'
  },
  {
    id: 'svu-symp-05',
    title: 'AI & Robotics Tech Symposium',
    category: 'workshop',
    categoryLabel: 'Workshop / Seminar',
    categoryIcon: '🤖',
    status: 'upcoming',
    isHappeningNow: false,
    activeDayLabel: 'Nov 18, 2026',
    featured: false,
    date: '2026-11-18',
    displayDate: 'Nov 18, 2026',
    startTime: '10:00',
    endTime: '16:00',
    timeLabel: 'Nov 18, 10:00 AM – 4:00 PM',
    venueId: 'seminar_3',
    venueName: 'Seminar Hall 3 (ECE Wing)',
    venueDetails: 'Ground Floor, Technology Complex',
    organizerName: 'Dr. S. K. Banerjee & Tech Club',
    organizerRole: 'ECE Dept & Robotics Society',
    organizerRegNo: 'SVU/ECE/FAC/102',
    department: 'Department of ECE & AI/ML',
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Keynotes on Autonomous Systems & Hands-on Drone Simulation. High impact research papers and hardware showcases.',
    fullDescription: 'Dive deep into autonomous systems, neural networks for embedded microcontrollers, and quadcopter dynamics. Hands-on drone simulators provided for all registered participants.',
    perks: ['Certificates Provided', 'Hardware Demo Kits', 'Snacks & Lunch', 'IEEE Chapter Sponsored'],
    requiresStudentId: true,
    isFreeForStudents: true,
    capacity: 250,
    registeredCount: 215,
    lineup: [
      {
        id: 'sch-r1',
        time: '10:00 AM',
        stage: 'Main Hall',
        title: 'Keynote: Reinforcement Learning in Aerial Robotics',
        description: 'Distinguished visiting professor lecture.'
      },
      {
        id: 'sch-r2',
        time: '01:30 PM',
        stage: 'Lab 2',
        title: 'Quadcopter Firmware Tuning & Simulator Workshop',
        description: 'Hands on test sessions with ROS2 and PX4 autopilot.'
      }
    ],
    createdAt: '2026-09-15T09:00:00Z'
  },
  {
    id: 'svu-sport-06',
    title: 'Inter-Department Cricket Tournament 2026',
    category: 'sports',
    categoryLabel: 'Sports',
    categoryIcon: '⚽',
    status: 'upcoming',
    isHappeningNow: false,
    activeDayLabel: 'Dec 05 - 08, 2026',
    featured: false,
    date: '2026-12-05',
    displayDate: 'Dec 05 - 08, 2026',
    startTime: '08:30',
    endTime: '17:30',
    timeLabel: 'Dec 05, 8:30 AM onwards',
    venueId: 'sports_complex',
    venueName: 'SVU Main Sports Ground & Arena',
    venueDetails: 'East Campus Sports Field, Barrackpore',
    organizerName: 'SVU Sports Council',
    organizerRole: 'Sports Secretary',
    organizerRegNo: 'SVU/SPORTS/2026',
    department: 'Department of Physical Education',
    cashPrize: 'Trophy + ₹25,000',
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: '16 departments clashing for the coveted Vice-Chancellor Cricket Cup. Live commentary and food court.',
    fullDescription: 'The annual inter-department T-20 clash. 16 departmental teams battle over 4 days. Includes cheer squads, official BCCI-certified umpires, and live LED scoreboard.',
    perks: ['Free Entry for Students', 'Live DJ & Commentary', 'Hydration Stations'],
    requiresStudentId: true,
    isFreeForStudents: true,
    capacity: 1500,
    registeredCount: 640,
    lineup: [
      {
        id: 'sch-c1',
        time: '08:30 AM',
        stage: 'Pitch 1',
        title: 'Inaugural Match: CSE vs Mechanical Titans',
        description: 'Toss and preliminary league face-off.'
      }
    ],
    createdAt: '2026-09-20T11:00:00Z'
  }
];

export const INITIAL_PASSES: StudentPass[] = [
  {
    id: 'pass-1',
    passNumber: 'SVU-PASS-2026-AK8891',
    eventId: 'svu-fest-04',
    eventTitle: 'SVU Annual Cultural Fest: Aakash 2026',
    eventDate: 'Friday, Oct 24, 2026',
    eventTime: '5:00 PM onwards',
    venueName: 'SVU Main Amphitheatre & Lawns',
    studentName: 'AYUSH JANA',
    studentRollNumber: '006-121-2023-305',
    studentPhone: '+91 98765 43210',
    gateName: 'Entry Gate 1 (North Arch)',
    qrCodeValue: 'SVU-TICKET-AK2026-0061212023305-VERIFIED',
    issuedAt: '2026-09-22T10:15:00Z',
    status: 'confirmed'
  },
  {
    id: 'pass-2',
    passNumber: 'SVU-PASS-2026-HK4210',
    eventId: 'svu-hack-02',
    eventTitle: 'HackSVU 2026: 36-Hr Inter-College Hackathon',
    eventDate: 'Oct 12 - 14, 2026',
    eventTime: '09:00 AM onwards',
    venueName: 'Auditorium Block A',
    studentName: 'AYUSH JANA',
    studentRollNumber: '006-121-2023-305',
    studentPhone: '+91 98765 43210',
    gateName: 'Block A Main Gate',
    qrCodeValue: 'SVU-TICKET-HK2026-0061212023305-VERIFIED',
    issuedAt: '2026-09-24T14:20:00Z',
    status: 'confirmed'
  }
];

export const CAMPUS_VENUES = [
  { id: 'central_lawn', name: 'SVU Central Lawn ("We Love SVU" landmark)', location: 'Central Campus Lawn' },
  { id: 'auditorium_a', name: 'Main Auditorium Block A', location: 'Block A 1st Floor' },
  { id: 'seminar_2', name: 'Seminar Hall 2 (Ground Floor)', location: 'Administrative Wing' },
  { id: 'seminar_3', name: 'Seminar Hall 3 (ECE Wing)', location: 'Technology Complex' },
  { id: 'mukta_mancha', name: 'MUKTA MANCHA (Open Air Theatre)', location: 'East Campus' },
  { id: 'amphi_lawns', name: 'SVU Main Amphitheatre & Lawns', location: 'Central Amphitheatre' },
  { id: 'sports_complex', name: 'Indoor Sports Complex & Arena', location: 'East Athletic Grounds' },
  { id: 'lab_401', name: 'Computer Lab 401 (Tech Block)', location: 'Tech Block 4th Floor' }
];
