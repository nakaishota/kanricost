import { describe, expect, it } from 'vitest'
import {
  aggregateDomainScores,
  diagnose,
  findMaxDomain,
  judgeType,
  scoreSpread,
  SPREAD_THRESHOLD,
} from '../scoring'
import { domainLevel, scoreBandComment } from '../../data/insights'
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
      { questionId: 'mono-2', domain: 'mono', score: 4 },
      { questionId: 'money-1', domain: 'money', score: 2 },
    ])
    expect(scores.mono).toBe(9)
    expect(scores.money).toBe(2)
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

  it('境界 39/40: collector → 中スコア帯', () => {
    expect(judgeType(39, 'mono', 0).id).toBe('collector')
    expect(judgeType(40, 'mono', 0).id).toBe('hodohodo')
  })

  it('境界 64/65: 中スコア帯 → 領域別タイプ', () => {
    expect(judgeType(64, 'mono', 0).id).toBe('hodohodo')
    expect(judgeType(65, 'mono', 0).id).toBe('tebura')
  })

  it('境界 84/85: 領域別 → ガチミニマリスト', () => {
    expect(judgeType(84, 'mono', 0).id).toBe('tebura')
    expect(judgeType(85, 'mono', 0).id).toBe('gachi-minimalist')
  })

  it('85点以上は偏りがあってもガチミニマリスト固定', () => {
    expect(judgeType(90, 'mono', 20).id).toBe('gachi-minimalist')
  })
})

describe('judgeType — 中スコア帯の偏りによる分岐', () => {
  it('40〜64 × 偏り大(spread>=9)→ 隠れ管理嫌い型', () => {
    expect(judgeType(50, 'mono', SPREAD_THRESHOLD).id).toBe('kakure-kanri-girai')
  })

  it('40〜64 × 偏り小(spread<9)→ ほどほど管理型', () => {
    expect(judgeType(50, 'mono', SPREAD_THRESHOLD - 1).id).toBe('hodohodo')
  })
})

describe('judgeType — 65〜84帯の領域別タイプ', () => {
  const cases: Array<[Domain, string]> = [
    ['mono', 'tebura'],
    ['digital', 'tsuchi-zero'],
    ['people', 'yotei-hakushi'],
    ['money', 'koteihi-allergy'],
  ]
  it.each(cases)('最大領域 %s → %s', (domain, typeId) => {
    expect(judgeType(70, domain, 10).id).toBe(typeId)
  })
})

describe('findMaxDomain / scoreSpread', () => {
  it('最大スコアの領域を返す', () => {
    expect(findMaxDomain({ mono: 20, digital: 5, people: 5, money: 5 })).toBe('mono')
  })

  it('同点は domainIds の定義順で先勝ち(決定的)', () => {
    expect(findMaxDomain({ mono: 20, digital: 20, people: 0, money: 0 })).toBe('mono')
  })

  it('偏り(最大-最小)を返す', () => {
    expect(scoreSpread({ mono: 20, digital: 5, people: 8, money: 12 })).toBe(15)
    expect(scoreSpread({ mono: 10, digital: 10, people: 10, money: 10 })).toBe(0)
  })
})

describe('domainLevel — 領域スコアの5段階化(境界値)', () => {
  it.each([
    [0, 0],
    [5, 0],
    [6, 1],
    [11, 1],
    [12, 2],
    [16, 2],
    [17, 3],
    [21, 3],
    [22, 4],
    [25, 4],
  ])('score %i → level %i', (score, level) => {
    expect(domainLevel(score)).toBe(level)
  })
})

describe('scoreBandComment — 全スコアで必ず一言を返す', () => {
  it('0〜100 すべてで空でないコメントを返す', () => {
    for (let s = 0; s <= 100; s++) {
      expect(scoreBandComment(s).length).toBeGreaterThan(0)
    }
  })
})

describe('diagnose — 細かい傾向コメント(方向A/C)', () => {
  it('4領域すべての傾向コメントを domainIds 順で返す', () => {
    const r = diagnose(uniformAnswers(4))
    expect(r.domainComments).toHaveLength(4)
    expect(r.domainComments.map((c) => c.domain)).toEqual(domainIds)
    for (const c of r.domainComments) {
      expect(c.comment.length).toBeGreaterThan(0)
    }
  })

  it('全0点は各領域レベル0、全5点は各領域レベル4', () => {
    const low = diagnose(uniformAnswers(0))
    for (const c of low.domainComments) expect(c.level).toBe(0)
    const high = diagnose(uniformAnswers(5))
    for (const c of high.domainComments) expect(c.level).toBe(4)
  })

  it('領域ごとに内訳が違えばコメントも違う(個別フィードバック)', () => {
    const r = diagnose(
      answersOf({
        mono: [5, 5, 5, 5, 5], // 25 → level4
        digital: [0, 0, 0, 0, 0], // 0 → level0
        people: [4, 2, 2, 2, 0], // 10 → level1
        money: [4, 4, 4, 2, 0], // 14 → level2
      }),
    )
    const byDomain = Object.fromEntries(
      r.domainComments.map((c) => [c.domain, c.level]),
    )
    expect(byDomain.mono).toBe(4)
    expect(byDomain.digital).toBe(0)
    expect(byDomain.people).toBe(1)
    expect(byDomain.money).toBe(2)
  })

  it('スコア帯ごとの一言が返る(全0点と全5点で異なる)', () => {
    const low = diagnose(uniformAnswers(0)).scoreBandComment
    const high = diagnose(uniformAnswers(5)).scoreBandComment
    expect(low.length).toBeGreaterThan(0)
    expect(high.length).toBeGreaterThan(0)
    expect(low).not.toBe(high)
  })
})

describe('diagnose — 統合', () => {
  it('money に偏った高スコアで固定費アレルギー型・maxDomain=money', () => {
    const r = diagnose(
      answersOf({
        mono: [4, 4, 2, 2, 2], // 14
        digital: [4, 4, 2, 2, 2], // 14
        people: [4, 2, 2, 2, 2], // 12
        money: [5, 5, 5, 5, 5], // 25
      }),
    )
    expect(r.total).toBe(65) // 65〜84 帯
    expect(r.maxDomain).toBe('money')
    expect(r.type.id).toBe('koteihi-allergy')
  })

  it('中スコア帯で偏りが大きいと隠れ管理嫌い型', () => {
    const r = diagnose(
      answersOf({
        mono: [5, 5, 5, 4, 2], // 21
        digital: [2, 2, 0, 0, 0], // 4
        people: [4, 4, 2, 2, 0], // 12
        money: [4, 2, 2, 2, 0], // 10
      }),
    )
    expect(r.total).toBe(47) // 40〜64 帯
    expect(r.spread).toBeGreaterThanOrEqual(SPREAD_THRESHOLD)
    expect(r.type.id).toBe('kakure-kanri-girai')
  })
})
