import dotenv from "dotenv";
dotenv.config();

import process from "node:process";
import chalk from "chalk";
import { Command, Option, program } from "commander";
import { DEFAULT_CONFIG } from "../config.js";
import { configureOptions } from "../core/utils/options.js";
import { getNodeMajorVersion } from "../core/func-core-tools.js";
import { logger } from "../core/utils/logger.js";
import registerStart from "./commands/start/register.js";
import { loadPackageJson } from "../core/utils/json.js";

const pkg = loadPackageJson();

function printWelcomeMessage(argv?: string[]) {
  const args = argv?.slice(2) || [];
  const showVersion = args.includes("--version") || args.includes("-v") || args.includes("--ping");
  const hideMessage = process.env.SWA_CLI_INTERNAL_COMMAND || showVersion;

  if (!hideMessage) {
    // don't use logger here: SWA_CLI_DEBUG is not set yet
    console.log(``);
    console.log(`Welcome to EasyAuth Emulator (${chalk.green(pkg.version)})`);
    console.log(``);
  }

  if (!showVersion) {
    checkNodeVersion();
  }
}

function checkNodeVersion() {
  const nodeMajorVersion: number = getNodeMajorVersion();
  const minVersion: number = parseInt(pkg.engines.node.substring(2, pkg.engines.node.indexOf(".")));

  if (nodeMajorVersion < minVersion) {
    logger.error(`You are using Node ${process.versions.node} but this version of the CLI requires Node ${minVersion} or higher.`);
    logger.error(`Please upgrade your Node version.\n`, true);
  }
}

export async function run(argv?: string[]) {
  printWelcomeMessage(argv);
  program
    .name("swa")
    .usage("start [options]")
    .version(pkg.version, "-v, --version")

    .addOption(
      new Option("-V, --verbose [prefix]", "enable verbose output. Values are: silly,info,log,silent")
        .preset(DEFAULT_CONFIG.verbose)
        .default(DEFAULT_CONFIG.verbose),
    )
    .option("-g, --print-config", "print all resolved options", false)
    .addHelpText(
      "after",
      `\nEasyAuth emulator. Use "swa start" to run the local auth emulator.\n`,
    );

  // Register only the start command
  registerStart(program);

  program.showHelpAfterError();
  program.addOption(new Option("--ping").hideHelp());

  await program.parseAsync(argv);
}
