import {
  User,
  Stethoscope,
  HandHelping,
  ConciergeBell,
  Home,
  Files,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

/** Mock data for the Clinical / EHR → Prospects screen (Robert Masters). */

export const prospect = {
  name: 'Robert Masters',
  badge: 'Prospect',
  sex: 'Male',
  age: '76 years',
  dob: 'Jun 12, 1949',
  room: 'Reserved 100a',
  targetMoveIn: 'Mar 1, 2027',
}

export const profileTabs: { label: string; icon: LucideIcon }[] = [
  { label: 'Profile', icon: User },
  { label: 'Medical', icon: Stethoscope },
  { label: 'Services', icon: HandHelping },
  { label: 'Daily Care', icon: ConciergeBell },
  { label: 'Housing', icon: Home },
  { label: 'Documents', icon: Files },
  { label: 'Activity Tracking', icon: BarChart3 },
]

export const profileSubNav = [
  'Summary',
  'Notes',
  'History',
  'Events',
  'Care Team',
  'Vitals',
  'Evaluations',
]

export type EvaluationStatus = 'Active' | 'Waiting Prospect'

export type EvaluationRow = {
  date: string
  name: string
  contactBy: string
  status: EvaluationStatus
  contactOwner: string
  referralSource: string
  livingPreference: string
}

export const evaluationRows: EvaluationRow[] = [
  {
    date: '10/01/2026',
    name: 'Michael',
    contactBy: 'Michelle Davis',
    status: 'Active',
    contactOwner: 'Alice Johnson',
    referralSource: 'Active Demand',
    livingPreference: 'Independent Living',
  },
  {
    date: '10/02/2026',
    name: 'Sophia Nguyen',
    contactBy: 'Michelle Davis',
    status: 'Waiting Prospect',
    contactOwner: 'Michael Smith',
    referralSource: 'Active Demand',
    livingPreference: 'Assisted Living',
  },
  {
    date: '10/03/2026',
    name: 'James Smith',
    contactBy: 'Alex Ferreira',
    status: 'Waiting Prospect',
    contactOwner: 'Emma Brown',
    referralSource: 'Unknown',
    livingPreference: 'Memory Care',
  },
  {
    date: '10/04/2026',
    name: 'Olivia Brown',
    contactBy: 'Michelle Davis',
    status: 'Active',
    contactOwner: 'James Wilson',
    referralSource: 'Facebook',
    livingPreference: 'Assisted Living',
  },
  {
    date: '10/05/2026',
    name: 'Liam Wilson',
    contactBy: 'Alex Ferreira',
    status: 'Active',
    contactOwner: 'Sophia Davis',
    referralSource: 'Active Demand',
    livingPreference: 'Memory Care',
  },
  {
    date: '10/05/2026',
    name: 'Liam Wilson',
    contactBy: 'Alex Ferreira',
    status: 'Active',
    contactOwner: 'Sophia Davis',
    referralSource: 'Active Demand',
    livingPreference: 'Memory Care',
  },
  {
    date: '10/05/2026',
    name: 'Liam Wilson',
    contactBy: 'Alex Ferreira',
    status: 'Active',
    contactOwner: 'Sophia Davis',
    referralSource: 'Active Demand',
    livingPreference: 'Memory Care',
  },
]

/** Evaluation types from the legacy app's "Create a New Evaluation" flow. */
export const evaluationTypes = [
  'Level of Care Evaluation',
  'B32-SS Social History Outline v1 2025-02-18',
  'Body Map',
  'DOH 694 Patient Review Instrument v1 2025-02-20',
  'DOH-3122 Medical Evaluation 2025-03-26',
  'DSS-4449D Nursing, Functional, Social Assessment v1 2025-02-18',
  'Fall Risk',
  'Idaho Roster Sample Matrix v1 2025-02-18',
  'MN Current Client Roster Basic',
]

export const statusStyles: Record<EvaluationStatus, string> = {
  Active: 'bg-[#d7fce3] text-[#0f484a]',
  'Waiting Prospect': 'bg-[#ffeacf] text-[#975709]',
}
