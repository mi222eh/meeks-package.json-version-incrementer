#! /usr/bin/env node
import yargs from "yargs/yargs";
import fs from "fs-extra";
import path from "path";

type IncrementType = "major" | "minor" | "patch";

const incrementTypeList: ReadonlyArray<IncrementType> = [
  "major",
  "minor",
  "patch",
];

const args = yargs(process.argv.slice(2))
  .option("type", {
    choices: incrementTypeList,
    alias: "t",
    default: "patch",
    describe: "The type of version to increase",
    type: "string",
  })
  .option("step", {
    alias: "s",
    default: 1,
    type: "number",
    desc: "The version step size",
  })
  .option("directory", {
    alias: "d",
    default: process.cwd(),
    type: "string",
    desc: "the directory where the package.json is located",
  })
  .help("h", "Show help", false)
  .parseSync();

if (args.step <= 0) {
  throw new Error("Step cannot be less than 1");
}

(async function () {
  const dir = args.directory;
  const stepSize = args.step;
  const type = args.type as IncrementType;

  const packageJsonPath = path.join(dir, "package.json");

  const fileExists = await fs.pathExists(packageJsonPath);
  if (!fileExists) {
    console.error("Package json does not exist in");
    console.error(dir);
    return;
  }
  const json = await fs.readJSON(packageJsonPath);

  const versionString = json.version as string;
  const numberStringList = versionString.split(".");
  let indexNumberToIncrease: number;

  switch (type) {
    case "major":
      indexNumberToIncrease = 0;
      break;
    case "minor":
      indexNumberToIncrease = 1;
      break;
    case "patch":
      indexNumberToIncrease = 2;
      break;
    default:
      console.error("Incorrect trype specified");
      return;
  }
  //   increase the number!
  numberStringList[indexNumberToIncrease] = (
    Number(numberStringList[indexNumberToIncrease]) + stepSize
  ).toString();

  json.version = numberStringList.join(".");

  await fs.writeFile(packageJsonPath, JSON.stringify(json, null, 4));

  console.log("Version increased to");
  console.log(json.version);
})();
