import {
  ApplicationCommandChoice,
  Interaction,
  InteractionResponseType,
  SlashCommandInteraction,
} from "harmony";
import { Language } from "../i18n/Language.ts";
import languages from "../i18n/languages/Languages.ts";
import UsersLanguagesStore from "../i18n/UsersLanguagesStore.ts";
import Command from "./Command.ts";

export default class LangCommand extends Command {
  constructor() {
    const choices: ApplicationCommandChoice[] = [];

    Object.keys(languages).forEach((langId) => {
      const lang = languages[langId];

      choices.push({
        name: lang.langName,
        value: lang.langId,
      });
    });

    super({
      name: "lang",
      description: "Set your language in this bot",
      options: [
        {
          name: "language",
          description: "The language used",
          type: "STRING",
          required: true,
          choices,
        },
      ],
    });
  }

  init(): void {}

  async run(
    i: Interaction,
    lang: Language,
    store: UsersLanguagesStore,
  ): Promise<void> {
    const slashInteraction = i as SlashCommandInteraction;
    const langId = slashInteraction.options[0].value;

    try {
      store.set(i.user.id, langId);
      await i.respond({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        content: store.getLang(i.user.id)?.switchedLanguageMsg,
      });
    } catch (err) {
      this.respondAsInternalError(i, lang);

      throw err;
    }
  }
}
