export type Domain = 'mono' | 'digital' | 'people' | 'money'

export interface DomainInfo {
  id: Domain
  name: string
  emoji: string
}

export interface Choice {
  text: string
  /** 管理コスト回避度。5 = 最も回避(手放す・持たない) */
  score: 0 | 1 | 3 | 5
}

export interface Question {
  /** "mono-01" 形式。領域プレフィクスで一意性を担保 */
  id: string
  domain: Domain
  /** 日常あるあるシナリオ文 */
  scenario: string
  choices: [Choice, Choice, Choice, Choice]
}

export interface ResultType {
  id: string
  name: string
  emoji: string
  /** 占い風の一言 */
  catchphrase: string
  /** 真面目な傾向解説 */
  description: string
  /** 暮らしへの活かし方の一言 */
  advice: string
}

export interface AnswerRecord {
  questionId: string
  domain: Domain
  score: number
}

export interface DiagnosisResult {
  /** 0〜100。そのままミニマリスト度% */
  total: number
  /** 各領域 0〜25 */
  domainScores: Record<Domain, number>
  /** 突出領域。偏りが閾値未満なら null */
  dominantDomain: Domain | null
  type: ResultType
}
