import { TOTAL_QUESTIONS } from '../data/domains'
import { PortfolioLink } from './PortfolioLink'

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      data-screen="start"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '84px 28px',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-12%',
          left: '-12%',
          right: '-12%',
          height: '62%',
          background:
            'radial-gradient(42% 52% at 18% 20%, var(--grad-blue), transparent 72%), radial-gradient(45% 55% at 84% 16%, var(--grad-teal), transparent 72%), radial-gradient(48% 52% at 78% 82%, var(--grad-indigo), transparent 72%), radial-gradient(42% 50% at 16% 84%, var(--grad-amber), transparent 72%)',
          filter: 'blur(30px)',
          opacity: 0.85,
          WebkitMaskImage: 'linear-gradient(#000 55%, transparent)',
          maskImage: 'linear-gradient(#000 55%, transparent)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--sub)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--ink)',
            }}
          />
          Minimalist Diagnosis
        </div>
        <h1
          style={{
            fontSize: 31,
            fontWeight: 600,
            letterSpacing: '-.022em',
            lineHeight: 1.5,
            margin: '24px 0 0',
            color: 'var(--ink)',
            textWrap: 'balance',
          }}
        >
          管理コストへの感度から、
          <br />
          あなたのミニマリスト度を測る。
        </h1>
        <p
          style={{
            margin: '22px 0 0',
            fontSize: 16,
            lineHeight: 1.9,
            color: 'var(--sub)',
          }}
        >
          モノ・通知・予定・契約。暮らしにひそむ「維持する手間」への態度を、日常のシナリオから静かに診断します。
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            margin: '28px 0 0',
            fontSize: 12,
            letterSpacing: '.06em',
            color: 'var(--muted)',
          }}
        >
          <span>全 {TOTAL_QUESTIONS} 問</span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'var(--faint)',
            }}
          />
          <span>約 3 分</span>
        </div>
        <div style={{ marginTop: 38 }}>
          <button
            onClick={onStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '0 28px',
              height: 48,
              background: 'var(--ink)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '.01em',
              boxShadow: '0 1px 1px #00000012, 0 4px 10px -4px #0000001f',
              transition: 'transform .18s ease, background .2s ease',
            }}
          >
            診断をはじめる
            <span style={{ fontSize: 14 }}>→</span>
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 26,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <PortfolioLink />
      </div>
    </div>
  )
}
