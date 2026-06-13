import type { DiagnosisResult } from '../types'
import { domains, MAX_DOMAIN_SCORE } from '../data/domains'
import { Icon } from './Icon'

/**
 * 領域別の内訳バー。最大領域を黒でハイライトし、各バーの下に
 * その領域の傾向コメント(細分化コメント・方向A)を添える。
 */
export function DomainBalance({ result }: { result: DiagnosisResult }) {
  const commentByDomain = Object.fromEntries(
    result.domainComments.map((c) => [c.domain, c.comment]),
  )

  return (
    <div style={{ marginTop: 50 }}>
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 22,
        }}
      >
        Balance / 領域別
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {domains.map((d, i) => {
          const score = result.domainScores[d.id]
          const isMax = result.maxDomain === d.id
          const w = `${((score / MAX_DOMAIN_SCORE) * 100).toFixed(0)}%`
          const barColor = isMax ? 'var(--ink)' : 'var(--bar-off)'
          return (
            <div key={d.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 9,
                }}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <span style={{ display: 'flex', color: barColor }}>
                    <Icon inner={d.icon} size={16} />
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: 'var(--faint)',
                    }}
                  >
                    {d.code}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: isMax ? 'var(--ink)' : 'var(--sub)',
                    }}
                  >
                    {d.name}
                  </span>
                </span>
                <span
                  className="tnum"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}
                >
                  {score}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: 'var(--faint)',
                    }}
                  >
                    {' '}
                    / {MAX_DOMAIN_SCORE}
                  </span>
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'var(--bar-track)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: barColor,
                    borderRadius: 3,
                    width: w,
                    animation: `kc-bar 1.1s cubic-bezier(.25,.6,.2,1) ${(2.7 + 0.15 * i).toFixed(2)}s backwards`,
                  }}
                />
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 12.5,
                  lineHeight: 1.8,
                  color: 'var(--sub)',
                  textWrap: 'pretty',
                }}
              >
                {commentByDomain[d.id]}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
