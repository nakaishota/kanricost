import { describe, expect, it } from 'vitest'
import {
  aggregateDomainScores,
  diagnose,
  findDominantDomain,
  judgeType,
  DOMINANT_THRESHOLD,
} from '../scoring'
import { domainIds, TOTAL_QUESTIONS } from '../../data/domains'
import type { AnswerRecord, Domain } from '../../types'

/** 各領域 perDomain 問、指定スコアの回答列を作る */
function answersOf(scoreByDomain: Record<Domain, number[]>): AnswerRecord[] {
  const out: AnswerRecord[] = []
  for (const id of domainIds) {
    scoreByDomain[id].forEach((score, i) =>
      out.push({ questionId: `${id}-${i}`, domain: id, score }),
    )
  }
  return out
}

/** 全問同じスコアの回答列(各領域5問・計20問) */
function uniformAnswers(score: number): AnswerRecord[] {
  const out: AnswerRecord[] = []
  for (const id of domainIds) {
    for (let i = 0; i < 5; i++) {
      out.push({ questionId: `${id}-${i}`, domain: id, score })
    }
  }
  return out
}

describe('aggregateDomainScores', () => {
  it('領域ごとに合計する', () => {
    const scores = aggregateDomainScores([
      { questionId: 'mono-1', domain: 'mono', score: 5 },
      { questionId: 'mono-2', domain: 'mono', score: 3 },
      { questionId: 'money-1', domain: 'money', score: 1 },
    ])
    expect(scores.mono).toBe(8)
    expect(scores.money).toBe(1)
    expect(scores.digital).toBe(0)
  })
})

describe('judgeType — 全体スコア帯', () => {
  it('全部0点 → 0% → 管理大好きコレクター型', () => {
    const r = diagnose(uniformAnswers(0))
    expect(r.total).toBe(0)
    expect(r.type.id).toBe('collector')
  })

  it('全部5点 → 100% → ガチミニマリスト型', () => {
    const r = diagnose(uniformAnswers(5))
    expect(r.total).toBe(TOTAL_QUESTIONS * 5)
    expect(r.total).toBe(100)
    expect(r.type.id).toBe('gachi-minimalist')
  })

  it('境界 29/30: collector → hodohodo', () => {
    expect(judgeType(29, null).id).toBe('collector')
    expect(judgeType(30, null).id).toBe('hodohodo')
  })

  it('境界 54/55: hodohodo → 中位帯(突出なしで隠れ管理嫌い)', () => {
    expect(judgeType(54, null).id).toBe('hodohodo')
    expect(judgeType(55, null).id).toBe('kakure-kanri-girai')
  })

  it('境界 79/80: 中位帯 → ガチミニマリスト', () => {
    expect(judgeType(79, null).id).toBe('kakure-kanri-girai')
    expect(judgeType(80, null).id).toBe('gachi-minimalist')
  })

  it('80点以上は突出があってもガチミニマリスト固定', () => {
    expect(judgeType(90, 'mono').id).toBe('gachi-minimalist')
  })
})

describe('judgeType — 中位帯の領域別タイプ', () => {
  const cases: Array<[Domain, string]> = [
    ['mono', 'tebura'],
    ['digital', 'tsuchi-zero'],
    ['people', 'yotei-hakushi'],
    ['money', 'koteihi-allergy'],
  ]
  it.each(cases)('55〜79 × 突出 %s → %s', (domain, typeId) => {
    expect(judgeType(60, domain).id).toBe(typeId)
  })
})

describe('findDominantDomain', () => {
  it('偏りが閾値以上なら突出領域を返す', () => {
    // mono=20, 他=5 → deviation = 20 - 5 = 15 >= 5
    const r = findDominantDomain({ mono: 20, digital: 5, people: 5, money: 5 })
    expect(r).toBe('mono')
  })

  it('偏りが閾値ちょうどなら突出とみなす', () => {
    // deviation = DOMINANT_THRESHOLD ちょうどになるよう構成
    // mono=x, 他3つ=y, x - y = 5
    const r = findDominantDomain({ mono: 13, digital: 8, people: 8, money: 8 })
    // deviation = 13 - 8 = 5
    expect(DOMINANT_THRESHOLD).toBe(5)
    expect(r).toBe('mono')
  })

  it('偏りが閾値未満なら null', () => {
    // mono=12, 他=8 → deviation = 4 < 5
    const r = findDominantDomain({ mono: 12, digital: 8, people: 8, money: 8 })
    expect(r).toBeNull()
  })

  it('完全に均等なら null', () => {
    const r = findDominantDomain({ mono: 10, digital: 10, people: 10, money: 10 })
    expect(r).toBeNull()
  })

  it('同点の突出は domainIds の定義順で先勝ち(決定的)', () => {
    // mono と digital が同点で最大
    const r = findDominantDomain({ mono: 20, digital: 20, people: 0, money: 0 })
    expect(r).toBe('mono')
  })
})

describe('diagnose — 統合', () => {
  it('特定領域に偏った中位スコアで領域別タイプになる', () => {
    // money に集中して高得点、他は低め。total は 55〜79 帯。
    const r = diagnose(
      answersOf({
        mono: [1, 1, 1, 1, 1], // 5
        digital: [1, 1, 1, 1, 1], // 5
        people: [1, 1, 1, 1, 1], // 5
        money: [5, 5, 5, 5, 5], // 25
      }),
    )
    expect(r.total).toBe(40) // ← hodohodo 帯
    expect(r.type.id).toBe('hodohodo')
    expect(r.dominantDomain).toBe('money')
  })

  it('中位帯かつ money 突出 → 固定費アレルギー型', () => {
    const r = diagnose(
      answersOf({
        mono: [3, 3, 3, 3, 1], // 13
        digital: [3, 3, 3, 1, 1], // 11
        people: [3, 3, 1, 1, 1], // 9
        money: [5, 5, 5, 5, 5], // 25
      }),
    )
    expect(r.total).toBe(58) // 55〜79 帯
    expect(r.dominantDomain).toBe('money')
    expect(r.type.id).toBe('koteihi-allergy')
  })
})
