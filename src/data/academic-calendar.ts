export type CalendarCategory =
  | 'all'
  | 'undergraduate'
  | 'graduate-school'
  | 'laboratory-high-school'
  | 'college-of-law'
  | 'college-of-medicine'
  | 'holiday';

export interface CalendarCategoryMeta {
  id: CalendarCategory;
  label: string;
}

export interface CalendarEvent {
  id: string;
  month: string;
  monthLabel: string;
  dateText: string;
  title: string;
  category: CalendarCategory;
  subjectToPresidentialChange?: boolean;
}

export const ACADEMIC_CALENDAR_META = {
  academicYear: 'AY 2026–2027',
  sourceLabel: '[UPDATED] BULSU ACADEMIC CALENDAR A.Y. 2026-2027',
  sourceUrl: 'https://www.facebook.com/share/p/153Y4sms3A1/',
  presidentialNote:
    'The BulSU University President is granted authority to approve changes in schedules marked with an asterisk (*), as necessary.',
} as const;

export const CALENDAR_CATEGORIES: readonly CalendarCategoryMeta[] = [
  { id: 'all', label: 'Universal' },
  { id: 'undergraduate', label: 'Undergraduate' },
  { id: 'graduate-school', label: 'Graduate School' },
  { id: 'laboratory-high-school', label: 'Laboratory High School' },
  { id: 'college-of-law', label: 'College of Law' },
  { id: 'college-of-medicine', label: 'College of Medicine' },
  { id: 'holiday', label: 'Holiday' },
] as const;

export const CALENDAR_CATEGORY_MAP: Record<CalendarCategory, CalendarCategoryMeta> = {
  all: { id: 'all', label: 'Universal' },
  undergraduate: { id: 'undergraduate', label: 'Undergraduate' },
  'graduate-school': { id: 'graduate-school', label: 'Graduate School' },
  'laboratory-high-school': { id: 'laboratory-high-school', label: 'Laboratory High School' },
  'college-of-law': { id: 'college-of-law', label: 'College of Law' },
  'college-of-medicine': { id: 'college-of-medicine', label: 'College of Medicine' },
  holiday: { id: 'holiday', label: 'Holiday' },
};

interface RawMonthBlock {
  month: string;
  monthLabel: string;
  events: ReadonlyArray<{
    dateText: string;
    category: CalendarCategory;
    title: string;
    subjectToPresidentialChange?: boolean;
  }>;
}

