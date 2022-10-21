# Foundry VTT Macros Repository

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ffoundry-vtt-community%2Fmacros%2Fmaster%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry_community_macros&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=foundry_community_macros) 
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffoundry_community_macros%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/foundry_community_macros/)

Foundry community-contributed macros are noted here and merged into the Foundry Community Macros module for ease of use.

> Macros may cause unintended side effects, such as issues with performance. Please read the comments in each macro to understand how it works before running!

## Installation

### Usage as a Module

You can now install this module automatically by specifying the following public module URL : 

`https://raw.githubusercontent.com/foundry-vtt-community/macros/main/module.json`

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
