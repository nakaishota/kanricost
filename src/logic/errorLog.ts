import { ERROR_ENDPOINT } from '../constants'

/**
 * 軽量エラービーコン。
 * window.onerror / unhandledrejection / ErrorBoundary から拾った例外を、
 * 端末情報・直近の操作状況(どの画面・何問目か)と一緒に GAS へ送る。
 * 「一部端末でだけ詰まる」系の不具合は手元で再現できないため、
 * 発生時の userAgent と questionIndex が原因特定の決め手になる。
 */

/** エラー送信時に同梱する、直近の操作状況 */
interface Breadcrumb {
  screen?: string
  /** 0始まりの設問インデックス。表示上の「問N」は questionIndex + 1 */
  questionIndex?: number
  questionId?: string
}

let breadcrumb: Breadcrumb = {}
let sessionId = ''
/** 同一エラーの連投を間引くためのキー集合 */
const sent = new Set<string>()

/** 現在の操作状況を更新する。画面側から随時呼ぶ。 */
export function setBreadcrumb(patch: Breadcrumb): void {
  breadcrumb = { ...breadcrumb, ...patch }
}

function getSessionId(): string {
  if (sessionId) return sessionId
  sessionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
  return sessionId
}

export interface ErrorPayload {
  /** フィードバックと同じ GAS に相乗りさせるための種別フラグ */
  kind: 'error'
  sessionId: string
  occurredAt: string
  message: string
  stack?: string
  /** file:line:col など、発生源の手がかり */
  source?: string
  userAgent: string
  url: string
  /** 例: "390x844" */
  viewport: string
  screen?: string
  questionIndex?: number
  questionId?: string
}

/** 例外を1件送信する。収集処理自体がアプリを壊さないよう、失敗は握りつぶす。 */
export function reportError(
  message: string,
  detail?: { stack?: string; source?: string },
): void {
  // 同一メッセージ × 同一設問は1回だけ送る(無限ループ的な連投を防ぐ)
  const dedupeKey = `${message}@${breadcrumb.questionId ?? ''}`
  if (sent.has(dedupeKey)) return
  sent.add(dedupeKey)

  const payload: ErrorPayload = {
    kind: 'error',
    sessionId: getSessionId(),
    occurredAt: new Date().toISOString(),
    message: String(message).slice(0, 1000),
    stack: detail?.stack?.slice(0, 4000),
    source: detail?.source,
    userAgent: navigator.userAgent,
    url: location.href,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    ...breadcrumb,
  }

  if (!ERROR_ENDPOINT) {
    console.info('[errorLog] エンドポイント未設定。エラー内容:', payload)
    return
  }

  try {
    // CORS プリフライトを避けるため text/plain + no-cors(レスポンスは読まない)
    void fetch(ERROR_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
  } catch {
    // 送信失敗時も何もしない(収集のためにアプリを落とさない)
  }
}

/** グローバルなエラーハンドラを登録する。アプリ起動時に1回だけ呼ぶ。 */
export function initErrorLogging(): void {
  window.addEventListener('error', (e) => {
    reportError(e.message || 'window.onerror', {
      stack: e.error?.stack,
      source: e.filename
        ? `${e.filename}:${e.lineno}:${e.colno}`
        : undefined,
    })
  })
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason
    const message = reason instanceof Error ? reason.message : String(reason)
    reportError(`unhandledrejection: ${message}`, {
      stack: reason instanceof Error ? reason.stack : undefined,
    })
  })
}
