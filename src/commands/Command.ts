import {
  ApplicationCommandPartial,
  Interaction,
  InteractionResponseType,
} from "harmony";
import BulkMuteClient from "../discord/BulkMuteClient.ts";
import { Language } from "../i18n/Language.ts";
import UsersLanguagesStore from "../i18n/UsersLanguagesStore.ts";

/**
 * Slash Command の基底ウラス
 */
export default abstract class Command {
  constructor(readonly commandPartial: ApplicationCommandPartial) {
  }

  /**
   * クライアントがコマンドを初期化したときの処理
   */
  abstract init(client: BulkMuteClient): void | Promise<void>;

  /**
   * コマンドが実行されたときの処理
   */
  abstract run(
    i: Interaction,
    lang: Language,
    store: UsersLanguagesStore,
  ): void | Promise<void>;

  async respondAsInternalError(
    i: Interaction,
    lang: Language,
  ): Promise<void> {
    await i.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: lang.internalErrorMsg,
    });
  }
}
