import { DB } from "sqlite";
import { Language } from "./Language.ts";
import languages from "./languages/Languages.ts";

export default class UsersLanguagesStore {
  private items: { [key: string]: string };

  constructor(private readonly db: DB) {
    this.items = {};
  }

  initTable(): void {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS users_languages (
        id TEXT PRIMARY KEY,
        lang_id TEXT
      );
    `);

    const entries = this.db.query<[string, string]>(`
      SELECT * FROM users_languages;
    `);

    entries.forEach((entry) => {
      this.set(entry[0], entry[1], true);
    });
  }

  clear(): void {
    this.db.execute(`DELETE FROM users_languages;`);

    this.items = {};
  }

  delete(userId: string): boolean {
    if (!this.has(userId)) {
      return false;
    }

    this.db.query(`DELETE FROM users_languages WHERE id = ?;`, [userId]);

    delete this.items[userId];

    return true;
  }

  get(userId: string): string | undefined {
    return this.items[userId];
  }

  has(userId: string): boolean {
    return Object.keys(this.items).includes(userId);
  }

  set(userId: string, langId: string, noSavingToDB = false): this {
    if (!noSavingToDB) {
      if (this.has(userId)) {
        this.db.query(`UPDATE users_languages SET lang_id = ? WHERE id = ?;`, [
          langId,
          userId,
        ]);
      } else {
        this.db.query(`INSERT INTO users_languages VALUES (?, ?);`, [
          userId,
          langId,
        ]);
      }
    }

    this.items[userId] = langId;

    return this;
  }

  getLang(userId: string): Language {
    const langId = this.get(userId);

    if (typeof langId === "undefined") return languages.en;

    return languages[langId];
  }
}
