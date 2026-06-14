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
  'https://script.google.com/macros/s/AKfycbxNZTW9V4cfcKnuCOPGoztTSXOgMH-zTwOLb_25DPM6KGuw81T11w853ol_XVsksKPTWA/exec'
