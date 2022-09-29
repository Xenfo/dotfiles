import { exec } from "https://deno.land/x/denoexec@v1.1.5/mod.ts";

import { config, Logger, NullStream } from "../util/mod.ts";

const instructionsFilename = "instructions.sh";

const replaceSudo = (commands: string[]) => {
  return commands.map((command) => {
    return command.replace("sudo", `echo ${config.sudoPassword} | sudo -S`);
  });
};

const createInstructionsFile = async (instructions: string[]) => {
  await Deno.writeTextFile(
    instructionsFilename,
    ["#!/usr/bin/env bash", "", ...instructions, ""].join("\n"),
    {
      mode: 0o755,
    },
  );
};

export const runPackageManagerTasks = async () => {
  const nullStream = new NullStream();

  for await (const pm of config.packageManagers) {
    const instructions: string[] = [];

    if ((pm.preInstall?.length ?? 0) > 0) {
      instructions.push(...replaceSudo(pm.preInstall ?? []));
    }

    if (pm.isSingleCommand) {
      instructions.push(
        replaceSudo([
          pm.command,
          ...pm.args,
          ...pm.packages,
        ]).join(" "),
      );
    } else {
      pm.packages.forEach((pkg) => {
        instructions.push(
          replaceSudo([
            pm.command,
            ...pm.args,
            pkg,
          ]).join(" "),
        );
      });
    }

    if ((pm.postInstall?.length ?? 0) > 0) {
      instructions.push(...replaceSudo(pm.postInstall ?? []));
    }

    await createInstructionsFile(instructions);
    await exec({ cmd: [`./${instructionsFilename}`], stdout: nullStream });
    Logger.success(
      `Installed ${pm.name} packages`,
    );
  }

  await Deno.remove(instructionsFilename);
};