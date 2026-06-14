import { useMemo, useState } from 'react'
import type { AnswerRecord, DiagnosisResult, Question } from '../types'
import { domainInfo } from '../data/domains'
import { Icon } from './Icon'
import {
  buildFeedbackPayload,
  sendFeedback,
  type Rating,
} from '../logic/feedback'

/**
 * そのセッションで出題した20問を縦リストで表示し、各問を 👍/👎 で評価して
 * GAS へ送信する。AIが生成した問題・回答の品質を見極めるためのフィードバック収集。
 */
export function FeedbackScreen({
  questions,
  answers,
  result,
  onClose,
  onDone,
}: {
  questions: Question[]
  answers: AnswerRecord[]
  result: DiagnosisResult
  /** 送らずに結果へ戻る */
  onClose: () => void
  /** 送信完了後にトップへ */
  onDone: () => void
}) {
  const [ratings, setRatings] = useState<Record<string, Rating | undefined>>({})
  const [phase, setPhase] = useState<'rating' | 'sending' | 'sent'>('rating')

  const answerByQ = useMemo(
    () => new Map(answers.map((a) => [a.questionId, a])),
    [answers],
  )

  const ratedCount = Object.values(ratings).filter(Boolean).length

  const toggle = (id: string, value: Rating) => {
    setRatings((prev) => ({
      ...prev,
      [id]: prev[id] === value ? undefined : value,
    }))
  }

  const submit = async () => {
    setPhase('sending')
    const payload = buildFeedbackPayload(questions, answers, result, ratings)
    await sendFeedback(payload)
    setPhase('sent')
  }

  if (phase === 'sent') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '48px 32px',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--ink)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}
        >
          ✓
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: '24px 0 0',
            color: 'var(--ink)',
          }}
        >
          ご協力ありがとうございました
        </h2>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.9,
            color: 'var(--sub)',
            margin: '14px 0 0',
            maxWidth: 320,
          }}
        >
          いただいた評価は、問題と回答の精度を見直して
          <br />
          品質を高めるために役立てます。
        </p>
        <button
          onClick={onDone}
          style={{
            marginTop: 34,
            height: 46,
            padding: '0 28px',
            background: 'var(--ink)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          トップへ戻る
        </button>
      </div>
    )
  }

  const sending = phase === 'sending'

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 24px 40px',
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        Feedback / 品質向上にご協力ください
      </div>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '-.01em',
          lineHeight: 1.6,
          margin: '14px 0 0',
          color: 'var(--ink)',
        }}
      >
        この問題、どうでしたか?
      </h1>
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.85,
          color: 'var(--sub)',
          margin: '10px 0 0',
        }}
      >
        出題された20問の「問題と選択肢の出来」を👍/👎で教えてください。AIが作問しているため、精度を見直す手がかりにします。気になった問題だけでも大丈夫です。
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          margin: '24px 0 0',
        }}
      >
        {questions.map((q, i) => {
          const dom = domainInfo(q.domain)
          const a = answerByQ.get(q.id)
          const choice = a
            ? q.choices.find((c) => c.score === a.score)
            : undefined
          const rating = ratings[q.id]
          return (
            <div
              key={q.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: '1px solid var(--line)',
                borderRadius: 12,
                background: 'var(--white)',
                padding: '14px 14px 14px 16px',
                boxShadow: '0 1px 1px #00000008',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    marginBottom: 6,
                  }}
                >
                  <span
                    className="tnum"
                    style={{
                      fontSize: 10,
                      color: 'var(--faint)',
                      letterSpacing: '.04em',
                    }}
                  >
                    Q{String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ display: 'flex', color: 'var(--muted)' }}>
                    <Icon inner={dom.icon} size={13} />
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: 'var(--faint)',
                    }}
                  >
                    {dom.code}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: 'var(--ink)',
                    textWrap: 'pretty',
                  }}
                >
                  {q.scenario}
                </p>
                {choice && (
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontSize: 12,
                      lineHeight: 1.55,
                      color: 'var(--muted)',
                    }}
                  >
                    あなたの回答: {choice.text}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, flex: 'none' }}>
                <RateButton
                  emoji="👍"
                  active={rating === 'good'}
                  activeColor="#1f9d55"
                  onClick={() => toggle(q.id, 'good')}
                />
                <RateButton
                  emoji="👎"
                  active={rating === 'bad'}
                  activeColor="#d14343"
                  onClick={() => toggle(q.id, 'bad')}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          marginTop: 22,
          paddingTop: 16,
          paddingBottom: 4,
          background:
            'linear-gradient(to top, var(--bg) 70%, transparent)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <button
          onClick={submit}
          disabled={ratedCount === 0 || sending}
          style={{
            height: 48,
            background: ratedCount === 0 ? '#c7c7c7' : 'var(--ink)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 500,
            cursor: ratedCount === 0 ? 'default' : 'pointer',
            transition: 'background .2s ease',
          }}
        >
          {sending
            ? '送信中…'
            : ratedCount === 0
              ? '評価を1つ以上つけてください'
              : `フィードバックを送信(${ratedCount}件)`}
        </button>
        <button
          onClick={onClose}
          disabled={sending}
          style={{
            height: 42,
            background: 'transparent',
            color: 'var(--muted)',
            border: 'none',
            fontSize: 13,
          }}
        >
          スキップして結果に戻る
        </button>
      </div>
    </div>
  )
}

function RateButton({
  emoji,
  active,
  activeColor,
  onClick,
}: {
  emoji: string
  active: boolean
  activeColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        lineHeight: 1,
        borderRadius: 11,
        border: `1.5px solid ${active ? activeColor : 'var(--line)'}`,
        background: active ? `${activeColor}14` : 'var(--white)',
        filter: active ? 'none' : 'grayscale(0.4) opacity(0.75)',
        transition: 'border-color .15s ease, background .15s ease, filter .15s ease',
      }}
    >
      {emoji}
    </button>
  )
}
