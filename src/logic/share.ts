import type { DiagnosisResult } from '../types'
import { SITE_URL } from '../constants'

/** 結果の本文(タイプ・スコア・キャッチ・ハッシュタグ)。URLは含めない */
function shareBody(result: DiagnosisResult): string {
  const { type, total } = result
  return (
    `【管理コスト診断】わたしは ${type.emoji} ${type.name} でした。\n` +
    `ミニマリスト度 ${total}%\n` +
    `——「${type.catchphrase}」\n` +
    `#管理コスト診断`
  )
}

/** コピー用テキスト。末尾に診断サイトのURLを添付する */
export function buildShareText(result: DiagnosisResult): string {
  return `${shareBody(result)}\n\n▼あなたもやってみる\n${SITE_URL}`
}

/** X(Twitter)のインテントURL。本文は text、サイトURLは url パラメータに分けて添付 */
export function buildXIntentUrl(result: DiagnosisResult): string {
  const params = new URLSearchParams({
    text: shareBody(result),
    url: SITE_URL,
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}

/** クリップボードへコピー(失敗時は textarea フォールバック) */
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // フォールバックへ
    }
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
  } catch {
    // 何もできない環境では握りつぶす
  }
  document.body.removeChild(ta)
}
