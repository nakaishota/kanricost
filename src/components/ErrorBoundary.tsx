import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../logic/errorLog'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * 描画中の例外を捕捉し、アプリ全体が白画面で固まるのを防ぐ。
 * 捕捉した例外は errorLog へ送り、ユーザーには再読み込みを促す復帰画面を出す。
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError(error.message || 'render error', {
      stack: `${error.stack ?? ''}\n--- componentStack ---\n${
        info.componentStack ?? ''
      }`,
      source: 'ErrorBoundary',
    })
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '40px 24px',
          textAlign: 'center',
          color: 'var(--ink)',
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
          問題が発生しました
        </p>
        <p style={{ fontSize: 13, color: 'var(--sub)', margin: 0 }}>
          お手数ですが、もう一度読み込んでください。
        </p>
        <button
          onClick={() => location.reload()}
          style={{
            marginTop: 8,
            padding: '12px 22px',
            border: '1px solid var(--ink)',
            borderRadius: 10,
            background: 'var(--ink)',
            color: 'var(--white)',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          もう一度読み込む
        </button>
      </div>
    )
  }
}
