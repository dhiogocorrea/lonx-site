/* ============================================================
   LONX Online - Landing page interactions
   Scroll-reveal, hero parallax, stat count-up, sticky nav.
   Progressive enhancement: the page is fully readable without JS.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky nav shadow ---- */
  var nav = document.getElementById("lpnav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("stuck", window.scrollY > 40);
  }
  onScrollNav();

  /* ---- Reveal on scroll ---- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Stat count-up ---- */
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null, dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));
  if (!("IntersectionObserver" in window)) {
    counters.forEach(runCount);
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Hero parallax ---- */
  var parallaxEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;
  function applyParallax() {
    var y = window.scrollY;
    parallaxEls.forEach(function (el) {
      var f = parseFloat(el.getAttribute("data-parallax")) || 0;
      el.style.transform = "translate3d(0," + (y * f).toFixed(1) + "px,0)";
    });
    ticking = false;
  }
  function onScroll() {
    onScrollNav();
    if (reduceMotion || !parallaxEls.length) return;
    if (!ticking) { requestAnimationFrame(applyParallax); ticking = true; }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Smooth anchor scroll for in-page links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ============================================================
     Race + floor data
     ============================================================ */
  var RACES = {
    human: { name: "Human", tag: "Adaptable", accent: "#f6c863",
      blurb: "Children of Amaterasu and heirs of Ashihara. Adaptable, political, stubborn \u2014 and the most forgiving first character, with the freedom to change combat direction later.",
      home: "Ashihara, the great human capital", ident: "No weakness, no specialty", leans: "Any class",
      stats: { STR: 1.10, CON: 1.10, DEX: 1.10, AGI: 1.10, INT: 1.10, WIS: 1.10, LUCK: 1.20 } },
    elf: { name: "Elf", tag: "Swift & precise", accent: "#66d8ff",
      blurb: "Children of Tsukuyomi and guardians of Yomotsu. Immortal by nature, bound to moonlight, forests, precision, movement, and formation warfare. Fragile but blazing fast.",
      home: "Yomotsu, the moonlit forest realm", ident: "Fragile but fast and precise", leans: "Bowman, Assassin, Tracker",
      stats: { STR: 0.90, CON: 0.90, DEX: 1.40, AGI: 1.50, INT: 1.00, WIS: 1.15, LUCK: 1.00 } },
    halfelf: { name: "Half Elf", tag: "Diplomat", accent: "#65e6a2",
      blurb: "Born between Human and Elf families \u2014 diplomats, scouts, medics, and flexible spell-archers. Less fragile than Elves, more agile than Humans; the diplomatic middle path.",
      home: "Border settlements of Ashihara & Yomotsu", ident: "Strong hybrid stats", leans: "Bowman, Cleric, Minstrel",
      stats: { STR: 1.00, CON: 1.00, DEX: 1.25, AGI: 1.30, INT: 1.05, WIS: 1.13, LUCK: 1.11 } },
    orc: { name: "Orc", tag: "Raw power", accent: "#d74b5c",
      blurb: "Born from Izanami's corruption and later freed from her command by betrayal. Orcs now fight to prove they are not bound to the shadow that created them. Raw power and durability.",
      home: "Caves & reclaimed clans led by Lugdum", ident: "Physical power and durability", leans: "Warrior, Guardian",
      stats: { STR: 1.50, CON: 1.50, DEX: 1.00, AGI: 1.00, INT: 0.90, WIS: 0.90, LUCK: 1.07 } },
    halforc: { name: "Half Orc", tag: "Bridge-born", accent: "#e98263",
      blurb: "Often rejected in the old kingdoms, Half Orcs become the bridge between vengeance and redemption. Lugdum, Zeakgul's successor, makes them central to the new Alliance.",
      home: "Reconciled clans & human towns", ident: "Strong, tough, more balanced than Orcs", leans: "Warrior, Guardian, Monk",
      stats: { STR: 1.30, CON: 1.30, DEX: 1.05, AGI: 1.05, INT: 1.00, WIS: 1.00, LUCK: 1.05 } },
    dwarf: { name: "Dwarf", tag: "Master smith", accent: "#f6c863",
      blurb: "Children of Susanoo, builders of Unshu, keepers of metallurgy, ships, shields, and beer-soaked songs. Slow, sturdy, brave \u2014 and the best crafters in Sekai.",
      home: "Unshu, the island of forges and ships", ident: "Tanky, clever, best crafters", leans: "Guardian, Alchemist, all crafts",
      stats: { STR: 1.30, CON: 1.30, DEX: 0.90, AGI: 0.90, INT: 1.25, WIS: 1.08, LUCK: 1.04 } },
    phantom: { name: "Phantom", tag: "Cursed caster", accent: "#9c71ff",
      blurb: "The spectral people created by LONX's curse. After Sune's death they join the tower assault seeking a reason to exist beyond obedience. Peerless casters cursed with terrible luck.",
      home: "None \u2014 born of the sword", ident: "Peerless casters, terrible luck", leans: "Mage, Cleric",
      stats: { STR: 0.90, CON: 1.00, DEX: 1.00, AGI: 1.24, INT: 1.40, WIS: 1.40, LUCK: 0.78 } }
  };

  var FLOORS = [
    { rn: "I", y: 830, name: "Yomi's Mouth", sub: "The first breath of the underworld", boss: "Akomachi, the Gate-Warden", sheet: "floors/floor-1.html",
      text: "The first expedition reclaims a ruined citadel from lesser demons. Onamuji turns it into Scylla, the first safe base. The easy victory teaches that Yomi wins through exhaustion, not strength alone." },
    { rn: "II", y: 762, name: "Garden of Withered Suns", sub: "A false, dying sunrise", boss: "The Sunless Matriarch", sheet: "floors/floor-2.html",
      text: "A false garden blooms under an artificial sun. Players learn Yomi can imitate comfort. Unlocks farming, cooking, herbalism, and the first colony expansion \u2014 but every harvest carries a curse to purify." },
    { rn: "III", y: 694, name: "Tsurui Reflection", sub: "Where the Orcs were first born", boss: "Thrallian's Shade", sheet: "floors/floor-3.html",
      text: "A mirror of Tsurui Forest forces Elves and Orcs to confront the origin of their hatred. Lugdum proves the Orcs can fight for Sekai. The boss is no longer a man, but the shadow of obsession left behind." },
    { rn: "IV", y: 626, name: "The Sea Without Shore", sub: "A black tide with no far bank", boss: "Isokura, Tide-Demon", sheet: "floors/floor-4.html",
      text: "A black sea covers the floor. Phantoms walk over it; living races must build ships; Dwarves confront the fall of Unshu. The first major raid teaches vehicle travel, sea monsters, and multi-party objectives." },
    { rn: "V", y: 558, name: "The Forge of Dragon Teeth", sub: "Where the cursed sword was made", boss: "Trusius, the Bound Remnant", sheet: "floors/floor-5.html",
      text: "A furnace city beats like a heart inside the tower. Players see how LONX was forged and unlock advanced Forging, Refining, Alchemy, and Blueprints. Is power evil, or only the hunger for it?" },
    { rn: "VI", y: 490, name: "The Abyss", sub: "Fear itself is a mechanic", boss: "The Abyssal Dragon", sheet: "floors/floor-6.html",
      text: "Red-gold mountains where fear becomes a mechanic. Meeting certain monsters' gaze can slow or paralyze you unless allies break line of sight. The Abyssal Dragon guards the upper half and drops the Dragon Sword Blueprint." },
    { rn: "VII", y: 422, name: "Ashihara Remembered", sub: "The human capital, reborn wrong", boss: "Sharog's War Echo", sheet: "floors/floor-7.html",
      text: "A ruined copy of Ashihara rises from the dark. Humans see the old capital as it was and as it fell. The colony system turns political: which districts you rebuild shapes vendors, patrols, and reinforcements." },
    { rn: "VIII", y: 354, name: "Unshu Afterfall", sub: "A dwarven machine still grieving", boss: "The Iron Psalm Golem", sheet: "floors/floor-8.html",
      text: "The tower recreates Unshu Island the moment after Sune's attack, in endless repetition. Dwarven machines, defense platforms, and songs become dungeon mechanics. Onamuji faces the cost of asking others to keep climbing." },
    { rn: "IX", y: 300, name: "The Field of Triangle Oaths", sub: "Only an alliance can win", boss: "The Broken Standard", sheet: "floors/floor-9.html",
      text: "A giant battlefield puzzle. Three sanctuaries \u2014 Sun, Sea, and Moon \u2014 must be held at once, demanding tanks, ranged damage, support songs, healing, tracking, crafting, and coordinated guild logistics." },
    { rn: "X", y: 250, name: "The Phantom Basilica", sub: "The Phantoms choose their answer", boss: "Sune's Hollow Crown", sheet: "floors/floor-10.html",
      text: "The Phantoms hear Sune's old command echoing through the floor. Phantom players gain unique choices: resist the voice, absorb it, or guide others out of it. Unlocks high-level magic and the first choices that shape the ending." },
    { rn: "XI", y: 200, name: "Crown of Yomi", sub: "A gauntlet with no refuge", boss: "The Eleven Demons", sheet: "floors/floor-11.html",
      text: "No city here \u2014 only temporary camps that vanish after each reset. The eleven demons who received Izanami's floors return as a rotating council fight. Kushinadahime's voice guides you, but the tower imitates her to lure parties away." },
    { rn: "XII", y: 150, name: "The Final Test", sub: "The fate of the world is decided", boss: "Izanami, Mother of Yomi", sheet: "floors/floor-12.html",
      text: "The secret floor proves Izanami lied about the tower. Players face the strongest monsters in the game, rescue Kushinadahime, decide the fate of LONX, and determine whether the Phantoms become a free people." }
  ];

  var WORLDS = {
    sekai: { name: "Sekai", accent: "#f6c863", tag: "The world above",
      paras: [
        "In the beginning, Sekai belonged only to Izanagi and Izanami. They shaped the world, loved it, and almost destroyed it through grief. When Izanami was bound to Yomi, Izanagi washed the underworld's impurity from himself in a divine lake \u2014 and from that water were born the III Gods: Susanoo, Amaterasu, and Tsukuyomi.",
        "The III Gods created the first peoples and promised to interfere as little as possible: Humans in Ashihara, Elves in the moonlit forests of Yomotsu, Dwarves on the forge-island of Unshu. Festivals, alliances, and cities flourished across daylight, timber, and the open sea.",
        "But Sekai has never truly been safe. Every festival and every birth looked like betrayal to the goddess watching from below. The tower now steals the world back one floor at a time \u2014 and the climbers fight to reclaim the home each floor remembers."
      ],
      link: "pages/story.html" },
    yomi: { name: "Yomi", accent: "#9c71ff", tag: "The grief below",
      paras: [
        "Yomi is the underworld Izanami was bound to \u2014 ash, bone, black water, and ornament dressed over rot. Unable to leave, she learned to poison dreams, and every alliance in Sekai above only sharpened her conviction that she had been betrayed.",
        "Her grief curdled into war. She created the Orcs as a weapon, guided the forging of the cursed sword LONX, and raised the Phantom Legion \u2014 each catastrophe a way to reach back into the living world she could no longer walk.",
        "Now Yomi rises as a twelve-floor tower, each level a wound in her memory made monstrous and beautiful. \u201cThere I built a tower where hope is devoured by the hour,\u201d she promised. Something rules every floor, and the climb never forgets whose sorrow built it."
      ],
      link: "pages/story.html" }
  };

  var CAST = {
    izanami: { name: "Izanami", accent: "#d74b5c", role: "Mother of Yomi",
      text: "The mother-goddess bound to Yomi. Unable to leave, she wages war through dreams, corruption, and the cursed sword. Her grief curdled into the conviction that Sekai betrayed her \u2014 and the twelfth floor's final test waits behind her, outside of time." },
    kushinada: { name: "Kushinadahime", accent: "#f6c863", role: "Princess of Sekai",
      text: "Born Kushinada R\u00fdnien, hero of the First War who defeated Mugdul at Lake Maystomos and was crowned Princess of Sekai. Taken into the tower's crown by Izanami; her voice guides the expedition upward \u2014 though the tower learns to imitate it to lure parties astray." },
    onamuji: { name: "Onamuji Firedredger", accent: "#65e6a2", role: "Expedition commander",
      text: "Triangle Alliance founder and commander of the tower expedition. He asks the player the only question that matters \u2014 \u201cWho are you?\u201d \u2014 at the opening, and carries the guilt of ordering others to keep climbing floor after floor." },
    sune: { name: "Sune", accent: "#9c71ff", role: "The phantom king",
      text: "The ambitious forger who dreamed of being more than a craftsman. He forged LONX, heard Izanami's voice through it, and raised the Phantom Legion \u2014 then was discarded the moment his usefulness ended. His hollow crown still echoes commands through the tenth floor's basilica." },
    lonx: { name: "LONX", accent: "#66d8ff", role: "The cursed blade",
      text: "Forged by Sune from a dragon's tooth that Izanami guided into being \u2014 a blade beautiful enough to be worshipped and dangerous enough to hear. Every soul it claims strengthens it, and those transformed become Phantoms. The world itself is named for the curse it carries." }
  };

  /* ============================================================
     Modal (races)
     ============================================================ */
  var modal = document.getElementById("lpModal");
  var modalBody = document.getElementById("lpModalBody");
  var lastFocus = null;

  function openModal(html) {
    if (!modal) return;
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    lastFocus = document.activeElement;
    var x = modal.querySelector(".lp-modal-x");
    if (x) x.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  function raceModalHTML(key) {
    var r = RACES[key];
    if (!r) return "";
    var bars = Object.keys(r.stats).map(function (k) {
      var v = r.stats[k];
      var pct = Math.round(((v - 0.78) / (1.50 - 0.78)) * 100);
      var strong = v >= 1.2, weak = v < 1.0;
      return '<div class="mstat"><span class="mk">' + k + '</span>' +
        '<span class="mbar"><i style="width:' + pct + '%;background:' + r.accent + '"></i></span>' +
        '<span class="mv ' + (strong ? "up" : weak ? "down" : "") + '">' + v.toFixed(2) + '\u00d7</span></div>';
    }).join("");
    return '' +
      '<div class="rm-head" style="--acc:' + r.accent + '">' +
        '<span class="rm-tag">' + r.tag + '</span>' +
        '<h3 id="lpModalTitle">' + r.name + '</h3>' +
      '</div>' +
      '<p class="rm-blurb">' + r.blurb + '</p>' +
      '<div class="rm-meta">' +
        '<div><b>Homeland</b><span>' + r.home + '</span></div>' +
        '<div><b>Identity</b><span>' + r.ident + '</span></div>' +
        '<div><b>Leans toward</b><span>' + r.leans + '</span></div>' +
      '</div>' +
      '<div class="rm-stats">' + bars + '</div>' +
      '<a class="btn-lg primary rm-cta" href="pages/races.html" target="_blank" rel="noopener">Read the full race docs \u2197</a>';
  }

  document.querySelectorAll(".race-tile[data-race]").forEach(function (tile) {
    tile.addEventListener("click", function () {
      openModal(raceModalHTML(tile.getAttribute("data-race")));
    });
  });

  function loreModalHTML(d, linkLabel) {
    var body = d.paras
      ? d.paras.map(function (p) { return "<p>" + p + "</p>"; }).join("")
      : "<p>" + d.text + "</p>";
    var sub = d.role || d.tag || "";
    return '' +
      '<div class="rm-head" style="--acc:' + d.accent + '">' +
        '<span class="rm-tag">' + sub + '</span>' +
        '<h3 id="lpModalTitle">' + d.name + '</h3>' +
      '</div>' +
      '<div class="lore-body">' + body + '</div>' +
      '<a class="btn-lg primary rm-cta" href="' + d.link + '" target="_blank" rel="noopener">' + linkLabel + '</a>';
  }

  document.querySelectorAll("[data-world]").forEach(function (card) {
    function open() {
      var d = WORLDS[card.getAttribute("data-world")];
      if (d) openModal(loreModalHTML(d, "Read the full story \u2197"));
    }
    card.addEventListener("click", open);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  document.querySelectorAll("[data-cast]").forEach(function (card) {
    function open() {
      var d = CAST[card.getAttribute("data-cast")];
      if (d) { d.link = d.link || "pages/story.html"; openModal(loreModalHTML(d, "Meet the full cast \u2197")); }
    }
    card.addEventListener("click", open);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  /* ============================================================
     Interactive tower explorer (floors)
     ============================================================ */
  var dotsG = document.getElementById("teDots");
  var eavesG = document.getElementById("teEaves");
  var panel = document.getElementById("tePanel");
  var progress = document.querySelector(".te-progress");
  var activeFloor = -1;
  var TE = { top: 110, bottom: 862 };

  function towerX(y) {
    // tower narrows toward the top: left edge 108->134, right 192->166 across y 872..96
    var t = (872 - y) / (872 - 96);
    return { half: (192 - 108) / 2 * (1 - t) + (166 - 134) / 2 * t };
  }

  function buildTower() {
    if (!dotsG || !FLOORS.length) return;
    var svgNS = "http://www.w3.org/2000/svg";
    // eaves per floor
    FLOORS.forEach(function (f) {
      var hw = towerX(f.y).half + 30;
      var p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", "M" + (150 - hw) + " " + (f.y + 14) + " Q150 " + (f.y - 2) + " " + (150 + hw) + " " + (f.y + 14) +
        " L" + (150 + hw - 6) + " " + (f.y + 20) + " Q150 " + (f.y + 6) + " " + (150 - hw + 6) + " " + (f.y + 20) + " Z");
      eavesG.appendChild(p);
    });
    // dots
    FLOORS.forEach(function (f, i) {
      var g = document.createElementNS(svgNS, "g");
      g.setAttribute("class", "te-dot");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", "Floor " + f.rn + ": " + f.name);
      g.setAttribute("data-i", i);
      var halo = document.createElementNS(svgNS, "circle");
      halo.setAttribute("cx", 150); halo.setAttribute("cy", f.y);
      halo.setAttribute("r", 16); halo.setAttribute("class", "te-halo");
      var dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", 150); dot.setAttribute("cy", f.y);
      dot.setAttribute("r", 6); dot.setAttribute("class", "te-core");
      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", 150 + towerX(f.y).half + 44);
      label.setAttribute("y", f.y + 5);
      label.setAttribute("class", "te-rn");
      label.setAttribute("text-anchor", "start");
      label.textContent = f.rn;
      g.appendChild(halo); g.appendChild(dot); g.appendChild(label);
      dotsG.appendChild(g);
      function activate() { selectFloor(i); }
      g.addEventListener("mouseenter", activate);
      g.addEventListener("click", activate);
      g.addEventListener("focus", activate);
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      });
    });
  }

  function selectFloor(i) {
    if (i === activeFloor) return;
    activeFloor = i;
    var f = FLOORS[i];
    [].slice.call(dotsG.children).forEach(function (g, gi) {
      g.classList.toggle("on", gi === i);
      g.classList.toggle("done", gi < i);
    });
    if (progress) {
      var y = f.y;
      progress.setAttribute("d", "M150 862 L150 " + y);
      progress.style.opacity = ".9";
    }
    if (!panel) return;
    panel.innerHTML = '' +
      '<div class="te-floornum">Floor ' + f.rn + '</div>' +
      '<h3 class="te-name">' + f.name + '</h3>' +
      '<p class="te-sub">' + f.sub + '</p>' +
      '<div class="te-boss"><span>Boss</span><b>' + f.boss + '</b></div>' +
      '<p class="te-text">' + f.text + '</p>' +
      '<a class="btn-lg primary te-cta" href="' + f.sheet + '" target="_blank" rel="noopener">Open full floor sheet \u2197</a>';
    panel.classList.remove("swap");
    // force reflow to restart animation
    void panel.offsetWidth;
    panel.classList.add("swap");
  }

  if (dotsG) {
    buildTower();
    selectFloor(0);
  }
})();

