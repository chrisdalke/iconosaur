#! /usr/bin/env node

import { program } from 'commander';
import { resolve } from 'path';
import fs from 'fs';
import { exit } from 'process';
import sharp from 'sharp';
import crypto from 'crypto';

program
  .name('iconosaur')
  .description('Command-line tool to generate common favicons & web icon formats.')
  .argument('<input>', 'Input image to process, any valid image format.')
  .option('--output [PATH]', 'Output folder to write images to.', './public/icons')
  .option('--prefix [PATH]', 'Prefix for all URLs in the HTML output.', '/icons')
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
// log(`\x1b[33mInput file: ${absInputPath}\x1b[0m`);
if (!fs.existsSync(absInputPath)|| !fs.lstatSync(absInputPath).isFile()) {
    log(`\x1b[31miconosaur: Input file does not exist!\x1b[0m`);
    exit(1);
}

// Check that folder is valid.
// log(`\x1b[33mOutput folder: ${absOutputPath}\x1b[0m`);
if (fs.existsSync(absOutputPath) && !fs.lstatSync(absOutputPath).isDirectory()) {
    log(`\x1b[31miconosaur: Output exists but is not a directory!\x1b[0m`);
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
    },
    {
        name: "192x192 web manifest icon",
        filename: 'web-app-manifest-192x192',
        fileFormat: 'png',
        width: 192,
        height: 192,
        margin: 0
    },
    {
        name: "512x512 web manifest icon",
        filename: 'web-app-manifest-512x512',
        fileFormat: 'png',
        width: 512,
        height: 512,
        margin: 0
    },
    {
        name: "32x32 general purpose image",
        filename: 'icon-32x32',
        fileFormat: 'png',
        width: 32,
        height: 32,
        margin: 0
    },
    {
        name: "64x64 general purpose image",
        filename: 'icon-64x64',
        fileFormat: 'png',
        width: 64,
        height: 64,
        margin: 0
    },
    {
        name: "128x128 general purpose image",
        filename: 'icon-128x128',
        fileFormat: 'png',
        width: 128,
        height: 128,
        margin: 0
    },
    {
        name: "256x256 general purpose image",
        filename: 'icon-256x256',
        fileFormat: 'png',
        width: 256,
        height: 256,
        margin: 0
    },
    {
        name: "512x512 general purpose image",
        filename: 'icon-512x512',
        fileFormat: 'png',
        width: 512,
        height: 512,
        margin: 0
    },
]

// Generate all images
log('\x1b[33mGenerating ' + config.length + ' icons:\n')
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
    log(`\x1b[37m - ${name} (${filename}.${fileFormat}) \x1b[32m✓\x1b[0m`)
}

let projectName = 'site';

let prefix = options.prefix;
if (prefix.endsWith('/')) {
    prefix = prefix.slice(0,-1)
}

try {
    if (fs.existsSync('package.json')) {
        const packageJsonStr = fs.readFileSync('package.json');
        const packageJsonContents = JSON.parse(packageJsonStr);
        projectName = packageJsonContents.name;
    }
} catch (e) {}

fs.writeFileSync(`${absOutputPath}/site.webmanifest`, JSON.stringify({
    "name": projectName,
    "short_name": projectName,
    "icons": [
      {
        "src": prefix + "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": prefix + "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}, null, 4), 'utf8');

log('');
log('\x1b[33mIcon generation complete! Add the following HTML to your <head> block:\x1b[0m')
log(`\x1b[37m
<link rel="apple-touch-icon" sizes="180x180" href="${prefix}/apple-touch-icon.png" />
<link rel="icon" type="image/png" href="${prefix}/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/png" href="${prefix}/favicon-32x32.png" sizes="32x32" >
<link rel="icon" type="image/png" href="${prefix}/favicon-16x16.png" sizes="16x16" >
<link rel="manifest" href="${prefix}/site.webmanifest" />
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="theme-color" content="#ffffff">
\x1b[0m`);