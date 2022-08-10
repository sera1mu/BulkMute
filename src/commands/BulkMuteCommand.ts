import {
  ApplicationCommandOptionType,
  Interaction,
  InteractionResponseType,
  SlashCommandInteraction,
} from "harmony";
import Command from "./Command.ts";

/**
 * 実行者が参加しているボイスチャンネルのメンバー全員をミュートするコマンド
 */
export default class BulkMuteCommand extends Command {
  constructor() {
    super({
      name: "bulkmute",
      description: "Mute all members in joining voice channel",
      options: [
        {
          name: "mute",
          type: ApplicationCommandOptionType.BOOLEAN,
          description: "Mute or unmute",
          required: false,
        },
      ],
    });
  }

  init(): void {}

  async run(i: Interaction): Promise<void> {
    const slashInteraction = i as SlashCommandInteraction;

    const voiceState = await i.guild?.voiceStates.get(i.user.id);

    if (typeof voiceState === "undefined") {
      await i.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: "You aren't joining any voice channel now!",
      });

      throw new Error("The author isn't joining any voice channel.");
    }

    const voiceChannel = voiceState.channel;
    const channelVoiceStates = voiceChannel?.voiceStates;
    const keys = await channelVoiceStates?.keys();

    if (typeof keys === "undefined") {
      await i.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: "Sorry. An internal error occurred. Please try again.",
      });

      throw new Error("Failed to get voice states in the voice channel.");
    }

    const muteOption = slashInteraction.options[0];
    const doMute = typeof muteOption === "undefined"
      ? !voiceState?.mute
      : muteOption.value;

    await Promise.all(keys.map(async (key) => {
      const entryState = await channelVoiceStates?.get(key);
      entryState?.setMute(doMute);
    }));

    await i.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: `All members in "${voiceChannel?.name}" are ${
        doMute ? "muted" : "unmuted"
      }.`,
    });
  }
}
