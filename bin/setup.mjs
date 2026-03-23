#!/usr/bin/env node

import { createInterface } from "node:readline";
import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

function expandHome(p) {
  return p.startsWith("~/") ? join(homedir(), p.slice(2)) : p;
}

function green(s) { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s) { return `\x1b[33m${s}\x1b[0m`; }
function cyan(s) { return `\x1b[36m${s}\x1b[0m`; }
function dim(s) { return `\x1b[2m${s}\x1b[0m`; }

async function main() {
  console.log();
  console.log(cyan("  Kiro Memory — Setup"));
  console.log(dim("  Persistent memory for your Kiro assistant\n"));

  // 0. Check for kiro-cli
  try {
    execSync("which kiro-cli", { stdio: "ignore" });
  } catch {
    console.log(yellow("  ⚠ kiro-cli not found on your PATH."));
    console.log(`  Install it from: ${cyan("https://kiro.dev/docs/cli/install")}`);
    const cont = (await ask(`\n  Continue anyway? ${dim("(y/N)")}: `)).trim().toLowerCase();
    if (cont !== "y") {
      console.log(dim("\n  Setup cancelled. Install kiro-cli and try again.\n"));
      rl.close();
      return;
    }
  }

  // 1. Memory folder path
  const rawMemPath = (await ask(`  Memory folder path ${dim("(~/Memory)")}: `)).trim() || "~/Memory";
  const memPath = expandHome(rawMemPath);

  // 2. Create memory folder + subdirs
  const dirs = ["Work", "Technical", "Personal", "Reference", ".archive"];
  if (existsSync(memPath)) {
    console.log(yellow(`\n  ⚠ ${memPath} already exists — will copy missing template files.`));
  } else {
    mkdirSync(memPath, { recursive: true });
  }
  for (const d of dirs) {
    const dirPath = join(memPath, d);
    if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
  }

  // 3. Copy template files (skip existing)
  const templateDir = join(pkgRoot, "memory-template");
  copyDirSkipExisting(templateDir, memPath);
  console.log(green("\n  ✓ Memory folder ready at ") + memPath);

  // 4. Install skills
  const kiroSkillsDir = expandHome("~/.kiro/skills");
  mkdirSync(kiroSkillsDir, { recursive: true });

  const skills = ["load-memory", "update-memory"];
  const srcSkillsDir = join(pkgRoot, "skills");

  for (const skill of skills) {
    const dest = join(kiroSkillsDir, skill);
    if (existsSync(dest)) {
      const overwrite = (await ask(`  Skill "${skill}" already exists at ${dest}. Overwrite? ${dim("(y/N)")}: `)).trim().toLowerCase();
      if (overwrite !== "y") {
        console.log(dim(`  Skipped ${skill}`));
        continue;
      }
    }
    cpSync(join(srcSkillsDir, skill), dest, { recursive: true });

    // Patch <MEMORY_PATH> in SKILL.md
    const skillFile = join(dest, "SKILL.md");
    const content = readFileSync(skillFile, "utf-8");
    writeFileSync(skillFile, content.replace(/<MEMORY_PATH>/g, rawMemPath));
  }
  console.log(green("  ✓ Skills installed to ") + kiroSkillsDir + dim(` (memory path: ${rawMemPath})`));

  // 5. Knowledge base index type
  console.log();
  console.log(`  Knowledge Base index type:`);
  console.log(dim(`    1) Fast (Lexical — bm25)`));
  console.log(dim(`    2) Best (Semantic — all-minilm-l6-v2)`));
  const indexChoice = (await ask(`  Choose index type ${dim("(1/2, default: 2)")}: `)).trim() || "2";
  const indexType = indexChoice === "1" ? "Fast" : "Best";

  const cliSettingsPath = expandHome("~/.kiro/settings/cli.json");
  let cliSettings = {};
  if (existsSync(cliSettingsPath)) {
    cliSettings = JSON.parse(readFileSync(cliSettingsPath, "utf-8"));
  } else {
    mkdirSync(dirname(cliSettingsPath), { recursive: true });
  }
  cliSettings["knowledge.indexType"] = indexType;
  writeFileSync(cliSettingsPath, JSON.stringify(cliSettings, null, 2) + "\n");
  console.log(green(`  ✓ Index type set to ${indexType}`));

  // 6. Create agent
  const agentName = (await ask(`\n  Agent name ${dim("(mnemo)")}: `)).trim() || "mnemo";
  const agentsDir = expandHome("~/.kiro/agents");
  mkdirSync(agentsDir, { recursive: true });

  const agentFile = join(agentsDir, `${agentName}.json`);
  const agentExists = existsSync(agentFile);

  if (agentExists) {
    const overwrite = (await ask(`  Agent "${agentName}" already exists. Overwrite? ${dim("(y/N)")}: `)).trim().toLowerCase();
    if (overwrite !== "y") {
      console.log(dim(`  Skipped agent creation`));
    } else {
      writeAgentConfig(agentFile, agentName);
    }
  } else {
    writeAgentConfig(agentFile, agentName);
  }

  // 7. Done
  console.log();
  console.log(cyan("  All set! Start chatting:"));
  console.log(dim(`  kiro-cli chat --agent ${agentName} --trust-all-tools`));
  console.log();
  console.log(cyan("  Try it out:"));
  console.log(dim(`  Ask: I am <Your Name>, remember`));
  console.log();

  rl.close();
}

function writeAgentConfig(filePath, name) {
  const config = {
    name,
    description: "Kiro Memory — persistent context across sessions",
    prompt: null,
    mcpServers: {},
    tools: ["*"],
    toolAliases: {},
    allowedTools: [],
    resources: [
      "skill://~/.kiro/skills/load-memory/SKILL.md",
      "skill://~/.kiro/skills/update-memory/SKILL.md"
    ],
    hooks: {},
    toolsSettings: {},
    includeMcpJson: false,
    model: null
  };
  writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n");
  console.log(green(`  ✓ Agent "${name}" created at `) + filePath);
}

function copyDirSkipExisting(src, dest) {
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      if (!existsSync(destPath)) mkdirSync(destPath, { recursive: true });
      copyDirSkipExisting(srcPath, destPath);
    } else if (!existsSync(destPath)) {
      cpSync(srcPath, destPath);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
