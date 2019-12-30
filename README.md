# Heroes 3 .lod archives extractor

⚠️Work in progress⚠️

Node.js script converts HoMM 3 [.lod](http://mmgames.ru/index.php?option=com_content&view=article&id=108&Itemid=200&lang=ru) archives to set of pictures and spritesheets.

## Install
```
npm install
```
## Usage
```
node --experimental-modules index.mjs --input=test/h3sprite.lod --output=test/out
```
To get all nescessary pictures you need to pass all *.lod files from original Heroes 3 repository.

It's not a utility convertor for all files. It makes files that can be usefull in web development purposes, png, webp and ico files sorted by folders.

I maintain it to make assets for my [HoMM 3 in browser project](homm.lekzd.ru).

## Needs to be done
- [ ] webp files
- [ ] list of all textures with sizes in JSON
- [ ] export animations on spritesheets in JSON
- [ ] export cursors