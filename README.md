# Foundry VTT Macros Repository

![Latest Release Download Count](https://img.shields.io/github/downloads/foundry-vtt-community/macros/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry_community_macros&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=foundry_community_macros) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffoundry-vtt-community%2Fmacros%2Fmaster%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) ![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffoundry-vtt-community%2Fmacros%2Fmaster%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge) [![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffoundry_community_macros%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/foundry_community_macros/) ![GitHub all releases](https://img.shields.io/github/downloads/foundry-vtt-community/macros/total?style=for-the-badge)

Foundry community-contributed macros are noted here and merged into the Foundry Community Macros module for ease of use.

> Macros may cause unintended side effects, such as issues with performance. Please read the comments in each macro to understand how it works before running!

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/foundry-vtt-community/macros/master/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### Usage as a Module

As GM go to the **Manage Modules** options menu in your **World Settings** tab then enable the **Foundry Community Macros** module.

This module adds all of the community macros as a Compendium Packs called **FVTT Community Macros**.

You can open these packs, right click and click on import the macros you want. You can then add these macros to the **Macro Toolbar** at the bottom of the screen.

### Usage without the Module:

1. Download the `.js` file to your machine
2. Create a new macro in Foundry VTT
3. Give it a name and set the **Type** to "Script"
4. Use a text editor, such as Notepad or vscode, to open the download `.js` file and copy the contents
5. Paste the contents into the **Command** section of the new macro
6. Click "Save Macro"
7. Celebrate 🎉

## Development/Contributing

To clone this repository, along with every macro in it, use the following command:

```
git clone https://github.com/foundry-vtt-community/macros.git
```

You can make pull requests to add or update macros here: [https://github.com/foundry-vtt-community/macros/pulls](https://github.com/foundry-vtt-community/macros/pulls)

1. Navigate to the directory where you wish to add your file
2. Click on add file at the top
3. Name your file with a `.js` ending and paste your content and save (add details in the description field of your `.js` file)
4. Save the file and then open a pull request (GitHub should walk you through these steps)

## How prepare the Build for the dynamic build action ?

To simplify the creation of packs with a github action activate during the creaion of the release we can use this method:

1. Go under a macros folder like `5e`
2. Choose a macro like `stealth_check.js` an create a new json file with the same base name `stealth_check.json`
3. Prepare a json structure for your macro entry:

Here a json example:

```json
{
  "name":"Stealth Check",
  "permission":{"default":0 },
  "type":"script",
  "flags":{},
  "scope":"global",
  "command":"", // HERE IS WHERE THE ACTION PROCESS WILL PUT THE TEXT OF THE MACRO
  "author":"",
  "img":"icons/svg/dice-target.svg",
  "actorIds":[],
  "_id":"2RitOkKtnQe9pbuF"  // THIS IS OPTIONAL BUT ESSENTIAL IF YOU WANT TO MAINTAIN THE REFERENCE OR NEDB WILL CREATE A NEW ONE
}
```

**Point 2 and 3 are optional** if no javascript file is founded we use the generic json model `generic_macro.json`, the '_id' attribute will be generated from the nedb library, here the example:

```json
{
  "name": "<NAME OF THE FILE MACRO JAVASCRIPT>",
  "permission":{"default":0 },
  "type":"script",
  "flags":{},
  "scope":"global",
  "command":"", // HERE IS WHERE THE ACTION PROCESS WILL PUT THE TEXT OF THE MACRO
  "author":"",
  "img":"icons/svg/dice-target.svg",
  "actorIds":[]
}
```

## Other macro repositories with some good macros from the community

- [Kekilla0 Personal-Macros](https://github.com/Kekilla0/Personal-Macros)
- [Otigon Foundry-Macros](https://github.com/otigon/Foundry-Macros)
- [MisterHims DnD5e-WildShape-Macro](https://github.com/MisterHims/DnD5e-WildShape-Macro)
- [Crymic foundry-vtt-macros](https://gitlab.com/crymic/foundry-vtt-macros)
- [Rinnocenti Personal-Macros](https://github.com/rinnocenti/Personal-Macros)
- [VanceCole macros](https://github.com/VanceCole/macros)
- [Unsoluble fvtt-macros](https://github.com/unsoluble/fvtt-macros)
- [flamewave000 fvtt-macros](https://github.com/flamewave000/fvtt-macros)
- [itamarcu foundry-macros](https://github.com/itamarcu/foundry-macros)
- [itamarcu shemetz-macros](https://github.com/itamarcu/shemetz-macros)
- [trioderegion fvtt-macros](https://github.com/trioderegion/fvtt-macros)
- [theripper93 FoundryVTT-Macro](https://github.com/theripper93/FoundryVTT-Macros)
- [Freeze020 foundry-vtt-scripts](https://gitlab.com/Freeze020/foundry-vtt-scripts)
- [Jeznar Utility-Macros](https://github.com/Jeznar/Utility-Macros)
- [Kuffeh1 Foundry](https://github.com/Kuffeh1/Foundry)
- [caewok Foundry-Macros](https://github.com/caewok/Foundry-Macros)
- [GeneralZero FounderyMacros](https://github.com/GeneralZero/FounderyMacros)
- [JamesBrandts FoundryVTT Macro](https://github.com/JamesBrandts/FoundryVTT)

# Build

## Install all packages

```bash
npm install
```
## npm build scripts

### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```
### lint and lintfix

`lint` launch the eslint process based on the configuration [here](./.eslintrc)

```bash
npm run-script lint
```

`lintfix` launch the eslint process with the fix argument

```bash
npm run-script lintfix
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### package

`package` generates a zip file containing the contents of the dist folder generated previously with the `build` command. Useful for those who want to manually load the module or want to create their own release

```bash
npm run-script package
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/foundry-vtt-community/macros/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This Foundry VTT module is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).
