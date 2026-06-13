export type Domain = 'mono' | 'digital' | 'people' | 'money'

export interface DomainInfo {
  id: Domain
  name: string
  emoji: string
  /** 結果画面などで使う英字コード(PHYSICAL / DIGITAL / SOCIAL / FINANCE) */
  code: string
  /** SVGアイコンの内側パス(stroke 描画) */
  icon: string
}

export interface Choice {
  text: string
  /** 管理コスト回避度。5 = 最も回避(手放す・持たない)、0 = 最も溜め込む */
  score: 0 | 2 | 4 | 5
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
  /** SVGアイコンの内側パス(stroke 描画) */
  icon: string
  /** 占い風の一言(キャッチコピー) */
  catchphrase: string
  /** 真面目な傾向解説 */
  description: string
  /** 暮らしへの活かし方の一言(One Point) */
  advice: string
}

export interface AnswerRecord {
  questionId: string
  domain: Domain
  score: number
}

/** 領域ごとの傾向コメント(内訳に応じて差し込む) */
export interface DomainComment {
  domain: Domain
  /** その領域のスコア 0〜25 */
  score: number
  /** 0(溜め込み)〜4(徹底回避)の5段階レベル */
  level: number
  comment: string
}

export interface DiagnosisResult {
  /** 0〜100。そのままミニマリスト度% */
  total: number
  /** 各領域 0〜25 */
  domainScores: Record<Domain, number>
  /** 最もスコアの高い領域(結果画面のハイライト用。常に存在) */
  maxDomain: Domain
  /** 領域スコアの最大-最小(偏りの大きさ。タイプ判定に使用) */
  spread: number
  type: ResultType
  /** 全体スコア帯ごとの一言(味付けコメント) */
  scoreBandComment: string
  /** 4領域それぞれの傾向コメント(domainIds 順) */
  domainComments: DomainComment[]
}
