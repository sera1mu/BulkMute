import {
  ApplicationCommand,
  Client,
  ClientOptions,
  event,
  Interaction,
  slash,
} from "harmony";
import { DB } from "sqlite";
import { Logger } from "std/log";
import AboutCommand from "../commands/AboutCommand.ts";
import BulkMuteCommand from "../commands/BulkMuteCommand.ts";
import Command from "../commands/Command.ts";
import LangCommand from "../commands/LangCommand.ts";
import UsersLanguagesStore from "../i18n/UsersLanguagesStore.ts";

/**
 * BulkMute の Discord クライアント
 */
export default class BulkMuteClient extends Client {
  registerCommandPromise?: Promise<void>;

  private readonly store: UsersLanguagesStore;

  private readonly registeringCommands: { [key: string]: Command } = {
    about: new AboutCommand(),
    bulkmute: new BulkMuteCommand(),
    lang: new LangCommand(),
  };

  constructor(
    private readonly logger: Logger,
    private readonly db: DB,
    options?: ClientOptions,
  ) {
    super(options);

    this.store = new UsersLanguagesStore(db);
  }

  /**
   * registeringCommands プロパティにあるコマンドを登録する
   */
  private registerCommands(): Promise<ApplicationCommand[]> {
    const promises: Promise<ApplicationCommand>[] = [];

    Object.keys(this.registeringCommands).forEach((key) => {
      const command = this.registeringCommands[key];
      promises.push(this.interactions.commands.create(command.commandPartial));
    });

    return Promise.all(promises);
  }

  private async runCommand(
    command: Command,
    i: Interaction,
  ): Promise<void> {
    try {
      await command.run(i, this.store.getLang(i.user.id), this.store);
      this.logger.info(
        `Runned command ${command.commandPartial.name}.`,
        `userId=${i.user?.id}`,
        `guildId=${i.guild?.id}`,
        `channelId=${i.channel?.id}`,
        `interactionId=${i.id}`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to run command ${command.commandPartial.name}.`,
        `userId=${i.user?.id}`,
        `guildId=${i.guild?.id}`,
        `channelId=${i.channel?.id}`,
        `interactionId=${i.id}`,
        `err=${err}`,
      );
    }
  }

  @event()
  ready(): void {
    this.logger.info("Initializing the table of users languages...");

    this.store.initTable();

    this.logger.info("Registering commands...");

    this.registerCommandPromise = (async () => {
      try {
        const commands = await this.registerCommands();
        const commandNames = commands.map((command) => command.name).join(", ");
        this.logger.info(`Registered all commands: ${commandNames}`);
      } catch (err) {
        this.logger.error(`Failed to register commands: ${err}`);
      } finally {
        this.logger.info(
          `Ready! Logged in as ${this.user?.tag}(${this.user?.id})`,
        );
      }
    })();
  }

  @slash()
  async about(i: Interaction): Promise<void> {
    await this.runCommand(
      this.registeringCommands.about,
      i,
    );
  }

  @slash()
  async bulkmute(i: Interaction): Promise<void> {
    await this.runCommand(
      this.registeringCommands.bulkmute,
      i,
    );
  }

  @slash()
  async lang(i: Interaction): Promise<void> {
    await this.runCommand(
      this.registeringCommands.lang,
      i,
    );
  }
}
