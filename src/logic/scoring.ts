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

/** 突出領域とみなす偏り(他3領域平均との差)の閾値 */
export const DOMINANT_THRESHOLD = 5

/** 全体スコア帯の境界(この値以上で次の帯) */
export const SCORE_BAND_HODOHODO = 30
export const SCORE_BAND_MID = 55
export const SCORE_BAND_GACHI = 80

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
 * 突出領域を判定する。
 * deviation(d) = 領域スコア − 他3領域の平均。
 * 最大 deviation が DOMINANT_THRESHOLD 以上なら突出、未満なら null。
 * 同点は domainIds の定義順で先勝ち(決定的)。
 */
export function findDominantDomain(
  domainScores: Record<Domain, number>,
): Domain | null {
  let best: Domain | null = null
  let bestDeviation = -Infinity

  for (const id of domainIds) {
    const others = domainIds.filter((d) => d !== id)
    const othersAvg =
      others.reduce((sum, d) => sum + domainScores[d], 0) / others.length
    const deviation = domainScores[id] - othersAvg
    if (deviation > bestDeviation) {
      bestDeviation = deviation
      best = id
    }
  }

  return bestDeviation >= DOMINANT_THRESHOLD ? best : null
}

const MID_DOMAIN_TYPE: Record<Domain, string> = {
  mono: 'tebura',
  digital: 'tsuchi-zero',
  people: 'yotei-hakushi',
  money: 'koteihi-allergy',
}

/**
 * 全体スコア帯 × 突出領域 からタイプを決定する純関数。
 *   80〜100        → ガチミニマリスト型
 *   55〜79 × 突出  → 領域別タイプ
 *   55〜79 × なし  → 隠れ管理嫌い型
 *   30〜54        → ほどほど管理型
 *    0〜29        → 管理大好きコレクター型
 */
export function judgeType(
  total: number,
  dominantDomain: Domain | null,
): ResultType {
  if (total >= SCORE_BAND_GACHI) return resultTypeById('gachi-minimalist')
  if (total >= SCORE_BAND_MID) {
    return resultTypeById(
      dominantDomain ? MID_DOMAIN_TYPE[dominantDomain] : 'kakure-kanri-girai',
    )
  }
  if (total >= SCORE_BAND_HODOHODO) return resultTypeById('hodohodo')
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
  const dominantDomain = findDominantDomain(domainScores)
  const type = judgeType(total, dominantDomain)
  return {
    total,
    domainScores,
    dominantDomain,
    type,
    scoreBandComment: scoreBandComment(total),
    domainComments: buildDomainComments(domainScores),
  }
}
