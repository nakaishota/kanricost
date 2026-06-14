import type { AnswerRecord, DiagnosisResult, Domain, Question } from '../types'
import { FEEDBACK_ENDPOINT } from '../constants'

export type Rating = 'good' | 'bad'

/** 1問ぶんの評価データ(スプレッドシートの1行に対応) */
export interface FeedbackItem {
  questionId: string
  domain: Domain
  scenario: string
  /** 被験者が選んだ選択肢のテキスト */
  choiceText: string
  /** その選択肢のスコア */
  choiceScore: number
  rating: Rating
}

export interface FeedbackPayload {
  sessionId: string
  ratedAt: string
  resultType: string
  total: number
  items: FeedbackItem[]
}

/** 出題内容・回答・評価から送信ペイロードを組み立てる */
export function buildFeedbackPayload(
  questions: Question[],
  answers: AnswerRecord[],
  result: DiagnosisResult,
  ratings: Record<string, Rating | undefined>,
): FeedbackPayload {
  const answerByQ = new Map(answers.map((a) => [a.questionId, a]))
  const items: FeedbackItem[] = []
  for (const q of questions) {
    const rating = ratings[q.id]
    if (!rating) continue // 評価したものだけ送る
    const a = answerByQ.get(q.id)
    const choice = a ? q.choices.find((c) => c.score === a.score) : undefined
    items.push({
      questionId: q.id,
      domain: q.domain,
      scenario: q.scenario,
      choiceText: choice?.text ?? '',
      choiceScore: a?.score ?? -1,
      rating,
    })
  }
  return {
    sessionId:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`,
    ratedAt: new Date().toISOString(),
    resultType: result.type.id,
    total: result.total,
    items,
  }
}

/**
 * GAS の Web App へ送信する。
 * CORS プリフライトを避けるため text/plain + no-cors で送る(レスポンスは読まない)。
 * エンドポイント未設定時は console 出力のみで false を返す。
 */
export async function sendFeedback(payload: FeedbackPayload): Promise<boolean> {
  if (!FEEDBACK_ENDPOINT) {
    console.info('[feedback] エンドポイント未設定。送信ペイロード:', payload)
    return false
  }
  try {
    await fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    return true
  } catch (e) {
    console.warn('[feedback] 送信に失敗しました', e)
    return false
  }
}
