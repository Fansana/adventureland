
parent.stop_rendering = true;
game_log("Started Script: Disabled Rendering");
var nodeType = {
    WALKING: 0,
    TARGETING: 1
};
var whitelist = ["Meadow", "SpadarFaar", "Foaly", "Maela", "Conrad", "Brutus", "Trexnamedtom", "Trexnamedtut", "Trexnamedted", "Trexnamedtim", "Trexnamedtod", "Star", "Paloo", "Ploo", "Plu2", "Velexine", "Pauline", "Muhnch", "Muhncheez", "MuhnchPriest", "MuhnchArcher", "Muhncheeez", "Muhnchant", "Rhea", "RayHawkeye", "Hyperia", "Ally", "Kanna", "StreetVendor", "Nonitah", "Brian1397", "glenjamin", "SeMasa", "RetroMVP", "whoreeater", "FrozenArrow", "FrozenPriest", "MoltenRanger", "FrozenMage", "FrozenRogue", "Vladmir", "Ryuzakii", "Shiina", "Rukawa", "Killua", "nobodyhere", "nobodythat", "Iamanoob", "Elfwannabe", "nobodutanks", "NexusNull", "Clover", "Emerald", "Arcus", "Harold", "Sorbo", "Saboth", "Stitches", "Warez", "kwann", "MrPiggles", "Beatrice"];

var path = [
    {type: 0, real_x: 366, real_y: -49},
    {type: 1, clearBoundary: 4},
    {type: 0, real_x: -150, real_y: -186},
    {type: 0, real_x: -150, real_y: -383},
    {type: 1, clearBoundary: 0},
    {type: 0, real_x: 243, real_y: -470},
    {type: 0, real_x: 623, real_y: -470},
    {type: 1, clearBoundary: 1},
    {type: 0, real_x: 916, real_y: -366},
    {type: 0, real_x: 915, real_y: -139},
    {type: 1, clearBoundary: 3},
    {type: 0, real_x: 683, real_y: -23}
];
var socket = parent.socket;
var postfix = parent.server_region+parent.server_identifier;

collect = function(){
    if(localStorage.getItem("DropData"+postfix)){
        var chests = JSON.parse(localStorage.getItem("DropData"+postfix)).chests;
        var index = 0;

        var interval = setInterval(function(){
            if (index < chests.length) {
                parent.socket.emit('open_chest', {
                    id: chests[index]
                });
                index++;
            } else {
                clearInterval(interval);
                localStorage.removeItem("DropData" + postfix);
            }
        },250);
    }
};

on_drop = function(data){
    if(data.items > 0){
        var dropData = {chests: []};
        if(localStorage.getItem("DropData"+postfix)){
            dropData = JSON.parse(localStorage.getItem("DropData"+postfix));
        }
        dropData.chests.push(data.id);
        localStorage.setItem("DropData"+postfix, JSON.stringify(dropData));
    } else {
        socket.emit('open_chest', {
            id: data.id
        })
    }
};

socket.on("drop", on_drop);

var posIndex = 0;

var pvpMode = false;
var playerTarget;
setInterval(function () {

    if ((character.hp / character.max_hp <= .20) || (character.max_hp - character.hp > 200)) {
        use("hp");
    }

    if (character.mp / character.max_mp <= .20  || (character.max_mp - character.mp > 300)) {
        use("mp");
    }

    pvpMode = false;
    if(parent.pvp) {
        for (var key in parent.entities) {
            if (parent.entities[key].type == "character" && !parent.entities[key].rip) {
                if (whitelist.indexOf(parent.entities[key].name) == -1) {
                    playerTarget = parent.entities[key];
                    pvpMode = true;
                }
            }
        }
    }

    if(pvpMode) {
        if(playerTarget){
            if(!in_attack_range(playerTarget))
            {
                move(
                    character.real_x+(playerTarget.real_x-character.real_x)/2,
                    character.real_y+(playerTarget.real_y-character.real_y)/2
                );
                // Walk half the distance
            }
            else if(can_attack(playerTarget))
            {
                set_message("Attacking");
                attack(playerTarget);
            }
            if(can_use("supershot"))
                use_skill("supershot",playerTarget);
        }
    } else {
        if (!character.walking) {
            //Target Logic
            var target = get_targeted_monster();
            if (path[posIndex].type == nodeType.TARGETING) {
                if (!target) {
                    var index = path[posIndex].clearBoundary;
                    target = get_nearest_monster_in_zone(G.maps.arena.monsters[index].boundary, "cgoo");
                    if (target) change_target(target);
                    else {
                        set_message("No Monsters");
                        goNextNode();
                        return;
                    }
                }
            } else if (path[posIndex].type == nodeType.WALKING) {
                goNextNode();
            }

            //INFO
            set_message("D: " + Math.floor(distance(character, target)));

            //Attack Logic

            if (target) {
                if (!in_attack_range(target)) {
                    posSelf(character, target, character.range - 10);
                }
                else if (can_attack(target)) {
                    if (target.target == character.id)
                        attack(target);
                    if (distance(character, target) < 120)
                        posSelf(character, target);
                    else
                        attack(target);
                }
            }
        }
    }

}, 1000 / 4); // Loops every 1/4 seconds.


