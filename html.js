var u_item = null
    , u_scroll = null
    , u_offering = null
    , c_items = e_array(3)
    , c_scroll = null
    , c_offering = null
    , c_last = 0
    , e_item = null
    , p_item = null
    , l_item = null
    , cr_items = e_array(9)
    , cr_last = 0
    , ds_item = null;
var settings_shown = 0;

function show_settings() {
    show_modal($("#settingshtml").html(), {
        wrap: false,
        styles: "max-width:600px"
    });
    return;
    var a = "<div id='pagewrapper' style='z-index:9999; background: rgba(0,0,0,0.6)' onclick='hide_settings()'>";
    a += "<div id='pagewrapped'>";
    a += $("#settingshtml").html();
    a += "</div>";
    a += "</div>";
    $("#content").html(a);
    $("#pagewrapped").css("margin-top", Math.floor(($(window).height() - $("#pagewrapped").height()) / 2) + "px");
    resize()
}

var docked = []
    , cwindows = [];

function close_chat_window(a, c) {
    var b = a + (c || "");
    $("#chatw" + b).remove();
    array_delete(docked, b);
    array_delete(cwindows, b);
    redock()
}

function toggle_chat_window(a, c) {
    var b = a + (c || "");
    if (in_arr(b, docked)) {
        array_delete(docked, b);
        $(".chatb" + b).html("#");
        $("#chatw" + b).css("bottom", "auto");
        $("#chatw" + b).css("top", 400);
        $("#chatw" + b).css("left", 400);
        $("#chatw" + b).css("z-index", 70 + cwindows.length - docked.length);
        $("#chatw" + b).draggable();
        $("#chatt" + b).removeClass("newmessage")
    } else {
        $(".chatb" + b).html("+");
        $("#chatw" + b).draggable("destroy");
        $("#chatw" + b).css("top", "auto");
        $("#chatw" + b).css("left", 0);
        docked.push(b)
    }
    redock()
}

function chat_title_click(a, c) {
    var b = a + (c || "");
    if (in_arr(b, docked)) {
        toggle_chat_window(a, c)
    }
}

function redock() {
    for (var a = 0; a < docked.length; a++) {
        var b = docked[a];
        $("#chatw" + b).css("bottom", 15 + a * 32);
        $("#chatw" + b).css("z-index", 70 - a)
    }
}

function open_chat_window(e, h, b) {
    if (no_html) {
        return
    }
    if (!h) {
        h = ""
    }
    var a = h
        , g = e + h
        , d = 70 + cwindows.length - docked.length
        , f = 'last_say="' + g + '"; if(event.keyCode==13) private_say("' + h + '",$(this).rfval())';
    if (e == "party") {
        a = "Party",
            f = 'last_say="' + g + '"; if(event.keyCode==13) party_say($(this).rfval())'
    }
    var c = "<div style='position:fixed; bottom: 0px; left: 0px; background: black; border: 5px solid gray; z-index: " + d + "' id='chatw" + g + "' onclick='last_say=\"" + g + "\"'>";
    c += "<div style='border-bottom: 5px solid gray; text-align: center; font-size: 24px; line-height: 24px; padding: 2px 6px 2px 6px;'><span style='float:left' class='clickable chatb" + g + "'		 onclick='toggle_chat_window(\"" + e + '","' + h + "\")'>+</span> <span id='chatt" + g + "' onclick='chat_title_click(\"" + e + '","' + h + "\")'>" + a + "</span> <span style='float: right' class='clickable' onclick='close_chat_window(\"" + e + '","' + h + "\")'>x</span></div>";
    c += "<div id='chatd" + g + "' class='chatlog'></div>";
    c += "<div style=''><input type='text' class='chatinput' id='chati" + g + "' onkeypress='" + f + "'/></div>";
    c += "</div>";
    $("body").append(c);
    docked.push(g);
    cwindows.push(g);
    if (b) {
        toggle_chat_window(e, h)
    }
    redock()
}

function hide_settings() {
    $("#content").html("");
    settings_shown = 0
}

function prop_line(e, d, b) {
    var a = ""
        , c = "";
    if (!b) {
        b = {}
    }
    if (b.bold) {
        c = "font-weight: bold;"
    }
    if (is_string(b)) {
        a = b,
            b = {}
    }
    if (!a) {
        a = b.color || "grey"
    }
    return "<div><span style='color: " + a + "; " + c + "'>" + e + "</span>: " + d + "</div>"
}

