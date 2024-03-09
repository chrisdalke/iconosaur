# iconosaur-cli

The Iconosaur CLI is an icon &amp; image generation CLI for app developers.

`iconosaur` is designed to be embedded into your
app development workflow step as a pre-build step, but can also be run as a standalone tool.

`iconosaur` takes an input image and configuration file, and generates a number of common iOS, Android, and web application images: Thumbnails, app icons, social graph icons, etc.

See Supported Outputs for a list of available output types.

## Supports

- Input files
- Varied resolution output files
- Automatic resizing & "best fit"
- background

## Installation

Iconosaur requires Node.JS v19 or above.

`npm install -g iconosaur`

or

`npx iconosaur`

## Usage

As a CLI:

```
iconosaur --input ./input.png --config config.json --output ./dist/icons
```

As a pre-build step in your Javascript application:

Update your package.json to run iconosaur as a prebuild script.

```
{
    ...
    "prebuild": "iconosaur-cli <input> <output>",
}

```

## Configuration API

## Inputs

## Outputs

## License

MIT
