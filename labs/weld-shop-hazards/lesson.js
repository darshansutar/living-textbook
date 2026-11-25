/* generated from projects/iti-fitter-m4-welding/script_e1.json by build_lab_hazards.py - edit those, not this file */
window.WORKBENCH = {
 "en": {
  "id": "weld-shop-hazards",
  "title": "Make the welding area safe",
  "kicker": "ITI · Fitter · Welding · Lab",
  "sub": "Walk round the welding area with Basavaraj anna and make it safe, one step at a time.",
  "guide": "Basavaraj anna",
  "guideRole": "Welding teacher",
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
    "r1": "Floor: wet · Machine: ON",
    "r2": "Floor: dry · Flammables: near",
    "r3": "Flammables: clear · Stubs: on floor",
    "r4": "Machine: ON · Stubs: in container",
    "r5": "Extinguisher: not placed",
    "r6": "Plate: stopped glowing",
    "r7": "Plate: hot · Unmarked",
    "r8": "Machine: ON · Cable: connected",
    "off": "Machine: OFF · Cable: disconnected"
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
   "mistakes": "Remember these"
  },
  "chapters": [
   {
    "id": "job",
    "title": "Make the welding area safe",
    "kind": "Safety job",
    "intro": "Walk round the welding area with Basavaraj anna and make it safe, one step at a time.",
    "done": "The area is safe. The floor is dry, no flammables are near, stubs are in a container, and hot metal is marked.",
    "steps": [
     {
      "id": "s1",
      "title": "The wet patch",
      "view": "wet",
      "chips": [
       {
        "at": "machine",
        "text": "Welding machine"
       }
      ],
      "setup": [
       "readout:r1"
      ],
      "tasks": [
       {
        "say": "Mallesh, a wet floor is dangerous while arc welding. Find it and fix it.",
        "tap": "wet",
        "hint": "Tap the wet patch by the machine",
        "miss": "That is not the wet place. Look for the puddle near the welding machine.",
        "remember": "Good. The patch is dried. Never stand on a damp or wet place while arc welding.",
        "ok": {
         "do": [
          "wet:off",
          "readout:r2"
         ],
         "say": "Good. The patch is dried. Never stand on a damp or wet place while arc welding."
        }
       }
      ]
     },
     {
      "id": "s2",
      "title": "Cotton waste",
      "view": "bench",
      "chips": [
       {
        "at": "bench",
        "text": "Bench"
       },
       {
        "at": "plate",
        "text": "Steel plate"
       }
      ],
      "setup": [
       "readout:r2"
      ],
      "tasks": [
       {
        "say": "Sparks and hot metal can start a fire. Remove anything that can burn.",
        "tap": "waste",
        "hint": "Tap the cotton waste beside the bench",
        "miss": "That will not burn easily. Find the cotton waste by the bench.",
        "remember": "Good. Cotton, oil and petrol must be removed from the vicinity of welding.",
        "ok": {
         "do": [
          "waste:off",
          "readout:r3"
         ],
         "say": "Good. Cotton, oil and petrol must be removed from the vicinity of welding."
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "Electrode stubs",
      "view": "stubs",
      "chips": [
       {
        "at": "bin",
        "text": "Steel bin"
       }
      ],
      "setup": [
       "readout:r3"
      ],
      "tasks": [
       {
        "say": "Hot electrode stubs on the floor are dangerous. Where should they go?",
        "tap": "stubs",
        "hint": "Tap the stubs on the floor",
        "miss": "Look at the floor near the machine for the short hot electrode stubs.",
        "remember": "Good. Stubs go into a container, never on the floor.",
        "ok": {
         "do": [
          "stubs:bin",
          "readout:r4"
         ],
         "say": "Good. Stubs go into a container, never on the floor."
        }
       }
      ]
     },
     {
      "id": "s4",
      "title": "Who may weld",
      "view": "machine",
      "chips": [
       {
        "at": "machine",
        "text": "Welding machine"
       },
       {
        "at": "trainee",
        "text": "Trainee"
       }
      ],
      "setup": [
       "readout:r4",
       "trainee:on"
      ],
      "tasks": [
       {
        "say": "A passing trainee wants to try the welding machine. Who may use it?",
        "choices": [
         {
          "text": "Only an authorised person",
          "say": "Yes. Do not permit unauthorised persons to use welding or cutting equipment.",
          "right": true
         },
         {
          "text": "Any trainee who asks",
          "say": "No. Unauthorised persons must not use welding or cutting equipment.",
          "do": [
           "spark:on"
          ],
          "undo": [
           "spark:off"
          ],
          "remember": "Only authorised persons may use welding and cutting equipment."
         }
        ],
        "after": [
         "readout:r5"
        ]
       },
       {
        "say": "Only authorised persons may use welding and cutting equipment."
       }
      ]
     },
     {
      "id": "s5",
      "title": "Fire extinguisher",
      "view": "bench",
      "chips": [
       {
        "at": "bench",
        "text": "Bench"
       }
      ],
      "setup": [
       "readout:r5",
       "trainee:off"
      ],
      "tasks": [
       {
        "say": "Where should the fire extinguisher stay while welding is on?",
        "choices": [
         {
          "text": "Nearby, in working condition",
          "say": "Yes. Keep a suitable fire extinguisher nearby at all times, and make sure it works.",
          "right": true
         },
         {
          "text": "In the store room, where it is safe",
          "say": "No. If a fire starts it must be at hand, not in the store.",
          "do": [
           "ext:store",
           "fire:on"
          ],
          "undo": [
           "ext:off",
           "fire:off"
          ],
          "remember": "A suitable extinguisher stays nearby, in working condition."
         }
        ],
        "after": [
         "ext:near",
         "readout:r6"
        ]
       },
       {
        "say": "A suitable extinguisher stays nearby, in working condition."
       }
      ]
     },
     {
      "id": "s6",
      "title": "After the weld",
      "view": "plate",
      "chips": [
       {
        "at": "plate",
        "text": "Steel plate"
       }
      ],
      "setup": [
       "readout:r6"
      ],
      "tasks": [
       {
        "say": "The weld is finished and the plate has stopped glowing. Is it safe to touch?",
        "choices": [
         {
          "text": "Yes, it has stopped glowing",
          "say": "Many of you said it is safe. Let us see.",
          "right": true,
          "reveal": "Hot metal does not always glow. Use tongs, and mark hot metal after welding."
         },
         {
          "text": "No, it can still be hot",
          "say": "Many of you said it can still be hot. Let us see.",
          "right": true,
          "reveal": "You were right. Hot metal does not always glow. Use tongs, and mark hot metal after welding."
         }
        ]
       },
       {
        "say": "You were right. Hot metal does not always glow. Use tongs, and mark hot metal after welding.",
        "do": [
         "plate:hot",
         "readout:r7"
        ]
       }
      ]
     },
     {
      "id": "s7",
      "title": "Mark the hot metal",
      "view": "plate",
      "chips": [
       {
        "at": "plate",
        "text": "Hot plate"
       },
       {
        "at": "bench",
        "text": "Bench"
       }
      ],
      "setup": [
       "readout:r7",
       "plate:hot"
      ],
      "tasks": [
       {
        "say": "Mark the hot plate so nobody picks it up. Soapstone is commonly used.",
        "tap": "soap",
        "hint": "Tap the soapstone",
        "miss": "Use the soapstone to mark the plate.",
        "remember": "Good. The hot metal is marked with soapstone.",
        "ok": {
         "do": [
          "mark:on",
          "readout:r8"
         ],
         "say": "Good. The hot metal is marked with soapstone."
        }
       }
      ]
     },
     {
      "id": "s8",
      "title": "Switch off and disconnect",
      "view": "machine",
      "chips": [
       {
        "at": "dial",
        "text": "Gauge"
       },
       {
        "at": "plug",
        "text": "Power plug"
       }
      ],
      "setup": [
       "readout:r8"
      ],
      "tasks": [
       {
        "say": "Last, switch the machine off and disconnect it from the power source.",
        "tap": "switch",
        "hint": "Tap the machine's switch",
        "miss": "That is not the machine's switch. Look for the switch on the welding machine.",
        "remember": "Good. The machine is off and disconnected. Coil the cables and store the holder safely.",
        "ok": {
         "do": [
          "machine:off",
          "readout:off"
         ],
         "say": "Good. The machine is off and disconnected. Coil the cables and store the holder safely.",
         "then": [
          "cord:off"
         ]
        }
       }
      ]
     }
    ]
   }
  ]
 }
};
window.WORKBENCH_LANGS = [{"code": "en", "name": "English"}];
window.LAB_LINES = {
 "en": {
  "intro": "Walk round the welding area with Basavaraj anna and make it safe, one step at a time.",
  "s1_say": "Mallesh, a wet floor is dangerous while arc welding. Find it and fix it.",
  "s1_ok": "Good. The patch is dried. Never stand on a damp or wet place while arc welding.",
  "s1_miss_general": "That is not the wet place. Look for the puddle near the welding machine.",
  "s2_say": "Sparks and hot metal can start a fire. Remove anything that can burn.",
  "s2_ok": "Good. Cotton, oil and petrol must be removed from the vicinity of welding.",
  "s2_miss_general": "That will not burn easily. Find the cotton waste by the bench.",
  "s3_say": "Hot electrode stubs on the floor are dangerous. Where should they go?",
  "s3_ok": "Good. Stubs go into a container, never on the floor.",
  "s3_miss_general": "Look at the floor near the machine for the short hot electrode stubs.",
  "s4_say": "A passing trainee wants to try the welding machine. Who may use it?",
  "s4_ok": "Only authorised persons may use welding and cutting equipment.",
  "s4_optA": "Yes. Do not permit unauthorised persons to use welding or cutting equipment.",
  "s4_optB": "No. Unauthorised persons must not use welding or cutting equipment.",
  "s5_say": "Where should the fire extinguisher stay while welding is on?",
  "s5_ok": "A suitable extinguisher stays nearby, in working condition.",
  "s5_optA": "Yes. Keep a suitable fire extinguisher nearby at all times, and make sure it works.",
  "s5_optB": "No. If a fire starts it must be at hand, not in the store.",
  "s6_say": "The weld is finished and the plate has stopped glowing. Is it safe to touch?",
  "s6_ok": "The class has chosen.",
  "s6_optA": "Many of you said it is safe. Let us see.",
  "s6_optB": "Many of you said it can still be hot. Let us see.",
  "s6_right": "You were right. Hot metal does not always glow. Use tongs, and mark hot metal after welding.",
  "s6_wrong": "Hot metal does not always glow. Use tongs, and mark hot metal after welding.",
  "s7_say": "Mark the hot plate so nobody picks it up. Soapstone is commonly used.",
  "s7_ok": "Good. The hot metal is marked with soapstone.",
  "s7_miss_general": "Use the soapstone to mark the plate.",
  "s8_say": "Last, switch the machine off and disconnect it from the power source.",
  "s8_ok": "Good. The machine is off and disconnected. Coil the cables and store the holder safely.",
  "s8_miss_general": "That is not the machine's switch. Look for the switch on the welding machine.",
  "end": "The area is safe. The floor is dry, no flammables are near, stubs are in a container, and hot metal is marked."
 }
};