function bold_prop_line(c, b, a) {
    if (!a) {
        a = {}
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

function render_party_old(b) {
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 6px; font-size: 24px; display: inline-block' class='enableclicks'>";
    if (b) {
        a += "<div class='slimbutton block'>PARTY</div>";
        b.forEach(function (c) {
            a += "<div class='slimbutton block mt5' style='border-color:#703987' onclick='party_click(\"" + c + "\")'>" + c + "</div>"
        });
        a += "<div class='slimbutton block mt5'";
        a += 'onclick=\'socket.emit("party",{event:"leave"})\'>LEAVE</div>'
    }
    a += "</div>";
    $("#partylist").html(a);
    if (!b.length) {
        $("#partylist").hide()
    } else {
        $("#partylist").css("display", "inline-block")
    }
}

function render_party() {
    var b = "";
    for (var a in party) {
        var c = party[a];
        b += " <div class='gamebutton' style='padding: 6px 8px 6px 8px; font-size: 24px; line-height: 18px' onclick='party_click(\"" + a + "\")'>";
        b += sprite(c.skin, {
            cx: c.cx || [],
            rip: c.rip
        });
        if (c.rip) {
            b += "<div style='color:gray; margin-top: 1px'>RIP</div>"
        } else {
            b += "<div style='margin-top: 1px'>" + a.substr(0, 3).toUpperCase() + "</div>"
        }
        b += "</div>"
    }
    $("#newparty").html(b);
    if (!party_list.length) {
        $("#newparty").hide()
    } else {
        $("#newparty").show()
    }
}

function render_character_sheet() {
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: left' class='disableclicks'>";
    a += "<div><span style='color:gray'>Class:</span> " + to_title(character.ctype) + "</div>";
    a += "<div><span style='color:gray'>Level:</span> " + character.level + "</div>";
    a += "<div><span style='color:gray'>XP:</span> " + to_pretty_num(character.xp) + " / " + to_pretty_num(character.max_xp) + "</div>";
    if (character.party && party && party[character.name]) {
        a += "<div><span style='color:" + colors.party_xp + "'>Party:</span> " + round(party[character.name].share * 100) + "% <span style='color:gray'>(Your Share)</span></div>"
    }
    if (character.ctype == "merchant") {
        a += "<div><span style='color:gray'>Tax:</span> " + (character.tax * 100) + "%</div>"
    }
    if (character.ctype == "priest") {
        a += "<div><span style='color:gray'>Heal:</span> " + character.attack + "</div>";
        a += "<div><span style='color:gray'>Attack:</span> " + round(character.attack * 0.4) + "</div>"
    } else {
        a += "<div><span style='color:gray'>Attack:</span> " + character.attack + "</div>"
    }
    a += "<div><span style='color:gray'>Attack Speed:</span> " + round(character.frequency * 100) + "</div>";
    a += "<div><span style='color:gray'>Strength:</span> " + character.stats.str + "</div>";
    a += "<div><span style='color:gray'>Intelligence:</span> " + character.stats["int"] + "</div>";
    a += "<div><span style='color:gray'>Dexterity:</span> " + character.stats.dex + "</div>";
    a += "<div><span style='color:gray'>Vitality:</span> " + character.stats.vit + "</div>";
    a += "<div><span style='color:gray'>Armor:</span> " + character.armor + " <span style='color:gray'>(" + parseInt((1 - damage_multiplier(character.armor)) * 10000) / 100 + "%)</span></div>";
    a += "<div><span style='color:gray'>Resistance:</span> " + character.resistance + " <span style='color:gray'>(" + parseInt((1 - damage_multiplier(character.resistance)) * 10000) / 100 + "%)</span></div>";
    a += "<div><span style='color:gray'>Speed:</span> " + character.speed + "</div>";
    a += "<div><span style='color:gray'>MP Cost:</span> " + character.mp_cost + "</div>";
    if (character.dreturn) {
        a += "<div><span style='color:gray'>Damage Return:</span> " + character.dreturn + "%</div>"
    }
    if (character.reflection) {
        a += "<div><span style='color:gray'>Reflection:</span> " + character.reflection + "%</div>"
    }
    if (character.evasion) {
        a += "<div><span style='color:gray'>Evasion:</span> " + character.evasion + "%</div>"
    }
    if (character.miss) {
        a += "<div><span style='color:gray'>Miss:</span> " + character.miss + "%</div>"
    }
    if (character.crit) {
        a += "<div><span style='color:gray'>Crit:</span> " + character.crit + "%</div>"
    }
    if (character.apiercing) {
        a += "<div><span style='color:gray'>Armor Piercing:</span> " + character.apiercing + "</div>"
    }
    if (character.rpiercing) {
        a += "<div><span style='color:gray'>Resistance Piercing:</span> " + character.rpiercing + "</div>"
    }
    if (character.goldm != 1) {
        if (character.party && party && party[character.name] && party[character.name].gold) {
            a += "<div><span style='color:gray'>Gold:</span> " + round(character.goldm * 100 - party[character.name].gold) + "% <span style='color:" + colors.gold + "'>+" + party[character.name].gold + "%</span></div>"
        } else {
            a += "<div><span style='color:gray'>Gold:</span> " + round(character.goldm * 100) + "%</div>"
        }
    }
    if (character.xpm != 1) {
        if (character.party && party && party[character.name] && party[character.name].xp) {
            a += "<div><span style='color:gray'>Experience:</span> " + round(character.xpm * 100 - party[character.name].xp) + "% <span style='color:" + colors.stat_xp + "'>+" + party[character.name].xp + "%</span></div>"
        } else {
            a += "<div><span style='color:gray'>Experience:</span> " + round(character.xpm * 100) + "%</div>"
        }
    }
    if (character.luckm != 1) {
        if (character.party && party && party[character.name] && party[character.name].luck) {
            a += "<div><span style='color:gray'>Luck:</span> " + round(character.luckm * 100 - party[character.name].luck) + "% <span style='color:" + colors.luck + "'>+" + party[character.name].luck + "%</span></div>"
        } else {
            a += "<div><span style='color:gray'>Luck:</span> " + round(character.luckm * 100) + "%</div>"
        }
    }
    a += "</div>";
    $("#rightcornerui").html(a);
    topright_npc = "character"
}

function render_conditions(b) {
    var a = "<div style='margin-top: 5px; margin-bottom: -5px; margin-left: -2px'>"
        , c = 0;
    for (var f in b.s) {
        var e = G.conditions[f]
            , d = b.s[f];
        if (!e || (!e.ui && (!d.s || d.s < 20))) {
            continue
        }
        if (c > 0 && !(c % 2)) {
            a += "<div></div>"
        }
        c += 1;
        a += item_container({
            skin: e.skin,
            onclick: "condition_click('" + f + "')"
        }, d)
    }
    a += "</div>";
    if (c) {
        $(".renderedinfo").append(a)
    }
}

function render_info(h, g, j) {
    if (!g) {
        g = []
    }
    var e = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; " + j + "' class='renderedinfo'>";
    for (var c = 0; c < h.length; c++) {
        var a = h[c]
            , f = "";
        var b = a.color || "white";
        if (a.afk && a.afk == "bot") {
            f = " <span class='gray'>[BOT]</span>"
        } else {
            if (a.afk && a.afk == "code") {
                f = " <span class='gray'>[CODE]</span>"
            } else {
                if (a.afk) {
                    f = " <span class='gray'>[AFK]</span>"
                }
            }
        }
        if (a.cursed) {
            f = " <span style='color: #7D4DAA'>[C]</span>"
        }
        if (a.poisoned) {
            f = " <span style='color: #45993F'>[P]</span>"
        }
        if (a.stunned) {
            f = " <span style='color: #FF9601'>[STUN]</span>"
        }
        if (a.line) {
            e += "<span class='cbold' style='color: " + b + "'>" + a.line + "</span>" + f + "<br />"
        } else {
            e += "<span class='cbold' style='color: " + b + "'>" + a.name + "</span>: " + a.value + f + "<br />"
        }
    }
    for (var c = 0; c < g.length; c++) {
        var d = g[c];
        var b = d.color || "white";
        e += "<span style='color: " + b + "' class='clickable cbold' onclick=\"" + d.onclick + '">' + d.name + "</span>";
        if (d.pm_onclick) {
            e += " <span style='color: " + ("#A255BA" || "#276bc5" || b) + "' class='clickable cbold' onclick=\"" + d.pm_onclick + '">PM</span>'
        }
        e += "<br />"
    }
    e += "</div>";
    $("#topleftcornerui").html(e)
}

function render_slots(g, d) {
    if (!d) {
        d = {}
    }

    function c(o, h, n) {
        if (!n) {
            n = 0.4
        }
        if (g.slots[o]) {
            var l = g.slots[o];
            var m = "item" + randomStr(10)
                , j = G.items[l.name]
                , k = l.skin || j.skin;
            if (l.expires) {
                k = j.skin_a
            }
            if ((l.name == "tristone" || l.name == "darktristone") && (g.skin.startsWith("mm_") || g.skin.startsWith("mf_") || g.skin.startsWith("tm_") || g.skin.startsWith("tf_"))) {
                k = j.skin_a
            }
            f += item_container({
                skin: k,
                onclick: "slot_click('" + o + "')",
                def: j,
                id: m,
                draggable: g.me,
                sname: g.me && o,
                shade: h,
                s_op: n,
                slot: o
            }, l)
        } else {
            if (in_arr(o, trade_slots) && g.me) {
                f += item_container({
                    size: 40,
                    draggable: g.me,
                    shade: h,
                    s_op: n,
                    slot: o,
                    onclick: "wishlist_click('" + o + "')",
                })
            } else {
                f += item_container({
                    size: 40,
                    draggable: g.me,
                    shade: h,
                    s_op: n,
                    slot: o
                })
            }
        }
    }

    var a = g.me;
    var f = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; margin-left: 5px'>";
    if (d.pure) {
        f = ""
    }
    if (g.stand) {
        f += "<div class='cmerchant'>";
        for (var e = 0; e < 4; e++) {
            f += "<div>";
            for (var b = 0; b < 4; b++) {
                c("trade" + ((e * 4) + b + 1), "shade_gold", 0.2)
            }
            f += "</div>"
        }
        f += "</div>"
    }
    if (g.stand) {
        f += "<div class='cmerchant hidden'>"
    }
    f += "<div>";
    c("earring1", "shade_earring");
    c("helmet", "shade_helmet", 0.5);
    c("earring2", "shade_earring");
    c("amulet", "shade_amulet");
    f += "</div>";
    f += "<div>";
    c("mainhand", "shade_mainhand", 0.36);
    c("chest", "shade_chest");
    c("offhand", "shade_offhand");
    c("cape", "shade20_cape");
    f += "</div>";
    f += "<div>";
    c("ring1", "shade_ring");
    c("pants", "shade_pants", 0.5);
    c("ring2", "shade_ring");
    c("orb", "shade20_orb");
    f += "</div>";
    f += "<div>";
    c("belt", "shade_belt");
    c("shoes", "shade_shoes", 0.5);
    c("gloves", "shade_gloves");
    c("elixir", "shade20_elixir");
    f += "</div>";
    if ((g.me && g.slots.trade1 !== undefined || (g.slots.trade1 || g.slots.trade2 || g.slots.trade3 || g.slots.trade4)) && !g.stand) {
        f += "<div>";
        c("trade1", "shade_gold", 0.2);
        c("trade2", "shade_gold", 0.2);
        c("trade3", "shade_gold", 0.2);
        c("trade4", "shade_gold", 0.2);
        f += "</div>"
    }
    if (g.stand) {
        f += "</div>"
    }
    if (!d.pure) {
        f += "</div>"
    }
    $("#topleftcornerui").append(f);
    return f
}

function render_transports_npc() {
    reset_inventory(1);
    topleft_npc = "transports";
    rendered_target = topleft_npc;
    e_item = null;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top;'>";
    a += "<div class='clickable' onclick='transport_to(\"main\",9)'>&gt; New Town</div>";
    a += "<div class='clickable' onclick='transport_to(\"winterland\",1)'>&gt; Winterland</div>";
    a += "<div class='clickable' onclick='transport_to(\"halloween\",1)'>&gt; Spooky Forest</div>";
    a += "<div class='clickable' onclick='transport_to(\"desertland\",1)'>&gt; Desertland</div>";
    a += "</div>";
    $("#topleftcornerui").html(a)
}

function render_gold_npc() {
    reset_inventory(1);
    topleft_npc = "gold";
    rendered_target = topleft_npc;
    e_item = null;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center' onclick='stpr(event); cfocus(\".npcgold\")'>";
    a += "<div style='font-size: 36px; margin-bottom: 10px' class='clickable' onclick='$(\".npcgold\").html(to_pretty_num(max(character.bank.gold,character.gold)))'><span style='color:gold'>GOLD:</span> " + (character.user && to_pretty_num(character.user.gold) || "Unavailable") + "</div>";
    a += "<div style='font-size: 36px; margin-bottom: 10px'><span class='gray clickable' onclick='$(\".npcgold\").cfocus()'>Amount:</span> <div contenteditable='true' class='npcgold inline-block' data-default='0'>0</div></div>";
    a += "<div>";
    if (options.bank_max) {
        a += "<div class='gamebutton clickable mr5' onclick='$(\".npcgold\").html(max(character.bank.gold,character.gold))'>MAX</div>"
    }
    a += "<div class='gamebutton clickable mr5' onclick='deposit()'>DEPOSIT</div><div class='gamebutton clickable' onclick='withdraw()'>WITHDRAW</div></div>";
    a += "</div>";
    $("#topleftcornerui").html(a);
    cfocus(".npcgold")
}

var last_rendered_items = "items0";

function render_items_npc(l) {
    if (!character.user) {
        return
    }
    if (!l) {
        l = last_rendered_items
    }
    if (l && !character.user[l]) {
        render_interaction("unlock_" + l);
        topleft_npc = "items";
        rendered_target = topleft_npc;
        last_rendered_items = l;
        return
    }
    last_rendered_items = l;
    reset_inventory(1);
    topleft_npc = "items";
    rendered_target = topleft_npc;
    var g = []
        , m = 0
        , k = character.user[l] || [];
    var e = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block' class='dcontain'>";
    for (var d = 0; d < Math.ceil(max(character.isize, k.length) / 7); d++) {
        e += "<div>";
        for (var c = 0; c < 7; c++) {
            var h = null;
            if (m < k.length) {
                h = k[m++]
            } else {
                m++
            }
            if (h) {
                var a = "citem" + (m - 1)
                    , o = G.items[h.name]
                    , n = o.skin;
                if (h.expires) {
                    n = o.skin_a
                }
                e += item_container({
                    skin: n,
                    def: o,
                    id: "str" + a,
                    draggable: true,
                    strnum: m - 1,
                    snum: m - 1
                }, h);
                g.push({
                    id: a,
                    item: o,
                    name: h.name,
                    actual: h,
                    num: m - 1,
                    npc: true
                })
            } else {
                e += item_container({
                    size: 40,
                    draggable: true,
                    strnum: m - 1
                })
            }
        }
        e += "</div>"
    }
    e += "</div><div id='storage-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
    $("#topleftcornerui").html(e);
    for (var d = 0; d < g.length; d++) {
        var b = g[d];

        function f(j) {
            return function () {
                render_item("#storage-item", j)
            }
        }

        $("#str" + b.id).on("click", f(b)).addClass("clickable")
    }
    if (!inventory) {
        render_inventory()
    }
}

function render_inventory() {
    var g = 0
        , b = "text-align: right";
    if (inventory) {
        $("#bottomleftcorner").html("");
        inventory = false;
        return
    }
    var e = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block; vertical-align: bottom' class='dcontain'>";
    if (c_enabled) {
        if (is_electron) {
            e += "<div style='padding: 4px; display: inline-block' class='clickable' onclick='pcs(event); show_shells_info()'>";
            e += "<span class='cbold' style='color: " + colors.cash + "'>SHELLS</span>: <span class='cashnum'>" + to_pretty_num(character.cash || 0) + "</span></div>";
            b = " display: inline-block; float: right"
        } else {
            e += "<div style='padding: 4px; display: inline-block' class='clickable'>";
            e += "<a href='https://adventure.land/shells' class='cancela' target='_blank'><span class='cbold' style='color: " + colors.cash + "'>SHELLS</span>: <span class='cashnum'>" + to_pretty_num(character.cash || 0) + "</span></a></div>";
            b = " display: inline-block; float: right"
        }
    }
    e += "<div style='padding: 4px;" + b + "'><span class='cbold' style='color: gold'>GOLD</span>: <span class='goldnum'>" + to_pretty_num(character.gold + ((new Date()).getDate() == 1 && (new Date()).getMonth() == 3 ? 1014201800 : 0)) + "</span></div>";
    e += "<div style='border-bottom: 5px solid gray; margin-bottom: 2px; margin-left: -5px; margin-right: -5px'></div>";
    for (var d = 0; d < Math.ceil(max(character.isize, character.items.length) / 7); d++) {
        e += "<div>";
        for (var c = 0; c < 7; c++) {
            var f = null;
            if (g < character.items.length) {
                f = character.items[g++]
            } else {
                g++
            }
            if (f) {
                var a = "citem" + (g - 1)
                    , k = G.items[f.name] || {
                    skin: "test",
                    name: "Unrecognized Item"
                }
                    , h = f.skin || k.skin;
                if (f.expires) {
                    h = k.skin_a
                }
                e += item_container({
                    skin: h,
                    onclick: "inventory_click(" + (g - 1) + ")",
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
        e += "</div>"
    }
    e += "</div><div class='inventory-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
    inventory = true;
    $("#bottomleftcorner").html(e)
}

function render_craftsman() {
    var a = "stick"
        , c = "CRAFT";
    reset_inventory(1);
    topleft_npc = "craftsman";
    rendered_target = topleft_npc;
    cr_items = e_array(9),
        cr_last = 0;
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
    b += "<div>";
    b += item_container({
        shade: a,
        cid: "critem0",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: "critem1",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: "critem2",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "<div>";
    b += item_container({
        shade: a,
        cid: "critem3",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: "critem4",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: "critem5",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "<div class='mb5'>";
    b += item_container({
        shade: a,
        cid: "critem6",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: "critem7",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += item_container({
        shade: a,
        cid: "critem8",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "<div><div class='gamebutton clickable' onclick='draw_trigger(function(){ render_craftsman(); reset_inventory(); });'>RESET</div> <div class='gamebutton clickable' onclick='craft()'>" + c + "</div></div>";
    b += "</div>";
    $("#topleftcornerui").html(b);
    if (!inventory) {
        render_inventory()
    }
}

function render_dismantler() {
    var a = "fclaw"
        , c = "DISMANTLE";
    reset_inventory(1);
    topleft_npc = "dismantler";
    rendered_target = topleft_npc;
    ds_item = null;
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
    b += "<div>";
    b += item_container({
        shade: a,
        cid: "dsitem",
        s_op: 0.36,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "<div style='margin-top: 12px'><div class='gamebutton clickable' onclick='dismantle()'>" + c + "</div></div>";
    b += "</div>";
    $("#topleftcornerui").html(b);
    if (!inventory) {
        render_inventory()
    }
}

var last_lmode = "lock";

function render_locksmith(e) {
    if (!e) {
        e = last_lmode
    }
    last_lmode = e;
    var c = "LOCK"
        , d = "lock_item"
        , a = "shade_seal";
    if (e == "unlock") {
        c = "UNLOCK",
            d = "unlock_item",
            a = "shade_unlock"
    }
    if (e == "seal") {
        c = "SEAL",
            d = "seal_item",
            a = "shade_lock"
    }
    reset_inventory(1);
    topleft_npc = "locksmith";
    rendered_target = topleft_npc;
    l_item = null;
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
    b += "<div>";
    b += item_container({
        shade: a,
        cid: "litem",
        s_op: 0.4,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "<div style='margin-top: 12px'><div class='gamebutton clickable' onclick='" + d + "()'>" + c + "</div></div>";
    b += "</div>";
    $("#topleftcornerui").html(b);
    if (!inventory) {
        render_inventory()
    }
}

function render_recipe(b, a) {
    if (b == "craft") {
        render_item("#recipe-item", {
            item: G.items[a],
            name: a,
            craft: true
        })
    } else {
        render_item("#recipe-item", {
            item: G.items[a],
            name: a,
            dismantle: true
        })
    }
}

function render_recipes() {
    topleft_npc = "recipes";
    rendered_target = topleft_npc;
    i = 0;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
    a += "<div class='clickable' onclick='render_craftsman()'>CRAFT</div>";
    object_sort(G.craft).forEach(function (c) {
        var b = c[0];
        a += item_container({
            skin: G.items[b].skin,
            onclick: "render_recipe('craft','" + b + "')"
        }, {
            name: b
        });
        i += 1;
        if (!(i % 6)) {
            a += "<div></div>"
        }
    });
    a += "<div class='clickable' onclick='render_dismantler()'>DISMANTLE</div>";
    i = 0;
    object_sort(G.dismantle).forEach(function (c) {
        var b = c[0];
        a += item_container({
            skin: G.items[b].skin,
            onclick: "render_recipe('dismantle','" + b + "')"
        }, {
            name: b
        });
        i += 1;
        if (!(i % 6)) {
            a += "<div></div>"
        }
    });
    a += "</div><div id='recipe-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
    $("#topleftcornerui").html(a)
}

function render_exchange_shrine(d) {
    var a = "shade_exchange"
        , c = "EXCHANGE";
    reset_inventory(1);
    topleft_npc = "exchange";
    rendered_target = topleft_npc;
    exchange_type = d;
    if (d == "leather") {
        a = "leather",
            c = "GIVE"
    }
    if (d == "lostearring") {
        a = "lostearring",
            c = "PROVIDE"
    }
    if (d == "mistletoe") {
        a = "mistletoe",
            c = "GIVE IT"
    }
    if (d == "candycane") {
        a = "candycane",
            c = "FEED"
    }
    if (d == "ornament") {
        a = "ornament",
            c = "GIVE"
    }
    if (d == "seashell") {
        a = "seashell",
            c = "GIVE"
    }
    if (d == "gemfragment") {
        a = "gemfragment",
            c = "PROVIDE"
    }
    e_item = null;
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
    b += "<div class='ering ering1 mb10'>";
    b += "<div class='ering ering2'>";
    b += "<div class='ering ering3'>";
    b += item_container({
        shade: a,
        cid: "eitem",
        s_op: 0.5,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "</div>";
    b += "</div>";
    b += "<div><div class='gamebutton clickable' onclick='exchange()'>" + c + "</div></div>";
    b += "</div>";
    $("#topleftcornerui").html(b);
    if (!inventory) {
        render_inventory()
    }
}

function render_none_shrine(d) {
    var a = "cape0"
        , c = "POOF";
    reset_inventory(1);
    topleft_npc = "none";
    rendered_target = topleft_npc;
    p_item = null;
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: center'>";
    b += "<div class='ering ering1 mb10'>";
    b += "<div class='ering ering2'>";
    b += "<div class='ering ering3'>";
    b += item_container({
        shade: a,
        cid: "pitem",
        s_op: 0.5,
        draggable: false,
        droppable: true
    });
    b += "</div>";
    b += "</div>";
    b += "</div>";
    b += "<div><div class='gamebutton clickable' onclick='poof()'>" + c + "</div></div>";
    b += "</div>";
    $("#topleftcornerui").html(b);
    if (!inventory) {
        render_inventory()
    }
}

function render_shells_buyer() {
    topleft_npc = "buyshells";
    rendered_target = topleft_npc;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top; text-align: left'>"
        , b = "";
    a += "<div><span style='color: #5DAC40'>10</span> Shells = <span style='color: gold'>1,500,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(10)'>BUY</span></div>";
    a += "<div><span style='color: #5DAC40'>100</span> Shells = <span style='color: gold'>15,000,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(100)'>BUY</span></div>";
    a += "<div><span style='color: #5DAC40'>500</span> Shells = <span style='color: gold'>75,000,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(500)'>BUY</span></div>";
    a += "<div><span style='color: #5DAC40'>1,000</span> Shells = <span style='color: gold'>150,000,000</span> <span style='color: #71AF83' class='clickable' onclick='buy_shells(1000)'>BUY</span></div>";
    if (!is_electron) {
        b = "<a href='https://adventure.land/shells' class='cancela' target='_blank'><span class='clickable' onclick='rendered_target=null;' style='color: #359ECF'>Buy With $</span></a> | "
    }
    a += "<div>" + b + "<span class='clickable' onclick='topleft_npc=false;' style='color: #555556'>Nope</span></div>";
    a += "</div>";
    $("#topleftcornerui").html(a);
    if (!inventory) {
        render_inventory()
    }
}

function render_upgrade_shrine() {
    reset_inventory(1);
    topleft_npc = "upgrade";
    rendered_target = topleft_npc;
    u_item = null,
        u_scroll = null,
        u_offering = null;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top'>";
    a += "<div class='mb5' align='center'>";
    a += "<div>";
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_uweapon",
        cid: "uweapon",
        s_op: 0.36
    });
    a += "</div>";
    a += "<div>";
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_offering",
        cid: "uoffering",
        s_op: 0.36
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_scroll",
        cid: "uscroll",
        s_op: 0.36
    });
    a += "</div>";
    a += "</div>";
    a += "<div class='gamebutton clickable' onclick='draw_trigger(function(){ render_upgrade_shrine(); reset_inventory(); });'>RESET</div>";
    a += "<div class='gamebutton clickable ml5' onclick='upgrade()'>UPGRADE</div>";
    a += "</div>";
    $("#topleftcornerui").html(a);
    if (!inventory) {
        render_inventory()
    }
}

function render_compound_shrine() {
    reset_inventory(1);
    topleft_npc = "compound";
    rendered_target = topleft_npc;
    c_items = e_array(3),
        c_scroll = null,
        c_offering = null;
    c_last = 0;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 24px; display: inline-block; vertical-align: top'>";
    a += "<div class='mb5' align='center'>";
    a += "<div>";
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_cring",
        cid: "compound0",
        s_op: 0.36
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_cring",
        cid: "compound1",
        s_op: 0.36
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_cring",
        cid: "compound2",
        s_op: 0.36
    });
    a += "</div>";
    a += "<div>";
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_offering",
        cid: "coffering",
        s_op: 0.36
    });
    a += item_container({
        draggable: false,
        droppable: true,
        shade: "shade_cscroll",
        cid: "cscroll",
        s_op: 0.36
    });
    a += "</div>";
    a += "</div>";
    a += "<div class='gamebutton clickable' onclick='draw_trigger(function(){ render_compound_shrine(); reset_inventory(); });'>RESET</div>";
    a += "<div class='gamebutton clickable ml5' onclick='compound()'>COMBINE</div>";
    a += "</div>";
    $("#topleftcornerui").html(a);
    if (!inventory) {
        render_inventory()
    }
}

var dice_bet = {
    active: false,
    dir: 1
};

function on_dice_change() {
    if (topleft_npc != "dice") {
        return
    }
    var b = min(99.99, max(0, parseFloat($(".dicenum").html()))), c;
    var a = parseInt($(".dicegold").html().replace_all(",", ""));
    if (!a) {
        a = 100000
    }
    a = max(10000, a);
    $(".dicegold").html(to_pretty_num(a));
    dice_bet.gold = a;
    var d = b.toFixed(2);
    if (d.length != 5) {
        d = "0" + d
    }
    $(".dicenum").html(d);
    dice_bet.num = d;
    b = parseFloat(d);
    if (dice_bet.dir == 1) {
        c = 100 / (100 - b);
        $(".diceup").css("border-color", "#A7C16D");
        $(".dicedown").css("border-color", "gray")
    } else {
        c = 100 / b;
        $(".diceup").css("border-color", "gray");
        $(".dicedown").css("border-color", "#A7C16D")
    }
    c = min(c, 10000);
    $(".dicexx").html("FOR " + to_pretty_float(c) + "X");
    if (dice_bet.active) {
        $(".diceb").css("border-color", "gold")
    } else {
        $(".diceb").css("border-color", "gray")
    }
}

function on_dice_bet() {
    var b = min(99.99, max(0, parseFloat($(".dicenum").html())));
    var a = parseInt($(".dicegold").html().replace_all(",", ""));
    dice(dice_bet.dir, b, a)
}

function render_dice() {
    var b = dice_bet.num || "50.00";
    var a = dice_bet.gold || 100000;
    reset_inventory(1);
    topleft_npc = "dice";
    rendered_target = topleft_npc;
    var c = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 32px; display: inline-block; vertical-align: top'>";
    c += "<div class='mb5' align='center'>";
    c += "<div><span class='gray clickable' onclick='$(\".dicenum\").cfocus()'>NUMBER:</span> <div class='inline-block dicenum' contenteditable=true onblur='on_dice_change()'>" + b + "</div></div>";
    c += "</div>";
    c += "<div class='mb5' align='center'>";
    c += "<div><span class='gold clickable' onclick='$(\".dicegold\").cfocus()'>GOLD:</span> <div class='inline-block dicegold' contenteditable=true onblur='on_dice_change()'>" + to_pretty_num(a) + "</div></div>";
    c += "</div>";
    c += "<div class='mb5' align='center'>";
    c += "<div class='gamebutton clickable diceup' onclick='dice_bet.dir=1; on_dice_change()' style='width: 64px;'>UP</div>";
    c += "<div class='gamebutton clickable ml5 dicedown' onclick='dice_bet.dir=2; on_dice_change()' style='width: 64px'>DOWN</div>";
    c += "</div>";
    c += "<div class='mb5' align='center'>";
    c += "<div class='gamebutton clickable diceb' onclick='on_dice_bet()' style='width: 200px;'>BET <span class='gray dicexx'>FOR 2X</span></div>";
    c += "</div>";
    c += "</div>";
    $("#topleftcornerui").html(c);
    if (!inventory) {
        render_inventory()
    }
    on_dice_change()
}

function render_tavern_info(b) {
    topleft_npc = "info";
    rendered_target = topleft_npc;
    var a = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 32px; display: inline-block; vertical-align: top'>";
    a += "<div class='mb5' align='center'>";
    a += "<div><span class='gray'>House Edge</span></div>";
    a += "</div>";
    a += "<div class='mb5' align='center'>";
    a += "<div><span>" + b.edge.toFixed(2) + "%</span></div>";
    a += "</div>";
    a += "<div class='mb5' align='center'>";
    a += "<div><span class='gray'>Max. Net Win</span></div>";
    a += "</div>";
    a += "<div class='mb5' align='center'>";
    a += "<div><span class='gold'>" + to_pretty_num(b.max) + "</span></div>";
    a += "</div>";
    a += "</div>";
    $("#topleftcornerui").html(a);
    if (!inventory) {
        render_inventory()
    }
}

function on_donate_change() {
    if (topleft_npc != "donate") {
        return
    }
    var a = parseInt($(".dgold").html().replace_all(",", ""));
    if (!a) {
        a = 100000
    }
    a = max(1, a);
    $(".dgold").html(to_pretty_num(a));
    dice_bet.gold = a
}

function render_donate() {
    var a = 10000000;
    reset_inventory(1);
    topleft_npc = "donate";
    rendered_target = topleft_npc;
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 20px; font-size: 32px; display: inline-block; vertical-align: top'>";
    b += "<div class='mb5' align='center'>";
    b += "<div><span class='gold clickable' onclick='$(\".dgold\").cfocus()'>GOLD:</span> <div class='inline-block dgold' contenteditable=true onblur='on_donate_change()'>" + to_pretty_num(a) + "</div></div>";
    b += "</div>";
    b += "<div class='mb5' align='center'>";
    b += "<div class='gamebutton clickable diceb' onclick='donate()' style='width: 160px; margin-top: 20px'>DONATE</div>";
    b += "</div>";
    b += "</div>";
    $("#topleftcornerui").html(b);
    if (!inventory) {
        render_inventory()
    }
    on_dice_change()
}

function render_merchant(n, b, o) {
    reset_inventory(1);
    topleft_npc = "merchant";
    rendered_target = topleft_npc;
    merchant_id = n.id;
    var p = 0
        , k = [];
    var g = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>"
        , l = "buy_with_gold";
    if (o) {
        l = "buy_with_shells"
    }
    for (var e = 0; e < 4; e++) {
        g += "<div>";
        for (var d = 0; d < 5; d++) {
            if (p < n.items.length && n.items[p++] && (c_enabled || !G.items[n.items[p - 1]].cash)) {
                var m = n.items[p - 1];
                var a = "item" + randomStr(10)
                    , q = G.items[m];
                g += item_container({
                    skin: q.skin_a || q.skin,
                    def: q,
                    id: a,
                    draggable: false,
                    on_rclick: l + "('" + m + "')"
                });
                if (o) {
                    k.push({
                        id: a,
                        item: q,
                        name: m,
                        value: q.g,
                        cash: q.cash
                    })
                } else {
                    if (q.cash) {
                        k.push({
                            id: a,
                            item: q,
                            name: m,
                            value: q.g * G.inflation
                        })
                    } else {
                        k.push({
                            id: a,
                            item: q,
                            name: m,
                            value: q.g
                        })
                    }
                }
            } else {
                g += item_container({
                    size: 40,
                    draggable: false,
                    droppable: true
                })
            }
        }
        g += "</div>"
    }
    g += "</div>";
    g += "<div id='merchant-item' style='display: inline-block; vertical-align: top; margin-left: 5px'>" + (b && render_interaction(b, "return_html") || " ") + "</div>";
    $("#topleftcornerui").html(g);
    for (var e = 0; e < k.length; e++) {
        var c = k[e];

        function h(f) {
            return function () {
                render_item("#merchant-item", f)
            }
        }

        $("#" + c.id).on("click", h(c)).addClass("clickable")
    }
}

function render_token_exchange(c) {
    reset_inventory(1);
    topleft_npc = "token_exchange";
    rendered_target = topleft_npc;
    var n = 0
        , k = []
        , m = [c];
    var g = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
    for (var a in G.tokens[c]) {
        m.push(a)
    }
    for (var f = 0; f < 4; f++) {
        g += "<div>";
        for (var e = 0; e < 5; e++) {
            if (n < m.length && m[n++] && (c_enabled || !G.items[m[n - 1]].cash)) {
                var l = m[n - 1];
                var b = "item" + randomStr(10)
                    , o = G.items[l];
                g += item_container({
                    skin: o.skin_a || o.skin,
                    def: o,
                    id: b,
                    draggable: false
                });
                k.push({
                    id: b,
                    item: o,
                    name: l,
                    token: c
                })
            } else {
                g += item_container({
                    size: 40,
                    draggable: false,
                    droppable: true
                })
            }
        }
        g += "</div>"
    }
    g += "</div>";
    g += "<div id='merchant-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
    $("#topleftcornerui").html(g);
    for (var f = 0; f < k.length; f++) {
        var d = k[f];

        function h(j) {
            return function () {
                render_item("#merchant-item", j)
            }
        }

        $("#" + d.id).on("click", h(d)).addClass("clickable")
    }
}

function render_computer(a) {
    var b = "";
    b += '<div style="color: #32A3B0">CONNECTED.</div>';
    b += "<div onclick='render_upgrade_shrine()' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> UPGRADE</div>";
    b += "<div onclick='render_compound_shrine()' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> COMPOUND</div>";
    b += "<div onclick='render_exchange_shrine()' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> EXCHANGE</div>";
    b += "<div onclick='render_interaction(\"crafting\");' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> CRAFTING</div>";
    b += "<div onclick='render_merchant(G.npcs.pots)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> POTIONS</div>";
    b += "<div onclick='render_merchant(G.npcs.scrolls)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> SCROLLS</div>";
    b += "<div onclick='render_merchant(G.npcs.basics)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> BASICS</div>";
    b += "<div onclick='render_merchant(G.npcs.premium,null,false)' class='clickable' style='color: #E4E4E4'><span style='color: #BA61A4'>&gt;</span> PREMIUM</div>";
    a.html(b)
}

function render_code_gallery() {
    var a = "";
    G.codes.forEach(function (b) {
        a += "<div class='gamebutton'>" + (b.name || b.key) + "</div>"
    });
    a += "<div style='border: 4px gray solid;'>";
    G.codes[0].list.forEach(function (b) {
        a += '<div onclick=\'api_call("load_gcode",{file:"' + b[0] + "\"});'>" + b[1] + "</div>"
    });
    a += "</div>";
    show_modal(a)
}

function render_tutorial_stepv1(a) {
    if (!a) {
        a = {}
    }
    a.title = "[1/24] Move";
    a.main = "Welcome to the first step of the tutorial. In this step, we are going to move! Now move your character near the green goo's by clicking on the map and walking below the town!";
    a.code = "Using the CODE feature. You can use the `move` function, or, the more costly `smart_move` function.";
    var b = "";
    if (a.title) {
        b += "<div style='border: 5px solid #65A7E6; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px; display: inline-block'>" + a.title + "</div>"
    }
    if (a.main) {
        b += "<div style='border: 5px solid gray; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px;'>" + a.main + "</div>"
    }
    if (a.code) {
        b += "<div style='border: 5px solid #E4738A; background-color: #E6E6E6; color: #333333; margin: 3px; padding: 5px; font-size: 24px;'>" + a.code + "</div>"
    }
    show_modal(b)
}

function render_skill(a, e, c) {
    if (!c) {
        c = {}
    }
    var f = c.actual || {}
        , d = "";
    var b = G.skills[e];
    d += "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; " + (c.styles || "") + "'>";
    if (!b) {
        d += e
    } else {
        d += "<div style='color: #4EB7DE; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + b.name + "</div>";
        if (b.explanation) {
            d += "<div style='color: #C3C3C3'>" + b.explanation + "</div>";
            if (b.mp) {
                d += bold_prop_line("MP", b.mp, colors.mp)
            }
            if (b.duration) {
                d += bold_prop_line("Duration", (b.duration / 1000) + " seconds", "gray")
            }
            if (b.cooldown && (b.cooldown / 1000)) {
                d += bold_prop_line("Cooldown", (b.cooldown / 1000) + " seconds", "gray")
            }
            if (b.range) {
                d += bold_prop_line("Range", b.range, "gray")
            }
            if (b.level) {
                d += bold_prop_line("Level Requirement", b.level, "gray")
            }
            if (b.type == "passive") {
                d += "<div><span style='color: #696C68;'>Passive</span></div>"
            }
            (b.levels || []).forEach(function (h) {
                var j = h[0]
                    , g = h[1];
                d += bold_prop_line("Output", g + (j > 0 && (" (Lv. " + j + ")")), "gray")
            });
            if (b.consume) {
                d += "<div style='margin: 4px 0px 0px -2px;'>" + item_container({
                    skin: G.items[b.consume].skin,
                    def: G.items[b.consume]
                });
                +"</div>"
            }
        }
    }
    d += "</div>";
    $(a).html(d)
}

function render_computer_network(a) {
    var b = "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px;' class='buyitem'><div class='computernx'></div></div>";
    $(a).html(b);
    render_computer($(".computernx"))
}

function render_secondhands(l) {
    reset_inventory(1);
    topleft_npc = "secondhands";
    if (l) {
        topleft_npc = l
    }
    rendered_target = topleft_npc;
    var m = 0
        , e = []
        , g = "sh_click";
    var d = "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
    var k = secondhands;
    if (l) {
        k = lostandfound;
        if (l_page >= 1) {
            m += 19 + (l_page - 1) * 18
        }
        g = "lf_click"
    } else {
        if (s_page >= 1) {
            m += 19 + (s_page - 1) * 18
        }
    }
    for (var c = 0; c < 4; c++) {
        d += "<div>";
        for (var b = 0; b < 5; b++) {
            if (!l && c == 3 && b == 0 && s_page != 0) {
                d += item_container({
                    skin: "left",
                    onclick: "s_page=" + (s_page - 1) + "; render_secondhands();"
                }, {
                    q: s_page,
                    left: true
                })
            } else {
                if (!l && c == 3 && b == 4 && m < k.length - 1) {
                    d += item_container({
                        skin: "right",
                        onclick: "s_page=" + (s_page + 1) + "; render_secondhands();"
                    }, {
                        q: s_page + 2
                    })
                } else {
                    if (l && c == 3 && b == 0 && l_page != 0) {
                        d += item_container({
                            skin: "left",
                            onclick: "l_page=" + (l_page - 1) + "; render_secondhands('lostandfound');"
                        }, {
                            q: l_page,
                            left: true
                        })
                    } else {
                        if (l && c == 3 && b == 4 && m < k.length - 1) {
                            d += item_container({
                                skin: "right",
                                onclick: "l_page=" + (l_page + 1) + "; render_secondhands('lostandfound');"
                            }, {
                                q: l_page + 2
                            })
                        } else {
                            if (m < k.length && k[m++]) {
                                var h = k[m - 1];
                                var a = "secondhand" + (m - 1)
                                    , n = G.items[h.name];
                                d += item_container({
                                    skin: n.skin,
                                    onclick: g + "(" + (m - 1) + ")",
                                    def: n,
                                    id: a,
                                    draggable: false,
                                    droppable: false
                                }, h)
                            } else {
                                d += item_container({
                                    size: 40,
                                    draggable: false,
                                    droppable: false
                                })
                            }
                        }
                    }
                }
            }
        }
        d += "</div>"
    }
    d += "</div>";
    d += "<div id='merchant-item' style='display: inline-block; vertical-align: top; margin-left: 5px'></div>";
    $("#topleftcornerui").html(d)
}

function render_function_reference(g, d, e) {
    if (g == "character") {
        return show_json(game_stringify(character, 2))
    }
    if (!e) {
        code_eval('parent.render_function_reference("' + g + "\",window['" + g + "'],1);");
        return
    }
    if (!d && !window[g]) {
        return add_log("Reference not found", "gray")
    } else {
        if (!d) {
            d = window[g]
        }
    }
    var a = ""
        , b = randomStr(10);
    a += "<textarea class='codemirror" + b + "'></textarea>";
    show_modal(a, {
        wwidth: min($(window).width() - 60, 1200)
    });
    $(".codemirror" + b).codemirror({
        value: "//Source code of: " + g + "\n" + d.toString(),
        hints: true
    });
    position_modals()
}

function load_documentation(a) {
    render_function_reference(a, window[a])
}

function render_functions_directory() {
    hide_modal();
    var a = "<div style='/*background-color: black; border: 5px solid gray; padding: 4px; */min-width: 320px'>";
    G.docs.functions.forEach(function (b) {
        a += "<div class='gamebutton' style='display: block; margin-bottom: 4px' onclick='render_function_reference(\"" + b + "\")'>" + b + "</div>"
    });
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

function open_tutorial(a) {
    api_call("load_tutorial", {
        name: a
    })
}

function render_code_tutorials() {
    hide_modal();
    var a = "<div style='/*background-color: black; border: 5px solid gray; padding: 4px; */min-width: 320px'>";
    G.docs.tutorials.forEach(function (b) {
        a += "<div class='gamebutton' style='display: block; margin-bottom: 4px' onclick='open_tutorial(\"" + b[0] + "\")'>" + b[1] + "</div>"
    });
    a += "<div class='gamebutton' style='display: block; margin-bottom: 4px; color: #85C76B'>More Tutorials Coming Soon!</div>";
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

function render_useful_links() {
    hide_modal();
    var a = "<div style='/*background-color: black; border: 5px solid gray; padding: 4px; */width: 400px'>";
    a += "<a class='gamebutton' style='display: block; margin-bottom: 4px; border-color: #4D62A5' target='_blank' href='https://jsconsole.com'>JSConsole.com</a>";
    a += '<div class="mt4 blockbutton" style="text-align: left; margin-bottom: 4px">A very practical website to play with Javascript in a Console.</div>';
    a += "<a class='gamebutton' style='display: block; margin-bottom: 4px; border-color: #A45630' target='_blank' href='https://www.codecademy.com/learn/learn-javascript'>Code Academy: Javascript</a>";
    a += '<div class="mt4 blockbutton" style="text-align: left; margin-bottom: 4px">Code Academy\'s Javascript course - If the game\'s Tutorial was a bust, Code Academy\'s refined course will hopefully be more helpful :]</div>';
    a += "<a class='gamebutton' style='display: block; margin-bottom: 4px; border-color: #98B9A8' target='_blank' href='https://github.com/kaansoral/adventureland/blob/master/runner_functions.js'>Adventure Land's Github</a>";
    a += '<div class="mt4 blockbutton" style="text-align: left; margin-bottom: 4px">TODO to Myself: Gather and link to a page containing players\' Github Links</div>';
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

var data_path = [];

function render_data_reference(d) {
    hide_modal();
    if (!d) {
        data_path = []
    } else {
        data_path.push(d)
    }
    var b = G
        , c = "G";
    data_path.forEach(function (e) {
        b = b[e];
        c = c + "." + e
    });
    if (is_object(b) && data_path.length < 2) {
        var a = "<div style='/*background-color: black; border: 5px solid gray; padding: 6px;*/ min-width: 320px'>";
        object_sort(b).forEach(function (e) {
            var f = e[0];
            a += "<div class='gamebutton' style='display: block; margin-bottom: 4px' onclick='render_data_reference(\"" + f + "\")'>" + c + "." + f + "</div>"
        });
        a += "</div>";
        show_modal(a, {
            wrap: false
        })
    } else {
        show_json(b)
    }
}

function render_code_docs() {
    var a = "<div style='width:400px'>";
    a += "<div class='gamebutton' style='display: block; border-color: #EDF259; margin-bottom: 4px' onclick='render_code_tutorials()'>Learn [Basic to Advanced]</div>";
    a += "<div class='gamebutton' style='display: block; border-color: #A79674; margin-bottom: 4px' onclick='render_functions_directory()'>Functions [Reference]</div>";
    a += "<div class='gamebutton' style='display: block; border-color: #0AAFF1; margin-bottom: 4px' onclick='render_data_reference()'>Data [Reference]</div>";
    a += "<div class='gamebutton' style='display: block; border-color: #F0924A; margin-bottom: 4px' onclick='add_log(\"Coming soon!\")'>Events [Reference]</div>";
    a += "<div class='gamebutton' style='display: block; border-color: #EF688C; margin-bottom: 4px' onclick='add_log(\"Coming soon!\")'>Objects [Reference]</div>";
    a += "<div class='gamebutton' style='display: block; border-color: #A5A5A5; margin-bottom: 4px' onclick='render_useful_links()'>Useful Links</div>";
    a += '<div class="mt4 blockbutton" style="text-align: left">Note: CODE Documentation is a work in progress. It\'s not even v0 yet. The above buttons are just placeholders. You can use Discord/#feedback for ideas/requests.</div>';
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

function render_wishlist(f, g) {
    var e = "<div style='background-color: black; border: 5px solid gray; padding: 12px 20px 20px 20px; font-size: 24px; display: inline-block'>";
    e += "<div style='color: #f1c054; border-bottom: 2px dashed #C7CACA; margin-bottom: 3px; margin-left: 3px; margin-right: 3px' class='cbold'>Wishlist</div>";
    var h = []
        , k = 0;
    for (var a in G.items) {
        if (!G.items[a].ignore) {
            h.push([a, G.items[a], G.items[a].g || 0])
        }
    }
    h.sort(function (m, j) {
        return j[2] - m[2]
    });
    if (g >= 1) {
        k += 19 + (g - 1) * 18
    }
    for (var d = 0; d < 4; d++) {
        e += "<div>";
        for (var c = 0; c < 5; c++) {
            if (d == 3 && c == 0 && g != 0) {
                e += item_container({
                    skin: "left",
                    onclick: "render_wishlist(" + f + "," + (g - 1) + ");"
                }, {
                    q: g,
                    left: true
                })
            } else {
                if (d == 3 && c == 4 && k < h.length - 1) {
                    e += item_container({
                        skin: "right",
                        onclick: "render_wishlist(" + f + "," + (g + 1) + ");"
                    }, {
                        q: g + 2,
                        left: true
                    })
                } else {
                    if (k < h.length && h[k++]) {
                        var b = "wishlist" + (k - 1)
                            , l = h[k - 1][1]
                            , a = h[k - 1][0];
                        e += item_container({
                            skin: l.skin,
                            onclick: "wishlist_item_click('" + a + "'," + f + ")",
                            def: l,
                            id: b,
                            draggable: false,
                            droppable: false
                        }, null)
                    } else {
                        e += item_container({
                            size: 40,
                            draggable: false,
                            droppable: false
                        })
                    }
                }
            }
        }
        e += "</div>"
    }
    e += "</div>";
    $("#topleftcornerdialog").html(e);
    dialogs_target = character
}

var last_selector = "";

function render_item(t, b) {
    var w = b.item || {
        skin: "test",
        name: "Unrecognized Item",
        explanation: "Hmm. Curious."
    }
        , x = b.name
        , s = "gray"
        , r = b.value
        , h = b.cash
        , j = w.name
        , c = false;
    var p = b && b.actual;
    if (t && t != "html") {
        last_selector = t
    } else {
        if (t != "html") {
            t = last_selector
        }
    }
    var d = b.prop || calculate_item_properties(w, p || {})
        , a = calculate_item_grade(w, p || {});
    var k = "";
    if (!b.pure) {
        k += "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; " + (b.styles || "") + "' class='buyitem'>"
    }
    if (!w) {
        k += "ITEM"
    } else {
        if (w.type == "tarot" && w.minor) {
            k += "<img style='display: inline-block; margin: -8px 2px -6px -8px;' src='/images/cards/tarot/minor_arcana/tarot__" + w.minor + ".png' />"
        } else {
            if (w.type == "tarot") {
                k += "<img style='display: inline-block; margin: -8px 2px -6px -8px;' src='/images/cards/tarot/major_arcana/tarot__" + w.major + ".png' />"
            }
        }
        s = "#E4E4E4";
        if (w.grade == "mid") {
            s = "blue"
        }
        if (p && p.p == "shiny") {
            j = "Shiny " + j
        }
        if (d.level) {
            j += " +" + d.level
        }
        if (b.thumbnail) {
            k += "<div style='margin-left:-2px'>" + item_container({
                skin: w.skin,
                def: w
            }) + "</div>"
        }
        if (w.card) {
            k += "<div style='display:inline-block; vertical-align: top'>";
            k += "<div style='color: " + s + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + j + "</div><div></div>";
            k += "<div style='color: " + s + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px; color: #AB7951' class='cbold'>" + w.card + "</div>";
            k += "</div>"
        } else {
            if (!b.pure) {
                k += "<div style='color: " + s + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>" + j + "</div>"
            }
        }
        if (d.miss && w.type == "elixir") {
            k += bold_prop_line("Alcohol", d.miss + "%", "#7CAAF6")
        }
        (w.gives || []).forEach(function (f) {
            if (f[0] == "hp") {
                k += bold_prop_line("HP", "+" + to_pretty_num(f[1]), colors.hp)
            }
            if (f[0] == "mp") {
                k += bold_prop_line("MP", "+" + to_pretty_num(f[1]), colors.mp)
            }
        });
        if (d.gold) {
            k += bold_prop_line("Gold", (d.gold > 0 && "+" || "") + d.gold + "%", "gold")
        }
        if (d.luck) {
            k += bold_prop_line("Luck", (d.luck > 0 && "+" || "") + d.luck + "%", "#5DE376")
        }
        if (d.xp) {
            k += bold_prop_line("XP", "+" + d.xp + "%", "#1E73DE")
        }
        if (d.lifesteal) {
            k += bold_prop_line("Lifesteal", d.lifesteal + "%", "#9A1D27")
        }
        if (d.evasion) {
            k += bold_prop_line("Evasion", d.evasion + "%", "#7AC0F5")
        }
        if (d.miss && w.type != "elixir") {
            k += bold_prop_line("Miss", d.miss + "%", "#F36C6E")
        }
        if (d.reflection) {
            k += bold_prop_line("Reflection", d.reflection + "%", "#B484E5")
        }
        if (d.dreturn) {
            k += bold_prop_line("D.Return", d.dreturn + "%", "#E94959")
        }
        if (d.crit) {
            k += bold_prop_line("Crit", d.crit + "%", "#E52967")
        }
        if (d.attack) {
            k += bold_prop_line("Damage", d.attack, colors.attack)
        }
        if (d.range) {
            k += bold_prop_line("Range", "+" + d.range, colors.range)
        }
        if (d.hp) {
            k += bold_prop_line("HP", d.hp, colors.hp)
        }
        if (d.str) {
            k += bold_prop_line("Strength", d.str, colors.str)
        }
        if (d["int"]) {
            k += bold_prop_line("Intelligence", d["int"], colors["int"])
        }
        if (d.dex) {
            k += bold_prop_line("Dexterity", d.dex, colors.dex)
        }
        if (d.vit) {
            k += bold_prop_line("Vitality", d.vit, colors.hp)
        }
        if (d.mp) {
            k += bold_prop_line("MP", d.mp, colors.mp)
        }
        if (d.mp_cost) {
            k += bold_prop_line("MP Cost", d.mp_cost, colors.mp)
        }
        if (d.stat) {
            k += bold_prop_line("Stat", d.stat)
        }
        if (d.armor) {
            k += bold_prop_line("Armor", d.armor, colors.armor)
        }
        if (d.apiercing) {
            k += bold_prop_line("A.Piercing", d.apiercing, colors.armor)
        }
        if (d.rpiercing) {
            k += bold_prop_line("R.Piercing", d.rpiercing, colors.resistance)
        }
        if (d.resistance) {
            k += bold_prop_line("Resistance", d.resistance, colors.resistance)
        }
        if (w.wspeed == "slow") {
            k += bold_prop_line("Speed", "Slow", "gray")
        }
        if (d.speed) {
            k += bold_prop_line(w.wtype && "Run Speed" || "Speed", ((d.speed > 0) && "+" || "") + d.speed, colors.speed)
        }
        if (d.frequency) {
            k += bold_prop_line("A.Speed", d.frequency, "#3BE681")
        }
        if (d.output) {
            k += bold_prop_line("Damage Output", "+" + d.output + "%", "#D93319")
        }
        if (d.charisma) {
            k += bold_prop_line("Charisma", d.charisma, "#4DB174")
        }
        if (d.awesomeness) {
            k += bold_prop_line("Awesomeness", d.awesomeness, "#FFDE2F")
        }
        if (d.bling) {
            k += bold_prop_line("Bling", d.bling, "#A4E6FF")
        }
        if (d.cuteness) {
            k += bold_prop_line("Cuteness", d.cuteness, "#FD82F0")
        }
        if (a == 1 && w.type != "booster") {
            k += bold_prop_line("Grade", "High", "#696354")
        }
        if (a == 2 && w.type != "booster") {
            k += bold_prop_line("Grade", "Rare", "#6668AC")
        }
        if (p && w.type == "elixir" && b.slot == "elixir") {
            var g = round((-msince(new Date(p.expires))) / (6)) / 10;
            k += bold_prop_line("Hours", g, "gray")
        } else {
            if (w.type == "elixir") {
                k += bold_prop_line("Hours", w.duration, "gray")
            }
        }
        if (w.ability) {
            if (w.ability == "bash") {
                k += bold_prop_line("Ability", "Bash", colors.ability);
                k += "<div style='color: #C3C3C3'>Stuns the opponent for " + d.attr1 + " seconds with " + d.attr0 + "% chance.</div>"
            } else {
                if (w.ability == "freeze") {
                    k += bold_prop_line("Ability", "Freeze", "#2EBCE2");
                    k += "<div style='color: #C3C3C3'>Freezes the opponent with a " + d.attr0 + "% chance.</div>"
                } else {
                    if (w.ability == "secondchance") {
                        k += bold_prop_line("Ability", "Second Chance", colors.ability);
                        k += "<div style='color: #C3C3C3'>Avoid death with a " + d.attr0 + "% chance.</div>"
                    } else {
                        if (w.ability == "sugarrush") {
                            k += bold_prop_line("Ability", "Sugar Rush", "#D64770");
                            k += "<div style='color: #C3C3C3'>Trigger a Sugar Rush on attack with 0.25% chance. Gain 240 Attack Speed for 10 seconds!</div>"
                        } else {
                            if (G.skills[w.ability]) {
                                k += bold_prop_line("Ability", G.skills[w.ability].name, "#E1924D");
                                k += "<div style='color: #C3C3C3'>Activate the ability from the 'SKILLS' system.</div>"
                            }
                        }
                    }
                }
            }
        }
        if (w.explanation) {
            k += "<div style='color: #C3C3C3'>" + w.explanation + "</div>"
        }
        if (w.set) {
            k += "<div><span style='color: #f1c054;'>Set</span>: <span class='clickable' onclick='render_set(\"" + w.set + "\")'>" + G.sets[w.set].name + "</span></div>"
        }
        if (b.minutes !== undefined) {
            if (b.minutes < 1.5) {
                k += bold_prop_line("Seconds", parseInt(b.minutes * 60), "gray")
            } else {
                k += bold_prop_line("Minutes", parseInt(b.minutes), "gray")
            }
        }
        if (b.trade && p) {
            k += "<div style='margin-top: 5px'>";
            if ((p.q || 1) > 1) {
                k += "<div><span class='gray clickable' onclick='$(\".tradenum\").cfocus()'>Q:</span> <div class='inline-block tradenum' contenteditable=true>" + p.q + "</div></div>"
            }
            k += "<div><span class='gold clickable' onclick='$(\".sellprice\").focus()'>GOLD" + (((p.q || 1) > 1) && " [EACH]" || "") + ":</span> <div class='inline-block sellprice editable' contenteditable=true>1</div></div>";
            k += "<div><span class='clickable' onclick='trade(\"" + b.slot + '","' + b.num + '",$(".sellprice").shtml(),$(".tradenum").shtml())\'>PUT UP FOR SALE</span></div>';
            k += "</div>"
        }
        if (in_arr(b.slot, trade_slots) && p && p.price && b.from_player && !p.b) {
            c = true;
            if ((p.q || 1) > 1) {
                k += "<div><span class='gray clickable' onclick='$(\".tradenum\").cfocus()'>Q:</span> <div class='inline-block tradenum' contenteditable=true>1</div></div>"
            }
            k += "<div style='color: gold'>" + to_pretty_num(p.price) + " GOLD" + ((p.q || 1) > 1 && " <span style='color: white'>[EACH]</span>" || "") + "</div>";
            k += "<div><span class='clickable itu' onclick='trade_buy(\"" + b.slot + '","' + b.from_player + '","' + (p.rid || "") + '",$(".tradenum").html())\'>BUY</span></div>'
        }
        if (in_arr(b.slot, trade_slots) && p && p.price && b.from_player && p.b) {
            var n = false;
            if ((p.q || 1) > 1 && w.s) {
                n = true
            }
            c = true;
            if (n) {
                k += "<div><span class='gray clickable' onclick='$(\".tradenum\").cfocus()'>Q:</span> <div class='inline-block tradenum' contenteditable=true>1</div></div>"
            }
            k += "<div style='color: gold'>" + to_pretty_num(p.price) + " GOLD" + (n && " <span style='color: white'>[EACH]</span>" || "") + "</div>";
            k += "<div><span class='clickable ibu' onclick='trade_sell(\"" + b.slot + '","' + b.from_player + '","' + (p.rid || "") + '",$(".tradenum").html())\'>SELL</span></div>'
        }
        if (b.secondhand) {
            var e = 2;
            if (w.cash) {
                e = 3
            }
            c = true;
            k += "<div style='color: gold'>" + to_pretty_num(calculate_item_value(p) * e * (p.q || 1)) + " GOLD</div>";
            k += "<div><span class='clickable' onclick='secondhand_buy(\"" + (p.rid || "") + "\")'>BUY</span></div>"
        }
        if (b.lostandfound) {
            c = true;
            k += "<div style='color: gold'>" + to_pretty_num(calculate_item_value(p) * 4 * (p.q || 1)) + " GOLD</div>";
            k += "<div><span class='clickable' onclick='lostandfound_buy(\"" + (p.rid || "") + "\")'>BUY</span></div>"
        }
        if (r) {
            var v = "buy_with_gold";
            if (w.days) {
                k += "<div style='color: #C3C3C3'>Lasts 30 days</div>"
            }
            if (h) {
                k += "<div style='color: " + colors.cash + "'>" + to_pretty_num(w.cash) + " SHELLS</div>",
                    v = "buy_with_shells"
            } else {
                k += "<div style='color: gold'>" + to_pretty_num(r) + " GOLD</div>"
            }
            if (h && character && w.cash >= character.cash) {
                if (is_electron) {
                    k += "<div style='border-top: solid 2px gray; margin-bottom: 2px; margin-top: 3px; margin-left: -1px; margin-right: -1px'></div>";
                    k += "<div style='color: #C3C3C3'>You can find SHELLS from gems, monsters. In future, from achievements.</div>"
                } else {
                    k += "<div style='border-top: solid 2px gray; margin-bottom: 2px; margin-top: 3px; margin-left: -1px; margin-right: -1px'></div>";
                    k += "<div style='color: #C3C3C3'>You can find SHELLS from gems, monsters. In future, from achievements. For the time being, to receive SHELLS and support our game:</div>";
                    k += "<a href='https://adventure.land/shells' class='cancela' target='_blank'><span class='clickable' style='color: #EB8D3F'>BUY or EARN SHELLS</span></a> "
                }
            } else {
                if (w.s) {
                    var n = 1;
                    if (w.gives) {
                        n = 100
                    }
                    k += "<div style='margin-top: 5px'><!--<input type='number' value='1' class='buynum itemnumi'/> -->";
                    k += "<span class='gray clickable' onclick='$(\".buynum\").cfocus()'>Q:</span> <div class='inline-block buynum' contenteditable=true>" + n + "</div> <span class='gray'>|</span> ";
                    k += "<span class='clickable' onclick='" + v + '("' + x + '",parseInt($(".buynum").html()))\'>BUY</span> ';
                    k += "</div>"
                } else {
                    k += "<div><span class='clickable' onclick='" + v + '("' + x + "\")'>BUY</span></div>"
                }
            }
        }
        if (b.token && b.name && b.name != b.token) {
            var s = "#B6A786"
                , m = "TOKENS";
            var l = "#D3D5E0";
            if (b.token == "funtoken") {
                s = "#AA6AB3"
            } else {
                if (b.token == "pvptoken") {
                    l = "#CCAE08"
                } else {
                    if (b.token == "monstertoken") {
                        l = "#6C531B"
                    }
                }
            }
            if (G.tokens[b.token][b.name] == 1) {
                m = "TOKEN"
            }
            if (G.tokens[b.token][b.name] < 1) {
                k += "<div><span class='clickable' style='color: " + s + "' onclick='exchange_buy(\"" + b.token + '","' + b.name + "\")'>EXCHANGE " + (1 / G.tokens[b.token][b.name]) + " <span style='color:" + l + "'>[1 TOKEN]</span></span></div>"
            } else {
                k += "<div><span class='clickable' style='color: " + s + "' onclick='exchange_buy(\"" + b.token + '","' + b.name + "\")'>EXCHANGE <span style='color:" + l + "'>[" + G.tokens[b.token][b.name] + " " + m + "]</span></span></div>"
            }
        }
        if (b.sell && p) {
            var r = calculate_item_value(p);
            k += "<div style='color: gold'>" + to_pretty_num(r) + " GOLD</div>";
            if (w.s && p.q) {
                var n = p.q;
                k += "<div style='margin-top: 5px'>";
                k += "<span class='gray clickable' onclick='$(\".sellnum\").cfocus()'>Q:</span> <div class='inline-block sellnum' contenteditable=true>" + n + "</div> <span class='gray'>|</span> ";
                k += "<span class='clickable' onclick='sell(\"" + b.num + '",parseInt($(".sellnum").html()))\'>SELL</span> ';
                k += "</div>"
            } else {
                k += "<div><span class='clickable' onclick='sell(\"" + b.num + "\")'>SELL</span></div>"
            }
        }
        if (b.cancel) {
            k += "<div class='clickable' onclick='$(this).parent().remove()'>CLOSE</div>"
        }
        if (in_arr(x, booster_items)) {
            if (p && p.expires) {
                var g = round((-msince(new Date(p.expires))) / (6 * 24)) / 10;
                k += "<div style='color: #C3C3C3'>" + g + " days</div>"
            }
            if (!b.sell) {
                k += "<div class='clickable' onclick=\"btc(event); show_modal($('#boosterguide').html())\" style=\"color: #D86E89\">HOW TO USE</div>"
            }
        }
        if (!r && !b.sell && p && !c && !b.trade && !b.npc) {
            if (w.action) {
                var o = b && b.slot || b && b.num;
                k += '<div><span data-id="' + o + '" class="clickable" style="color: ' + s + '" onclick="' + w.onclick + '"">' + w.action + "</span></div>"
            }
            if (w.type == "computer") {
                k += "<div class='clickable' onclick='add_log(\"Beep. Boop.\")' style=\"color: #32A3B0\">NETWORK</div>"
            }
            if (w.type == "stand") {
                k += "<div class='clickable' onclick='socket.emit(\"trade_history\",{}); $(this).parent().remove()' style=\"color: #44484F\">TRADE HISTORY</div>"
            }
            if (0 && w.type == "computer" && (p.charges === undefined || p.charges) && gameplay == "normal") {
                k += '<div class=\'clickable\' onclick=\'socket.emit("unlock",{name:"code",num:"' + b.num + '"});\' style="color: #BA61A4">UNLOCK</div>'
            }
            if (w.type == "computer") {
                k += "<div class='clickable' onclick='render_computer($(this).parent())' style=\"color: #32A3B0\">NETWORK</div>"
            }
            if (w.type == "stand" && !character.stand) {
                k += "<div class='clickable' onclick='open_merchant(\"" + b.num + '"); $(this).parent().remove()\' style="color: #8E5E2C">OPEN</div>'
            }
            if (w.type == "stand" && character.stand) {
                k += "<div class='clickable' onclick='close_merchant(); $(this).parent().remove()' style=\"color: #8E5E2C\">CLOSE</div>"
            }
            if (w.type == "elixir" && !b.from_player) {
                var m = "DRINK";
                if (w.eat) {
                    m = "EAT"
                }
                k += "<div class='clickable' onclick='socket.emit(\"equip\",{num:\"" + b.num + '"}); $(this).parent().remove()\' style="color: #D86E89">' + m + "</div>"
            }
            if (w.type == "licence" && !b.from_player) {
                k += "<div class='clickable' onclick='socket.emit(\"equip\",{num:\"" + b.num + '"}); $(this).parent().remove()\' style="color: #574F58">USE</div>'
            }
            if (in_arr(p.name, ["stoneofxp", "stoneofgold", "stoneofluck"])) {
                k += "<div class='clickable' onclick='socket.emit(\"convert\",{num:\"" + b.num + '"});\' style="color: ' + colors.cash + '">CONVERT TO SHELLS</div>'
            }
            if (in_arr(p.name, booster_items)) {
                if (p.expires) {
                    k += "<div class='clickable' onclick='shift(\"" + b.num + '","' + booster_items[(booster_items.indexOf(p.name) + 1) % 3] + '"); $(this).parent().remove()\' style="color: #438EE2">SHIFT</div>'
                } else {
                    k += "<div class='clickable' onclick='activate(\"" + b.num + '","activate"); $(this).parent().remove()\' style="color: #438EE2">ACTIVATE</div>'
                }
            }
        }
        if (b.craft) {
            var u = 0;
            k += "<div style='margin-top: 5px'></div>";
            k += "<div style='color: " + s + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>Recipe</div>";
            k += "<div></div>";
            G.craft[x].items.forEach(function (f) {
                var y = undefined;
                if (f[0] != 1) {
                    y = f[0]
                }
                k += item_container({
                    skin: G.items[f[1]].skin,
                    onclick: "render_item_by_name('" + f[1] + "')"
                }, {
                    name: f[1],
                    q: y,
                    level: f[2]
                });
                u += 1;
                if (!(u % 4)) {
                    k += "<div></div>"
                }
            });
            k += bold_prop_line("Cost", to_pretty_num(G.craft[x].cost), "gold")
        }
        if (b.dismantle) {
            var u = 0;
            k += "<div style='margin-top: 5px'></div>";
            k += "<div style='color: " + s + "; display: inline-block; border-bottom: 2px dashed gray; margin-bottom: 3px' class='cbold'>Dismantles-to</div>";
            k += "<div></div>";
            G.dismantle[x].items.forEach(function (f) {
                var y = undefined;
                if (f[0] != 1) {
                    y = f[0]
                }
                k += item_container({
                    skin: G.items[f[1]].skin,
                    onclick: "render_item_by_name('" + f[1] + "')"
                }, {
                    name: f[1],
                    q: y
                });
                u += 1;
                if (!(u % 4)) {
                    k += "<div></div>"
                }
            });
            k += bold_prop_line("Cost", to_pretty_num(G.dismantle[x].cost), "gold")
        }
        if (b.from) {
            k += bold_prop_line("From", b.from, "#BED4DE")
        }
        if (p && p.l) {
            if (p.l == "s") {
                k += "<div class='ilsu'>Sealed</div>"
            } else {
                if (p.l == "u") {
                    k += "<div class='iluu'>Unsealing</div>"
                } else {
                    k += "<div style='color: #404141'>Locked</div>"
                }
            }
        }
    }
    if (!b.pure) {
        k += "</div>"
    }
    if (t == "html") {
        return k
    } else {
        $(t).html(k)
    }
}

function render_item_by_name(a) {
    render_item(null, {
        skin: G.items[a].skin,
        item: G.items[a]
    })
}

function wishlist_form(b, a) {
    wishlist(b, a, $(".wprice").shtml(), $(".wnumq").shtml(), $(".wlevel").shtml())
}

function render_wishlist_item(b, a) {
    var d = G.items[b]
        , c = "";
    c += "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 240px; min-width:200px;' class='buyitem'>";
    c += "<div style='margin-left:-2px; display:inline-block; vertical-align:middle'>" + item_container({
        skin: d.skin,
        def: d
    }) + "</div>";
    c += "<div style='display:inline-block; vertical-align:top; margin-left: 4px'>";
    c += "<div style='color: #f1c054; border-bottom: 2px dashed #C7CACA; margin-bottom: 3px; margin-left: 3px; margin-right: 3px; display: inline-block' class='cbold'>Wishlist</div>";
    c += "<div></div>";
    c += "<div style='color: #E4E4E4; border-bottom: 2px dashed gray; margin-bottom: 3px; display: inline-block' class='cbold'>" + d.name + "</div>";
    c += "</div>";
    c += "<div><span class='gray clickable' onclick='$(\".wnumq\").cfocus()'>Q:</span> <div class='inline-block wnumq' contenteditable=true>1</div></div>";
    c += "<div><span class='gold clickable' onclick='$(\".wprice\").cfocus()'>GOLD" + (d.s && " [EACH]" || "") + ":</span> <div class='inline-block wprice editable' contenteditable=true>" + (calculate_item_value({
        name: b
    }) + 1) + "</div></div>";
    if (d.compound || d.upgrade) {
        c += "<div><span style='color:#9E7BCA' class='clickable' onclick='$(\".wlevel\").cfocus()'>LEVEL:</span> <div class='inline-block wlevel editable' contenteditable=true data-default='0'>0</div></div>"
    }
    c += "<div><span class='clickable' onclick='wishlist_form(" + a + ',"' + b + "\")'>WISHLIST</span></div>";
    c += "</div>";
    $("#topleftcornerdialog").html(c);
    dialogs_target = character
}

function render_set(b) {
    var d = G.sets[b]
        , a = last_selector;
    var c = "<div style='background-color: black; border: 5px solid gray; font-size: 24px; display: inline-block; padding: 20px; line-height: 24px; max-width: 280px;' class='buyitem'>";
    c += "<div style='color: #f1c054; border-bottom: 2px dashed #C7CACA; margin-bottom: 3px' class='cbold'>" + d.name + "</div>";
    c += "<div style='margin-left:-2px; margin-right:-2px;'>";
    d.items.forEach(function (e) {
        c += item_container({
            skin: G.items[e].skin
        })
    });
    c += "</div>";
    [1, 2, 3, 4, 5].forEach(function (e) {
        if (d[e]) {
            c += "<div><span style='color:#8A8D8F'>[" + e + " Equipped]</span> " + render_item("html", {
                pure: true,
                item: d[e],
                prop: d[e]
            }) + "</div>"
        }
    });
    c += "</div>";
    $(a).html(c)
}

function render_condition(a, b) {
    var d = G.conditions[b]
        , c = 0
        , e = undefined;
    if (ctarget && ctarget.s[b] && ctarget.s[b].ms) {
        c = ctarget.s[b].ms / 6000 / 10
    }
    if (ctarget && ctarget.s[b] && ctarget.s[b].f) {
        e = ctarget.s[b].f
    }
    render_item(a, {
        skin: d.skin,
        item: d,
        minutes: c,
        from: e
    })
}

function render_item_selector(a, c) {
    if (c && !c.purpose) {
        purpose = "buying"
    }
    var b = []
        , g = 0
        , e = "<div style='border: 5px solid gray; height: 400px; overflow: scroll; background: black'>";
    for (var h in G.items) {
        if (!G.items[h].ignore) {
            b.push(G.items[h])
        }
    }
    b.sort(function (k, j) {
        return j.g - k.g
    });
    for (var d = 0; d < b.length; d++) {
        var f = b[d];
        e += item_container({
            skin: f.skin,
            def: f,
            onclick: "gallery_click('" + f.id + "')"
        });
        g++;
        if (!(g % 5)) {
            e += "<br />"
        }
    }
    e += "</div>";
    $(a).html(e)
}

function allow_drop(a) {
    if (a.preventDefault) {
        a.preventDefault()
    }
    if (a.stopPropagation) {
        a.stopPropagation()
    }
}

function on_drag_start(a) {
    last_drag_start = new Date();
    a.dataTransfer.setData("text", a.target.id)
}

function on_rclick(g) {
    var b = $(g)
        , a = b.data("inum")
        , f = b.data("snum")
        , c = b.data("sname")
        , h = b.data("onrclick");
    if (h) {
        smart_eval(h)
    } else {
        if (c !== undefined) {
            socket.emit("unequip", {
                slot: c
            })
        } else {
            if (f !== undefined) {
                socket.emit("bank", {
                    operation: "swap",
                    inv: -1,
                    str: f,
                    pack: last_rendered_items
                })
            } else {
                if (a !== undefined) {
                    if (topleft_npc == "items") {
                        socket.emit("bank", {
                            operation: "swap",
                            inv: a,
                            str: -1,
                            pack: last_rendered_items
                        })
                    } else {
                        if (topleft_npc == "merchant") {
                            var j = character.items[parseInt(a)];
                            if (!j) {
                                return
                            }
                            render_item("#merchant-item", {
                                item: G.items[j.name],
                                name: j.name,
                                actual: j,
                                sell: 1,
                                num: parseInt(a)
                            })
                        } else {
                            if (topleft_npc == "exchange") {
                                var g = character.items[a]
                                    , d = null;
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
                                    var e = $("#citem" + a).all_html();
                                    $("#citem" + a).parent().html("");
                                    $("#eitem").html(e)
                                }
                            } else {
                                if (topleft_npc == "none") {
                                    var g = character.items[a]
                                        , d = null;
                                    if (g) {
                                        d = G.items[g.name]
                                    }
                                    if (!d) {
                                        return
                                    }
                                    if (p_item !== null) {
                                        return
                                    }
                                    p_item = a;
                                    var e = $("#citem" + a).all_html();
                                    $("#citem" + a).parent().html("");
                                    $("#pitem").html(e)
                                } else {
                                    if (topleft_npc == "locksmith") {
                                        var g = character.items[a]
                                            , d = null;
                                        if (g) {
                                            d = G.items[g.name]
                                        }
                                        if (!d) {
                                            return
                                        }
                                        if (l_item !== null) {
                                            return
                                        }
                                        l_item = a;
                                        var e = $("#citem" + a).all_html();
                                        $("#citem" + a).parent().html("");
                                        $("#litem").html(e)
                                    } else {
                                        if (topleft_npc == "upgrade") {
                                            var g = character.items[a]
                                                , d = null;
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
                                                var e = $("#citem" + a).all_html();
                                                $("#citem" + a).parent().html("");
                                                $("#uweapon").html(e)
                                            }
                                            if (d.type == "uscroll" || d.type == "pscroll") {
                                                if (u_scroll !== null) {
                                                    return
                                                }
                                                u_scroll = a;
                                                var e = $("#citem" + a).all_html();
                                                if ((character.items[a].q || 1) < 2) {
                                                    $("#citem" + a).parent().html("")
                                                }
                                                $("#uscroll").html(e)
                                            }
                                            if (d.type == "offering") {
                                                if (u_offering !== null) {
                                                    return
                                                }
                                                u_offering = a;
                                                var e = $("#citem" + a).all_html();
                                                if ((character.items[a].q || 1) < 2) {
                                                    $("#citem" + a).parent().html("")
                                                }
                                                $("#uoffering").html(e)
                                            }
                                        } else {
                                            if (topleft_npc == "compound") {
                                                var g = character.items[a]
                                                    , d = null;
                                                if (g) {
                                                    d = G.items[g.name]
                                                }
                                                if (!d) {
                                                    return
                                                }
                                                if (d.compound && c_last < 3) {
                                                    c_items[c_last] = a;
                                                    var e = $("#citem" + a).all_html();
                                                    $("#citem" + a).parent().html("");
                                                    $("#compound" + c_last).html(e);
                                                    c_last++
                                                }
                                                if (d.type == "cscroll") {
                                                    if (c_scroll !== null) {
                                                        return
                                                    }
                                                    c_scroll = a;
                                                    var e = $("#citem" + a).all_html();
                                                    if ((character.items[a].q || 1) < 2) {
                                                        $("#citem" + a).parent().html("")
                                                    }
                                                    $("#cscroll").html(e)
                                                }
                                                if (d.type == "offering") {
                                                    if (c_offering !== null) {
                                                        return
                                                    }
                                                    c_offering = a;
                                                    var e = $("#citem" + a).all_html();
                                                    if ((character.items[a].q || 1) < 2) {
                                                        $("#citem" + a).parent().html("")
                                                    }
                                                    $("#coffering").html(e)
                                                }
                                            } else {
                                                if (topleft_npc == "craftsman") {
                                                    var g = character.items[a]
                                                        , d = null;
                                                    if (g) {
                                                        d = G.items[g.name]
                                                    }
                                                    if (!d) {
                                                        return
                                                    }
                                                    if (cr_last < 9) {
                                                        cr_items[cr_last] = a;
                                                        var e = $("#citem" + a).all_html();
                                                        $("#citem" + a).parent().html("");
                                                        $("#critem" + cr_last).html(e);
                                                        cr_last++
                                                    }
                                                } else {
                                                    if (topleft_npc == "dismantler") {
                                                        if (ds_item !== null) {
                                                            return
                                                        }
                                                        ds_item = a;
                                                        var e = $("#citem" + a).all_html();
                                                        if ((character.items[a].q || 1) < 2) {
                                                            $("#citem" + a).parent().html("")
                                                        }
                                                        $("#dsitem").html(e)
                                                    } else {
                                                        a = parseInt(a, 10);
                                                        if (character && character.items[a] && G.items[character.items[a].name].type == "elixir") {
                                                            return
                                                        }
                                                        socket.emit("equip", {
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
        }
    }
}

function on_drop(q) {
    if (q.preventDefault) {
        q.preventDefault()
    }
    if (q.stopPropagation) {
        q.stopPropagation()
    }
    var w = q.dataTransfer.getData("text")
        , m = false
        , p = false;
    var c = $(document.getElementById(w))
        , v = $(q.target);
    while (v && v.parent() && v.attr("ondrop") == undefined) {
        v = v.parent()
    }
    var b = v.data("cnum")
        , f = v.data("slot")
        , a = v.data("strnum")
        , s = v.data("trigrc")
        , t = v.data("skid");
    var x = c.data("inum")
        , u = c.data("sname")
        , l = c.data("snum")
        , d = c.data("skname");
    console.log(b + " " + x + " " + f + " " + u + " skid: " + t + " skname: " + d);
    if (x !== undefined && t !== undefined) {
        x = parseInt(x);
        if ((x || x === 0) && character.items[x]) {
            keymap[t] = {
                type: "item",
                name: character.items[x].name
            };
            set_setting(real_id, "keymap", keymap);
            render_skills();
            render_skills()
        }
    } else {
        if (d !== undefined && t !== undefined) {
            if (d == "eval") {
                keymap[t] = {
                    name: "eval",
                    code: "add_log('Empty eval','gray')"
                }
            } else {
                if (d == "snippet") {
                    keymap[t] = {
                        name: "snippet",
                        code: "game_log('Empty snippet','gray')"
                    }
                } else {
                    if (d == "throw") {
                        var h = 0
                            , k = true;
                        while (k) {
                            k = false;
                            for (var n in keymap) {
                                if (keymap[n] && keymap[n].name && keymap[n].name == "throw" && keymap[n].num == h) {
                                    h++,
                                        k = true
                                }
                            }
                        }
                        keymap[t] = {
                            name: "throw",
                            num: h
                        }
                    } else {
                        keymap[t] = d
                    }
                }
            }
            set_setting(real_id, "keymap", keymap);
            render_skills();
            render_skills()
        } else {
            if (s != undefined && x != undefined) {
                on_rclick(c.get(0))
            } else {
                if (l != undefined && a != undefined) {
                    socket.emit("bank", {
                        operation: "move",
                        a: l,
                        b: a,
                        pack: last_rendered_items
                    });
                    m = true
                } else {
                    if (a != undefined && x != undefined) {
                        socket.emit("bank", {
                            operation: "swap",
                            inv: x,
                            str: a,
                            pack: last_rendered_items
                        });
                        p = true
                    } else {
                        if (b != undefined && l != undefined) {
                            socket.emit("bank", {
                                operation: "swap",
                                inv: b,
                                str: l,
                                pack: last_rendered_items
                            });
                            p = true
                        } else {
                            if (b !== undefined && b == x) {
                                if (is_mobile && mssince(last_drag_start) < 300) {
                                    inventory_click(parseInt(x))
                                }
                            } else {
                                if (b != undefined && x != undefined) {
                                    socket.emit("imove", {
                                        a: b,
                                        b: x
                                    });
                                    m = true
                                } else {
                                    if (u !== undefined && u == f) {
                                        if (is_mobile && mssince(last_drag_start) < 300) {
                                            slot_click(f)
                                        }
                                    } else {
                                        if (b != undefined && u != undefined) {
                                            socket.emit("unequip", {
                                                slot: u,
                                                position: b
                                            })
                                        } else {
                                            if (f != undefined && x != undefined) {
                                                if (in_arr(f, trade_slots)) {
                                                    if (character.slots[f]) {
                                                        return
                                                    }
                                                    try {
                                                        var o = character.items[parseInt(x)];
                                                        render_item("#topleftcornerdialog", {
                                                            trade: 1,
                                                            item: G.items[o.name],
                                                            actual: o,
                                                            num: parseInt(x),
                                                            slot: f
                                                        });
                                                        $(".editable").focus();
                                                        dialogs_target = ctarget
                                                    } catch (r) {
                                                        console.log("TRADE-ERROR: " + r)
                                                    }
                                                } else {
                                                    socket.emit("equip", {
                                                        num: x,
                                                        slot: f
                                                    }),
                                                        p = true
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
    if (m) {
        var j = c.all_html()
            , g = v.html();
        v.html("");
        c.parent().html(g);
        v.html(j)
    }
    if (p) {
        v.html(c.all_html())
    }
}

function item_container(A, r) {
    var k = ""
        , g = ""
        , z = 3
        , m = ""
        , f = ""
        , s = ""
        , b = ""
        , t = A.bcolor || "gray"
        , l = "#C5C5C5"
        , B = ""
        , q = A.size || 40
        , n = null
        , e = false;
    if (r && r.name) {
        n = G.items[r.name]
    }
    if (r && n) {
        if ((n.upgrade && r.level > 8 || n.compound && r.level > 4)) {
            t = l
        }
        if (calculate_item_grade(r) == 2 || calculate_item_value(r) > 5000000) {
            t = l;
            e = true
        }
    }
    if (n && r && n.type == "booster" && r.level) {
        t = l
    }
    if (A.draggable || !("draggable" in A)) {
        m += " draggable='true' ondragstart='on_drag_start(event)'";
        f += "ondrop='on_drop(event)' ondragover='allow_drop(event)'"
    }
    if (A.droppable) {
        A.trigrc = true;
        f += "ondrop='on_drop(event)' ondragover='allow_drop(event)'"
    }
    if (A.onclick) {
        f += ' onclick="' + A.onclick + '" class="clickable" '
    }
    if (A.cnum != undefined) {
        b = "data-cnum='" + A.cnum + "' "
    }
    if (A.trigrc != undefined) {
        b = "data-trigrc='1'"
    }
    if (A.strnum != undefined) {
        b = "data-strnum='" + A.strnum + "' "
    }
    if (A.slot != undefined) {
        b = "data-slot='" + A.slot + "' "
    }
    if (A.skid != undefined) {
        b = "data-skid='" + A.skid + "' "
    }
    if (A.cid) {
        f += " id='" + A.cid + "' "
    }
    k += "<div " + b + "style='position: relative; display:inline-block; margin: 2px; border: 2px solid " + t + "; height: " + (q + 2 * z) + "px; width: " + (q + 2 * z) + "px; background: black; vertical-align: top' " + f + ">";
    if (A.skid && !A.skin) {
        k += "<div class='truui' style='border-color: gray; color: white'>" + A.skid + "</div>"
    }
    if (A.shade) {
        var u = G.itemsets[G.positions[A.shade][0] || "pack_1a"]
            , c = q / u.size;
        var p = G.positions[A.shade][1]
            , o = G.positions[A.shade][2];
        k += "<div style='position: absolute; top: -2px; left: -2px; padding:" + (z + 2) + "px'>";
        k += "<div style='overflow: hidden; height: " + (q) + "px; width: " + (q) + "px;'>";
        k += "<img style='width: " + (u.columns * u.size * c) + "px; height: " + (u.rows * u.size * c) + "px; margin-top: -" + (o * q) + "px; margin-left: -" + (p * q) + "px; opacity: " + (A.s_op || 0.36) + ";' src='" + u.file + "' draggable='false' />";
        k += "</div>";
        k += "</div>"
    }
    if (A.skin) {
        if (!G.positions[A.skin]) {
            A.skin = "placeholder"
        }
        var w = G.itemsets[G.positions[A.skin][0] || "pack_1a"]
            , j = G.positions[A.skin][1]
            , h = G.positions[A.skin][2];
        var D = q / w.size;
        if (r && r.level && r.level > 7) {
            B += " glow" + min(A.level, 10)
        }
        if (A.num != undefined) {
            s = "class='rclick" + B + "' data-inum='" + A.num + "'"
        }
        if (A.snum != undefined) {
            s = "class='rclick" + B + "' data-snum='" + A.snum + "'"
        }
        if (A.sname != undefined) {
            s = "class='rclick" + B + "' data-sname='" + A.sname + "'"
        }
        if (A.skname != undefined) {
            s = "class='rclick" + B + "' data-skname='" + A.skname + "'"
        }
        if (A.on_rclick) {
            s = "class='rclick" + B + "' data-onrclick=\"" + A.on_rclick + '"'
        }
        k += "<div " + s + " style='background: black; position: absolute; bottom: -2px; left: -2px; border: 2px solid " + t + ";";
        k += "padding:" + (z) + "px; overflow: hidden' " + ("id='" + (A.id || ("rid" + randomStr(12))) + "'") + " " + m + ">";
        k += "<div style='overflow: hidden; height: " + (q) + "px; width: " + (q) + "px;'>";
        k += "<img style='width: " + (w.columns * w.size * D) + "px; height: " + (w.rows * w.size * D) + "px; margin-top: -" + (h * q) + "px; margin-left: -" + (j * q) + "px;' src='" + w.file + "' draggable='false' />";
        k += "</div>";
        if (r) {
            var v = "u";
            if (n && n.compound) {
                v = "c"
            }
            if (r.q && r.left) {
                k += "<div class='iuui' style='color: white'>" + r.q + "</div>"
            } else {
                if (r.q && r.q != 1) {
                    if (r.b) {
                        k += "<div class='iqui gray'>" + r.q + "</div>"
                    } else {
                        if (n && n.gives && n.gives[0] && n.gives[0][0] == "hp") {
                            k += "<div class='iqui iqhp'>" + r.q + "</div>"
                        } else {
                            if (n && n.gives && n.gives[0] && n.gives[0][0] == "mp") {
                                k += "<div class='iqui iqmp'>" + r.q + "</div>"
                            } else {
                                k += "<div class='iqui'>" + r.q + "</div>"
                            }
                        }
                    }
                }
            }
            if (r.level) {
                var a = r.level
                    , d = a;
                if (n.type == "booster") {
                    d = a = (r.level == 1 && "A" || r.level == 2 && "B" || r.level == 3 && "C" || r.level == 4 && "D" || r.level == 5 && "E" || r.level > 5 && "W")
                }
                if (e && n.compound && d == 3) {
                    d = 4
                }
                if (e && n.upgrade && d == 7) {
                    d = 8
                }
                k += "<div class='iuui " + v + "level" + min(d, n.compound && 5 || 12) + "' style='border-color: " + t + "'>" + (a == 10 && "X" || a == 11 && "Y" || a == 12 && "Z" || a == 5 && v == "c" && "V" || a) + "</div>"
            }
            if (r.s) {
                k += "<div class='iqui'>" + r.s + "</div>"
            }
        }
        if (A.slot && in_arr(A.slot, trade_slots)) {
            if (r && r.b) {
                k += "<div class='truui ibu' style='border-color: " + t + ";'>?</div>"
            } else {
                k += "<div class='truui itu' style='border-color: " + t + ";'>$</div>"
            }
        } else {
            if (r && r.l && !A.slot) {
                if (r.l == "s") {
                    k += "<div class='truui ilsu' style='border-color: " + t + ";'>S</div>"
                } else {
                    if (r.l == "u") {
                        k += "<div class='truui iluu' style='border-color: " + t + ";'>U</div>"
                    } else {
                        k += "<div class='truui ixu' style='border-color: " + t + ";'>X</div>"
                    }
                }
            }
        }
        if (r && r.v) {
            k += "<div class='trruui ivu' style='border-color: " + t + "; line-height: 7px'><br />^</div>"
        } else {
            if (r && r.m) {
                k += "<div class='trruui imu' style='border-color: " + t + ";'>M</div>"
            }
        }
        if (A.skid) {
            k += "<div class='skidloader" + A.skid + "' style='position: absolute; bottom: 0px; right: 0px; width: 4px; height: 0px; background-color: yellow'></div>";
            k += "<div class='truui' style='border-color: gray; color: white'>" + A.skid + "</div>";
            if (r && r.name == "throw") {
                k += "<div class='iqui'>[" + (r.num || 0) + "]</div>"
            }
        }
        k += "</div>"
    }
    k += "</div>";
    return k
}

function render_skillbar(c) {
    if (c) {
        $("#skillbar").html("").hide();
        return
    }
    var b = "<div style='background-color: black; border: 5px solid gray; padding: 2px; display: inline-block' class='enableclicks'>"
        , a = 0;
    skillbar.forEach(function (f) {
        var e = keymap[f]
            , d = e;
        if (e) {
            if (e && e.skin) {
                d = e.skin
            } else {
                if (e.type == "item" && G.items[e.name]) {
                    d = G.items[e.name].skin
                } else {
                    if (G.skills[e.name || e]) {
                        d = G.skills[e.name || e].skin
                    }
                }
            }
            b += item_container({
                skid: f,
                skin: d || "",
                draggable: false,
                droppable: true,
                onclick: "on_skill('" + f + "')"
            }, e)
        } else {
            b += item_container({
                skid: f,
                draggable: false,
                droppable: true
            })
        }
        if (!(skillbar.length >= 8 && !(skillbar.length % 2) && !(a % 2))) {
            b += "<div></div>"
        }
        a++
    });
    b += "</div>";
    $("#skillbar").html(b).css("display", "inline-block");
    restart_skill_tints()
}

function skill_click(a) {
    if (skillsui && keymap[a]) {
        render_skill("#skills-item", keymap[a].name || keymap[a], keymap[a])
    }
    if (G.skills[a]) {
        render_skill("#skills-item", a)
    }
}

var skills_page = "I";

function render_skills() {
    var l = 0
        , d = "text-align: right";
    if (skillsui) {
        $("#theskills").remove();
        skillsui = false;
        render_skillbar();
        return
    }
    var h = "<div id='skills-item' style='display: inline-block; vertical-align: top; margin-right: 5px'></div>";
    h += "<div style='background-color: black; border: 5px solid gray; padding: 2px; font-size: 24px; display: inline-block'>";
    h += "<div class='textbutton' style='margin-left: 5px'><span  onclick='btc(event); show_snippet()'>MAPPING</span> <span style='color: " + (skills_page == "I" && "#76BDE5" || "#7C7C7C") + ";' class='clickable' onclick='btc(event); skills_page=\"I\"; render_skills(); render_skills();'>1</span> <span style='color: " + (skills_page == "II" && "#E38241" || "#7C7C7C") + ";' class='clickable' onclick='btc(event); skills_page=\"II\"; render_skills(); render_skills();'>2</span> <span style='color: " + (skills_page == "U" && "#8FCE72" || "#7C7C7C") + ";' class='clickable' onclick='btc(event); skills_page=\"U\"; render_skills(); render_skills();'>U</span> <span style='float:right; color: #7C7C7C; margin-right: 5px' class='clickable' onclick='btc(event); show_json(keymap)'><span style='color:#DECE31'>&gt;</span> DATA <span style='color:#DECE31'>&lt;</span></span></div>";
    var c = ["1", "2", "3", "4", "5", "6", "7"]
        , b = ["Q", "W", "E", "R", "X", "T", "B"];
    if (skills_page == "II") {
        c = ["8", "9", "0", "G", "H", "J", "K"],
            b = ["SHIFT", "Z", "V", "M", "P", "D", "BACK"]
    }
    if (skills_page == "U") {
        c = ["ESC", "A", "C", "F", "I", "TAB", "ENTER"],
            b = ["UP", "LEFT", "DOWN", "RIGHT", ",", "S", "U"]
    }
    h += "<div>";
    c.forEach(function (o) {
        var j = keymap[o]
            , a = j;
        if (j && j.skin) {
            a = j.skin
        } else {
            if (j && j.type == "item" && G.items[j.name]) {
                a = G.items[j.name].skin
            } else {
                if (j && G.skills[j.name || j]) {
                    a = G.skills[j.name || j].skin
                }
            }
        }
        h += item_container({
            skid: o,
            skin: a || "",
            onclick: "on_skill('" + o + "')"
        }, j)
    });
    h += "</div>";
    h += "<div>";
    b.forEach(function (o) {
        var j = keymap[o]
            , a = j;
        if (j && j.skin) {
            a = j.skin
        } else {
            if (j && j.type == "item" && G.items[j.name]) {
                a = G.items[j.name].skin
            } else {
                if (j && G.skills[j.name || j]) {
                    a = G.skills[j.name || j].skin
                }
            }
        }
        h += item_container({
            skid: o,
            skin: a || "",
            onclick: "on_skill('" + o + "')"
        }, j)
    });
    h += "</div>";
    h += "<div class='textbutton' style='margin-left: 5px'><span class='clickable' onclick='btc(event); show_json(G.skills)'>SKILLS</span> <span style='float:right; color: #7C7C7C; margin-right: 5px' class='clickable' onclick='btc(event); show_modal($(\"#keymapguide\").html())'><span style='color:#60B8C7'>&gt;</span> CONFIG <span style='color:#60B8C7'>&lt;</span></span></div>";
    var n = []
        , m = 0
        , k = []
        , g = 0;
    object_sort(G.skills).forEach(function (p) {
        var j = p[0]
            , a = p[1];
        if (a.slot) {
            var o = false;
            a.slot.forEach(function (q) {
                if (character.slots[q[0]] && character.slots[q[0]].name == q[1]) {
                    o = true
                }
            });
            if (!o) {
                return
            }
        }
        if (a.type == "skill" && (!a["class"] || in_arr(character.ctype, a["class"]) || character.role == "gm")) {
            n.push({
                name: j
            })
        }
        if (a.type == "passive" && (!a["class"] || in_arr(character.ctype, a["class"]) || character.role == "gm")) {
            n.push({
                name: j
            })
        }
        if (a.type == "ability" && (!a["class"] || in_arr(character.ctype, a["class"]) || character.role == "gm")) {
            k.push({
                name: j
            })
        }
        if (a.type == "utility" && a.ui !== false && (!a["class"] || in_arr(character.ctype, a["class"]))) {
            k.push({
                name: j
            })
        }
    });
    if (character.role == "gm") {
        k.push({
            name: "gm"
        })
    }
    for (var f = 0; f < 10; f++) {
        h += "<div>";
        for (var e = 0; e < 7; e++) {
            if (m < n.length) {
                h += item_container({
                    skin: G.skills[n[m].name].skin,
                    onclick: "skill_click('" + n[m].name + "')",
                    skname: n[m].name
                }, n[m])
            } else {
                h += item_container({})
            }
            m++
        }
        h += "</div>";
        if (m >= n.length) {
            break
        }
    }
    h += "<div class='textbutton' style='margin-left: 5px' onclick='btc(event); show_json(G.skills)'>ABILITIES</div>";
    for (var f = 0; f < 10; f++) {
        h += "<div>";
        for (var e = 0; e < 7; e++) {
            if (g < k.length) {
                h += item_container({
                    skin: G.skills[k[g].name].skin,
                    onclick: "skill_click('" + k[g].name + "')",
                    skname: k[g].name
                }, k[g])
            } else {
                h += item_container({})
            }
            g++
        }
        h += "</div>";
        if (g >= k.length) {
            break
        }
    }
    h += "</div>";
    skillsui = true;
    render_skillbar(1);
    $("body").append("<div id='theskills' style='position: fixed; z-index: 310; bottom: 0px; right: 0px'></div>");
    $("#theskills").html(h);
    restart_skill_tints()
}

function render_teleporter() {
    var a = "<div style='max-width: 420px; text-align: center'>";
    for (var b in G.maps) {
        if (!G.maps[b].ignore && !G.maps[b].instance) {
            a += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='socket.emit(\"transport\",{to:\"" + b + "\"})'>" + G.maps[b].name + "</div>"
        }
    }
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

function render_travel(b) {
    var a = "<div style='max-width: 420px; text-align: center'>"
        , c = "code_travel";
    if (b) {
        c = "render_spawns"
    }
    object_sort(G.maps).forEach(function (e) {
        var d = e[0];
        if (!G.maps[d].ignore && (!G.maps[d].unlist || b) && !G.maps[d].instance && (!G.maps[d].irregular || b)) {
            a += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='hide_modal(); " + c + '("' + d + "\");'>" + G.maps[d].name + "</div>"
        }
    });
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

function render_gmonsters(b) {
    var a = "<div style='max-width: 420px; text-align: center'>";
    object_sort(G.monsters).forEach(function (d) {
        var c = d[0];
        a += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='hide_modal(); socket.emit(\"gm\",{action:\"mjump\",monster:\"" + c + "\"});'>" + G.monsters[c].name + "</div>"
    });
    a += "</div>";
    show_modal(a, {
        wrap: false
    })
}

function render_spawns(c) {
    var b = "<div style='max-width: 420px; text-align: center'>"
        , a = 0;
    G.maps[c].spawns.forEach(function (d) {
        b += "<div class='gamebutton' style='margin-left: 5px; margin-bottom: 5px' onclick='direct_travel(\"" + c + '","' + a + "\"); hide_modal()'>" + c + "[" + a + "]</div>";
        a++
    });
    b += "</div>";
    show_modal(b, {
        wrap: false
    })
}

function render_interaction(h, f) {
    if (f != "return_html") {
        topleft_npc = "interaction";
        rendered_target = topleft_npc;
        rendered_interaction = h
    }
    var b = 0
        , j = 0
        , d = "/images/tiles/characters/npc1.png"
        , c = "normal";
    var g = "<div style='background-color: #E5E5E5; color: #010805; border: 5px solid gray; padding: 6px 12px 6px 12px; font-size: 30px; display: inline-block; max-width: 420px'>";
    if (h.auto) {
        d = FC[h.skin];
        b = FM[h.skin][1];
        j = FM[h.skin][0];
        if (h.dialog) {
            h = h.dialog
        }
    } else {
        if (in_arr(h, ["wizard", "hardcoretp"])) {
            b = 2;
            j = 0;
            d = "/images/tiles/characters/chara8.png"
        } else {
            if (in_arr(h, ["santa", "candycane_success"])) {
                b = 0;
                j = 0;
                d = "/images/tiles/characters/animationc.png";
                c = "animation"
            } else {
                if (in_arr(h, ["leathers", "leather_success"])) {
                    b = 1;
                    j = 0;
                    d = "/images/tiles/characters/npc5.png"
                } else {
                    if (in_arr(h, ["lostearring", "lostearring_success"])) {
                        b = 3;
                        j = 0;
                        d = "/images/tiles/characters/chara8.png"
                    } else {
                        if (in_arr(h, ["mistletoe", "mistletoe_success"])) {
                            b = 0;
                            j = 0;
                            d = "/images/tiles/characters/chara8.png"
                        } else {
                            if (in_arr(h, ["crafting"])) {
                                b = 0;
                                j = 0;
                                d = "/images/tiles/characters/npc5.png"
                            } else {
                                if (in_arr(h, ["ornaments", "ornament_success"])) {
                                    b = 1;
                                    j = 0;
                                    d = "/images/tiles/characters/chara8.png"
                                } else {
                                    if (in_arr(h, ["jailer", "guard", "blocker", "test"])) {
                                        b = 3;
                                        j = 0;
                                        d = "/images/tiles/characters/chara5.png"
                                    } else {
                                        if (in_arr(h, ["seashells", "seashell_success"])) {
                                            b = 0;
                                            j = 1;
                                            d = "/images/tiles/characters/npc1.png"
                                        } else {
                                            if (in_arr(h, ["lottery"])) {
                                                b = 3;
                                                j = 0;
                                                d = "/images/tiles/characters/npc6.png"
                                            } else {
                                                if (in_arr(h, ["newupgrade"])) {
                                                    b = 3;
                                                    j = 1;
                                                    d = "/images/tiles/characters/chara8.png"
                                                } else {
                                                    if (h == "tavern") {
                                                        b = 0;
                                                        j = 1;
                                                        d = "/images/tiles/characters/custom1.png"
                                                    } else {
                                                        if (h == "standmerchant") {
                                                            b = 3;
                                                            j = 0;
                                                            d = "/images/tiles/characters/npc5.png"
                                                        } else {
                                                            if (h == "subscribe") {
                                                                b = 3;
                                                                j = 1;
                                                                d = "/images/tiles/characters/chara7.png"
                                                            } else {
                                                                if (in_arr(h, ["gemfragments", "gemfragment_success"])) {
                                                                    b = 2;
                                                                    j = 1;
                                                                    d = "/images/tiles/characters/npc1.png"
                                                                } else {
                                                                    if (in_arr(h, ["buyshells", "noshells", "yesshells"])) {
                                                                        b = 0;
                                                                        j = 1;
                                                                        d = "/images/tiles/characters/dwarf2.png"
                                                                    } else {
                                                                        if (in_arr(h, ["unlock_items2", "unlock_items3", "unlock_items4", "unlock_items5", "unlock_items6", "unlock_items7"])) {
                                                                            b = 3;
                                                                            j = 1;
                                                                            d = "/images/tiles/characters/npc4.png";
                                                                            if (h == "unlock_items2") {
                                                                                j = 1,
                                                                                    b = 0
                                                                            }
                                                                            if (h == "unlock_items3") {
                                                                                j = 1,
                                                                                    b = 0
                                                                            }
                                                                            if (h == "unlock_items4") {
                                                                                j = 1,
                                                                                    b = 2
                                                                            }
                                                                            if (h == "unlock_items5") {
                                                                                j = 1,
                                                                                    b = 2
                                                                            }
                                                                            if (h == "unlock_items6") {
                                                                                j = 0,
                                                                                    b = 1
                                                                            }
                                                                            if (h == "unlock_items7") {
                                                                                j = 0,
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
            }
        }
    }
    if (c == "normal") {
        g += "<div style='float: left; margin-top: -20px; width: 104px; height: 92px; overflow: hidden'><img style='margin-left: -" + (104 * (b * 3 + 1)) + "px; margin-top: -" + (144 * (j * 4)) + "px; width: 1248px; height: 1152px;' src='" + d + "'/></div>"
    } else {
        g += "<div style='float: left; margin-top: -20px; width: 104px; height: 98px; overflow: hidden'><img style='margin-left: -" + (188 * b + 40) + "px; margin-top: -" + (200 * j + 50) + "px; width: 2256px; height: 1600px;' src='" + d + "'/></div>"
    }
    if (h.auto) {
        g += h.message;
        if (h.button) {
            interaction_onclick = h.onclick,
                g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='interaction_onclick()'>" + h.button + "</div></span>"
        }
        if (h.button2) {
            interaction_onclick2 = h.onclick2,
                g += "<span style='float: right; margin-top: 5px; margin-right: 5px'><div class='slimbutton' onclick='interaction_onclick2()'>" + h.button2 + "</div></span>"
        }
    } else {
        if (h == "seashells") {
            g += "Ah, I love the sea, so calming. As a kid, I loved spending time on the beach. Collecting seashells. If you happen to find some, I would love to add them to my collection.";
            g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"seashell\")'>I HAVE 20!</div></span>"
        } else {
            if (h == "buyshells") {
                g += "Yo dawg, I can hook you up with some shells If you want. I get these directly from Wizard in bulk so they are legit.";
                g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_shells_buyer()'>HMM, SURE...</div></span>"
            } else {
                if (h == "noshells") {
                    g += "Ugh, maybe go farm more gold. It's not like they grow on trees. Just kill some puny monsters, you'll have plenty!"
                } else {
                    if (h == "yesshells") {
                        g += "Please doing business with you! You'll have your shells in a couple of milliseconds!"
                    } else {
                        if (h == "hardcoretp") {
                            g += "Aww, are you stuck here? I can take you places. If you want!";
                            g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_teleporter()'>TELEPORT</div></span>"
                        } else {
                            if (h == "seashell_success") {
                                if (Math.random() < 0.001) {
                                    g += "Awww. Ty. Ty. Ty. Xoxo."
                                } else {
                                    g += "How kind of you! Please accept this small gift in return."
                                }
                                d_text("+1", get_npc("fisherman"), {
                                    color: "#DFE9D9"
                                })
                            } else {
                                if (h == "subscribe") {
                                    g += "It's that time of the day! Are you in?!";
                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"signup\")'>SIGN ME UP!</div></span>"
                                } else {
                                    if (h == "tavern") {
                                        g += "Tavern. A place for adventurers to relax, drink, unwind, play games, wager, challenge each other in friendly games. Currently under construction."
                                    } else {
                                        if (h == "test") {
                                            g += "Greetings! Looking for a good deal on weapons and armor? Then you came to the right place! No one sells better gear than me!"
                                        } else {
                                            if (h == "newupgrade") {
                                                g += "Adventurer! I can upgrade your weapons or armors. Combine 3 accessories to make a stronger one! Tho, beware, the process isn't perfect. Sometimes the items are ... lost.";
                                                g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_upgrade_shrine()'>UPGRADE</div> <div class='slimbutton' onclick='render_compound_shrine()'>COMBINE</div></span>"
                                            } else {
                                                if (h == "locksmith") {
                                                    g += "Lock - Prevents anything that can destroy an item, selling, upgrading, you name it! Seal - Locks the item in a way that unlocking it takes a week. Unlock - Frees it. Got it? Good. Cost? 250 big ones.";
                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_locksmith(\"lock\")'>LOCK</div> <div class='slimbutton' onclick='render_locksmith(\"seal\")'>SEAL</div> <div class='slimbutton' onclick='render_locksmith(\"unlock\")'>UNLOCK</div></span>"
                                                } else {
                                                    if (h == "crafting") {
                                                        g += "I can craft or dismantle items for you. Price differs from item to item. Check out my recipes if you are interested!";
                                                        g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_recipes()'>RECIPES</div> <div class='slimbutton' onclick='render_craftsman()'>CRAFT</div> <div class='slimbutton' onclick='render_dismantler()'>DISMANTLE</div></span>"
                                                    } else {
                                                        if (h == "wizard") {
                                                            g += "Well, Hello there! I'm Wizard, I made this game. Hope you enjoy it. If you have any issues, suggestions, feel free to email me at hello@adventure.land!"
                                                        } else {
                                                            if (h == "santa") {
                                                                g += "Happy holidays! Please excuse my companion, he is a bit grumpy. If you happen to find any candy canes, that might cheer him up!";
                                                                g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"candycane\")'>I HAVE ONE!</div></span>"
                                                            } else {
                                                                if (h == "standmerchant") {
                                                                    g += "Anyone can become a merchant and start trading. You only need a merchant stand to display your items on!";
                                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_merchant(get_npc(\"standmerchant\"))'>LET ME BUY ONE!</div></span>"
                                                                } else {
                                                                    if (h == "candycane_success") {
                                                                        g += "Ah! Thanks for cheering him up. Here's something for you in return!"
                                                                    } else {
                                                                        if (h == "lostearring") {
                                                                            g += "Ewww. Ewww. Ewww. These wretched things ate my earrings. Kill them, kill them all. Bring my earrings back!";
                                                                            g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"lostearring\")'>AS YOU WISH</div></span>"
                                                                        } else {
                                                                            if (h == "lostearring_success") {
                                                                                g += "You did well. Here's something left from one of my old husbands..."
                                                                            } else {
                                                                                if (h == "mistletoe") {
                                                                                    g += "You know, It gets boring in here sometimes ... I'm looking for some excitement. Uhm, Do you have a Mistletoe?";
                                                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"mistletoe\")'>OH MY, I DO!</div></span>"
                                                                                } else {
                                                                                    if (h == "mistletoe_success") {
                                                                                        g += "Haha! You thought I was going to give you a kiss?! You wish... Take this instead!"
                                                                                    } else {
                                                                                        if (h == "ornaments") {
                                                                                            g += "Hmm. We should decorate these trees. I need some Ornaments tho. If you happen to collect " + G.items.ornament.e + " of them, let me know!";
                                                                                            g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"ornament\")'>YOU GOT IT!</div></span>"
                                                                                        } else {
                                                                                            if (h == "ornament_success") {
                                                                                                g += "Thank you! Here's something in return."
                                                                                            } else {
                                                                                                if (h == "gemfragment_success") {
                                                                                                    g += "Bwahahahahah *cough* Ehem.. Thanks! You got a good deal. Keep bringing these fragments to me, don't give them to anyone else.";
                                                                                                    d_text("+1", get_npc("gemmerchant"), {
                                                                                                        color: "#E78295"
                                                                                                    })
                                                                                                } else {
                                                                                                    if (h == "gemfragments") {
                                                                                                        g += "Back in the day we had miners, then came the moles, they work for free yet retrieving the gems is a challenge. Bring me " + G.items.gemfragment.e + " gem fragments and I can give you something exciting in return, no questions asked.";
                                                                                                        g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"gemfragment\")'>I GOT " + G.items.gemfragment.e + "!</div></span>"
                                                                                                    } else {
                                                                                                        if (h == "leathers") {
                                                                                                            g += "Hey, hey, hey! What brings you to this cold land? I personally love it here, ideal for my work. If you can bring me " + G.items.leather.e + " Leathers, I can give you one of my products in return.";
                                                                                                            g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='render_exchange_shrine(\"leather\")'>I HAVE " + G.items.leather.e + "!</div></span>"
                                                                                                        } else {
                                                                                                            if (h == "leather_success") {
                                                                                                                g += "Here you go! Enjoy! Keep bringing leathers to me, I have a lot to offer!";
                                                                                                                d_text("+1", get_npc("leathermerchant"), {
                                                                                                                    color: "#DFE9D9"
                                                                                                                })
                                                                                                            } else {
                                                                                                                if (h == "jailer") {
                                                                                                                    g += "Tu-tu-tu. Have you been a bad " + (Math.random() < 0.5 && "boy" || "girl") + "? No worries. The lawmakers must see the potential in you, so instead of getting rid of you, they sent you here. You are free to leave whenever you want. But please don't repeat your mistake.";
                                                                                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"leave\")'>LEAVE</div></span>"
                                                                                                                } else {
                                                                                                                    if (h == "blocker" || h == "guard") {
                                                                                                                        var a = Math.random();
                                                                                                                        if (a < 0.5) {
                                                                                                                            g += "Hmm. hmm. hmm. Can't let you pass. Check again later tho!"
                                                                                                                        } else {
                                                                                                                            g += "There's some work going on inside. Maybe check back later!"
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        if (h == "lottery") {
                                                                                                                            g += "Hi Dear! The lottery tickets for this week haven't arrived yet. Apologies :)"
                                                                                                                        } else {
                                                                                                                            if (in_arr(h, ["unlock_items2", "unlock_items3", "unlock_items4", "unlock_items5", "unlock_items6", "unlock_items7"])) {
                                                                                                                                var l = "items2"
                                                                                                                                    ,
                                                                                                                                    e = 75000000
                                                                                                                                    ,
                                                                                                                                    k = 600;
                                                                                                                                if (h == "unlock_items3") {
                                                                                                                                    l = "items3"
                                                                                                                                }
                                                                                                                                if (h == "unlock_items4") {
                                                                                                                                    l = "items4",
                                                                                                                                        e = 100000000,
                                                                                                                                        k = 800
                                                                                                                                }
                                                                                                                                if (h == "unlock_items5") {
                                                                                                                                    l = "items5",
                                                                                                                                        e = 100000000,
                                                                                                                                        k = 800
                                                                                                                                }
                                                                                                                                if (h == "unlock_items6") {
                                                                                                                                    l = "items6",
                                                                                                                                        e = 112500000,
                                                                                                                                        k = 900
                                                                                                                                }
                                                                                                                                if (h == "unlock_items7") {
                                                                                                                                    l = "items7",
                                                                                                                                        e = 112500000,
                                                                                                                                        k = 900
                                                                                                                                }
                                                                                                                                if (is_electron) {
                                                                                                                                    g += "Hello! You don't seem to have an account open with me. Would you like to open one? It costs " + to_pretty_num(e) + " Gold. We hold onto your items forever.";
                                                                                                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"bank\",{operation:\"unlock\",gold:1,pack:\"" + l + "\"})' style='margin-right: 5px;'>PAY " + to_pretty_num(e) + " GOLD</div></span>"
                                                                                                                                } else {
                                                                                                                                    g += "Hello! You don't seem to have an account open with me. Would you like to open one? It costs " + to_pretty_num(e) + " Gold or " + to_pretty_num(k) + " Shells. We hold onto your items forever.";
                                                                                                                                    g += "<span style='float: right; margin-top: 5px'><div class='slimbutton' onclick='socket.emit(\"bank\",{operation:\"unlock\",gold:1,pack:\"" + l + "\"})' style='margin-right: 5px;'>USE GOLD</div><div class='slimbutton' onclick='socket.emit(\"bank\",{operation:\"unlock\",shells:1,pack:\"" + l + "\"})'>USE SHELLS</div></span>"
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
    g += "</div>";
    if (f == "return_html") {
        return g
    }
    $("#topleftcornerui").html(g)
}

function load_nearby(g) {
    friends_inside = "nearby";
    var c = ""
        , a = false;
    for (var f in entities) {
        var b = entities[f];
        if (!is_player(b)) {
            continue
        }
        a = true
    }
    if (a) {
        c += "<table style='margin: 5px; text-align: center'>";
        c += "<tr style='color: gray; text-decoration: underline'><th style='width: 100px'>Name</th><th style='width: 60px'>Level</th><th style='width: 100px'>Class</th><th style='width: 60px'>Age</th><th style='width: 100px'>Status</th><th style='width: 120px'>Actions</th></tr>";
        for (var f in entities) {
            var b = entities[f]
                , d = "AFK"
                , e = "";
            if (!is_player(b)) {
                continue
            }
            if (!b.afk) {
                d = "<span style='color: #34bf15'>ACTIVE</span>"
            } else {
                if (b.afk == "code") {
                    d = "<span style='color: gray'>CODE</span>"
                } else {
                    if (b.afk == "bot") {
                        d = "<span style='color: gray'>BOT</span>"
                    }
                }
            }
            if (b.owner && in_arr(b.owner, friends)) {
                e += " <span style='color: #EC82C4'>FRIENDS!</span>"
            } else {
                e += " <span style='color: #2799DD' class='clickable' onclick='socket.emit(\"friend\",{event:\"request\",name:\"" + b.name + "\"})'>+FRIEND</span>"
            }
            if (!e) {
                e = "None"
            }
            c += "<tr><td class='clickable' onclick='target_player(\"" + b.name + "\")'>" + b.name + "</td><td>" + b.level + "</td><td>" + b.ctype.toUpperCase() + "</td><td>" + b.age + "</td><td>" + d + "</td><td>" + e + "</td></tr>"
        }
        c += "</table>"
    } else {
        if (g) {
            return load_server_list()
        }
        c = "<div style='margin-top: 8px'>There is no one nearby.</div>"
    }
    $(".friendslist").html(c);
    $(".friendslist").parent().find(".active2").removeClass("active2");
    $(".fnearby").addClass("active2")
}

function load_friends(b) {
    if (b) {
        if (friends_inside != "friends") {
            return
        }
        var a = "";
        if (!b.chars.length && !friends.length) {
            a = "<div style='margin-top: 8px'>You don't have any friends but it's ok. Hang in there! Be kind to other players, get to know them, then friend them from the 'Nearby' tab. Afterwards, you can see when they are online and where they are.</div>"
        } else {
            if (!b.chars.length) {
                a = "<div style='margin-top: 8px'>No one online.</div>"
            } else {
                a += "<table style='margin: 5px; text-align: center'>";
                a += "<tr style='color: gray; text-decoration: underline'><th style='width: 100px'>Name</th><th style='width: 60px'>Level</th><th style='width: 100px'>Class</th><th style='width: 100px'>Status</th><th style='width: 120px'>Server</th></tr>";
                b.chars.forEach(function (c) {
                    var d = "AFK";
                    if (!c.afk) {
                        d = "<span style='color: #34bf15'>Active</span>"
                    }
                    a += "<tr><td>" + c.name + "</td><td>" + c.level + "</td><td>" + c.type.toUpperCase() + "</td><td>" + d + "</td><td>" + c.server + "</td></tr>"
                });
                a += "</table>"
            }
        }
        $(".friendslist").html(a)
    } else {
        friends_inside = "friends";
        api_call("pull_friends");
        $(".friendslist").html("");
        $(".friendslist").parent().find(".active2").removeClass("active2");
        $(".ffriends").addClass("active2")
    }
}

function load_server_list(b) {
    if (b) {
        if (friends_inside != "server") {
            return
        }
        var a = "";
        if (!b.length) {
            a = "<div style='margin-top: 8px'>No one discoverable.</div>"
        } else {
            a += "<table style='margin: 5px; text-align: center'>";
            a += "<tr style='color: gray; text-decoration: underline'><th style='width: 100px'>Name</th><th style='width: 60px'>Level</th><th style='width: 100px'>Class</th><th style='width: 60px'>Age</th><th style='width: 100px'>Status</th><th style='width: 120px'>Party</th>";
            if (is_pvp) {
                a += "<th style='width: 120px'>Kills</th>"
            }
            a += "</tr>";
            b.forEach(function (e) {
                var f = "AFK"
                    , c = e.party
                    , d = e.name;
                if (!e.afk) {
                    f = "<span style='color: #34bf15'>ACTIVE</span>"
                } else {
                    if (e.afk == "code") {
                        f = "<span style='color: gray'>CODE</span>"
                    } else {
                        if (e.afk == "bot") {
                            f = "<span style='color: gray'>BOT</span>"
                        }
                    }
                }
                if (!e.party && e.name != character.name && e.name != "Hidden") {
                    c = "<span style='color: #34BCAF' class='clickable' onclick='parent.socket.emit(\"party\",{event:\"invite\",name:\"" + e.name + "\"})'>Invite</span>"
                } else {
                    if (e.name == "Hidden") {
                        c = "<span style='color: #999999'>None</span>"
                    } else {
                        if (!e.party) {
                            c = "<span style='color: #999999'>You</span>"
                        } else {
                            c = "<span style='color: #9F68C0' class='clickable' onclick='parent.socket.emit(\"party\",{event:\"request\",name:\"" + e.name + "\"})'>" + e.party + "</span>"
                        }
                    }
                }
                if (e.name != character.name && e.name != "Hidden") {
                    c += " <span style='color: #A255BA' class='clickable' onclick='hide_modal(); cpm_window(\"" + e.name + "\");'>PM</span>"
                }
                if (d == "Hidden") {
                    d = "<span style='color:gray'>Hidden</span>"
                }
                a += "<tr><td>" + d + "</td><td>" + e.level + "</td><td>" + e.type.toUpperCase() + "</td><td>" + e.age + "</td><td>" + f + "</td><td>" + c + "</td>";
                if (is_pvp) {
                    a += "<td>" + to_pretty_num(e.kills) + "</td>"
                }
                a += "</tr>"
            });
            a += "</table>"
        }
        $(".friendslist").html(a)
    } else {
        friends_inside = "server";
        socket.emit("players");
        $(".friendslist").html("");
        $(".friendslist").parent().find(".active2").removeClass("active2");
        $(".fserver").addClass("active2")
    }
}

function load_character_list() {
    var a = "";
    a += "<table style='margin: 5px; text-align: center' class='cclist'>";
    a += "<tr style='color: gray; text-decoration: underline'><th style='width: 140px'>Name</th><th style='width: 70px'>Level</th><th style='width: 120px'>Class</th><th style='width: 120px'>Status</th><th style='width: 120px'>Deploy</th>";
    a += "</tr>";
    X.characters.forEach(function (e) {
        var f = "AFK"
            , c = e.party
            , d = e.name
            , b = false;
        if (e.online) {
            f = "<span style='color: #34bf15'>ONLINE</span>",
                link = "<span class='gray'>Deployed</span>"
        } else {
            f = "<span style='color: gray'>OFFLINE</span>",
                link = "<a href='/character/" + e.name + "/in/" + server_region + "/" + server_identifier + "/' target='_blank' class='cancela' style='color: #4C9BC8'>Deploy</span>"
        }
        if (e.name != character.name && e.name != "Hidden") {
            c += " <span style='color: #A255BA' class='clickable' onclick='hide_modal(); cpm_window(\"" + e.name + "\");'>PM</span>"
        }
        if (d == "Hidden") {
            d = "<span style='color:gray'>Hidden</span>"
        }
        a += "<tr><td>" + d + "</td><td>" + e.level + "</td><td>" + e.type.toUpperCase() + "</td><td>" + f + "</td>";
        a += "<td>" + link + "</td>";
        a += "</tr>"
    });
    a += "</table>";
    $(".friendslist").html(a);
    $(".friendslist").parent().find(".active2").removeClass("active2");
    $(".fcharacters").addClass("active2")
}

function load_pvp_list(b) {
    console.log(b);
    var a = "<div style='font-size: 24px; text-align: center; padding: 6px; line-height: 24px;'>"
        , c = false;
    b.forEach(function (d) {
        a += "<div>" + d[0] + " pwned " + d[1] + "</div>";
        c = true
    });
    if (!c) {
        a += "<div>Noone pwned Anyone</div>"
    }
    a += "</div>";
    show_modal(a, {
        wwidth: 400
    })
}

function load_coming_soon(a) {
    var b = "Coming Sooner!";
    $(".friendslist").parent().find(".active2").removeClass("active2");
    if (a == 1) {
        $(".fserver").addClass("active2")
    } else {
        if (a == 2) {
            $(".fguild").addClass("active2"),
                b = "Coming Soon!"
        } else {
            if (a == 3) {
                $(".fleaders").addClass("active2"),
                    b = "Planned, along with achievements, character statistics, weekly, monthly leaderboards"
            } else {
                if (a == 4) {
                    $(".fmail").addClass("active2"),
                        b = "Coming Soon!"
                }
            }
        }
    }
    $(".friendslist").html("<div style='margin-top: 8px'>" + b + "</div>")
}

var friends_inside = "nearby";

function render_friends() {
    var a = "";
    var b = 0;
    api_call("servers_and_characters");
    X.characters.forEach(function (d) {
        if (d.online) {
            b += 1
        }
    });
    a += "<div style='text-align: center'>";
    a += "<div class='gamebutton ffriends' onclick='load_friends()'>Friends</div> <div class='gamebutton fnearby' onclick='load_nearby()'>Nearby</div>";
    if (!is_pvp || 1) {
        a += " <div class='gamebutton fserver' onclick='load_server_list();'>Server</div>"
    }
    a += " <div class='gamebutton fcharacters' onclick='load_character_list();'>Characters [<span class='ccount'>" + b + "</span>/4]</div>";
    a += "<div class='friendslist mt5' style='height: 400px; border: 5px solid gray; font-size: 24px; overflow: scroll; padding: 6px'></div>";
    a += "<div style='font-size: 16px; margin-top: 5px; color: gray; text-align: center'>NOTE: The Communicator is an evolving protoype with missing features</div>";
    a += "</div>";
    show_modal(a, {});
    load_nearby(1)
}

var IID = null;

function precompute_image_positions() {
    if (IID) {
        return
    }
    IID = {};
    for (var b in G.sprites) {
        var f = G.sprites[b];
        if (f.skip) {
            continue
        }
        var d = 4
            , a = 3
            , h = "full";
        if (in_arr(f.type, ["animation"])) {
            d = 1,
                h = f.type
        }
        if (in_arr(f.type, ["v_animation", "head", "hair", "hat", "s_wings"])) {
            a = 1,
                h = f.type
        }
        if (in_arr(f.type, ["wings", "body"])) {
            h = f.type
        }
        if (in_arr(f.type, ["emblem", "gravestone"])) {
            d = 1,
                a = 1,
                h = f.type
        }
        var k = f.matrix;
        var c = G.images[f.file.split("?")[0]] && G.images[f.file.split("?")[0]].width || f.width || window.C && C[f.file] && C[f.file].width || 312;
        var l = G.images[f.file.split("?")[0]] && G.images[f.file.split("?")[0]].height || f.height || window.C && C[f.file] && C[f.file].height || 288;
        for (var g = 0; g < k.length; g++) {
            for (var e = 0; e < k[g].length; e++) {
                var b = k[g][e];
                if (!b) {
                    continue
                }
                IID[b] = [c, l, e * c / f.columns, g * l / f.rows, c / (f.columns * a), l / (f.rows * d), a, f.file, h];
                if (G.dimensions[b]) {
                    IID[b][2] = IID[b][2] + (G.dimensions[b][2] || 0)
                }
            }
        }
    }
    if (0) {
        for (var b in IID) {
            for (var e = 0; e < IID[b].length - 1; e++) {
                IID[b][e] *= 1.5
            }
        }
    }
}

function sprite_image(b, h) {
    try {
        precompute_image_positions();
        if (!h) {
            h = {}
        }
        if (!IID[b]) {
            b = "naked"
        }
        var d = h.scale || 1
            , f = "";
        var c = IID[b][4]
            , a = 0
            , j = 0;
        var k = IID[b][5];
        if (h.cwidth) {
            j = (h.cwidth - c * d) / 2
        }
        if (IID[b][6] == 1) {
            a = c
        }
        if (h.opacity && h.opacity != 1) {
            f += "opacity: " + h.opacity + ";"
        }
        return "<div style='display: inline-block; width: " + (c * d) + "px; height: " + (k * d) + "px; overflow: hidden; position: absolute; left: " + j + "px; bottom: " + ((h.p || 0) * d) + "px; " + f + "'>			<img style='			margin-left: " + ((-IID[b][2] - IID[b][4] + a - Math.ceil((IID[b][4] - c) / 2)) * d) + "px; 			margin-top: " + ((-IID[b][3] - IID[b][5] + k) * d) + "px; 			width: " + (IID[b][0] * d) + "px; 			height: " + (IID[b][1] * d) + "px;' 		src='" + IID[b][7] + "'/></div>"
    } catch (g) {
        console.log(g)
    }
    return ""
}

function sprite(a, k) {
    try {
        if (!k) {
            k = {}
        }
        if (is_string(k)) {
            k = {
                cx: k
            }
        }
        if (is_string(k.cx)) {
            k.cx = k.cx.split(",")
        }
        if (!k.width) {
            k.width = 40
        }
        if (!k.height) {
            k.height = 50
        }
        if (!k.scale) {
            k.scale = 1.5
        }
        precompute_image_positions();
        var d = "<div style='height: " + k.height + "px; width: " + k.width + "px; position: relative; text-align: center; overflow:hidden; display: inline-block'>";
        var l = null
            , m = G.cosmetics.default_head_place;
        var f = null
            , h = G.cosmetics.default_hair_place;
        var n = null
            , b = G.cosmetics.default_hat_place;
        var c = (k.rip === true && "gravestone" || k.rip)
            , g = 1;
        if (k.rip) {
            g = 0.4
        }
        d += sprite_image(a, {
            cwidth: k.width,
            scale: k.scale,
            opacity: g
        });
        (k.cx || []).forEach(function (e) {
            if (!e.length || !IID[e]) {
                return
            }
            if (IID[e][8] == "head") {
                l = e,
                    m += G.cosmetics[e + "_place"] || 0
            }
            if (IID[e][8] == "hair") {
                f = e,
                    h += G.cosmetics[e + "_place"] || 0
            }
            if (IID[e][8] == "hat") {
                n = e,
                    b += G.cosmetics[e + "_place"] || 0
            }
        });
        if (l) {
            d += sprite_image(l, {
                p: m,
                cwidth: k.width,
                scale: k.scale,
                opacity: g
            })
        }
        if (f) {
            d += sprite_image(f, {
                p: h,
                cwidth: k.width,
                scale: k.scale,
                opacity: g
            })
        }
        if (n) {
            d += sprite_image(n, {
                p: b,
                cwidth: k.width,
                scale: k.scale,
                opacity: g
            })
        }
        if (c) {
            d += sprite_image(c, {
                cwidth: k.width,
                scale: k.scale
            })
        }
        d += "</div>";
        return d
    } catch (j) {
        console.log(j)
    }
    return ""
}

function load_class_info(a, c) {
    if (!a) {
        a = window.chartype
    }
    if (!c) {
        c = "male"
    }
    var b = "";
    if (window.gendertype) {
        c = gendertype
    }
    if (a == "warrior") {
        if (c == "male") {
            b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 1) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
        } else {
            b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara7.png'/></div>"
        }
        b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Warrior</span></div>";
        b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors.str + "'>Strength</span></div>";
        b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Warriors are strong melee characters. Ideal for both PVE and PVP. Can't go wrong with a warrior.</span></div>"
    } else {
        if (a == "mage") {
            if (c == "female") {
                b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='width: 624px; height: 576px; margin-left: -" + (52 * 7) + "px' src='/images/tiles/characters/chara7.png'/></div>"
            } else {
                b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
            }
            b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Mage</span></div>";
            b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors["int"] + "'>Intelligence</span></div>";
            b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Mage's are the ideal characters for beginners. They are easy and fun to play. Both PVE and PVP.</span></div>"
        } else {
            if (a == "priest") {
                if (c == "male") {
                    b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara5.png'/></div>"
                } else {
                    b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
                }
                b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Priest</span></div>";
                b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors["int"] + "'>Intelligence</span></div>";
                b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Priest's are the healers of the realm. They are not ideal for beginners or solo players. They can't inflict a lot of damage. However, thanks to their Curse ability, they might even bring down a strong warrior in PVP. Every serious party needs at least one priest.</span></div>"
            } else {
                if (a == "rogue") {
                    if (c == "male") {
                        b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara6.png'/></div>"
                    } else {
                        b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-top: -" + (72 * 4) + "px; margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara3.png'/></div>"
                    }
                    b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Rogue</span></div>";
                    b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors.dex + "'>Dexterity</span></div>";
                    b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Rogue's are the ideal assassins. Their invis ability makes them super-fun for PVP. They are fast. Not ideal for beginners.</span></div>"
                } else {
                    if (a == "ranger") {
                        if (c == "male") {
                            b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/custom1.png'/></div>"
                        } else {
                            b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/chara3.png'/></div>"
                        }
                        b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Ranger</span></div>";
                        b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: " + colors.dex + "'>Dexterity</span></div>";
                        b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>Rangers are for the most advanced players. They are mainly archers. Early on they are very weak and hard to play. But a strong ranger can probably rule all other classes. +Work in progress!</span></div>"
                    } else {
                        if (a == "merchant") {
                            if (c == "male") {
                                b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 7) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/npc5.png'/></div>"
                            } else {
                                b += "<div style='float: left; margin-right: 10px; margin-top: -10px; width: 52px; height: 72px; overflow: hidden'><img style='margin-left: -" + (52 * 4) + "px; width: 624px; height: 576px;' src='/images/tiles/characters/npc6.png'/></div>"
                            }
                            b += "<div><span style='color: white'>Class:</span> <span style='color: " + colors[c] + "'>Merchant</span></div>";
                            b += "<div><span style='color: white'>Primary Attribute:</span> <span style='color: #804000'>None</span></div>";
                            b += "<div><span style='color: white'>Description:</span> <span style='color: gray'>While your main characters are out there adventuring, merchants can wait in town and market your loots. Server and character limits don't apply to merchants. They gain experience when they sell or buy something.</span></div>"
                        } else {
                            return
                        }
                    }
                }
            }
        }
    }
    $("#features").css("height", 208).html(b)
}
;