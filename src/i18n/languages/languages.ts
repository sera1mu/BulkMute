import { parse } from "std/encoding/yaml";
import { isLanguage, Language } from "../Language.ts";

function parseLanguage(langId: string): Language {
  const yaml = Deno.readTextFileSync(`./src/i18n/languages/${langId}.yml`);
  const parsedYaml = parse(yaml);

  if (!isLanguage(parsedYaml)) {
    throw new TypeError(`The type of language definition is bad.`);
  }

  return parsedYaml;
}

const languages: Record<string, Language> = {
  en: parseLanguage("en"),
  ja: parseLanguage("ja"),
};

export default languages;
