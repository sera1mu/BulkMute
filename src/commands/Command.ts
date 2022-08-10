import { ApplicationCommandPartial, Interaction } from "harmony";
import BulkMuteClient from "../discord/BulkMuteClient.ts";

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
  abstract run(i: Interaction): void | Promise<void>;
}
