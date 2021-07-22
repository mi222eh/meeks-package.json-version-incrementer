#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs/yargs"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
const incrementTypeList = [
    "major",
    "minor",
    "patch",
];
const args = yargs_1.default(process.argv.slice(2))
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
    const type = args.type;
    const packageJsonPath = path_1.default.join(dir, "package.json");
    const fileExists = await fs_extra_1.default.pathExists(packageJsonPath);
    if (!fileExists) {
        console.error("Package json does not exist in");
        console.error(dir);
        return;
    }
    const json = await fs_extra_1.default.readJSON(packageJsonPath);
    const versionString = json.version;
    const numberStringList = versionString.split(".");
    let indexNumberToIncrease;
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
    numberStringList[indexNumberToIncrease] = (Number(numberStringList[indexNumberToIncrease]) + stepSize).toString();
    json.version = numberStringList.join(".");
    await fs_extra_1.default.writeFile(packageJsonPath, JSON.stringify(json, null, 4));
})();
