# Wave Bard Sample Loader

Supports presets, automatic audio conversion, audio processing etc.

## Available here
[Wave Bard Sample Loader Web App](http://apps.bastl-instruments.com/wave-bard-sample-loader/)

## Parameters
 - `advanced=1` enables "advanced mode" by default (BIN download and other goodies)
 - `no-intro=1` disables intro dialog (and default preset load)
 - `log=debug` displays all debug messages in dev console

## How to add firmwares/presets

Add the required files into `public/firmwares` and `public/presets`.

Edit `public/firmwares.json` and `public/presets.json` and copy it to the server (you don't have to rebuild the app itself). Always keep one as the default, otherwise it won't work.

## How to add cheat presets

Add them to `xeatPresets.js`. App must be rebuild afterwards, because these are hardcoded to stay out of sight.

## Cheats

Just type in anywhere.

 - `idkfa` Advanced mode
 - `7653` Glazmo Drums Bank by Oliver Torr
 - `bkastledrum` Kastle Drum Bank

## How to build the app

Written in JavaScript using React and Vite. 

```
npm install 
npm run dev
```

## How to deploy

No automatic deployment.

```
npm run build
```
Copy contents of `dist` to an FTP server into subfolder `wave-bard-sample-loader` (needs to match value in `vite.config.js`).

## Credits

**Code**   
Václav Mach ([@xx0x](https://github.com/xx0x))

**Visuals**  
Anymade Studio

## License

**Code**  
MIT license

**Documentation**  
CC BY SA 4.0 license

**Graphic elements (logo and other visuals)**  
All rights reserved

**Samples (public/presets/...)**  
All rights reserved