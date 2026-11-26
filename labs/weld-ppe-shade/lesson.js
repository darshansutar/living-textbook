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
  "title": "सुरक्षा उपकरण पहनो और सही शेड चुनो",
  "kicker": "आईटीआई · फ़िटर · वेल्डिंग · लैब",
  "sub": "आओ, मल्लेश को सुरक्षा उपकरण पहनाते हैं, फिर हर काम के लिए सही फ़िल्टर ग्लास चुनते हैं।",
  "guide": "बसवराज अण्णा",
  "guideRole": "दुकान के मालिक और वेल्डिंग शिक्षक",
  "ui": {
   "back": "पीछे",
   "mute": "आवाज़ बंद",
   "next": "आगे",
   "step": "चरण {n} / {total}",
   "begin": "लैब शुरू करें",
   "sound": "आवाज़",
   "choose": "",
   "finish": "पूरा करें",
   "listen": "सुनें",
   "replay": "फिर से सुनें",
   "showMe": "दिखाइए",
   "chapter": "लैब",
   "doneTag": "पूरा",
   "notThat": "यह नहीं। {hint}।",
   "chapters": "चरण",
   "readout": {
    "s1": "उपकरण: कुछ नहीं",
    "s2": "उपकरण: एप्रन",
    "s3": "उपकरण: एप्रन, दस्ताने",
    "s4": "उपकरण: एप्रन, दस्ताने, जूते",
    "s5": "काम: पतली प्लेट · 80 एम्पियर",
    "s6": "काम: मोटी प्लेट · 350 एम्पियर",
    "s7": "वेल्ड: ठंडी · जोड़ पर स्लैग",
    "s8": "आर्क: जल रहा · पास में सीट"
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
   "mistakes": "इनका फिर से अभ्यास करें"
  },
  "chapters": [
   {
    "id": "job",
    "title": "सुरक्षा उपकरण पहनो और सही शेड चुनो",
    "kind": "सुरक्षा उपकरण और शेड",
    "intro": "",
    "done": "मल्लेश ने पूरे सुरक्षा उपकरण पहन लिए हैं, और उसे हर धारा के लिए सही शेड और हर ख़तरे के लिए सही उपकरण का पता है।",
    "steps": [
     {
      "id": "s1",
      "title": "शरीर की सुरक्षा",
      "view": "bench",
      "setup": [
       "readout:s1"
      ],
      "chips": [
       {
        "at": "apron",
        "text": "टैप करो: चमड़े का एप्रन",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "मल्लेश, सबसे पहले शरीर। वेल्ड से गर्मी, गर्म छींटे और स्लैग उड़ते हैं। चमड़े का एप्रन पहनो।",
        "tap": "apron",
        "alsoOk": [
         "केप"
        ],
        "hint": "चमड़े के एप्रन पर टैप करो",
        "miss": {
         "say": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।"
        },
        "ok": {
         "do": [
          "gear:cape:on",
          "readout:s2"
         ],
         "then": [
          "gear:apron:on"
         ],
         "say": "सही। एप्रन, आस्तीन वाला केप और लेग गार्ड शरीर, बाँहों, गर्दन और छाती को बचाते हैं। उपकरण ढीले नहीं होने चाहिए।",
         "view": "mallesh"
        },
        "wrong": {
         "gloves": {
          "do": [
           "flash:gloves"
          ],
          "say": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।"
         },
         "boots": {
          "do": [
           "flash:boots"
          ],
          "say": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।"
         },
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।"
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।"
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।"
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
        "text": "टैप करो: चमड़े के दस्ताने",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "अब हाथ। इन्हें गर्मी, आर्क की किरणों, गर्म छींटों और बिजली के झटके से बचाना ज़रूरी है।",
        "tap": "gloves",
        "alsoOk": [],
        "hint": "चमड़े के दस्तानों पर टैप करो",
        "miss": {
         "say": "ये दस्ताने नहीं हैं। चमड़े के दस्तानों पर टैप करो।"
        },
        "ok": {
         "do": [
          "gear:gloves:on",
          "readout:s3"
         ],
         "then": [],
         "say": "सही। चमड़े के दस्ताने हाथों को झटके, आर्क की किरणों, गर्मी और गर्म छींटों से बचाते हैं।",
         "view": "mallesh"
        },
        "wrong": {
         "boots": {
          "do": [
           "flash:boots"
          ],
          "say": "ये दस्ताने नहीं हैं। चमड़े के दस्तानों पर टैप करो।"
         },
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "ये दस्ताने नहीं हैं। चमड़े के दस्तानों पर टैप करो।"
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "ये दस्ताने नहीं हैं। चमड़े के दस्तानों पर टैप करो।"
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "ये दस्ताने नहीं हैं। चमड़े के दस्तानों पर टैप करो।"
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
        "text": "टैप करो: सुरक्षा जूते",
        "gold": true
       }
      ],
      "tasks": [
       {
        "say": "अब पैर। वेल्ड से गर्म धातु गिरती है, और मशीन में बिजली की धारा चलती है।",
        "tap": "boots",
        "alsoOk": [],
        "hint": "सुरक्षा जूतों पर टैप करो",
        "miss": {
         "say": "ये सुरक्षा जूते नहीं हैं। फ़र्श पर रखे जूतों पर टैप करो।"
        },
        "ok": {
         "do": [
          "gear:boots:on",
          "readout:s4"
         ],
         "then": [],
         "say": "सही। सुरक्षा जूते पैर की उँगलियों और टखनों को बचाते हैं, और उनके झटका-रोधी तले बिजली के झटके से बचाते हैं।",
         "view": "mallesh"
        },
        "wrong": {
         "helmet": {
          "do": [
           "flash:helmet"
          ],
          "say": "ये सुरक्षा जूते नहीं हैं। फ़र्श पर रखे जूतों पर टैप करो।"
         },
         "screen": {
          "do": [
           "flash:screen"
          ],
          "say": "ये सुरक्षा जूते नहीं हैं। फ़र्श पर रखे जूतों पर टैप करो।"
         },
         "goggles": {
          "do": [
           "flash:goggles"
          ],
          "say": "ये सुरक्षा जूते नहीं हैं। फ़र्श पर रखे जूतों पर टैप करो।"
         }
        }
       }
      ]
     },
     {
      "id": "s4",
      "title": "हेलमेट या हैंड स्क्रीन",
      "view": "bench",
      "setup": [
       "readout:s4"
      ],
      "tasks": [
       {
        "say": "आँखों और चेहरे को आर्क से बचाने के लिए मल्लेश हैंड स्क्रीन या हेलमेट ले सकता है। किससे दोनों हाथ खाली रहते हैं?",
        "choices": [
         {
          "text": "हेलमेट, जो सिर पर पहना जाता है",
          "say": "हाँ, सही। हेलमेट स्क्रीन सिर पर पहनी जाती है, इसलिए वेल्डर दोनों हाथों से काम कर सकता है।",
          "pic": "pics/helmet-head.jpg",
          "right": true
         },
         {
          "text": "हैंड स्क्रीन",
          "say": "हैंड स्क्रीन को एक हाथ में पकड़ना पड़ता है। हेलमेट से दोनों हाथ खाली रहते हैं।",
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
        "say": "मल्लेश हेलमेट पहनता है।",
        "view": "mallesh"
       }
      ]
     },
     {
      "id": "s5",
      "title": "80 एम्पियर के लिए शेड",
      "view": "shade",
      "setup": [
       "readout:s5",
       "amps:80",
       "pick:off",
       "lens:off"
      ],
      "tasks": [
       {
        "say": "पहला काम एक पतली प्लेट पर है, और उसमें 80 एम्पियर चाहिए। हेलमेट में कौन-सा शेड लगेगा?",
        "choices": [
         {
          "text": "शेड 8 से 9",
          "say": "हाँ, सही। 100 एम्पियर तक शेड 8 से 9 लगता है।",
          "pic": "pics/shade-light.jpg",
          "right": true
         },
         {
          "text": "शेड 12 से 14",
          "say": "यह इस धारा के लिए बहुत गहरा है। शेड 12 से 14, 300 एम्पियर से ऊपर के लिए होता है।",
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
        "say": "जब धारा 100 एम्पियर तक हो, तब शेड 8 से 9 लगता है।",
        "view": "helm"
       }
      ],
      "chips": [
       {
        "at": "dial",
        "text": "80 एम्पियर"
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
      "title": "350 एम्पियर के लिए शेड",
      "view": "shade",
      "setup": [
       "readout:s6",
       "amps:350",
       "pick:off",
       "lens:off"
      ],
      "tasks": [
       {
        "say": "अब एक भारी काम है जिसमें 350 एम्पियर चाहिए। अब हेलमेट में कौन-सा शेड लगेगा?",
        "choices": [
         {
          "text": "शेड 8 से 9",
          "say": "यह इस धारा के लिए बहुत हल्का है। काँच वेल्डिंग की धारा के हिसाब से होना चाहिए।",
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
          "text": "शेड 12 से 14",
          "say": "हाँ, सही। 300 एम्पियर से ऊपर शेड 12 से 14 लगता है।",
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
        "say": "जब धारा 300 एम्पियर से ऊपर हो, तब शेड 12 से 14 लगता है।",
        "view": "helm"
       }
      ],
      "chips": [
       {
        "at": "dial",
        "text": "350 एम्पियर"
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
      "title": "स्लैग तोड़ना",
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
        "say": "काम पूरा होने के बाद एक सहायक स्लैग को तोड़कर हटाता है। वह आँखों के लिए क्या पहनेगा?",
        "choices": [
         {
          "text": "गहरा वेल्डिंग काँच",
          "say": "नहीं। गहरा काँच आर्क के लिए होता है। स्लैग तोड़ने के लिए साफ़ काँच वाले सादे चश्मे चाहिए।",
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
          "text": "सादे चिपिंग चश्मे",
          "say": "हाँ, सही। स्लैग तोड़ते या ग्राइंडिंग करते समय सादे चश्मे आँखों को बचाते हैं।",
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
        "say": "आँखों के लिए, स्लैग तोड़ने और ग्राइंडिंग में सादे चश्मे लगते हैं।",
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
        "say": "एक और प्रशिक्षु आर्क के पास काम कर रहा है। उसे आर्क की चमक से कैसे बचाया जाएगा?",
        "choices": [
         {
          "text": "कुछ नहीं। थोड़ा दूर खड़े हो जाना काफ़ी है",
          "say": "नहीं। आर्क की किरणें आस-पास के लोगों तक पहुँचती हैं। कैनवास स्क्रीन या वेल्डिंग बूथ इस्तेमाल करो।",
          "pic": "pics/stand-apart.jpg",
          "do": [
           "flare:on"
          ],
          "undo": [
           "flare:off"
          ]
         },
         {
          "text": "आग-रोधी कैनवास की ढोने योग्य स्क्रीन",
          "say": "हाँ, सही। आग-रोधी ढोने योग्य कैनवास स्क्रीन वेल्डिंग की जगह के पास काम करने वालों को आर्क की चमक से बचाती है।",
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
        "say": "आस-पास काम करने वालों को आग-रोधी कैनवास स्क्रीन बचाती है।",
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
  "intro": "आओ, मल्लेश को सुरक्षा उपकरण पहनाते हैं, फिर हर काम के लिए सही फ़िल्टर ग्लास चुनते हैं।",
  "s1_say": "मल्लेश, सबसे पहले शरीर। वेल्ड से गर्मी, गर्म छींटे और स्लैग उड़ते हैं। चमड़े का एप्रन पहनो।",
  "s1_ok": "सही। एप्रन, आस्तीन वाला केप और लेग गार्ड शरीर, बाँहों, गर्दन और छाती को बचाते हैं। उपकरण ढीले नहीं होने चाहिए।",
  "s1_miss_general": "यह एप्रन नहीं है। बेंच पर रखे चमड़े के एप्रन पर टैप करो।",
  "s2_say": "अब हाथ। इन्हें गर्मी, आर्क की किरणों, गर्म छींटों और बिजली के झटके से बचाना ज़रूरी है।",
  "s2_ok": "सही। चमड़े के दस्ताने हाथों को झटके, आर्क की किरणों, गर्मी और गर्म छींटों से बचाते हैं।",
  "s2_miss_general": "ये दस्ताने नहीं हैं। चमड़े के दस्तानों पर टैप करो।",
  "s3_say": "अब पैर। वेल्ड से गर्म धातु गिरती है, और मशीन में बिजली की धारा चलती है।",
  "s3_ok": "सही। सुरक्षा जूते पैर की उँगलियों और टखनों को बचाते हैं, और उनके झटका-रोधी तले बिजली के झटके से बचाते हैं।",
  "s3_miss_general": "ये सुरक्षा जूते नहीं हैं। फ़र्श पर रखे जूतों पर टैप करो।",
  "s4_say": "आँखों और चेहरे को आर्क से बचाने के लिए मल्लेश हैंड स्क्रीन या हेलमेट ले सकता है। किससे दोनों हाथ खाली रहते हैं?",
  "s4_ok": "मल्लेश हेलमेट पहनता है।",
  "s4_optA": "हाँ, सही। हेलमेट स्क्रीन सिर पर पहनी जाती है, इसलिए वेल्डर दोनों हाथों से काम कर सकता है।",
  "s4_optB": "हैंड स्क्रीन को एक हाथ में पकड़ना पड़ता है। हेलमेट से दोनों हाथ खाली रहते हैं।",
  "s5_say": "पहला काम एक पतली प्लेट पर है, और उसमें 80 एम्पियर चाहिए। हेलमेट में कौन-सा शेड लगेगा?",
  "s5_ok": "जब धारा 100 एम्पियर तक हो, तब शेड 8 से 9 लगता है।",
  "s5_optA": "हाँ, सही। 100 एम्पियर तक शेड 8 से 9 लगता है।",
  "s5_optB": "यह इस धारा के लिए बहुत गहरा है। शेड 12 से 14, 300 एम्पियर से ऊपर के लिए होता है।",
  "s6_say": "अब एक भारी काम है जिसमें 350 एम्पियर चाहिए। अब हेलमेट में कौन-सा शेड लगेगा?",
  "s6_ok": "जब धारा 300 एम्पियर से ऊपर हो, तब शेड 12 से 14 लगता है।",
  "s6_optA": "हाँ, सही। 300 एम्पियर से ऊपर शेड 12 से 14 लगता है।",
  "s6_optB": "यह इस धारा के लिए बहुत हल्का है। काँच वेल्डिंग की धारा के हिसाब से होना चाहिए।",
  "s7_say": "काम पूरा होने के बाद एक सहायक स्लैग को तोड़कर हटाता है। वह आँखों के लिए क्या पहनेगा?",
  "s7_ok": "आँखों के लिए, स्लैग तोड़ने और ग्राइंडिंग में सादे चश्मे लगते हैं।",
  "s7_optA": "हाँ, सही। स्लैग तोड़ते या ग्राइंडिंग करते समय सादे चश्मे आँखों को बचाते हैं।",
  "s7_optB": "नहीं। गहरा काँच आर्क के लिए होता है। स्लैग तोड़ने के लिए साफ़ काँच वाले सादे चश्मे चाहिए।",
  "s8_say": "एक और प्रशिक्षु आर्क के पास काम कर रहा है। उसे आर्क की चमक से कैसे बचाया जाएगा?",
  "s8_ok": "आस-पास काम करने वालों को आग-रोधी कैनवास स्क्रीन बचाती है।",
  "s8_optA": "हाँ, सही। आग-रोधी ढोने योग्य कैनवास स्क्रीन वेल्डिंग की जगह के पास काम करने वालों को आर्क की चमक से बचाती है।",
  "s8_optB": "नहीं। आर्क की किरणें आस-पास के लोगों तक पहुँचती हैं। कैनवास स्क्रीन या वेल्डिंग बूथ इस्तेमाल करो।",
  "end": "मल्लेश ने पूरे सुरक्षा उपकरण पहन लिए हैं, और उसे हर धारा के लिए सही शेड और हर ख़तरे के लिए सही उपकरण का पता है।"
 }
};
window.LAB_UI_HI = {"continue": "आगे बढ़ें", "do_again": "फिर से करें"};
