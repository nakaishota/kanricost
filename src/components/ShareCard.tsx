import type { DiagnosisResult } from '../types'
import { domains, MAX_DOMAIN_SCORE } from '../data/domains'
import { Icon } from './Icon'
import { Counter } from './Counter'

/** 公開URL(スクショに焼き込むブランド表記) */
const SITE_URL = 'nakaishota.github.io/kanricost'

const GAUGE_SIZE = 132
const GAUGE_SW = 5
const GAUGE_R = GAUGE_SIZE / 2 - GAUGE_SW - 1
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R

/**
 * スクショ1枚で結果が完結する共有用カード。
 * タイプ・ミニマリスト度・領域内訳・ブランド/URL を黒背景の1枚絵に凝縮する。
 */
export function ShareCard({
  result,
  countDelay,
}: {
  result: DiagnosisResult
  countDelay: number
}) {
  const { type, total } = result
  const gaugeOffset = (GAUGE_CIRC * (1 - total / 100)).toFixed(1)

  return (
    <div
      data-sharecard
      style={{
        position: 'relative',
        borderRadius: 20,
        background: 'var(--ink)',
        color: 'var(--white)',
        padding: '30px 26px 24px',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-35%',
          right: '-25%',
          width: '90%',
          height: '110%',
          background:
            'radial-gradient(50% 50% at 70% 30%, rgba(99,102,241,.5), transparent 72%), radial-gradient(46% 48% at 30% 70%, rgba(45,212,191,.36), transparent 72%), radial-gradient(40% 44% at 80% 80%, rgba(245,158,11,.28), transparent 72%)',
          filter: 'blur(34px)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative' }}>
        {/* ブランド */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 10,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#9a9a9a',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#ffffff',
            }}
          />
          管理コスト診断
        </div>

        {/* タイプ + ゲージ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginTop: 22,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', color: '#ffffff' }}>
              <Icon inner={type.icon} size={36} strokeWidth={1.3} />
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-.01em',
                lineHeight: 1.45,
                margin: '14px 0 0',
                color: '#ffffff',
                lineBreak: 'strict',
                textWrap: 'balance',
              }}
            >
              {type.name}
            </h2>
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: '#bdbdbd',
                margin: '8px 0 0',
              }}
            >
              「{type.catchphrase}」
            </p>
          </div>

          <div
            style={{
              position: 'relative',
              width: GAUGE_SIZE,
              height: GAUGE_SIZE,
              flex: 'none',
            }}
          >
            <svg
              width={GAUGE_SIZE}
              height={GAUGE_SIZE}
              viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
              style={{ display: 'block', transform: 'rotate(-90deg)' }}
            >
              <circle
                cx={GAUGE_SIZE / 2}
                cy={GAUGE_SIZE / 2}
                r={GAUGE_R}
                style={{
                  fill: 'none',
                  stroke: 'rgba(255,255,255,.16)',
                  strokeWidth: GAUGE_SW,
                }}
              />
              <circle
                cx={GAUGE_SIZE / 2}
                cy={GAUGE_SIZE / 2}
                r={GAUGE_R}
                style={{
                  fill: 'none',
                  stroke: '#ffffff',
                  strokeWidth: GAUGE_SW,
                  strokeLinecap: 'round',
                  strokeDasharray: GAUGE_CIRC,
                  strokeDashoffset: gaugeOffset,
                  animation: `kc-gauge 1.8s cubic-bezier(.3,.4,.2,1) ${countDelay / 1000}s backwards`,
                }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <div
                className="tnum"
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: '-.03em',
                  color: '#ffffff',
                }}
              >
                <Counter target={total} delay={countDelay} />
                <span style={{ fontSize: 15, color: '#9a9a9a' }}>%</span>
              </div>
              <div style={{ fontSize: 9.5, color: '#9a9a9a' }}>
                ミニマリスト度
              </div>
            </div>
          </div>
        </div>

        {/* 領域ミニ内訳 */}
        <div
          style={{
            marginTop: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 11,
          }}
        >
          {domains.map((d) => {
            const score = result.domainScores[d.id]
            const isMax = result.maxDomain === d.id
            const w = `${((score / MAX_DOMAIN_SCORE) * 100).toFixed(0)}%`
            return (
              <div
                key={d.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span
                  style={{
                    width: 64,
                    flex: 'none',
                    fontSize: 9,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    color: isMax ? '#ffffff' : '#8a8a8a',
                  }}
                >
                  {d.code}
                </span>
                <span
                  style={{
                    flex: 1,
                    height: 5,
                    background: 'rgba(255,255,255,.14)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      height: '100%',
                      width: w,
                      borderRadius: 3,
                      background: isMax ? '#ffffff' : 'rgba(255,255,255,.45)',
                    }}
                  />
                </span>
                <span
                  className="tnum"
                  style={{
                    width: 22,
                    flex: 'none',
                    textAlign: 'right',
                    fontSize: 12,
                    fontWeight: 600,
                    color: isMax ? '#ffffff' : '#bdbdbd',
                  }}
                >
                  {score}
                </span>
              </div>
            )
          })}
        </div>

        {/* フッター(ブランド/URL) */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11,
            color: '#8a8a8a',
          }}
        >
          <span style={{ color: '#cfcfcf' }}>#管理コスト診断</span>
          <span style={{ letterSpacing: '.01em' }}>{SITE_URL}</span>
        </div>
      </div>
    </div>
  )
}
