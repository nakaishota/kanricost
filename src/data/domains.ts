import type { Domain, DomainInfo } from '../types'

/** 配列順はタイブレーク(同点時の突出領域判定)の優先順でもある */
export const domains: DomainInfo[] = [
  { id: 'mono', name: 'モノの管理', emoji: '📦' },
  { id: 'digital', name: 'デジタルの管理', emoji: '📱' },
  { id: 'people', name: '人間関係・予定の管理', emoji: '🗓️' },
  { id: 'money', name: 'お金・契約の管理', emoji: '💳' },
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
