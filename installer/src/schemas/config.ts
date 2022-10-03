import * as z from "https://deno.land/x/zod@v3.19.1/mod.ts";

export const configSchema = z.object({
  sudoPassword: z.string().optional(),
  packageManagers: z.array(
    z.object({
      name: z.string(),
      command: z.string(),
      isSingleCommand: z.boolean().default(true),
      args: z.array(z.string()),
      packages: z.array(z.string()),
      preInstall: z.array(z.string()).optional(),
      postInstall: z.array(z.string()).optional(),
    }),
  ),
  gitProjects: z.array(
    z.object({
      cwd: z.string(),
      repositories: z.array(
        z.string().or(z.object({
          "name": z.string(),
          "folder": z.string(),
        })),
      ),
    }),
  ),
  customCommands: z.array(
    z.object({
      name: z.string(),
      commands: z.array(z.string()),
    }),
  ),
  copier: z.object({
    configDir: z.string(),
  }),
}).strict().refine((schema) =>
  schema.packageManagers.reduce(
        (prev, curr) => curr.command.includes("sudo") ? prev + 1 : prev,
        0,
      ) > 0 && !schema.sudoPassword
    ? false
    : true, {
  message:
    "sudoPassword is required when one of the package managers needs sudo to run",
});
