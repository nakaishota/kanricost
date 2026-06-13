import type { Question } from '../types'

/**
 * 問題プール。各領域15問、計60問。
 * 出題時は selectQuestions が各領域から5問ずつ抽選する。
 * 追加するときは該当領域の配列に Question を1つ足すだけでよい。
 *
 * score の意味(配点は 0 / 2 / 4 / 5。20問×5点=100点満点 → ミニマリスト度%):
 *   5 = 最も管理コストを避ける(持たない・手放す・断つ)
 *   0 = 最も管理を受け入れる(溜め込む・抱える・維持する)
 * 選択肢は溜め込み(0)→ やや維持(2)→ 手放す(4)→ 持たない(5)の昇順。
 * データ整合性ルール: 各問に必ず score:0 と score:5 の選択肢を含める。
 */

// ── モノの管理 ──────────────────────────────────────────
export const monoQuestions: Question[] = [
  {
    id: 'mono-01',
    domain: 'mono',
    scenario: '通販の段ボールが玄関に3箱たまっている。あなたは?',
    choices: [
      { text: 'いつか使うかもしれないので畳んで保管する', score: 0 },
      { text: '次の資源ごみの日まではとりあえず置いておく', score: 2 },
      { text: '気づいたタイミングですぐ畳んで捨てる', score: 4 },
      { text: 'そもそも箱が出ないよう買い物自体を減らしている', score: 5 },
    ],
  },
  {
    id: 'mono-02',
    domain: 'mono',
    scenario: '1年間ずっとクローゼットの奥にある、一度も着ていない服。',
    choices: [
      { text: '高かったし、いつか着るかもしれないので残す', score: 0 },
      { text: '迷うので「保留ボックス」に入れてもう一度考える', score: 2 },
      { text: '1年着なかったなら、もう手放す', score: 4 },
      { text: 'そういう服が生まれないよう、そもそも数を絞っている', score: 5 },
    ],
  },
  {
    id: 'mono-03',
    domain: 'mono',
    scenario: '無料でもらえるノベルティのエコバッグ。',
    choices: [
      { text: 'タダだしもらっておく。何枚あっても困らない', score: 0 },
      { text: '一応もらうが、家のストックが気になる', score: 2 },
      { text: '使う予定がなければ丁重に断る', score: 4 },
      { text: '受け取らない。増えた瞬間に管理対象になるから', score: 5 },
    ],
  },
  {
    id: 'mono-04',
    domain: 'mono',
    scenario: '新しい便利グッズがSNSでバズっている。あなたは?',
    choices: [
      { text: 'とりあえず買ってみる。ハマればラッキー', score: 0 },
      { text: '気になるのでカートに入れて少し寝かせる', score: 2 },
      { text: '今あるもので代用できないか先に考える', score: 4 },
      { text: 'モノが1つ増える時点で基本的に検討しない', score: 5 },
    ],
  },
  {
    id: 'mono-05',
    domain: 'mono',
    scenario: '旅行先のおみやげコーナー。自分用の記念品。',
    choices: [
      { text: '記念になるので毎回必ず何か買う', score: 0 },
      { text: '気に入ったものがあれば買う', score: 2 },
      { text: '基本は写真で十分。モノは買わないことが多い', score: 4 },
      { text: '思い出は持ち帰る。モノは持ち帰らないと決めている', score: 5 },
    ],
  },
  {
    id: 'mono-06',
    domain: 'mono',
    scenario: '家電を買ったときの箱と説明書。',
    choices: [
      { text: '売るときのために箱ごと全部とっておく', score: 0 },
      { text: '保証期間が終わるまでは残す', score: 2 },
      { text: '説明書はネットで見られるので箱は処分', score: 4 },
      { text: '開けたらその場で箱も説明書も処分する', score: 5 },
    ],
  },
  {
    id: 'mono-07',
    domain: 'mono',
    scenario: '冷蔵庫に賞味期限の近い食材と調味料がいくつもある。',
    choices: [
      { text: '気にせず買い足す。ストックは多めが安心', score: 0 },
      { text: 'ときどき気づいて慌てて使い切る', score: 2 },
      { text: '在庫を見てから買うので、あまり溜まらない', score: 4 },
      { text: '使い切れる分しか持たない。ストック自体を持たない', score: 5 },
    ],
  },
  {
    id: 'mono-08',
    domain: 'mono',
    scenario: '読み終わった本。本棚はそこそこ埋まっている。',
    choices: [
      { text: '蔵書として並べておきたいので全部残す', score: 0 },
      { text: 'お気に入りだけ残して、たまに整理する', score: 2 },
      { text: '読んだら基本は売るか譲る', score: 4 },
      { text: '紙では持たない。電子か図書館で済ませている', score: 5 },
    ],
  },
  {
    id: 'mono-09',
    domain: 'mono',
    scenario: '使うかもしれない紙袋・空き瓶・輪ゴム。',
    choices: [
      { text: '専用の引き出しにせっせとストックしている', score: 0 },
      { text: 'ある程度たまったら見直す', score: 2 },
      { text: '必要なとき買えばいいので基本ためない', score: 4 },
      { text: '「使うかも」のものは家に入れない', score: 5 },
    ],
  },
  {
    id: 'mono-10',
    domain: 'mono',
    scenario: '引っ越しの荷造りをしている。段ボールの数は?',
    choices: [
      { text: '何十箱にもなる。モノは多いほうだと思う', score: 0 },
      { text: '平均くらい。まあまあある', score: 2 },
      { text: '少なめ。前回より減らせた', score: 4 },
      { text: '驚かれるほど少ない。身軽さが自慢', score: 5 },
    ],
  },
  {
    id: 'mono-11',
    domain: 'mono',
    scenario: 'ボールペンが家に何本あるか、すぐ言える?',
    choices: [
      { text: '数えきれない。あちこちに転がっている', score: 0 },
      { text: 'だいたい何本かは把握している', score: 2 },
      { text: '使うものだけに絞っているので数えられる', score: 4 },
      { text: '1〜2本だけ。それ以上は持たない', score: 5 },
    ],
  },
  {
    id: 'mono-12',
    domain: 'mono',
    scenario: '壊れていないが使っていない古いスマホやガジェット。',
    choices: [
      { text: 'もったいないので引き出しに保管している', score: 0 },
      { text: 'いつか売ろうと思いつつ残っている', score: 2 },
      { text: '使わないと決めたら下取りや売却に出す', score: 4 },
      { text: '役目が終わった時点ですぐ手放す', score: 5 },
    ],
  },
  {
    id: 'mono-13',
    domain: 'mono',
    scenario: '友人が「これあげる」と気前よくモノをくれようとする。',
    choices: [
      { text: 'ありがたく何でももらう', score: 0 },
      { text: '断りづらいのでとりあえずもらう', score: 2 },
      { text: '本当に使うものだけもらう', score: 4 },
      { text: '気持ちだけ受け取り、モノは丁重に辞退する', score: 5 },
    ],
  },
  {
    id: 'mono-14',
    domain: 'mono',
    scenario: '部屋に「とりあえず置き」の物が積まれるスペースがある?',
    choices: [
      { text: 'ある。だいたい山になっている', score: 0 },
      { text: 'ときどきできるが、たまに片す', score: 2 },
      { text: '出しっぱなしは気持ち悪いのですぐ戻す', score: 4 },
      { text: 'そもそも床や机に物を置かない主義', score: 5 },
    ],
  },
  {
    id: 'mono-15',
    domain: 'mono',
    scenario: 'セールで「3点買うと1点無料」。欲しいのは1点だけ。',
    choices: [
      { text: 'お得なので4点とも持ち帰る', score: 0 },
      { text: '迷うが、結局つられて多めに買う', score: 2 },
      { text: '欲しい1点だけ買う', score: 4 },
      { text: '増えるのが嫌で、無料でも要らないものは取らない', score: 5 },
    ],
  },
  {
    id: 'mono-16',
    domain: 'mono',
    scenario: '家にある充電ケーブルやコード類。',
    choices: [
      { text: '何に使うか分からない線も全部とってある', score: 0 },
      { text: '一応とってあるが、絡まって把握できていない', score: 2 },
      { text: '使う機器の分だけ残して処分する', score: 4 },
      { text: '本数を最小限に決めていて、余りは持たない', score: 5 },
    ],
  },
  {
    id: 'mono-17',
    domain: 'mono',
    scenario: '趣味の道具やグッズ。',
    choices: [
      { text: '集めること自体が楽しく、どんどん増える', score: 0 },
      { text: '気に入ったものは買い足していく', score: 2 },
      { text: '本当に使うものに絞って持つ', score: 4 },
      { text: 'モノを増やさず楽しめる趣味を選んでいる', score: 5 },
    ],
  },
  {
    id: 'mono-18',
    domain: 'mono',
    scenario: '日用品(洗剤・ティッシュなど)のストック。',
    choices: [
      { text: '安いときに大量買いして床下や棚に備蓄', score: 0 },
      { text: '切らすのが不安で多めに持つ', score: 2 },
      { text: '予備は1つだけと決めている', score: 4 },
      { text: 'ストックを持たず、無くなったら都度買う', score: 5 },
    ],
  },
  {
    id: 'mono-19',
    domain: 'mono',
    scenario: '思い出の品(手紙・チケット半券・記念グッズ)。',
    choices: [
      { text: '捨てられないので箱にどんどん溜まっていく', score: 0 },
      { text: '特別なものは残し、たまに見返す', score: 2 },
      { text: '写真に撮ってから現物は手放す', score: 4 },
      { text: '思い出は記憶に残す。モノでは残さない', score: 5 },
    ],
  },
  {
    id: 'mono-20',
    domain: 'mono',
    scenario: 'キッチンの「○○専用」調理器具。',
    choices: [
      { text: '便利そうな専用グッズはつい揃えてしまう', score: 0 },
      { text: 'たまに使うものは持っている', score: 2 },
      { text: '汎用の道具で代用できるなら買わない', score: 4 },
      { text: '最小限の道具だけで回す主義', score: 5 },
    ],
  },
  {
    id: 'mono-21',
    domain: 'mono',
    scenario: '趣味に合わないプレゼントをもらった。',
    choices: [
      { text: 'もらったものは捨てられず飾っておく', score: 0 },
      { text: '使わないが、しまって保管しておく', score: 2 },
      { text: '気持ちは受け取り、現物は人に譲る', score: 4 },
      { text: 'お礼を伝えたうえで早めに手放す', score: 5 },
    ],
  },
  {
    id: 'mono-22',
    domain: 'mono',
    scenario: '届いたチラシ・DM・フリーペーパー。',
    choices: [
      { text: 'あとで見るかもと一旦ぜんぶ取っておく', score: 0 },
      { text: '気になるものだけ残す', score: 2 },
      { text: 'その場で要不要を判断して捨てる', score: 4 },
      { text: '受け取らない設定にして、紙を家に入れない', score: 5 },
    ],
  },
  {
    id: 'mono-23',
    domain: 'mono',
    scenario: '新しい家具や収納グッズを買おうか迷っている。',
    choices: [
      { text: '収納が増えると嬉しいので買う', score: 0 },
      { text: '便利そうなら買う', score: 2 },
      { text: '物を減らせば収納はいらないと考える', score: 4 },
      { text: '収納を増やすより中身を減らす方向で考える', score: 5 },
    ],
  },
  {
    id: 'mono-24',
    domain: 'mono',
    scenario: 'お店で配られる試供品やサンプル。',
    choices: [
      { text: 'もらえるものは全部もらう', score: 0 },
      { text: '使いそうなものはもらう', score: 2 },
      { text: '今すぐ使うものだけもらう', score: 4 },
      { text: '基本もらわない。小物でも増えるのが嫌', score: 5 },
    ],
  },
  {
    id: 'mono-25',
    domain: 'mono',
    scenario: '衣替えのシーズン。季節モノの服や寝具。',
    choices: [
      { text: '何年分も溜まり、収納がパンパン', score: 0 },
      { text: '入れ替えのたびに少し迷いつつ残す', score: 2 },
      { text: 'このタイミングで着ないものを手放す', score: 4 },
      { text: 'そもそも衣替え不要なくらい服が少ない', score: 5 },
    ],
  },
]

