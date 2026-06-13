import type { DiagnosisResult } from '../types'

/** SNSシェア・コピー用のテキストを組み立てる */
export function buildShareText(result: DiagnosisResult): string {
  const { type, total } = result
  return (
    `【管理コスト診断】わたしは ${type.emoji} ${type.name} でした。\n` +
    `ミニマリスト度 ${total}%\n` +
    `——「${type.catchphrase}」\n` +
    `#管理コスト診断`
  )
}

/** X(Twitter)のインテントURL */
export function buildXIntentUrl(result: DiagnosisResult): string {
  return (
    'https://twitter.com/intent/tweet?text=' +
    encodeURIComponent(buildShareText(result))
  )
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
