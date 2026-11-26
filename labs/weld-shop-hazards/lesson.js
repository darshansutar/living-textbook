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
  "title": "वेल्डिंग की जगह को सुरक्षित बनाओ",
  "kicker": "आईटीआई · फ़िटर · वेल्डिंग · लैब",
  "sub": "आओ, बसवराज अण्णा के साथ वेल्डिंग की जगह में घूमते हैं और एक-एक चरण करके उसे सुरक्षित बनाते हैं।",
  "guide": "बसवराज अण्णा",
  "guideRole": "वेल्डिंग शिक्षक",
  "ui": {
   "back": "पीछे",
   "mute": "आवाज़ बंद",
   "next": "आगे",
   "step": "चरण {n} / {total}",
   "begin": "काम शुरू करें",
   "sound": "आवाज़",
   "choose": "",
   "finish": "पूरा करें",
   "listen": "सुनें",
   "replay": "फिर से सुनें",
   "showMe": "दिखाइए",
   "chapter": "काम",
   "doneTag": "पूरा",
   "notThat": "यह नहीं। {hint}।",
   "chapters": "चरण",
   "readout": {
    "r1": "फ़र्श: गीला · मशीन: चालू",
    "r2": "फ़र्श: सूखा · जलने वाली चीज़ें: पास में",
    "r3": "जलने वाली चीज़ें: हटीं · टुकड़े: फ़र्श पर",
    "r4": "मशीन: चालू · टुकड़े: डिब्बे में",
    "r5": "अग्निशामक: रखा नहीं",
    "r6": "प्लेट: चमक बंद",
    "r7": "प्लेट: गर्म · निशान नहीं",
    "r8": "मशीन: चालू · केबल: जुड़ी",
    "off": "मशीन: बंद · केबल: निकली हुई"
   }
  },
  "end": {
   "hub": "चरण",
   "more": "",
   "next": "आगे",
   "again": "फिर से अभ्यास करें",
   "clean": "आपने हर चरण सही किया।",
   "allDone": "",
   "heading": "शाबाश!",
   "mistakes": "इन्हें याद रखें"
  },
  "chapters": [
   {
    "id": "job",
    "title": "वेल्डिंग की जगह को सुरक्षित बनाओ",
    "kind": "सुरक्षा का काम",
    "intro": "आओ, बसवराज अण्णा के साथ वेल्डिंग की जगह में घूमते हैं और एक-एक चरण करके उसे सुरक्षित बनाते हैं।",
    "done": "बहुत अच्छे! अब वेल्डिंग की जगह सुरक्षित है। फ़र्श सूखा है, जलने वाली चीज़ें दूर हैं, इलेक्ट्रोड के टुकड़े डिब्बे में हैं, और गर्म धातु पर निशान लगा है।",
    "steps": [
     {
      "id": "s1",
      "title": "गीला हिस्सा",
      "view": "wet",
      "chips": [
       {
        "at": "machine",
        "text": "वेल्डिंग मशीन"
       }
      ],
      "setup": [
       "readout:r1"
      ],
      "tasks": [
       {
        "say": "मल्लेश, आर्क वेल्डिंग में गीला फ़र्श बहुत ख़तरनाक होता है। उसे ढूँढो और ठीक करो।",
        "tap": "wet",
        "hint": "मशीन के पास वाले गीले हिस्से पर टैप करो",
        "miss": "यह गीली जगह नहीं है। वेल्डिंग मशीन के पास पानी का गड्ढा ढूँढो।",
        "remember": "सही। हिस्सा सूख गया। आर्क वेल्डिंग करते समय कभी गीली या नम जगह पर मत खड़े होना।",
        "ok": {
         "do": [
          "wet:off",
          "readout:r2"
         ],
         "say": "सही। हिस्सा सूख गया। आर्क वेल्डिंग करते समय कभी गीली या नम जगह पर मत खड़े होना।"
        }
       }
      ]
     },
     {
      "id": "s2",
      "title": "सूती कचरा",
      "view": "bench",
      "chips": [
       {
        "at": "bench",
        "text": "बेंच"
       },
       {
        "at": "plate",
        "text": "स्टील प्लेट"
       }
      ],
      "setup": [
       "readout:r2"
      ],
      "tasks": [
       {
        "say": "चिंगारियों और गर्म धातु से आग लग सकती है। जो भी चीज़ जल सकती है, उसे हटा दो।",
        "tap": "waste",
        "hint": "बेंच के पास रखे सूती कचरे पर टैप करो",
        "miss": "यह आसानी से नहीं जलेगा। बेंच के पास पड़ा सूती कचरा ढूँढो।",
        "remember": "सही। सूती कचरा, तेल और पेट्रोल को वेल्डिंग की जगह से दूर रखना चाहिए।",
        "ok": {
         "do": [
          "waste:off",
          "readout:r3"
         ],
         "say": "सही। सूती कचरा, तेल और पेट्रोल को वेल्डिंग की जगह से दूर रखना चाहिए।"
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "इलेक्ट्रोड के टुकड़े",
      "view": "stubs",
      "chips": [
       {
        "at": "bin",
        "text": "स्टील का डिब्बा"
       }
      ],
      "setup": [
       "readout:r3"
      ],
      "tasks": [
       {
        "say": "फ़र्श पर पड़े गर्म इलेक्ट्रोड के टुकड़े ख़तरनाक होते हैं। इन्हें कहाँ रखना चाहिए?",
        "tap": "stubs",
        "hint": "फ़र्श पर पड़े टुकड़ों पर टैप करो",
        "miss": "मशीन के पास फ़र्श पर छोटे गर्म इलेक्ट्रोड के टुकड़े देखो।",
        "remember": "सही। टुकड़ों को डिब्बे में डालते हैं, फ़र्श पर कभी नहीं।",
        "ok": {
         "do": [
          "stubs:bin",
          "readout:r4"
         ],
         "say": "सही। टुकड़ों को डिब्बे में डालते हैं, फ़र्श पर कभी नहीं।"
        }
       }
      ]
     },
     {
      "id": "s4",
      "title": "वेल्डिंग कौन कर सकता है",
      "view": "machine",
      "chips": [
       {
        "at": "machine",
        "text": "वेल्डिंग मशीन"
       },
       {
        "at": "trainee",
        "text": "आगंतुक का हेलमेट"
       }
      ],
      "setup": [
       "readout:r4",
       "trainee:on"
      ],
      "tasks": [
       {
        "say": "एक आते-जाते प्रशिक्षु वेल्डिंग मशीन चलाकर देखना चाहता है। इसे कौन चला सकता है?",
        "choices": [
         {
          "text": "सिर्फ़ अधिकृत व्यक्ति",
          "say": "हाँ, सही। अनधिकृत लोगों को वेल्डिंग या कटिंग के उपकरण चलाने मत दो।",
          "pic": "pics/auth-person.jpg",
          "right": true
         },
         {
          "text": "जो भी प्रशिक्षु माँगे",
          "say": "नहीं, बिल्कुल नहीं। अनधिकृत लोग वेल्डिंग या कटिंग के उपकरण नहीं चला सकते।",
          "pic": "pics/any-trainee.jpg",
          "do": [
           "spark:on"
          ],
          "undo": [
           "spark:off"
          ],
          "remember": "सिर्फ़ अधिकृत लोग ही वेल्डिंग और कटिंग के उपकरण चला सकते हैं।"
         }
        ],
        "after": [
         "readout:r5"
        ]
       },
       {
        "say": "सिर्फ़ अधिकृत लोग ही वेल्डिंग और कटिंग के उपकरण चला सकते हैं।"
       }
      ]
     },
     {
      "id": "s5",
      "title": "अग्निशामक यंत्र",
      "view": "bench",
      "chips": [
       {
        "at": "bench",
        "text": "बेंच"
       }
      ],
      "setup": [
       "readout:r5",
       "trainee:off"
      ],
      "tasks": [
       {
        "say": "जब वेल्डिंग चालू हो, तब अग्निशामक यंत्र कहाँ रहना चाहिए?",
        "choices": [
         {
          "text": "पास में, काम करने की हालत में",
          "say": "हाँ, सही। हर समय पास में उचित अग्निशामक यंत्र रखो, और पक्का करो कि वह काम करता हो।",
          "pic": "pics/ext-nearby.jpg",
          "right": true
         },
         {
          "text": "भंडार कक्ष में, जहाँ वह सुरक्षित रहे",
          "say": "नहीं। आग लगे तो यंत्र हाथ के पास होना चाहिए, भंडार में नहीं।",
          "pic": "pics/ext-store.jpg",
          "do": [
           "ext:store",
           "fire:on"
          ],
          "undo": [
           "ext:off",
           "fire:off"
          ],
          "remember": "पास में रखा उचित अग्निशामक यंत्र हमेशा काम करने की हालत में होना चाहिए।"
         }
        ],
        "after": [
         "ext:near",
         "readout:r6"
        ]
       },
       {
        "say": "पास में रखा उचित अग्निशामक यंत्र हमेशा काम करने की हालत में होना चाहिए।"
       }
      ]
     },
     {
      "id": "s6",
      "title": "वेल्ड के बाद",
      "view": "plate",
      "chips": [
       {
        "at": "plate",
        "text": "स्टील प्लेट"
       }
      ],
      "setup": [
       "readout:r6"
      ],
      "tasks": [
       {
        "say": "अब वेल्ड पूरी हो गई है और प्लेट की चमक बंद हो गई है। क्या उसे छूना सुरक्षित है?",
        "predict": true,
        "choices": [
         {
          "text": "हाँ, चमक बंद हो गई",
          "say": "तुमने कहा कि सुरक्षित है। चलो देखते हैं।",
          "pic": "pics/plate-glowless.jpg",
          "right": true,
          "reveal": "गर्म धातु हमेशा चमकती नहीं है। चिमटे का इस्तेमाल करो, और वेल्डिंग के बाद गर्म धातु पर निशान लगाओ।"
         },
         {
          "text": "नहीं, वह अभी भी गर्म हो सकती है",
          "say": "तुमने कहा कि वह अभी भी गर्म हो सकती है। चलो देखते हैं।",
          "pic": "pics/plate-hot.jpg",
          "right": true,
          "reveal": "तुम सही थे। गर्म धातु हमेशा चमकती नहीं है। चिमटे का इस्तेमाल करो, और वेल्डिंग के बाद गर्म धातु पर निशान लगाओ।"
         }
        ]
       },
       {
        "say": "तुम सही थे। गर्म धातु हमेशा चमकती नहीं है। चिमटे का इस्तेमाल करो, और वेल्डिंग के बाद गर्म धातु पर निशान लगाओ।",
        "do": [
         "plate:hot",
         "readout:r7"
        ]
       }
      ]
     },
     {
      "id": "s7",
      "title": "गर्म धातु पर निशान लगाओ",
      "view": "plate",
      "chips": [
       {
        "at": "plate",
        "text": "गर्म प्लेट"
       },
       {
        "at": "bench",
        "text": "बेंच"
       }
      ],
      "setup": [
       "readout:r7",
       "plate:hot"
      ],
      "tasks": [
       {
        "say": "गर्म प्लेट पर निशान लगाओ ताकि कोई उसे उठा न ले। इसके लिए आम तौर पर सोपस्टोन इस्तेमाल होता है।",
        "tap": "soap",
        "hint": "सोपस्टोन पर टैप करो",
        "miss": "प्लेट पर निशान लगाने के लिए सोपस्टोन इस्तेमाल करो।",
        "remember": "सही। गर्म धातु पर सोपस्टोन से निशान लग गया।",
        "ok": {
         "do": [
          "mark:on",
          "readout:r8"
         ],
         "say": "सही। गर्म धातु पर सोपस्टोन से निशान लग गया।"
        }
       }
      ]
     },
     {
      "id": "s8",
      "title": "स्विच बंद करो और बिजली से अलग करो",
      "view": "machine",
      "chips": [
       {
        "at": "dial",
        "text": "गेज"
       },
       {
        "at": "plug",
        "text": "पावर प्लग"
       }
      ],
      "setup": [
       "readout:r8"
      ],
      "tasks": [
       {
        "say": "आख़िर में मशीन को बंद करो और बिजली के स्रोत से अलग कर दो।",
        "tap": "switch",
        "hint": "मशीन के स्विच पर टैप करो",
        "miss": "यह मशीन का स्विच नहीं है। वेल्डिंग मशीन पर स्विच ढूँढो।",
        "remember": "सही। मशीन बंद हो गई और बिजली से अलग भी। केबल लपेटो और इलेक्ट्रोड होल्डर को सुरक्षित जगह रखो।",
        "ok": {
         "do": [
          "machine:off",
          "readout:off"
         ],
         "say": "सही। मशीन बंद हो गई और बिजली से अलग भी। केबल लपेटो और इलेक्ट्रोड होल्डर को सुरक्षित जगह रखो।",
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
  "intro": "आओ, बसवराज अण्णा के साथ वेल्डिंग की जगह में घूमते हैं और एक-एक चरण करके उसे सुरक्षित बनाते हैं।",
  "s1_say": "मल्लेश, आर्क वेल्डिंग में गीला फ़र्श बहुत ख़तरनाक होता है। उसे ढूँढो और ठीक करो।",
  "s1_ok": "सही। हिस्सा सूख गया। आर्क वेल्डिंग करते समय कभी गीली या नम जगह पर मत खड़े होना।",
  "s1_miss_general": "यह गीली जगह नहीं है। वेल्डिंग मशीन के पास पानी का गड्ढा ढूँढो।",
  "s2_say": "चिंगारियों और गर्म धातु से आग लग सकती है। जो भी चीज़ जल सकती है, उसे हटा दो।",
  "s2_ok": "सही। सूती कचरा, तेल और पेट्रोल को वेल्डिंग की जगह से दूर रखना चाहिए।",
  "s2_miss_general": "यह आसानी से नहीं जलेगा। बेंच के पास पड़ा सूती कचरा ढूँढो।",
  "s3_say": "फ़र्श पर पड़े गर्म इलेक्ट्रोड के टुकड़े ख़तरनाक होते हैं। इन्हें कहाँ रखना चाहिए?",
  "s3_ok": "सही। टुकड़ों को डिब्बे में डालते हैं, फ़र्श पर कभी नहीं।",
  "s3_miss_general": "मशीन के पास फ़र्श पर छोटे गर्म इलेक्ट्रोड के टुकड़े देखो।",
  "s4_say": "एक आते-जाते प्रशिक्षु वेल्डिंग मशीन चलाकर देखना चाहता है। इसे कौन चला सकता है?",
  "s4_ok": "सिर्फ़ अधिकृत लोग ही वेल्डिंग और कटिंग के उपकरण चला सकते हैं।",
  "s4_optA": "हाँ, सही। अनधिकृत लोगों को वेल्डिंग या कटिंग के उपकरण चलाने मत दो।",
  "s4_optB": "नहीं, बिल्कुल नहीं। अनधिकृत लोग वेल्डिंग या कटिंग के उपकरण नहीं चला सकते।",
  "s5_say": "जब वेल्डिंग चालू हो, तब अग्निशामक यंत्र कहाँ रहना चाहिए?",
  "s5_ok": "पास में रखा उचित अग्निशामक यंत्र हमेशा काम करने की हालत में होना चाहिए।",
  "s5_optA": "हाँ, सही। हर समय पास में उचित अग्निशामक यंत्र रखो, और पक्का करो कि वह काम करता हो।",
  "s5_optB": "नहीं। आग लगे तो यंत्र हाथ के पास होना चाहिए, भंडार में नहीं।",
  "s6_say": "अब वेल्ड पूरी हो गई है और प्लेट की चमक बंद हो गई है। क्या उसे छूना सुरक्षित है?",
  "s6_ok": "तुमने अपना जवाब चुन लिया।",
  "s6_optA": "तुमने कहा कि सुरक्षित है। चलो देखते हैं।",
  "s6_optB": "तुमने कहा कि वह अभी भी गर्म हो सकती है। चलो देखते हैं।",
  "s6_right": "तुम सही थे। गर्म धातु हमेशा चमकती नहीं है। चिमटे का इस्तेमाल करो, और वेल्डिंग के बाद गर्म धातु पर निशान लगाओ।",
  "s6_wrong": "गर्म धातु हमेशा चमकती नहीं है। चिमटे का इस्तेमाल करो, और वेल्डिंग के बाद गर्म धातु पर निशान लगाओ।",
  "s7_say": "गर्म प्लेट पर निशान लगाओ ताकि कोई उसे उठा न ले। इसके लिए आम तौर पर सोपस्टोन इस्तेमाल होता है।",
  "s7_ok": "सही। गर्म धातु पर सोपस्टोन से निशान लग गया।",
  "s7_miss_general": "प्लेट पर निशान लगाने के लिए सोपस्टोन इस्तेमाल करो।",
  "s8_say": "आख़िर में मशीन को बंद करो और बिजली के स्रोत से अलग कर दो।",
  "s8_ok": "सही। मशीन बंद हो गई और बिजली से अलग भी। केबल लपेटो और इलेक्ट्रोड होल्डर को सुरक्षित जगह रखो।",
  "s8_miss_general": "यह मशीन का स्विच नहीं है। वेल्डिंग मशीन पर स्विच ढूँढो।",
  "end": "बहुत अच्छे! अब वेल्डिंग की जगह सुरक्षित है। फ़र्श सूखा है, जलने वाली चीज़ें दूर हैं, इलेक्ट्रोड के टुकड़े डिब्बे में हैं, और गर्म धातु पर निशान लगा है।"
 }
};
window.LAB_UI_HI = {"continue": "आगे बढ़ें", "do_again": "फिर से करें"};
