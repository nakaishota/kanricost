import { describe, expect, it } from 'vitest'
import { questionPool } from '../../data/questions'
import { domainIds, QUESTIONS_PER_DOMAIN } from '../../data/domains'

describe('問題データの整合性', () => {
  it('id がすべて一意である', () => {
    const ids = questionPool.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('各領域が出題数以上の問題を持つ(現状は各15問)', () => {
    for (const id of domainIds) {
      const count = questionPool.filter((q) => q.domain === id).length
      expect(count).toBeGreaterThanOrEqual(QUESTIONS_PER_DOMAIN)
      expect(count).toBe(15)
    }
  })

  it('id のプレフィクスが領域と一致する', () => {
    for (const q of questionPool) {
      expect(q.id.startsWith(`${q.domain}-`)).toBe(true)
    }
  })

  it('すべての問題が選択肢を4つ持つ', () => {
    for (const q of questionPool) {
      expect(q.choices).toHaveLength(4)
    }
  })

  it('すべての選択肢のスコアが {0,1,3,5} のいずれか', () => {
    const allowed = new Set([0, 1, 3, 5])
    for (const q of questionPool) {
      for (const c of q.choices) {
        expect(allowed.has(c.score)).toBe(true)
      }
    }
  })

  it('各問に score:0 と score:5 の選択肢が両方ある(満点・0点が到達可能)', () => {
    for (const q of questionPool) {
      const scores = q.choices.map((c) => c.score)
      expect(scores).toContain(0)
      expect(scores).toContain(5)
    }
  })

  it('シナリオ文と選択肢テキストが空でない', () => {
    for (const q of questionPool) {
      expect(q.scenario.trim().length).toBeGreaterThan(0)
      for (const c of q.choices) {
        expect(c.text.trim().length).toBeGreaterThan(0)
      }
    }
  })
})
