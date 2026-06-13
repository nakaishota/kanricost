import type { Domain, DomainInfo } from '../types'

/** 配列順はタイブレーク(同点時の最大領域判定)の優先順でもある */
export const domains: DomainInfo[] = [
  {
    id: 'mono',
    name: 'モノの管理',
    emoji: '📦',
    code: 'PHYSICAL',
    icon: '<path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z"/><path d="M5 8.5 12 12l7-3.5M12 12v8"/>',
  },
  {
    id: 'digital',
    name: 'デジタルの管理',
    emoji: '📱',
    code: 'DIGITAL',
    icon: '<rect x="7" y="3.5" width="10" height="17" rx="2"/><circle cx="12" cy="6.5" r="0.75"/>',
  },
  {
    id: 'people',
    name: '人間関係・予定の管理',
    emoji: '🗓️',
    code: 'SOCIAL',
    icon: '<rect x="5" y="5.5" width="14" height="14" rx="1.5"/><path d="M8 3.5v4M16 3.5v4M5 9.5h14M9 13.5h6"/>',
  },
  {
    id: 'money',
    name: 'お金・契約の管理',
    emoji: '💳',
    code: 'FINANCE',
    icon: '<rect x="4.5" y="6.5" width="15" height="11" rx="1.8"/><path d="M4.5 10h15"/>',
  },
]

export const domainIds: Domain[] = domains.map((d) => d.id)

export const domainInfo = (id: Domain): DomainInfo =>
  domains.find((d) => d.id === id)!

/** 1領域あたりの出題数 */
export const QUESTIONS_PER_DOMAIN = 5
/** 1回の診断の総出題数 */
export const TOTAL_QUESTIONS = QUESTIONS_PER_DOMAIN * domains.length
/** 1問の最高スコア */
export const MAX_SCORE_PER_QUESTION = 5
/** 領域別スコアの満点(= 25) */
export const MAX_DOMAIN_SCORE = QUESTIONS_PER_DOMAIN * MAX_SCORE_PER_QUESTION
/** 全体スコアの満点(= 100。そのままミニマリスト度%になる) */
export const MAX_TOTAL_SCORE = TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION
