import { describe, expect, it } from 'vitest'
import { selectQuestions } from '../selectQuestions'
import { seededRng } from '../random'
import {
  domainIds,
  QUESTIONS_PER_DOMAIN,
  TOTAL_QUESTIONS,
} from '../../data/domains'
import type { Question } from '../../types'

describe('selectQuestions', () => {
  it('合計 TOTAL_QUESTIONS 問を返す', () => {
    const picked = selectQuestions(undefined, seededRng(1))
    expect(picked).toHaveLength(TOTAL_QUESTIONS)
  })

  it('各領域ちょうど QUESTIONS_PER_DOMAIN 問を含む', () => {
    const picked = selectQuestions(undefined, seededRng(42))
    for (const id of domainIds) {
      const count = picked.filter((q) => q.domain === id).length
      expect(count).toBe(QUESTIONS_PER_DOMAIN)
    }
  })

  it('重複した問題を含まない', () => {
    const picked = selectQuestions(undefined, seededRng(7))
    const ids = picked.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('同じシードでは決定的に同じ結果になる', () => {
    const a = selectQuestions(undefined, seededRng(123)).map((q) => q.id)
    const b = selectQuestions(undefined, seededRng(123)).map((q) => q.id)
    expect(a).toEqual(b)
  })

  it('異なるシードでは出題が変わりうる(再診断の新鮮さ)', () => {
    const a = selectQuestions(undefined, seededRng(1)).map((q) => q.id)
    const b = selectQuestions(undefined, seededRng(99999)).map((q) => q.id)
    expect(a).not.toEqual(b)
  })

  it('領域の問題が不足していれば例外を投げる', () => {
    const tooFew: Question[] = [
      {
        id: 'mono-x',
        domain: 'mono',
        scenario: 'dummy',
        choices: [
          { text: 'a', score: 0 },
          { text: 'b', score: 2 },
          { text: 'c', score: 4 },
          { text: 'd', score: 5 },
        ],
      },
    ]
    expect(() => selectQuestions(tooFew, seededRng(1))).toThrow()
  })
})
