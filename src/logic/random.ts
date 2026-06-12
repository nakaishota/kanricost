export type Rng = () => number

/**
 * Fisher–Yates シャッフル。元配列は破壊せず新しい配列を返す。
 * rng を注入できるのでテストで決定的に検証できる。
 */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * シード付きの決定的 RNG(Mulberry32)。主にテスト用。
 */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
