import { Embed, Interaction, InteractionResponseType } from "harmony";
import { BOT_NAME, VERSION } from "../constants.ts";
import { Language } from "../i18n/Language.ts";
import Command from "./Command.ts";

/**
 * BulkMute についてを表示するコマンド
 */
export default class AboutCommand extends Command {
  constructor() {
    super({
      name: "about",
      description: "Show about BulkMute bot",
    });
  }

  init(): void {}

  async run(i: Interaction, lang: Language): Promise<void> {
    const embed = new Embed({
      title: `${BOT_NAME} ${VERSION}`,
      description: lang.botDescritpion,
      fields: [
        {
          name: lang.version,
          value: VERSION,
        },
        {
          name: lang.sourceCode,
          value: "https://github.com/sera1mu/bulkmute",
        },
        {
          name: lang.license,
          value: "MIT License",
        },
        {
          name: lang.author,
          value: "Seraimu",
        },
      ],
      footer: {
        text: "Copyright © 2022 Seraimu.",
      },
    });

    await i.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [embed],
    });
  }
}
