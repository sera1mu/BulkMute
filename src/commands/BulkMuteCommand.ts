import {
  ApplicationCommandOptionType,
  Interaction,
  InteractionResponseType,
  SlashCommandInteraction,
} from "harmony";
import { Language } from "../i18n/Language.ts";
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

  async run(i: Interaction, lang: Language): Promise<void> {
    const slashInteraction = i as SlashCommandInteraction;

    const voiceState = await i.guild?.voiceStates.get(i.user.id);

    if (typeof voiceState === "undefined") {
      await i.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: lang.notJoiningAnyVoiceChannelMsg,
      });

      throw new Error("The author isn't joining any voice channel.");
    }

    const voiceChannel = voiceState.channel;
    const channelVoiceStates = voiceChannel?.voiceStates;
    const keys = await channelVoiceStates?.keys();

    if (typeof keys === "undefined") {
      this.respondAsInternalError(i, lang);
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

    const channelName = voiceChannel?.name || "???";

    await i.respond({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: lang.bulkMuteResultMsg.replace("%channel%", channelName).replace(
        "%isMuted%",
        doMute ? lang.muted : lang.unmuted,
      ),
    });
  }
}
