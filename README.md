# Heroes 3 .lod archives extractor

⚠️Work in progress⚠️

Node.js script converts HoMM 3 [.lod](http://mmgames.ru/index.php?option=com_content&view=article&id=108&Itemid=200&lang=ru) archives to set of pictures and spritesheets.

## Install
```
npm install
```
## Usage

#### List of all files from archive
```
npm run extract -- --input=test/h3sprite.lod
```

#### List of all files from archive with filter by name
```
npm run extract -- --input=test/h3sprite.lod --filter=spell
```

#### Extract files to specific folder
```
yarn extract --input=test/h3sprite.lod --output=test/out
```

#### Extract files using filter for input names
```
yarn extract --input=test/h3sprite.lod --filter=spell --output=test/out
```

#### Extract files using filter for output names
```
yarn extract --input=test/h3sprite.lod --outputFilter=\\.json --output=test/out
```
To get all necessary pictures you need to pass all *.lod files from original Heroes 3 repositories.

It's not a utility convertor for all files. It makes files that can be useful in web development purposes, png, webp and ico files sorted by folders.

I maintain it to make assets for my [HoMM 3 in browser project](homm.lekzd.ru).

## Needs to be done
- [ ] webp files
- [ ] list of all textures with sizes in JSON
- [x] export animations on spritesheets in JSON
- [ ] export cursors