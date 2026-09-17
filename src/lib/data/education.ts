import type { Certification, EducationItem } from '@/lib/types'

/**
 * Degree(s). The resume names the institution as "Universiti Teknologi MARA"
 * (UiTM) — a different institution from Universiti Teknologi Malaysia (UTM).
 * The resume wins; use UiTM.
 */
export const education = [
  {
    institution: 'Universiti Teknologi MARA (UiTM)',
    degree: 'B.Eng (Hons) Electrical and Electronic Engineering',
    location: 'Pulau Pinang, Malaysia',
    detail: 'CGPA 3.70 / 4.00',
    period: 'Mar 2016 – Jul 2019',
    startDate: '2016-03',
    endDate: '2019-07',
    icon: 'GraduationCap',
  },
] as const satisfies readonly EducationItem[]

export const certifications = [
  { name: 'Certified Engineer in Computer Vision', issuer: 'Skymind', icon: 'Award' },
  { name: 'Full Stack Web Development Bootcamp', issuer: null, icon: 'Award' },
] as const satisfies readonly Certification[]
