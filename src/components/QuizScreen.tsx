import { useEffect, useRef, useState } from 'react'
import type { AnswerRecord, Question } from '../types'
import { domainInfo, TOTAL_QUESTIONS } from '../data/domains'
import { Icon } from './Icon'

/**
 * 1問ずつ出題する質問画面。選択→フェードアウト→次問フェードイン、
 * 最終問の回答で onFinish(answers) を呼ぶ。アニメーションのタイミングは
 * デザイン版(170ms / 430ms / 40ms)を踏襲。
 */
export function QuizScreen({
  questions,
  onFinish,
}: {
  questions: Question[]
  onFinish: (answers: AnswerRecord[]) => void
}) {
  const [idx, setIdx] = useState(0)
  const [pressed, setPressed] = useState(-1)
  const [opacity, setOpacity] = useState(1)
  const [shift, setShift] = useState('0px')

  const answersRef = useRef<AnswerRecord[]>([])
  const busyRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const t of timers) clearTimeout(t)
    }
  }, [])

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }

  const choose = (i: number) => {
    if (busyRef.current) return
    busyRef.current = true

    const q = questions[idx]
    answersRef.current.push({
      questionId: q.id,
      domain: q.domain,
      score: q.choices[i].score,
    })
    setPressed(i)

    later(() => {
      setOpacity(0)
      setShift('-10px')
    }, 170)

    later(() => {
      if (idx >= questions.length - 1) {
        busyRef.current = false
        onFinish(answersRef.current)
      } else {
        setIdx(idx + 1)
        setPressed(-1)
        setOpacity(0)
        setShift('12px')
        later(() => {
          setOpacity(1)
          setShift('0px')
          busyRef.current = false
        }, 40)
      }
    }, 430)
  }

  const q = questions[idx]
  const dom = domainInfo(q.domain)
  const qNum = String(idx + 1).padStart(2, '0')
  const progressW = `${((idx / TOTAL_QUESTIONS) * 100).toFixed(1)}%`

  return (
    <div
      data-screen="quiz"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 24px 48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        <span>管理コスト診断</span>
        <span className="tnum" style={{ whiteSpace: 'nowrap', flex: 'none' }}>
          <span style={{ color: 'var(--ink)' }}>{qNum}</span> / {TOTAL_QUESTIONS}
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: 'var(--bar-track)',
          borderRadius: 2,
          marginTop: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'var(--ink)',
            width: progressW,
            transition: 'width .5s cubic-bezier(.4,.2,.2,1)',
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 42,
          opacity,
          transform: `translateY(${shift})`,
          transition: 'opacity .24s ease, transform .24s ease',
        }}
      >
        <div style={{ display: 'flex' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px 6px 10px',
              border: '1px solid var(--line)',
              borderRadius: 100,
              background: 'var(--white)',
              boxShadow: '0 1px 1px #00000008',
            }}
          >
            <span style={{ display: 'flex', color: 'var(--ink)' }}>
              <Icon inner={dom.icon} size={17} />
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: '.1em',
                color: 'var(--ink)',
                textTransform: 'uppercase',
              }}
            >
              {dom.code}
            </span>
            <span style={{ width: 1, height: 11, background: 'var(--line)' }} />
            <span style={{ fontSize: 12, color: 'var(--sub)' }}>{dom.name}</span>
          </span>
        </div>

        <p
          style={{
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: '-.012em',
            lineHeight: 1.75,
            color: 'var(--ink)',
            margin: '26px 0 0',
            minHeight: 120,
            textWrap: 'pretty',
          }}
        >
          {q.scenario}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 28,
          }}
        >
          {q.choices.map((c, i) => {
            const active = pressed === i
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  width: '100%',
                  textAlign: 'left',
                  padding: '15px 16px',
                  background: active ? '#f5f5f5' : 'var(--white)',
                  border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
                  borderRadius: 10,
                  color: 'var(--ink)',
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  boxShadow: active
                    ? '0 0 0 1px #171717'
                    : '0 1px 1px #00000008',
                  transition:
                    'border-color .2s ease, background .2s ease, box-shadow .2s ease, transform .1s ease',
                }}
              >
                <span
                  style={{
                    flex: 'none',
                    width: 27,
                    height: 27,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--line)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: 'var(--muted)',
                  }}
                >
                  {'ABCD'[i]}
                </span>
                <span style={{ flex: 1 }}>{c.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
