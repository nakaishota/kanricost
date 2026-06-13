import { PORTFOLIO_URL, PORTFOLIO_LABEL } from '../constants'

/** 制作者ポートフォリオへの控えめなテキストリンク(トップ・結果の両画面で使用) */
export function PortfolioLink() {
  return (
    <a
      href={PORTFOLIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11.5,
        letterSpacing: '.04em',
        color: 'var(--faint)',
        textDecoration: 'none',
      }}
    >
      <span>制作 — {PORTFOLIO_LABEL}</span>
      <span style={{ fontSize: 10 }} aria-hidden>
        ↗
      </span>
    </a>
  )
}
