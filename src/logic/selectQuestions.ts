import type { Domain, Question } from '../types'
import { domainIds, QUESTIONS_PER_DOMAIN } from '../data/domains'
import { questionPool } from '../data/questions'
import { shuffle, type Rng } from './random'

/**
 * 各領域から QUESTIONS_PER_DOMAIN 問ずつ層化抽出し、出題順もシャッフルして返す。
 * プールに足りない領域があれば例外を投げる(データ不備の早期検知)。
 */
export function selectQuestions(
  pool: Question[] = questionPool,
  rng: Rng = Math.random,
): Question[] {
  const byDomain = new Map<Domain, Question[]>()
  for (const id of domainIds) byDomain.set(id, [])
  for (const q of pool) byDomain.get(q.domain)?.push(q)

  const picked: Question[] = []
  for (const id of domainIds) {
    const group = byDomain.get(id) ?? []
    if (group.length < QUESTIONS_PER_DOMAIN) {
      throw new Error(
        `領域 "${id}" の問題が不足しています(${group.length} < ${QUESTIONS_PER_DOMAIN})`,
      )
    }
    picked.push(...shuffle(group, rng).slice(0, QUESTIONS_PER_DOMAIN))
  }

  return shuffle(picked, rng)
}
