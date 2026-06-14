import { useState } from 'react'
import type { DiagnosisResult } from '../types'
import { ShareCard } from './ShareCard'
import { DomainBalance } from './DomainBalance'
import { PortfolioLink } from './PortfolioLink'
import { buildShareText, buildXIntentUrl, copyText } from '../logic/share'

const COUNT_DELAY = 2550 // カーテンが明けてからカウント開始

/** 結果発表のカーテン演出(2秒見せてフェードアウト) */
function AnalyzingCurtain() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        overflow: 'hidden',
        animation: 'kc-curtain .8s ease 2s forwards',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          background:
            'radial-gradient(42% 52% at 20% 24%, rgba(59,130,246,.55), transparent 70%), radial-gradient(45% 55% at 82% 18%, rgba(45,212,191,.42), transparent 70%), radial-gradient(48% 52% at 78% 80%, rgba(139,92,246,.5), transparent 70%), radial-gradient(42% 50% at 18% 82%, rgba(245,158,11,.32), transparent 70%)',
          filter: 'blur(44px)',
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          fontSize: 11,
          letterSpacing: '.32em',
          textTransform: 'uppercase',
          color: '#8a8a8a',
        }}
      >
        Analyzing
      </div>
      <div
        style={{
          position: 'relative',
          fontSize: 15,
          letterSpacing: '.07em',
          color: '#ededed',
        }}
      >
        あなたの管理コスト体質は
      </div>
      <div style={{ position: 'relative', display: 'flex', gap: 10 }}>
        {[0, 0.22, 0.44].map((d) => (
          <span
            key={d}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--white)',
              animation: `kc-breathe 1.3s ease ${d}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function ResultScreen({
  result,
  skipIntro = false,
  onRestart,
  onFeedback,
}: {
  result: DiagnosisResult
  /** 結果発表のカーテン演出をスキップ(フィードバックから戻ったとき) */
  skipIntro?: boolean
  onRestart: () => void
  onFeedback: () => void
}) {
  const [copied, setCopied] = useState(false)
  const { type } = result
  const countDelay = skipIntro ? 200 : COUNT_DELAY

  const shareX = () => {
    window.open(buildXIntentUrl(result), '_blank')
  }
  const handleCopy = async () => {
    await copyText(buildShareText(result))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div data-screen="result">
      {!skipIntro && <AnalyzingCurtain />}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px 56px',
          animation: skipIntro ? undefined : 'kc-reveal 1s ease 2.15s both',
        }}
      >
        {/* スクショ用サマリーカード */}
        <ShareCard result={result} countDelay={countDelay} />

        <DomainBalance result={result} />

        {/* Analysis / 傾向 */}
        <div style={{ marginTop: 50 }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 18,
            }}
          >
            Analysis / 傾向
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 2.05,
              color: 'var(--sub)',
              textWrap: 'pretty',
            }}
          >
            {type.description}
          </p>
          <p
            style={{
              margin: '16px 0 0',
              fontSize: 13.5,
              lineHeight: 1.95,
              color: 'var(--ink)',
            }}
          >
            総合的に見ると——{result.scoreBandComment}
          </p>

          <div
            style={{
              marginTop: 20,
              border: '1px solid var(--line)',
              borderRadius: 12,
              background: 'var(--white)',
              padding: '18px 20px',
              boxShadow: '0 1px 1px #00000008, 0 2px 4px #0000000a',
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              One Point
            </div>
            <p
              style={{
                margin: '11px 0 0',
                fontSize: 13.5,
                lineHeight: 1.95,
                color: 'var(--ink)',
              }}
            >
              {type.advice}
            </p>
          </div>
        </div>

        {/* アクション */}
        <div style={{ display: 'flex', gap: 10, marginTop: 44 }}>
          <button
            onClick={shareX}
            style={{
              flex: 1,
              height: 46,
              background: 'var(--ink)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '.01em',
              boxShadow: '0 1px 1px #00000012',
              transition: 'background .2s ease, transform .1s ease',
            }}
          >
            X でシェア
          </button>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              height: 46,
              background: 'var(--white)',
              color: 'var(--ink)',
              border: '1px solid var(--line)',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '.01em',
              boxShadow: '0 1px 1px #00000008',
              transition: 'border-color .2s ease, transform .1s ease',
            }}
          >
            {copied ? 'コピーしました ✓' : '結果をコピー'}
          </button>
        </div>
        <button
          onClick={onRestart}
          style={{
            width: '100%',
            marginTop: 10,
            height: 46,
            background: 'transparent',
            color: 'var(--sub)',
            border: '1px solid var(--line)',
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 500,
            transition: 'border-color .2s ease, color .2s ease',
          }}
        >
          もう一度診断する
        </button>
        <div
          style={{
            marginTop: 16,
            textAlign: 'center',
            fontSize: 10.5,
            letterSpacing: '.04em',
            color: 'var(--faint)',
          }}
        >
          ※ 問題は毎回ランダムに入れ替わります
        </div>

        {/* 問題フィードバックの導線 */}
        <div
          style={{
            marginTop: 28,
            border: '1px solid var(--line)',
            borderRadius: 14,
            background: 'var(--white)',
            padding: '20px 20px 22px',
            textAlign: 'center',
            boxShadow: '0 1px 1px #00000008',
          }}
        >
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            問題の品質向上にご協力ください
          </div>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.75,
              color: 'var(--sub)',
              margin: '8px 0 0',
            }}
          >
            この診断はAIが作問しています。出題された20問の出来を👍/👎で教えてください。
          </p>
          <button
            onClick={onFeedback}
            style={{
              marginTop: 16,
              height: 44,
              padding: '0 24px',
              background: 'var(--ink)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: 100,
              fontSize: 13.5,
              fontWeight: 500,
            }}
          >
            問題フィードバックにご協力ください
          </button>
        </div>
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <PortfolioLink />
        </div>
      </div>
    </div>
  )
}
