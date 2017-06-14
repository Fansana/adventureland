/**
 * Created by nexus on 12/06/17.
 */
var u_item = null,
    u_scroll = null,
    u_offering = null,
    c_items = e_array(3),
    c_scroll = null,
    c_offering = null,
    c_last = 0,
    e_item = null,
    cr_items = e_array(9),
    cr_last = 0;
var skillmap = {
        '1': {
            name: 'use_hp'
        },
        '2': {
            name: 'use_mp'
        },
        R: {
            name: 'burst'
        }
    },
    skillbar = [
    ];
var settings_shown = 0;
function show_settings() {
    var a = '<div id=\'pagewrapper\' style=\'z-index:9999; background: rgba(0,0,0,0.6)\' onclick=\'hide_settings()\'>';
    a += '<div id=\'pagewrapped\'>';
    a += $('#settingshtml').html();
    a += '</div>';
    a += '</div>';
    $('#content').html(a);
    $('#pagewrapped').css('margin-top', Math.floor(($(window).height() - $('#pagewrapped').height()) / 2) + 'px');
    resize()
}
var docked = [
    ],
    cwindows = [
    ];
function close_chat_window(a, c) {
    var b = a + (c || '');
    $('#chatw' + b).remove();
    array_delete(docked, b);
    array_delete(cwindows, b);
    redock()
}
function toggle_chat_window(a, c) {
    var b = a + (c || '');
    if (in_arr(b, docked)) {
        array_delete(docked, b);
        $('.chatb' + b).html('#');
        $('#chatw' + b).css('bottom', 'auto');
        $('#chatw' + b).css('top', 400);
        $('#chatw' + b).css('left', 400);
        $('#chatw' + b).css('z-index', 70 + cwindows.length - docked.length);
        $('#chatw' + b).draggable();
        $('#chatt' + b).removeClass('newmessage')
    } else {
        $('.chatb' + b).html('+');
        $('#chatw' + b).draggable('destroy');
        $('#chatw' + b).css('top', 'auto');
        $('#chatw' + b).css('left', 0);
        docked.push(b)
    }
    redock()
}
function chat_title_click(a, c) {
    var b = a + (c || '');
    if (in_arr(b, docked)) {
        toggle_chat_window(a, c)
    }
}
function redock() {
    for (var a = 0; a < docked.length; a++) {
        var b = docked[a];
        $('#chatw' + b).css('bottom', 15 + a * 32);
        $('#chatw' + b).css('z-index', 70 - a)
    }
}
function open_chat_window(e, h, b) {
    if (!h) {
        h = ''
    }
    var a = h,
        g = e + h,
        d = 70 + cwindows.length - docked.length,
        f = 'last_say="' + g + '"; if(event.keyCode==13) private_say("' + h + '",$(this).rfval())';
    if (e == 'party') {
        a = 'Party',
            f = 'last_say="' + g + '"; if(event.keyCode==13) party_say($(this).rfval())'
    }
    var c = '<div style=\'position:fixed; bottom: 0px; left: 0px; background: black; border: 5px solid gray; z-index: ' + d + '\' id=\'chatw' + g + '\' onclick=\'last_say="' + g + '"\'>';
    c += '<div style=\'border-bottom: 5px solid gray; text-align: center; font-size: 24px; line-height: 24px; padding: 2px 6px 2px 6px;\'><span style=\'float:left\' class=\'clickable chatb' + g + '\'\t\t onclick=\'toggle_chat_window("' + e + '","' + h + '")\'>+</span> <span id=\'chatt' + g + '\' onclick=\'chat_title_click("' + e + '","' + h + '")\'>' + a + '</span> <span style=\'float: right\' class=\'clickable\' onclick=\'close_chat_window("' + e + '","' + h + '")\'>x</span></div>';
    c += '<div id=\'chatd' + g + '\' class=\'chatlog\'></div>';
    c += '<div style=\'\'><input type=\'text\' class=\'chatinput\' id=\'chati' + g + '\' onkeypress=\'' + f + '\'/></div>';
    c += '</div>';
    $('body').append(c);
    docked.push(g);
    cwindows.push(g);
    if (b) {
        toggle_chat_window(e, h)
    }
    redock()
}
function hide_settings() {
    $('#content').html('');
    settings_shown = 0
}
function prop_line(e, d, b) {
    var a = '',
        c = '';
    if (!b) {
        b = {
        }
    }
    if (b.bold) {
        c = 'font-weight: bold;'
    }
    if (is_string(b)) {
        a = b,
            b = {
            }
    }
    if (!a) {
        a = b.color || 'grey'
    }
    return '<div><span style=\'color: ' + a + '; ' + c + '\'>' + e + '</span>: ' + d + '</div>'
}
function bold_prop_line(c, b, a) {
    if (!a) {
        a = {
        }
    }
    if (is_string(a)) {
        a = {
            color: a
        }
    }
    if (is_bold) {
        a.bold = true
    }
    return prop_line(c, b, a)
}
function render_party(b) {
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 6px; font-size: 24px; display: inline-block\' class=\'enableclicks\'>';
    if (b) {
        a += '<div class=\'slimbutton block\'>PARTY</div>';
        b.forEach(function (c) {
            a += '<div class=\'slimbutton block mt5\' style=\'border-color:#703987\' onclick=\'party_click("' + c + '")\'>' + c + '</div>'
        });
        a += '<div class=\'slimbutton block mt5\'';
        a += 'onclick=\'socket.emit("party",{event:"leave"})\'>LEAVE</div>'
    }
    a += '</div>';
    $('#partylist').html(a);
    if (!b.length) {
        $('#partylist').hide()
    } else {
        $('#partylist').css('display', 'inline-block')
    }
}
function render_character_sheet() {
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: left\' class=\'disableclicks\'>';
    a += '<div><span style=\'color:gray\'>Class:</span> ' + to_title(character.ctype) + '</div>';
    a += '<div><span style=\'color:gray\'>Level:</span> ' + character.level + '</div>';
    a += '<div><span style=\'color:gray\'>XP:</span> ' + to_pretty_num(character.xp) + ' / ' + to_pretty_num(character.max_xp) + '</div>';
    if (character.ctype == 'priest') {
        a += '<div><span style=\'color:gray\'>Heal:</span> ' + character.attack + '</div>';
        a += '<div><span style=\'color:gray\'>Attack:</span> ' + round(character.attack * 0.4) + '</div>'
    } else {
        a += '<div><span style=\'color:gray\'>Attack:</span> ' + character.attack + '</div>'
    }
    a += '<div><span style=\'color:gray\'>Attack Speed:</span> ' + round(character.frequency * 100) + '</div>';
    a += '<div><span style=\'color:gray\'>Strength:</span> ' + character.stats.str + '</div>';
    a += '<div><span style=\'color:gray\'>Intelligence:</span> ' + character.stats['int'] + '</div>';
    a += '<div><span style=\'color:gray\'>Dexterity:</span> ' + character.stats.dex + '</div>';
    a += '<div><span style=\'color:gray\'>Vitality:</span> ' + character.stats.vit + '</div>';
    a += '<div><span style=\'color:gray\'>Armor:</span> ' + character.armor + '</div>';
    a += '<div><span style=\'color:gray\'>Resistance:</span> ' + character.resistance + '</div>';
    a += '<div><span style=\'color:gray\'>Speed:</span> ' + character.speed + '</div>';
    a += '<div><span style=\'color:gray\'>MP Cost:</span> ' + character.mp_cost + '</div>';
    if (character.goldm != 1) {
        a += '<div><span style=\'color:gray\'>Gold:</span> ' + round(character.goldm * 100) + '%</div>'
    }
    if (character.xpm != 1) {
        a += '<div><span style=\'color:gray\'>Experience:</span> ' + round(character.xpm * 100) + '%</div>'
    }
    if (character.luckm != 1) {
        a += '<div><span style=\'color:gray\'>Luck:</span> ' + round(character.luckm * 100) + '%</div>'
    }
    a += '</div>';
    $('#rightcornerui').html(a);
    topright_npc = 'character'
}
function render_abilities() {
}
function render_info(h, f) {
    if (!f) {
        f = [
        ]
    }
    var e = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top\'>';
    for (var d = 0; d < h.length; d++) {
        var g = h[d],
            a = '';
        var b = g.color || 'white';
        if (g.afk) {
            a = ' <span class=\'gray\'>[AFK]</span>'
        }
        if (g.cursed) {
            a = ' <span style=\'color: #7D4DAA\'>[C]</span>'
        }
        if (g.poisoned) {
            a = ' <span style=\'color: #45993F\'>[P]</span>'
        }
        if (g.stunned) {
            a = ' <span style=\'color: #FF9601\'>[STUN]</span>'
        }
        if (g.line) {
            e += '<span class=\'cbold\' style=\'color: ' + b + '\'>' + g.line + '</span>' + a + '<br />'
        } else {
            e += '<span class=\'cbold\' style=\'color: ' + b + '\'>' + g.name + '</span>: ' + g.value + a + '<br />'
        }
    }
    for (var d = 0; d < f.length; d++) {
        var c = f[d];
        var b = c.color || 'white';
        e += '<span style=\'color: ' + b + '\' class=\'clickable cbold\' onclick="' + c.onclick + '">' + c.name + '</span>';
        if (c.pm_onclick) {
            e += ' <span style=\'color: ' + ('#276bc5' || b) + '\' class=\'clickable cbold\' onclick="' + c.pm_onclick + '">PM</span>'
        }
        e += '<br />'
    }
    e += '</div>';
    $('#topleftcornerui').html(e)
}
function render_slots(f) {
    function c(m, g, l) {
        if (!l) {
            l = 0.4
        }
        if (f.slots[m]) {
            var j = f.slots[m];
            var k = 'item' + randomStr(10),
                h = G.items[j.name],
                i = j.skin || h.skin;
            if (j.expires) {
                i = h.skin_a
            }
            e += item_container({
                skin: i,
                onclick: 'slot_click(\'' + m + '\')',
                def: h,
                id: k,
                draggable: f.me,
                sname: f.me && m,
                shade: g,
                s_op: l,
                slot: m
            }, j)
        } else {
            e += item_container({
                size: 40,
                draggable: f.me,
                shade: g,
                s_op: l,
                slot: m
            })
        }
    }
    var a = f.me;
    var e = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; margin-left: 5px\'>';
    if (f.stand) {
        e += '<div class=\'cmerchant\'>';
        for (var d = 0; d < 4; d++) {
            e += '<div>';
            for (var b = 0; b < 4; b++) {
                c('trade' + ((d * 4) + b + 1), 'shade_gold', 0.25)
            }
            e += '</div>'
        }
        e += '</div>'
    }
    if (f.stand) {
        e += '<div class=\'cmerchant hidden\'>'
    }
    e += '<div>';
    c('earring1', 'shade_earring');
    c('helmet', 'shade_helmet', 0.5);
    c('earring2', 'shade_earring');
    c('amulet', 'shade_amulet');
    e += '</div>';
    e += '<div>';
    c('mainhand', 'shade_mainhand', 0.36);
    c('chest', 'shade_chest');
    c('offhand', 'shade_offhand');
    c('cape', 'shade20_cape');
    e += '</div>';
    e += '<div>';
    c('ring1', 'shade_ring');
    c('pants', 'shade_pants', 0.5);
    c('ring2', 'shade_ring');
    c('orb', 'shade20_orb');
    e += '</div>';
    e += '<div>';
    c('belt', 'shade_belt');
    c('shoes', 'shade_shoes', 0.5);
    c('gloves', 'shade_gloves');
    c('elixir', 'shade20_elixir');
    e += '</div>';
    if ((f.me && f.slots.trade1 !== undefined || (f.slots.trade1 || f.slots.trade2 || f.slots.trade3 || f.slots.trade4)) && !f.stand) {
        e += '<div>';
        c('trade1', 'shade_gold', 0.25);
        c('trade2', 'shade_gold', 0.25);
        c('trade3', 'shade_gold', 0.25);
        c('trade4', 'shade_gold', 0.25);
        e += '</div>'
    }
    if (f.stand) {
        e += '</div>'
    }
    e += '</div>';
    $('#topleftcornerui').append(e)
}
function render_transports_npc() {
    reset_inventory(1);
    topleft_npc = 'transports';
    rendered_target = topleft_npc;
    e_item = null;
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top;\'>';
    a += '<div class=\'clickable\' onclick=\'transport_to("main",9)\'>&gt; New Town</div>';
    a += '<div class=\'clickable\' onclick=\'transport_to("winterland",1)\'>&gt; Winterland</div>';
    a += '<div class=\'clickable\' onclick=\'transport_to("halloween",1)\'>&gt; Spooky Forest</div>';
    a += '<div class=\'clickable\' onclick=\'transport_to("underworld")\'>&gt; Underworld</div>';
    a += '<div class=\'clickable\' onclick=\'transport_to("desert")\'>&gt; Desertland <span style=\'color: #D2CB7E\'>[Soon!]</span></div>';
    a += '</div>';
    $('#topleftcornerui').html(a)
}
function render_gold_npc() {
    reset_inventory(1);
    topleft_npc = 'gold';
    rendered_target = topleft_npc;
    e_item = null;
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center\' onclick=\'stpr(event); cfocus(".npcgold")\'>';
    a += '<div style=\'font-size: 36px; margin-bottom: 10px\'><span style=\'color:gold\'>GOLD:</span> ' + (character.user && to_pretty_num(character.user.gold) || 'Unavailable') + '</div>';
    a += '<div style=\'font-size: 36px; margin-bottom: 10px\'><span style=\'color:gray\'>Amount:</span> <div contenteditable=\'true\' class=\'npcgold inline-block\'>0</div></div>';
    a += '<div><div class=\'gamebutton clickable\' onclick=\'deposit()\'>DEPOSIT</div><div class=\'gamebutton clickable ml5\' onclick=\'withdraw()\'>WITHDRAW</div></div>';
    a += '</div>';
    $('#topleftcornerui').html(a);
    cfocus('.npcgold')
}
var last_rendered_items = 'items0';
function render_items_npc(l) {
    if (!character.user) {
        return
    }
    if (!l) {
        l = last_rendered_items
    }
    if (l && !character.user[l]) {
        render_interaction('unlock_' + l);
        topleft_npc = 'items';
        rendered_target = topleft_npc;
        last_rendered_items = l;
        return
    }
    last_rendered_items = l;
    reset_inventory(1);
    topleft_npc = 'items';
    rendered_target = topleft_npc;
    var g = [
        ],
        m = 0,
        k = character.user[l] || [];
    var e = '<div style=\'background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block\' class=\'dcontain\'>';
    for (var d = 0; d < Math.ceil(max(character.isize, k.length) / 7); d++) {
        e += '<div>';
        for (var c = 0; c < 7; c++) {
            var h = null;
            if (m < k.length) {
                h = k[m++]
            } else {
                m++
            }
            if (h) {
                var a = 'citem' + (m - 1),
                    o = G.items[h.name],
                    n = o.skin;
                if (h.expires) {
                    n = o.skin_a
                }
                e += item_container({
                    skin: n,
                    def: o,
                    id: 'str' + a,
                    draggable: true,
                    strnum: m - 1,
                    snum: m - 1
                }, h);
                g.push({
                    id: a,
                    item: o,
                    name: h.name,
                    actual: h,
                    num: m - 1
                })
            } else {
                e += item_container({
                    size: 40,
                    draggable: true,
                    strnum: m - 1
                })
            }
        }
        e += '</div>'
    }
    e += '</div><div id=\'storage-item\' style=\'display: inline-block; vertical-align: top; margin-left: 5px\'></div>';
    $('#topleftcornerui').html(e);
    for (var d = 0; d < g.length; d++) {
        var b = g[d];
        function f(i) {
            return function () {
                render_item('#storage-item', i)
            }
        }
        $('#str' + b.id).on('click', f(b)).addClass('clickable')
    }
    if (!inventory) {
        render_inventory()
    }
}
function render_inventory() {
    var g = 0,
        b = 'text-align: right';
    if (inventory) {
        $('#bottomleftcorner').html('');
        inventory = false;
        return
    }
    var e = '<div style=\'background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block\' class=\'dcontain\'>';
    if (c_enabled) {
        e += '<div style=\'padding: 4px; display: inline-block\' class=\'clickable\'>';
        e += '<a href=\'https://adventure.land/shells\' class=\'cancela\' target=\'_blank\'><span class=\'cbold\' style=\'color: ' + colors.cash + '\'>SHELLS</span>: <span class=\'cashnum\'>' + to_pretty_num(character.cash || 0) + '</span></a></div>';
        b = ' display: inline-block; float: right'
    }
    e += '<div style=\'padding: 4px;' + b + '\'><span class=\'cbold\' style=\'color: gold\'>GOLD</span>: <span class=\'goldnum\'>' + to_pretty_num(character.gold) + '</span></div>';
    e += '<div style=\'border-bottom: 5px solid gray; margin-bottom: 2px; margin-left: -5px; margin-right: -5px\'></div>';
    for (var d = 0; d < Math.ceil(max(character.isize, character.items.length) / 7); d++) {
        e += '<div>';
        for (var c = 0; c < 7; c++) {
            var f = null;
            if (g < character.items.length) {
                f = character.items[g++]
            } else {
                g++
            }
            if (f) {
                var a = 'citem' + (g - 1),
                    k = G.items[f.name],
                    h = f.skin || k.skin;
                if (f.expires) {
                    h = k.skin_a
                }
                e += item_container({
                    skin: h,
                    onclick: 'inventory_click(' + (g - 1) + ')',
                    def: k,
                    id: a,
                    draggable: true,
                    num: g - 1,
                    cnum: g - 1
                }, f)
            } else {
                e += item_container({
                    size: 40,
                    draggable: true,
                    cnum: g - 1
                })
            }
        }
        e += '</div>'
    }
    e += '</div><div class=\'inventory-item\' style=\'display: inline-block; vertical-align: top; margin-left: 5px\'></div>';
    inventory = true;
    $('#bottomleftcorner').html(e)
}
function render_crafter(d) {
    var a = 'stick',
        c = 'CRAFT';
    reset_inventory(1);
    topleft_npc = 'crafter';
    rendered_target = topleft_npc;
    cr_items = e_array(9),
        cr_last = 0;
    var b = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center\'>';
    b += '<div>';
    b += item_container({
        shade: a,
        cid: 'critem0',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: 'critem1',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: 'critem2',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += '</div>';
    b += '<div>';
    b += item_container({
        shade: a,
        cid: 'critem3',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: 'critem4',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: 'critem5',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += '</div>';
    b += '<div class=\'mb5\'>';
    b += item_container({
        shade: a,
        cid: 'critem6',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: 'critem7',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: 'critem8',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += '</div>';
    b += '<div><div class=\'gamebutton clickable\' onclick=\'draw_trigger(function(){ render_crafter(); reset_inventory(); });\'>RESET</div> <div class=\'gamebutton clickable\' onclick=\'craft()\'>' + c + '</div></div>';
    b += '</div>';
    $('#topleftcornerui').html(b);
    if (!inventory) {
        render_inventory()
    }
}
function render_exchange_shrine(d) {
    var a = 'shade_exchange',
        c = 'EXCHANGE';
    reset_inventory(1);
    topleft_npc = 'exchange';
    rendered_target = topleft_npc;
    exchange_type = d;
    if (d == 'leather') {
        a = 'leather',
            c = 'GIVE'
    }
    if (d == 'lostearring') {
        a = 'lostearring',
            c = 'PROVIDE'
    }
    if (d == 'mistletoe') {
        a = 'mistletoe',
            c = 'GIVE IT'
    }
    if (d == 'candycane') {
        a = 'candycane',
            c = 'FEED'
    }
    if (d == 'ornament') {
        a = 'ornament',
            c = 'GIVE'
    }
    if (d == 'seashell') {
        a = 'seashell',
            c = 'GIVE'
    }
    if (d == 'gemfragment') {
        a = 'gemfragment',
            c = 'PROVIDE'
    }
    e_item = null;
    var b = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center\'>';
    b += '<div class=\'ering ering1 mb10\'>';
    b += '<div class=\'ering ering2\'>';
    b += '<div class=\'ering ering3\'>';
    b += item_container({
        shade: a,
        cid: 'eitem',
        s_op: 0.3,
        draggable: false,
        droppable: true
    });
    b += '</div>';
    b += '</div>';
    b += '</div>';
    b += '<div><div class=\'gamebutton clickable\' onclick=\'exchange()\'>' + c + '</div></div>';
    b += '</div>';
    $('#topleftcornerui').html(b);
    if (!inventory) {
        render_inventory()
    }
}
function render_upgrade_shrine() {
    reset_inventory(1);
    topleft_npc = 'upgrade';
    rendered_target = topleft_npc;
    u_item = null,
        u_scroll = null,
        u_offering = null;
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top\'>';
    a += '<div class=\'mb5\' align=\'center\'>';
    a += '<div>';
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_uweapon',
        cid: 'uweapon'
    });
    a += '</div>';
    a += '<div>';
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_offering',
        cid: 'uoffering',
        s_op: 0.36
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_scroll',
        cid: 'uscroll'
    });
    a += '</div>';
    a += '</div>';
    a += '<div class=\'gamebutton clickable\' onclick=\'draw_trigger(function(){ render_upgrade_shrine(); reset_inventory(); });\'>RESET</div>';
    a += '<div class=\'gamebutton clickable ml5\' onclick=\'upgrade()\'>UPGRADE</div>';
    a += '</div>';
    $('#topleftcornerui').html(a);
    if (!inventory) {
        render_inventory()
    }
}
function render_compound_shrine() {
    reset_inventory(1);
    topleft_npc = 'compound';
    rendered_target = topleft_npc;
    c_items = e_array(3),
        c_scroll = null,
        c_offering = null;
    c_last = 0;
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top\'>';
    a += '<div class=\'mb5\' align=\'center\'>';
    a += '<div>';
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_cring',
        cid: 'compound0'
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_cring',
        cid: 'compound1'
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_cring',
        cid: 'compound2'
    });
    a += '</div>';
    a += '<div>';
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_offering',
        cid: 'coffering',
        s_op: 0.36
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: 'shade_cscroll',
        cid: 'cscroll'
    });
    a += '</div>';
    a += '</div>';
    a += '<div class=\'gamebutton clickable\' onclick=\'draw_trigger(function(){ render_compound_shrine(); reset_inventory(); });\'>RESET</div>';
    a += '<div class=\'gamebutton clickable ml5\' onclick=\'compound()\'>COMBINE</div>';
    a += '</div>';
    $('#topleftcornerui').html(a);
    if (!inventory) {
        render_inventory()
    }
}
function render_merchant(k) {
    reset_inventory(1);
    topleft_npc = 'merchant';
    rendered_target = topleft_npc;
    merchant_id = k.id;
    var l = 0,
        g = [
        ];
    var e = '<div style=\'background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block\'>';
    for (var d = 0; d < 4; d++) {
        e += '<div>';
        for (var c = 0; c < 5; c++) {
            if (l < k.items.length && k.items[l++] && (c_enabled || !G.items[k.items[l - 1]].cash)) {
                var h = k.items[l - 1];
                var a = 'item' + randomStr(10),
                    m = G.items[h];
                e += item_container({
                    skin: m.skin_a || m.skin,
                    def: m,
                    id: a,
                    draggable: false,
                    on_rclick: 'buy(\'' + h + '\')'
                });
                g.push({
                    id: a,
                    item: m,
                    name: h,
                    value: m.g,
                    cash: m.cash
                })
            } else {
                e += item_container({
                    size: 40,
                    draggable: false,
                    droppable: true
                })
            }
        }
        e += '</div>'
    }
    e += '</div><div id=\'merchant-item\' style=\'display: inline-block; vertical-align: top; margin-left: 5px\'></div>';
    $('#topleftcornerui').html(e);
    for (var d = 0; d < g.length; d++) {
        var b = g[d];
        function f(i) {
            return function () {
                render_item('#merchant-item', i)
            }
        }
        $('#' + b.id).on('click', f(b)).addClass('clickable')
    }
}
function render_computer(a) {
    var b = '';
    b += '<div style="color: #32A3B0">CONNECTED.</div>';
    b += '<div onclick=\'render_upgrade_shrine()\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> UPGRADE</div>';
    b += '<div onclick=\'render_compound_shrine()\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> COMPOUND</div>';
    b += '<div onclick=\'render_exchange_shrine()\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> EXCHANGE</div>';
    b += '<div onclick=\'render_merchant(G.npcs.pots)\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> POTIONS</div>';
    b += '<div onclick=\'render_merchant(G.npcs.scrolls)\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> SCROLLS</div>';
    b += '<div onclick=\'render_merchant(G.npcs.basics)\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> BASICS</div>';
    b += '<div onclick=\'render_merchant(G.npcs.premium)\' class=\'clickable\' style=\'color: #E4E4E4\'><span style=\'color: #BA61A4\'>&gt;</span> PREMIUM</div>';
    a.html(b)
}
function render_code_gallery() {
    var a = '';
    G.codes.forEach(function (b) {
        a += '<div class=\'gamebutton\'>' + (b.name || b.key) + '</div>'
    });
    a += '<div style=\'border: 4px gray solid;\'>';
    G.codes[0].list.forEach(function (b) {
        a += '<div onclick=\'api_call("load_gcode",{file:"' + b[0] + '"});\'>' + b[1] + '</div>'
    });
    a += '</div>';
    show_modal(a)
}
function render_tutorial_stepv1(a) {
    if (!a) {
        a = {
        }
    }
    a.title = '[1/24] Move';
    a.main = 'Welcome to the first step of the tutorial. In this step, we are going to move! Now move your character near the green goo\'s by clicking on the map and walking below the town!';
    a.code = 'Using the CODE feature. You can use the `move` function, or, the more costly `smart_move` function.';
    var b = '';
    if (a.title) {
        b += '<div style=\'border: 5px solid #65A7E6; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px; display: inline-block\'>' + a.title + '</div>'
    }
    if (a.main) {
        b += '<div style=\'border: 5px solid gray; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px;\'>' + a.main + '</div>'
    }
    if (a.code) {
        b += '<div style=\'border: 5px solid #E4738A; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px;\'>' + a.code + '</div>'
    }
    show_modal(b)
}
function render_skill(a, e, c) {
    if (!c) {
        c = {
        }
    }
    var f = c.actual || {
            },
        d = '';
    var b = G.skills[e];
    d += '<div style=\'background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; ' + (c.styles || '') + '\'>';
    if (!b) {
        d += e
    } else {
        d += '<div style=\'color: #4EB7DE; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px\' class=\'cbold\'>' + b.name + '</div>';
        if (b.explanation) {
            d += '<div style=\'color: #C3C3C3\'>' + b.explanation + '</div>';
            if (b.duration) {
                d += bold_prop_line('Duration', (b.duration / 1000) + ' seconds', 'gray')
            }
            if (b.cooldown) {
                d += bold_prop_line('Cooldown', (b.cooldown / 1000) + ' seconds', 'gray')
            }
            if (b.mp) {
                d += bold_prop_line('MP', b.mp, colors.mp)
            }
        }
    }
    d += '</div>';
    $(a).html(d)
}
function render_computer_network(a) {
    var b = '<div style=\'background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px;\' class=\'buyitem\'><div class=\'computernx\'></div></div>';
    $(a).html(b);
    render_computer($('.computernx'))
}
function render_item(e, i) {
    var item = i.item,
        id = i.name,
        color = 'gray',
        value = i.value,
        j = i.cash,
        itemName = item.name;
    var m = i && i.actual;
    var properties = calculate_item_properties(item, m || {
            }),
        grade = calculate_item_grade(item, m || {
            });
    var html = '';
    html += '<div style=\'background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; ' + (i.styles || '') + '\' class=\'buyitem\'>';
    if (!item) {
        html += 'ITEM'
    } else {
        color = '#E4E4E4';
        if (item.grade == 'mid') {
            color = 'blue'
        }
        if (m && m.p == 'shiny') {
            itemName = 'Shiny ' + itemName
        }
        if (properties.level) {
            itemName += ' +' + properties.level
        }
        if (i.thumbnail) {
            html += '<div>' + item_container({
                    skin: item.skin,
                    def: item
                }) + '</div>'
        }
        html += '<div style=\'color: ' + color + '; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px\' class=\'cbold\'>' + itemName + '</div>';
        (item.gives || []).forEach(function (o) {
            if (o[0] == 'hp') {
                html += bold_prop_line('HP', '+' + o[1], colors.hp)
            }
            if (o[0] == 'mp') {
                html += bold_prop_line('MP', '+' + o[1], colors.mp)
            }
        });
        if (properties.gold) {
            html += bold_prop_line('Gold', '+' + properties.gold + '%', 'gold')
        }
        if (properties.luck) {
            html += bold_prop_line('Luck', '+' + properties.luck + '%', '#5DE376')
        }
        if (properties.lifesteal) {
            html += bold_prop_line('Lifesteal', properties.lifesteal + '%', '#9A1D27')
        }
        if (properties.evasion) {
            html += bold_prop_line('Evasion', properties.evasion + '%', '#7AC0F5')
        }
        if (properties.reflection) {
            html += bold_prop_line('Reflection', properties.reflection + '%', '#B484E5')
        }
        if (properties.dreturn) {
            html += bold_prop_line('D.Return', properties.dreturn + '%', '#E94959')
        }
        if (properties.crit) {
            html += bold_prop_line('Crit', properties.crit + '%', '#E52967')
        }
        if (properties.attack) {
            html += bold_prop_line('Damage', properties.attack, colors.attack)
        }
        if (properties.range) {
            html += bold_prop_line('Range', '+' + properties.range, colors.range)
        }
        if (properties.hp) {
            html += bold_prop_line('HP', properties.hp, colors.hp)
        }
        if (properties.str) {
            html += bold_prop_line('Strength', properties.str, colors.str)
        }
        if (properties['int']) {
            html += bold_prop_line('Intelligence', properties['int'], colors['int'])
        }
        if (properties.dex) {
            html += bold_prop_line('Dexterity', properties.dex, colors.dex)
        }
        if (properties.vit) {
            html += bold_prop_line('Vitality', properties.vit, colors.hp)
        }
        if (properties.mp) {
            html += bold_prop_line('MP', properties.mp, colors.mp)
        }
        if (properties.stat) {
            html += bold_prop_line('Stat', properties.stat)
        }
        if (properties.armor) {
            html += bold_prop_line('Armor', properties.armor, colors.armor)
        }
        if (properties.apiercing) {
            html += bold_prop_line('A.Piercing', properties.apiercing, colors.armor)
        }
        if (properties.rpiercing) {
            html += bold_prop_line('R.Piercing', properties.rpiercing, colors.resistance)
        }
        if (properties.resistance) {
            html += bold_prop_line('Resistance', properties.resistance, colors.resistance)
        }
        if (item.wspeed == 'slow') {
            html += bold_prop_line('Speed', 'Slow', 'gray')
        }
        if (properties.speed) {
            html += bold_prop_line(item.wtype && 'Run Speed' || 'Speed', ((properties.speed > 0) && '+' || '') + properties.speed, colors.speed)
        }
        if (properties.charisma) {
            html += bold_prop_line('Charisma', properties.charisma, '#4DB174')
        }
        if (properties.cuteness) {
            html += bold_prop_line('Cuteness', properties.cuteness, '#FD82F0')
        }
        if (grade == 1) {
            html += bold_prop_line('Grade', 'High', '#696354')
        }
        if (grade == 2) {
            html += bold_prop_line('Grade', 'Rare', '#6668AC')
        }
        if (m && item.type == 'elixir' && i.slot == 'elixir') {
            var h = round(( - msince(new Date(m.expires))) / (6)) / 10;
            html += bold_prop_line('Hours', h, 'gray')
        } else {
            if (item.type == 'elixir') {
                html += bold_prop_line('Hours', item.duration, 'gray')
            }
        }
        if (item.ability) {
            if (item.ability == 'bash') {
                html += bold_prop_line('Ability', 'Bash', colors.ability);
                html += '<div style=\'color: #C3C3C3\'>Stuns the opponent for ' + properties.attr1 + ' seconds with ' + properties.attr0 + '% chance.</div>'
            }
            if (item.ability == 'secondchance') {
                html += bold_prop_line('Ability', 'Second Chance', colors.ability);
                html += '<div style=\'color: #C3C3C3\'>Avoid death with a ' + properties.attr0 + '% chance.</div>'
            }
        }
        if (item.explanation) {
            html += '<div style=\'color: #C3C3C3\'>' + item.explanation + '</div>'
        }
        if (i.trade && m) {
            html += '<div style=\'margin-top: 5px\'>';
            if ((m.q || 1) > 1) {
                html += '<div><span class=\'gray\'>Q:</span> <div class=\'inline-block tradenum\' contenteditable=true data-q=\'' + m.q + '\'>' + m.q + '</div></div>'
            }
            html += '<div><span style=\'color:gold\'>GOLD' + (((m.q || 1) > 1) && ' [EACH]' || '') + ':</span> <div class=\'inline-block sellprice editable\' contenteditable=true>1</div></div>';
            html += '<div><span class=\'clickable\' onclick=\'trade("' + i.slot + '","' + i.num + '",$(".sellprice").html(),$(".tradenum").html())\'>PUT UP FOR SALE</span></div>';
            html += '</div>'
        }
        if (in_arr(i.slot, trade_slots) && m && m.price && i.from_player) {
            if ((m.q || 1) > 1) {
                html += '<div><span class=\'gray\'>Q:</span> <div class=\'inline-block tradenum\' contenteditable=true data-q=\'1\'>1</div></div>'
            }
            html += '<div style=\'color: gold\'>' + to_pretty_num(m.price) + ' GOLD' + ((m.q || 1) > 1 && ' <span style=\'color: white\'>[EACH]</span>' || '') + '</div>';
            html += '<div><span class=\'clickable\' onclick=\'trade_buy("' + i.slot + '","' + i.from_player + '","' + (m.rid || '') + '",$(".tradenum").html())\'>BUY</span></div>'
        }
        if (value) {
            if (item.days) {
                html += '<div style=\'color: #C3C3C3\'>Lasts 30 days</div>'
            }
            if (j) {
                html += '<div style=\'color: ' + colors.cash + '\'>' + to_pretty_num(item.cash) + ' SHELLS</div>'
            } else {
                html += '<div style=\'color: gold\'>' + to_pretty_num(value) + ' GOLD</div>'
            }
            if (j && character && item.cash >= character.cash) {
                html += '<div style=\'border-top: solid 2px gray; margin-bottom: 2px; margin-top: 3px; margin-left: -1px; margin-right: -1px\'></div>';
                html += '<div style=\'color: #C3C3C3\'>You can find SHELLS from gems, monsters. In future, from achievements. For the time being, to receive SHELLS and support our game:</div>';
                html += '<a href=\'https://adventure.land/shells\' class=\'cancela\' target=\'_blank\'><span class=\'clickable\' style=\'color: #EB8D3F\'>BUY or EARN SHELLS</span></a> '
            } else {
                if (item.s) {
                    var a = 1;
                    if (item.gives) {
                        a = 100
                    }
                    html += '<div style=\'margin-top: 5px\'><!--<input type=\'number\' value=\'1\' class=\'buynum itemnumi\'/> -->';
                    html += '<span class=\'gray\'>Q:</span> <div class=\'inline-block buynum\' contenteditable=true data-q=\'' + a + '\'>' + a + '</div> <span class=\'gray\'>|</span> ';
                    html += '<span class=\'clickable\' onclick=\'buy("' + id + '",parseInt($(".buynum").html()))\'>BUY</span> ';
                    html += '</div>'
                } else {
                    html += '<div><span class=\'clickable\' onclick=\'buy("' + id + '")\'>BUY</span></div>'
                }
            }
        }
        if (i.sell && m) {
            var l = calculate_item_value(m);
            html += '<div style=\'color: gold\'>' + to_pretty_num(l) + ' GOLD</div>';
            if (item.s && m.q) {
                var a = m.q;
                html += '<div style=\'margin-top: 5px\'>';
                html += '<span class=\'gray\'>Q:</span> <div class=\'inline-block sellnum\' contenteditable=true data-q=\'' + a + '\'>' + a + '</div> <span class=\'gray\'>|</span> ';
                html += '<span class=\'clickable\' onclick=\'sell("' + i.num + '",parseInt($(".sellnum").html()))\'>SELL</span> ';
                html += '</div>'
            } else {
                html += '<div><span class=\'clickable\' onclick=\'sell("' + i.num + '")\'>SELL</span></div>'
            }
        }
        if (i.cancel) {
            html += '<div class=\'clickable\' onclick=\'$(this).parent().remove()\'>CLOSE</div>'
        }
        if (in_arr(id, booster_items)) {
            if (m && m.expires) {
                var h = round(( - msince(new Date(m.expires))) / (6 * 24)) / 10;
                html += '<div style=\'color: #C3C3C3\'>' + h + ' days</div>'
            }
            html += '<div class=\'clickable\' onclick="btc(event); show_modal($(\'#boosterguide\').html())" style="color: #D86E89">HOW TO USE</div>'
        }
        if (m && m.name == 'computer' && gameplay == 'normal') {
            html += '<div style=\'color: #97C4B8\'>The Computer will regain it\'s capabilities soon.</div>'
        }
        if (m && m.name == 'computer' && (i.sell || m.charges !== 0) && gameplay == 'normal') {
            html += '<div style=\'color: #C3C3C3\'>CHARGES: ' + (m.charges === undefined && 2 || m.charges) + '</div>'
        }
        if (!value && !i.sell && m && !i.from_player && !i.trade) {
            if (item.type == 'stand') {
                html += '<div class=\'clickable\' onclick=\'socket.emit("trade_history",{}); $(this).parent().remove()\' style="color: #44484F">TRADE HISTORY</div>'
            }
            if (item.type == 'computer' && (m.charges === undefined || m.charges) && gameplay == 'normal') {
                html += '<div class=\'clickable\' onclick=\'socket.emit("unlock",{name:"code",num:"' + i.num + '"});\' style="color: #BA61A4">UNLOCK</div>'
            }
            if (item.type == 'computer') {
                html += '<div class=\'clickable\' onclick=\'render_computer($(this).parent())\' style="color: #32A3B0">NETWORK</div>'
            }
            if (item.type == 'stand' && !character.stand) {
                html += '<div class=\'clickable\' onclick=\'open_merchant("' + i.num + '"); $(this).parent().remove()\' style="color: #8E5E2C">OPEN</div>'
            }
            if (item.type == 'stand' && character.stand) {
                html += '<div class=\'clickable\' onclick=\'close_merchant(); $(this).parent().remove()\' style="color: #8E5E2C">CLOSE</div>'
            }
            if (item.type == 'elixir') {
                html += '<div class=\'clickable\' onclick=\'socket.emit("equip",{num:"' + i.num + '"}); $(this).parent().remove()\' style="color: #D86E89">DRINK</div>'
            }
            if (in_arr(m.name, [
                    'stoneofxp',
                    'stoneofgold',
                    'stoneofluck'
                ])) {
                html += '<div class=\'clickable\' onclick=\'socket.emit("convert",{num:"' + i.num + '"});\' style="color: ' + colors.cash + '">CONVERT TO SHELLS</div>'
            }
            if (in_arr(m.name, booster_items)) {
                if (m.expires) {
                    html += '<div class=\'clickable\' onclick=\'shift("' + i.num + '","' + booster_items[(booster_items.indexOf(m.name) + 1) % 3] + '"); $(this).parent().remove()\' style="color: #438EE2">SHIFT</div>'
                } else {
                    html += '<div class=\'clickable\' onclick=\'activate("' + i.num + '","activate"); $(this).parent().remove()\' style="color: #438EE2">ACTIVATE</div>'
                }
            }
        }
    }
    html += '</div>';
    if (e == 'html') {
        return html
    } else {
        $(e).html(html)
    }
}
function render_item_selector(a, c) {
    if (c && !c.purpose) {
        purpose = 'buying'
    }
    var b = [
        ],
        g = 0,
        e = '<div style=\'border: 5px solid gray; height: 400px; overflow: scroll; background: black\'>';
    for (var h in G.items) {
        if (!G.items[h].ignore) {
            b.push(G.items[h])
        }
    }
    b.sort(function (j, i) {
        return i.g - j.g
    });
    for (var d = 0; d < b.length; d++) {
        var f = b[d];
        e += item_container({
            skin: f.skin,
            def: f,
            onclick: 'gallery_click(\'' + f.id + '\')'
        });
        g++;
        if (!(g % 5)) {
            e += '<br />'
        }
    }
    e += '</div>';
    $(a).html(e)
}
function on_skill(b) {
    var a = skillmap[b];
    if (!a) {
        return
    }
    use_skill(a.name, ctarget)
}
function allow_drop(a) {
    a.preventDefault()
}
function on_drag_start(a) {
    last_drag_start = new Date();
    a.dataTransfer.setData('text', a.target.id)
}
function on_rclick(g) {
    var b = $(g),
        a = b.data('inum'),
        f = b.data('snum'),
        c = b.data('sname'),
        h = b.data('onrclick');
    if (h) {
        smart_eval(h)
    } else {
        if (c !== undefined) {
            socket.emit('unequip', {
                slot: c
            })
        } else {
            if (f !== undefined) {
                socket.emit('bank', {
                    operation: 'swap',
                    inv: - 1,
                    str: f,
                    pack: last_rendered_items
                })
            } else {
                if (a !== undefined) {
                    if (topleft_npc == 'items') {
                        socket.emit('bank', {
                            operation: 'swap',
                            inv: a,
                            str: - 1,
                            pack: last_rendered_items
                        })
                    } else {
                        if (topleft_npc == 'merchant') {
                            var i = character.items[parseInt(a)];
                            if (!i) {
                                return
                            }
                            render_item('#merchant-item', {
                                item: G.items[i.name],
                                name: i.name,
                                actual: i,
                                sell: 1,
                                num: parseInt(a)
                            })
                        } else {
                            if (topleft_npc == 'exchange') {
                                var g = character.items[a],
                                    d = null;
                                if (g) {
                                    d = G.items[g.name]
                                }
                                if (!d) {
                                    return
                                }
                                if (d.quest && exchange_type != d.quest) {
                                    return
                                }
                                if (d.e) {
                                    if (e_item !== null) {
                                        return
                                    }
                                    e_item = a;
                                    var e = $('#citem' + a).all_html();
                                    $('#citem' + a).parent().html('');
                                    $('#eitem').html(e)
                                }
                            } else {
                                if (topleft_npc == 'upgrade') {
                                    var g = character.items[a],
                                        d = null;
                                    if (g) {
                                        d = G.items[g.name]
                                    }
                                    if (!d) {
                                        return
                                    }
                                    if (d.upgrade) {
                                        if (u_item !== null) {
                                            return
                                        }
                                        u_item = a;
                                        var e = $('#citem' + a).all_html();
                                        $('#citem' + a).parent().html('');
                                        $('#uweapon').html(e)
                                    }
                                    if (d.type == 'uscroll' || d.type == 'pscroll') {
                                        if (u_scroll !== null) {
                                            return
                                        }
                                        u_scroll = a;
                                        var e = $('#citem' + a).all_html();
                                        if ((character.items[a].q || 1) < 2) {
                                            $('#citem' + a).parent().html('')
                                        }
                                        $('#uscroll').html(e)
                                    }
                                    if (d.type == 'offering') {
                                        if (u_offering !== null) {
                                            return
                                        }
                                        u_offering = a;
                                        var e = $('#citem' + a).all_html();
                                        if ((character.items[a].q || 1) < 2) {
                                            $('#citem' + a).parent().html('')
                                        }
                                        $('#uoffering').html(e)
                                    }
                                } else {
                                    if (topleft_npc == 'compound') {
                                        var g = character.items[a],
                                            d = null;
                                        if (g) {
                                            d = G.items[g.name]
                                        }
                                        if (!d) {
                                            return
                                        }
                                        if (d.compound && c_last < 3) {
                                            c_items[c_last] = a;
                                            var e = $('#citem' + a).all_html();
                                            $('#citem' + a).parent().html('');
                                            $('#compound' + c_last).html(e);
                                            c_last++
                                        }
                                        if (d.type == 'cscroll') {
                                            if (c_scroll !== null) {
                                                return
                                            }
                                            c_scroll = a;
                                            var e = $('#citem' + a).all_html();
                                            if ((character.items[a].q || 1) < 2) {
                                                $('#citem' + a).parent().html('')
                                            }
                                            $('#cscroll').html(e)
                                        }
                                        if (d.type == 'offering') {
                                            if (c_offering !== null) {
                                                return
                                            }
                                            c_offering = a;
                                            var e = $('#citem' + a).all_html();
                                            if ((character.items[a].q || 1) < 2) {
                                                $('#citem' + a).parent().html('')
                                            }
                                            $('#coffering').html(e)
                                        }
                                    } else {
                                        if (topleft_npc == 'crafter') {
                                            var g = character.items[a],
                                                d = null;
                                            if (g) {
                                                d = G.items[g.name]
                                            }
                                            if (!d) {
                                                return
                                            }
                                            if (cr_last < 9) {
                                                cr_items[cr_last] = a;
                                                var e = $('#citem' + a).all_html();
                                                $('#citem' + a).parent().html('');
                                                $('#critem' + cr_last).html(e);
                                                cr_last++
                                            }
                                        } else {
                                            a = parseInt(a, 10);
                                            if (character && character.items[a] && G.items[character.items[a].name].type == 'elixir') {
                                                return
                                            }
                                            socket.emit('equip', {
                                                num: a
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function on_drop(event) {
    event.preventDefault();
    var r = event.dataTransfer.getData('text'),
        j = false,
        l = false;
    var c = $(document.getElementById(r)),
        q = $(event.target);
    while (q && q.parent() && q.attr('ondrop') == undefined) {
        q = q.parent()
    }
    var b = q.data('cnum'),
        d = q.data('slot'),
        a = q.data('strnum'),
        o = q.data('trigrc'),
        h = q.data('skillid');
    var s = c.data('inum'),
        p = c.data('sname'),
        i = c.data('snum');
    if (s !== undefined && h !== undefined) {
        s = parseInt(s);
        if ((s || s === 0) && character.items[s] && G.items[character.items[s].name].gives) {
            skillmap[h] = {
                type: 'item',
                name: character.items[s].name
            };
            render_skillbar()
        }
    } else {
        if (o != undefined && s != undefined) {
            on_rclick(c.get(0))
        } else {
            if (i != undefined && a != undefined) {
                socket.emit('bank', {
                    operation: 'move',
                    a: i,
                    b: a,
                    pack: last_rendered_items
                });
                j = true
            } else {
                if (a != undefined && s != undefined) {
                    socket.emit('bank', {
                        operation: 'swap',
                        inv: s,
                        str: a,
                        pack: last_rendered_items
                    });
                    l = true
                } else {
                    if (b != undefined && i != undefined) {
                        socket.emit('bank', {
                            operation: 'swap',
                            inv: b,
                            str: i,
                            pack: last_rendered_items
                        });
                        l = true
                    } else {
                        if (b !== undefined && b == s) {
                            if (is_mobile && mssince(last_drag_start) < 300) {
                                inventory_click(parseInt(s))
                            }
                        } else {
                            if (b != undefined && s != undefined) {
                                socket.emit('imove', {
                                    a: b,
                                    b: s
                                });
                                j = true
                            } else {
                                if (p !== undefined && p == d) {
                                    if (is_mobile && mssince(last_drag_start) < 300) {
                                        slot_click(d)
                                    }
                                } else {
                                    if (b != undefined && p != undefined) {
                                        socket.emit('unequip', {
                                            slot: p,
                                            position: b
                                        })
                                    } else {
                                        if (d != undefined && s != undefined) {
                                            if (in_arr(d, trade_slots)) {
                                                if (character.slots[d]) {
                                                    return
                                                }
                                                try {
                                                    var k = character.items[parseInt(s)];
                                                    render_item('#topleftcornerdialog', {
                                                        trade: 1,
                                                        item: G.items[k.name],
                                                        actual: k,
                                                        num: parseInt(s),
                                                        slot: d
                                                    });
                                                    $('.editable').focus();
                                                    dialogs_target = ctarget
                                                } catch (n) {
                                                    console.log('TRADE-ERROR: ' + n)
                                                }
                                            } else {
                                                socket.emit('equip', {
                                                    num: s,
                                                    slot: d
                                                }),
                                                    l = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (j) {
        var g = c.all_html(),
            f = q.html();
        q.html('');
        c.parent().html(f);
        q.html(g)
    }
    if (l) {
        q.html(c.all_html())
    }
}
function item_container(r, l) {
    var g = '',
        d = '',
        q = 3,
        h = '',
        c = '',
        m = '',
        a = '',
        n = r.bcolor || 'gray',
        s = '',
        j = r.size || 40;
    if (l && l.level && l.level > 8) {
        n = '#C5C5C5'
    }
    if (r.draggable || !('draggable' in r)) {
        h += ' draggable=\'true\' ondragstart=\'on_drag_start(event)\'';
        c += 'ondrop=\'on_drop(event)\' ondragover=\'allow_drop(event)\''
    }
    if (r.droppable) {
        r.trigrc = true;
        c += 'ondrop=\'on_drop(event)\' ondragover=\'allow_drop(event)\''
    }
    if (r.onclick) {
        c += ' onclick="' + r.onclick + '" class="clickable" '
    }
    if (r.cnum != undefined) {
        a = 'data-cnum=\'' + r.cnum + '\' '
    }
    if (r.trigrc != undefined) {
        a = 'data-trigrc=\'1\''
    }
    if (r.strnum != undefined) {
        a = 'data-strnum=\'' + r.strnum + '\' '
    }
    if (r.slot != undefined) {
        a = 'data-slot=\'' + r.slot + '\' '
    }
    if (r.cid) {
        c += ' id=\'' + r.cid + '\' '
    }
    g += '<div ' + a + 'style=\'position: relative; display:inline-block; border: 2px solid ' + n + '; margin: 2px; height: ' + (j + 2 * q) + 'px; width: ' + (j + 2 * q) + 'px; background: black; vertical-align: top\' ' + c + '>';
    if (r.skid && !r.skin) {
        g += '<div class=\'truui\' style=\'border-color: gray; color: white\'>' + r.skid + '</div>'
    }
    if (r.shade) {
        var o = G.itemsets[G.positions[r.shade][0] || 'pack_1a'],
            b = j / o.size;
        var k = G.positions[r.shade][1],
            i = G.positions[r.shade][2];
        g += '<div style=\'position: absolute; top: -2px; left: -2px; padding:' + (q + 2) + 'px\'>';
        g += '<div style=\'overflow: hidden; height: ' + (j) + 'px; width: ' + (j) + 'px;\'>';
        g += '<img style=\'width: ' + (o.columns * o.size * b) + 'px; height: ' + (o.rows * o.size * b) + 'px; margin-top: -' + (i * j) + 'px; margin-left: -' + (k * j) + 'px; opacity: ' + (r.s_op || 0.2) + ';\' src=\'' + o.file + '\' draggable=\'false\' />';
        g += '</div>';
        g += '</div>'
    }
    if (r.skin) {
        if (!G.positions[r.skin]) {
            r.skin = 'placeholder'
        }
        var p = G.itemsets[G.positions[r.skin][0] || 'pack_1a'],
            f = G.positions[r.skin][1],
            e = G.positions[r.skin][2];
        var t = j / p.size;
        if (l && l.level && l.level > 7) {
            s += ' glow' + r.level
        }
        if (r.num != undefined) {
            m = 'class=\'rclick' + s + '\' data-inum=\'' + r.num + '\''
        }
        if (r.snum != undefined) {
            m = 'class=\'rclick' + s + '\' data-snum=\'' + r.snum + '\''
        }
        if (r.sname != undefined) {
            m = 'class=\'rclick' + s + '\' data-sname=\'' + r.sname + '\''
        }
        if (r.on_rclick) {
            m = 'class=\'rclick' + s + '\' data-onrclick="' + r.on_rclick + '"'
        }
        g += '<div ' + m + ' style=\'background: black; position: absolute; bottom: -2px; left: -2px; border: 2px solid ' + n + ';';
        g += 'padding:' + (q) + 'px; overflow: hidden\' id=\'' + r.id + '\' ' + h + '>';
        g += '<div style=\'overflow: hidden; height: ' + (j) + 'px; width: ' + (j) + 'px;\'>';
        g += '<img style=\'width: ' + (p.columns * p.size * t) + 'px; height: ' + (p.rows * p.size * t) + 'px; margin-top: -' + (e * j) + 'px; margin-left: -' + (f * j) + 'px;\' src=\'' + p.file + '\' draggable=\'false\' />';
        g += '</div>';
        if (l) {
            if (l.q && l.q != 1) {
                g += '<div class=\'iqui\'>' + l.q + '</div>'
            }
            if (l.level) {
                g += '<div class=\'iuui level' + l.level + '\' style=\'border-color: ' + n + '\'>' + (l.level == 10 && 'X' || l.level) + '</div>'
            }
        }
        if (r.slot && in_arr(r.slot, trade_slots)) {
            g += '<div class=\'truui\' style=\'border-color: ' + n + ';\'>$</div>'
        }
        if (r.skid) {
            g += '<div class=\'skidloader' + r.skid + '\' style=\'position: absolute; bottom: 0px; right: 0px; width: 4px; height: 0px; background-color: yellow\'></div>';
            g += '<div class=\'truui\' style=\'border-color: gray; color: white\'>' + r.skid + '</div>'
        }
        g += '</div>'
    }
    g += '</div>';
    return g
}
function load_skills() {
    if (0) {
    } else {
        if (character.ctype == 'warrior' || character.ctype == 'rogue') {
            skillbar = [
                '1',
                '2',
                '3',
                'Q',
                'R'
            ]
        } else {
            if (character.ctype == 'merchant') {
                skillbar = [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5'
                ]
            } else {
                skillbar = [
                    '1',
                    '2',
                    '3',
                    '4',
                    'R'
                ]
            }
        }
        if (character.ctype == 'warrior') {
            skillmap = {
                '1': {
                    name: 'use_hp'
                },
                '2': {
                    name: 'use_mp'
                },
                Q: {
                    name: 'taunt'
                },
                R: {
                    name: 'charge'
                }
            }
        } else {
            if (character.ctype == 'mage') {
                skillmap = {
                    '1': {
                        name: 'use_hp'
                    },
                    '2': {
                        name: 'use_mp'
                    },
                    Q: {
                        name: 'light'
                    },
                    R: {
                        name: 'burst'
                    }
                }
            } else {
                if (character.ctype == 'priest') {
                    skillmap = {
                        '1': {
                            name: 'use_hp'
                        },
                        '2': {
                            name: 'use_mp'
                        },
                        R: {
                            name: 'curse'
                        }
                    }
                } else {
                    if (character.ctype == 'ranger') {
                        skillmap = {
                            '1': {
                                name: 'use_hp'
                            },
                            '2': {
                                name: 'use_mp'
                            },
                            R: {
                                name: 'supershot'
                            }
                        }
                    } else {
                        if (character.ctype == 'rogue') {
                            skillmap = {
                                '1': {
                                    name: 'use_hp'
                                },
                                '2': {
                                    name: 'use_mp'
                                },
                                R: {
                                    name: 'invis'
                                },
                                Q: {
                                    name: 'pcoat'
                                }
                            }
                        } else {
                            if (character.ctype == 'merchant') {
                                skillmap = {
                                    '1': {
                                        name: 'use_hp'
                                    },
                                    '2': {
                                        name: 'use_mp'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        skillmap.X = {
            name: 'use_town'
        }
    }
}
function render_skillbar(b) {
    if (b) {
        $('#skillbar').html('').hide();
        return
    }
    var a = '<div style=\'background-color: black; border: 5px solid gray; padding: 2px; display: inline-block\' class=\'enableclicks\'>';
    skillbar.forEach(function (d) {
        var c = skillmap[d];
        if (c) {
            a += item_container({
                skid: d,
                skin: G.skills[c.name].skin,
                draggable: false
            }, c)
        } else {
            a += item_container({
                skid: d,
                draggable: false
            })
        }
        a += '<div></div>'
    });
    a += '</div>';
    $('#skillbar').html(a).css('display', 'inline-block')
}
function skill_click(a) {
    if (skillsui && skillmap[a]) {
        render_skill('#skills-item', skillmap[a].name, skillmap[a])
    }
}
function render_skills() {
    var e = 0,
        a = 'text-align: right';
    if (skillsui) {
        $('#theskills').remove();
        skillsui = false;
        render_skillbar();
        return
    }
    var d = '<div id=\'skills-item\' style=\'display: inline-block; vertical-align: top; margin-right: 5px\'></div>';
    d += '<div style=\'background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block\'>';
    d += '<div class=\'textbutton\' style=\'margin-left: 5px\'>SLOTS</div>';
    d += '<div>';
    [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7'
    ].forEach(function (f) {
        d += item_container({
            skid: f,
            skin: skillmap[f] && (G.skills[skillmap[f].name] && G.skills[skillmap[f].name].skin || skillmap[f].name),
            onclick: 'skill_click(\'' + f + '\')'
        }, skillmap[f])
    });
    d += '</div>';
    d += '<div>';
    [
        'Q',
        'W',
        'E',
        'R',
        'TAB',
        'X',
        '8'
    ].forEach(function (f) {
        d += item_container({
            skid: f,
            skin: skillmap[f] && (G.skills[skillmap[f].name] && G.skills[skillmap[f].name].skin || skillmap[f].name),
            onclick: 'skill_click(\'' + f + '\')'
        }, skillmap[f])
    });
    d += '</div>';
    d += '<div class=\'textbutton\' style=\'margin-left: 5px\'>ABILITIES <span style=\'float:right; color: #99D9B9; margin-right: 5px\'>WORK IN PROGRESS!</span></div>';
    for (var c = 0; c < 2; c++) {
        d += '<div>';
        for (var b = 0; b < 7; b++) {
            d += item_container({
            })
        }
        d += '</div>'
    }
    d += '<div class=\'textbutton\' style=\'margin-left: 5px\'>SKILLS</div>';
    d += '<div>';
    for (var b = 0; b < 7; b++) {
        d += item_container({
        })
    }
    d += '</div>';
    d += '</div>';
    skillsui = true;
    render_skillbar(1);
    $('body').append('<div id=\'theskills\' style=\'position: fixed; z-index: 310; bottom: 0px; right: 0px\'></div>');
    $('#theskills').html(d)
}
function render_interaction(h, f) {
    topleft_npc = 'interaction';
    rendered_target = topleft_npc;
    rendered_interaction = h;
    var b = 0,
        i = 0,
        d = '/images/tiles/characters/npc1.png',
        c = 'normal';
    var g = '<div style=\'background-color: #E5E5E5; color: #010805; border: 5px solid gray; padding: 6px 12px 6px 12px; font-size: 30px; display: inline-block; max-width: 420px\'>';
    if (in_arr(h, [
            'wizard'
        ])) {
        b = 2;
        i = 0;
        d = '/images/tiles/characters/chara8.png'
    } else {
        if (in_arr(h, [
                'santa',
                'candycane_success'
            ])) {
            b = 0;
            i = 0;
            d = '/images/tiles/characters/animationc.png';
            c = 'animation'
        } else {
            if (in_arr(h, [
                    'leathers',
                    'leather_success'
                ])) {
                b = 1;
                i = 0;
                d = '/images/tiles/characters/npc5.png'
            } else {
                if (in_arr(h, [
                        'lostearring',
                        'lostearring_success'
                    ])) {
                    b = 3;
                    i = 0;
                    d = '/images/tiles/characters/chara8.png'
                } else {
                    if (in_arr(h, [
                            'mistletoe',
                            'mistletoe_success'
                        ])) {
                        b = 0;
                        i = 0;
                        d = '/images/tiles/characters/chara8.png'
                    } else {
                        if (in_arr(h, [
                                'ornaments',
                                'ornament_success'
                            ])) {
                            b = 1;
                            i = 0;
                            d = '/images/tiles/characters/chara8.png'
                        } else {
                            if (in_arr(h, [
                                    'jailer',
                                    'guard',
                                    'blocker'
                                ])) {
                                b = 3;
                                i = 0;
                                d = '/images/tiles/characters/chara5.png'
                            } else {
                                if (in_arr(h, [
                                        'seashells',
                                        'seashell_success'
                                    ])) {
                                    b = 0;
                                    i = 1;
                                    d = '/images/tiles/characters/npc1.png'
                                } else {
                                    if (in_arr(h, [
                                            'lottery'
                                        ])) {
                                        b = 3;
                                        i = 0;
                                        d = '/images/tiles/characters/npc6.png'
                                    } else {
                                        if (in_arr(h, [
                                                'newupgrade'
                                            ])) {
                                            b = 3;
                                            i = 1;
                                            d = '/images/tiles/characters/chara8.png'
                                        } else {
                                            if (h == 'tavern') {
                                                b = 0;
                                                i = 1;
                                                d = '/images/tiles/characters/custom1.png'
                                            } else {
                                                if (h == 'standmerchant') {
                                                    b = 3;
                                                    i = 0;
                                                    d = '/images/tiles/characters/npc5.png'
                                                } else {
                                                    if (h == 'subscribe') {
                                                        b = 3;
                                                        i = 1;
                                                        d = '/images/tiles/characters/chara7.png'
                                                    } else {
                                                        if (in_arr(h, [
                                                                'gemfragments',
                                                                'gemfragment_success'
                                                            ])) {
                                                            b = 2;
                                                            i = 1;
                                                            d = '/images/tiles/characters/npc1.png'
                                                        } else {
                                                            if (in_arr(h, [
                                                                    'unlock_items2',
                                                                    'unlock_items3',
                                                                    'unlock_items4',
                                                                    'unlock_items5',
                                                                    'unlock_items6',
                                                                    'unlock_items7'
                                                                ])) {
                                                                b = 3;
                                                                i = 1;
                                                                d = '/images/tiles/characters/npc4.png';
                                                                if (h == 'unlock_items2') {
                                                                    i = 1,
                                                                        b = 0
                                                                }
                                                                if (h == 'unlock_items3') {
                                                                    i = 1,
                                                                        b = 0
                                                                }
                                                                if (h == 'unlock_items4') {
                                                                    i = 1,
                                                                        b = 2
                                                                }
                                                                if (h == 'unlock_items5') {
                                                                    i = 1,
                                                                        b = 2
                                                                }
                                                                if (h == 'unlock_items6') {
                                                                    i = 0,
                                                                        b = 1
                                                                }
                                                                if (h == 'unlock_items7') {
                                                                    i = 0,
                                                                        b = 1
                                                                }
                                                            } else {
                                                                return
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (c == 'normal') {
        g += '<div style=\'float: left; margin-top: -20px; width: 104px; height: 92px; overflow: hidden\'><img style=\'margin-left: -' + (104 * (b * 3 + 1)) + 'px; margin-top: -' + (144 * (i * 4)) + 'px; width: 1248px; height: 1152px;\' src=\'' + d + '\'/></div>'
    } else {
        g += '<div style=\'float: left; margin-top: -20px; width: 104px; height: 98px; overflow: hidden\'><img style=\'margin-left: -' + (188 * b + 40) + 'px; margin-top: -' + (200 * i + 50) + 'px; width: 2256px; height: 1600px;\' src=\'' + d + '\'/></div>'
    }
    if (h == 'seashells') {
        g += 'Ah, I love the sea, so calming. As a kid, I loved spending time on the beach. Collecting seashells. If you happen to find some, I would love to add them to my collection.';
        g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("seashell")\'>I HAVE 20!</div></span>'
    } else {
        if (h == 'seashell_success') {
            if (Math.random() < 0.001) {
                g += 'Awww. Ty. Ty. Ty. Xoxo.'
            } else {
                g += 'How kind of you! Please accept this small gift in return.'
            }
            d_text('+1', get_npc('fisherman'), {
                color: '#DFE9D9'
            })
        } else {
            if (h == 'subscribe') {
                g += 'It\'s that time of the day! Are you in?!';
                g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'socket.emit("signup")\'>SIGN ME UP!</div></span>'
            } else {
                if (h == 'tavern') {
                    g += 'Tavern. A place for adventurers to relax, drink, unwind, play games, wager, challenge each other in friendly games. Currently under construction.'
                } else {
                    if (h == 'newupgrade') {
                        g += 'Adventurer! I can upgrade your weapons or armors. Combine 3 accessories to make a stronger one! Tho, beware, the process isn\'t perfect. Sometimes the items are ... lost.';
                        g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_upgrade_shrine()\'>UPGRADE</div> <div class=\'slimbutton\' onclick=\'render_compound_shrine()\'>COMBINE</div></span>'
                    } else {
                        if (h == 'wizard') {
                            g += 'Well, Hello there! I\'m Wizard, I made this game. Hope you enjoy it. If you have any issues, suggestions, feel free to email me at hello@adventure.land!'
                        } else {
                            if (h == 'santa') {
                                g += 'Happy holidays! Please excuse my companion, he is a bit grumpy. If you happen to find any candy canes, that might cheer him up!';
                                g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("candycane")\'>I HAVE ONE!</div></span>'
                            } else {
                                if (h == 'standmerchant') {
                                    g += 'Anyone can become a merchant and start trading. You only need a merchant stand to display your items on!';
                                    g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_merchant(get_npc("standmerchant"))\'>LET ME BUY ONE!</div></span>'
                                } else {
                                    if (h == 'candycane_success') {
                                        g += 'Ah! Thanks for cheering him up. Here\'s something for you in return!'
                                    } else {
                                        if (h == 'lostearring') {
                                            g += 'Ewww. Ewww. Ewww. These wretched things ate my earrings. Kill them, kill them all. Bring my earrings back!';
                                            g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("lostearring")\'>AS YOU WISH</div></span>'
                                        } else {
                                            if (h == 'lostearring_success') {
                                                g += 'You did well. Here\'s something left from one of my old husbands...'
                                            } else {
                                                if (h == 'mistletoe') {
                                                    g += 'You know, It gets boring in here sometimes ... I\'m looking for some excitement. Uhm, Do you have a Mistletoe?';
                                                    g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("mistletoe")\'>OH MY, I DO!</div></span>'
                                                } else {
                                                    if (h == 'mistletoe_success') {
                                                        g += 'Haha! You thought I was going to give you a kiss?! You wish... Take this instead!'
                                                    } else {
                                                        if (h == 'ornaments') {
                                                            g += 'Hmm. We should decorate these trees. I need some Ornaments tho. If you happen to collect ' + G.items.ornament.e + ' of them, let me know!';
                                                            g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("ornament")\'>YOU GOT IT!</div></span>'
                                                        } else {
                                                            if (h == 'ornament_success') {
                                                                g += 'Thank you! Here\'s something in return.'
                                                            } else {
                                                                if (h == 'gemfragment_success') {
                                                                    g += 'Bwahahahahah *cough* Ehem.. Thanks! You got a good deal. Keep bringing these fragments to me, don\'t give them to anyone else.';
                                                                    d_text('+1', get_npc('gemmerchant'), {
                                                                        color: '#E78295'
                                                                    })
                                                                } else {
                                                                    if (h == 'gemfragments') {
                                                                        g += 'Back in the day we had miners, then came the moles, they work for free yet retrieving the gems is a challenge. Bring me ' + G.items.gemfragment.e + ' gem fragments and I can give you something exciting in return, no questions asked.';
                                                                        g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("gemfragment")\'>I GOT ' + G.items.gemfragment.e + '!</div></span>'
                                                                    } else {
                                                                        if (h == 'leathers') {
                                                                            g += 'Hey, hey, hey! What brings you to this cold land? I personally love it here, ideal for my work. If you can bring me ' + G.items.leather.e + ' Leathers, I can give you one of my products in return.';
                                                                            g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'render_exchange_shrine("leather")\'>I HAVE ' + G.items.leather.e + '!</div></span>'
                                                                        } else {
                                                                            if (h == 'leather_success') {
                                                                                g += 'Here you go! Enjoy! Keep bringing leathers to me, I have a lot to offer!';
                                                                                d_text('+1', get_npc('leathermerchant'), {
                                                                                    color: '#DFE9D9'
                                                                                })
                                                                            } else {
                                                                                if (h == 'jailer') {
                                                                                    g += 'Tu-tu-tu. Have you been a bad ' + (Math.random() < 0.5 && 'boy' || 'girl') + '? No worries. The lawmakers must see the potential in you, so instead of getting rid of you, they sent you here. You are free to leave whenever you want. But please don\'t repeat your mistake.';
                                                                                    g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'socket.emit("leave")\'>LEAVE</div></span>'
                                                                                } else {
                                                                                    if (h == 'blocker' || h == 'guard') {
                                                                                        var a = Math.random();
                                                                                        if (a < 0.5) {
                                                                                            g += 'Hmm. hmm. hmm. Can\'t let you pass. Check again later tho!'
                                                                                        } else {
                                                                                            g += 'There\'s some work going on inside. Maybe check back later!'
                                                                                        }
                                                                                    } else {
                                                                                        if (h == 'lottery') {
                                                                                            g += 'Hi Dear! The lottery tickets for this week haven\'t arrived yet. Apologies :)'
                                                                                        } else {
                                                                                            if (in_arr(h, [
                                                                                                    'unlock_items2',
                                                                                                    'unlock_items3',
                                                                                                    'unlock_items4',
                                                                                                    'unlock_items5',
                                                                                                    'unlock_items6',
                                                                                                    'unlock_items7'
                                                                                                ])) {
                                                                                                var k = 'items2',
                                                                                                    e = 75000000,
                                                                                                    j = 600;
                                                                                                if (h == 'unlock_items3') {
                                                                                                    k = 'items3'
                                                                                                }
                                                                                                if (h == 'unlock_items4') {
                                                                                                    k = 'items4',
                                                                                                        e = 100000000,
                                                                                                        j = 800
                                                                                                }
                                                                                                if (h == 'unlock_items5') {
                                                                                                    k = 'items5',
                                                                                                        e = 100000000,
                                                                                                        j = 800
                                                                                                }
                                                                                                if (h == 'unlock_items6') {
                                                                                                    k = 'items6',
                                                                                                        e = 112500000,
                                                                                                        j = 900
                                                                                                }
                                                                                                if (h == 'unlock_items7') {
                                                                                                    k = 'items7',
                                                                                                        e = 112500000,
                                                                                                        j = 900
                                                                                                }
                                                                                                g += 'Hello! You don\'t seem to have an account open with me. Would you like to open one? It costs ' + to_pretty_num(e) + ' Gold or ' + to_pretty_num(j) + ' Shells. We hold onto your items forever.';
                                                                                                g += '<span style=\'float: right; margin-top: 5px\'><div class=\'slimbutton\' onclick=\'socket.emit("bank",{operation:"unlock",gold:1,pack:"' + k + '"})\' style=\'margin-right: 5px;\'>USE GOLD</div><div class=\'slimbutton\' onclick=\'socket.emit("bank",{operation:"unlock",shells:1,pack:"' + k + '"})\'>USE SHELLS</div></span>'
                                                                                            } else {
                                                                                                return
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    g += '</div>';
    $('#topleftcornerui').html(g)
}
function load_nearby() {
    friends_inside = 'nearby';
    var c = '',
        a = false;
    for (var f in entities) {
        var b = entities[f];
        if (!is_player(b)) {
            continue
        }
        a = true
    }
    if (a) {
        c += '<table style=\'margin: 5px; text-align: center\'>';
        c += '<tr style=\'color: gray; text-decoration: underline\'><th style=\'width: 100px\'>Name</th><th style=\'width: 60px\'>Level</th><th style=\'width: 100px\'>Class</th><th style=\'width: 100px\'>Status</th><th style=\'width: 120px\'>Actions</th></tr>';
        for (var f in entities) {
            var b = entities[f],
                d = 'AFK',
                e = '';
            if (!is_player(b)) {
                continue
            }
            if (!b.afk) {
                d = '<span style=\'color: #34bf15\'>Active</span>'
            }
            if (b.owner && in_arr(b.owner, friends)) {
                e += ' <span style=\'color: #EC82C4\'>FRIENDS!</span>'
            } else {
                e += ' <span style=\'color: #2799DD\' class=\'clickable\' onclick=\'socket.emit("friend",{event:"request",name:"' + b.name + '"})\'>+FRIEND</span>'
            }
            if (!e) {
                e = 'None'
            }
            c += '<tr><td class=\'clickable\' onclick=\'target_player("' + b.name + '")\'>' + b.name + '</td><td>' + b.level + '</td><td>' + b.ctype.toUpperCase() + '</td><td>' + d + '</td><td>' + e + '</td></tr>'
        }
        c += '</table>'
    } else {
        c = '<div style=\'margin-top: 8px\'>There is no one nearby.</div>'
    }
    $('.friendslist').html(c);
    $('.friendslist').parent().find('.active2').removeClass('active2');
    $('.fnearby').addClass('active2')
}
function load_friends(b) {
    if (b) {
        if (friends_inside != 'friends') {
            return
        }
        var a = '';
        if (!b.chars.length) {
            a = '<div style=\'margin-top: 8px\'>No one online.</div>'
        } else {
            a += '<table style=\'margin: 5px; text-align: center\'>';
            a += '<tr style=\'color: gray; text-decoration: underline\'><th style=\'width: 100px\'>Name</th><th style=\'width: 60px\'>Level</th><th style=\'width: 100px\'>Class</th><th style=\'width: 100px\'>Status</th><th style=\'width: 120px\'>Server</th></tr>';
            b.chars.forEach(function (c) {
                var d = 'AFK';
                if (!c.afk) {
                    d = '<span style=\'color: #34bf15\'>Active</span>'
                }
                a += '<tr><td>' + c.name + '</td><td>' + c.level + '</td><td>' + c.type.toUpperCase() + '</td><td>' + d + '</td><td>' + c.server + '</td></tr>'
            });
            a += '</table>'
        }
        $('.friendslist').html(a)
    } else {
        friends_inside = 'friends';
        api_call('pull_friends');
        $('.friendslist').html('');
        $('.friendslist').parent().find('.active2').removeClass('active2');
        $('.ffriends').addClass('active2')
    }
}
function load_server_list(b) {
    if (b) {
        if (friends_inside != 'server') {
            return
        }
        var a = '';
        if (!b.length) {
            a = '<div style=\'margin-top: 8px\'>No one discoverable.</div>'
        } else {
            a += '<table style=\'margin: 5px; text-align: center\'>';
            a += '<tr style=\'color: gray; text-decoration: underline\'><th style=\'width: 100px\'>Name</th><th style=\'width: 60px\'>Level</th><th style=\'width: 100px\'>Class</th><th style=\'width: 100px\'>Status</th><th style=\'width: 120px\'>Party</th>';
            if (is_pvp) {
                a += '<th style=\'width: 120px\'>Kills</th>'
            }
            a += '</tr>';
            b.forEach(function (d) {
                var e = 'AFK',
                    c = d.party;
                if (!d.afk) {
                    e = '<span style=\'color: #34bf15\'>Active</span>'
                }
                if (!d.party && d.name != character.name) {
                    c = '<span style=\'color: #34BCAF\' class=\'clickable\' onclick=\'parent.socket.emit("party",{event:"invite",name:"' + d.name + '"})\'>Invite</span>'
                } else {
                    if (!d.party) {
                        c = '<span style=\'color: #999999\'>You</span>'
                    } else {
                        c = '<span style=\'color: #9F68C0\'>' + d.party + '</span>'
                    }
                }
                if (d.name != character.name) {
                    c += ' <span style=\'color: #A255BA\' class=\'clickable\' onclick=\'hide_modal(); cpm_window("' + d.name + '");\'>PM</span>'
                }
                a += '<tr><td>' + d.name + '</td><td>' + d.level + '</td><td>' + d.type.toUpperCase() + '</td><td>' + e + '</td><td>' + c + '</td>';
                if (is_pvp) {
                    a += '<td>' + to_pretty_num(d.kills) + '</td>'
                }
                a += '</tr>'
            });
            a += '</table>'
        }
        $('.friendslist').html(a)
    } else {
        friends_inside = 'server';
        socket.emit('players');
        $('.friendslist').html('');
        $('.friendslist').parent().find('.active2').removeClass('active2');
        $('.fserver').addClass('active2')
    }
}
function load_coming_soon(a) {
    var b = 'Coming Sooner!';
    $('.friendslist').parent().find('.active2').removeClass('active2');
    if (a == 1) {
        $('.fserver').addClass('active2')
    } else {
        if (a == 2) {
            $('.fguild').addClass('active2'),
                b = 'Coming Soon!'
        } else {
            if (a == 3) {
                $('.fleaders').addClass('active2'),
                    b = 'Planned, along with achievements, character statistics, weekly, monthly leaderboards'
            } else {
                if (a == 4) {
                    $('.fmail').addClass('active2'),
                        b = 'Coming Soon!'
                }
            }
        }
    }
    $('.friendslist').html('<div style=\'margin-top: 8px\'>' + b + '</div>')
}
var friends_inside = 'nearby';
function render_friends() {
    var a = '';
    a += '<div style=\'text-align: center\'>';
    a += '<div class=\'gamebutton ffriends\' onclick=\'load_friends()\'>Friends</div> <div class=\'gamebutton fnearby\' onclick=\'load_nearby()\'>Nearby</div>';
    if (!is_pvp || 1) {
        a += ' <div class=\'gamebutton fserver\' onclick=\'load_server_list();\'>Server</div>'
    }
    a += ' <div class=\'gamebutton fguild\' onclick=\'load_coming_soon(2)\'>Guild</div> <div class=\'gamebutton fmail\' onclick=\'load_coming_soon(4)\'>Mail</div> <div class=\'gamebutton fleaders\' onclick=\'load_coming_soon(3)\'>Leaderboards</div>';
    a += '<div class=\'friendslist mt5\' style=\'height: 400px; border: 5px solid gray; font-size: 24px; overflow: scroll; padding: 6px\'></div>';
    a += '<div style=\'font-size: 16px; margin-top: 5px; color: gray; text-align: center\'>NOTE: The Communicator is an evolving protoype with missing features</div>';
    a += '</div>';
    show_modal(a, {
    });
    load_nearby()
}
var IID = null;
function precompute_image_positions() {
    if (IID) {
        return
    }
    IID = {
    };
    for (var a in G.sprites) {
        var e = G.sprites[a];
        if (e.skip) {
            continue
        }
        var c = 4,
            g = 'full';
        if (e.type == 'animation') {
            c = 1,
                g = 'animation'
        }
        var h = e.matrix;
        var b = e.width || 312,
            k = e.height || 288;
        if (e.columns != 4 || e.rows != 2) {
            continue
        }
        for (var f = 0; f < h.length; f++) {
            for (var d = 0; d < h[f].length; d++) {
                if (!h[f][d]) {
                    continue
                }
                IID[h[f][d]] = [
                    b,
                    k,
                    d * b / e.columns,
                    f * k / e.rows,
                    b / (e.columns * 3),
                    k / (e.rows * 4),
                    e.file
                ]
            }
        }
    }
    for (var a in IID) {
        for (var d = 0; d < IID[a].length - 1; d++) {
            IID[a][d] *= 1.5
        }
    }
}
function character_image(a) {
    try {
        precompute_image_positions();
        if (!IID[a]) {
            a = 'tf_template'
        }
        return '<div style=\'display: inline-block; width: ' + IID[a][4] + 'px; height: ' + IID[a][5] + 'px; overflow: hidden\'><img style=\'margin-left: ' + ( - IID[a][2] - IID[a][4]) + 'px; margin-top: ' + ( - IID[a][3]) + 'px; width: ' + IID[a][0] + 'px; height: ' + IID[a][1] + 'px;\' src=\'' + IID[a][6] + '\'/></div>'
    } catch (b) {
        console.log(b)
    }
    return ''
}
function load_class_info(a, c) {
    if (!a) {
        a = window.chartype
    }
    if (!c) {
        c = 'male'
    }
    var b = '';
    if (window.gendertype) {
        c = gendertype
    }
    if (a == 'warrior') {
        if (c == 'male') {
            b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-left: -' + (52 * 1) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/custom1.png\'/></div>'
        } else {
            b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-top: -' + (72 * 4) + 'px; margin-left: -' + (52 * 4) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/chara7.png\'/></div>'
        }
        b += '<div><span style=\'color: white\'>Class:</span> <span style=\'color: ' + colors[c] + '\'>Warrior</span></div>';
        b += '<div><span style=\'color: white\'>Primary Attribute:</span> <span style=\'color: ' + colors.str + '\'>Strength</span></div>';
        b += '<div><span style=\'color: white\'>Description:</span> <span style=\'color: gray\'>Warriors are strong melee characters. Ideal for both PVE and PVP. Can\'t go wrong with a warrior.</span></div>'
    } else {
        if (a == 'mage') {
            if (c == 'female') {
                b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'width: 624px; height: 576px; margin-left: -' + (52 * 7) + 'px\' src=\'/images/tiles/characters/chara7.png\'/></div>'
            } else {
                b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-top: -' + (72 * 4) + 'px; margin-left: -' + (52 * 7) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/custom1.png\'/></div>'
            }
            b += '<div><span style=\'color: white\'>Class:</span> <span style=\'color: ' + colors[c] + '\'>Mage</span></div>';
            b += '<div><span style=\'color: white\'>Primary Attribute:</span> <span style=\'color: ' + colors['int'] + '\'>Intelligence</span></div>';
            b += '<div><span style=\'color: white\'>Description:</span> <span style=\'color: gray\'>Mage\'s are the ideal characters for beginners. They are easy and fun to play. Both PVE and PVP.</span></div>'
        } else {
            if (a == 'priest') {
                if (c == 'male') {
                    b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-top: -' + (72 * 4) + 'px; margin-left: -' + (52 * 4) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/chara5.png\'/></div>'
                } else {
                    b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-left: -' + (52 * 7) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/custom1.png\'/></div>'
                }
                b += '<div><span style=\'color: white\'>Class:</span> <span style=\'color: ' + colors[c] + '\'>Priest</span></div>';
                b += '<div><span style=\'color: white\'>Primary Attribute:</span> <span style=\'color: ' + colors['int'] + '\'>Intelligence</span></div>';
                b += '<div><span style=\'color: white\'>Description:</span> <span style=\'color: gray\'>Priest\'s are the healers of the realm. They are not ideal for beginners or solo players. They can\'t inflict a lot of damage. However, thanks to their Curse ability, they might even bring down a strong warrior in PVP. Every serious party needs at least one priest.</span></div>'
            } else {
                if (a == 'rogue') {
                    if (c == 'male') {
                        b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-top: -' + (72 * 4) + 'px; margin-left: -' + (52 * 7) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/chara6.png\'/></div>'
                    } else {
                        b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-top: -' + (72 * 4) + 'px; margin-left: -' + (52 * 7) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/chara3.png\'/></div>'
                    }
                    b += '<div><span style=\'color: white\'>Class:</span> <span style=\'color: ' + colors[c] + '\'>Rogue</span></div>';
                    b += '<div><span style=\'color: white\'>Primary Attribute:</span> <span style=\'color: ' + colors.dex + '\'>Dexterity</span></div>';
                    b += '<div><span style=\'color: white\'>Description:</span> <span style=\'color: gray\'>Rogue\'s are the ideal assassins. Their invis ability makes them super-fun for PVP. They are fast. Not ideal for beginners.</span></div>'
                } else {
                    if (a == 'ranger') {
                        if (c == 'male') {
                            b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-left: -' + (52 * 4) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/custom1.png\'/></div>'
                        } else {
                            b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-left: -' + (52 * 7) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/chara3.png\'/></div>'
                        }
                        b += '<div><span style=\'color: white\'>Class:</span> <span style=\'color: ' + colors[c] + '\'>Ranger</span></div>';
                        b += '<div><span style=\'color: white\'>Primary Attribute:</span> <span style=\'color: ' + colors.dex + '\'>Dexterity</span></div>';
                        b += '<div><span style=\'color: white\'>Description:</span> <span style=\'color: gray\'>Rangers are for the most advanced players. They are mainly archers. Early on they are very weak and hard to play. But a strong ranger can probably rule all other classes. +Work in progress!</span></div>'
                    } else {
                        if (a == 'merchant') {
                            if (c == 'male') {
                                b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-left: -' + (52 * 7) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/npc5.png\'/></div>'
                            } else {
                                b += '<div style=\'float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden\'><img style=\'margin-left: -' + (52 * 4) + 'px; width: 624px; height: 576px;\' src=\'/images/tiles/characters/npc6.png\'/></div>'
                            }
                            b += '<div><span style=\'color: white\'>Class:</span> <span style=\'color: ' + colors[c] + '\'>Merchant</span></div>';
                            b += '<div><span style=\'color: white\'>Primary Attribute:</span> <span style=\'color: #804000\'>None</span></div>';
                            b += '<div><span style=\'color: white\'>Description:</span> <span style=\'color: gray\'>While your main characters are out there adventuring, merchants can wait in town and market your loots. Server and character limits don\'t apply to merchants. They gain experience when they sell or buy something.</span></div>'
                        } else {
                            return
                        }
                    }
                }
            }
        }
    }
    $('#features').css('height', 208).html(b)
};
