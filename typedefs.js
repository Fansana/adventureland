/**
 * Created by nexus on 24/03/17.
 */

/**
 * @typedef {Object} ChannelingConditions
 * @property {boolean} town          - Using the town teleportation skill
 */

/**
 * @typedef {Object} StatusConditions //TODO: describe how status effect affect the character
 * @property {boolean} stunned       -
 * @property {boolean} cursed        -
 * @property {boolean} poisoned      -
 * @property {boolean} poisonous     -
 * @property {boolean} charging      -
 * @property {boolean} invis         - The character is invisible
 * @property {boolean} invincible    -
 * @property {boolean} mute          -
 */

/**
 * @typedef {Object} Consumables
 * @property {string} name              - Item name
 * @property {number} q                 - quantity: how many items are on this stack.
 */

/**
 * @typedef {Object} Gear
 * @property {string} name              - Item name
 * @property {number} level             - level of item
 * @property {string} [CharacterStats]  - either dexterity, intelligence, vitality, strength.
 */

/**
 * @typedef {Object} CharacterStats
 * @property {number}  dex  - Dexterity: Increases the attack speed.
 * @property {number}  int  - Intelligence: Increases maximum mana, also increases resistance by a factor of 1.5 for every int point.
 * @property {number}  vit  - Vitality: Increases Health points proportional to level.
 * @property {number}  str  - Strength: Increases Health points and Armor.
 */

/**
 * @typedef {Object} CharacterSlots
 * @desc The name of the character slots, they may or may not contain Gear
 * @property {Gear} ring1
 * @property {Gear} ring2
 * @property {Gear} earring1
 * @property {Gear} earring2
 * @property {Gear} belt
 * @property {Gear} offhand
 * @property {Gear} chest
 * @property {Gear} pants
 * @property {Gear} shoes
 * @property {Gear} gloves
 * @property {Gear} amulet
 * @property {Gear} orb
 * @property {Gear} elixir
 * @property {Gear} cape
 * @property {Gear} mainhand
 * @property {Gear} helmet
 */

/**
 * @typedef {Object} Map
 * @property {string} name  - A Human readable name
 * @property {number} on_death
 * @property {Array.<Object>} monsters
 * @property {Object} compound
 * @property {Object} data
 * @property {Array.<Array>} doors
 * @property {number} drop_norm
 * @property {Object} exchange
 * @property {Object} items
 * @property {string} key
 * @property {Array.<Object>} merchants
 * @property {Array.<Object>} monsters
 * @property {Array.<Object>} npcs
 * @property {Array.<Array>} quirks
 * @property {Object} ref
 * @property {Array.<number>} u_mid
 * @property {Array.<number>} c_mid
 * @property {Array.<Array>} spawns
 * @property {Object} transporter
 * @property {Object} upgrade
 */

