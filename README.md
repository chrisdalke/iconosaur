# iconosaur

**`iconosaur` is a command-line tool to generate common favicons & web icon formats from a single high-resolution input.**

`iconosaur` takes in a single input image and generates a number of common image formats and resolutions for web apps, along with the HTML to include them in your webpage.

You can embed Iconosaur as part of your web project's workflow as a pre-build step, or run manually.

Iconosaur is *opinionated*: Instead of providing many options, we setup sane defaults that should be good enough for most projects.

```
iconosaur-cli icon.svg images
```

## Usage

1. Install

## Supports

- PNG or SVG Input Files
- Configurable output settings
  - Default output: All common Web, iOS, and Android icon sizes
  - Customizable outputs from a JSON config
- Automatic resizing & "best fit"
- Background color and alpha support

## Installation

Iconosaur requires Node.JS v19 or above.

#### To install globally:

`npm install -g iconosaur`

or

`npx iconosaur`

#### To install in your project:

`npm install --dev iconosaur`

## Usage

As a CLI:

```
iconosaur ./input.png --output ./dist/icons
```

As a pre-build step in your Javascript application:

Update your package.json to run iconosaur as a prebuild script.

```
{
    ...
    "prebuild": "iconosaur-cli <input> <output>",
}

```

For example, to take `./src/assets/img/icon.png` and produce icons in `public/icons/generated`:

```
iconosaur ./src/assets/img/icon.png ./public/icons/generated
```

To load these icons into your HTML, add these lines to your header:

```
<link rel="apple-touch-icon" sizes="180x180" href="/icons/generated/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/generated/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/generated/favicon-16x16.png">
<link rel="manifest" href="/icons/generated/site.webmanifest">
<link rel="mask-icon" href="/icons/generated/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">
```

To use a custom config:

```
iconosaur ./src/assets/img/icon.png ./public/icons/generated --config ./iconosaur-config.json
```

## Configuration API

## Inputs

## Outputs

## License

MIT
