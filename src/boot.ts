import { DB } from "sqlite";
import { Intents } from "harmony";
import * as log from "std/log";
import BulkMuteClient from "./discord/BulkMuteClient.ts";

let isAlreadyStartedShutdown = false;

function shutdown(client: BulkMuteClient, logger: log.Logger, db: DB): void {
  if (isAlreadyStartedShutdown) return;
  isAlreadyStartedShutdown = true;

  let isFailedShutdownGracefully = false;

  client.destroy()
    .then(() => {
      logger.info("Destroyed client.");
    })
    .catch((err) => {
      logger.error("Failed to destroy client gracefully.", `err=${err}`);
      isFailedShutdownGracefully = true;
    })
    .finally(() => {
      try {
        db.close();
        logger.info("Closed database.");
      } catch (err) {
        isFailedShutdownGracefully = true;
        logger.error("Failed to close database gracefully.", `err=${err}`);
      } finally {
        if (isFailedShutdownGracefully) {
          logger.error("Exit code is 1.");
          Deno.exit(1);
        }

        logger.info("Exit code is 0.");
      }
    });
}

async function boot(): Promise<{ client: BulkMuteClient; logger: log.Logger }> {
  const BM_TOKEN = Deno.env.get("BM_TOKEN");
  const BM_DB = Deno.env.get("BM_DB");

  if (typeof BM_TOKEN === "undefined") {
    throw new Error(
      'Specify the client\'s token to environment variable "BM_TOKEN".',
    );
  }

  if (typeof BM_DB === "undefined") {
    throw new Error(
      'Specify the file name of the database used to environment variable "BM_DB".',
    );
  }

  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("INFO", {
        formatter: (logRecord) => {
          const datetime = `${logRecord.datetime.getFullYear()}/${
            logRecord.datetime.getMonth().toString().padStart(2, "0")
          }/${logRecord.datetime.getDate().toString().padStart(2, "0")} ${
            logRecord.datetime.getHours().toString().padStart(2, "0")
          }:${logRecord.datetime.getMinutes().toString().padStart(2, "0")}:${
            logRecord.datetime.getSeconds().toString().padStart(2, "0")
          }`;
          const output =
            `[${datetime}] [${logRecord.loggerName}/${logRecord.levelName}]${
              logRecord.args.length !== 0 ? " " + logRecord.args.join(",") : ""
            }: ${logRecord.msg}`;

          return output;
        },
      }),
    },
    loggers: {
      default: {
        level: "INFO",
        handlers: ["console"],
      },
      client: {
        level: "INFO",
        handlers: ["console"],
      },
    },
  });

  const logger = log.getLogger();
  const db = new DB(BM_DB);
  const client = new BulkMuteClient(log.getLogger("client"), db);
  await client.connect(BM_TOKEN, Intents.None);

  Deno.addSignalListener("SIGTERM", () => shutdown(client, logger, db));
  Deno.addSignalListener("SIGINT", () => shutdown(client, logger, db));

  return { client, logger };
}

const startTime = performance.now();
const { client, logger } = await boot();
client.registerCommandPromise?.finally(() => {
  const endTime = performance.now();
  const divisionMiliseconds = 1000;
  logger.info(`Done(${(endTime - startTime) / divisionMiliseconds} s)!`);
});