/**
 * @class Character
 * @extends PIXI.Sprite
 * @description The character is the entity that you are controlling. You can move him around with move(x,y) and order him to attack a monster or a player with attack(target)
 *
 * @property {number}  hp                - health points
 * @property {number}  max_hp            - maximum health points
 * @property {number}  mp                - mana points
 * @property {number}  max_hp            - maximum mana points
 * @property {number}  xp                - current experience points
 * @property {number}  max_xp            - total experience points needed for next level
 * @property {string}  name              - entity name (for monsters it is null)
 * @property {number}  angle             - angle the character is looking at.
 * @property {number}  real_x            - x position on map
 * @property {number}  real_y            - y position on map
 * @property {number|undefined}  from_x  - the last movement starting x position of the character
 * @property {number|undefined}  from_y  - the last movement starting y position of the character
 * @property {number|undefined}  going_x - the last target x position of the character
 * @property {number|undefined}  going_y - the last target y position of the character
 * @property {number}  level             - character level
 * @property {string}  owner             - character owner //TODO need clarification
 * @property {number}  mp_cost           - mana cost for basic attack
 * @property {number}  range             - range for basic attack
 * @property {number}  resistance        - the character damage resistance
 * @property {number}  attack            - roughly estimated amount of damage
 * @property {boolean} afk               - is the character afk
 * @property {Array}   items             -
 * @property {number}  gold              - the amount of gold the character carrying
 * @property {boolean} moving            - is character moving
 * @property {boolean} afk               - player is afk
 * @property {boolean} rip               - is the character dead
 * @property {number|undefined} code     - the code id the character is running (0 or undefined means he isn't running code)
 * @property {string}  target            - EntityId
 * @property {string}  type              - the type of the Entity
 * @property {string}  ctype             - class of the character
 * @property {number}  frequency         - frequency in which the character attacks. A frequency of 1 means every second where as 0.5 means every 2 seconds.
 * @property {number}  speed             - walking speed
 * @property {number}  armor             - character armor
 * @property {string}  id                - character Name
 * @property {string}  in                - current map name
 * @property {number}  cid               -
 * @property {CharacterStats} stats      - dex,int,vit,str
 * @property {number}  goldm             - Gold modifier
 * @property {number}  luckm             - Luck modifier
 * @property {number}  xpm               - Experience modifier
 * @property {string}  map               - current map name
 * @property {number}  cash              - number of shells
 * @property {number}  targets           - How many Entities are targeting this character
 * @property {string}  ipass             - Authentication token from game server (keep this secret)
 * @property {Array.<string>}  friends   - List of Player Ids which whom the player is friends with
 * @property {number} direction          - Direction in which the character is looking (0:down,1:left,2:right;3:up)
 * @property {Array.<Consumables|Gear|undefined>} items   - Either a Consumable e.g. a potion or a type of Gear. If the slot is empty the
 * @property {CharacterSlots} slots      - Contains all the items that the character is wearing
 * @property {string} skin               - Character skin
 * @property {string} guild              - Character guild (Currently unimplemented)
 * @property {number} isize              - Inventory size
 * @property {number} esize              - Empty Inventory slots
 * @property {boolean} me                - Is this character me
 * @property {ChannelingConditions} c    - Channelling conditions
 * @property {StatusConditions} s        - Status conditions
 */

/**
 * @class Monster
 * @extends PIXI.Sprite
 * @description All Monsters have these properties
 * @property {number}  hp                - health points
 * @property {number}  max_hp            - maximum health points
 * @property {number}  xp                - Experience awarded for killing this monster
 * @property {string}  name              - entity name (for monsters it is null)
 * @property {number}  angle             - angle the character is looking at.
 * @property {number} direction          - direction in which the character is looking (0:down,1:left,2:right;3:up)
 * @property {number}  real_x            - x position on map
 * @property {number}  real_y            - y position on map
 * @property {string}  id                - the Monster id, All Monsters in entities are listed by there id.
 * @property {string}  in                - the Map name on which map the monster is
 * @property {number|undefined}  from_x  - the last movement starting x position of the character
 * @property {number|undefined}  from_y  - the last movement starting y position of the character
 * @property {number|undefined}  going_x - the last target x position of the character
 * @property {number|undefined}  going_y - the last target y position of the character
 * @property {boolean} dead              - is the monster dead
 * @property {Date} died                 - when did the Monster die
 * @property {number} attack             - the Average attack damage the monster does
 * @property {number} speed              - the Normal walking speed of the monster. After aggroing
 * @property {string} type               - the type of the Entity, for monsters this is always "monster"
 * @property {ChannelingConditions} c    - channelling conditions
 * @property {StatusConditions} s        - status conditions
 *
 */