// ── デジタルの管理 ──────────────────────────────────────
export const digitalQuestions: Question[] = [
  {
    id: 'digital-01',
    domain: 'digital',
    scenario: 'スマホの未読通知バッジが「99+」になっている。',
    choices: [
      { text: '気になるので全部開いて確認する', score: 0 },
      { text: '重要そうなものだけ見て、残りは放置', score: 2 },
      { text: '気が向いたら一括既読で消す', score: 4 },
      { text: 'そもそも通知はほぼ全部オフにしてある', score: 5 },
    ],
  },
  {
    id: 'digital-02',
    domain: 'digital',
    scenario: 'スマホのホーム画面、アプリは何画面分?',
    choices: [
      { text: '何ページもある。とりあえず入れがち', score: 0 },
      { text: '2〜3ページ。たまに整理する', score: 2 },
      { text: '1ページに収まるよう絞っている', score: 4 },
      { text: '使うものだけ。定期的に消して最小限', score: 5 },
    ],
  },
  {
    id: 'digital-03',
    domain: 'digital',
    scenario: 'メールの受信トレイ、未読は何件たまっている?',
    choices: [
      { text: '数千件。もう数える気もない', score: 0 },
      { text: '気になったら検索で探すので放置気味', score: 2 },
      { text: '読んだら消す・アーカイブするを徹底', score: 4 },
      { text: '受信トレイは常にゼロを保っている', score: 5 },
    ],
  },
  {
    id: 'digital-04',
    domain: 'digital',
    scenario: '新しいサービスが「メール登録でクーポン」と勧めてくる。',
    choices: [
      { text: 'お得なので迷わず登録する', score: 0 },
      { text: '一応登録するが、後で配信は切るつもり', score: 2 },
      { text: '本当に使い続けるか考えてから登録', score: 4 },
      { text: 'アカウントが増えるのが嫌なので登録しない', score: 5 },
    ],
  },
  {
    id: 'digital-05',
    domain: 'digital',
    scenario: 'スマホの写真、容量がいっぱいだと警告が出た。',
    choices: [
      { text: '消すのが惜しいので容量を買い足す', score: 0 },
      { text: '明らかな失敗写真だけ少し消す', score: 2 },
      { text: 'まとめて見直して不要分を整理する', score: 4 },
      { text: 'そもそも撮りっぱなしにせずこまめに削除', score: 5 },
    ],
  },
  {
    id: 'digital-06',
    domain: 'digital',
    scenario: 'もう使っていないSNSやサービスのアカウント。',
    choices: [
      { text: '残しておく。消す手続きが面倒', score: 0 },
      { text: 'ログインしないだけで放置している', score: 2 },
      { text: '気づいたら退会手続きをする', score: 4 },
      { text: '使わないと決めたらすぐ退会・削除する', score: 5 },
    ],
  },
  {
    id: 'digital-07',
    domain: 'digital',
    scenario: 'ブラウザのタブ、今いくつ開いている?',
    choices: [
      { text: '数えきれない。後で読むつもりで開きっぱなし', score: 0 },
      { text: 'そこそこ多い。ときどき閉じる', score: 2 },
      { text: '用が済んだらすぐ閉じる', score: 4 },
      { text: '常に数個だけ。溜めない', score: 5 },
    ],
  },
  {
    id: 'digital-08',
    domain: 'digital',
    scenario: 'よく使うサービスから届く「お知らせ」プッシュ通知。',
    choices: [
      { text: '情報を逃したくないので全部オンにしている', score: 0 },
      { text: '気になるものだけオンにしている', score: 2 },
      { text: '基本オフ、必要な数個だけ残す', score: 4 },
      { text: '全部オフ。必要なときは自分で見に行く', score: 5 },
    ],
  },
  {
    id: 'digital-09',
    domain: 'digital',
    scenario: 'パソコンのデスクトップ、アイコンの数は?',
    choices: [
      { text: '埋め尽くされている。どこに何があるか不明', score: 0 },
      { text: 'そこそこ散らかっている', score: 2 },
      { text: '使うフォルダだけ並べて整頓', score: 4 },
      { text: '何も置かない。完全に空にしている', score: 5 },
    ],
  },
  {
    id: 'digital-10',
    domain: 'digital',
    scenario: '「あとで読む」に保存した記事や動画。',
    choices: [
      { text: 'どんどん溜まる。読み返すことはほぼない', score: 0 },
      { text: 'たまに消化するが基本は積まれている', score: 2 },
      { text: '溜まる前にその場で読むか捨てる', score: 4 },
      { text: '「あとで読む」自体を使わない主義', score: 5 },
    ],
  },
  {
    id: 'digital-11',
    domain: 'digital',
    scenario: '無料アプリが「フル機能はサブスクで」と案内してくる。',
    choices: [
      { text: 'とりあえず無料トライアルに登録してみる', score: 0 },
      { text: '気になるが、解約忘れが怖くて少し迷う', score: 2 },
      { text: '本当に必要なときだけ短期で契約する', score: 4 },
      { text: '管理が増えるので基本は無料の範囲で済ます', score: 5 },
    ],
  },
  {
    id: 'digital-12',
    domain: 'digital',
    scenario: 'パスワードやアカウントの管理、どうしている?',
    choices: [
      { text: 'たくさんありすぎて把握しきれていない', score: 0 },
      { text: 'なんとなく覚えているものを使い回している', score: 2 },
      { text: '管理ツールで整理しているが数は多い', score: 4 },
      { text: 'そもそもアカウントを増やさないようにしている', score: 5 },
    ],
  },
  {
    id: 'digital-13',
    domain: 'digital',
    scenario: 'LINEやチャットのグループ、いくつ入っている?',
    choices: [
      { text: '通知が来ても抜けづらく、たくさん残っている', score: 0 },
      { text: 'ミュートしてやり過ごしている', score: 2 },
      { text: '用が終わったグループからは退出する', score: 4 },
      { text: '必要なものだけ。不要になれば即退出', score: 5 },
    ],
  },
  {
    id: 'digital-14',
    domain: 'digital',
    scenario: 'クラウドストレージのファイル、整理されている?',
    choices: [
      { text: '「新しいフォルダ」が量産されてカオス', score: 0 },
      { text: '探せば見つかる程度には置いてある', score: 2 },
      { text: '定期的に不要ファイルを消している', score: 4 },
      { text: '必要最小限。終わったデータはすぐ消す', score: 5 },
    ],
  },
  {
    id: 'digital-15',
    domain: 'digital',
    scenario: '動画配信や音楽アプリの「マイリスト」。',
    choices: [
      { text: '気になったら全部保存。膨大に積まれている', score: 0 },
      { text: 'そこそこ保存するが見返さない', score: 2 },
      { text: '見終わったらリストから外す', score: 4 },
      { text: 'リストは作らず、観たいときに探す', score: 5 },
    ],
  },
  {
    id: 'digital-16',
    domain: 'digital',
    scenario: 'スマホのスクショ、フォルダにどれくらい溜まっている?',
    choices: [
      { text: '何百枚も。撮ったまま見返していない', score: 0 },
      { text: 'そこそこ溜まっているが放置', score: 2 },
      { text: '用が済んだスクショはこまめに消す', score: 4 },
      { text: 'メモはスクショに頼らず、撮ったらすぐ消す', score: 5 },
    ],
  },
  {
    id: 'digital-17',
    domain: 'digital',
    scenario: '契約している動画・音楽の定額サービスの数。',
    choices: [
      { text: '見たい作品ごとに複数契約している', score: 0 },
      { text: '2〜3個契約している', score: 2 },
      { text: '一番使う1つに絞っている', score: 4 },
      { text: '管理が面倒で、必要なときだけ単発で使う', score: 5 },
    ],
  },
  {
    id: 'digital-18',
    domain: 'digital',
    scenario: 'スマホの連絡先(電話帳)。',
    choices: [
      { text: '一度登録した相手は基本ずっと残している', score: 0 },
      { text: '増える一方だが特に整理はしない', score: 2 },
      { text: 'たまに見直して不要な連絡先を消す', score: 4 },
      { text: '今やりとりする人だけに絞っている', score: 5 },
    ],
  },
  {
    id: 'digital-19',
    domain: 'digital',
    scenario: 'パソコンのダウンロードフォルダ。',
    choices: [
      { text: '何でも溜まっていて、もはや開くのが怖い', score: 0 },
      { text: 'たまにしか片づけない', score: 2 },
      { text: '使い終わったファイルはすぐ消す', score: 4 },
      { text: 'ダウンロードしたら即・所定の場所か削除', score: 5 },
    ],
  },
  {
    id: 'digital-20',
    domain: 'digital',
    scenario: '届くメルマガ。役立つものもあれば不要なものも。',
    choices: [
      { text: '解除が面倒でほぼ全部受信したまま', score: 0 },
      { text: '読まないものは開かずに溜める', score: 2 },
      { text: '不要と気づいたら配信解除する', score: 4 },
      { text: '届いたら即解除。受信箱を汚させない', score: 5 },
    ],
  },
  {
    id: 'digital-21',
    domain: 'digital',
    scenario: 'スマホゲームやアプリ内の課金・アイテム管理。',
    choices: [
      { text: '複数のゲームを並行して育成・管理している', score: 0 },
      { text: '1〜2個を続けている', score: 2 },
      { text: '飽きたら未練なくアンインストール', score: 4 },
      { text: 'デイリー管理が要るものはやらない', score: 5 },
    ],
  },
  {
    id: 'digital-22',
    domain: 'digital',
    scenario: 'スマートスピーカーやIoT家電などのデジタル機器。',
    choices: [
      { text: '新しいガジェットはどんどん導入したい', score: 0 },
      { text: '便利そうなものは取り入れる', score: 2 },
      { text: 'アプリや設定が増えるなら慎重になる', score: 4 },
      { text: '管理が増える機器はあえて持たない', score: 5 },
    ],
  },
  {
    id: 'digital-23',
    domain: 'digital',
    scenario: 'ニュースや情報収集のアプリ・チャンネル登録。',
    choices: [
      { text: '見逃したくないので幅広く登録している', score: 0 },
      { text: '気になるものは登録しておく', score: 2 },
      { text: '本当に読む数個に絞っている', score: 4 },
      { text: '登録せず、必要なときに自分で調べる', score: 5 },
    ],
  },
  {
    id: 'digital-24',
    domain: 'digital',
    scenario: '無料の絵文字・スタンプ・テーマの配布。',
    choices: [
      { text: '無料なら片っ端から手に入れる', score: 0 },
      { text: '気に入ったものはもらっておく', score: 2 },
      { text: '実際に使うものだけ入れる', score: 4 },
      { text: '一覧が増えるのが嫌なので基本もらわない', score: 5 },
    ],
  },
  {
    id: 'digital-25',
    domain: 'digital',
    scenario: 'クラウドの写真自動バックアップ。',
    choices: [
      { text: '全部自動で上げ、容量を買い足して残し続ける', score: 0 },
      { text: 'なんとなく自動バックアップに任せている', score: 2 },
      { text: '定期的に見直して不要分は消す', score: 4 },
      { text: '残す写真を厳選し、データ自体を増やさない', score: 5 },
    ],
  },
]

