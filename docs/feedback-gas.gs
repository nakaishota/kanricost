/**
 * 管理コスト診断 — 問題フィードバック受信用 Google Apps Script
 *
 * ■ セットアップ手順
 * 1. Google スプレッドシートを新規作成
 * 2. 拡張機能 → Apps Script を開く
 * 3. このコードをすべて貼り付けて保存
 * 4. 右上「デプロイ」→「新しいデプロイ」→ 種類で「ウェブアプリ」を選択
 *      - 実行するユーザー         : 自分
 *      - アクセスできるユーザー   : 全員
 * 5. デプロイ後に発行される「ウェブアプリ URL（.../exec で終わる）」をコピー
 * 6. src/constants.ts の FEEDBACK_ENDPOINT にその URL を設定して再デプロイ
 *
 * 受信した評価は同スプレッドシートの「feedback」シートに1問1行で追記される。
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('feedback');
    if (!sheet) {
      sheet = ss.insertSheet('feedback');
      sheet.appendRow([
        'ratedAt', 'sessionId', 'questionId', 'domain', 'rating',
        'choiceScore', 'scenario', 'choiceText', 'resultType', 'total',
      ]);
    }
    var data = JSON.parse(e.postData.contents);
    (data.items || []).forEach(function (it) {
      sheet.appendRow([
        data.ratedAt || new Date().toISOString(),
        data.sessionId || '',
        it.questionId,
        it.domain,
        it.rating,
        it.choiceScore,
        it.scenario,
        it.choiceText,
        data.resultType || '',
        data.total,
      ]);
    });
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
