#! /usr/bin/env node

import { program } from 'commander';
import { resolve } from 'path';
import fs from 'fs';
import { exit } from 'process';
import sharp from 'sharp';
import Values from 'values.js'
import crypto from 'crypto';
import Color from 'color';


program
  .name('iconosaur')
  .description('Command-line tool to generate common favicons & web icon formats.')
  .argument('<input>', 'Input image to process, any valid image format.')
  .option('--output [PATH]', 'Output folder to write images to.', './public/icons')
  .option('--prefix [PATH]', 'Prefix for all URLs in the HTML output.', '/')
  .option('--quiet', 'Do not display any output.')
  .option('--force', 'Write output even if files appear to not have changed.')

program.parse();
const options = program.opts();

const absInputPath = resolve(program.args[0]);
const absOutputPath = options.output;
const quiet = options.quiet;

function log(str) {
    if (quiet) {
        return;
    }

    console.log(str);
}

// Check that input is valid.
log(`\x1b[33mInput file: ${absInputPath}\x1b[0m`);
if (!fs.existsSync(absInputPath)|| !fs.lstatSync(absInputPath).isFile()) {
    log(`Input file does not exist!`);
    exit(1);
}

// Check that folder is valid.
log(`\x1b[33mOutput folder: ${absOutputPath}\x1b[0m`);
if (fs.existsSync(absOutputPath) && !fs.lstatSync(absOutputPath).isDirectory()) {
    log(`Output exists but is not a directory!`);
    exit(1);
}

// Create folder if it does not already exist.
if (!fs.existsSync(absOutputPath)) {
    fs.mkdirSync(absOutputPath, { recursive: true }); 
}

// job history file
const absJobLogPath = resolve(absOutputPath, '.iconosaur');
let absJobLog = null;
if (fs.existsSync(absJobLogPath)) {
    const absJobLogStr = fs.readFileSync(absJobLogPath);
    absJobLog = JSON.parse(absJobLogStr);
}

// Hash input file.
const hash = crypto.createHash('sha256');
const imageContents = fs.readFileSync(absInputPath);
hash.update(imageContents);
const hexHash = hash.digest('hex');

// Generate new job log JSON
const newJobLogJson = {
    timestamp: new Date().valueOf(),
    inputPath: absInputPath,
    outputPath: absOutputPath,
    urlPrefix: options.prefix,
    inputHash: hexHash
}

// Exit early if nothing appears to have changed.
try {
    if (absJobLog &&
        newJobLogJson.inputPath == absJobLog.inputPath &&
        newJobLogJson.outputPath == absJobLog.outputPath &&
        newJobLogJson.urlPrefix == absJobLog.urlPrefix &&
        newJobLogJson.inputHash == absJobLog.inputHash && 
        !options.force) {
        log('\x1b[33mNothing has changed, exiting early.\x1b[0m');
        exit(0);
    }
} catch (e) {}

// Write job log JSON.
fs.writeFileSync(absJobLogPath, JSON.stringify(newJobLogJson, null, 4), 'utf8');

// Static config
const config = [
    {
        name: "64x64 raster icon",
        filename: 'icon-64x64',
        fileFormat: 'png',
        width: 64,
        height: 64,
        margin: 0
    },
    {
        name: "Apple touch icon",
        filename: 'apple-touch-icon',
        fileFormat: 'png',
        width: 180,
        height: 180,
        margin: 0
    },
    {
        name: "16x16 favicon",
        filename: 'favicon-16x16',
        fileFormat: 'png',
        width: 16,
        height: 16,
        margin: 0
    },
    {
        name: "32x32 favicon",
        filename: 'favicon-32x32',
        fileFormat: 'png',
        width: 32,
        height: 32,
        margin: 0
    },
    {
        name: "96x96 favicon",
        filename: 'favicon-96x96',
        fileFormat: 'png',
        width: 96,
        height: 96,
        margin: 0
    }
]

// Generate all images
log('\x1b[33mGenerating icons:')
for (const outputConfig of config) {
    const {
        name,
        filename,
        fileFormat,
        width,
        height,
        margin
    } = outputConfig;
    let innerWidth = width;
    let innerHeight = height;
    if (margin !== undefined && (innerWidth - (margin*2)) > 0.0) {
        innerWidth = width - (margin*2);
    }
    if (margin !== undefined && (innerHeight - (margin*2)) > 0.0) {
        innerHeight = height - (margin*2);
    }

    if (innerWidth > width) {
        innerWidth = width;
    }
    if (innerHeight > height) {
        innerHeight = height;
    }

    const imageIn = await (sharp(absInputPath).png().resize(innerWidth,innerHeight)).toBuffer();

    await sharp({
        create: {
            width,
            height,
            channels: 4,
            background: {r: 255, g: 255, b: 255, alpha: 0}
        }
    }).png().resize(width,height).composite([
        { input: imageIn }
    ]).toFile(`${absOutputPath}/${filename}.${fileFormat}`);
    log(`\x1b[33m - ${name} (${filename}.${fileFormat}) \x1b[32m✓\x1b[0m`)
}

let prefix = options.prefix;
if (prefix.endsWith('/')) {
    prefix = prefix.slice(0,-1)
}

log('');
log('\x1b[33mIcon generation complete!\x1b[0m')
log('\x1b[33mAdd the following HTML snippet to your <head> block:\x1b[0m')
log(`\x1b[37m
<link rel="apple-touch-icon" sizes="180x180" href="${prefix}/apple-touch-icon.png" />
<link rel="icon" type="image/png" href="${prefix}/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/png" href="${prefix}/favicon-32x32.png" sizes="32x32" >
<link rel="icon" type="image/png" href="${prefix}/favicon-16x16.png" sizes="16x16" >
<link rel="manifest" href="${prefix}/site.webmanifest" />
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="theme-color" content="#ffffff">
\x1b[0m`);