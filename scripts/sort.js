var sortOrder = {

    "goldbooster": 2000002,
    "xpbooster": 2000001,
    "luckbooster": 2000000,

    "hpot0": 1900300,
    "hpot1": 1900200,
    "mpot0": 1900100,
    "mpot1": 1900000,

    "elixirint0": 1801300,
    "elixirint1": 1801200,
    "elixirint2": 1801100,
    "elixirdex0": 1801000,
    "elixirdex1": 1800900,
    "elixirdex2": 1800800,
    "elixirvit0": 1800700,
    "elixirvit1": 1800600,
    "elixirvit2": 1800500,
    "elixirstr0": 1800400,
    "elixirstr1": 1800300,
    "elixirstr2": 1800200,
    "bunnyelixir": 1800100,
    "eggnog": 1800000,

    "scroll0": 1701100,
    "scroll1": 1701000,
    "scroll2": 1700900,
    "cscroll0": 1700800,
    "cscroll1": 1700700,
    "cscroll2": 1700600,
    "intscroll": 1700500,
    "dexscroll": 1700400,
    "vitscroll": 1700300,
    "strscroll": 1700200,
    "evasionscroll": 1700100,
    "reflectionscroll": 1700000,

    "bow": 1601600,
    "bow3": 1601500,
    "bow4": 1601400,
    "t2bow": 1601300,
    "staff": 1601200,
    "pmace": 1601100,
    "bataxe": 1601000,
    "cupid": 1600900,
    "spear": 1600800,
    "blade": 1600700,
    "oozingterror": 1600600,
    "fireblade": 1600500,
    "basher": 1600400,
    "claw": 1600300,
    "carrotsword": 1600200,
    "firestaff": 1600100,
    "wblade": 1600000,

    "helmet": 1500700,
    "helmet1": 1500600,
    "hhelmet": 1500500,
    "xhelmet": 1500400,
    "phelmet": 1500300,
    "xmashat": 1500200,
    "fury": 1500100,
    "bunnyears": 1500000,

    "coat": 1400600,
    "coat1": 1400500,
    "harmor": 1400400,
    "xarmor": 1400300,
    "pyjamas": 1400200,
    "mcape": 1400100,
    "xmassweater": 1400000,

    "pants": 1300400,
    "pants1": 1300300,
    "hpants": 1300200,
    "xpants": 1300100,
    "xmaspants": 1300000,

    "shoes": 1200400,
    "shoes1": 1200300,
    "hboots": 1200200,
    "xboots": 1200100,
    "xmasshoes": 1200000,

    "gloves": 1100500,
    "gloves1": 1100400,
    "hgloves": 1100300,
    "xgloves": 1100200,
    "mittens": 1100100,
    "handofmidas": 1100000,

    "intearring": 1000400,
    "dexearring": 1000300,
    "vitearring": 1000200,
    "strearring": 1000100,
    "molesteeth": 1000000,

    "strring": 900700,
    "harbringer": 900600,
    "vitring": 900500,
    "ringsj": 900030,
    "dexring": 900200,
    "intring": 900100,
    "suckerpunch": 900000,

    "t2intamulet": 800700,
    "t2dexamulet": 800600,
    "t2stramulet": 800500,
    "intamulet": 800400,
    "dexamulet": 800300,
    "hpamulet": 800200,
    "stramulet": 800100,
    "amuletofm": 800000,


    "cape": 700100,
    "bcape": 700000,

    "dexbelt": 600300,
    "hpbelt": 600200,
    "strbelt": 600100,
    "intbelt": 600000,

    "quiver": 500500,
    "t2quiver": 500400,
    "shield": 500300,
    "sshield": 500200,
    "wbook0": 500100,
    "wbook1": 500000,

    "orbofint": 400900,
    "orbofstr": 400800,
    "orbofres": 400700,
    "orbofsc": 400600,
    "orbofhp": 400500,
    "stoneofluck": 400400,
    "stoneofgold": 400300,
    "stonekey": 400200,
    "stoneofxp": 400100,
    "rabbitsfoot": 400000,

    "egg0": 301000,
    "egg1": 300900,
    "egg2": 300800,
    "egg3": 300700,
    "egg4": 300600,
    "egg5": 300500,
    "egg6": 300400,
    "egg7": 300300,
    "egg8": 3000200,
    "poison": 300100,
    "stick": 300000,

    "offering": 200400,
    "test": 200300,
    "computer": 200200,
    "stand0": 200100,
    "xptome": 200000,

    "goldenegg": 101600,
    "basketofeggs": 101500,
    "gem0": 101400,
    "gem1": 101300,
    "weaponbox": 101200,
    "armorbox": 101100,
    "mistletoe": 101000,
    "candycane": 100900,
    "jewellerybox": 100800,
    "ornament": 100700,
    "candy1": 100600,
    "seashell": 100500,
    "gemfragment": 100400,
    "candy0": 100300,
    "coal": 100200,
    "lostearring": 100100,
    "leather": 100000

};

function swap(indexA, indexB) {
    swaps++;

    parent.socket.emit("imove", {a: indexA, b: indexB});
    console.log("swap: " + indexA + " " + indexB);

    var tmp = items[indexA];
    items[indexA] = items[indexB];
    items[indexB] = tmp;
}


var items = [];

for (var i in character.items) {
    var item = character.items[i];
    if (item) {
        var p = sortOrder[item.name];

        if (item.level)
            p += item.level;
        items[i] = ({p: p})
    }
}

function find(index) {
    for (var i in items) {
        if (items[i])
            if (items[i].dest == index)
                return i;
    }
    return null;
}

var sorted = items.slice().sort(function (a, b) {
    return b.p - a.p
});

for (var key in sorted) {
    sorted[key].dest = key;
}
var swaps = 0;
for (var i = 0; i < items.length; i++) {
    var index = find(i);
    var item = items[index];
    console.log(item,index);
    if (index != i && index) {
        swap(i, index);
    }
}


console.log(items);