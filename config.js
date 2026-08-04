/* ============================================================================
   config.js — THE ONLY FILE YOU NEED TO EDIT
   ----------------------------------------------------------------------------
   Everything person-specific lives here. Change these values and the whole
   site re-themes itself. You never have to touch index.html / style.css /
   script.js.

   Exposed as a global: window.BIRTHDAY_CONFIG
   ========================================================================= */

window.BIRTHDAY_CONFIG = {
  /* ==========================================================
     1. THE LOCK SCREEN
     ========================================================== */

  // The password required to unlock the site.
  sitePassword: "tenaugust",

  // false = "OURSPECIALDATE" and "ourspecialdate" both work (friendlier on phones).
  passwordCaseSensitive: false,

  // Shown under the input as a permanent, gentle nudge.
  passwordHint: "Hint: it's the your day",

  // Playful, loving messages cycled through on a wrong attempt.
  wrongPasswordMessages: [
    "Nope! But you're still the cutest person trying 💚",
    "Wrong one, sprout. Try again — I believe in you 🥦",
    "So close! My heart says try once more 💗",
    "That's not it… but I'd unlock every door for you anyway 🔓",
  ],

  // Revealed after this many failed attempts (set to 0 to disable).
  hintAfterAttempts: 3,
  strongHint: "Okay okay — it's our your birthday date + month 🥰",

  /* ==========================================================
     2. WHO THIS IS FOR
     ========================================================== */

  birthdayPersonName: "Vaishnavi",
  relationshipNickname: "Broccoli",

  // Shown small, right below the nickname. Keep it short and sweet.
  heroTagline: "",

  /* ==========================================================
     3. THE BIG MESSAGE
     ========================================================== */

  // Use \n\n to break paragraphs. Emojis welcome.
  mainRomanticMessage: `Happy birthday, Vaishnavi !!!`,

  // Signed at the bottom of the letter.
  letterSignature: "From 🥊",
  letterSignatureName: "RB",

  /* ==========================================================
     4. THE COUNTDOWN / "COUNT-UP" TIMER
     ========================================================== */

  // The day the joy officially started. Format: "YYYY-MM-DDTHH:MM:SS"
  specialDate: "2026-08-10T19:30:00",

  specialDateText:
    "Its Your Birthday",

  /* ==========================================================
     5. THE GROWTH JOURNEY (interactive card deck)
     ----------------------------------------------------------
     Add or remove cards freely — the plant illustration and the
     progress bar adapt automatically to however many you have.
     `stage` (1–5) picks how grown the broccoli looks on that card.
     ========================================================== */

  journeyTitle: "How We Grew",
  journeySubtitle: "From one shy little seed to a whole leafy forest of us.",

  journeySteps: [
    {
      stage: 1,
      label: "The Seed",
      title: "The day I noticed you",
      text: "You laughed at something that wasn't even funny, and I thought: oh no. Oh no, this is going to matter.",
    },
    {
      stage: 2,
      label: "The Sprout",
      title: "Our first real conversation",
      text: "Three hours felt like eleven minutes. I went home and grinned at my ceiling like an absolute fool.",
    },
    {
      stage: 3,
      label: "The Leaves",
      title: "The inside jokes era",
      text: "Now we have a secret language nobody else speaks. Nine words and one look and we're both crying with laughter.",
    },
    {
      stage: 4,
      label: "The Bloom",
      title: "The hard week you stayed",
      text: "You didn't try to fix me. You just sat there and refused to leave. That's when I knew this was the real thing.",
    },
    {
      stage: 5,
      label: "The Whole Tree",
      title: "Today, and everything after",
      text: "Look how tall we got. And honestly? I think we're still just getting started, my favorite veggie.",
    },
  ],

  /* ==========================================================
     6. THE PUN GENERATOR
     ========================================================== */

  punSectionTitle: "Poke the Broccoli",
  punSectionSubtitle: "Warning: contains dangerously high levels of affection.",
  punButtonLabel: "Tap me again 🥦",

  broccoliPuns: [
    "I'm totally stalks-ing you — romantically, of course.",
    "You look healthy AND beautiful today. Devastating combo.",
    "I love you from my head to-ma-toes, but mostly broccoli-loads.",
    "You're the only one who makes my heart floret.",
    "Lettuce be honest: I'd pick you from the whole garden. Every time.",
    "We're a perfect pear — but greener and way cuter.",
  ],

  /* ==========================================================
     7. BACKGROUND MUSIC
     ----------------------------------------------------------
     SWAP THIS URL for your own romantic track.
     Options:
       • Drop an mp3 next to index.html  ->  "song.mp3"
       • Put it in a folder             ->  "assets/song.mp3"
       • Use any direct https .mp3 link ->  "https://.../song.mp3"
     Leave it as "" and the audio button politely hides itself.
     ========================================================== */

  musicUrl: "assets/song.mp3",
  musicVolume: 0.35, // 0 = silent, 1 = full blast
  musicTitle: "Our song",

  // Try to start the music the instant they unlock the page.
  // (Unlocking is a real click, so browsers usually allow it. If they block
  //  it, nothing breaks — the floating button still works.)
  autoplayMusicOnUnlock: true,

  /* ==========================================================
     8. FINALE + LITTLE THINGS
     ========================================================== */

  finaleHeading: "Happy birthday, my little green miracle.",
  finaleText: "Now go be adorable. I'll be right here, watering us.",
  footerNote: "Made with far too much love (and a suspicious amount of broccoli).",

  // Emojis used for the floating background elements.
  floatingEmojis: ["💚", "🥦", "💗", "🌿", "🤍", "🥦", "💕", "🌱"],
};
