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
    "s8": "Arc: lit · Seat nearby"
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
          "pic": "pics/helmet-head.jpg",
          "right": true
         },
         {
          "text": "The hand screen",
          "say": "A hand screen must be held in one hand. The helmet leaves both hands free.",
          "pic": "pics/hand-screen.jpg",
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
          "pic": "pics/shade-light.jpg",
          "right": true
         },
         {
          "text": "Shade 12 to 14",
          "say": "That is too dark for this current. Shade twelve to fourteen is for above three hundred amperes.",
          "pic": "pics/shade-dark.jpg",
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
          "pic": "pics/shade-light.jpg",
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
          "pic": "pics/shade-dark.jpg",
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
          "pic": "pics/glass-dark.jpg",
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
          "pic": "pics/goggles-clear.jpg",
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
          "pic": "pics/stand-apart.jpg",
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
          "pic": "pics/canvas-screen.jpg",
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
 },
 "hi": {
  "id": "weld-ppe-shade",
  "title": "Safety gear पहनो और सही shade चुनो",
  "kicker": "ITI · Fitter · Welding · Lab",
  "sub": "आओ, मल्लेश को protective gear पहनाते हैं, फिर हर job के लिए सही filter glass चुनते हैं।",
  "guide": "बसवराज अण्णा",
  "guideRole": "Shop owner और welding teacher",
  "ui": {
   "back": "पीछे",
   "mute": "Mute",
   "next": "आगे",
   "step": "Step {n} / {total}",
   "begin": "Lab शुरू करें",
   "sound": "Sound",
   "choose": "",
   "finish": "पूरा करें",
   "listen": "सुनें",
   "replay": "फिर से सुनें",
   "showMe": "दिखाओ",
   "chapter": "Lab",
   "doneTag": "पूरा",
   "notThat": "ये नहीं। {hint}।",
   "chapters": "Steps",
   "readout": {
    "s1": "Gear: कुछ नहीं",
    "s2": "Gear: apron",
    "s3": "Gear: apron, gloves",
    "s4": "Gear: apron, gloves, boots",
    "s5": "Job: thin plate · 80 A",
    "s6": "Job: heavy plate · 350 A",
    "s7": "Weld: ठंडा · Bead पर slag",
    "s8": "Arc: जला हुआ · पास में seat"
   }
  },
  "end": {
   "hub": "Steps",
   "more": "",
   "next": "आगे",
   "again": "फिर से practise करें",
   "clean": "तुमने हर step सही किया।",
   "allDone": "",
   "heading": "शाबाश!",
   "mistakes": "इन्हें फिर से practise करें"
  },
  "chapters": [
   {
    "id": "job",
    "title": "Safety gear पहनो और सही shade चुनो",
    "kind": "Gear और shade",
    "intro": "",
    "done": "मल्लेश ने पूरा gear पहन लिया है, और अब उसे हर current के लिए सही shade और हर खतरे के लिए सही gear पता है।",
    "steps": [
     {
      "id": "s1",
      "title": "Body की protection",
      "view": "bench",
      "setup": [
       "readout:s1"
      ],
      "chips": [
       {
        "at": "apron",
        "text": "Tap करो: Leather apron",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "मल्लेश, सबसे पहले body। Weld से heat, hot spatter और slag उड़ते हैं। Leather apron पहनो।",
        "tap": "apron",
        "alsoOk": [
         "cape"
        ],
        "hint": "Leather apron पर tap करो",
        "miss": {
         "say": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।"
        },
        "ok": {
         "do": [
          "gear:cape:on",
          "readout:s2"
         ],
         "then": [
          "gear:apron:on"
         ],
         "say": "सही। Apron, sleeves वाला cape और leg guard शरीर, बाँहों, गर्दन और छाती को बचाते हैं। Gear ढीला नहीं होना चाहिए।",
         "view": "mallesh"
        },
        "wrong": {
         "gloves": {
          "do": [
           "flash:gloves"
          ],
          "say": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।"
         },
         "boots": {
          "do": [
           "flash:boots"
          ],
          "say": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।"
         },
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।"
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।"
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।"
         }
        }
       }
      ]
     },
     {
      "id": "s2",
      "title": "हाथ",
      "view": "bench",
      "setup": [
       "readout:s2"
      ],
      "chips": [
       {
        "at": "gloves",
        "text": "Tap करो: Leather gloves",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "अब हाथ। इन्हें heat, arc radiation, hot spatter और electric shock से बचाना ज़रूरी है।",
        "tap": "gloves",
        "alsoOk": [],
        "hint": "Leather gloves पर tap करो",
        "miss": {
         "say": "ये gloves नहीं हैं। Leather gloves पर tap करो।"
        },
        "ok": {
         "do": [
          "gear:gloves:on",
          "readout:s3"
         ],
         "then": [],
         "say": "सही। Leather gloves हाथों को shock, arc radiation, heat और hot spatter से बचाते हैं।",
         "view": "mallesh"
        },
        "wrong": {
         "boots": {
          "do": [
           "flash:boots"
          ],
          "say": "ये gloves नहीं हैं। Leather gloves पर tap करो।"
         },
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "ये gloves नहीं हैं। Leather gloves पर tap करो।"
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "ये gloves नहीं हैं। Leather gloves पर tap करो।"
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "ये gloves नहीं हैं। Leather gloves पर tap करो।"
         }
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "पैर",
      "view": "boots",
      "setup": [
       "readout:s3"
      ],
      "chips": [
       {
        "at": "boots",
        "text": "Tap करो: Safety boots",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "अब पैर। Weld से गर्म metal गिरता है, और machine में electric current चलता है।",
        "tap": "boots",
        "alsoOk": [],
        "hint": "Safety boots पर tap करो",
        "miss": {
         "say": "ये safety boots नहीं हैं। Floor पर रखे boots पर tap करो।"
        },
        "ok": {
         "do": [
          "gear:boots:on",
          "readout:s4"
         ],
         "then": [],
         "say": "सही। Safety boots पैर की उँगलियों और टखनों को बचाते हैं, और उनके shock-resistant sole electric shock से बचाते हैं।",
         "view": "mallesh"
        },
        "wrong": {
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "ये safety boots नहीं हैं। Floor पर रखे boots पर tap करो।"
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "ये safety boots नहीं हैं। Floor पर रखे boots पर tap करो।"
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "ये safety boots नहीं हैं। Floor पर रखे boots पर tap करो।"
         }
        }
       }
      ]
     },
     {
      "id": "s4",
      "title": "Helmet या hand screen",
      "view": "bench",
      "setup": [
       "readout:s4"
      ],
      "tasks": [
       {
        "say": "आँखों और चेहरे को arc से बचाने के लिए मल्लेश hand screen या helmet ले सकता है। किससे दोनों हाथ free रहते हैं?",
        "choices": [
         {
          "text": "Helmet, जो सिर पर पहना जाता है",
          "say": "हाँ, सही। Helmet screen सिर पर पहना जाता है, इसलिए welder दोनों हाथों से काम कर सकता है।",
          "pic": "pics/helmet-head.jpg",
          "right": true
         },
         {
          "text": "Hand screen",
          "say": "Hand screen को एक हाथ में पकड़ना पड़ता है। Helmet से दोनों हाथ free रहते हैं।",
          "pic": "pics/hand-screen.jpg",
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
        "say": "मल्लेश helmet पहनता है।",
        "view": "mallesh"
       }
      ]
     },
     {
      "id": "s5",
      "title": "80 amperes के लिए shade",
      "view": "shade",
      "setup": [
       "readout:s5",
       "amps:80",
       "pick:off",
       "lens:off"
      ],
      "tasks": [
       {
        "say": "पहला job एक thin plate पर है, और उसमें eighty amperes चाहिए। Helmet में कौन सा shade लगेगा?",
        "choices": [
         {
          "text": "Shade 8 से 9",
          "say": "हाँ, सही। One hundred amperes तक shade eight to nine लगता है।",
          "pic": "pics/shade-light.jpg",
          "right": true
         },
         {
          "text": "Shade 12 से 14",
          "say": "ये इस current के लिए बहुत dark है। Shade twelve to fourteen, three hundred amperes से ऊपर के लिए होता है।",
          "pic": "pics/shade-dark.jpg",
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
        "say": "जब current one hundred amperes तक हो, तब shade eight to nine लगता है।",
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
      "title": "350 amperes के लिए shade",
      "view": "shade",
      "setup": [
       "readout:s6",
       "amps:350",
       "pick:off",
       "lens:off"
      ],
      "tasks": [
       {
        "say": "अब एक heavy job है जिसमें three hundred and fifty amperes चाहिए। अब helmet में कौन सा shade लगेगा?",
        "choices": [
         {
          "text": "Shade 8 से 9",
          "say": "ये इस current के लिए बहुत हल्का है। Glass welding current के हिसाब से होना चाहिए।",
          "pic": "pics/shade-light.jpg",
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
          "text": "Shade 12 से 14",
          "say": "हाँ, सही। Three hundred amperes से ऊपर shade twelve to fourteen लगता है।",
          "pic": "pics/shade-dark.jpg",
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
        "say": "जब current three hundred amperes से ऊपर हो, तब shade twelve to fourteen लगता है।",
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
      "title": "Slag chip करना",
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
        "say": "काम पूरा होने के बाद एक helper slag को chip करके हटाता है। वो आँखों के लिए क्या पहनेगा?",
        "choices": [
         {
          "text": "गहरा welding glass",
          "say": "नहीं। गहरा glass arc के लिए होता है। Chipping के लिए clear glass वाले plain goggles चाहिए।",
          "pic": "pics/glass-dark.jpg",
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
          "say": "हाँ, सही। Slag chip करते या grinding करते समय plain goggles आँखों को बचाते हैं।",
          "pic": "pics/goggles-clear.jpg",
          "right": true
         }
        ],
        "after": [
         "gear:goggles:on",
         "chip:go"
        ]
       },
       {
        "say": "आँखों के लिए, slag chip करने और grinding में plain goggles लगते हैं।",
        "view": "plate"
       }
      ]
     },
     {
      "id": "s8",
      "title": "आस-पास के लोग",
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
        "say": "एक और trainee arc के पास काम कर रहा है। उसे arc flash से कैसे बचाया जाएगा?",
        "choices": [
         {
          "text": "कुछ नहीं। थोड़ा दूर खड़े हो जाना काफ़ी है",
          "say": "नहीं। Arc की किरणें आस-पास के लोगों तक पहुँचती हैं। Canvas screen या welding booth इस्तेमाल करो।",
          "pic": "pics/stand-apart.jpg",
          "do": [
           "flare:on"
          ],
          "undo": [
           "flare:off"
          ]
         },
         {
          "text": "Portable fireproof canvas screen",
          "say": "हाँ, सही। Portable fireproof canvas screen welding area के पास काम करने वालों को arc flash से बचाती है।",
          "pic": "pics/canvas-screen.jpg",
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
        "say": "आस-पास काम करने वालों को portable fireproof canvas screen बचाती है।",
        "view": "arc"
       }
      ]
     }
    ]
   }
  ]
 }
};
window.WORKBENCH_LANGS = [{"code": "en", "name": "English"}, {"code": "hi", "name": "हिंदी"}];
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
 },
 "hi": {
  "intro": "आओ, मल्लेश को protective gear पहनाते हैं, फिर हर job के लिए सही filter glass चुनते हैं।",
  "s1_say": "मल्लेश, सबसे पहले body। Weld से heat, hot spatter और slag उड़ते हैं। Leather apron पहनो।",
  "s1_ok": "सही। Apron, sleeves वाला cape और leg guard शरीर, बाँहों, गर्दन और छाती को बचाते हैं। Gear ढीला नहीं होना चाहिए।",
  "s1_miss_general": "ये apron नहीं है। Bench पर रखे leather apron पर tap करो।",
  "s2_say": "अब हाथ। इन्हें heat, arc radiation, hot spatter और electric shock से बचाना ज़रूरी है।",
  "s2_ok": "सही। Leather gloves हाथों को shock, arc radiation, heat और hot spatter से बचाते हैं।",
  "s2_miss_general": "ये gloves नहीं हैं। Leather gloves पर tap करो।",
  "s3_say": "अब पैर। Weld से गर्म metal गिरता है, और machine में electric current चलता है।",
  "s3_ok": "सही। Safety boots पैर की उँगलियों और टखनों को बचाते हैं, और उनके shock-resistant sole electric shock से बचाते हैं।",
  "s3_miss_general": "ये safety boots नहीं हैं। Floor पर रखे boots पर tap करो।",
  "s4_say": "आँखों और चेहरे को arc से बचाने के लिए मल्लेश hand screen या helmet ले सकता है। किससे दोनों हाथ free रहते हैं?",
  "s4_ok": "मल्लेश helmet पहनता है।",
  "s4_optA": "हाँ, सही। Helmet screen सिर पर पहना जाता है, इसलिए welder दोनों हाथों से काम कर सकता है।",
  "s4_optB": "Hand screen को एक हाथ में पकड़ना पड़ता है। Helmet से दोनों हाथ free रहते हैं।",
  "s5_say": "पहला job एक thin plate पर है, और उसमें eighty amperes चाहिए। Helmet में कौन सा shade लगेगा?",
  "s5_ok": "जब current one hundred amperes तक हो, तब shade eight to nine लगता है।",
  "s5_optA": "हाँ, सही। One hundred amperes तक shade eight to nine लगता है।",
  "s5_optB": "ये इस current के लिए बहुत dark है। Shade twelve to fourteen, three hundred amperes से ऊपर के लिए होता है।",
  "s6_say": "अब एक heavy job है जिसमें three hundred and fifty amperes चाहिए। अब helmet में कौन सा shade लगेगा?",
  "s6_ok": "जब current three hundred amperes से ऊपर हो, तब shade twelve to fourteen लगता है।",
  "s6_optA": "हाँ, सही। Three hundred amperes से ऊपर shade twelve to fourteen लगता है।",
  "s6_optB": "ये इस current के लिए बहुत हल्का है। Glass welding current के हिसाब से होना चाहिए।",
  "s7_say": "काम पूरा होने के बाद एक helper slag को chip करके हटाता है। वो आँखों के लिए क्या पहनेगा?",
  "s7_ok": "आँखों के लिए, slag chip करने और grinding में plain goggles लगते हैं।",
  "s7_optA": "हाँ, सही। Slag chip करते या grinding करते समय plain goggles आँखों को बचाते हैं।",
  "s7_optB": "नहीं। गहरा glass arc के लिए होता है। Chipping के लिए clear glass वाले plain goggles चाहिए।",
  "s8_say": "एक और trainee arc के पास काम कर रहा है। उसे arc flash से कैसे बचाया जाएगा?",
  "s8_ok": "आस-पास काम करने वालों को portable fireproof canvas screen बचाती है।",
  "s8_optA": "हाँ, सही। Portable fireproof canvas screen welding area के पास काम करने वालों को arc flash से बचाती है।",
  "s8_optB": "नहीं। Arc की किरणें आस-पास के लोगों तक पहुँचती हैं। Canvas screen या welding booth इस्तेमाल करो।",
  "end": "मल्लेश ने पूरा gear पहन लिया है, और अब उसे हर current के लिए सही shade और हर खतरे के लिए सही gear पता है।"
 }
};
window.LAB_UI_HI = {"continue": "आगे बढ़ें", "do_again": "फिर से करें"};