/**
 * @class Player
 * @extends PIXI.Sprite
 * @description All players have these properties
 * @property {number}  hp                - health points
 * @property {number}  max_hp            - maximum health points
 * @property {number}  mp                - mana points
 * @property {number}  max_mp            - maximum mana points
 * @property {number}  xp                - current experience points
 * @property {string}  name              - player Name
 * @property {number}  angle             - angle the player is looking at.
 * @property {number}  real_x            - x position on map
 * @property {number}  real_y            - y position on map
 * @property {number|undefined}  from_x  - the last movement starting x position of the player
 * @property {number|undefined}  from_y  - the last movement starting y position of the player
 * @property {number|undefined}  going_x - the last target x position of the player
 * @property {number|undefined}  going_y - the last target y position of the player
 * @property {string}  type              - the type of the Entity, for a player this is always "character"
 * @property {number}  level             - player level
 * @property {string}  owner             - a number that identifies the account that the player belongs to.
 * @property {number}  range             - range for basic attack
 * @property {number}  resistance        - damage resistance
 * @property {number}  armor             - character armor
 * @property {number}  attack            - roughly estimated amount of damage
 * @property {boolean} afk               - is the player afk
 * @property {boolean} moving            - is player moving
 * @property {boolean} afk               - player is afk
 * @property {boolean} rip               - is the player dead
 * @property {number|undefined} code     - the code id the player is running (0 or undefined means he isn't running code)
 * @property {string}  target            - EntityId
 * @property {string}  ctype             - In what class is the play e.g. "mage"
 * @property {string}  skin              - Character skin
 * @property {number}  frequency         - frequency in which the character attacks. A frequency of 1 means every second where as 0.5 means every 2 seconds.
 * @property {number}  speed             - walking speed
 * @property {string}  id                - player name
 * @property {string}  in                - On which map the player is
 * @property {CharacterSlots} slots      - Contains all the items that the character is wearing
 * @property {number} direction          - Direction in which the character is looking (0:down,1:left,2:right;3:up)
 */

/**
 * @typedef {Object} ItemStats
 * @description Every item may or may not contain any number or combination of these attributes. It is probably a good idea to check if they exist first.
 * @property {number} apiercing
 * @property {number} armor - Reduces the incoming physical damage by 1% for every 10 armor points.
 * @property {number} attack
 * @property {number} attr0
 * @property {number} attr1
 * @property {number} crit       - Chance to crit and do double damage
 * @property {number} dreturn
 * @property {number} evasion    - Chance to evade the attack and negate all damage
 * @property {number} gold
 * @property {number} hp
 * @property {number} level      - The item level
 * @property {number} lifesteal
 * @property {number} mp
 * @property {number} range
 * @property {number} reflection
 * @property {number} resistance - Reduces the incoming magical damage by 1% for every 10 resistance points.
 * @property {number} rpiercing
 * @property {number} speed      - Adds the the character speed, 1 point equals one additional pixel walked per second.
 * @property {number} stat       - Can be converted to dex, int, str or vit with the corresponding scrolls
 * @property {number} dex        - Dexterity: Increases the attack speed.
 * @property {number} int        - Intelligence: Increases maximum mana, also increases resistance by a factor of 1.5 for every int point.
 * @property {number} vit        - Vitality: Increases Health points proportional to level.
 * @property {number} str        - Strength: Increases Health points and Armor.
 */

/**
 *
 * @class PIXI.Sprite
 * @desc PIXI sprite Object se documentation here {@link http://pixijs.download/release/docs/PIXI.Sprite.html}
 * @see http://pixijs.download/dev/docs/PIXI.Sprite.html
 * @property {number} alpha
 * @property {PIXI.ObservablePoint} anchor
 * @property {number} blendMode
 * @property {boolean} cacheAsBitmap
 * @property {Array.<PIXI.DisplayObject>} children
 * @property {PIXI.Rectangle} filterArea
 * @property {Array.<PIXI.Filter>} filters
 * @property {number} height
 * @property {PIXI.Matrix} localTransform
 * @property {PIXI.Graphics|PIXI.Sprite} mask
 * @property {PIXI.Container} parent
 * @property {PIXI.Point|PIXI.ObservablePoint} pivot
 * @property {string} pluginName
 * @property {PIXI.Point|PIXI.ObservablePoint} position
 * @property {boolean} renderable
 * @property {number} rotation
 * @property {PIXI.Point|PIXI.ObservablePoint} scale
 * @property {PIXI.Filter|PIXI.Shader} shader
 * @property {PIXI.ObservablePoint} skew
 * @property {PIXI.Texture} texture
 * @property {number} tint
 * @property {PIXI.TransformBase} transform
 * @property {boolean} visible
 * @property {number} width
 * @property {number} worldAlpha
 * @property {PIXI.Matrix} worldTransform
 * @property {boolean} worldVisible
 * @property {number} x
 * @property {number} y
 *
 */