// ── 人間関係・予定の管理 ────────────────────────────────
export const peopleQuestions: Question[] = [
  {
    id: 'people-01',
    domain: 'people',
    scenario: '気乗りしない飲み会に誘われた。あなたは?',
    choices: [
      { text: '付き合いも大事なので基本は参加する', score: 0 },
      { text: '断りづらく、無理してでも顔を出す', score: 2 },
      { text: '気が進まなければ素直に断る', score: 4 },
      { text: '迷いなく断る。行かない選択に罪悪感はない', score: 5 },
    ],
  },
  {
    id: 'people-02',
    domain: 'people',
    scenario: '休日のカレンダー。理想の状態は?',
    choices: [
      { text: '予定がぎっしり埋まっているのが好き', score: 0 },
      { text: 'そこそこ予定があると安心する', score: 2 },
      { text: '予定は1日1件くらいがちょうどいい', score: 4 },
      { text: '真っ白な空白こそ最高。予定を入れたくない', score: 5 },
    ],
  },
  {
    id: 'people-03',
    domain: 'people',
    scenario: 'グループの日程調整。みんなの都合がなかなか合わない。',
    choices: [
      { text: '自分が幹事になって取りまとめる', score: 0 },
      { text: '頼まれれば調整役を引き受ける', score: 2 },
      { text: '調整の往復が面倒なので人に任せる', score: 4 },
      { text: 'そもそも大人数の集まりに参加しない', score: 5 },
    ],
  },
  {
    id: 'people-04',
    domain: 'people',
    scenario: '年賀状や季節の挨拶のやりとり。',
    choices: [
      { text: '毎年きちんと全員に出している', score: 0 },
      { text: 'もらった人には返す', score: 2 },
      { text: '少しずつ出す相手を減らしている', score: 4 },
      { text: 'もうやめた。続ける手間が負担だった', score: 5 },
    ],
  },
  {
    id: 'people-05',
    domain: 'people',
    scenario: 'SNSのフォロー数、どれくらい?',
    choices: [
      { text: 'どんどんフォローして数が多い', score: 0 },
      { text: '気になる人はフォローしておく', score: 2 },
      { text: 'タイムラインが重くならない程度に絞る', score: 4 },
      { text: '本当に見たい数人だけ。または見ない', score: 5 },
    ],
  },
  {
    id: 'people-06',
    domain: 'people',
    scenario: '友人グループの予定が2週間先に入った。',
    choices: [
      { text: '楽しみで、その日までワクワクして待つ', score: 0 },
      { text: '特に何も感じず普通に待つ', score: 2 },
      { text: 'ずっと頭の片隅にあって少し気が重い', score: 4 },
      { text: '先の予定があるだけで負担。直前まで入れたくない', score: 5 },
    ],
  },
  {
    id: 'people-07',
    domain: 'people',
    scenario: 'あまり親しくない人から友だち追加・連絡先交換の申し出。',
    choices: [
      { text: 'せっかくなので交換しておく', score: 0 },
      { text: '断りづらいので一応交換する', score: 2 },
      { text: '必要性を感じなければやんわり断る', score: 4 },
      { text: '管理する相手を増やしたくないので交換しない', score: 5 },
    ],
  },
  {
    id: 'people-08',
    domain: 'people',
    scenario: '友人の引っ越しや結婚など、お祝い事のお返し・お礼。',
    choices: [
      { text: '律儀にきっちり対応する。やりとりが好き', score: 0 },
      { text: '常識の範囲できちんと返す', score: 2 },
      { text: '最低限にとどめる', score: 4 },
      { text: '形式的なやりとりは省く関係を選んでいる', score: 5 },
    ],
  },
  {
    id: 'people-09',
    domain: 'people',
    scenario: '行きたくないイベントに「幹事やってよ」と頼まれた。',
    choices: [
      { text: '頼られると嬉しいので引き受ける', score: 0 },
      { text: '渋々だが引き受けてしまう', score: 2 },
      { text: 'やんわり別の人を推す', score: 4 },
      { text: 'はっきり断る。背負う気はない', score: 5 },
    ],
  },
  {
    id: 'people-10',
    domain: 'people',
    scenario: '休みの日に複数の誘いが重なった。',
    choices: [
      { text: '全部に顔を出せるよう予定を詰め込む', score: 0 },
      { text: '可能な限り全部行こうとする', score: 2 },
      { text: '一番行きたい1つだけ選ぶ', score: 4 },
      { text: '全部断って家でゆっくりする日にする', score: 5 },
    ],
  },
  {
    id: 'people-11',
    domain: 'people',
    scenario: 'グループチャットの未読が100件。話題は雑談中心。',
    choices: [
      { text: '全部さかのぼって読む。流れを追いたい', score: 0 },
      { text: '気になるところだけ拾い読みする', score: 2 },
      { text: '名前を呼ばれていなければスルー', score: 4 },
      { text: '通知を切っていて、そもそも見ていない', score: 5 },
    ],
  },
  {
    id: 'people-12',
    domain: 'people',
    scenario: '定期的な集まり(月1の食事会など)のお誘い。',
    choices: [
      { text: '習慣として毎回欠かさず参加する', score: 0 },
      { text: '基本は参加するようにしている', score: 2 },
      { text: '気が向いたときだけ参加する', score: 4 },
      { text: '定期的に縛られるのが嫌で参加しない', score: 5 },
    ],
  },
  {
    id: 'people-13',
    domain: 'people',
    scenario: '返信にそこまで急がないメッセージが来た。',
    choices: [
      { text: 'すぐ返さないと気が済まず即レスする', score: 0 },
      { text: 'なるべく早めに返すよう心がける', score: 2 },
      { text: '手が空いたときにまとめて返す', score: 4 },
      { text: '即レス文化から降りていて、自分のペースで返す', score: 5 },
    ],
  },
  {
    id: 'people-14',
    domain: 'people',
    scenario: '知人に「今度ごはん行こうよ」と社交辞令的に言われた。',
    choices: [
      { text: 'すぐ日程を提案して実際にセッティングする', score: 0 },
      { text: '「いいね」と返し、機会があれば動く', score: 2 },
      { text: '社交辞令として軽く流す', score: 4 },
      { text: '安請け合いはしない。約束自体を増やさない', score: 5 },
    ],
  },
  {
    id: 'people-15',
    domain: 'people',
    scenario: '旅行の計画。役割分担はどうする?',
    choices: [
      { text: '率先して全部の手配を引き受ける', score: 0 },
      { text: '頼まれた分は担当する', score: 2 },
      { text: 'なるべく手間のかからない役回りを選ぶ', score: 4 },
      { text: '幹事業が嫌で、そもそも企画に乗らない', score: 5 },
    ],
  },
  {
    id: 'people-16',
    domain: 'people',
    scenario: '町内会や近所付き合い、マンションの集まり。',
    choices: [
      { text: '役員も引き受け、積極的に関わる', score: 0 },
      { text: '最低限の付き合いはこなす', score: 2 },
      { text: '当たり障りない範囲でやり過ごす', score: 4 },
      { text: '極力関わらずに済む距離を保つ', score: 5 },
    ],
  },
  {
    id: 'people-17',
    domain: 'people',
    scenario: '同窓会の案内が届いた。',
    choices: [
      { text: '懐かしいので毎回必ず参加する', score: 0 },
      { text: '都合がつけば顔を出す', score: 2 },
      { text: '気が向いたときだけ参加', score: 4 },
      { text: '過去の関係を維持する負担を感じて行かない', score: 5 },
    ],
  },
  {
    id: 'people-18',
    domain: 'people',
    scenario: 'SNSで自分の近況を発信すること。',
    choices: [
      { text: 'こまめに投稿し、反応の管理も楽しい', score: 0 },
      { text: 'ときどき投稿する', score: 2 },
      { text: 'ほとんど投稿しない。見る専門', score: 4 },
      { text: '発信は管理が増えるだけ。アカウントも持たない', score: 5 },
    ],
  },
  {
    id: 'people-19',
    domain: 'people',
    scenario: '友人・知人の誕生日。',
    choices: [
      { text: '全員ぶん覚えていて、毎年必ずお祝いする', score: 0 },
      { text: '通知が来たら祝うようにしている', score: 2 },
      { text: '親しい数人だけ祝う', score: 4 },
      { text: '誕生日の管理はしない。負担に感じる', score: 5 },
    ],
  },
  {
    id: 'people-20',
    domain: 'people',
    scenario: '趣味のサークルやオンラインコミュニティ。',
    choices: [
      { text: '複数に入って積極的に交流している', score: 0 },
      { text: 'いくつか所属している', score: 2 },
      { text: '負担にならない範囲で1つだけ', score: 4 },
      { text: '所属せず、ゆるく一人で楽しむ', score: 5 },
    ],
  },
  {
    id: 'people-21',
    domain: 'people',
    scenario: '職場やママ友の「みんなで行こう」ランチの誘い。',
    choices: [
      { text: '関係づくりのため、基本は毎回参加する', score: 0 },
      { text: '断りづらいので合わせて参加する', score: 2 },
      { text: '気が乗らなければ用事を理由に断る', score: 4 },
      { text: '一人の時間を優先して、はっきり断る', score: 5 },
    ],
  },
  {
    id: 'people-22',
    domain: 'people',
    scenario: '予定が一つもない週末が続いている。',
    choices: [
      { text: '寂しいので何か予定を入れたくなる', score: 0 },
      { text: '少しそわそわするが気にしない', score: 2 },
      { text: '快適。たまにはこういう週末もいい', score: 4 },
      { text: '最高。ずっとこうでも全く構わない', score: 5 },
    ],
  },
  {
    id: 'people-23',
    domain: 'people',
    scenario: '結婚式や二次会の招待。あまり親しくない相手から。',
    choices: [
      { text: '誘われたら基本は出席する', score: 0 },
      { text: '断りづらく、無理してでも出る', score: 2 },
      { text: '親しさ次第で丁重に欠席する', score: 4 },
      { text: '気が進まなければきっぱり欠席する', score: 5 },
    ],
  },
  {
    id: 'people-24',
    domain: 'people',
    scenario: '旅行や遠出のお誘いの頻度、理想は?',
    choices: [
      { text: '誘われるほど嬉しい。予定はあるほど良い', score: 0 },
      { text: 'ときどきあると楽しい', score: 2 },
      { text: 'たまにで十分。準備や移動は負担', score: 4 },
      { text: 'まとまった予定自体が重い。家が一番', score: 5 },
    ],
  },
  {
    id: 'people-25',
    domain: 'people',
    scenario: 'しばらく連絡を取っていない知人との関係。',
    choices: [
      { text: 'こまめに連絡して関係を保とうとする', score: 0 },
      { text: '気が向いたら連絡する', score: 2 },
      { text: '自然に縁が薄れるのは仕方ないと考える', score: 4 },
      { text: '無理に維持しない。必要なら再びつながればいい', score: 5 },
    ],
  },
]

