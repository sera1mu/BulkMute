import { Embed, Interaction, InteractionResponseType } from "harmony";
import { BOT_NAME, VERSION } from "../constants.ts";
import Command from "../structures/Command.ts";

export default class AboutCommand extends Command {
  constructor() {
    super({
      name: "about",
      description: "Show about BulkMute bot",
    });
  }

  init(): void {}

  async run(i: Interaction): Promise<void> {
    const embed = new Embed({
      title: `${BOT_NAME} ${VERSION}`,
      description: "The simple Discord bot to toggle server mute for all users in a voice channel at once.",
      fields: [
        {
          name: "Version",
          value: VERSION
        },
        {
          name: "Source code",
          value: "https://github.com/sera1mu/bulkmute"
        },
        {
          name: "License",
          value: "MIT License"
        },
        {
          name: "Author",
          value: "Seraimu"
        }
      ],
      footer: {
        text: "Copyright © 2022 Seraimu."
      }
    });

    await i.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      embeds: [embed]
    });
  }
}
