# iconosaur

**`iconosaur` is a command-line tool to generate common favicons & web icon formats from a single high-resolution input.**

`iconosaur` takes in a single input image and generates a number of common image formats and resolutions for web apps, along with the HTML to include them in your webpage.

You can embed Iconosaur as part of your web project's workflow as a pre-build step, or run manually.

Iconosaur is *opinionated*: Instead of providing detailed options, we setup sane defaults that should be good enough for most projects.

## Usage

### 1. Installation

Install the package globally from npm:
```
npm install -g iconosaur
```

Or as a development dependency:
```
npm install --dev iconosaur
```

### 2. Run Manually

To run iconosaur, invoke the CLI with the path to your input image:

```
> iconosaur ./input.png
```

Iconosaur will generate all icons and will print the suggested HTML to add to the head of your HTML file. Once you have added the HTML manually, you do not need to repeat this step.

### 3. Run as a Pre-Build step

It may be useful to run iconosaur as a pre-built step, so when you change your icon file, all resolutions are automatically updated.

Update your package.json to run iconosaur as a prebuild script.

```
{
    ...
    "build": "<your build stage>",
    "prebuild": "iconosaur-cli <input> --quiet"
}
```

Before your `build` stage runs, npm will run `prebuild`, triggering iconosaur to generate new icons. Icon regeneration will be skipped if the contents of the input image have not changed.

## Command-Line Options

Use the `--help` flag to see all options:

```
> iconosaur --help

Usage: iconosaur [options] <input>

Command-line tool to generate common favicons & web icon formats.

Arguments:
  input            Input image to process, any valid image format.

Options:
  --output [PATH]  Output folder to write images to. (default: "./public/icons")
  --prefix [PATH]  Prefix for all URLs in the HTML output. (default: "/")
  --quiet          Do not display any output.
  --force          Write output even if files appear to not have changed.
  -h, --help       display help for command
```

## Outputs

`iconosaur` will write the following outputs under the output folder:

- `apple-touch-icon.png`: Apple touch icon, 
- `favicon-96x96.png`:  Browser favicon, 96x96px.
- `favicon-32x32.png`:  Browser favicon, 32x32px.
- `favicon-16x16.png`:  Browser favicon, 16x16px.
- `site.webmanifest`: Web app manifest for progressive web apps.
- `web-app-manifest-192x192.png`: Icon included by web app manifest.
- `web-app-manifest-512x512.png`: Icon included by web app manifest.
- `icon-32x32.png`: General-purpose 32x32px icon.
- `icon-64x64.png`: General-purpose 64x64px icon.
- `icon-128x128.png`: General-purpose 128x128px icon.
- `icon-256x256.png`: General-purpose 256x256px icon.
- `icon-512x512.png`: General-purpose 512x512px icon.