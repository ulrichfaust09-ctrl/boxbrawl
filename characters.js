/* ===================================================================
   characters.js — Box Brawlers character roster
   -------------------------------------------------------------------
   HOW TO ADD A NEW CHARACTER
   1. Copy an existing entry below (e.g. "blacksmith") and paste it
      as a new property in CHAR_DEFS, using a new unique key.
   2. Fill in stats (maxhp, speed, r, damage, fireRate, etc.) and a
      "modifiers" object for its two perk choices, following the
      pattern of nearby characters with a similar attack style
      (melee / ranged / projectile / aura, etc.).
   3. Set emoji, name, and desc (shown on the character card).
   4. If this character needs special one-off behavior that isn't
      covered by existing stat fields (like the Knight's armor hits,
      the Necromancer's skeleton protection, etc.), that logic still
      lives in index.html's battle-sim code, keyed off defKey — add
      a short "if(unit.defKey==='yourKey') ..." block there matching
      the style of similar characters. Pure stat/number characters
      need no changes anywhere else.
   5. Set "selectable:false" only for special/hidden units (bosses,
      squads) that shouldn't appear as a normal
      pick.
   =================================================================== */
(function(global){
  "use strict";

  const CHAR_DEFS = {
    blacksmith: {
      key:'blacksmith', name:'Blacksmith Guy', emoji:'🔨', maxhp:1000,
      damage:10, fireRate:1.2, meleeRange:84, nearRange:193,
      forgeInterval:0.75, forgeGain:10,
      modifiers:{
        forgery:{name:'Forgery', desc:'+5 forge bonus damage, -20% forge cooldown'},
        multitasking:{name:'Multitasking', desc:'Keeps forging while attacking'}
      },
      speed:170, r:54,
      desc:'10 dmg / 1.2s. Forges a better blade when not near a foe: +10 dmg every 0.75s.'
    },
    angry: {
      key:'angry', name:'Angry Guy', emoji:'😡', maxhp:1000,
      damage:80, fireRate:1.2, projSpeed:430, projR:10,
      rageDamageGain:2.56, rageKnockbackResist:0.02,
      modifiers:{
        pureRage:{name:'Pure Rage', desc:'Starts with 33% less HP, takes 33% less damage'},
        anglings:{name:'Anglings', desc:'100 dmg main projectile, then 4 quick 25 dmg fingers'}
      },
      speed:190, r:52,
      desc:'Fires a middle finger for 80 dmg every 1.2s. Every 1% HP lost adds ~2.56 dmg and 2% knockback resistance.',
      hooks:{
        spawnHpFraction: (modifiers)=> modifiers.pureRage ? 0.67 : 1,
        onDamagePostArmor: (ctx)=>{
          if(ctx.hasModifier(ctx.unit,'pureRage')) return ctx.dmg*0.67;
        }
      }
    },
    exploding: {
      key:'exploding', name:'Exploding Guy', emoji:'💣', maxhp:1000,
      triggerTime:10, explosionDamage:1000000,
      modifiers:{
        tickingBomb:{name:'Ticking Bomb', desc:'Bomb timer is 1.5 seconds shorter'},
        tickTock:{name:'Tick Tock', desc:'Starts the bomb immediately when the game starts'}
      },
      speed:150, r:52,
      desc:'No normal attack. First hit arms a 10s bomb; when it goes off, it detonates for 1M damage and kills both fighters.'
    },
    gwnn: {
      key:'gwnn', name:'Guy with no name', emoji:'🔫', maxhp:1000,
      bulletDamage:35, bulletCount:6, burstDuration:0.4, reloadTime:2, bulletSpeed:850, bulletR:7,
      speed:190, r:50,
      modifiers:{
        deadshot:{name:'Deadshot', desc:'Each hit keeps the enemy on GWNN\'s horizontal plane for 0.1s'},
        gunslinger:{name:'Gunslinger', desc:'+6 bullets, +0.4s burst, +2s reload'}
      },
      desc:'Fights only left and right. Fires a rapid horizontal burst, then reloads.'
    },
    necromancer: {
      key:'necromancer', name:'Necromancer Guy', emoji:'🧙', maxhp:1000,
      skeletonInterval:1, skeletonHp:50, skeletonDamage:75, skeletonFireRate:1, maxSkeletons:2,
      speed:140, r:50,
      modifiers:{
        liege:{name:'Liege', desc:'Spawns 2 skeletons per second; skeletons gain 50 HP and armor'},
        protected:{name:'Protected', desc:'50% of Necromancer damage is spread across living skeletons'}
      },
      desc:'Summons skeletons from the edge of the map every second.'
    },
    skeleton: {
      key:'skeleton', name:'Skeleton', emoji:'💀', maxhp:50,
      damage:75, fireRate:1, meleeRange:68, speed:180, r:28,
      selectable:false,
      desc:'A summoned skeleton.'
    },
    woman: {
      key:'woman', name:'Woman Guy', emoji:'💅', maxhp:1000,
      nailDamage:100, nailFireRate:0.9, nailSpeed:520, nailR:10,
      speed:175, r:50,
      modifiers:{
        selfCare:{name:'Self care', desc:'Successful nail polish hits heal 15 HP'},
        skinCare:{name:'Skin care', desc:'Stacks last 1 second longer and misses do not remove them'}
      },
      desc:'Throws nail polish. Successful hits build temporary attack-speed stacks.'
    },
    fireworks: {
      key:'fireworks', name:'Fireworks Guy', emoji:'🎆', maxhp:1000,
      fireworkDamage:150, fireworkSpeed:480, fireworkR:10, fireworkAoe:157.5,
      modifiers:{
        sparks:{name:'Sparks!', desc:'70% less firework damage, two fireworks per wall bounce, 200% more knockback'},
        july4:{name:'July 4th!', desc:'Explosions grant bonus speed, capped at 200%'}
      },
      speed:180, r:50,
      desc:'Bounces around and launches fireworks from every wall bounce.'
    },
    chef: {
      key:'chef', name:'Chef Guy', emoji:'👨‍🍳', maxhp:1000,
      knifeDamage:200, knifeFireRate:0.9, knifeSpeed:520, knifeR:9, maxKnives:2,
      modifiers:{
        cook:{name:'Cook', desc:'Successful hits heal 50 HP; collecting stuck knives heals 10 HP'},
        preciseCuts:{name:'Precise Cuts', desc:'Knives can stick to enemies for damage over time and can be collected early'}
      },
      speed:175, r:50,
      desc:'Throws up to two knives that stick to walls or enemies.'
    },
    ghost: {
      key:'ghost', name:'Ghost Guy', emoji:'👻', maxhp:1000,
      ghostDamage:15, ghostInterval:0.2, speed:180, r:48,
      modifiers:{
        fear:{name:'Fear', desc:'Every 200 damage gives Ghost and his target 15% movement speed'},
        nightmare:{name:'Nightmare', desc:'Every 100 damage adds 20 nightmare damage'}
      },
      desc:'Passes through enemies, becoming invincible and attacking from inside them.'
    },
    camera: {
      key:'camera', name:'Camera Guy', emoji:'📷', maxhp:1000,
      cameraInterval:4, flashDamage:80, recordDamage:30, speed:165, r:50,
      modifiers:{
        smile:{name:'Smile!', desc:'Recording ticks stun for 0.175s'},
        photogenic:{name:'Photogenic', desc:'After recording, summon another flash'}
      },
      desc:'Flashes a large triangle, then records a shrinking damaging triangle.'
    },
    tired: {
      key:'tired', name:'Tired Guy', emoji:'😴', maxhp:1000,
      zzzDamage:30, zzzCount:3, zzzInterval:1.4, zzzSpeed:430, speed:170, r:48,
      modifiers:{
        snoring:{name:'Snoring', desc:'+1 Zzz and +10 damage per Zzz'},
        sleepy:{name:'Sleepy', desc:'Every Zzz hit stacks Sleepy; at 10, sleep and lose speed/attack speed'}
      },
      desc:'Fires Zzz projectiles that damage and put enemies to sleep.'
    },
    barbarian: {
      key:'barbarian', name:'Barbarian Guy', emoji:'🪓', maxhp:1000,
      baseDamage:20, fireRate:1, meleeRange:135, speed:185, r:50,
      modifiers:{
        trueRage:{name:'True Rage', desc:'Rageblade rage increases damage permanently until hurt'},
        frenzy:{name:'Frenzy', desc:'Successful hits grant attack and movement speed for 3 seconds'}
      },
      desc:'Swings every second and upgrades weapons through rage thresholds.',
      hooks:{
        onDamagePreArmor: (ctx)=>{
          if(ctx.dmg>=100) ctx.unit.rageDamageBonus=0;
        }
      }
    },
    detective: {
      key:'detective', name:'Detective Guy', emoji:'🕵️', maxhp:1000,
      tapeDamage:150, tapeRange:100, speed:175, r:50,
      modifiers:{
        spy:{name:'Spy', desc:'Nearby enemies are hit by a magnifying glass for 80 damage'},
        crimeScene:{name:'Crime Scene', desc:'Damage from Detective Guy grants speed and boosts later tape walls'}
      },
      desc:'Leaves tape at walls and connects tape pairs into damaging barriers.'
    },
    blind: {
      key:'blind', name:'Blind Guy', emoji:'🦯', maxhp:1000,
      caneDamage:120, caneRange:120, speed:165, r:50,
      modifiers:{
        swiftCane:{name:'Swift cane', desc:'Adds a faster long-range 55 damage follow-up swing'},
        alert:{name:'Alert', desc:'Senses nearby enemies and swings without contact'}
      },
      desc:'Cannot attack willingly; impacts alert him and trigger a cane swing.'
    },
    pirate: {
      key:'pirate', name:'Pirate Guy', emoji:'🏴‍☠️', maxhp:1000,
      damage:80, fireRate:1.5, projSpeed:420, speed:165, r:50,
      modifiers:{
        plunder:{name:'Plunder', desc:'Cannonball hits heal 20 HP'},
        cutlass:{name:'Sharpened Cutlass', desc:'Sword swings deal +30 damage'}
      },
      desc:'Cannons only on his right side (3 balls, 80 dmg each). A sword on his left swings every 0.45s for 70 dmg.'
    },
    wizard: {
      key:'wizard', name:'Wizard Guy', emoji:'🧙‍♂️', maxhp:1000,
      damage:90, fireRate:1.3, projSpeed:380, speed:170, r:50,
      modifiers:{
        frostbite:{name:'Frostbite', desc:'Spells stun enemies for 0.3s'},
        arcane:{name:'Arcane Surge', desc:'Casts two spells at once'}
      },
      desc:'Hurls a fireball for 90 dmg every 1.3s.'
    },
    ninja: {
      key:'ninja', name:'Ninja Guy', emoji:'🥷', maxhp:1000,
      damage:45, fireRate:0.9, projSpeed:600, speed:210, r:46,
      modifiers:{
        twin:{name:'Five Stars', desc:'Throws 5 shuriken instead of 3'},
        bloodlust:{name:'Bloodlust', desc:'Each shuriken hit heals 8 HP'}
      },
      desc:'Fast and fragile. Throws a fan of 3 shuriken every 0.9s.'
    },
    robot: {
      key:'robot', name:'Robot Guy', emoji:'🤖', maxhp:1000,
      damage:12, fireRate:0.15, projSpeed:700, speed:150, r:52,
      modifiers:{
        overclock:{name:'Overclock', desc:'Each laser hit adds +0.3 damage (stacking)'},
        repair:{name:'Repair Bot', desc:'Each laser hit heals 3 HP'}
      },
      desc:'Rapid-fire laser, 12 dmg every 0.15s.'
    },
    pocketeer: {
      key:'pocketeer', name:'Pocketeer', emoji:'🦝', maxhp:1000, speed:175, r:50,
      modifiers:{
        masterRobber:{name:'Master Robber',desc:'Steals abilities from two distinct random enemies each time.'},
        prepared:{name:'Prepared',desc:'After stealing, gains +50% movement speed for 3s and a 20% chance to dodge attacks for 3s. Stolen modifiers are copied too.'}
      },
      desc:'Every 15s, steals an enemy fighter’s active abilities and selected modifiers until taking 200 damage. Keeps Pocketeer’s own body and movement.'
    },
    factorial: {
      key:'factorial', name:'Factorial Guy', emoji:'❗', category:'math', maxhp:1000, speed:170, r:50,
      modifiers:{
        factored:{name:'Factored',desc:'Reduces attack charge time by 1 second.'},
        superFactored:{name:'Super Factored',desc:'Attacks knock the enemy away.'}
      },
      desc:'Charges an attack every 5 seconds, dealing factorial damage in order: 1!, 2!, 3!, and so on.'
    },
    fibonacci: {
      key:'fibonacci', name:'Fibonacci Ball', emoji:'🔵', category:'math', maxhp:1000, speed:175, r:48,
      modifiers:{
        fibonacciSquared:{name:'Fibonacci²',desc:'Each attack adds all previous sequence values instead of only the previous two; max HP is halved.'},
        fibbonacied:{name:'Fibbonacied',desc:'Each hit fires 8 projectiles around the target using the most recent Fibonacci damage values.'}
      },
      desc:'Attacks for successive Fibonacci values: 1, 1, 2, 3, 5, 8, and so on.',
      hooks:{
        spawnMaxHpMult: (modifiers)=> modifiers.fibonacciSquared ? 0.5 : 1
      }
    },
    vampire: {
      key:'vampire', name:'Vampire Guy', emoji:'🧛', maxhp:1000,
      damage:60, fireRate:0.8, meleeRange:70, speed:185, r:50,
      modifiers:{
        bloodthirst:{name:'Bloodthirst', desc:'Bites heal 100% of damage instead of 50%'},
        batForm:{name:'Bat Form', desc:'Once, below 40% HP, turns into a bat: invisible and untouchable for 2s'}
      },
      desc:'Bites for 60 dmg every 0.8s and heals half the damage dealt.'
    },
    frog: {
      key:'frog', name:'Frog Guy', emoji:'🐸', maxhp:1000,
      damage:100, fireRate:3, speed:175, r:50,
      modifiers:{
        longTongue:{name:'Long Tongue', desc:'Tongue deals 150 damage'},
        sticky:{name:'Sticky', desc:'Pulled enemies are stunned for 0.6s'}
      },
      desc:'Every 3s, yanks the enemy to him with his tongue for 100 dmg.'
    },
    alien: {
      key:'alien', name:'Alien Guy', emoji:'👽', maxhp:1000,
      damage:150, fireRate:4, speed:160, r:50,
      modifiers:{
        probe:{name:'Probe', desc:'Abductions deal 100 extra damage'},
        warp:{name:'Warp', desc:'Abducted enemies are dropped at a random spot'}
      },
      desc:'Every 4s, a tractor beam stuns the enemy for 1s and slams for 150 dmg.'
    },
    magician: {
      key:'magician', name:'Magician Guy', emoji:'🎩', maxhp:1000,
      fireRate:1.2, speed:175, r:50,
      modifiers:{
        finalShow:{name:'Final Show', desc:'Projectile also applies the modifier of the hero it came from'},
        trick:{name:'Trick', desc:'After a hit, poofs away for 1s, hidden and untouchable, then pops back'}
      },
      desc:'Pulls a random hero\'s projectile out of his hat every 1.2s.'
    },
    timeguy: {
      key:'timeguy', name:'Time Guy', emoji:'⏳', maxhp:1000,
      damage:40, fireRate:0.8, projSpeed:500, speed:170, r:50,
      modifiers:{
        quick:{name:'Quickened', desc:'Rewind recharges in 5s instead of 8s'},
        timeStop:{name:'Time Stop', desc:'Each rewind also freezes the enemy for 1.5s'}
      },
      desc:'Shoots 40 dmg time bolts. Every 8s he rewinds to his HP from 3s ago.'
    },
    magnet: {
      key:'magnet', name:'Magnet Guy', emoji:'🧲', maxhp:1000,
      damage:50, fireRate:1, projSpeed:450, speed:165, r:50,
      modifiers:{
        polarity:{name:'Polarity', desc:'Reflected projectiles deal +50% damage'},
        strong:{name:'Strong Field', desc:'Magnetic field radius is much larger'}
      },
      desc:'Reflects enemy projectiles that come near, sending them back.'
    },
    archer: { key:'archer', name:'Archer Guy', emoji:'🏹', maxhp:1000, speed:175, r:48,
      sh2:{em:'➴',dmg:70,rate:0.9,spd:720,r:9},
      modifiers:{pin:{name:'Pin Down',desc:'Arrows pin the enemy in place: a 99% slow for 0.6s'},mark:{name:"Hunter's Mark",desc:'Every 3rd arrow hit deals triple damage'}},
      desc:'Long-range sniper: 70 dmg arrows every 0.9s.' },
    iceguy: { key:'iceguy', name:'Ice Guy', emoji:'🧊', maxhp:1000, speed:165, r:50,
      sh2:{em:'❄️',dmg:55,rate:1,spd:480,r:11},
      modifiers:{shatter:{name:'Shatter',desc:'4 shard hits freeze the enemy solid for 1s; the next hit on a frozen enemy shatters it for +100 damage'},aura:{name:'Blizzard Aura',desc:'Enemies within 200px are permanently slowed by 50%'}},
      desc:'Throws ice shards for 55 dmg every 1s.' },
    cowboy: { key:'cowboy', name:'Cowboy Guy', emoji:'🤠', maxhp:1000, speed:185, r:48,
      sh2:{em:'•',dmg:30,rate:0.35,spd:900,r:6},
      modifiers:{noon:{name:'High Noon',desc:'Every 10s the enemy is frozen for 1.5s while he fires 6 guaranteed shots for 60 each'},dynamite:{name:'Dynamite',desc:'Every 5s throws dynamite that explodes after 1.5s for 120 damage in a 140 radius'}},
      desc:'Fast revolver: 30 dmg every 0.35s.' },
    scientist: { key:'scientist', name:'Scientist Guy', emoji:'🧪', maxhp:1000, speed:170, r:48,
      sh2:{em:'🧪',dmg:60,rate:1.1,spd:420,r:12},
      modifiers:{mutate:{name:'Mutation',desc:'Each flask applies a random effect: heal you 40, slow, stun, +60 damage or a poison cloud'},puddle:{name:'Unstable Compound',desc:'Flasks leave an acid puddle for 3s that deals 25 damage per second'}},
      desc:'Lobs experimental flasks for 60 dmg every 1.1s.' },
    dragon: { key:'dragon', name:'Dragon Guy', emoji:'🐉', maxhp:1000, speed:150, r:56,
      sh2:{em:'🔥',dmg:150,rate:2,spd:360,r:20},
      modifiers:{burn:{name:'Burning',desc:'Fireballs set the enemy on fire for 4s (20 damage per second)'},skydive:{name:'Sky Dive',desc:'Every 6s he flies off, untouchable for 1.5s, then dive-bombs the enemy for 180 damage and a stun'}},
      desc:'Huge, slow fireballs: 150 dmg every 2s.' },
    zombie: { key:'zombie', name:'Zombie Guy', emoji:'🧟', maxhp:1200, speed:130, r:50, mel:{dmg:40,rate:0.6,range:60},
      modifiers:{frenzy:{name:'Frenzy',desc:'Every bite makes him 12% faster, up to 5 times'},plague:{name:'Plague Bite',desc:'Bites stack poison: 6 damage per second per stack, up to 5 stacks'}},
      desc:'Slow, tanky biter: 40 dmg every 0.6s.' },
    sniper: { key:'sniper', name:'Sniper Guy', emoji:'🎯', maxhp:900, speed:160, r:46,
      sh2:{em:'🔸',dmg:160,rate:2.4,spd:1200,r:8},
      modifiers:{charge:{name:'Charged Shot',desc:'Every 3rd shot is a 400 damage charged round'},blink:{name:'Reposition',desc:'After every shot he blinks to a random spot far from the enemy'}},
      desc:'One huge, near-instant 160 dmg shot every 2.4s.' },
    santa: { key:'santa', name:'Santa Guy', emoji:'🎅', maxhp:1100, speed:150, r:52,
      sh2:{em:'🎁',dmg:75,rate:1.2,spd:400,r:14},
      modifiers:{naughty:{name:'Naughty List',desc:'Gifts put the enemy on the naughty list: they take +25% damage from everything for 6s'},sleigh:{name:'Sleigh Ride',desc:'Every 8s his sleigh charges across the arena for 120 damage'}},
      desc:'Hurls explosive gifts for 75 dmg every 1.2s.' },
    pumpkin: { key:'pumpkin', name:'Pumpkin Guy', emoji:'🎃', maxhp:1000, speed:170, r:50,
      sh2:{em:'🎃',dmg:65,rate:1,spd:460,r:13},
      modifiers:{scare:{name:'Spooky Scare',desc:'Hits terrify the enemy: they flee from him for 1.2s'},trick:{name:'Trick or Treat',desc:'Each toss is a coin flip: a trick explodes for 100 area damage, a treat heals you 25 HP'}},
      desc:'Tosses mini pumpkins for 65 dmg every 1s.' },
    bard: { key:'bard', name:'Bard Guy', emoji:'🎸', maxhp:1000, speed:175, r:48,
      sh2:{em:'🎵',dmg:40,rate:0.6,spd:520,r:10},
      modifiers:{lullaby:{name:'Lullaby',desc:'Every 8s a note puts the enemy to sleep for 2s'},cresc:{name:'Crescendo',desc:'Each consecutive note hit adds +5 damage, up to +50 (resets after 3s)'}},
      desc:'Rapid sound notes: 40 dmg every 0.6s.' },
    shark: { key:'shark', name:'Shark Guy', emoji:'🦈', maxhp:1000, speed:215, r:50,
      mel:{dmg:55,rate:0.7,range:60},
      modifiers:{bloodfrenzy:{name:'Blood in the Water',desc:'Against enemies below 50% HP he is 50% faster and bites twice as fast'},dive:{name:'Deep Dive',desc:'Every 3rd bite he dives, untouchable for 1s, then ambushes with a double-damage bite'}},
      desc:'Fast chaser: 55 dmg bites every 0.7s.' },
    panda: { key:'panda', name:'Panda Guy', emoji:'🐼', maxhp:1600, speed:120, r:56,
      mel:{dmg:35,rate:0.5,range:65},
      modifiers:{bamboo:{name:'Bamboo Shield',desc:'Every 6s gains a shield that absorbs 150 damage'},roll:{name:'Roll Out',desc:'Every 6s he rolls at triple speed and crashes into the enemy for 80 damage and a 0.5s stun'}},
      desc:'Slow, very tanky bruiser: 35 dmg every 0.5s.' },
    poker: { key:'poker', name:'Poker Guy', emoji:'🃏', maxhp:1000, speed:165, r:50,
      modifiers:{tainted:{name:'Tainted Joker',desc:'10% chance a joker comes out with the 4 cards: swaps places with the enemy, heals you 30 HP, and has a 50% chance to deal 100 damage'},lucky:{name:'Lucky',desc:'After a Three of a Kind or better, the next pull has a +7.5% chance to be a Three of a Kind or better (never a Royal Flush)'}},
      desc:'Pulls 4 cards every second; each card deals double its value (2 = 4 ... K = 26, A = 28). Pairs, Three/Four of a Kind and Straight Flush multiply damage and add slows or stuns. A Royal Flush one-shots with an exploding AoE.' },
    boomerang: { key:'boomerang', name:'Boomerang Guy', emoji:'🪃', maxhp:1000, speed:175, r:50,
      modifiers:{twin:{name:'Twin Rangs',desc:'Throws two boomerangs with opposite curls'},ricochet:{name:'Ricochet',desc:'Always bank shots; +30 damage per wall bounce, up to 4 bounces'}},
      desc:'Boomerangs loop in wide arcs or bank off the walls for trick shots, hitting on the way out and back.' },
    bomber: { key:'bomber', name:'Bomber Guy', emoji:'💣', maxhp:1000, speed:165, r:50,
      modifiers:{timebomb:{name:'Time Bomb',desc:'Bombs stick to the enemy and detonate after 2s for 200 damage in a 150 radius'},mines:{name:'Mine Layer',desc:'Also drops a land mine every 3s that explodes for 120 when an enemy steps near it'}},
      desc:'Throws bombs that explode on impact: 70 dmg to the target and 50 to anyone nearby.' },
    lightning: { key:'lightning', name:'Lightning Guy', emoji:'⚡', maxhp:1000, speed:175, r:48,
      modifiers:{storm:{name:'Storm Cloud',desc:'Every 8s a storm cloud follows the enemy for 6s, striking every 0.7s for 35 damage'},clap:{name:'Thunderclap',desc:'0.6s after each bolt, a shockwave hits everyone within 200px for 40 damage and a 0.4s stun'}},
      desc:'Strikes the enemy with lightning every 1.6s for 90 dmg. It chains to 2 more enemies for half damage.' },
    spore: { key:'spore', name:'Spore Guy', emoji:'🍄', maxhp:1100, speed:150, r:50,
      modifiers:{contagion:{name:'Contagion',desc:'Enemies hit by a cloud are infected for 5s and leave small poison clouds wherever they go'},puff:{name:'Puffball',desc:'Clouds burst when they expire: 80 damage and a 0.3s stun to anyone inside'}},
      desc:'Plants a poison cloud on the enemy every 2.5s: 30 dmg per second to anyone inside for 4s.' },
    spider: { key:'spider', name:'Spider Guy', emoji:'🕷️', maxhp:1000, speed:185, r:48,
      sh:{em:'🕸️',dmg:45,rate:1.8,spd:520,r:12,slow:0.8}, mel:{dmg:40,rate:0.7,range:60},
      modifiers:{trap:{name:'Web Trap',desc:'Also lays a web patch under the enemy every 3s for 5s that slows anyone inside'},cocoon:{name:'Cocoon',desc:'Every 3rd web hit wraps the enemy in a cocoon: stunned for 1.2s'}},
      desc:'Chases and bites for 40 dmg, and webs slow enemies for 0.8s.' },
    disco: { key:'disco', name:'Disco Guy', emoji:'🪩', maxhp:1000, speed:170, r:50,
      modifiers:{dance:{name:'Dance Battle',desc:'Pulses make enemies dance for 1.5s: their movement turns random'},encore:{name:'Encore',desc:'Once, below 30% HP, a huge pulse hits for 200, stuns for 0.5s and heals you 150 HP'}},
      desc:'Every 2s a dance pulse hits all enemies within 220px for 45 dmg.' },
    sumo: { key:'sumo', name:'Sumo Guy', emoji:'🤼', maxhp:1800, speed:120, r:60,
      mel:{dmg:90,rate:1.1,range:70},
      modifiers:{stomp:{name:'Stomp',desc:'Every 4s a stomp hits everyone within 260px for 60 damage and a 0.6s stun'},bulk:{name:'Bulk Up',desc:'Every hit he takes makes him bigger: +1.5% size and damage, up to 40 times'}},
      desc:'Huge and slow: 90 dmg every 1.1s and 1,800 HP.',
      hooks:{
        onDamageTaken: (ctx)=>{
          const u=ctx.unit;
          if(ctx.hasModifier(u,'bulk') && (u.bulk||0)<40){
            if(!u.baseR) u.baseR=u.r;
            u.bulk=(u.bulk||0)+1;
            u.r=u.baseR*(1+0.015*u.bulk);
          }
        }
      } },
    scythe: { key:'scythe', name:'Scythe Guy', emoji:'💀', maxhp:1100, speed:170, r:50, tickDmg:50,
      modifiers:{reaper:{name:'Grim Reaper',desc:'+10 damage per tick.'},soul:{name:'Soul Reaver',desc:'Invincible and deflects projectiles while reaping. After 0.75s idle the next swing is a super swing: 25 damage (not per tick), wild knockback, lasts 50% longer, +25% range'}},
      desc:'When an enemy is within 3 times his radius he spins his scythe twice: 50 ticks per rotation. Each rotation takes 0.2s, and the second reaches 15% farther. Hits stun for 0.5s before the next hit knocks back, except at the outer edge where they knock back immediately. He lunges to close the gap first. Each kill grants +2.5% movement speed, +3% status resistance, and a stacking 10 HP shield. Every 50 damage dealt grants +20% knockback resistance, +25% movement speed, and +15% status resistance for 4 seconds; this buff refreshes but does not stack.' },
    doctor: { key:'doctor', name:'Doctor Guy', emoji:'👨‍⚕️', maxhp:1000, speed:170, r:50,
      modifiers:{anesthesia:{name:'Anesthesia',desc:'After the stun, the enemy is slowed 50% for 3s and cannot attack for 0.5s'},blood:{name:'Universal Blood',desc:'Picking up a full syringe injects the blood: he gains the enemy base attack for 15s (stacks with more samples)'}},
      desc:'Fires one big, non-homing syringe: 200 damage and a 1s stun, stealing blood. Once it is full he must walk over and pick it up to heal 100 HP. The syringe is his only attack.' },
    knight: {
      key:'knight', name:'Knight Guy', emoji:'🛡️', maxhp:1000,
      damage:100, fireRate:1, meleeRange:145, speed:160, r:50,
      modifiers:{
        armored:{name:'Armored', desc:'Adds one extra armor hit but slows Knight Guy by 25%'},
        blastProof:{name:'Blast Proof Protection', desc:'Armor only breaks above 100 damage and gives 80% status resistance'}
      },
      desc:'Shield and helmet nullify the first two attacks, then swings every second.',
      hooks:{
        spawnSpeedMult: (modifiers)=> modifiers.armored ? 0.75 : 1,
        armorHits: (modifiers)=> modifiers.armored ? 3 : 2,
        statusResistFactor: (modifiers)=> modifiers.blastProof ? 1.8 : 1,
        onDamagePostArmor: (ctx)=>{
          if(ctx.hasModifier(ctx.unit,'blastProof')) ctx.unit.statusResist = 999;
        }
      }
    },
    drunk: {
      key:'drunk', name:'Drunk Guy', emoji:'🍺', maxhp:1000,
      damage:111, fireRate:1.5, projSpeed:840, projR:9,
      modifiers:{
        sharing:{name:'Sharing', desc:'A successful beer disables attacking for 0.5s and scrambles movement'},
        hammered:{name:'Hammered', desc:'Below 50% HP: drink, frenzy, double beers and glass spikes'}
      },
      speed:210, r:50,
      desc:'Throws a beer in a straight line for 111 dmg. Staggers around unpredictably instead of a clean bounce.'
    },
    henchman: {
      key:'henchman', name:'Henchmen', emoji:'👊', maxhp:100,
      damage:75, critDamage:150, critChance:0.05, fireRate:0.9, meleeRange:70,
      speed:230, r:34,
      spawnInterval:5, maxCount:10,
      modifiers:{
        goons:{name:'Goons', desc:'Strikes stun for 0.15s; additional Henchmen hits add 0.2s'},
        squadron:{name:'Squadron', desc:'+10 Henchmen and +1 extra Henchman per spawn'}
      },
      desc:'75 dmg (5% chance of 150). A fresh Henchman joins every 5s, up to 10. The mob only falls once every last one is down — and keeps recruiting even with none currently on the field.'
    },
    manager: {
      key:'manager', name:'Manager Guy', emoji:'💼', maxhp:1000,
      suitcaseDamage:200, suitcaseFireRate:1.5, suitcaseSpeed:400, suitcaseR:11,
      paperDamage:50, paperCount:8, paperSpeed:320, paperR:6,
      modifiers:{
        sales:{name:'Sales', desc:'Briefcase hits heal 50 HP and make the next briefcase 77% faster'},
        boss:{name:'Boss', desc:'Briefcase bursts use 16 papers; every 5 hits launches 3 briefcases'}
      },
      speed:170, r:52,
      desc:'Flings a suitcase for 200 dmg every 1.5s. On hitting a foe or the wall, it bursts into 8 papers in an octagon spread, 50 dmg each.'
    },
    traffic: {
      key:'traffic', name:'Traffic Director', emoji:'🚦', maxhp:1000,
      carDamage:334, carInterval:6, carSpeed:900, carR:75,
      modifiers:{
        crowdControl:{name:'Crowd Control', desc:'Cars pierce units and stun for 0.7s'},
        highwaySpeeding:{name:'Highway Speeding', desc:'Cars spawn 25% faster and hit with much stronger knockback'}
      },
      speed:160, r:52,
      desc:'No normal attack. Every 6s, waves in a car that drives straight at the foe for 334 dmg.'
    },
    laser: {
      key:'laser', name:'Laser Guy', emoji:'🔦', maxhp:1000,
      laserInterval:5, laserDamage:175, laserBounces:5, laserWidth:8,
      modifiers:{
        potent:{name:'Potent',desc:'+25 damage; the laser remains visible for 0.5s after firing'},
        particleAcceleration:{name:'Particle Acceleration',desc:'+2 wall reflections and +25% laser width'}
      },
      speed:170, r:50,
      desc:'Every 5s, traces a forward laser that reflects off the arena walls 5 times over 0.5s, then fires for 175 damage.'
    },
    weatherman: {
      key:'weatherman', name:'Weatherman', emoji:'🌦️', maxhp:1000,
      weatherInterval:9,
      modifiers:{
        plotArmor:{name:'Plot Armor',desc:'Lightning is more likely to strike the enemy than Weatherman'},
        oh:{name:'Oh',desc:'+5% chance to spawn a bomb during Windy weather'}
      },
      speed:165, r:50,
      desc:'Every 9s, announces a random weather event: a 75-ball hailstorm, heatwave, damaging wind, or a 300-damage lightning strike.'
    },
    priest: {
      key:'priest', name:'The Priest', emoji:'🙏', maxhp:1000,
      dmgMin:200, dmgMax:240, strikeInterval:4, healChance:0.1, healFrac:0.5,
      modifiers:{
        blessed:{name:'Blessed', desc:'Area lightning stuns for 0.5s and can strike back with a stun'},
        pope:{name:'Pope', desc:'20% slower lightning and summons 4 bishops every second'}
      },
      speed:170, r:52,
      desc:'Calls down lightning for 200-240 dmg every 4s. 10% chance per strike to heal for half the damage dealt.'
    },
    football: {
      key:'football', name:'Football Guy', emoji:'🏈', maxhp:1000,
      chargeDamage:175, chargeInterval:3, chargeSpeed:640,
      modifiers:{
        tackle:{name:'Tackle', desc:'Charge hits add 10% current HP damage and stun for 0.7s'},
        nfl:{name:'NFL', desc:'44% shorter charge cooldown, 50% more knockback, 70% status resistance'}
      },
      speed:185, r:52,
      desc:'No normal attack. Every 3s locks onto a foe and charges for 175 dmg, gaining invincibility for the duration of the charge.'
    },
    chess: {
      key:'chess', name:'Chess Guy', emoji:'♟️', maxhp:1000,
      attackInterval:3.2,
      pawnDamage:80, knightDamage:90, bishopDamage:100, rookDamage:110, queenDamage:120,
      pawnSpeed:260, knightSpeed:340, bishopSpeed:320, rookSpeed:360, queenSpeed:430,
      modifiers:{
        blitz:{name:'Blitz', desc:'33% shorter attack cooldown'},
        check:{name:'Check', desc:'Every hit disables the target\'s attacks for 0.6s'}
      },
      speed:180, r:52,
      desc:'Cycles through five chess-piece attacks: pawn, knight, bishop, rook, and queen.'
    },
    sentient: {
      key:'sentient', name:'Sentient Guy', emoji:'🤖', maxhp:1000,
      dmg:40, fireRate:0.7, projSpeed:420,
      modifiers:{
        omnidirectional:{name:'Omnidirectional', desc:'Tracking is no longer limited to 8 directions'},
        stunlock:{name:'Stunlock', desc:'+20 damage, stuns and breaks passives for 0.175s'}
      },
      speed:185, r:52,
      desc:'Fires every 0.7s. Never misses — 40 dmg a bullet.'
    },
    pingpong: {
      key:'pingpong', name:'Ping Pong Guy', emoji:'🏓', maxhp:1000,
      ballDmg:50, ballSpeed:300, ballR:14, ballDmgGain:20, ballSpeedMult:2, boostCooldown:1.0,
      modifiers:{
        deadlyVelocity:{name:'Deadly Velocity', desc:'Faster balls deal more damage and knock back harder'},
        masterPong:{name:'Master Pong', desc:'Hits redirect to the enemy and grant speed plus invulnerability'}
      },
      speed:170, r:52,
      desc:'Launches a ball on spawn that bounces around the field and off enemies for 50 base dmg. Whenever it swings back near him, he smashes it — +100% speed, +20 dmg, forever.'
    },
    boxing: {
      key:'boxing', name:'Boxing Guy', emoji:'🥊', maxhp:1000,
      punchDamage:80, uppercutDamage:120, downDamage:90,
      fireRate:0.6, meleeRange:78,
      dodgeBase:0.175, dodgePerChunk:0.10, dodgeHpChunk:33,
      speed:180, r:52,
      modifiers:{
        chaining:{name:'Chaining', desc:'Landing a hit within 0.4s of the last one gives +10 damage, stacking up to +50'},
        strongBlow:{name:'Strong Blow', desc:"After 3s without landing a hit, the next attack deals +25 damage and stuns for an extra 0.25s"}
      },
      desc:'Punches every 0.6s when near, chaining hit after hit, with brief stun and a knockback. Catch a foe above him and he uppercuts for 120 dmg, sending them flying; catch one below and he strikes downward for 90 dmg with a longer stun. Against incoming projectiles he has a 17.5% chance to dodge and step clear, rising 10% for every 33% of his HP he has lost.'
    },
    referee: {
      key:'referee', name:'Referee Guy', emoji:'🟨', maxhp:1000,
      cardDamage:65, cardInterval:2.2, cardSpeed:520, cardR:11,
      speed:180, r:50,
      modifiers:{
        yellowCard:{name:'Yellow Card', desc:'Each card that lands slows its target by 10%, stacking up to 30%'},
        redCard:{name:'Red Card', desc:'Cards deal double damage to already-stunned targets'}
      },
      desc:'Throws a card at the target every 2.2s, dealing 65 dmg and stunning for 0.4s.'
    },
    gardener: {
      key:'gardener', name:'Gardener Guy', emoji:'🌱', maxhp:1000,
      seedInterval:3, growTime:1, burstDamage:90, burstRadius:75,
      bleedDps:15, bleedDuration:3,
      speed:180, r:50,
      modifiers:{
        fertilizer:{name:'Fertilizer', desc:'Seeds sprout 40% faster'},
        thorns:{name:'Thorns', desc:'The thorn burst leaves a bleed dealing 15 dmg/s for 3s'}
      },
      desc:"Plants a seed on the target's spot every 3s. After a second it bursts into thorns, dealing 90 dmg to anyone caught nearby."
    },
    parry: {
      key:'parry', name:'Parry Guy', emoji:'🥋', maxhp:1000,
      parryCooldown:2.5,
      modifiers:{
        trickshot:{name:'Trickshot', desc:'+25% move speed. Parried hits are reflected for +50% damage'},
        successfulParry:{name:'Successful Parry', desc:'Successful parries heal 25 HP'}
      },
      speed:170, r:52,
      desc:'No normal attack. Every 2.5s of cooldown, the next hit or projectile aimed at him gets parried entirely — negated and reflected straight back at full damage (no bonus).'
    },
    grandmama: {
      key:'grandmama', name:'Grandmama', emoji:'👵', maxhp:1000, speed:150, r:50,
      meleeRange:88, rogueFireRate:0.33, rogueDamage:50,
      cookieInterval:2, cookieDamage:75, cookieHeal:30, cookieSpeed:360, cookieR:9,
      modifiers:{
        unleashed:{name:'Unleashed', desc:"The chihuahua knows no bounds — no leash, it tracks down enemies on its own"},
        cookie:{name:'Cookie', desc:'Once in her rogue state, she also throws 75-damage cookies that heal her 30 HP'}
      },
      desc:"Grandmama doesn't fight herself — her leashed chihuahua does the biting. If the chihuahua dies, she goes rogue: +50% speed, swinging a baton for 50 dmg every 0.33s.",
      // No attack / movement hooks yet (that part of the hook system isn't
      // built — see index.html's "if(unit.defKey==='grandmama')" block).
      // What IS hooked here: spawning the chihuahua companion, and what
      // happens the moment either of them dies.
      hooks:{
        spawnCompanions: (ctx)=>{
          const dog = ctx.makeUnit('chihuahua', ctx.unit.team, ctx.unit.x+ctx.rand(-20,20), ctx.unit.y+ctx.rand(-20,20), ctx.unit.modifiers);
          dog.leashOwner = ctx.unit;
          dog.modifiers = ctx.unit.modifiers; // shares grandmama's modifier picks (unleashed/cookie)
          ctx.unit.companion = dog;
          return [dog];
        },
        onDeath: (ctx)=>{
          const dog = ctx.unit.companion;
          if(dog && dog.alive){
            dog.chihuahuaRogue = true;
            ctx.addFloater(dog.x, dog.y-dog.r-18, 'GOES ROGUE!', '#ff5b5b');
            ctx.log('🐕 The chihuahua goes rogue!', true);
          }
        }
      }
    },
    chihuahua: {
      key:'chihuahua', name:'Chihuahua', emoji:'🐕', maxhp:900, speed:400, r:26, selectable:false,
      damage:33, fireRate:0.5, meleeRange:55, leashRadius:150,
      rogueFireRate:0.33, rogueDamageBonus:17, rogueLifesteal:1.0,
      desc:"Grandmama's leashed chihuahua. Bites for 33 dmg every 0.5s. If grandmama dies first, it goes rogue: +100% lifesteal, +17 dmg, and bites every 0.33s.",
      hooks:{
        onDeath: (ctx)=>{
          const grandma = ctx.unit.leashOwner;
          if(grandma && grandma.alive){
            grandma.grandmamaRogue = true;
            grandma.speedMultiplier = (grandma.speedMultiplier||1) * 1.5;
            grandma.cdGrandmaBaton = 0;
            grandma.cdGrandmaCookie = 0;
            ctx.addFloater(grandma.x, grandma.y-grandma.r-18, 'GOES ROGUE!', '#ff5b5b');
            ctx.log('👵 Grandmama goes rogue!', true);
          }
        }
      }
    },
    oldguy: {
      key:'oldguy', name:'Old Guy', emoji:'👴', maxhp:1000,
      speed:150, r:52,
      swarmInterval:3, swarmDuration:1, flyerCount:16, flyerSpeed:260,
      poopDamage:25, poopLife:1.5, poopSlow:0.5, poopRadius:30,
      ringCount:10, ringPigeonHp:50, ringLife:3, ringDiveDamage:10,
      offenseChance:0.5, offenseDiveDamage:10, offensePoopBonus:5,
      modifiers:{
        pigeonDefense:{name:'Pigeon Defense', desc:'After every swarm, 10 pigeons ring the Old Guy for 3s as a shield (50 HP each). Popped pigeons dive at the enemy for 10 dmg'},
        pigeonOffense:{name:'Pigeon Offense', desc:'Each pigeon has a 50% chance to poop and dive at the enemy (homing, 10 dmg). Poop damage +5'}
      },
      desc:'Throws bread every 3s. A huge pigeon swarm flies across the arena, pooping on the ground: 25 dmg to anything hit mid-air, and ground poop slows units by 50% for 1.5s.'
    },
    canadian: {
      key:'canadian', name:'Canadian Guy', emoji:'🍁', maxhp:1000,
      speed:160, r:50,
      fireRate:0.25, volleyAngleStep:10, volleyBalls:3,
      snowDamage:5, snowSpeed:420, snowRadius:9,
      growTime:1, growMaxDamageBonus:2.5, growMaxSizeBonus:1.5,
      bioDamageBonus:5, rockChance:0.33, rockDamage:10,
      yellowChance:0.33, yellowSlow:0.09, yellowDuration:10,
      snowSlowPerStack:0.05, snowSlowMaxStacks:10,
      modifiers:{
        yaySnow:{name:'Yay Its Snow', desc:'+1 snowball per volley. Snowballs grow while rolling toward the enemy: up to +250% damage and +150% size'},
        biologicalWarfare:{name:'Biological Warfare', desc:'+5 snowball damage. Each snowball has a 33% chance to contain a rock (+10 dmg) and a 33% chance of yellow snow (-9% speed per stack for 10s)'}
      },
      desc:'Spins wildly while throwing 3 snowballs every 0.25s in a 30 degree spread. Each snowball deals 5 damage and can block enemy attacks.'
    },
    guitar: {
      key:'guitar', name:'Guitar Guy', emoji:'🎸', maxhp:1000,
      speed:150, r:50,
      noteDamage:30, noteFreqs:[82.41,110,146.83,196],
      gapMin:0.125, gapMax:0.5, lightTime:0.25,
      finisherBonus:7.5, finisherChance:0.1, finisherStun:1, finisherSelfDisable:0.4,
      sequencedCd:0.25, sequencedMaxNotes:3, holdMin:0.05, holdMax:0.5, holdStep:0.05, holdDamage:2.5,
      modifiers:{
        finisher:{name:'Finisher!', desc:'+7.5 note damage. 10% chance per attack to play all 4 notes at once, stunning enemies for 1s while Guitar Guy is disabled for 0.4s'},
        sequenced:{name:'Sequenced', desc:'Attack cooldown is 0.25s at full damage. Plays up to 3 notes per attack. Every 0.05s a note is held adds 2.5 damage'}
      },
      desc:'Plays 4 notes, low to high. Each note lights a vertical quarter of the screen for 30 damage and knocks enemies down. Faster notes (0.125s gap) deal 50% less damage.'
    },
    gravity: {
      key:'gravity', name:'Gravity Guy', emoji:'🕳️', maxhp:1000,
      speed:130, r:50,
      captureRange:170, orbitMargin:70, pullRate:1.5, pullMult:2, orbitSpeed:3,
      consumeTime:3, pullConsumeTime:2.5,
      stretchScaleX:1.8, stretchSizeMult:1.4, stretchDamageMult:1.25,
      modifiers:{
        gravitationalPull:{name:'Gravitational Pull', desc:'Doubles projectile pull strength. Orbiting projectiles are consumed after 2.5s instead of 3s'},
        stretched:{name:'Stretched Out', desc:'Orbiting projectiles stretch horizontally and grow in size, and deal +25% damage'}
      },
      desc:'No normal attack. Projectiles thrown at him are pulled into orbit like a black hole. Enemies that touch an orbiting projectile take its damage. Projectiles orbiting for more than 3s are consumed. Melee does nothing to him.'
    },
    paint: {
      key:'paint', name:'Paint Guy', emoji:'🎨', maxhp:1000,
      speed:160, r:50,
      dropInterval:0.25, paintLife:2.5, radiusMult:1.1,
      paintDamage:25, tickInterval:0.5, paintSlow:0.2,
      painterBonus:12.5, painterAoeMult:1.25,
      longLastingBonus:1.5, trailSlow:0.1, trailLife:2.5, trailDropInterval:0.3, trailRadiusMult:0.7,
      modifiers:{
        longLasting:{name:'Long Lasting', desc:'+1.5s paint duration. Enemies touching paint leave their own paint trail that slows 10% (stacks with base paint)'},
        painter:{name:'Painter', desc:'+12.5 damage per 0.5s on paint. +25% paint AoE'}
      },
      desc:'Leaves paint wherever he moves. Paint lasts 2.5s. Enemies on paint are slowed 20% and take 25 damage every 0.5s.'
    },
    baker: {
      key:'baker', name:'Baker Guy', emoji:'🧁', maxhp:1000,
      speed:150, r:50,
      cookTime:3, throwSpeed:480, throwLife:1.5,
      vanillaHeal:50,
      chocolateDamage:50, chocolateSlow:0.7, chocolateSlowT:1.5,
      caramelDamage:75, caramelStun:0.5,
      cookieDamage:20, cookieCount:5, cookieSpan:1,
      apprenticeCookieChance:0.7, apprenticeCookies:2, apprenticeCookTimeCut:1,
      slapDamage:40, slapRange:90, slapCd:1, slapCookieChance:0.25,
      modifiers:{
        chefsApprentice:{name:"Chef's Apprentice", desc:'-1s cooking time. 70% chance to throw 2 cookies alongside each bake'},
        mittens:{name:'Mittens', desc:'If an enemy is near, slaps for 40 dmg with knockback. 25% chance to throw a cookie with each slap'}
      },
      desc:'Bakes every 3s: vanilla cake (heals 50, only when hurt), chocolate cake (50 dmg, slows 70% for 1.5s), caramel cake (75 dmg, stuns 0.5s), or 5 cookies over 1s (20 dmg each).'
    },
    jack: {
      key:'jack', name:'Jack Ahmmer', emoji:'🔨', maxhp:1000,
      speed:150, r:50,
      jackDamage:40, jackInterval:0.5, jackDuration:1.5, jackCooldown:1,
      faStep:0.25, faBonus:7.5, letItNotGoBonus:0.5,
      modifiers:{
        letItNotGo:{name:'Let It Not Go', desc:'+0.5s before letting go'},
        fa:{name:'F/A = P', desc:'For every 0.25s an enemy is jackhammered, its damage goes up by 7.5'}
      },
      desc:'If an enemy is directly below him, he drops onto them and jackhammers for 40 damage every 0.5s for 1.5s before letting go.'
    },
    cactus: {
      key:'cactus', name:'Suspicious Cactus', emoji:'🌵', maxhp:1000,
      speed:60, r:45,
      fireRate:1.5, spikeSpeed:520, spikeLife:3, spikeDamage:50, longChance:0.25, longDamage:70,
      stuckDamage:15, stuckTick:2, wallDamage:20, spikyDamage:40,
      modifiers:{
        hmm:{name:'Hmm', desc:'25% chance to throw a longer spike for 70 damage instead of 50'},
        spiky:{name:'Spiky', desc:'Enemies touching the cactus take 40 damage and get a stuck spike (stick damage only)'}
      },
      desc:'Fires spikes at the nearest enemy: 50 dmg on hit and the spike sticks, dealing 15 every 2s. Spikes that hit a wall stay and deal 20 on touch.'
    },
    megaphone: {
      key:'megaphone', name:'Megaphone Guy', emoji:'📢', maxhp:1000,
      speed:170, r:50,
      yellCap:500, maxDamageBonus:2, maxRadiusIsMap:true,
      screamFactor:0.33, screamDelay:0.3,
      deafeningKnockbackMult:2, deafeningStun:0.5,
      modifiers:{
        scream:{name:'Scream', desc:'Sends a second shockwave after the first, dealing 33% of the first one\'s damage'},
        deafening:{name:'Deafening', desc:'+100% shockwave knockback, stuns enemies for 0.5s on hit'}
      },
      desc:'Yells when damaged. Shockwave size and damage scale with damage taken: max is the whole map and +200% damage at 500+ damage.'
    },
  };

  global.CHAR_DEFS = CHAR_DEFS;
})(window);