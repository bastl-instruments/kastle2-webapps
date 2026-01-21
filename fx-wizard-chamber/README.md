# FX Wizard Chamber

Rhythms editor.

## Available here
[FX Wizard Chamber Web App](http://apps.bastl-instruments.com/fx-wizard-chamber/)

## Parameters
 - `advanced=1` enables "advanced mode" by default (BIN download and other goodies)
 - `no-intro=1` disables intro dialog (and default preset load)
 - `log=debug` displays all debug messages in dev console

## Cheats

Just type in anywhere.

 - `idkfa` Advanced mode

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
Copy contents of `dist` to an FTP server into subfolder `fx-wizard-chamber` (needs to match value in `vite.config.js`).

## Credits

**Code**   
Václav Mach ([@xx0x](https://github.com/xx0x))

**Visuals**  
Anymade Studio

## License

MIT