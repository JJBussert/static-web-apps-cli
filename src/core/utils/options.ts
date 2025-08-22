import { Command, OptionValues, program } from "commander";
import { DEFAULT_CONFIG } from "../../config.js";
import { SWACommand, SWA_COMMANDS } from "../constants.js";
// config file loading disabled for emulator-only build
import { logger } from "./logger.js";

let userDefinedOptions: SWACLIConfig = {};
let configFileDefinedOptions: SWACLIConfig = {};

export async function configureOptions(
  configName: string | undefined,
  options: SWACLIConfig,
  command: Command,
  commandName: SWACommand,
  loadConfigFile: boolean = true
): Promise<SWACLIConfig> {
  const verbose = options.verbose;

  setLogLevel(verbose);

  userDefinedOptions = getUserOptions(command);

  // Config file support removed: only CLI args are used
  configFileDefinedOptions = {};

  options = {
    ...DEFAULT_CONFIG,
    ...options,
    ...userDefinedOptions,
  };

  // Re-set log level again after merging user options
  setLogLevel(options.verbose);

  if (options.printConfig) {
    logger.log("\nOptions: ");
    logger.log({ ...DEFAULT_CONFIG, ...options });
  }

  return options;
}

function setLogLevel(verbosity: string | undefined) {
  process.env.SWA_CLI_DEBUG = verbosity;

  if (verbosity?.includes("silly")) {
    // When silly level is set,
    // propagate debugging level to other tools using the DEBUG environment variable
    process.env.DEBUG = "*";
  }
}

export function getUserOptions(command: Command) {
  const userOptions: OptionValues = {};
  const options = command.optsWithGlobals();

  for (const option in options) {
    // If the option is not found in the command context, it returns undefined
    // meaning that we have to find its source in the global context.
    const source = command.getOptionValueSource(option) || program.getOptionValueSource(option);

    if (source === "cli") {
      userOptions[option] = options[option as keyof SWACLIConfig];
    }
  }
  return userOptions as SWACLIConfig;
}

export function isUserOption(option: keyof SWACLIConfig): boolean {
  return userDefinedOptions[option] !== undefined;
}

export function isConfigFileOption(option: keyof SWACLIConfig): boolean {
  return configFileDefinedOptions[option] !== undefined;
}

export function isUserOrConfigOption(option: keyof SWACLIConfig): boolean {
  return isUserOption(option) || isConfigFileOption(option);
}
