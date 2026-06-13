import type {
  AnswerRecord,
  DiagnosisResult,
  DomainComment,
  Domain,
  ResultType,
} from '../types'
import { domainIds } from '../data/domains'
import { resultTypeById } from '../data/resultTypes'
import {
  domainComments,
  domainLevel,
  scoreBandComment,
} from '../data/insights'

/** 全体スコア帯の境界(この値以上で次の帯) */
export const SCORE_BAND_HODOHODO = 40
export const SCORE_BAND_MID = 65
export const SCORE_BAND_GACHI = 85
/** 中スコア帯で「隠れ管理嫌い型」とみなす領域スコアの偏り(最大-最小)の閾値 */
export const SPREAD_THRESHOLD = 9

/** 領域別スコアを集計する(回答が無い領域は 0) */
export function aggregateDomainScores(
  answers: AnswerRecord[],
): Record<Domain, number> {
  const scores = {} as Record<Domain, number>
  for (const id of domainIds) scores[id] = 0
  for (const a of answers) scores[a.domain] += a.score
  return scores
}

/**
 * 最もスコアの高い領域を返す(結果ハイライト・領域別タイプ判定に使用)。
 * 同点は domainIds の定義順で先勝ち(決定的)。
 */
export function findMaxDomain(domainScores: Record<Domain, number>): Domain {
  let best = domainIds[0]
  for (const id of domainIds) {
    if (domainScores[id] > domainScores[best]) best = id
  }
  return best
}

/** 領域スコアの偏り(最大 - 最小) */
export function scoreSpread(domainScores: Record<Domain, number>): number {
  const vals = domainIds.map((id) => domainScores[id])
  return Math.max(...vals) - Math.min(...vals)
}

const MID_DOMAIN_TYPE: Record<Domain, string> = {
  mono: 'tebura',
  digital: 'tsuchi-zero',
  people: 'yotei-hakushi',
  money: 'koteihi-allergy',
}

/**
 * 全体スコア帯 × 領域の偏りからタイプを決定する純関数。
 *   85〜100        → ガチミニマリスト型
 *   65〜84 × 最大領域 → 領域別タイプ
 *   40〜64 × 偏り大   → 隠れ管理嫌い型
 *   40〜64 × 偏り小   → ほどほど管理型
 *    0〜39        → 管理大好きコレクター型
 */
export function judgeType(
  total: number,
  maxDomain: Domain,
  spread: number,
): ResultType {
  if (total >= SCORE_BAND_GACHI) return resultTypeById('gachi-minimalist')
  if (total >= SCORE_BAND_MID) return resultTypeById(MID_DOMAIN_TYPE[maxDomain])
  if (total >= SCORE_BAND_HODOHODO) {
    return resultTypeById(
      spread >= SPREAD_THRESHOLD ? 'kakure-kanri-girai' : 'hodohodo',
    )
  }
  return resultTypeById('collector')
}

/** 領域スコアから、各領域の傾向コメントを組み立てる(domainIds 順) */
export function buildDomainComments(
  domainScores: Record<Domain, number>,
): DomainComment[] {
  return domainIds.map((domain) => {
    const score = domainScores[domain]
    const level = domainLevel(score)
    return { domain, score, level, comment: domainComments[domain][level] }
  })
}

/** 回答一式から診断結果を組み立てる */
export function diagnose(answers: AnswerRecord[]): DiagnosisResult {
  const domainScores = aggregateDomainScores(answers)
  const total = answers.reduce((sum, a) => sum + a.score, 0)
  const maxDomain = findMaxDomain(domainScores)
  const spread = scoreSpread(domainScores)
  const type = judgeType(total, maxDomain, spread)
  return {
    total,
    domainScores,
    maxDomain,
    spread,
    type,
    scoreBandComment: scoreBandComment(total),
    domainComments: buildDomainComments(domainScores),
  }
}
