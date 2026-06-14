import { useMemo, useState } from 'react'
import type { AnswerRecord, DiagnosisResult, Question } from '../types'
import { domainInfo } from '../data/domains'
import { Icon } from './Icon'
import {
  buildFeedbackPayload,
  sendFeedback,
  type Rating,
} from '../logic/feedback'

const THUMB_UP =
  '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>'
const THUMB_DOWN =
  '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>'

const GOOD_COLOR = '#1f9d55'
const BAD_COLOR = '#d14343'
const ABCD = ['A', 'B', 'C', 'D']

/**
 * そのセッションで出題した20問を縦リストで表示し、各問を 👍/👎 で評価して
 * GAS へ送信する。問題・回答の品質を見極めるためのフィードバック収集。
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
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

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
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
          いただいた評価は、問題と回答の品質を
          <br />
          高めるために役立てます。
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
        出題された20問について、問題と選択肢の良し悪しを教えてください。気になった問題だけでも大丈夫です。
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
          const isOpen = !!expanded[q.id]
          return (
            <div
              key={q.id}
              style={{
                border: '1px solid var(--line)',
                borderRadius: 12,
                background: 'var(--white)',
                padding: '14px 16px 16px',
                boxShadow: '0 1px 1px #00000008',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 7,
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
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: 'var(--ink)',
                  textWrap: 'pretty',
                }}
              >
                {q.scenario}
              </p>
              {!isOpen && choice && (
                <p
                  style={{
                    margin: '5px 0 0',
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: 'var(--muted)',
                  }}
                >
                  → {choice.text}
                </p>
              )}
              {isOpen && (
                <div
                  style={{
                    marginTop: 9,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {q.choices.map((c, ci) => {
                    const picked = !!a && c.score === a.score
                    return (
                      <div
                        key={ci}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 9,
                          padding: '8px 10px',
                          borderRadius: 8,
                          border: `1px solid ${picked ? 'var(--ink)' : 'var(--line)'}`,
                          background: picked ? '#f5f5f5' : 'var(--white)',
                        }}
                      >
                        <span
                          style={{
                            flex: 'none',
                            width: 18,
                            height: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${picked ? 'var(--ink)' : 'var(--line)'}`,
                            borderRadius: 5,
                            fontSize: 10,
                            color: picked ? 'var(--ink)' : 'var(--faint)',
                          }}
                        >
                          {ABCD[ci]}
                        </span>
                        <span
                          style={{
                            flex: 1,
                            fontSize: 12.5,
                            lineHeight: 1.5,
                            color: 'var(--ink)',
                          }}
                        >
                          {c.text}
                        </span>
                        {picked && (
                          <span
                            style={{
                              flex: 'none',
                              fontSize: 10.5,
                              color: 'var(--muted)',
                              alignSelf: 'center',
                            }}
                          >
                            あなたの回答
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <RateButton
                  inner={THUMB_UP}
                  active={rating === 'good'}
                  activeColor={GOOD_COLOR}
                  onClick={() => toggle(q.id, 'good')}
                />
                <RateButton
                  inner={THUMB_DOWN}
                  active={rating === 'bad'}
                  activeColor={BAD_COLOR}
                  onClick={() => toggle(q.id, 'bad')}
                />
                <button
                  onClick={() => toggleExpand(q.id)}
                  style={{
                    marginLeft: 'auto',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--muted)',
                    fontSize: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {isOpen ? '選択肢を閉じる' : '選択肢を見る'}
                  <span style={{ fontSize: 9 }}>{isOpen ? '▲' : '▼'}</span>
                </button>
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
          background: 'linear-gradient(to top, var(--bg) 70%, transparent)',
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
  inner,
  active,
  activeColor,
  onClick,
}: {
  inner: string
  active: boolean
  activeColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: 62,
        height: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        border: `1.5px solid ${active ? activeColor : 'var(--line)'}`,
        background: active ? `${activeColor}14` : 'var(--white)',
        color: active ? activeColor : 'var(--faint)',
        transition: 'border-color .15s ease, background .15s ease, color .15s ease',
      }}
    >
      <Icon inner={inner} size={18} strokeWidth={1.7} />
    </button>
  )
}
