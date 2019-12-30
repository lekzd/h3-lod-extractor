
import path from "path";
import {getFileListFromArchives} from "./modules/getFileListFromArchives";
import {getPalettes} from "./modules/getPalettes";
import {SpriteMaker} from "./convertors/SpriteMaker";
import {logger} from "./modules/logger";
import {argvOptions} from "./modules/argvOptions";

process.on('uncaughtException', function(err) {
    console.log('[Error:]: ' + err);
});

async function main() {
    if (!argvOptions.input) {
        throw Error('No --input parameter specified!');
    }

    logger.startZone('LOD files');

    const filesMap = await getFileListFromArchives(argvOptions.input);
    // const palettesMap = getPalettes(filesMap);


    if (argvOptions.search) {
        const searchReg = new RegExp(argvOptions.search, 'ig');
        const results = [
            ...filesMap.keys()
        ]
        .filter(name => searchReg.test(name));

        console.log(results);

        return;
    }


    if (!argvOptions.output) {
        throw Error('No --output parameter specified!');
    }

    logger.endZone('LOD files');

    const spriteMaker = new SpriteMaker(filesMap);

    logger.startZone('sprite maker');

    spriteMaker
    
        // MAP BOATS
        .spriteDEF({
            regExp: /^ab0(\d)_\.def$/,
            width: 9,
            outFile: path.join(argvOptions.output, `objects/boats/boat_$1.png`)
        })

        // MAP HEROES
        .spriteDEF({
            regExp: /^ah(\d\d)_\.def$/,
            width: 9,
            outFile: path.join(argvOptions.output, `objects/heroes/animated_$1.png`)
        })
        .spriteDEF({
            regExp: /^af(\d\d)\.def$/,
            width: 9,
            outFile: path.join(argvOptions.output, `objects/heroes/flag_$1.png`)
        })
        .spriteDEF({
            regExp: /^(ah(\d\d)_e|ahrandom)\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/heroes/$1.png`)
        })

        // MAP TREASURES
        .spriteDEF({
            regExp: /^ava0(\d\d\d)\.def$/,
            width: 8,
            outFile: path.join(argvOptions.output, `objects/treasures/ava0$1.png`)
        })
        .spriteDEF({
            regExp: /^avasurv0\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/treasures/avasurv0.png`)
        })
        .spriteDEF({
            regExp: /^avawre20\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/treasures/avawre20.png`)
        })
        .spriteDEF({
            regExp: /^avawrek0\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/treasures/avawrek0.png`)
        })
        .spriteDEF({
            regExp: /^avt(\w{5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/treasures/avt$1.png`)
        })

        // MAP TOWNS
        .spriteDEF({
            regExp: /^avc([a-z]{4})0\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/towns/avc$1.png`)
        })

        // MAP DWELLINGS
        .spriteDEF({
            regExp: /^avg(\w{4,5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/dwellings/avg$1.png`)
        })
        

        // MAP VISITABLE
        .spriteDEF({
            regExp: /^avs(\w{4,5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/visitable/avs$1.png`)
        })
        .spriteDEF({
            regExp: /^avt(\w{4})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/visitable/avt$1.png`)
        })
        .spriteDEF({
            regExp: /^avx(\w{4})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/visitable/avx$1.png`)
        })
        .spriteDEF({
            regExp: /^avx(\w{5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/visitable/avx$1.png`)
        })
        .spriteDEF({
            regExp: /^avc([a-z]{3}\d\d)\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/visitable/avc$1.png`)
        })

        // MAP MINES
        .spriteDEF({
            regExp: /^avm(\w{4,5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/mines/avm$1.png`)
        })

        // MAP CREATURES
        .spriteDEF({
            regExp: /^avw([a-z]{4}\d?)\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/creatures/avw$1.png`)
        })

        // MAP HIDDEN
        .spriteDEF({
            regExp: /^avw(mon(\d))\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/hidden/avw$1.png`)
        })
        .spriteDEF({
            regExp: /^avz(\w{5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/hidden/avz$1.png`)
        })
        .spriteDEF({
            regExp: /^avr(\w{4,5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/hidden/avr$1.png`)
        })
        .spriteDEF({
            regExp: /^avara?nd(\d?)\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/hidden/avarand$1.png`)
        })

        // MAP MISC
        .spriteDEF({
            regExp: /^((\w{3})delt\d)\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/$1.png`)
        })
        .spriteDEF({
            regExp: /^avl(\w{4,5})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/avl$1.png`)
        })

        // MAP EXTRA TERRAINS
        .spriteDEF({
            regExp: /^avx(\w{3})\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `objects/terrains/avx$1.png`)
        })

        // UI
        .spritePCX({
            regExp: /^adopflg[\w\d]+\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/playerflag.png`)
        })
        .spriteDEF({
            regExp: /^adag\.def$/,
            width: 8,
            outFile: path.join(argvOptions.output, `ui/sprites/patharrow.png`)
        })

        // UI PORTRAITS
        .spriteDEF({
            regExp: /^bores\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/resources/lg.png`)
        })
        .spriteDEF({
            regExp: /^cprsmall\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/creatures/sm.png`)
        })

        // BATTLE EFFECTS
        .spriteDEF({
            regExp: /^c(\d{2})sp(\w+)\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `battle/effects/c$1sp$2.png`)
        })
        .spriteDEF({
            regExp: /^(sp(\d{2})_\w)?\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `battle/effects/$1.png`)
        })

        // BATTLE HEROES
        .spriteDEF({
            regExp: /^ch(\d{2,3})\.def$/,
            width: 8,
            outFile: path.join(argvOptions.output, `battle/heroes/hero_$1.png`)
        })

        // BATTLE BACKGROUNDS
        .separatePCXFiles({
            regExp: /^(cmbk(\w{2,4}))\.pcx$/,
            outFile: path.join(argvOptions.output, `battle/backgrounds/$2.png`)
        })
        
        // TERRAIN
        .spriteDEF({
            regExp: /^([a-z]{3})rvr\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `terrain/rivers/river_$1.png`)
        })
        .spriteDEF({
            regExp: /^(cobb|dirt|grav)rd\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `terrain/roads/road_$1.png`)
        })
        .spriteDEF({
            regExp: /^([a-z]{4})tl\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `terrain/tiles_$1.png`)
        })
        .spriteDEF({
            regExp: /^(edg)\.def$/,
            width: 5,
            outFile: path.join(argvOptions.output, `terrain/edge.png`),
            order: [
                0, 1, 2, 3, 17,
                4, 5, 6, 7, 18,
                30,31,32,33,19,
                34,35, 0, 1,20,
                8, 9, 0, 0, 26,
                12,10,0, 0, 27,
                13,14,15,16,28,
                21,23,24,25,29,
            ],
        })

        // UI RIGHT PANEL
        .spriteDEF({
            regExp: /^imana\.def$/,
            width: 26,
            outFile: path.join(argvOptions.output, `ui/rightpanel/manapoints.png`)
        })
        .spriteDEF({
            regExp: /^imobil\.def$/,
            width: 26,
            outFile: path.join(argvOptions.output, `ui/rightpanel/movepoints.png`)
        })
        .spriteDEF({
            regExp: /^newday\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/new_day.png`)
        })
        .spriteDEF({
            regExp: /^iam000\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/herobtn.png`)
        })
        .spriteDEF({
            regExp: /^iam001\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/dayendbtn.png`)
        })
        .spriteDEF({
            regExp: /^iam002\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/citybtn.png`)
        })
        .spriteDEF({
            regExp: /^iam003\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/toplevelbtn.png`)
        })
        .spriteDEF({
            regExp: /^iam004\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/schedulebtn.png`)
        })
        .spriteDEF({
            regExp: /^iam005\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/sleepbtn.png`)
        })
        .spriteDEF({
            regExp: /^iam006\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/gobtn.png`)
        })
        .spriteDEF({
            regExp: /^iam007\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/magicbtn.png`)
        })
        .spriteDEF({
            regExp: /^iam008\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/functionbtn.png`)
        })
        .spriteDEF({
            regExp: /^iam009\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/systembtn.png`)
        })
        .spriteDEF({
            regExp: /^iam010\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/bottomlevelbtn.png`)
        })
        .spriteDEF({
            regExp: /^iam011\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/wakebtn.png`)
        })
        .spriteDEF({
            regExp: /^iam011\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/wakebtn.png`)
        })
        .spritePCX({
            regExp: /^aishield\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/rightpanel/aishield.png`)
        })

        // UI MODALS
        .spritePCX({
            regExp: /^diboxbck\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/panelbg.png`)
        })
        .spritePCX({
            regExp: /^adstatcs\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/town/modal.png`)
        })
        .spritePCX({
            regExp: /^adstathr\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/hero/modal.png`)
        })
        .spritePCX({
            regExp: /^heroscr4\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/hero/bg.png`)
        })
        .spritePCX({
            regExp: /^spelback\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/spellbook/modal.png`)
        })
        .spritePCX({
            regExp: /^speltrnl\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/spellbook/corner_l.png`)
        })
        .spritePCX({
            regExp: /^speltrnr\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/spellbook/corner_r.png`)
        })
        .spritePCX({
            regExp: /^(tb[a-z]{2})back\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/town/bg.png`)
        })
        .spritePCX({
            regExp: /^townscrn\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/town/footer.png`)
        })
        .spritePCX({
            regExp: /^adstatcs\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/town/modal.png`)
        })
        .spritePCX({
            regExp: /^adstathr\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/hero/modal.png`)
        })
        .spritePCX({
            regExp: /^tptavern\.pcx$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/modal/tavern/modal.png`)
        })

        // UI PORTRAITS
        .spriteDEF({
            regExp: /^artifact\.def$/,
            width: 9,
            outFile: path.join(argvOptions.output, `ui/portraits/artifacts/md.png`)
        })
        .spriteDEF({
            regExp: /^artifbon\.def$/,
            width: 9,
            outFile: path.join(argvOptions.output, `ui/portraits/artifacts/lg.png`)
        })
        .spritePCX({
            regExp: /^hpl[\w\d]+\.pcx$/,
            width: 8,
            outFile: path.join(argvOptions.output, `ui/portraits/hero/md.png`)
        })
        .spritePCX({
            regExp: /^hps[\w\d]+\.pcx$/,
            width: 8,
            outFile: path.join(argvOptions.output, `ui/portraits/hero/sm.png`)
        })
        .spriteDEF({
            regExp: /^secsk32\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/skills/sm.png`)
        })
        .spriteDEF({
            regExp: /^secsk82\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/skills/lg.png`)
        })
        .spriteDEF({
            regExp: /^secskill\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/skills/md.png`)
        })
        .spriteDEF({
            regExp: /^smalres\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/resources/sm.png`)
        })
        .spriteDEF({
            regExp: /^resour82\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/resources/lg.png`)
        })
        .spriteDEF({
            regExp: /^resource\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/resources/md.png`)
        })
        .spriteDEF({
            regExp: /^pskil32\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/primary/sm.png`)
        })
        .spriteDEF({
            regExp: /^pskill\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/primary/xlg.png`)
        })
        .spriteDEF({
            regExp: /^pskilbon\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/primary/lg.png`)
        })
        .spriteDEF({
            regExp: /^pskil42\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/primary/md.png`)
        })
        .spriteDEF({
            regExp: /^itpa\.def$/,
            width: 4,
            outFile: path.join(argvOptions.output, `ui/portraits/castles/sm.png`)
        })
        .spriteDEF({
            regExp: /^itpt\.def$/,
            width: 4,
            outFile: path.join(argvOptions.output, `ui/portraits/castles/lg.png`)
        })
        .spriteDEF({
            regExp: /^scnrstar\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/start_bonus.png`)
        })
        .spriteDEF({
            regExp: /^scnrvict\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/victory_conditions.png`)
        })
        .spriteDEF({
            regExp: /^scnrloss\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/lose_conditions.png`)
        })
        .spriteDEF({
            regExp: /^scselc\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `ui/portraits/versions.png`)
        })

        // TOWNS
        .spriteDEF({
            regExp: /^(tb(\w)(\w{4,5}))\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `towns/$2/buildings/$1.png`)
        })
        .separatePCXFiles({
            regExp: /^(bo(\w)(\w{4,5}))\.pcx$/,
            outFile: path.join(argvOptions.output, `towns/$2/portraits/$1.png`)
        })
        .separatePCXFiles({
            regExp: /^(crbkg(\w)(\w{2}))\.pcx$/,
            outFile: path.join(argvOptions.output, `towns/$2/background_sm.png`)
        })
        .spriteDEF({
            regExp: /^(hall(\w)(\w{3}))\.def$/,
            width: 1,
            outFile: path.join(argvOptions.output, `towns/$2/buildings.png`)
        })
    ;

}

main();