const RAW_CALENDAR_MONTHS: readonly RawMonthBlock[] = [
  {
    month: '2026-06',
    monthLabel: 'June 2026',
    events: [
      {
        dateText: '29',
        category: 'all',
        title: 'Start of Classes for 1st Semester AY 2026-2027',
      },
      {
        dateText: '29 to Jul 11',
        category: 'all',
        title:
          'Change of Matriculation for 1st Semester of AY 2026-2027 / Enrollment of approved petition classes for 1st Semester AY 2026-2027',
      },
    ],
  },
  {
    month: '2026-07',
    monthLabel: 'July 2026',
    events: [
      {
        dateText: '1',
        category: 'college-of-medicine',
        title:
          'Orientation of incoming 1st year students for the College of Medicine of 1st Semester AY 2026-2027',
      },
      {
        dateText: '1 to 3',
        category: 'college-of-medicine',
        title: 'Annual Comprehensive Exam for 2nd Year and 3rd Year Medicine Students',
      },
      {
        dateText: '1 to 31',
        category: 'undergraduate',
        title: 'National Disaster Resilience Month / HIV AIDS Awareness Month / Nutrition Month',
      },
      {
        dateText: '4',
        category: 'graduate-school',
        title: 'Last Session of C Classes of 2nd Trimester AY 2025-2026',
      },
      {
        dateText: '6',
        category: 'college-of-medicine',
        title: 'Start of Classes for College of Medicine 1st Semester AY 2026-2027',
      },
      {
        dateText: '6 to 9',
        category: 'graduate-school',
        title: 'Encoding of Grades for 2nd Trimester AY 2025-2026',
      },
      {
        dateText: '6 to 10',
        category: 'undergraduate',
        title: 'Local Academic Deliberation for Post-Academic Graduation of AY 2025-2026',
      },
      {
        dateText: '8 to 15',
        category: 'college-of-law',
        title: 'Qualifying Examinations for Review Subjects (JD 4th Year)',
      },
      {
        dateText: '10',
        category: 'graduate-school',
        title: 'Orientation of the new students for the 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '11',
        category: 'graduate-school',
        title: 'First Session of A Classes of 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '13 to 17',
        category: 'college-of-law',
        title: 'Enrollment Period for 1st Semester, AY 2026-2027 (JD/MLS and Refresher)',
      },
      {
        dateText: '13 to 18',
        category: 'graduate-school',
        title:
          'Hybrid enrollment of Thesis-Dissertation Writing/Comprehensive examination and new in writing',
      },
      {
        dateText: '13 to Aug 7',
        category: 'graduate-school',
        title: 'Dropping of subjects',
      },
      {
        dateText: '18',
        category: 'college-of-law',
        title: 'Freshmen and Transferee Student Orientation for 1st Semester, AY 2026-2027',
      },
      {
        dateText: '20',
        category: 'college-of-law',
        title: 'Start of Classes for 1st Semester, AY 2026-2027 (JD/MLS and Refresher)',
      },
      {
        dateText: '20',
        category: 'undergraduate',
        title: 'University Academic Council for Post-Academic Graduation of AY 2025-2026',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '21 to Aug 7',
        category: 'college-of-law',
        title: 'Adding and Changing of Subject/s Period (JD and MLS)',
      },
      {
        dateText: '27',
        category: 'all',
        title: 'Midterm Examination 1st Semester AY 2026-2027 - Medical Technology Graduating students',
      },
    ],
  },
  {
    month: '2026-08',
    monthLabel: 'August 2026',
    events: [
      {
        dateText: '1 to 31',
        category: 'undergraduate',
        title: 'Buwan ng Wika / Breastfeeding Awareness Month',
      },
      {
        dateText: '1',
        category: 'graduate-school',
        title: 'Last session of A Classes of 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '7',
        category: 'graduate-school',
        title:
          'PM - Orientation of Comprehensive Examination Takers, Thesis/Dissertation/Practice-based/Capstone Project Writing',
      },
      {
        dateText: '8',
        category: 'graduate-school',
        title: 'First Session of B Classes of 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '9',
        category: 'undergraduate',
        title: 'National Indigenous Peoples Day',
      },
      {
        dateText: '10 to Sep 5',
        category: 'graduate-school',
        title: 'GSAT Application for 1st Trimester AY 2026-2027',
      },
      {
        dateText: '10 to 14',
        category: 'college-of-medicine',
        title: 'Preliminary Examination for College of Medicine for 1st Semester AY 2026-2027',
      },
      {
        dateText: '15',
        category: 'holiday',
        title: 'Bulacan Foundation Day (Special Non-Working Holiday - Proclamation No. 625, July 5, 2022)',
      },
      {
        dateText: '17 to 21',
        category: 'graduate-school',
        title: 'Review for Comprehensive Examination',
      },
      {
        dateText: '20',
        category: 'graduate-school',
        title: 'Orientation of the New Students for the 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '21',
        category: 'holiday',
        title: 'Ninoy Aquino Day (Special Non-Working Holiday)',
      },
      {
        dateText: '22',
        category: 'graduate-school',
        title: 'Day 1 Comprehensive Examination (Core)',
      },
      {
        dateText: '24 to 29',
        category: 'all',
        title: 'Midterm Examination (1st Semester AY 2026-2027)',
      },
      {
        dateText: '27 to 28',
        category: 'laboratory-high-school',
        title: 'LHS First Term Examination',
      },
      {
        dateText: '28',
        category: 'all',
        title:
          'Last day of dropping of subjects / application for leave of absence for 1st Semester of AY 2026-2027',
      },
      {
        dateText: '29',
        category: 'graduate-school',
        title:
          'Day 2 Comprehensive Examination (Major) / Last session of B Classes of 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '30',
        category: 'holiday',
        title: 'Marcelo H. Del Pilar Day (Special Non-Working Holiday - R.A. No. 7449, April 27, 1992)',
      },
      {
        dateText: '31',
        category: 'holiday',
        title: 'National Heroes Day (Regular Holiday)',
      },
    ],
  },
  {
    month: '2026-09',
    monthLabel: 'September 2026',
    events: [
      {
        dateText: '1 to 7',
        category: 'all',
        title: 'Midterm Examination (1st Semester AY 2026-2027)',
      },
      {
        dateText: '5',
        category: 'graduate-school',
        title: 'First Session of C Classes of 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '6',
        category: 'graduate-school',
        title: 'Graduate School Admission Test (GSAT) for the 1st Trimester AY 2026-2027',
      },
      {
        dateText: '7 to 11',
        category: 'graduate-school',
        title: 'Interview of GSAT Passers',
      },
      {
        dateText: '8',
        category: 'holiday',
        title:
          'Feast of Nativity of the Blessed Virgin Mary (Special Working Holiday - R.A. No. 1370, August 8, 2019)',
      },
      {
        dateText: '8 to 10',
        category: 'undergraduate',
        title: 'University Health Break',
      },
      {
        dateText: '10',
        category: 'college-of-law',
        title: 'Last day of dropping of subject/s (JD and MLS)',
      },
      {
        dateText: '13, 16, 20',
        category: 'college-of-law',
        title: 'Midterm Mock Bar Examinations (JD 4th Year)',
      },
      {
        dateText: '14',
        category: 'laboratory-high-school',
        title: 'Encoding of First Term Grades',
      },
      {
        dateText: '14 to 18',
        category: 'undergraduate',
        title: 'PWD Rights Week',
      },
      {
        dateText: '14 to 19',
        category: 'college-of-law',
        title: 'Midterm Examinations Week (JD 1st to 3rd Years)',
      },
      {
        dateText: '14 to 26',
        category: 'graduate-school',
        title: 'Hybrid enrollment for the New Students (Academics) for the 1st Trimester AY 2026-2027',
      },
      {
        dateText: '15',
        category: 'holiday',
        title: '127th Anniversary of the Malolos Congress (Proclamation No. 40, August 17, 2022)',
      },
      {
        dateText: '15',
        category: 'laboratory-high-school',
        title: 'End of First Term',
      },
      {
        dateText: '19',
        category: 'college-of-law',
        title: 'National Law Day',
      },
      {
        dateText: '21',
        category: 'undergraduate',
        title: 'Medical Technology Graduation for AY 2025-2026',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '21 to 25',
        category: 'college-of-medicine',
        title: 'Midterm Examination for College of Medicine for 1st Semester AY 2026-2027',
      },
      {
        dateText: '21 to 26',
        category: 'college-of-law',
        title: 'Faculty Performance Evaluation Week',
      },
      {
        dateText: '21 to Oct 3',
        category: 'graduate-school',
        title:
          'Hybrid enrollment for Continuing Students and Returning Students with Lapsed Residency (Academic) for the 1st Trimester AY 2026-2027',
      },
      {
        dateText: '22',
        category: 'laboratory-high-school',
        title:
          'Issuance of First Term Report Card (meeting with the parents and election of homeroom PTA Officers)',
      },
      {
        dateText: '22',
        category: 'undergraduate',
        title: 'Kainang Pamilyang Pilipino Mahalaga Day',
      },
      {
        dateText: '26',
        category: 'graduate-school',
        title: 'Last Session of C Classes of 3rd Trimester AY 2025-2026',
      },
      {
        dateText: '28',
        category: 'all',
        title:
          'Final Examination for 1st Semester AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '28 to Oct 2',
        category: 'college-of-medicine',
        title: 'Health Break for College of Medicine for 1st Semester AY 2026-2027',
      },
      {
        dateText: '28 to Oct 2',
        category: 'graduate-school',
        title: 'Encoding of grades for 3rd Trimester AY 2025-2026',
      },
    ],
  },
  {
    month: '2026-10',
    monthLabel: 'October 2026',
    events: [
      {
        dateText: '1 to 7',
        category: 'undergraduate',
        title: 'Elderly Filipino Week',
      },
      {
        dateText: '1 to 31',
        category: 'undergraduate',
        title: 'National Indigenous Peoples Month / Breast Cancer Awareness Month',
      },
      {
        dateText: '2',
        category: 'graduate-school',
        title: 'Orientation of the New Students for the 1st Trimester AY 2026-2027',
      },
      {
        dateText: '3',
        category: 'graduate-school',
        title: 'First Session of A Classes of 1st Trimester AY 2026-2027',
      },
      {
        dateText: '5',
        category: 'undergraduate',
        title: 'BulSU Faculty Appreciation Day',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '5 to 7',
        category: 'all',
        title:
          'Comprehensive Examination for 1st Semester AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '5 to 31',
        category: 'graduate-school',
        title: 'Dropping of Subject/s',
      },
      {
        dateText: '6 to 9',
        category: 'undergraduate',
        title: 'University Intramurals 2026',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '12 to 16',
        category: 'all',
        title:
          'Online posting of grades for 1st Semester AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '15 to 17',
        category: 'all',
        title:
          'Online enrollment of graduating students of Medical Technology for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '19',
        category: 'all',
        title: 'Start of 2nd Semester of AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '23',
        category: 'graduate-school',
        title:
          'PM - Orientation of Comprehensive Examination Takers, Thesis/Dissertation/Practice-based/Capstone Project Writing',
      },
      {
        dateText: '24',
        category: 'graduate-school',
        title: 'Last Session of A Classes of 1st Trimester AY 2026-2027',
      },
      {
        dateText: '26 to Nov 21',
        category: 'graduate-school',
        title: 'GSAT Application for the 2nd Trimester of AY 2026-2027',
      },
      {
        dateText: '31',
        category: 'graduate-school',
        title: 'First Session of B Classes of 1st Trimester AY 2026-2027',
      },
    ],
  },
  {
    month: '2026-11',
    monthLabel: 'November 2026',
    events: [
      {
        dateText: '1',
        category: 'holiday',
        title: "All Saints' Day (Special Non-Working Holiday)",
      },
      {
        dateText: '2',
        category: 'holiday',
        title: "All Souls' Day (Observance)",
      },
      {
        dateText: '3 to 6',
        category: 'graduate-school',
        title: 'Review of Comprehensive Examination',
      },
      {
        dateText: '3 to 7',
        category: 'all',
        title: 'Final Examination for 1st Semester AY 2026-2027',
      },
      {
        dateText: '3 to 9',
        category: 'college-of-medicine',
        title: 'Final Examination for College of Medicine for 1st Semester AY 2026-2027',
      },
      {
        dateText: '4 to 5',
        category: 'all',
        title: 'Founding Anniversary of Bustos Campus',
      },
      {
        dateText: '7',
        category: 'graduate-school',
        title: 'Day 1 Comprehensive Examination (Core)',
      },
      {
        dateText: '7',
        category: 'all',
        title: 'End of Classes 1st Semester AY 2026-2027',
      },
      {
        dateText: '9 to 11',
        category: 'all',
        title: 'Online Posting of Grades for 1st Semester of AY 2026-2027',
      },
      {
        dateText: '9 to 14',
        category: 'college-of-law',
        title: 'Final Subject Assessments Week (JD 4th Year)',
      },
      {
        dateText: '12 to 17',
        category: 'all',
        title: 'Application of Petitioned Classes for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '12',
        category: 'all',
        title: 'Online enrollment of 3rd, 4th and 5th Year Regular Students / Night Class',
      },
      {
        dateText: '13',
        category: 'all',
        title: 'Online enrollment of 1st and 2nd Year Regular Students / CPTE and CPE Students',
      },
      {
        dateText: '14',
        category: 'all',
        title: 'Online enrollment for Irregular Students',
      },
      {
        dateText: '14',
        category: 'graduate-school',
        title: 'Day 2 Comprehensive Examination (Major)',
      },
      {
        dateText: '15',
        category: 'all',
        title: 'Online enrollment for late enrollees',
      },
      {
        dateText: '15, 18, 22',
        category: 'college-of-law',
        title: 'Final Mock Bar Examinations (JD 4th Year)',
      },
      {
        dateText: '16',
        category: 'all',
        title: 'Start of Classes for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '16 to 20',
        category: 'college-of-medicine',
        title: 'Enrollment of students of College of Medicine for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '16 to 21',
        category: 'college-of-law',
        title: 'Final Examinations Week (JD 1st to 3rd Years)',
      },
      {
        dateText: '16 to 22',
        category: 'college-of-law',
        title: 'Comprehensive Examinations Week (MLS)',
      },
      {
        dateText: '16 to 28',
        category: 'all',
        title: 'Change of Matriculation for 2nd Semester of AY 2026-2027',
      },
      {
        dateText: '19',
        category: 'undergraduate',
        title: "International Men's Day",
      },
      {
        dateText: '21',
        category: 'graduate-school',
        title: 'Last Session of B Classes of 1st Trimester AY 2026-2027',
      },
      {
        dateText: '22',
        category: 'graduate-school',
        title: 'Graduate School Admission Test for the 2nd Trimester AY 2026-2027',
      },
      {
        dateText: '23',
        category: 'college-of-medicine',
        title: 'Start of Classes for College of Medicine 2nd Semester AY 2026-2027',
      },
      {
        dateText: '23 to 28',
        category: 'college-of-law',
        title:
          'Departmental Examinations Week (JD 1st to 3rd Years) / Oral Examinations (Revalida) Week (JD 4th Year)',
      },
      {
        dateText: '23 to 27',
        category: 'graduate-school',
        title: 'Interview of GSAT Passers',
      },
      {
        dateText: '23 to 27',
        category: 'undergraduate',
        title: 'Local Academic Deliberation for Mid-Academic Graduation of AY 2026-2027',
      },
      {
        dateText: '25 to Dec 12',
        category: 'undergraduate',
        title: '18-Day Campaign to End Violence Against Women',
      },
      {
        dateText: '26 to 27',
        category: 'laboratory-high-school',
        title: 'Second Term Exam',
      },
      {
        dateText: '28',
        category: 'graduate-school',
        title: 'First Session of C Classes of 1st Trimester AY 2026-2027',
      },
      {
        dateText: '28 to Dec 12',
        category: 'graduate-school',
        title: 'Enrollment of New Students (Academics) for the 2nd Trimester AY 2026-2027',
      },
      {
        dateText: '30',
        category: 'holiday',
        title: 'Bonifacio Day (Regular Holiday)',
      },
    ],
  },
  {
    month: '2026-12',
    monthLabel: 'December 2026',
    events: [
      {
        dateText: '1 to 4',
        category: 'undergraduate',
        title: 'University Foundation Week 2026',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '3',
        category: 'undergraduate',
        title: 'International Day of Persons with Disabilities',
      },
      {
        dateText: '7',
        category: 'undergraduate',
        title: 'University Academic Council for Mid-Academic Graduation of AY 2026-2027',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '7',
        category: 'all',
        title:
          'Preliminary Examination for 2nd Semester AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '7 to 19',
        category: 'graduate-school',
        title: 'Enrollment of Continuing Students (Academics) for the 2nd Trimester AY 2026-2027',
      },
      {
        dateText: '8',
        category: 'holiday',
        title:
          'Feast of the Immaculate Conception (Special Non-Working Holiday - R.A. No. 10966, Dec. 28, 2017)',
      },
      {
        dateText: '14',
        category: 'laboratory-high-school',
        title: 'Encoding of 2nd Term Grades',
      },
      {
        dateText: '14 to Jan 9',
        category: 'graduate-school',
        title:
          'Hybrid enrollment for Thesis-Dissertation Writing/Comprehensive examinations and New Writing for the 2nd Trimester AY 2026-2027',
      },
      {
        dateText: '15',
        category: 'college-of-law',
        title: 'Submission and posting of Final Grades for 1st Semester AY 2026-2027 (JD/MLS and Refresher)',
      },
      {
        dateText: '18',
        category: 'undergraduate',
        title: 'University-wide Pasasalamat 2026',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '19',
        category: 'graduate-school',
        title: 'PM - Year-end party / Last Session of C Classes for 1st Trimester AY 2026-2027',
      },
      {
        dateText: '21 to Jan 3',
        category: 'all',
        title: "Christmas Break (14 Days: Faculty's PVP)",
      },
      {
        dateText: '21 to Jan 8',
        category: 'graduate-school',
        title: 'Encoding of Grades for 1st Trimester AY 2026-2027',
      },
      {
        dateText: '23',
        category: 'graduate-school',
        title: 'First Day of Christmas Break',
      },
      {
        dateText: '25',
        category: 'holiday',
        title: 'Christmas Day (Regular Holiday)',
      },
      {
        dateText: '30',
        category: 'holiday',
        title: 'Rizal Day (Regular Holiday)',
      },
      {
        dateText: '31',
        category: 'holiday',
        title: "Last Day of the Year (New Year's Eve) - Special Non-Working Holiday",
      },
    ],
  },
  {
    month: '2027-01',
    monthLabel: 'January 2027',
    events: [
      {
        dateText: '1',
        category: 'holiday',
        title: "New Year's Day (Regular Holiday)",
      },
      {
        dateText: '4',
        category: 'all',
        title: 'Resumption of Classes of 2nd Semester AY 2026-2027',
      },
      {
        dateText: '8',
        category: 'graduate-school',
        title: 'Orientation of the New Students for the 2nd Trimester AY 2026-2027',
      },
      {
        dateText: '8',
        category: 'laboratory-high-school',
        title: 'Issuance of Second Term Report Card',
      },
      {
        dateText: '9',
        category: 'graduate-school',
        title: 'First session of A Classes of 2nd Trimester AY 2026-2027',
      },
      {
        dateText: '11',
        category: 'all',
        title:
          'Midterm Examination for 2nd Semester AY 2026-2027 - 3rd Year Medical Technology Students',
      },
      {
        dateText: '11 to Feb 5',
        category: 'graduate-school',
        title: 'Dropping of subject/s',
      },
      {
        dateText: '11 to 15',
        category: 'college-of-medicine',
        title: 'Preliminary Examination for College of Medicine for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '11 to 15',
        category: 'college-of-law',
        title: 'Enrollment period for 2nd Semester AY 2026-2027 (JD/MLS and Refresher)',
      },
      {
        dateText: '18',
        category: 'college-of-law',
        title: 'Start of Classes for 2nd Semester AY 2026-2027 (JD/MLS and Refresher)',
      },
      {
        dateText: '18 to 22',
        category: 'all',
        title: 'Online posting of grades 1st Semester AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '18 to Feb 5',
        category: 'college-of-law',
        title: 'Adding and Changing of Subject/s Period (JD and MLS)',
      },
      {
        dateText: '22',
        category: 'all',
        title:
          'Last day of dropping subject/s / application for leave of absence for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '23',
        category: 'holiday',
        title: 'First Philippine Republic (Special Non-Working Holiday - R.A. 11014, April 5, 2018)',
      },
      {
        dateText: '25 to 30',
        category: 'all',
        title: 'Midterm Examination (2nd Semester AY 2026-2027)',
      },
      {
        dateText: '29',
        category: 'graduate-school',
        title:
          'PM - Orientation of Comprehensive Examination Takers, Thesis/Dissertation/Practice-based/Capstone Project Writing',
      },
      {
        dateText: '30',
        category: 'graduate-school',
        title: 'Last Session of A Classes for 2nd Trimester AY 2026-2027',
      },
    ],
  },
  {
    month: '2027-02',
    monthLabel: 'February 2027',
    events: [
      {
        dateText: '1 to 3',
        category: 'undergraduate',
        title: 'University Health Break',
      },
      {
        dateText: '6',
        category: 'holiday',
        title: "Chinese Lunar New Year's Day (Special Non-Working Holiday)",
      },
      {
        dateText: '22 to 23',
        category: 'laboratory-high-school',
        title: 'Grade 10 Last Term Exam',
      },
      {
        dateText: '22 to 26',
        category: 'college-of-medicine',
        title: 'Midterm Examination for College of Medicine for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '25',
        category: 'holiday',
        title: 'EDSA Revolution / People Power Revolution Anniversary Day',
      },
    ],
  },
  {
    month: '2027-03',
    monthLabel: 'March 2027',
    events: [
      {
        dateText: '1 to 31',
        category: 'undergraduate',
        title: "Women's Month",
      },
      {
        dateText: '5',
        category: 'laboratory-high-school',
        title: 'Grade 10 Deliberation of Honors',
      },
      {
        dateText: '8 to 13',
        category: 'all',
        title:
          'Final Examination for Graduating Students and 3rd Year Medical Technology Students for 2nd Semester of AY 2026-2027',
      },
      {
        dateText: '10',
        category: 'holiday',
        title: "Eid'l Fitr - Festival of Breaking the Fast (Regular Holiday)",
      },
      {
        dateText: '11',
        category: 'college-of-law',
        title: 'Last day of dropping of subject/s (JD and MLS)',
      },
      {
        dateText: '14, 17, 21',
        category: 'college-of-law',
        title: 'Midterm Mock Bar Examinations (JD 4th Year)',
      },
      {
        dateText: '15 to 16',
        category: 'laboratory-high-school',
        title: 'Last Term Exam (Grade 7 - 9)',
      },
      {
        dateText: '15 to 20',
        category: 'college-of-law',
        title: 'Midterm Examinations Week (JD 1st to 3rd Years)',
      },
      {
        dateText: '15 to 20',
        category: 'all',
        title: 'Online Posting of Grades for Graduating Students for 2nd Semester of AY 2026-2027',
      },
      {
        dateText: '22',
        category: 'laboratory-high-school',
        title: 'Encoding of Last Term Grade (Grade 7 - 9)',
      },
      {
        dateText: '22',
        category: 'all',
        title: 'White Coat and Pinning Ceremony for Batch 2028',
      },
      {
        dateText: '22 to 26',
        category: 'college-of-medicine',
        title: 'Health Break for College of Medicine for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '25',
        category: 'holiday',
        title: 'Maundy Thursday (Regular Holiday)',
      },
      {
        dateText: '26',
        category: 'holiday',
        title: 'Good Friday (Regular Holiday)',
      },
      {
        dateText: '27',
        category: 'holiday',
        title: 'Black Saturday (Special Non-Working Holiday)',
      },
      {
        dateText: '28',
        category: 'holiday',
        title: 'Easter Sunday (Observance)',
      },
      {
        dateText: '28 to Apr 2',
        category: 'college-of-law',
        title: 'Faculty Performance Evaluation Week',
      },
      {
        dateText: '29 to Apr 3',
        category: 'all',
        title:
          'Final Examination for Non-Graduating Students and Medical Technology Graduating Students for 2nd Semester of AY 2026-2027',
      },
      {
        dateText: '29 to Apr 2',
        category: 'laboratory-high-school',
        title: 'Signing of clearance and completion of requirements',
      },
      {
        dateText: '30',
        category: 'laboratory-high-school',
        title: 'Deliberation of Honors (Grade 7 - 9)',
      },
      {
        dateText: '31 to Apr 2',
        category: 'undergraduate',
        title: 'Local Academic Deliberation for Regular Graduation of AY 2026-2027',
      },
    ],
  },
  {
    month: '2027-04',
    monthLabel: 'April 2027',
    events: [
      {
        dateText: '2, 5 to 6',
        category: 'laboratory-high-school',
        title: 'Rehearsal Moving Up and Recognition',
      },
      {
        dateText: '3',
        category: 'all',
        title: 'End of Classes for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '5',
        category: 'all',
        title:
          'Comprehensive Examination for 2nd Semester AY 2026-2027 - Medical Technology Graduating Students',
      },
      {
        dateText: '5 to 8',
        category: 'all',
        title:
          'Online Posting of Grades for Non-Graduating Students and Medical Technology Graduating Students for 2nd Semester of AY 2026-2027',
      },
      {
        dateText: '5 to 9',
        category: 'college-of-medicine',
        title: 'Final Examination for College of Medicine for 2nd Semester AY 2026-2027',
      },
      {
        dateText: '7',
        category: 'laboratory-high-school',
        title: 'Baccalaureate Mass and Recognition Day',
      },
      {
        dateText: '8',
        category: 'laboratory-high-school',
        title: 'Moving Up Ceremony / LHS End of School Year 2026-2027',
      },
      {
        dateText: '9',
        category: 'holiday',
        title: 'Day of Valor / Araw ng Kagitingan (Regular Holiday)',
      },
      {
        dateText: '12',
        category: 'laboratory-high-school',
        title: 'Reading of forms',
      },
      {
        dateText: '12 to 14',
        category: 'all',
        title: 'Application of Petitioned Classes for Post-Academic AY 2026-2027',
      },
      {
        dateText: '12 to 14',
        category: 'all',
        title: 'Online Enrollment for Regularly Offered Post-Academic Classes of AY 2026-2027',
      },
      {
        dateText: '12 to 16',
        category: 'college-of-medicine',
        title: 'Comprehensive Examination for all students of the College of Medicine',
      },
      {
        dateText: '13',
        category: 'laboratory-high-school',
        title: 'Sectioning and Preparation of Report Cards',
      },
      {
        dateText: '14',
        category: 'laboratory-high-school',
        title: 'Issuance of Last Term Report Card',
      },
      {
        dateText: '15 to 18',
        category: 'all',
        title:
          'Online enrollment of Approved Petition Class for Post-Academic AY 2026-2027 and late enrollees',
      },
      {
        dateText: '16',
        category: 'undergraduate',
        title: 'University Academic Council for Regular Graduation of AY 2026-2027',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '19',
        category: 'all',
        title: 'Start of Classes for Post-Academic AY 2026-2027',
      },
      {
        dateText: '19 to 20',
        category: 'all',
        title: 'Change of Matriculation for Post-Academic AY 2026-2027',
      },
      {
        dateText: '19 to 23',
        category: 'laboratory-high-school',
        title: 'Application of Incoming Grade 7 Students',
      },
      {
        dateText: '19 to 23',
        category: 'college-of-medicine',
        title: 'Remedial examination for conditional students of the College of Medicine',
      },
      {
        dateText: '26 to 30',
        category: 'all',
        title:
          'Submission of Entry Requirements of Qualified First Year Students and Pre-enrollment and Online Enrollment of Freshmen for 1st Semester of AY 2027-2028',
      },
      {
        dateText: '26 to 30',
        category: 'college-of-law',
        title: 'Final Subject Assessments Week (JD 4th Year)',
      },
      {
        dateText: '26 to 30',
        category: 'laboratory-high-school',
        title: 'Interview of incoming Grade 7 Applicants',
      },
      {
        dateText: '30',
        category: 'all',
        title:
          'Last day of dropping subject/s / application for leave of absence for Summer 2026-2027',
      },
    ],
  },
  {
    month: '2027-05',
    monthLabel: 'May 2027',
    events: [
      {
        dateText: '1',
        category: 'holiday',
        title: 'Labor Day (Regular Holiday)',
      },
      {
        dateText: '2',
        category: 'laboratory-high-school',
        title: 'Incoming Grade 7 Entrance Exam',
      },
      {
        dateText: '3 to 4',
        category: 'all',
        title: 'Midterm Examination Period for Post-Academic AY 2026-2027',
      },
      {
        dateText: '3 to 8',
        category: 'college-of-law',
        title: 'Oral Examinations (Revalida) Week (JD 4th Year)',
      },
      {
        dateText: '4',
        category: 'all',
        title: 'Placement Examination of BSIT in Meneses Campus',
      },
      {
        dateText: '5',
        category: 'all',
        title: 'Placement Examination for the incoming 3rd Year BSBA students in Sarmiento Campus',
      },
      {
        dateText: '6 to 7',
        category: 'all',
        title: 'Placement Examination of BSHM in Meneses Campus',
      },
      {
        dateText: '9, 12, 16',
        category: 'college-of-law',
        title: 'Final Mock Bar Examinations (JD 4th Year)',
      },
      {
        dateText: '16',
        category: 'holiday',
        title: "Eid'l Adha - Feast of the Sacrifice (Regular Holiday)",
      },
      {
        dateText: '17 to 21, 24',
        category: 'undergraduate',
        title: 'Regular Graduation of AY 2026-2027 (86th Commencement Exercises)',
        subjectToPresidentialChange: true,
      },
      {
        dateText: '17 to 22',
        category: 'college-of-law',
        title:
          'Final Examinations Week (JD 1st to 3rd Years) / Comprehensive Examinations Week (MLS)',
      },
      {
        dateText: '24 to 28',
        category: 'laboratory-high-school',
        title: 'Enrollment schedule for School Year 2027-2028',
      },
      {
        dateText: '24 to 29',
        category: 'college-of-law',
        title: 'Departmental Examinations Week (JD 1st to 3rd Years)',
      },
      {
        dateText: '27 to 29',
        category: 'all',
        title: 'Final Examination Period for Post-Academic AY 2026-2027',
      },
      {
        dateText: '29',
        category: 'all',
        title: 'End of Classes for Post-Academic AY 2026-2027',
      },
      {
        dateText: '31',
        category: 'all',
        title: 'Online enrollment for 4th and 5th Year Regular Students',
      },
      {
        dateText: '31 to Jun 2',
        category: 'all',
        title: 'Online Posting of Grades for Post-Academic AY 2026-2027',
      },
    ],
  },
  {
    month: '2027-06',
    monthLabel: 'June 2027',
    events: [
      {
        dateText: '1',
        category: 'all',
        title: 'Online enrollment of 3rd Year Regular Students / Night Class',
      },
      {
        dateText: '2',
        category: 'all',
        title: 'Online enrollment of 2nd Year Regular Students / CPE / CPTE Students',
      },
      {
        dateText: '3 to 4',
        category: 'all',
        title: 'Online enrollment for Irregular Students and late enrollees',
      },
      {
        dateText: '5',
        category: 'college-of-law',
        title: 'College Academic Council Meeting / Deliberation of Graduating Students',
      },
      {
        dateText: '5',
        category: 'all',
        title:
          'Qualifying Examination for the incoming 2nd year, 3rd year, and 4th year education students in Sarmiento Campus',
      },
      {
        dateText: '7',
        category: 'college-of-law',
        title: 'Submission and posting of Final Grades for 2nd Semester AY 2026-2027 (JD 4th Year)',
      },
      {
        dateText: '7 to 11',
        category: 'all',
        title: 'Application of Petitioned Classes for 1st Semester AY 2027-2028',
      },
      {
        dateText: '7 to 11',
        category: 'all',
        title: 'Online enrollment of Shiftees/Transferees/Second Undergraduate Course Takers',
      },
      {
        dateText: '12',
        category: 'holiday',
        title: 'Philippine Independence Day (Regular Holiday)',
      },
      {
        dateText: '14',
        category: 'all',
        title: 'Start of Classes for 1st Semester AY 2027-2028',
      },
      {
        dateText: '14 to 25',
        category: 'all',
        title: 'Change of Matriculation for 1st Semester of AY 2027-2028',
      },
      {
        dateText: '19',
        category: 'college-of-law',
        title: 'Recollection Activity of Graduating Students',
      },
      {
        dateText: '21 to 23',
        category: 'undergraduate',
        title: 'Local Academic Deliberation for Post-Academic Graduation of AY 2026-2027',
      },
      {
        dateText: '22',
        category: 'college-of-law',
        title:
          'Submission and posting of Final Grades for 2nd Semester AY 2026-2027 (JD 1st to 3rd Year/MLS and Refresher)',
      },
    ],
  },
];

export const ACADEMIC_CALENDAR_EVENTS: readonly CalendarEvent[] = RAW_CALENDAR_MONTHS.flatMap(
  (block) =>
    block.events.map((event, idx) => ({
      id: `${block.month}-${String(idx + 1).padStart(2, '0')}`,
      month: block.month,
      monthLabel: block.monthLabel,
      dateText: event.dateText,
      title: event.title,
      category: event.category,
      ...(event.subjectToPresidentialChange ? { subjectToPresidentialChange: true } : {}),
    }))
);