// ── お金・契約の管理 ────────────────────────────────────
export const moneyQuestions: Question[] = [
  {
    id: 'money-01',
    domain: 'money',
    scenario: 'レジで「アプリはお持ちですか?今ならポイント5倍です」。',
    choices: [
      { text: 'お得なのでその場でインストールする', score: 0 },
      { text: 'とりあえず「結構です」と言うが少し損した気分', score: 2 },
      { text: '迷わず断る。アプリ1個のほうが重い', score: 4 },
      { text: '話をされる前に「大丈夫です」が出ている', score: 5 },
    ],
  },
  {
    id: 'money-02',
    domain: 'money',
    scenario: '財布の中のポイントカード、何枚入っている?',
    choices: [
      { text: 'パンパン。お店ごとに作っている', score: 0 },
      { text: 'そこそこある。よく行く店の分は持つ', score: 2 },
      { text: '本当に使う数枚だけに絞っている', score: 4 },
      { text: '基本作らない。ポイントより身軽さ', score: 5 },
    ],
  },
  {
    id: 'money-03',
    domain: 'money',
    scenario: '契約中のサブスク、すべて把握できている?',
    choices: [
      { text: '正直、何に入っているか把握できていない', score: 0 },
      { text: 'なんとなく覚えているが見直していない', score: 2 },
      { text: '定期的に棚卸しして使わない分は解約する', score: 4 },
      { text: 'そもそもサブスクはほとんど契約しない', score: 5 },
    ],
  },
  {
    id: 'money-04',
    domain: 'money',
    scenario: '使っていないサブスクを見つけた。解約手続きは面倒。',
    choices: [
      { text: '面倒なので結局そのまま放置してしまう', score: 0 },
      { text: '気になりつつ、なかなか手をつけない', score: 2 },
      { text: '気づいたタイミングで解約する', score: 4 },
      { text: 'その場で即解約する。1円でも払い続けたくない', score: 5 },
    ],
  },
  {
    id: 'money-05',
    domain: 'money',
    scenario: '銀行口座やクレジットカード、いくつ持っている?',
    choices: [
      { text: '特典ごとに作って、数が多い', score: 0 },
      { text: '用途別にいくつか持っている', score: 2 },
      { text: 'メインを決めて少数に絞っている', score: 4 },
      { text: '管理を最小化するため、ほぼ1つに集約', score: 5 },
    ],
  },
  {
    id: 'money-06',
    domain: 'money',
    scenario: '新しいクレカが「入会で10,000ポイント」とうたっている。',
    choices: [
      { text: 'お得なので作る。ポイントは取りに行く', score: 0 },
      { text: '魅力的だが、管理が増えるか少し迷う', score: 2 },
      { text: 'よほどメリットがなければ作らない', score: 4 },
      { text: 'カードを増やす時点で対象外。作らない', score: 5 },
    ],
  },
  {
    id: 'money-07',
    domain: 'money',
    scenario: 'キャンペーンの「条件達成でキャッシュバック」。',
    choices: [
      { text: '条件を細かく管理してでも必ず取りに行く', score: 0 },
      { text: '余裕があれば狙う', score: 2 },
      { text: '管理が面倒なら見送る', score: 4 },
      { text: '条件付きの特典は最初から追わない', score: 5 },
    ],
  },
  {
    id: 'money-08',
    domain: 'money',
    scenario: '家計簿やお金の管理、どうしている?',
    choices: [
      { text: '費目を細かく分けてしっかり記録している', score: 0 },
      { text: 'アプリでゆるく把握している', score: 2 },
      { text: '固定費を絞って、細かい記録はしない', score: 4 },
      { text: '管理する項目自体を減らして手間をかけない', score: 5 },
    ],
  },
  {
    id: 'money-09',
    domain: 'money',
    scenario: '保険の見直しをすすめられた。',
    choices: [
      { text: '安心のため、すすめられた分は手厚く入る', score: 0 },
      { text: '言われるまま、なんとなく継続している', score: 2 },
      { text: '本当に必要な分だけに絞り込む', score: 4 },
      { text: '最低限以外は持たない。管理対象を増やさない', score: 5 },
    ],
  },
  {
    id: 'money-10',
    domain: 'money',
    scenario: '複数のスマホ決済・電子マネー、使い分けている?',
    choices: [
      { text: '還元率を見て何種類も使い分けている', score: 0 },
      { text: '2〜3種類を場面で使い分ける', score: 2 },
      { text: 'メインを1つ決めてほぼそれで通す', score: 4 },
      { text: '管理が増えるので1つに統一している', score: 5 },
    ],
  },
  {
    id: 'money-11',
    domain: 'money',
    scenario: '無料トライアル付きのサービス。解約日を覚えておく必要がある。',
    choices: [
      { text: 'とりあえず登録する。覚えておけば大丈夫', score: 0 },
      { text: '登録するが、解約忘れがよく不安になる', score: 2 },
      { text: '登録時にリマインダーを必ずセットする', score: 4 },
      { text: '解約日を管理するのが嫌で最初から登録しない', score: 5 },
    ],
  },
  {
    id: 'money-12',
    domain: 'money',
    scenario: 'クーポンや割引券、有効期限のあるもの。',
    choices: [
      { text: '集めて、期限ギリギリでも使い切ろうとする', score: 0 },
      { text: 'もらったら一応とっておく', score: 2 },
      { text: 'すぐ使う予定がなければもらわない', score: 4 },
      { text: '期限を気にするのが負担で最初から受け取らない', score: 5 },
    ],
  },
  {
    id: 'money-13',
    domain: 'money',
    scenario: '通信プランや光熱費のプラン、最適化している?',
    choices: [
      { text: '少しでも得なプランを常に乗り換え続ける', score: 0 },
      { text: 'ときどき見直す', score: 2 },
      { text: '一度決めたら、そこそこ妥当ならそのまま', score: 4 },
      { text: 'シンプルで管理不要なプランをあえて選ぶ', score: 5 },
    ],
  },
  {
    id: 'money-14',
    domain: 'money',
    scenario: '株主優待やポイ活など、特典を取りに行く活動。',
    choices: [
      { text: '大好き。手間をかけて熱心にやっている', score: 0 },
      { text: '手軽なものだけ取り組んでいる', score: 2 },
      { text: 'ほとんどやらない。割に合わないと感じる', score: 4 },
      { text: '管理が増えるだけなので一切やらない', score: 5 },
    ],
  },
  {
    id: 'money-15',
    domain: 'money',
    scenario: 'レシートや領収書、どうしている?',
    choices: [
      { text: '保管している。財布や引き出しに溜まりがち', score: 0 },
      { text: '一応とっておくが整理はしていない', score: 2 },
      { text: '必要な分だけ残してすぐ処分する', score: 4 },
      { text: '基本その場で捨てる。紙を持ち歩かない', score: 5 },
    ],
  },
  {
    id: 'money-16',
    domain: 'money',
    scenario: 'ふるさと納税や税控除のお得な制度。',
    choices: [
      { text: '手間をかけてでも限度まで活用する', score: 0 },
      { text: '余裕があればやる', score: 2 },
      { text: '書類管理が面倒なのでほぼやらない', score: 4 },
      { text: '管理が増えるだけなので手を出さない', score: 5 },
    ],
  },
  {
    id: 'money-17',
    domain: 'money',
    scenario: 'お店の会員ランク(ゴールド会員など)の維持。',
    choices: [
      { text: '条件を意識して、ランクを維持・昇格させる', score: 0 },
      { text: '気づいたら維持できている程度', score: 2 },
      { text: 'ランクのために行動を変えることはしない', score: 4 },
      { text: 'ランク管理が面倒で、最初から気にしない', score: 5 },
    ],
  },
  {
    id: 'money-18',
    domain: 'money',
    scenario: 'クレジットカードの利用明細。',
    choices: [
      { text: '一件ずつ細かくチェックして管理している', score: 0 },
      { text: 'たまにざっと確認する', score: 2 },
      { text: '引き落とし額だけ把握しておく', score: 4 },
      { text: 'そもそも明細が複雑にならないよう支払いを単純化', score: 5 },
    ],
  },
  {
    id: 'money-19',
    domain: 'money',
    scenario: '投資や資産運用の口座。',
    choices: [
      { text: '複数の口座・銘柄を細かく管理している', score: 0 },
      { text: 'いくつか持って、ときどき見る', score: 2 },
      { text: 'ほったらかしで済む形に絞っている', score: 4 },
      { text: '管理が要らない範囲だけ、もしくはやらない', score: 5 },
    ],
  },
  {
    id: 'money-20',
    domain: 'money',
    scenario: '電子マネーへのチャージと残高管理。',
    choices: [
      { text: '複数のサービスに残高があり、こまめにチャージ', score: 0 },
      { text: 'いくつかに残高が散らばっている', score: 2 },
      { text: '使うものを絞り、残高は把握している', score: 4 },
      { text: '残高管理が面倒なので使うものを1つに統一', score: 5 },
    ],
  },
  {
    id: 'money-21',
    domain: 'money',
    scenario: '買い物の前の価格比較。',
    choices: [
      { text: '何店舗も比較して一番安い方法を探す', score: 0 },
      { text: '気が向いたら少し比べる', score: 2 },
      { text: '時間が惜しいのでほどほどで決める', score: 4 },
      { text: '比較の手間を嫌い、決めた店でさっと買う', score: 5 },
    ],
  },
  {
    id: 'money-22',
    domain: 'money',
    scenario: '公共料金や各種支払いの請求書(紙)。',
    choices: [
      { text: '紙で受け取り、ファイリングして保管', score: 0 },
      { text: '紙で来るが、整理はしていない', score: 2 },
      { text: 'ペーパーレスに切り替えている', score: 4 },
      { text: '紙も通知も最小化し、自動引き落としで完結', score: 5 },
    ],
  },
  {
    id: 'money-23',
    domain: 'money',
    scenario: '商品の保証書や延長保証。',
    choices: [
      { text: 'すべてファイルに綴じて大切に保管', score: 0 },
      { text: '一応とってあるが、どこにあるか曖昧', score: 2 },
      { text: '高額なものだけ残す', score: 4 },
      { text: '延長保証はつけず、保証書の管理もしない', score: 5 },
    ],
  },
  {
    id: 'money-24',
    domain: 'money',
    scenario: '貯金や予算を「封筒分け」など細かく管理すること。',
    choices: [
      { text: '費目ごとに分けて、きっちり管理するのが好き', score: 0 },
      { text: 'ざっくり分けている', score: 2 },
      { text: '細かく分けず、ゆるく把握する程度', score: 4 },
      { text: '仕組みで自動化し、手動の管理はしない', score: 5 },
    ],
  },
  {
    id: 'money-25',
    domain: 'money',
    scenario: 'たまにしか使わないモノ。買う?借りる?',
    choices: [
      { text: '欲しいものは所有したいので買う', score: 0 },
      { text: '使う頻度を考えつつ、だいたい買う', score: 2 },
      { text: 'たまにしか使わないならレンタルで済ます', score: 4 },
      { text: '所有の管理を避け、必要なときだけ借りる', score: 5 },
    ],
  },
]

export const questionPool: Question[] = [
  ...monoQuestions,
  ...digitalQuestions,
  ...peopleQuestions,
  ...moneyQuestions,
]
