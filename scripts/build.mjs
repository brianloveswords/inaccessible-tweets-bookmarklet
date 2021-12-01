#!/usr/bin/env node

// @ts-check

import esbuild from "esbuild";
import { findUpSync } from "find-up";
import { join, dirname } from "path";
import { readFileSync, writeFileSync } from "fs";

function main() {
    const REPLACEMENT = "%%%JS%%%";

    let root = dirname(findUpSync("package.json"));
    let template = readFileSync(join(root, "resources", "README.tpl.md"), "utf8");
    let srcFile = join(root, "src", "bookmarklet.js");
    let originalSource = readFileSync(srcFile, "utf8");
    let source = esbuild.transformSync(originalSource, { minify: true });

    if (source.warnings.length > 0) {
        console.error("oh no: " + JSON.stringify(source.warnings));
        process.exit(1);
    }

    let minified = source.code.replace(/\n/g, "").trim();
    let result = template.replace(REPLACEMENT, minified);
    writeFileSync(join(root, "README.md"), result);
}

main();
