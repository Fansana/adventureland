// Basic Grinding
// Auto Compounding & Upgrading stuff Courtesy of: Mark
// Version 1.10.8

//////////////////////////
// Main Settings Start //
////////////////////////

//NOTE: If you use mode 2, targetting will go by character range for searching for a target instead of going for a wider radius of searching for a target. [best used for range classes]

mode = 0; //Standing still (will move if target is out of range) = 0, Front of target (Moves to front of target before attacking) = 1, Don't move at all (will not move even if target is out of range) = 2

function handle_death()
{
    setTimeout(respawn_function,13000);
}

function respawn_function()
{
    parent.socket.emit('respawn');
    smart_move("greenfairy",stop);
    var target = get_targeted_monster();
}

//Smart_Kill_Phoenix();
var reset = true;

//////////////////////////////
// Optional Settings Start //
////////////////////////////

// GUI [if either GUI setting is turned on and then you want to turn them off you'll have to refresh the game] //


useInvis = false; //[Rogue Skill] //Enable going invisible on cooldown = true, Disable going invisible on cooldown = false
useBurst = false; //[Mage Skill] //Enable Using burst on cooldown [only on targets above 6,000 hp] = true, Disable using burst on cooldown = false
useTaunt = false; //[Warrior Skill] //Enable Using taunt on cooldown = true, Disable using taunt on cooldown = false
useCharge = false; //[Warrior Skill] //Enable Using charge on cooldown = true, Disable using charge on cooldown = false
useSupershot = false; //[Ranger Skill] //Enable using supershot on cooldown = true, Disable using supershot on cooldown = false
// Skill Usage [Only turn on skill for the class you are running, if you want to use skills] //

////////////////////////////
// Optional Settings End //
//////////////////////////

draw_circle(character.real_x,character.real_y,character.range);

//Grind Code start --------------------------
setTimeout(function() {
    setInterval(function() {

        //Monster Searching
        var target = get_targeted_monster();
        if (mode == 2 && target && !in_attack_range(target)) target = null;

        if(character.invis == false){
            for(let entity in parent.entities)
            {
                let current = parent.entities[entity];
                if(current.skin ==  'greenfairy')
                    target= (current);
                if (reset == false)
                    target=null;
            }
        }
        else
        {
            for(let entity in parent.entities)
            {
                let current = parent.entities[entity];
                if(current.type === 'character' && current.name == 'DMerchant')
                    target= (current);

            }
        }
        if (mode == 2 && target && !in_attack_range(target)) target = null;
        if (target) {
            change_target(target);
        } else {
            set_message("No Monsters");
            return;
        }

        //Attack
        if (can_attack(target))
        {
            attack(target);
            use_skill("invis");
            reset = false;
            if(target.name === 'DMerchant')
            {
                setTimeout(function(){ reset=true; }, 12000);
            }
            target=null;
        }


    }, (1 / character.frequency + 50) / 4); //base loop off character frequency

    setInterval(function() {

        var target = null;
        if( character.invis == false){
            for(let entity in parent.entities){
                let current = parent.entities[entity];
                if(current.skin ==  'greenfairy')
                    target= (current);
                if (reset == false)
                    target=null;
            }
        }
        else
        {
            for(let entity in parent.entities){
                let current = parent.entities[entity];
                if(current.type === 'character' && current.name == 'DMerchant')
                    target= (current);

            }
        }
        //Following/Maintaining Distance
        if (mode == 0) {
            //Walk half the distance
            if (target && !in_attack_range(target)) {
                move(
                    character.real_x + (target.real_x - character.real_x) / 2,
                    character.real_y + (target.real_y - character.real_y) / 2
                );
            }
        } else if (mode == 1) {
            if (target) {
                //Move to front of target
                move(target.real_x + 5, target.real_y + 5);
            }
        }

        //Heal and restore mana if required
        if (character.hp / character.max_hp < 0.6 && new Date() > parent.next_potion && character.rip == false) {
            parent.use('hp');
            if (character.hp <= 100)
                parent.socket.emit("transport", {
                    to: "main"
                });
            //Panic Button
        }

        if (character.mp / character.max_mp < 0.6 && new Date() > parent.next_potion)
            parent.use('mp');

    }, 250); //Loop every 250 milliseconds

    setCorrectingInterval(function() {

        //Upgrade/Compound/Sell/Exchange Items
        if (uc) {
            seuc_merge(upgrade_level, compound_level);
        }

        //Purchases Potions when below threshold
        if (purchase_pots) {
            purchase_potions(buy_hp, buy_mp);
        }

    }, 1000); //Loop every 1 second.

    setCorrectingInterval(function() {

        //Updates GUI for Till_Level/Gold
        if (gui_tl_gold) {
            updateGUI();
        }

        //Updates GUI for Time Till Level
        if (gui_timer) {
            update_xptimer();
        }

        //Loot available chests
        loot();


    }, 500); //Loop every 500 milliseconds
}, 500); //Delay execution of Grind Code by 500 milliseconds to load ajax.
//--------------------------Grind Code End


//If an error starts producing consistently, please notify me (@??? ?O????Y O??? ???#4607) on discord! [uncomment game log filters if you want them]
var urls = ['http://tiny.cc/MyFunctions', 'http://tiny.cc/Skill_Usage_BP' /*, 'http://tiny.cc/Game_Log_Filters' */ ];

$.each(urls, function(i, u) {
    $.ajax(u, {
        type: 'POST',
        dataType: "script",
        async: false,
        cache: true
    });
});