function goNextNode() {
    if (!character.walking) {
        var node = path[posIndex];
        if (node.type == nodeType.WALKING)
            if (can_move_to(node)) {
                move(node.real_x, node.real_y);
                posIndex = (posIndex + 1) % path.length;
            } else {
                console.log("skipped a node");
                posIndex = (posIndex + 1) % path.length;
            }
        else
            posIndex = (posIndex + 1) % path.length;
    }
}

var attack = function (target) {
    if (mssince(last_attack) < 400) return;
    if (!target) {
        game_log("Nothing to attack()", "gray");
        return;
    }
    if (target.type == "character") parent.player_attack.call(target);
    else parent.monster_attack.call(target);
    last_attack = new Date();
};

function distance(one, two) {
    if (two && one)
        return Math.sqrt(Math.pow(one.real_x - two.real_x, 2) + Math.pow(one.real_y - two.real_y, 2));
    else
        return 0;
}

function posSelf(player, target, targetDist) {
    var targetDistance = targetDist || 130;
    var dist = distance(player, target);
    var nX = (player.real_x - target.real_x) / dist;
    var nY = (player.real_y - target.real_y) / dist;

    move(
        target.real_x + nX * targetDistance,
        target.real_y + nY * targetDistance
    );

}

var lootGold = function () {
    var looted = 0;
    if (safeties && mssince(last_loot) < 200) return;
    last_loot = new Date();
    for (id in parent.chests) {
        var chest = parent.chests[id];
        if (safeties && (chest.items != 0 || chest.last_loot && mssince(chest.last_loot) < 1600)) continue;
        chest.last_loot = last_loot;
        parent.socket.emit("open_chest", {id: id});
        looted++;
        if (looted == 2) break;
    }
}

var get_monsters_in_zone = function (boundary, mtype) {
    var monstersInBoundary = [];
    for (var i in parent.entities) {
        if (parent.entities[i].type == "monster" && parent.entities[i].mtype == mtype) {
            var x = parent.entities[i].real_x;
            var y = parent.entities[i].real_y;
            if (boundary[0] < x && x < boundary[2] && boundary[1] < y && y < boundary[3])
                if(can_move_to(parent.entities[i]))
                    monstersInBoundary.push(parent.entities[i]);
        }
    }
    return monstersInBoundary;
};

var get_nearest_monster_in_zone = function(boundary, mtype){
    var monsters = get_monsters_in_zone(boundary,mtype);
    var closest = 9999999;
    var monster = null;
    for(var i=0; i<monsters.length; i++){
        var dist = distance(character, monsters[i]);
        if(closest > dist){
            monster = monsters[i];
            closest = dist;
        }
    }
    return monster;
};
var get_nearest_monster = function (args) {
    var min_d = 999999, target = null;

    if (!args) args = {};
    if (args && args.target && args.target.name) args.target = args.target.name;

    for (id in parent.entities) {
        var current = parent.entities[id];
        if (current.type != "monster" || current.dead) continue;
        if (args.type && current.mtype != args.type) continue;
        if (args.min_xp && current.xp < args.min_xp) continue;
        if (args.maxDis1tance && distance(character, current) > args.maxDistance) continue;
        if (args.max_att && current.attack > args.max_att) continue;
        if (args.target && current.target != args.target) continue;
        if (args.no_target && current.target && current.target != character.name) continue;
        if (args.path_check && !can_move_to(current)) continue;
        var c_dist = distance(character, current);
        if (c_dist < min_d) min_d = c_dist, target = current;
    }
    return target;
};

on_destroy = function(){
    parent.socket.removeListener(on_drop);
    parent.stop_rendering = false;
    game_log("Script stopped");
};



