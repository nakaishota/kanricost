/** この診断サイト自身の公開URL(シェアに添付する) */
export const SITE_URL = 'https://nakaishota.github.io/kanricost/'
/** シェアカードなどに表示する短縮表記 */
export const SITE_URL_DISPLAY = 'nakaishota.github.io/kanricost'

/** 制作者のポートフォリオサイト */
export const PORTFOLIO_URL = 'https://nakaicode.com/'
export const PORTFOLIO_LABEL = 'なかい / Portfolio'

/**
 * 問題フィードバックの送信先(Google Apps Script の Web App /exec URL)。
 * GAS をデプロイしたら、ここに発行された URL を設定する。
 * 空のままだと送信は行わず、ペイロードを console に出力する(画面は動作する)。
 */
export const FEEDBACK_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbzfLA9vMO8L8zGpntM-5q1Ji17xuGAMQIUekYz6aj4UNTg3RdDrbWh54Kg-S2ZjW1yk2w/exec'

/**
 * エラーログの送信先(Google Apps Script の Web App /exec URL)。
 * 当面はフィードバックと同じ GAS に相乗りさせる(payload の kind: 'error' で振り分け可能)。
 * 別の収集先に分けたくなったらここだけ差し替える。空なら送信せず console 出力のみ。
 */
export const ERROR_ENDPOINT = FEEDBACK_ENDPOINT
