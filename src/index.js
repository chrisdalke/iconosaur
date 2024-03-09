#! /usr/bin/env node

import { program } from 'commander';
import defaultConfig from "./default-config.js";
import { resolve } from 'path';
import fs from 'fs';
import { exit } from 'process';
import sharp from 'sharp';
import parseCSSColor from 'parse-css-color';
import Values from 'values.js'

program
  .name('iconosaur-cli')
  .description('Icon and image generation CLI for app developers.')
  .version('0.0.1')
  .argument('<input>', 'Input image to process, any valid image format.')
  .argument('<output>', 'Output folder to place generated images.')
  .option('--config <file>', 'Output configuration file.');


program.parse();

const absInputPath = resolve(program.args[0]);
const absOutputPath = resolve(program.args[1]);

console.log(`Input file: ${absInputPath}`);
if (!fs.existsSync(absInputPath)|| !fs.lstatSync(absInputPath).isFile()) {
    console.log(`Input file does not exist!`);
    exit(1);
}

console.log(`Output folder: ${absOutputPath}`);
if (!fs.existsSync(absOutputPath) || !fs.lstatSync(absOutputPath).isDirectory()) {
    console.log(`Output file does not exist or is not a directory!`);
    exit(1);
}

let config = defaultConfig;
if (program.options.config !== undefined) {
    const configFilePath = resolve(program.options.config);
    console.log(`Custom configuration file: ${configFilePath}`);
    if (!fs.existsSync(configFilePath) || !fs.lstatSync(configFilePath).isFile()) {
        console.log(`Config file does not exist!`);
        exit(1);
    }
    try {
        const data = fs.readFileSync(configFilePath, 'utf8');
        config = JSON.parse(data);
    } catch (err) {
        console.error(`Failed to read config file!`);
        console.error(err);
    }
}



for (const outputConfig of config) {
    console.log(JSON.stringify(outputConfig));
    const {
        filename,
        fileFormat,
        width,
        height,
        margin,
        background
    } = outputConfig;
    console.log(`Processing output: ${filename}`);
    const bgColor = new Values(background || 'rgba(255,255,255,1.0)');

    let innerWidth = width;
    let innerHeight = height;
    if (margin !== undefined && (innerWidth - (margin*2)) > 0.0) {
        innerWidth = width - (margin*2);
    }
    if (margin !== undefined && (innerHeight - (margin*2)) > 0.0) {
        innerHeight = height - (margin*2);
    }
    const imageIn = await (sharp(absInputPath).png().resize(innerWidth,innerHeight)).toBuffer();

    await sharp({
        create: {
            width,
            height,
            channels: 4,
            background: background|| 'rgba(255,255,255,1.0)'
        }
    }).png().resize(width,height).composite([
        { input: imageIn }
    ]).toFile(`${absOutputPath}/${filename}.${fileFormat}`);
}

// TODO: Attempt to load image 
// - validate image exists
// - validate image is an image

// TODO: Attempt to load config (or default if not specified)
// - validate JSON syntax

// TODO: Attempt to generate all outputs
// - loop through input configs
// - process image
// - generate image output

/**
 * Options
 * 
 * backgroundColor: rgba
 * filename:
 * fileFormat:
 * outputWidth: pixels
 * outputHeight: pixels
 * outputMargin: {
 *   type: percent | absolute
 *   value: ...
 * }
 * 
 * 
 * 
 */

