/* ============================================================================
   script.js — Broccoli Birthday
   ----------------------------------------------------------------------------
   Reads everything from window.BIRTHDAY_CONFIG (see config.js).
   No frameworks, no build step, no dependencies. Just drop it on GitHub Pages.

   Contents
   --------
   1.  Config + tiny helpers
   2.  Confetti engine
   3.  Floating hearts + broccoli
   4.  Scroll reveal
   5.  Gatekeeper (password screen)
   6.  Content injection
   7.  Joy counter
   8.  Growth journey (card deck + growing plant)
   9.  Pun generator
   10. Background music
   11. Boot
   ========================================================================= */

(function () {
  "use strict";

  /* ==========================================================================
     1. CONFIG + HELPERS
     ====================================================================== */

  /* Defaults keep the page alive even if a config key gets deleted. */
  var DEFAULTS = {
    sitePassword: "broccoli",
    passwordCaseSensitive: false,
    passwordHint: "",
    wrongPasswordMessages: ["That's not it — try again 💚"],
    hintAfterAttempts: 3,
    strongHint: "",
    birthdayPersonName: "You",
    relationshipNickname: "My Favourite Veggie",
    heroTagline: "",
    mainRomanticMessage: "",
    letterSignature: "",
    letterSignatureName: "",
    specialDate: "",
    specialDateText: "",
    journeyTitle: "How We Grew",
    journeySubtitle: "",
    journeySteps: [],
    punSectionTitle: "Poke the Broccoli",
    punSectionSubtitle: "",
    punButtonLabel: "Tap me again 🥦",
    broccoliPuns: ["You're the only one who makes my heart floret."],
    musicUrl: "",
    musicVolume: 0.35,
    musicTitle: "Our song",
    finaleHeading: "",
    finaleText: "",
    footerNote: "",
    floatingEmojis: ["💚", "🥦", "💗", "🌿"],
    autoplayMusicOnUnlock: true
  };

  var CFG = Object.assign({}, DEFAULTS, window.BIRTHDAY_CONFIG || {});

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var clamp = function (n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };
  var rand = function (lo, hi) { return lo + Math.random() * (hi - lo); };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

  var REDUCED = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  /* Safe text setter — never uses innerHTML, so config text can contain
     anything (quotes, angle brackets, emoji) without breaking the page. */
  function setText(sel, value) {
    var el = typeof sel === "string" ? $(sel) : sel;
    if (el && value != null) el.textContent = String(value);
    return el;
  }

  /* Small floating toast, used for audio feedback. */
  var toastTimer;
  function toast(message, ms) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-up");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-up"); }, ms || 3200);
  }


  /* ==========================================================================
     2. CONFETTI ENGINE  (vanilla canvas, no library)
     ====================================================================== */

  var Confetti = (function () {
    var canvas = $("#confetti");
    var ctx = canvas ? canvas.getContext("2d") : null;
    var parts = [];
    var running = false;
    var dpr = 1;

    var COLORS = ["#3f8f57", "#6bb182", "#a9dcc0", "#e79aa4", "#cd7683", "#d9a06b", "#ffffff"];

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(x, y, count) {
      if (!ctx || REDUCED.matches) return;
      var n = count || 70;
      for (var i = 0; i < n; i++) {
        var angle = rand(0, Math.PI * 2);
        var speed = rand(3, 12);
        parts.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - rand(2, 6),
          size: rand(5, 11),
          color: pick(COLORS),
          rot: rand(0, Math.PI * 2),
          spin: rand(-0.24, 0.24),
          life: 0,
          maxLife: rand(70, 130),
          round: Math.random() < 0.4
        });
      }
      /* keep memory sane if someone gets very click-happy */
      if (parts.length > 900) parts.splice(0, parts.length - 900);
      if (!running) { running = true; requestAnimationFrame(tick); }
    }

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.life++;
        p.vy += 0.28;          // gravity
        p.vx *= 0.99;          // drag
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;

        var alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0 || p.y > window.innerHeight + 60) { parts.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = clamp(alpha, 0, 1);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
        }
        ctx.restore();
      }

      if (parts.length) {
        requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }

    /* Burst centred on an element */
    function burstFrom(el, count) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      spawn(r.left + r.width / 2, r.top + r.height / 2, count);
    }

    if (canvas) {
      resize();
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("orientationchange", resize, { passive: true });
    }

    return { spawn: spawn, burstFrom: burstFrom };
  })();


  /* ==========================================================================
     3. FLOATING HEARTS + BROCCOLI
     --------------------------------------------------------------------------
     Uses emoji so there are zero image requests. Want your own artwork?
     Replace `el.textContent = pick(...)` with:
        el.innerHTML = '<img src="assets/heart.svg" alt="">';
     ====================================================================== */

  var Floaties = (function () {
    var layer = $("#floaties");
    var timer = null;
    var MAX = 22;

    function spawnOne() {
      if (!layer || document.hidden || REDUCED.matches) return;
      if (layer.childElementCount >= MAX) return;

      var el = document.createElement("span");
      el.className = "floatie";
      el.textContent = pick(CFG.floatingEmojis);

      var dur = rand(9, 17);
      el.style.left = rand(-2, 98) + "vw";
      el.style.fontSize = rand(13, 30).toFixed(1) + "px";
      el.style.animationDuration = dur + "s";
      el.style.animationDelay = rand(0, 0.6) + "s";
      el.style.setProperty("--drift", rand(-90, 90).toFixed(0) + "px");
      el.style.setProperty("--spin", rand(-140, 140).toFixed(0) + "deg");

      el.addEventListener("animationend", function () { el.remove(); });
      layer.appendChild(el);
    }

    function start() {
      if (timer || REDUCED.matches) return;
      for (var i = 0; i < 7; i++) setTimeout(spawnOne, i * 420);
      timer = setInterval(spawnOne, 900);
    }

    function stop() { clearInterval(timer); timer = null; }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (document.body.classList.contains("is-unlocked")) start();
    });

    return { start: start, stop: stop };
  })();


  /* ==========================================================================
     4. SCROLL REVEAL
     ====================================================================== */

  var revealDone = false;

  function initReveal() {
    if (revealDone) return;
    revealDone = true;

    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    /* stagger anything sharing a parent */
    items.forEach(function (el, i) {
      el.dataset.delay = String((i % 5) * 90);
      io.observe(el);
    });
  }


  /* ==========================================================================
     5. GATEKEEPER — the password screen
     ====================================================================== */

  function initGate() {
    var gate = $("#gate");
    var form = $("#gate-form");
    var field = $("#gate-field");
    var input = $("#gate-input");
    var error = $("#gate-error");
    var hint = $("#gate-hint");
    var peek = $("#gate-peek");
    var attempts = 0;
    var msgIndex = 0;

    if (!gate || !form || !input) return;

    document.body.classList.add("is-locked");
    setText(hint, CFG.passwordHint);

    /* Note: the birthday person's name is deliberately NOT shown on the lock
       screen or in the tab title until after unlocking, so a stray glance at
       the browser tab doesn't spoil the surprise. */

    /* show / hide password */
    if (peek) {
      peek.addEventListener("click", function () {
        var showing = input.type === "text";
        input.type = showing ? "password" : "text";
        peek.setAttribute("aria-pressed", String(!showing));
        peek.setAttribute("aria-label", showing ? "Show password" : "Hide password");
        input.focus();
      });
    }

    function normalise(value) {
      var v = String(value == null ? "" : value).trim();
      return CFG.passwordCaseSensitive ? v : v.toLowerCase();
    }

    function reject() {
      attempts++;
      field.classList.remove("is-wrong");
      /* force a reflow so the shake animation can replay */
      void field.offsetWidth;
      field.classList.add("is-wrong");

      var msgs = CFG.wrongPasswordMessages;
      error.textContent = msgs[msgIndex % msgs.length];
      msgIndex++;

      if (CFG.hintAfterAttempts > 0 && attempts >= CFG.hintAfterAttempts && CFG.strongHint) {
        hint.textContent = CFG.strongHint;
        hint.style.opacity = "1";
      }

      input.select();
      if (navigator.vibrate) { try { navigator.vibrate(60); } catch (e) {} }
      setTimeout(function () { field.classList.remove("is-wrong"); }, 600);
    }

    function unlock() {
      var app = $("#app");

      error.textContent = "";
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-unlocked");

      if (app) app.hidden = false;
      gate.classList.add("is-open");
      gate.setAttribute("aria-hidden", "true");

      /* fully remove the overlay once it has faded out */
      setTimeout(function () { gate.hidden = true; }, 900);

      window.scrollTo(0, 0);
      document.title = "Happy Birthday, " + CFG.birthdayPersonName + " 💚";

      /* the celebration */
      Floaties.start();
      Confetti.spawn(window.innerWidth / 2, window.innerHeight * 0.34, 130);
      setTimeout(function () { Confetti.spawn(window.innerWidth * 0.18, window.innerHeight * 0.5, 55); }, 260);
      setTimeout(function () { Confetti.spawn(window.innerWidth * 0.82, window.innerHeight * 0.5, 55); }, 420);

      /* this click counts as a user gesture, so audio is allowed to start */
      if (CFG.autoplayMusicOnUnlock) Music.tryAutoplay();

      initReveal();
      Counter.start();

      /* move focus into the page so keyboard + screen reader users land here */
      var name = $("#hero-name");
      if (name) {
        name.setAttribute("tabindex", "-1");
        name.focus({ preventScroll: true });
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (normalise(input.value) === normalise(CFG.sitePassword)) unlock();
      else reject();
    });

    input.addEventListener("input", function () {
      if (error.textContent) error.textContent = "";
    });

    /* focus the field without yanking the viewport around on iOS */
    setTimeout(function () { input.focus({ preventScroll: true }); }, 700);
  }


  /* ==========================================================================
     6. CONTENT INJECTION — everything comes from config.js
     ====================================================================== */

  function paintContent() {
    /* --- hero --- */
    setText("#hero-name", CFG.birthdayPersonName);
    setText("#hero-nickname", CFG.relationshipNickname);
    setText("#hero-tagline", CFG.heroTagline);
    setText("#special-date-text", CFG.specialDateText);

    /* --- journey --- */
    setText("#journey-title", CFG.journeyTitle);
    setText("#journey-sub", CFG.journeySubtitle);

    /* --- letter: build real <p> elements, no innerHTML --- */
    var body = $("#letter-body");
    if (body) {
      body.textContent = "";
      String(CFG.mainRomanticMessage)
        .split(/\n\s*\n/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .forEach(function (para) {
          var p = document.createElement("p");
          p.textContent = para;
          body.appendChild(p);
        });
    }
    setText("#letter-signature", CFG.letterSignature);
    setText("#letter-signature-name", CFG.letterSignatureName);

    /* --- puns --- */
    setText("#pun-title", CFG.punSectionTitle);
    setText("#pun-sub", CFG.punSectionSubtitle);
    setText("#pun-btn-label", CFG.punButtonLabel);

    /* --- finale --- */
    setText("#finale-heading", CFG.finaleHeading);
    setText("#finale-text", CFG.finaleText);
    setText("#footer-note", CFG.footerNote);
  }


  /* ==========================================================================
     7. JOY COUNTER — how long they've been making life better
     ====================================================================== */

  var Counter = (function () {
    var started = false;
    var lastSecond = -1;
    var elDays, elHours, elMins, elSecs, elTotal;

    var since = CFG.specialDate ? new Date(CFG.specialDate) : null;
    var valid = !!since && !isNaN(since.getTime());

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function frame() {
      if (!valid) return;

      var ms = Date.now() - since.getTime();
      var future = ms < 0;
      ms = Math.abs(ms);

      var totalSecs = Math.floor(ms / 1000);
      var days = Math.floor(totalSecs / 86400);
      var hours = Math.floor((totalSecs % 86400) / 3600);
      var mins = Math.floor((totalSecs % 3600) / 60);
      var secs = totalSecs % 60;

      if (elDays) elDays.textContent = days.toLocaleString();
      if (elHours) elHours.textContent = pad(hours);
      if (elMins) elMins.textContent = pad(mins);

      if (elSecs && secs !== lastSecond) {
        elSecs.textContent = pad(secs);
        elSecs.classList.remove("tick");
        void elSecs.offsetWidth;
        elSecs.classList.add("tick");
        lastSecond = secs;
      }

      if (elTotal) {
        elTotal.textContent = future
          ? "…and the countdown to that day is already making me smile."
          : "That's " + totalSecs.toLocaleString() + " seconds of you being wonderful. 💚";
      }
    }

    function start() {
      if (started) return;
      started = true;

      elDays = $("#c-days");
      elHours = $("#c-hours");
      elMins = $("#c-mins");
      elSecs = $("#c-secs");
      elTotal = $("#counter-total");

      if (!valid) {
        var grid = $("#counter-grid");
        var label = $("#counter-label");
        if (grid) grid.hidden = true;
        if (elTotal) elTotal.hidden = true;
        if (label) label.textContent = "Add a specialDate to config.js to switch on the joy counter";
        return;
      }

      frame();
      setInterval(frame, 1000);
    }

    return { start: start };
  })();


  /* ==========================================================================
     8. GROWTH JOURNEY — card deck + the broccoli that grows with it
     ====================================================================== */

  function initJourney() {
    var steps = Array.isArray(CFG.journeySteps) ? CFG.journeySteps : [];
    var card = $("#card");
    var plant = $("#plant");
    var dotsWrap = $("#progress-dots");
    var fill = $("#progress-fill");
    var prev = $("#btn-prev");
    var next = $("#btn-next");
    var nextLabel = $("#btn-next-label");
    var stageLabel = $("#stage-label");

    if (!card || !dotsWrap || !prev || !next || !steps.length) return;

    /* how tall the stalk stands at each stage */
    var GROW = { 1: 0, 2: 0.36, 3: 0.62, 4: 0.84, 5: 1 };

    var parts = $$("[data-from]", plant);
    var crown = $("#plant-crown");
    var stem = $("#plant-stem");
    var index = 0;
    var maxSeen = 0;

    /* --- progress dots --- */
    steps.forEach(function (step, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.textContent = String(i + 1);
      b.setAttribute("aria-label", "Step " + (i + 1) + ": " + (step.label || step.title || ""));
      b.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(b);
    });

    var dots = $$(".dot", dotsWrap);

    function paintPlant(stage) {
      if (stem) stem.style.setProperty("--grow", String(GROW[stage] != null ? GROW[stage] : 1));

      parts.forEach(function (part) {
        var from = Number(part.dataset.from);
        var only = part.dataset.only ? Number(part.dataset.only) : null;
        var on = only != null ? stage === only : stage >= from;
        part.classList.toggle("is-on", on);
      });

      if (crown) crown.classList.toggle("is-full", stage >= 5);
    }

    function go(i) {
      index = clamp(i, 0, steps.length - 1);
      var step = steps[index];
      var stage = clamp(Number(step.stage) || index + 1, 1, 5);

      /* card content */
      setText("#card-step", "Step " + (index + 1) + " of " + steps.length +
        (step.label ? " · " + step.label : ""));
      setText("#card-title", step.title || "");
      setText("#card-text", step.text || "");

      card.classList.remove("is-swap");
      void card.offsetWidth;
      card.classList.add("is-swap");

      /* plant + labels */
      paintPlant(stage);
      setText(stageLabel, step.label || "Stage " + stage);

      /* progress */
      maxSeen = Math.max(maxSeen, index);
      if (fill) fill.style.width = ((index + 1) / steps.length) * 100 + "%";

      dots.forEach(function (d, di) {
        d.classList.toggle("is-done", di <= maxSeen);
        if (di === index) d.setAttribute("aria-current", "step");
        else d.removeAttribute("aria-current");
      });

      /* buttons */
      var last = index === steps.length - 1;
      prev.disabled = index === 0;
      if (nextLabel) nextLabel.textContent = last ? "Read it again" : "Next";

      /* a little celebration when the tree is fully grown */
      if (last) Confetti.burstFrom(plant, 60);
    }

    next.addEventListener("click", function () {
      if (index === steps.length - 1) go(0);
      else go(index + 1);
    });

    prev.addEventListener("click", function () { go(index - 1); });

    /* arrow-key navigation, because it's nice */
    document.addEventListener("keydown", function (e) {
      if (document.body.classList.contains("is-locked")) return;

      var t = e.target;
      var tag = t && t.tagName ? t.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || (t && t.isContentEditable)) return;

      if (e.key === "ArrowRight") next.click();
      if (e.key === "ArrowLeft" && !prev.disabled) prev.click();
    });

    /* swipe on touch devices */
    var touchX = null;
    card.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    card.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 55) {
        if (dx < 0) next.click();
        else if (!prev.disabled) prev.click();
      }
      touchX = null;
    }, { passive: true });

    go(0);
  }


  /* ==========================================================================
     9. PUN GENERATOR
     ====================================================================== */

  function initPuns() {
    var broc = $("#pun-broc");
    var out = $("#pun-out");
    var btn = $("#pun-btn");
    var count = $("#pun-count");
    var puns = (CFG.broccoliPuns || []).filter(Boolean);

    if (!broc || !out || !puns.length) return;

    var bag = [];
    var last = null;
    var tally = 0;

    /* shuffled bag so puns don't repeat until every one has been seen */
    function refill() {
      bag = puns.slice();
      for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = bag[i]; bag[i] = bag[j]; bag[j] = t;
      }
      if (bag.length > 1 && bag[bag.length - 1] === last) {
        bag.unshift(bag.pop());
      }
    }

    function nextPun() {
      if (!bag.length) refill();
      last = bag.pop();
      return last;
    }

    function fire() {
      out.textContent = nextPun();
      out.classList.remove("is-new");
      void out.offsetWidth;
      out.classList.add("is-new");

      broc.classList.remove("is-pop");
      void broc.offsetWidth;
      broc.classList.add("is-pop");

      Confetti.burstFrom(broc, 80);

   
    }

    broc.addEventListener("click", fire);
    if (btn) btn.addEventListener("click", fire);
  }


  /* ==========================================================================
     10. BACKGROUND MUSIC
     --------------------------------------------------------------------------
     Track URL lives in config.js -> musicUrl
     ====================================================================== */

  var Music = (function () {
    var audio = $("#bgm");
    var fab = $("#audio-fab");
    var ready = false;
    var failed = false;
    var userAsked = false; // only nag about a broken URL if they actually tapped

    function setState(playing) {
      if (!fab) return;
      fab.setAttribute("aria-pressed", String(playing));
      var label = playing ? "Pause background music" : "Play background music";
      fab.setAttribute("aria-label", label);
      fab.title = label + (CFG.musicTitle ? " (" + CFG.musicTitle + ")" : "");
    }

    function init() {
      if (!audio || !fab) return;

      /* no track configured? hide the button entirely. */
      if (!CFG.musicUrl) { fab.hidden = true; return; }

      /* preload stays "none" so a missing file doesn't 404 on page load */
      audio.src = CFG.musicUrl;
      audio.loop = true;
      audio.volume = clamp(Number(CFG.musicVolume) || 0.35, 0, 1);
      ready = true;

      fab.hidden = false;
      setState(false);

      audio.addEventListener("play", function () { setState(true); });
      audio.addEventListener("pause", function () { setState(false); });

      audio.addEventListener("error", function () {
        failed = true;
        setState(false);
        if (userAsked) {
          toast("No track at “" + CFG.musicUrl + "” — update musicUrl in config.js.", 5000);
        }
      });

      fab.addEventListener("click", function () {
        if (!ready) return;
        userAsked = true;

        if (audio.paused) {
          var p = audio.play();
          if (p && p.then) {
            p.then(function () {
              toast("Now playing: " + CFG.musicTitle + " 💚", 2200);
            }).catch(function () {
              if (!failed) toast("Playback was blocked — give it one more tap.", 3200);
            });
          }
        } else {
          audio.pause();
        }
      });
    }

    /* Called right after unlock. The unlock click is a real user gesture, so
       most browsers allow this. If it's blocked (or there's no track yet) we
       stay quiet — the floating button is always there as a fallback. */
    function tryAutoplay() {
      if (!ready || !audio || failed) return;
      var p = audio.play();
      if (p && p.catch) { p.catch(function () { /* silent by design */ }); }
    }

    return { init: init, tryAutoplay: tryAutoplay };
  })();


  /* ==========================================================================
     11. BOOT
     ====================================================================== */

  function boot() {
    if (!window.BIRTHDAY_CONFIG) {
      console.warn("[birthday] config.js did not load — running on defaults.");
    }

    paintContent();
    initGate();
    initJourney();
    initPuns();
    Music.init();

    /* If someone opens the page with reduced motion on, make sure the
       content is visible the moment they unlock. */
    if (REDUCED.matches) initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
