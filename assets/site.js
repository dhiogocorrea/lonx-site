/* ============================================================
   LONX Online - Complete Game Bible
   Shared layout: injects sidebar navigation into every page and
   powers the in-page search filter over ".searchable" elements.

   Each page must include:
     <aside data-page="PAGE_ID"></aside>
   where PAGE_ID matches one of the keys below.
   ============================================================ */
(function () {
  "use strict";

  var NAV = [
    { group: "Overview" },
    { id: "overview", href: "pages/overview.html", label: "Overview",       ic: "\u2302" },
    { id: "vision",   href: "pages/vision.html",   label: "Vision",         ic: "\u25C8" },
    { id: "canon",    href: "pages/canon.html",    label: "Canon Decisions",ic: "\u2696" },
    { group: "Narrative" },
    { id: "story",    href: "pages/story.html",    label: "Story",          ic: "\u270E" },
    { id: "book",     href: "book/book.html",      label: "The Book of Yomi", ic: "\u2727" },
    { id: "timeline", href: "pages/timeline.html", label: "Timeline",       ic: "\u23F3" },
    { group: "Characters" },
    { id: "races",    href: "pages/races.html",    label: "Races",          ic: "\u265F" },
    { id: "classes",  href: "pages/classes.html",  label: "Classes",        ic: "\u2694" },
    { id: "balance",  href: "pages/balance.html",  label: "Class Balance",  ic: "\u2261" },
    { id: "jobs",     href: "pages/jobs.html",     label: "Jobs & Economy", ic: "\u2692" },
    { group: "The Tower" },
    { id: "floors",   href: "pages/floors.html",   label: "Floors",         ic: "\u25B2" },
    { id: "monsters", href: "pages/monsters.html", label: "Bestiary",       ic: "\u2620" },
    { group: "Systems" },
    { id: "systems",  href: "pages/systems.html",  label: "Core Systems",   ic: "\u2699" },
    { id: "items",    href: "pages/items.html",    label: "Items",          ic: "\u2756" },
    { id: "formulae", href: "pages/formulae.html", label: "Formulae",       ic: "\u2211" },
    { group: "Beyond" },
    { id: "styleguide", href: "pages/styleguide.html", label: "Style Guide", ic: "\u25D1" }
  ];

  function buildSidebar(aside) {
    var current = aside.getAttribute("data-page") || "";
    // data-base is the relative path from the current page back to the site
    // root (e.g. "../" for pages in a subfolder, "" for the root index).
    var base = aside.getAttribute("data-base") || "";

    var brand = document.createElement("a");
    brand.className = "brand";
    brand.href = base + "index.html";
    brand.innerHTML =
      '<div class="sigil"></div>' +
      '<div><h1>LONX Online</h1><small>Complete Game Bible</small></div>';
    aside.appendChild(brand);

    var search = document.createElement("input");
    search.id = "search";
    search.type = "search";
    search.setAttribute("placeholder", "Filter this page\u2026");
    aside.appendChild(search);

    var nav = document.createElement("nav");
    NAV.forEach(function (item) {
      if (item.group) {
        var g = document.createElement("div");
        g.className = "nav-group";
        g.textContent = item.group;
        nav.appendChild(g);
        return;
      }
      var a = document.createElement("a");
      a.href = base + item.href;
      if (item.id === current) a.className = "active";
      a.innerHTML = '<span class="ic">' + item.ic + "</span>" + item.label;
      nav.appendChild(a);
    });
    aside.appendChild(nav);

    wireSearch(search);
  }

  function wireSearch(search) {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll(".searchable")
    );
    if (!nodes.length) {
      search.style.display = "none";
      return;
    }
    var empty = document.querySelector(".no-results");

    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      nodes.forEach(function (node) {
        var hay = (
          (node.getAttribute("data-search") || "") +
          " " +
          node.textContent
        ).toLowerCase();
        var match = q === "" || hay.indexOf(q) !== -1;
        node.classList.toggle("hide", !match);
        if (match) shown++;
      });
      if (empty) empty.style.display = shown === 0 ? "block" : "none";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var aside = document.querySelector("aside[data-page]");
    if (aside) buildSidebar(aside);
  });
})();
