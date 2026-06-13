import { Counter } from './Counter'

const CIRC = 584.3 // 2π * 93

/** 円形のミニマリスト度ゲージ。total(0〜100)を表示しカウントアップする */
export function ScoreGauge({
  total,
  countDelay,
}: {
  total: number
  countDelay: number
}) {
  const gaugeOffset = (CIRC * (1 - total / 100)).toFixed(1)

  return (
    <div
      style={{
        marginTop: 46,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        Minimalist Score
      </div>
      <div
        style={{
          position: 'relative',
          width: 212,
          height: 212,
          marginTop: 26,
        }}
      >
        <svg
          width="212"
          height="212"
          viewBox="0 0 212 212"
          style={{ display: 'block', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="106"
            cy="106"
            r="93"
            style={{ fill: 'none', stroke: 'var(--line)', strokeWidth: 6 }}
          />
          <circle
            cx="106"
            cy="106"
            r="93"
            style={{
              fill: 'none',
              stroke: 'var(--ink)',
              strokeWidth: 6,
              strokeLinecap: 'round',
              strokeDasharray: CIRC,
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
            gap: 6,
          }}
        >
          <div
            className="tnum"
            style={{
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-.03em',
              color: 'var(--ink)',
            }}
          >
            <Counter target={total} delay={countDelay} />
            <span style={{ fontSize: 22, color: 'var(--faint)' }}>%</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            ミニマリスト度
          </div>
        </div>
      </div>
    </div>
  )
}
