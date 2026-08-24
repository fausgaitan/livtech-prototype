import {
  FlaskRound,
  Users,
  Pill,
  ShieldHalf,
  BarChartBig,
  Settings,
  MessageCircleQuestion,
  SquareLibrary,
  BarChart3,
  SquareStack,
  type LucideIcon,
} from 'lucide-react'

/**
 * Shared palette for the CRM dashboard charts.
 * Sourced from the Figma "LivTech | Product Design" dashboard frame.
 */
export const chartColors = {
  email: '#4e1ead',
  call: '#1d7ee1',
  tour: '#00a9ab',
  outreach: '#9b2bc1',
  webChat: '#bbacfd',
} as const

/** Option C — Subtle Gradient palettes (purple→blue ramp from the Figma). */
export const gradientDonutPalette = [
  '#5b2f97', // Email
  '#805eb0', // Call
  '#b8a2d2', // Tour
  '#36a3f1', // Outreach Visit
  '#8cc6f8', // Web chat
]

export const gradientLeadPalette = [
  '#4e1ead',
  '#bbacfd',
  '#9b2bc1',
  '#1d7ee1',
  '#00a9ab',
]

export const gradientAreaColor = '#36a3f1'

/** Option B — Minimalistic: magenta area chart from the Figma. */
export const minimalAreaColor = '#b13be8'

// --- Sidebar navigation ------------------------------------------------------

export type NavChild = { label: string; path?: string }

export type NavItem = {
  label: string
  icon: LucideIcon
  /** Route prefix used to mark the group active (e.g. '/clinical'). */
  basePath?: string
  /** Where clicking the group navigates (its default child). */
  defaultPath?: string
  children?: NavChild[]
}

export const primaryNav: NavItem[] = [
  {
    label: 'Clinical / EHR',
    icon: FlaskRound,
    basePath: '/clinical',
    defaultPath: '/clinical/prospects',
    children: [
      { label: 'Dashboard' },
      { label: 'Care' },
      { label: 'Schedule' },
      { label: 'Residents' },
      { label: 'Reports' },
      { label: 'Prospects', path: '/clinical/prospects' },
      { label: 'Esign' },
      { label: 'State Forms' },
      { label: 'Configuration' },
    ],
  },
  {
    label: 'CRM',
    icon: Users,
    basePath: '/crm',
    defaultPath: '/crm/dashboard',
    children: [
      { label: 'Dashboard', path: '/crm/dashboard' },
      { label: 'Reports' },
      { label: 'Activities' },
      { label: 'Pipeline' },
      { label: 'Contacts' },
      { label: 'Waitlists' },
      { label: 'Configuration' },
    ],
  },
  { label: 'EMAR / Medication', icon: Pill },
  { label: 'Risk Management', icon: ShieldHalf },
  { label: 'Analytics / Eldermarts', icon: BarChartBig },
]

export const footerNav: { label: string; icon: LucideIcon }[] = [
  { label: 'Settings', icon: Settings },
  { label: 'Help & Support', icon: MessageCircleQuestion },
]

// --- Dashboard tabs ----------------------------------------------------------

export const dashboardTabs = [
  { label: 'New Media Leads', icon: SquareLibrary },
  { label: 'KPIs', icon: BarChart3 },
  { label: 'Breakdown', icon: SquareStack },
]

// --- Activity Mix (donut) ----------------------------------------------------

export type ActivitySlice = {
  name: string
  value: number
  percent: string
  color: string
}

export const activityMix: ActivitySlice[] = [
  { name: 'Email', value: 16, percent: '31%', color: chartColors.email },
  { name: 'Call', value: 13, percent: '25%', color: chartColors.call },
  { name: 'Tour', value: 6, percent: '12%', color: chartColors.tour },
  { name: 'Outreach Visit', value: 4, percent: '8%', color: chartColors.outreach },
  { name: 'Web chat', value: 2, percent: '20%', color: chartColors.webChat },
]

export const totalTouchpoints = 51

// --- Total Activities (area) -------------------------------------------------

export type ActivityPoint = { label: string; value: number }

export const totalActivitiesTrend: ActivityPoint[] = [
  { label: 'Oct 25', value: 30 },
  { label: 'Dec', value: 52 },
  { label: 'Feb', value: 40 },
  { label: 'May', value: 18 },
  { label: 'Aug', value: 44 },
  { label: 'Oct 26', value: 46 },
]

export const totalActivities = {
  logged: 51,
  goal: 10,
  goalPercent: '510% of goal',
  delta: '+15 vs October',
}

// --- Lead source (segmented bar) --------------------------------------------

export type LeadSource = {
  label: string
  percent: number
  color: string
}

export const leadSources: LeadSource[] = [
  { label: 'Active Demand', percent: 38, color: chartColors.email },
  { label: 'Website', percent: 22, color: chartColors.call },
  { label: 'Physician', percent: 14, color: chartColors.tour },
  { label: 'Facebook', percent: 12, color: chartColors.outreach },
  { label: 'Facebook', percent: 9, color: chartColors.webChat },
]

export const totalNewLeads = 48
