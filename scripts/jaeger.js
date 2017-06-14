/**
 * Created by nexus on 02/06/17.
 */

parent.stop_rendering = true;
game_log("Started Script: Disabled Rendering");
setInterval(function () {
    if(can_use(0)){
        if (character.hp / character.max_hp <= .20 || character.max_hp -character.hp > 250) {
            use("hp");
        }
        if (character.mp / character.max_mp <= .20 || character.max_mp -character.mp > 350) {
            use("mp");
        }
    }
    loot();
    var target = get_targeted_monster();
    if (!target) {
        if(character.name != "NexusNull"){
            if(parent.entities.NexusNull && parent.get_entity(parent.entities.NexusNull.target)){
                target = parent.get_entity(parent.entities.NexusNull.target);
                change_target(target);
            } else {
                set_message("No Monsters");
                return;
            }
        } else {
            target = get_nearest_monster({type:"xscorpion"});
            if (target && distance(character, target) < character.range-5) {
                change_target(target);
            } else {
                set_message("No Monsters");
                return;
            }
        }
    }
    //posSelf(character, target);
    //set_message("D: " + Math.floor(distance(character, target)));
}, 1000 / 4); // Loops every 1/4 seconds.

setInterval(function(){
    var target = get_targeted_monster();
    if (in_attack_range(target) && can_attack(target)) {
        attack(target);
    }
},Math.ceil(1000/character.frequency)+100)

/*
 var pwhitelist = ['NexusNull', "Clover","Arcus"];
 //Accepts party invites from whitelist
 parent.window.addEventListener('keydown', function (event) {
 var keyName = event.key;
 if (keyName == 'p' || keyName == 'P') invite_party_list();
 }, false);
 setInterval(function () {
 if (!character.party) accept_party_list();
 }, 10000);

 //Adds all whitelisted party memebers to party
 function invite_party_list() {
 for (members in pwhitelist) send_party_invite(pwhitelist[members], 0);
 } //Accepts requests from whitelisted party memebers function
 function accept_party_list() {
 for (members in pwhitelist) accept_party_invite(pwhitelist[members]);
 }
 */

function distance(one, two) {
    return Math.sqrt(Math.pow(one.real_x - two.real_x, 2) + Math.pow(one.real_y - two.real_y, 2));
}
function posSelf(player, target) {
    var targetDistance = player.range + 4;
    var dist = distance(player, target);
    var nX = (player.real_x - target.real_x) / dist;
    var nY = (player.real_y - target.real_y) / dist;

    move(
        target.real_x + nX * targetDistance,
        target.real_y + nY * targetDistance
    );

}
window.aldc_apikey = '45754ehdssxcbsdf';
window.aldc_use_upgrade = false;
window.aldc_use_compound = false;
window.aldc_use_exchange = false;


$.getScript('http://adventurecode.club/script', function() {
    game_log('Thank you for contributing your drop data!', '#FFFF00');
});

on_destroy = function(){
    parent.stop_rendering = false;
    game_log("Script stopped");
};