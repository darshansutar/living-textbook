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
        "text": "Visitor's helmet"
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
          "pic": "pics/auth-person.jpg",
          "right": true
         },
         {
          "text": "Any trainee who asks",
          "say": "No. Unauthorised persons must not use welding or cutting equipment.",
          "pic": "pics/any-trainee.jpg",
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
          "pic": "pics/ext-nearby.jpg",
          "right": true
         },
         {
          "text": "In the store room, where it is safe",
          "say": "No. If a fire starts it must be at hand, not in the store.",
          "pic": "pics/ext-store.jpg",
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
        "predict": true,
        "choices": [
         {
          "text": "Yes, it has stopped glowing",
          "say": "You said it is safe. Let us see.",
          "pic": "pics/plate-glowless.jpg",
          "right": true,
          "reveal": "Hot metal does not always glow. Use tongs, and mark hot metal after welding."
         },
         {
          "text": "No, it can still be hot",
          "say": "You said it can still be hot. Let us see.",
          "pic": "pics/plate-hot.jpg",
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
 },
 "hi": {
  "id": "weld-shop-hazards",
  "title": "Welding area को safe बनाओ",
  "kicker": "ITI · Fitter · Welding · Lab",
  "sub": "आओ, बसवराज अण्णा के साथ welding area में घूमते हैं और एक-एक step करके उसे safe बनाते हैं।",
  "guide": "बसवराज अण्णा",
  "guideRole": "Welding teacher",
  "ui": {
   "back": "पीछे",
   "mute": "Mute",
   "next": "आगे",
   "step": "Step {n} / {total}",
   "begin": "काम शुरू करें",
   "sound": "Sound",
   "choose": "",
   "finish": "पूरा करें",
   "listen": "सुनें",
   "replay": "फिर से सुनें",
   "showMe": "दिखाओ",
   "chapter": "काम",
   "doneTag": "पूरा",
   "notThat": "ये नहीं। {hint}।",
   "chapters": "Steps",
   "readout": {
    "r1": "Floor: गीला · Machine: ON",
    "r2": "Floor: सूखा · जलने वाली चीज़ें: पास में",
    "r3": "जलने वाली चीज़ें: हटीं · Stubs: floor पर",
    "r4": "Machine: ON · Stubs: container में",
    "r5": "Extinguisher: रखा नहीं",
    "r6": "Plate: चमक बंद",
    "r7": "Plate: गर्म · निशान नहीं",
    "r8": "Machine: ON · Cable: जुड़ी हुई",
    "off": "Machine: OFF · Cable: निकली हुई"
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
   "mistakes": "ये याद रखो"
  },
  "chapters": [
   {
    "id": "job",
    "title": "Welding area को safe बनाओ",
    "kind": "Safety का काम",
    "intro": "आओ, बसवराज अण्णा के साथ welding area में घूमते हैं और एक-एक step करके उसे safe बनाते हैं।",
    "done": "बहुत अच्छे! अब welding area safe है। Floor सूखा है, जलने वाली चीज़ें दूर हैं, stubs container में हैं, और गर्म metal पर निशान लगा है।",
    "steps": [
     {
      "id": "s1",
      "title": "गीला patch",
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
        "say": "मल्लेश, arc welding में गीला floor बहुत खतरनाक होता है। उसे ढूँढो और ठीक करो।",
        "tap": "wet",
        "hint": "Machine के पास वाले गीले patch पर tap करो",
        "miss": "ये गीली जगह नहीं है। Welding machine के पास पानी का puddle ढूँढो।",
        "remember": "सही। Patch सूख गया। Arc welding करते समय कभी गीली या नम जगह पर मत खड़े होना।",
        "ok": {
         "do": [
          "wet:off",
          "readout:r2"
         ],
         "say": "सही। Patch सूख गया। Arc welding करते समय कभी गीली या नम जगह पर मत खड़े होना।"
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
        "say": "चिंगारियों और गर्म metal से आग लग सकती है। जो भी चीज़ जल सकती है, उसे हटा दो।",
        "tap": "waste",
        "hint": "Bench के पास रखे cotton waste पर tap करो",
        "miss": "ये आसानी से नहीं जलेगा। Bench के पास पड़ा cotton waste ढूँढो।",
        "remember": "सही। Cotton, oil और petrol को welding की जगह से दूर रखना चाहिए।",
        "ok": {
         "do": [
          "waste:off",
          "readout:r3"
         ],
         "say": "सही। Cotton, oil और petrol को welding की जगह से दूर रखना चाहिए।"
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
        "say": "Floor पर पड़े गर्म electrode stubs खतरनाक होते हैं। इन्हें कहाँ रखना चाहिए?",
        "tap": "stubs",
        "hint": "Floor पर पड़े stubs पर tap करो",
        "miss": "Machine के पास floor पर छोटे गर्म electrode stubs देखो।",
        "remember": "सही। Stubs को container में डालते हैं, floor पर कभी नहीं।",
        "ok": {
         "do": [
          "stubs:bin",
          "readout:r4"
         ],
         "say": "सही। Stubs को container में डालते हैं, floor पर कभी नहीं।"
        }
       }
      ]
     },
     {
      "id": "s4",
      "title": "Welding कौन कर सकता है",
      "view": "machine",
      "chips": [
       {
        "at": "machine",
        "text": "Welding machine"
       },
       {
        "at": "trainee",
        "text": "Visitor का helmet"
       }
      ],
      "setup": [
       "readout:r4",
       "trainee:on"
      ],
      "tasks": [
       {
        "say": "एक आते-जाते trainee welding machine चलाकर देखना चाहता है। इसे कौन चला सकता है?",
        "choices": [
         {
          "text": "सिर्फ़ authorised person",
          "say": "हाँ, सही। Unauthorised लोगों को welding या cutting equipment चलाने मत दो।",
          "pic": "pics/auth-person.jpg",
          "right": true
         },
         {
          "text": "जो भी trainee माँगे",
          "say": "नहीं, बिल्कुल नहीं। Unauthorised लोग welding या cutting equipment नहीं चला सकते।",
          "pic": "pics/any-trainee.jpg",
          "do": [
           "spark:on"
          ],
          "undo": [
           "spark:off"
          ],
          "remember": "सिर्फ़ authorised लोग ही welding और cutting equipment चला सकते हैं।"
         }
        ],
        "after": [
         "readout:r5"
        ]
       },
       {
        "say": "सिर्फ़ authorised लोग ही welding और cutting equipment चला सकते हैं।"
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
        "say": "जब welding चालू हो, तब fire extinguisher कहाँ रहना चाहिए?",
        "choices": [
         {
          "text": "पास में, working condition में",
          "say": "हाँ, सही। हर समय पास में suitable fire extinguisher रखो, और पक्का करो कि वो काम करता हो।",
          "pic": "pics/ext-nearby.jpg",
          "right": true
         },
         {
          "text": "Store room में, जहाँ वो safe रहे",
          "say": "नहीं। आग लगे तो extinguisher हाथ के पास होना चाहिए, store में नहीं।",
          "pic": "pics/ext-store.jpg",
          "do": [
           "ext:store",
           "fire:on"
          ],
          "undo": [
           "ext:off",
           "fire:off"
          ],
          "remember": "पास में रखा suitable extinguisher हमेशा working condition में होना चाहिए।"
         }
        ],
        "after": [
         "ext:near",
         "readout:r6"
        ]
       },
       {
        "say": "पास में रखा suitable extinguisher हमेशा working condition में होना चाहिए।"
       }
      ]
     },
     {
      "id": "s6",
      "title": "Weld के बाद",
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
        "say": "अब weld पूरा हो गया है और plate चमकना बंद हो गई है। क्या उसे छूना safe है?",
        "predict": true,
        "choices": [
         {
          "text": "हाँ, चमकना बंद हो गया",
          "say": "तुमने कहा कि safe है। चलो देखते हैं।",
          "pic": "pics/plate-glowless.jpg",
          "right": true,
          "reveal": "गर्म metal हमेशा चमकता नहीं है। Tongs इस्तेमाल करो, और welding के बाद गर्म metal पर निशान लगाओ।"
         },
         {
          "text": "नहीं, वो अभी भी गर्म हो सकता है",
          "say": "तुमने कहा कि वो अभी भी गर्म हो सकता है। चलो देखते हैं।",
          "pic": "pics/plate-hot.jpg",
          "right": true,
          "reveal": "तुम सही थे। गर्म metal हमेशा चमकता नहीं है। Tongs इस्तेमाल करो, और welding के बाद गर्म metal पर निशान लगाओ।"
         }
        ]
       },
       {
        "say": "तुम सही थे। गर्म metal हमेशा चमकता नहीं है। Tongs इस्तेमाल करो, और welding के बाद गर्म metal पर निशान लगाओ।",
        "do": [
         "plate:hot",
         "readout:r7"
        ]
       }
      ]
     },
     {
      "id": "s7",
      "title": "गर्म metal पर निशान लगाओ",
      "view": "plate",
      "chips": [
       {
        "at": "plate",
        "text": "गर्म plate"
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
        "say": "गर्म plate पर निशान लगाओ ताकि कोई उसे उठा न ले। इसके लिए आम तौर पर soapstone इस्तेमाल होता है।",
        "tap": "soap",
        "hint": "Soapstone पर tap करो",
        "miss": "Plate पर निशान लगाने के लिए soapstone इस्तेमाल करो।",
        "remember": "सही। गर्म metal पर soapstone से निशान लग गया।",
        "ok": {
         "do": [
          "mark:on",
          "readout:r8"
         ],
         "say": "सही। गर्म metal पर soapstone से निशान लग गया।"
        }
       }
      ]
     },
     {
      "id": "s8",
      "title": "Switch off और disconnect करो",
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
        "say": "आख़िर में machine को switch off करो और power source से disconnect कर दो।",
        "tap": "switch",
        "hint": "Machine के switch पर tap करो",
        "miss": "ये machine का switch नहीं है। Welding machine पर switch ढूँढो।",
        "remember": "सही। Machine off हो गई और disconnect भी। Cables को लपेटो और electrode holder को safe जगह रखो।",
        "ok": {
         "do": [
          "machine:off",
          "readout:off"
         ],
         "say": "सही। Machine off हो गई और disconnect भी। Cables को लपेटो और electrode holder को safe जगह रखो।",
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
window.WORKBENCH_LANGS = [{"code": "en", "name": "English"}, {"code": "hi", "name": "हिंदी"}];
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
  "s6_ok": "You have chosen.",
  "s6_optA": "You said it is safe. Let us see.",
  "s6_optB": "You said it can still be hot. Let us see.",
  "s6_right": "You were right. Hot metal does not always glow. Use tongs, and mark hot metal after welding.",
  "s6_wrong": "Hot metal does not always glow. Use tongs, and mark hot metal after welding.",
  "s7_say": "Mark the hot plate so nobody picks it up. Soapstone is commonly used.",
  "s7_ok": "Good. The hot metal is marked with soapstone.",
  "s7_miss_general": "Use the soapstone to mark the plate.",
  "s8_say": "Last, switch the machine off and disconnect it from the power source.",
  "s8_ok": "Good. The machine is off and disconnected. Coil the cables and store the holder safely.",
  "s8_miss_general": "That is not the machine's switch. Look for the switch on the welding machine.",
  "end": "The area is safe. The floor is dry, no flammables are near, stubs are in a container, and hot metal is marked."
 },
 "hi": {
  "intro": "आओ, बसवराज अण्णा के साथ welding area में घूमते हैं और एक-एक step करके उसे safe बनाते हैं।",
  "s1_say": "मल्लेश, arc welding में गीला floor बहुत खतरनाक होता है। उसे ढूँढो और ठीक करो।",
  "s1_ok": "सही। Patch सूख गया। Arc welding करते समय कभी गीली या नम जगह पर मत खड़े होना।",
  "s1_miss_general": "ये गीली जगह नहीं है। Welding machine के पास पानी का puddle ढूँढो।",
  "s2_say": "चिंगारियों और गर्म metal से आग लग सकती है। जो भी चीज़ जल सकती है, उसे हटा दो।",
  "s2_ok": "सही। Cotton, oil और petrol को welding की जगह से दूर रखना चाहिए।",
  "s2_miss_general": "ये आसानी से नहीं जलेगा। Bench के पास पड़ा cotton waste ढूँढो।",
  "s3_say": "Floor पर पड़े गर्म electrode stubs खतरनाक होते हैं। इन्हें कहाँ रखना चाहिए?",
  "s3_ok": "सही। Stubs को container में डालते हैं, floor पर कभी नहीं।",
  "s3_miss_general": "Machine के पास floor पर छोटे गर्म electrode stubs देखो।",
  "s4_say": "एक आते-जाते trainee welding machine चलाकर देखना चाहता है। इसे कौन चला सकता है?",
  "s4_ok": "सिर्फ़ authorised लोग ही welding और cutting equipment चला सकते हैं।",
  "s4_optA": "हाँ, सही। Unauthorised लोगों को welding या cutting equipment चलाने मत दो।",
  "s4_optB": "नहीं, बिल्कुल नहीं। Unauthorised लोग welding या cutting equipment नहीं चला सकते।",
  "s5_say": "जब welding चालू हो, तब fire extinguisher कहाँ रहना चाहिए?",
  "s5_ok": "पास में रखा suitable extinguisher हमेशा working condition में होना चाहिए।",
  "s5_optA": "हाँ, सही। हर समय पास में suitable fire extinguisher रखो, और पक्का करो कि वो काम करता हो।",
  "s5_optB": "नहीं। आग लगे तो extinguisher हाथ के पास होना चाहिए, store में नहीं।",
  "s6_say": "अब weld पूरा हो गया है और plate चमकना बंद हो गई है। क्या उसे छूना safe है?",
  "s6_ok": "तुमने अपना जवाब चुन लिया।",
  "s6_optA": "तुमने कहा कि safe है। चलो देखते हैं।",
  "s6_optB": "तुमने कहा कि वो अभी भी गर्म हो सकता है। चलो देखते हैं।",
  "s6_right": "तुम सही थे। गर्म metal हमेशा चमकता नहीं है। Tongs इस्तेमाल करो, और welding के बाद गर्म metal पर निशान लगाओ।",
  "s6_wrong": "गर्म metal हमेशा चमकता नहीं है। Tongs इस्तेमाल करो, और welding के बाद गर्म metal पर निशान लगाओ।",
  "s7_say": "गर्म plate पर निशान लगाओ ताकि कोई उसे उठा न ले। इसके लिए आम तौर पर soapstone इस्तेमाल होता है।",
  "s7_ok": "सही। गर्म metal पर soapstone से निशान लग गया।",
  "s7_miss_general": "Plate पर निशान लगाने के लिए soapstone इस्तेमाल करो।",
  "s8_say": "आख़िर में machine को switch off करो और power source से disconnect कर दो।",
  "s8_ok": "सही। Machine off हो गई और disconnect भी। Cables को लपेटो और electrode holder को safe जगह रखो।",
  "s8_miss_general": "ये machine का switch नहीं है। Welding machine पर switch ढूँढो।",
  "end": "बहुत अच्छे! अब welding area safe है। Floor सूखा है, जलने वाली चीज़ें दूर हैं, stubs container में हैं, और गर्म metal पर निशान लगा है।"
 }
};
window.LAB_UI_HI = {"continue": "आगे बढ़ें", "do_again": "फिर से करें"};
