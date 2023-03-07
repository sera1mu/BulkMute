export interface Language {
  /**
   * 言語ID (例: 英語 -> en)
   *
   * ISO639-1を使用する。
   *
   * 参考: https://ja.wikipedia.org/wiki/ISO_639-1%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7
   */
  langId: string;

  /**
   * 言語の表示名
   *
   * 原語名を使用する。
   */
  langName: string;

  /**
   * 「バージョン」の訳語。
   */
  version: string;

  /**
   * 「ソースコード」の訳語。
   */
  sourceCode: string;

  /**
   * 「ライセンス」の訳語。
   */
  license: string;

  /**
   * 「作者」の訳語。
   */
  author: string;

  /**
   * 「ミュート」の訳語。
   */
  muted: string;

  /**
   * 「ミュート解除」の訳語。
   */
  unmuted: string;

  /**
   * Bot自体の説明文。
   */
  botDescritpion: string;

  /**
   * `/bulkmute` の実行結果のメッセージ。
   *
   * **Parameters:**
   * - `%channel%`: `/bulkmute` が実行されたチャンネルの名前。
   * - `%isMuted%`: ミュートされたか否か。(muted, unmutedの値が使用される。)
   */
  bulkMuteResultMsg: string;

  /**
   * `/bulkmute` で使用者がVCに参加していないときのメッセージ。
   */
  notJoiningAnyVoiceChannelMsg: string;

  /**
   * `/lang` で使用言語を切り替えたときのメッセージ。
   */
  switchedLanguageMsg: string;

  /**
   * 内部エラーが発生したときのメッセージ。
   */
  internalErrorMsg: string;
}

// deno-lint-ignore no-explicit-any
export function isLanguage(object: any): object is Language {
  const exceptedProperties = [
    "langId",
    "langName",
    "version",
    "sourceCode",
    "license",
    "author",
    "muted",
    "unmuted",
    "botDescription",
    "bulkMuteResultMsg",
    "notJoiningAnyVoiceChannelMsg",
    "switchedLanguageMsg",
    "internalErrorMsg",
  ].sort();

  const actualProperties = Object.keys(object).sort();

  if (JSON.stringify(exceptedProperties) !== JSON.stringify(actualProperties)) {
    return false;
  }

  let somethingNotString = false;

  Object.values(object).forEach((value) => {
    if (somethingNotString) return;
    if (typeof value !== "string") somethingNotString = true;
  });

  if (somethingNotString) return false;

  return true;
}
