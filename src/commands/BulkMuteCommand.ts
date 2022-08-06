import { Interaction, InteractionResponseType } from "harmony";
import Command from "../structures/Command.ts";

/**
 * 実行者が参加しているボイスチャンネルのメンバー全員をミュートするコマンド
 */
export default class BulkMuteCommand extends Command {
  constructor() {
    super({
      name: "bulkmute",
      description: "Mute all members in joining voice channel",
    });
  }

  init(): void {}

  async run(i: Interaction): Promise<void> {
    const voiceState = await i.guild?.voiceStates.get(i.user.id);

    if(typeof voiceState === "undefined") {
      await i.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: "You aren't joining any voice channel now!"
      });

      throw new Error("The author isn't joining any voice channel.");
    }

    const voiceChannel = voiceState.channel;
    const channelVoiceStates = voiceChannel?.voiceStates;
    const keys = await channelVoiceStates?.keys();

    if(typeof keys === "undefined") {
      await i.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: "Sorry. An internal error occurred. Please try again."
      })

      throw new Error("Failed to get voice states in the voice channel.");
    }

    await Promise.all(keys.map(async (key) => {
      const entryState = await channelVoiceStates?.get(key);
      entryState?.setMute(!voiceState?.mute);
    }));

    await i.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: `All members in "${voiceChannel?.name}" are ${!voiceState?.mute ? "muted" : "unmuted"}.`
    });
  }
}
