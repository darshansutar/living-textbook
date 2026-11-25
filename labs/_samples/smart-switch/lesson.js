/* SAMPLE (2026-11-25): one chapter cut from labs/smart-switch/lesson.js by scratchpad/gen_ss_lesson.js. Same lines and audio as the original, regrouped into 4 steps. */
window.WORKBENCH = {
 "en": {
  "id": "smart-switch-lt",
  "title": "Wire it, power it, test it",
  "kicker": "ITI · Electrician · Lab",
  "sub": "Connect the four wires, switch the power on, and test both lights from the phone.",
  "guide": "Ravi",
  "guideRole": "Senior electrician",
  "ui": {
   "back": "Back",
   "mute": "Mute",
   "next": "Next",
   "step": "Step {n} of {total}",
   "begin": "Start the job",
   "sound": "Sound",
   "choose": "",
   "finish": "Finish",
   "listen": "Listen",
   "replay": "Hear again",
   "showMe": "Show me",
   "chapter": "The job",
   "doneTag": "Done",
   "notThat": "Not that one. {hint}.",
   "chapters": "Steps",
   "readout": {
    "off": "Power OFF · safe to touch",
    "on": "Danger: power ON",
    "pairing": "Power ON · switch pairing",
    "online": "Power ON · switch online"
   }
  },
  "end": {
   "hub": "Steps",
   "more": "",
   "next": "Next",
   "again": "Practise again",
   "clean": "You did every step right.",
   "allDone": "",
   "heading": "Well done!",
   "mistakes": "Practise these again"
  },
  "chapters": [
   {
    "id": "wire-test",
    "title": "Wire it, power it, test it",
    "kind": "Wiring job",
    "intro": "",
    "done": "The smart switch is ready, Manju. Let Lakshmi madam try the balcony light from her phone.",
    "steps": [
     {
      "id": "a",
      "title": "Feed the switch",
      "view": "terminals",
      "tasks": [
       {
        "say": "The switch has L, N, L1 and L2. L takes incoming power. Which wire goes into L?",
        "tap": "w-red",
        "glow": "t-L",
        "hint": "Tap the wire that goes into L",
        "chips": [
         {
          "at": "t-L",
          "text": "L"
         }
        ],
        "ok": {
         "do": [
          "box:c1"
         ],
         "say": "Yes. The red phase goes into L."
        },
        "wrong": {
         "w-black": {
          "say": "Black is neutral, Manju. It goes into N."
         },
         "w-earth": {
          "say": "Never put green into L. Green is earth and stays for safety."
         }
        },
        "view": "terminals"
       },
       {
        "say": "Now connect the new black neutral wire to N.",
        "tap": "w-black",
        "glow": "t-N",
        "hint": "Tap the black neutral wire",
        "chips": [
         {
          "at": "t-N",
          "text": "N"
         }
        ],
        "ok": {
         "do": [
          "box:c2"
         ]
        },
        "view": "terminals"
       }
      ]
     },
     {
      "id": "b",
      "title": "Connect the lamps",
      "view": "terminals",
      "tasks": [
       {
        "say": "Connect the hall light's yellow wire to L1.",
        "tap": "w-y1",
        "glow": "t-L1",
        "hint": "Tap the hall light's yellow wire",
        "chips": [
         {
          "at": "t-L1",
          "text": "L1"
         },
         {
          "at": "w-y1",
          "text": "Hall"
         },
         {
          "at": "w-y2",
          "side": "right",
          "text": "Balcony"
         }
        ],
        "ok": {
         "do": [
          "box:c3"
         ]
        },
        "view": "terminals"
       },
       {
        "say": "Connect the balcony light's yellow wire to L2.",
        "tap": "w-y2",
        "glow": "t-L2",
        "hint": "Tap the balcony light's yellow wire",
        "chips": [
         {
          "at": "t-L2",
          "text": "L2"
         }
        ],
        "ok": {
         "do": [
          "box:c4"
         ],
         "say": "All four wires are secure."
        },
        "view": "terminals"
       }
      ]
     },
     {
      "id": "c",
      "title": "Power on",
      "view": "mcb",
      "setup": [
       "box:fitted"
      ],
      "chips": [
       {
        "at": "db-main",
        "side": "left",
        "text": "MAIN"
       },
       {
        "at": "db-lights",
        "text": "LIGHTS"
       },
       {
        "at": "db-sockets",
        "side": "right",
        "text": "PLUGS"
       }
      ],
      "tasks": [
       {
        "say": "Fold the wires in and screw the switch on. Then remove the tag and restore both power sources.",
        "tap": "lights",
        "hint": "Tap the lights MCB",
        "ok": {
         "do": [
          "tag:off",
          "lever:lights:on",
          "wifi:blink",
          "readout:pairing"
         ],
         "say": "The switch light is blinking. It has power and is ready for Wi-Fi.",
         "view": "plate"
        }
       }
      ]
     },
     {
      "id": "d",
      "title": "Test by phone",
      "view": "lamps",
      "setup": [
       "wifi:on",
       "readout:online",
       "pad:1:on",
       "bulb:hall:on"
      ],
      "tasks": [
       {
        "say": "Lakshmi madam's phone is on her home Wi-Fi. Turn on the balcony light from the app.",
        "ask": "Smart switch",
        "tap": "app-balcony",
        "hint": "Tap Balcony light in the app",
        "phone": true,
        "toggles": [
         {
          "id": "app-hall",
          "on": true,
          "text": "Hall light"
         },
         {
          "id": "app-balcony",
          "on": false,
          "text": "Balcony light"
         }
        ],
        "ok": {
         "do": [
          "pad:2:on",
          "bulb:balcony:on"
         ],
         "say": "Both lights work, from the wall and from the phone."
        },
        "view": "lamps"
       }
      ]
     }
    ]
   }
  ],
  "prelude": [
   "readout:off",
   "lever:lights:off",
   "bulb:hall:off",
   "tag:on",
   "newN:on",
   "tester:off",
   "box:bare",
   "bench:old:on",
   "bench:smart:off",
   "box:c0"
  ]
 }
};
window.WORKBENCH_LANGS = [{"code":"en","name":"English"}];
window.LAB_LINES = {
 "en": {
  "s6_say": "The switch has L, N, L1 and L2. L takes incoming power. Which wire goes into L?",
  "s6_ok": "Yes. The red phase goes into L.",
  "s6_optA": "Good. Red is the phase wire that brings power in.",
  "s6_optB": "Black is neutral, Manju. It goes into N.",
  "s6_optC": "Never put green into L. Green is earth and stays for safety.",
  "s6_then1": "Now connect the new black neutral wire to N.",
  "s6_then2": "Connect the hall light's yellow wire to L1.",
  "s6_then3": "Connect the balcony light's yellow wire to L2.",
  "s6_then4": "All four wires are secure.",
  "s7_say": "Fold the wires in and screw the switch on. Then remove the tag and restore both power sources.",
  "s7_ok": "The switch light is blinking. It has power and is ready for Wi-Fi.",
  "s8_say": "Lakshmi madam's phone is on her home Wi-Fi. Turn on the balcony light from the app.",
  "s8_ok": "Both lights work, from the wall and from the phone.",
  "end": "The smart switch is ready, Manju. Let Lakshmi madam try the balcony light from her phone.",
  "endhead": "Well done!",
  "miss": "Not that one. Look for the object glowing gold."
 }
};
