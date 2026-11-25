/* generated from projects/iti-fitter-m4-welding/script_e1.json by build_lab_ppe.py - edit those, not this file */
window.WORKBENCH = {
 "en": {
  "id": "weld-ppe-shade",
  "title": "Suit up and choose the shade",
  "kicker": "ITI · Fitter · Welding lab",
  "sub": "Help Mallesh put on his protective gear, then choose the right filter glass for each job.",
  "guide": "Basavaraj anna",
  "guideRole": "Shop owner and welding teacher",
  "ui": {
   "back": "Back",
   "mute": "Mute",
   "next": "Next",
   "step": "Step {n} of {total}",
   "begin": "Start the lab",
   "sound": "Sound",
   "choose": "",
   "finish": "Finish",
   "listen": "Listen",
   "replay": "Hear again",
   "showMe": "Show me",
   "chapter": "The lab",
   "doneTag": "Done",
   "notThat": "Not that one. {hint}.",
   "chapters": "Steps",
   "readout": {
    "s1": "Gear: none",
    "s2": "Gear: apron",
    "s3": "Gear: apron, gloves",
    "s4": "Gear: apron, gloves, boots",
    "s5": "Job: thin plate · 80 A",
    "s6": "Job: heavy plate · 350 A",
    "s7": "Weld: cooled · Slag on bead",
    "s8": "Arc: lit · A trainee nearby"
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
    "id": "job",
    "title": "Suit up and choose the shade",
    "kind": "Gear and shade",
    "intro": "",
    "done": "Mallesh is suited up, and he knows the shade for each current and the gear for each hazard.",
    "steps": [
     {
      "id": "s1",
      "title": "Body protection",
      "view": "bench",
      "setup": [
       "readout:s1"
      ],
      "chips": [
       {
        "at": "apron",
        "text": "Tap: Leather apron",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "Mallesh, first the body. Heat, hot spatter and slag fly from the weld. Put on the leather apron.",
        "tap": "apron",
        "alsoOk": [
         "cape"
        ],
        "hint": "Tap the leather apron",
        "miss": {
         "say": "That is not the apron. Tap the leather apron on the bench."
        },
        "ok": {
         "do": [
          "gear:cape:on",
          "readout:s2"
         ],
         "then": [
          "gear:apron:on"
         ],
         "say": "Good. The apron, cape with sleeves and leg guard protect the body, arms, neck and chest. Gear must not be loose.",
         "view": "mallesh"
        },
        "wrong": {
         "gloves": {
          "do": [
           "flash:gloves"
          ],
          "say": "That is not the apron. Tap the leather apron on the bench."
         },
         "boots": {
          "do": [
           "flash:boots"
          ],
          "say": "That is not the apron. Tap the leather apron on the bench."
         },
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "That is not the apron. Tap the leather apron on the bench."
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "That is not the apron. Tap the leather apron on the bench."
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "That is not the apron. Tap the leather apron on the bench."
         }
        }
       }
      ]
     },
     {
      "id": "s2",
      "title": "Hands",
      "view": "bench",
      "setup": [
       "readout:s2"
      ],
      "chips": [
       {
        "at": "gloves",
        "text": "Tap: Leather gloves",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "Now the hands. They need protection from heat, arc radiation, hot spatter and electric shock.",
        "tap": "gloves",
        "alsoOk": [],
        "hint": "Tap the leather gloves",
        "miss": {
         "say": "Those are not gloves. Tap the leather gloves."
        },
        "ok": {
         "do": [
          "gear:gloves:on",
          "readout:s3"
         ],
         "then": [],
         "say": "Good. Leather gloves protect the hands from shock, arc radiation, heat and hot spatter.",
         "view": "mallesh"
        },
        "wrong": {
         "boots": {
          "do": [
           "flash:boots"
          ],
          "say": "Those are not gloves. Tap the leather gloves."
         },
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "Those are not gloves. Tap the leather gloves."
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "Those are not gloves. Tap the leather gloves."
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "Those are not gloves. Tap the leather gloves."
         }
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "Feet",
      "view": "boots",
      "setup": [
       "readout:s3"
      ],
      "chips": [
       {
        "at": "boots",
        "text": "Tap: Safety boots",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "Now the feet. The weld drops hot metal, and the machine carries electric current.",
        "tap": "boots",
        "alsoOk": [],
        "hint": "Tap the safety boots",
        "miss": {
         "say": "Those are not the safety boots. Tap the boots on the floor."
        },
        "ok": {
         "do": [
          "gear:boots:on",
          "readout:s4"
         ],
         "then": [],
         "say": "Good. Safety boots protect toes and ankles, and their shock-resistant soles protect against electric shock.",
         "view": "mallesh"
        },
        "wrong": {
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "Those are not the safety boots. Tap the boots on the floor."
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "Those are not the safety boots. Tap the boots on the floor."
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "Those are not the safety boots. Tap the boots on the floor."
         }
        }
       }
      ]
     },
     {
      "id": "s4",
      "title": "Helmet or hand screen",
      "view": "bench",
      "setup": [
       "readout:s4"
      ],
      "tasks": [
       {
        "say": "To protect eyes and face from the arc, Mallesh can use a hand screen or a helmet. Which keeps both hands free?",
        "choices": [
         {
          "text": "The helmet, worn on the head",
          "say": "Yes. A helmet screen is worn on the head, so the welder can use both hands.",
          "right": true
         },
         {
          "text": "The hand screen",
          "say": "A hand screen must be held in one hand. The helmet leaves both hands free.",
          "do": [
           "cam:mallesh",
           "screen:hold"
          ],
          "undo": [
           "screen:drop",
           "cam:bench"
          ]
         }
        ],
        "after": [
         "cam:mallesh",
         "gear:helmet:on"
        ]
       },
       {
        "say": "Mallesh wears the helmet.",
        "view": "mallesh"
       }
      ]
     },
     {
      "id": "s5",
      "title": "Shade for 80 amperes",
      "view": "shade",
      "setup": [
       "readout:s5",
       "amps:80",
       "pick:off",
       "lens:off"
      ],
      "tasks": [
       {
        "say": "The first job on a thin plate needs eighty amperes. Which shade goes in the helmet?",
        "choices": [
         {
          "text": "Shade 8 to 9",
          "say": "Yes. Up to one hundred amperes, use shade eight to nine.",
          "right": true
         },
         {
          "text": "Shade 12 to 14",
          "say": "That is too dark for this current. Shade twelve to fourteen is for above three hundred amperes.",
          "do": [
           "pick:p13",
           "lens:dark",
           "cam:helm"
          ],
          "undo": [
           "pick:off",
           "lens:off",
           "cam:shade"
          ]
         }
        ],
        "after": [
         "pick:p9",
         "lens:ok",
         "cam:helm"
        ]
       },
       {
        "say": "Shade eight to nine is for currents up to one hundred amperes.",
        "view": "helm"
       }
      ],
      "chips": [
       {
        "at": "dial",
        "text": "80 A"
       },
       {
        "at": "p9",
        "text": "8-9"
       },
       {
        "at": "p11",
        "text": "10-11"
       },
       {
        "at": "p13",
        "text": "12-14"
       }
      ]
     },
     {
      "id": "s6",
      "title": "Shade for 350 amperes",
      "view": "shade",
      "setup": [
       "readout:s6",
       "amps:350",
       "pick:off",
       "lens:off"
      ],
      "tasks": [
       {
        "say": "A heavy job needs three hundred and fifty amperes. Which shade goes in the helmet now?",
        "choices": [
         {
          "text": "Shade 8 to 9",
          "say": "That is too light for this current. The glass must match the welding current.",
          "do": [
           "pick:p9",
           "lens:glare",
           "cam:helm"
          ],
          "undo": [
           "pick:off",
           "lens:off",
           "cam:shade"
          ]
         },
         {
          "text": "Shade 12 to 14",
          "say": "Yes. Above three hundred amperes, use shade twelve to fourteen.",
          "right": true
         }
        ],
        "after": [
         "pick:p13",
         "lens:ok",
         "cam:helm"
        ]
       },
       {
        "say": "Above three hundred amperes, use shade twelve to fourteen.",
        "view": "helm"
       }
      ],
      "chips": [
       {
        "at": "dial",
        "text": "350 A"
       },
       {
        "at": "p9",
        "text": "8-9"
       },
       {
        "at": "p11",
        "text": "10-11"
       },
       {
        "at": "p13",
        "text": "12-14"
       }
      ]
     },
     {
      "id": "s7",
      "title": "Chipping the slag",
      "view": "plate",
      "setup": [
       "readout:s7",
       "cam:plate",
       "station:off",
       "mallesh:bench",
       "screen:away",
       "amps:0",
       "pick:off",
       "lens:off",
       "helmet:up",
       "plate:on"
      ],
      "tasks": [
       {
        "say": "After the weld, a helper chips the slag off. Which eye protection does he wear?",
        "choices": [
         {
          "text": "The dark welding glass",
          "say": "No. The dark glass is for the arc. Chipping needs plain goggles with clear glass.",
          "do": [
           "helmet:down",
           "lens:dark"
          ],
          "undo": [
           "helmet:up",
           "lens:off"
          ]
         },
         {
          "text": "Plain chipping goggles",
          "say": "Yes. Plain goggles protect the eyes while chipping slag or grinding.",
          "right": true
         }
        ],
        "after": [
         "gear:goggles:on",
         "chip:go"
        ]
       },
       {
        "say": "Plain goggles are for chipping slag and for grinding.",
        "view": "plate"
       }
      ]
     },
     {
      "id": "s8",
      "title": "People nearby",
      "view": "arc",
      "setup": [
       "readout:s8",
       "cam:arc",
       "chip:off",
       "gear:goggles:off",
       "helmet:down",
       "lens:ok",
       "arc:on",
       "trainee:on",
       "rays:reach"
      ],
      "tasks": [
       {
        "say": "Another trainee works close to the arc. How is he protected from arc flash?",
        "choices": [
         {
          "text": "Nothing. Standing a little apart is enough",
          "say": "No. Arc rays reach people nearby. Use a canvas screen or a welding booth.",
          "do": [
           "flare:on"
          ],
          "undo": [
           "flare:off"
          ]
         },
         {
          "text": "A portable fireproof canvas screen",
          "say": "Yes. Portable fireproof canvas screens protect persons working near the welding area from arc flashes.",
          "right": true
         }
        ],
        "after": [
         "canvas:on",
         "rays:blocked",
         "flare:off"
        ]
       },
       {
        "say": "A portable fireproof canvas screen protects those working near the weld.",
        "view": "arc"
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
  "intro": "Help Mallesh put on his protective gear, then choose the right filter glass for each job.",
  "s1_say": "Mallesh, first the body. Heat, hot spatter and slag fly from the weld. Put on the leather apron.",
  "s1_ok": "Good. The apron, cape with sleeves and leg guard protect the body, arms, neck and chest. Gear must not be loose.",
  "s1_miss_general": "That is not the apron. Tap the leather apron on the bench.",
  "s2_say": "Now the hands. They need protection from heat, arc radiation, hot spatter and electric shock.",
  "s2_ok": "Good. Leather gloves protect the hands from shock, arc radiation, heat and hot spatter.",
  "s2_miss_general": "Those are not gloves. Tap the leather gloves.",
  "s3_say": "Now the feet. The weld drops hot metal, and the machine carries electric current.",
  "s3_ok": "Good. Safety boots protect toes and ankles, and their shock-resistant soles protect against electric shock.",
  "s3_miss_general": "Those are not the safety boots. Tap the boots on the floor.",
  "s4_say": "To protect eyes and face from the arc, Mallesh can use a hand screen or a helmet. Which keeps both hands free?",
  "s4_ok": "Mallesh wears the helmet.",
  "s4_optA": "Yes. A helmet screen is worn on the head, so the welder can use both hands.",
  "s4_optB": "A hand screen must be held in one hand. The helmet leaves both hands free.",
  "s5_say": "The first job on a thin plate needs eighty amperes. Which shade goes in the helmet?",
  "s5_ok": "Shade eight to nine is for currents up to one hundred amperes.",
  "s5_optA": "Yes. Up to one hundred amperes, use shade eight to nine.",
  "s5_optB": "That is too dark for this current. Shade twelve to fourteen is for above three hundred amperes.",
  "s6_say": "A heavy job needs three hundred and fifty amperes. Which shade goes in the helmet now?",
  "s6_ok": "Above three hundred amperes, use shade twelve to fourteen.",
  "s6_optA": "Yes. Above three hundred amperes, use shade twelve to fourteen.",
  "s6_optB": "That is too light for this current. The glass must match the welding current.",
  "s7_say": "After the weld, a helper chips the slag off. Which eye protection does he wear?",
  "s7_ok": "Plain goggles are for chipping slag and for grinding.",
  "s7_optA": "Yes. Plain goggles protect the eyes while chipping slag or grinding.",
  "s7_optB": "No. The dark glass is for the arc. Chipping needs plain goggles with clear glass.",
  "s8_say": "Another trainee works close to the arc. How is he protected from arc flash?",
  "s8_ok": "A portable fireproof canvas screen protects those working near the weld.",
  "s8_optA": "Yes. Portable fireproof canvas screens protect persons working near the welding area from arc flashes.",
  "s8_optB": "No. Arc rays reach people nearby. Use a canvas screen or a welding booth.",
  "end": "Mallesh is suited up, and he knows the shade for each current and the gear for each hazard."
 }
};
window.LAB_UI_HI = {};
