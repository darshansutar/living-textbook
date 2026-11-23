/* generated from projects/iti-smart-switch/script.json (+ iti-smart-switch-hi/lines_hi.json, iti-smart-switch-kn/lines_kn.json) by build_lab.py - edit those, not this file */
window.WORKBENCH = {
 "en": {
  "id": "smart-switch-lt",
  "title": "Fit a smart switch",
  "kicker": "ITI · Electrician · Lab",
  "sub": "Work safely, wire the smart switch, and test both lights.",
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
    "on": "Danger: power ON",
    "off": "Power OFF",
    "online": "Danger: power ON",
    "pairing": "Danger: power ON"
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
    "title": "Fit a smart switch",
    "kind": "Wiring job",
    "intro": "",
    "done": "The smart switch is ready, Manju. Let Lakshmi madam try the balcony light from her phone.",
    "steps": [
     {
      "id": "s1",
      "title": "Get ready",
      "view": "all",
      "tasks": [
       {
        "say": "Manju, before any electrical work, what do you put on?",
        "choices": [
         {
          "text": "Insulated gloves and safety shoes",
          "say": "Yes. Rubber does not carry current. Keep your hands dry too.",
          "pic": "pics/ready-shoes.jpg",
          "right": true
         },
         {
          "text": "Nothing, the floor is dry",
          "say": "The dry floor is not enough. Current can pass through your body into the floor.",
          "pic": "pics/ready-barefoot.jpg"
         }
        ]
       },
       {
        "say": "Good. You are ready to work safely."
       }
      ]
     },
     {
      "id": "s2",
      "title": "Switch off lights",
      "view": "db",
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
        "say": "Never work on a live wire. Switch off the lights MCB in the distribution board.",
        "tap": "lights",
        "hint": "Tap the lights MCB",
        "ok": {
         "do": [
          "lever:lights:off",
          "bulb:hall:off",
          "readout:off"
         ],
         "say": "Good. The hall light is off. Hang a tag here, so nobody switches it on.",
         "then": [
          "tag:on"
         ]
        },
        "wrong": {
         "main": {
          "do": [
           "lever:main:off",
           "bulb:hall:off",
           "router:off"
          ],
          "say": "That cuts power to the whole house. Switch off only the lights circuit.",
          "undo": [
           "lever:main:on",
           "bulb:hall:on",
           "router:on"
          ]
         },
         "sockets": {
          "do": [
           "lever:sockets:off",
           "router:off"
          ],
          "say": "That cuts power to the router, but the hall light stays on. Find the lights MCB.",
          "undo": [
           "lever:sockets:on",
           "router:on"
          ]
         }
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "Stop the inverter",
      "view": "all",
      "tasks": [
       {
        "say": "This house has an inverter for power cuts. What do you do about it?",
        "choices": [
         {
          "text": "Switch off the inverter too",
          "say": "Yes. An inverter can send power into the lights even when the MCB is off.",
          "pic": "pics/inverter-off.jpg",
          "right": true
         },
         {
          "text": "Nothing, the MCB is off",
          "say": "Careful. The MCB alone is not enough because the inverter can still feed the lights.",
          "pic": "pics/inverter-mcb-only.jpg"
         }
        ]
       },
       {
        "say": "The inverter is off, so it cannot send power to these wires."
       }
      ]
     },
     {
      "id": "s4",
      "title": "Test, then touch",
      "view": "test",
      "tasks": [
       {
        "say": "Open the switchboard. Check your tester in a live socket, then test the red wire's terminal.",
        "tap": "tester",
        "hint": "Tap the line tester",
        "ok": {
         "do": [
          "box:open",
          "tester:socket",
          "neon:on"
         ],
         "say": "No glow here. There is no power. Test, then touch, every time.",
         "then": [
          "neon:off",
          "tester:terminal"
         ]
        }
       }
      ]
     },
     {
      "id": "s5",
      "title": "Find the neutral",
      "view": "wiring",
      "tasks": [
       {
        "say": "The smart switch needs neutral power, but this box has no black wire. What will you do?",
        "choices": [
         {
          "text": "Bring neutral wire from the DB",
          "say": "Yes. Bring a new black wire from the DB's neutral link through the conduit.",
          "pic": "pics/neutral-new.jpg",
          "right": true
         },
         {
          "text": "Use the green earth wire",
          "say": "Never use earth as neutral. Earth is only for safety.",
          "pic": "pics/neutral-earth.jpg"
         },
         {
          "text": "Fit it without a neutral",
          "say": "That will not work. Without neutral, the smart switch gets no power.",
          "pic": "pics/neutral-none.jpg"
         }
        ],
        "after": [
         "newN:on",
         "box:openN"
        ]
       },
       {
        "say": "Good. The new black neutral now reaches the switchbox."
       }
      ]
     },
     {
      "id": "s6",
      "title": "Connect the terminals",
      "view": "box",
      "setup": [
       "tester:off",
       "box:bare",
       "bench:old:on",
       "bench:smart:off",
       "box:c0"
      ],
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
        }
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
        }
       },
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
        }
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
        }
       }
      ]
     },
     {
      "id": "s7",
      "title": "Power on",
      "view": "db",
      "setup": [
       "box:fitted"
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
         "view": "box"
        }
       }
      ]
     },
     {
      "id": "s8",
      "title": "Test by phone",
      "view": "test",
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
        }
       }
      ]
     },
     {
      "id": "s9",
      "title": "Explain the switch",
      "view": "test",
      "tasks": [
       {
        "say": "Lakshmi madam asks what happens when the Wi-Fi stops. What do you tell her?",
        "choices": [
         {
          "text": "Pads work, phone control stops",
          "say": "Exactly. The pads still work like normal switches. Only phone control stops.",
          "pic": "pics/explain-pads.jpg",
          "right": true
         },
         {
          "text": "The lights will not work",
          "say": "The lights still work. The switch gets power from L and N, not from Wi-Fi.",
          "pic": "pics/explain-dark.jpg"
         }
        ]
       },
       {
        "say": "Right. Lakshmi madam knows how the switch works. Job done!"
       }
      ]
     }
    ]
   }
  ]
 },
 "hi": {
  "id": "smart-switch-lt",
  "title": "स्मार्ट स्विच लगाएँ",
  "kicker": "आईटीआई · इलेक्ट्रिशियन · अभ्यास",
  "sub": "सुरक्षित ढंग से काम करें, स्मार्ट स्विच की वायरिंग करें और दोनों लाइटें जाँचें।",
  "guide": "रवि",
  "guideRole": "सीनियर इलेक्ट्रिशियन",
  "ui": {
   "back": "पीछे",
   "mute": "आवाज़ बंद",
   "next": "आगे",
   "step": "कदम {n}, कुल {total}",
   "begin": "काम शुरू करें",
   "sound": "आवाज़",
   "choose": "",
   "finish": "पूरा करें",
   "listen": "सुनें",
   "replay": "फिर सुनें",
   "showMe": "मुझे दिखाएँ",
   "chapter": "काम",
   "doneTag": "पूरा",
   "notThat": "यह नहीं। {hint}।",
   "chapters": "कदम",
   "readout": {
    "on": "ख़तरा: बिजली चालू",
    "off": "बिजली बंद",
    "online": "ख़तरा: बिजली चालू",
    "pairing": "ख़तरा: बिजली चालू"
   }
  },
  "end": {
   "hub": "कदम",
   "more": "",
   "next": "आगे",
   "again": "फिर अभ्यास करें",
   "clean": "आपने हर कदम सही किया।",
   "allDone": "",
   "heading": "शाबाश!",
   "mistakes": "इनका फिर अभ्यास करें"
  },
  "chapters": [
   {
    "id": "job",
    "title": "स्मार्ट स्विच लगाएँ",
    "kind": "वायरिंग का काम",
    "intro": "",
    "done": "स्मार्ट स्विच तैयार है, मंजू। अब लक्ष्मी मैडम को फ़ोन से बालकनी की लाइट चलाने दो।",
    "steps": [
     {
      "id": "s1",
      "title": "तैयार हों",
      "view": "all",
      "tasks": [
       {
        "say": "मंजू, बिजली का कोई भी काम शुरू करने से पहले तुम क्या पहनते हो?",
        "choices": [
         {
          "text": "इंसुलेटेड दस्ताने और सेफ़्टी जूते",
          "say": "हाँ। रबर से करंट नहीं गुजरता। अपने हाथ भी सूखे रखना।",
          "pic": "pics/ready-shoes.jpg",
          "right": true
         },
         {
          "text": "कुछ नहीं, फ़र्श सूखा है",
          "say": "सिर्फ़ फ़र्श का सूखा होना काफ़ी नहीं है। करंट तुम्हारे शरीर से होकर फ़र्श तक जा सकता है।",
          "pic": "pics/ready-barefoot.jpg"
         }
        ]
       },
       {
        "say": "अच्छा। अब तुम सुरक्षित ढंग से काम करने के लिए तैयार हो।"
       }
      ]
     },
     {
      "id": "s2",
      "title": "लाइटें बंद करें",
      "view": "db",
      "chips": [
       {
        "at": "db-main",
        "side": "left",
        "text": "मेन"
       },
       {
        "at": "db-lights",
        "text": "लाइटें"
       },
       {
        "at": "db-sockets",
        "side": "right",
        "text": "प्लग"
       }
      ],
      "tasks": [
       {
        "say": "करंट वाले तार पर कभी काम मत करो। डिस्ट्रिब्यूशन बोर्ड में लाइटों की एमसीबी बंद करो।",
        "tap": "lights",
        "hint": "लाइटों की एमसीबी दबाएँ",
        "ok": {
         "do": [
          "lever:lights:off",
          "bulb:hall:off",
          "readout:off"
         ],
         "say": "अच्छा। हॉल की लाइट बंद है। यहाँ टैग लटका दो, ताकि कोई इसे चालू न करे।",
         "then": [
          "tag:on"
         ]
        },
        "wrong": {
         "main": {
          "do": [
           "lever:main:off",
           "bulb:hall:off",
           "router:off"
          ],
          "say": "इससे पूरे घर की बिजली कट जाती है। सिर्फ़ लाइटों वाला सर्किट बंद करो।",
          "undo": [
           "lever:main:on",
           "bulb:hall:on",
           "router:on"
          ]
         },
         "sockets": {
          "do": [
           "lever:sockets:off",
           "router:off"
          ],
          "say": "इससे राउटर बंद होता है, पर हॉल की लाइट चालू रहती है। लाइटों की एमसीबी ढूँढ़ो।",
          "undo": [
           "lever:sockets:on",
           "router:on"
          ]
         }
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "इन्वर्टर बंद करें",
      "view": "all",
      "tasks": [
       {
        "say": "इस घर में बिजली जाने पर इन्वर्टर चलता है। इसके लिए तुम क्या करोगे?",
        "choices": [
         {
          "text": "इन्वर्टर भी बंद करें",
          "say": "हाँ। एमसीबी बंद होने पर भी इन्वर्टर लाइटों में बिजली भेज सकता है।",
          "pic": "pics/inverter-off.jpg",
          "right": true
         },
         {
          "text": "कुछ नहीं, एमसीबी बंद है",
          "say": "ध्यान से। सिर्फ़ एमसीबी बंद करना काफ़ी नहीं है, क्योंकि इन्वर्टर अब भी लाइटों को बिजली दे सकता है।",
          "pic": "pics/inverter-mcb-only.jpg"
         }
        ]
       },
       {
        "say": "इन्वर्टर बंद है, इसलिए अब वह इन तारों में बिजली नहीं भेज सकता।"
       }
      ]
     },
     {
      "id": "s4",
      "title": "पहले जाँच, फिर छूना",
      "view": "test",
      "tasks": [
       {
        "say": "स्विचबोर्ड खोलो। पहले चालू सॉकेट में टेस्टर जाँचो, फिर लाल तार का टर्मिनल जाँचो।",
        "tap": "tester",
        "hint": "लाइन टेस्टर दबाएँ",
        "ok": {
         "do": [
          "box:open",
          "tester:socket",
          "neon:on"
         ],
         "say": "यहाँ टेस्टर नहीं चमका। बिजली नहीं है। पहले जाँच, फिर छूना। हर बार।",
         "then": [
          "neon:off",
          "tester:terminal"
         ]
        }
       }
      ]
     },
     {
      "id": "s5",
      "title": "न्यूट्रल ढूँढ़ें",
      "view": "wiring",
      "tasks": [
       {
        "say": "स्मार्ट स्विच को न्यूट्रल चाहिए, लेकिन इस बॉक्स में काला तार नहीं है। तुम क्या करोगे?",
        "choices": [
         {
          "text": "डीबी से न्यूट्रल तार लाएँ",
          "say": "हाँ। डीबी की न्यूट्रल लिंक से कंड्यूट के रास्ते नया काला तार लाओ।",
          "pic": "pics/neutral-new.jpg",
          "right": true
         },
         {
          "text": "हरा अर्थ तार लगाएँ",
          "say": "अर्थ को कभी न्यूट्रल मत बनाओ। अर्थ सिर्फ़ सुरक्षा के लिए है।",
          "pic": "pics/neutral-earth.jpg"
         },
         {
          "text": "न्यूट्रल के बिना लगा दें",
          "say": "यह काम नहीं करेगा। न्यूट्रल के बिना स्मार्ट स्विच को बिजली नहीं मिलेगी।",
          "pic": "pics/neutral-none.jpg"
         }
        ],
        "after": [
         "newN:on",
         "box:openN"
        ]
       },
       {
        "say": "अच्छा। नया काला न्यूट्रल तार अब स्विचबॉक्स तक पहुँच गया है।"
       }
      ]
     },
     {
      "id": "s6",
      "title": "टर्मिनल जोड़ें",
      "view": "box",
      "setup": [
       "tester:off",
       "box:bare",
       "bench:old:on",
       "bench:smart:off",
       "box:c0"
      ],
      "tasks": [
       {
        "say": "स्विच पर L, N, L1 और L2 हैं। L में आने वाली बिजली जुड़ती है। L में कौन-सा तार जाएगा?",
        "tap": "w-red",
        "glow": "t-L",
        "hint": "L में जाने वाला तार दबाएँ",
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
         "say": "हाँ। लाल फ़ेज़ तार L में जाता है।"
        },
        "wrong": {
         "w-black": {
          "say": "मंजू, काला तार न्यूट्रल है। यह N में जाता है।"
         },
         "w-earth": {
          "say": "हरे तार को कभी L में मत लगाओ। हरा अर्थ तार है और सुरक्षा के लिए रहता है।"
         }
        }
       },
       {
        "say": "अब नए काले न्यूट्रल तार को N से जोड़ो।",
        "tap": "w-black",
        "glow": "t-N",
        "hint": "काला न्यूट्रल तार दबाएँ",
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
        }
       },
       {
        "say": "हॉल की लाइट का पीला तार L1 से जोड़ो।",
        "tap": "w-y1",
        "glow": "t-L1",
        "hint": "हॉल की लाइट का पीला तार दबाएँ",
        "chips": [
         {
          "at": "t-L1",
          "text": "L1"
         },
         {
          "at": "w-y1",
          "text": "हॉल"
         },
         {
          "at": "w-y2",
          "side": "right",
          "text": "बालकनी"
         }
        ],
        "ok": {
         "do": [
          "box:c3"
         ]
        }
       },
       {
        "say": "बालकनी की लाइट का पीला तार L2 से जोड़ो।",
        "tap": "w-y2",
        "glow": "t-L2",
        "hint": "बालकनी की लाइट का पीला तार दबाएँ",
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
         "say": "चारों तार अच्छी तरह कस गए हैं।"
        }
       }
      ]
     },
     {
      "id": "s7",
      "title": "बिजली चालू करें",
      "view": "db",
      "setup": [
       "box:fitted"
      ],
      "tasks": [
       {
        "say": "तारों को अंदर मोड़कर स्विच कस दो। फिर टैग हटाकर दोनों बिजली के स्रोत चालू करो।",
        "tap": "lights",
        "hint": "लाइटों की एमसीबी दबाएँ",
        "ok": {
         "do": [
          "tag:off",
          "lever:lights:on",
          "wifi:blink",
          "readout:pairing"
         ],
         "say": "स्विच की बत्ती टिमटिमा रही है। इसे बिजली मिल रही है और यह वाई-फ़ाई के लिए तैयार है।",
         "view": "box"
        }
       }
      ]
     },
     {
      "id": "s8",
      "title": "फ़ोन से जाँचें",
      "view": "test",
      "setup": [
       "wifi:on",
       "readout:online",
       "pad:1:on",
       "bulb:hall:on"
      ],
      "tasks": [
       {
        "say": "लक्ष्मी मैडम का फ़ोन उनके घर के वाई-फ़ाई से जुड़ा है। ऐप से बालकनी की लाइट चालू करो।",
        "ask": "स्मार्ट स्विच",
        "tap": "app-balcony",
        "hint": "ऐप में बालकनी की लाइट दबाएँ",
        "phone": true,
        "toggles": [
         {
          "id": "app-hall",
          "on": true,
          "text": "हॉल की लाइट"
         },
         {
          "id": "app-balcony",
          "on": false,
          "text": "बालकनी की लाइट"
         }
        ],
        "ok": {
         "do": [
          "pad:2:on",
          "bulb:balcony:on"
         ],
         "say": "दोनों लाइटें दीवार के स्विच और फ़ोन, दोनों से चलती हैं।"
        }
       }
      ]
     },
     {
      "id": "s9",
      "title": "स्विच समझाएँ",
      "view": "test",
      "tasks": [
       {
        "say": "लक्ष्मी मैडम पूछती हैं कि वाई-फ़ाई बंद हो जाए तो क्या होगा। तुम उन्हें क्या बताओगे?",
        "choices": [
         {
          "text": "पैड चलेंगे, फ़ोन से चलाना बंद होगा",
          "say": "बिलकुल। पैड सामान्य स्विच की तरह चलते रहेंगे। सिर्फ़ फ़ोन से चलाना बंद होगा।",
          "pic": "pics/explain-pads.jpg",
          "right": true
         },
         {
          "text": "लाइटें काम नहीं करेंगी",
          "say": "लाइटें फिर भी चलेंगी। स्विच को बिजली L और N से मिलती है, वाई-फ़ाई से नहीं।",
          "pic": "pics/explain-dark.jpg"
         }
        ]
       },
       {
        "say": "सही। लक्ष्मी मैडम समझ गईं कि स्विच कैसे चलता है। काम पूरा!"
       }
      ]
     }
    ]
   }
  ]
 },
 "kn": {
  "id": "smart-switch-lt",
  "title": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್ ಅಳವಡಿಸಿ",
  "kicker": "ಐಟಿಐ · ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ · ಅಭ್ಯಾಸ",
  "sub": "ಸುರಕ್ಷಿತವಾಗಿ ಕೆಲಸ ಮಾಡಿ, ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್‌ಗೆ ವೈರಿಂಗ್ ಮಾಡಿ ಮತ್ತು ಎರಡೂ ದೀಪಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.",
  "guide": "ರವಿ",
  "guideRole": "ಹಿರಿಯ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್",
  "ui": {
   "back": "ಹಿಂದೆ",
   "mute": "ಮ್ಯೂಟ್",
   "next": "ಮುಂದೆ",
   "step": "ಹಂತ {n} / {total}",
   "begin": "ಕೆಲಸ ಶುರು ಮಾಡಿ",
   "sound": "ಧ್ವನಿ",
   "choose": "",
   "finish": "ಮುಗಿಸಿ",
   "listen": "ಕೇಳಿ",
   "replay": "ಮತ್ತೆ ಕೇಳಿ",
   "showMe": "ನನಗೆ ತೋರಿಸಿ",
   "chapter": "ಕೆಲಸ",
   "doneTag": "ಮುಗಿದಿದೆ",
   "notThat": "ಅದಲ್ಲ. {hint}.",
   "chapters": "ಹಂತಗಳು",
   "readout": {
    "on": "ಅಪಾಯ: ವಿದ್ಯುತ್ ಆನ್",
    "off": "ವಿದ್ಯುತ್ ಆಫ್",
    "online": "ಅಪಾಯ: ವಿದ್ಯುತ್ ಆನ್",
    "pairing": "ಅಪಾಯ: ವಿದ್ಯುತ್ ಆನ್"
   }
  },
  "end": {
   "hub": "ಹಂತಗಳು",
   "more": "",
   "next": "ಮುಂದೆ",
   "again": "ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಿ",
   "clean": "ನೀವು ಪ್ರತಿ ಹಂತವನ್ನೂ ಸರಿಯಾಗಿ ಮಾಡಿದಿರಿ.",
   "allDone": "",
   "heading": "ಶಭಾಷ್!",
   "mistakes": "ಇವುಗಳನ್ನು ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಿ"
  },
  "chapters": [
   {
    "id": "job",
    "title": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್ ಅಳವಡಿಸಿ",
    "kind": "ವೈರಿಂಗ್ ಕೆಲಸ",
    "intro": "",
    "done": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್ ಸಿದ್ಧವಾಗಿದೆ, ಮಂಜು. ಈಗ ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಅವರು ತಮ್ಮ ಫೋನ್‌ನಿಂದ ಬಾಲ್ಕನಿ ದೀಪ ಹಚ್ಚಿ ನೋಡಲಿ.",
    "steps": [
     {
      "id": "s1",
      "title": "ಸಿದ್ಧರಾಗಿ",
      "view": "all",
      "tasks": [
       {
        "say": "ಮಂಜು, ಯಾವುದೇ ವಿದ್ಯುತ್ ಕೆಲಸ ಶುರು ಮಾಡುವ ಮೊದಲು ನೀನು ಏನನ್ನು ಧರಿಸುತ್ತೀಯ?",
        "choices": [
         {
          "text": "ಇನ್ಸುಲೇಟೆಡ್ ಗ್ಲೌಸ್ ಮತ್ತು ಸೇಫ್ಟಿ ಶೂಗಳು",
          "say": "ಹೌದು. ರಬ್ಬರ್ ವಿದ್ಯುತ್ ಹರಿಸುವುದಿಲ್ಲ. ನಿನ್ನ ಕೈಗಳನ್ನೂ ಒಣಗಿಸಿಕೊಂಡಿರು.",
          "pic": "pics/ready-shoes.jpg",
          "right": true
         },
         {
          "text": "ಏನೂ ಇಲ್ಲ, ನೆಲ ಒಣಗಿದೆ",
          "say": "ಒಣ ನೆಲ ಸಾಕಾಗುವುದಿಲ್ಲ. ವಿದ್ಯುತ್ ನಿನ್ನ ದೇಹದ ಮೂಲಕ ನೆಲಕ್ಕೆ ಹರಿಯಬಹುದು.",
          "pic": "pics/ready-barefoot.jpg"
         }
        ]
       },
       {
        "say": "ಒಳ್ಳೆಯದು. ನೀನು ಸುರಕ್ಷಿತವಾಗಿ ಕೆಲಸ ಮಾಡಲು ಸಿದ್ಧನಾಗಿದ್ದೀಯ."
       }
      ]
     },
     {
      "id": "s2",
      "title": "ದೀಪಗಳನ್ನು ಆಫ್ ಮಾಡಿ",
      "view": "db",
      "chips": [
       {
        "at": "db-main",
        "side": "left",
        "text": "ಮೇನ್"
       },
       {
        "at": "db-lights",
        "text": "ದೀಪಗಳು"
       },
       {
        "at": "db-sockets",
        "side": "right",
        "text": "ಪ್ಲಗ್‌ಗಳು"
       }
      ],
      "tasks": [
       {
        "say": "ಜೀವಂತ ತಂತಿಯ ಮೇಲೆ ಎಂದಿಗೂ ಕೆಲಸ ಮಾಡಬೇಡ. ಡಿಸ್ಟ್ರಿಬ್ಯೂಷನ್ ಬೋರ್ಡ್‌ನಲ್ಲಿ ದೀಪಗಳ ಎಂ.ಸಿ.ಬಿ. ಆಫ್ ಮಾಡು.",
        "tap": "lights",
        "hint": "ದೀಪಗಳ ಎಂ.ಸಿ.ಬಿ.ಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
        "ok": {
         "do": [
          "lever:lights:off",
          "bulb:hall:off",
          "readout:off"
         ],
         "say": "ಒಳ್ಳೆಯದು. ಹಾಲ್ ದೀಪ ಆಫ್ ಆಗಿದೆ. ಇಲ್ಲಿ ಒಂದು ಟ್ಯಾಗ್ ತೂಗು ಹಾಕು, ಯಾರೂ ಅದನ್ನು ಆನ್ ಮಾಡದಂತೆ.",
         "then": [
          "tag:on"
         ]
        },
        "wrong": {
         "main": {
          "do": [
           "lever:main:off",
           "bulb:hall:off",
           "router:off"
          ],
          "say": "ಅದು ಇಡೀ ಮನೆಯ ವಿದ್ಯುತ್ ಕಡಿತಗೊಳಿಸುತ್ತದೆ. ದೀಪಗಳ ಸರ್ಕ್ಯೂಟ್ ಮಾತ್ರ ಆಫ್ ಮಾಡು.",
          "undo": [
           "lever:main:on",
           "bulb:hall:on",
           "router:on"
          ]
         },
         "sockets": {
          "do": [
           "lever:sockets:off",
           "router:off"
          ],
          "say": "ಅದು ರೂಟರ್‌ಗೆ ವಿದ್ಯುತ್ ಕಡಿತಗೊಳಿಸುತ್ತದೆ, ಆದರೆ ಹಾಲ್ ದೀಪ ಹಾಗೆಯೇ ಉರಿಯುತ್ತದೆ. ದೀಪಗಳ ಎಂ.ಸಿ.ಬಿ. ಹುಡುಕು.",
          "undo": [
           "lever:sockets:on",
           "router:on"
          ]
         }
        }
       }
      ]
     },
     {
      "id": "s3",
      "title": "ಇನ್ವರ್ಟರ್ ನಿಲ್ಲಿಸಿ",
      "view": "all",
      "tasks": [
       {
        "say": "ಈ ಮನೆಯಲ್ಲಿ ಕರೆಂಟ್ ಹೋದಾಗ ಬಳಸಲು ಇನ್ವರ್ಟರ್ ಇದೆ. ಅದರ ಬಗ್ಗೆ ನೀನು ಏನು ಮಾಡುತ್ತೀಯ?",
        "choices": [
         {
          "text": "ಇನ್ವರ್ಟರ್ ಕೂಡ ಆಫ್ ಮಾಡು",
          "say": "ಹೌದು. ಎಂ.ಸಿ.ಬಿ. ಆಫ್ ಇದ್ದರೂ ಇನ್ವರ್ಟರ್ ದೀಪಗಳಿಗೆ ವಿದ್ಯುತ್ ಕಳುಹಿಸಬಹುದು.",
          "pic": "pics/inverter-off.jpg",
          "right": true
         },
         {
          "text": "ಏನೂ ಇಲ್ಲ, ಎಂ.ಸಿ.ಬಿ. ಆಫ್ ಇದೆ",
          "say": "ಜಾಗರೂಕ. ಎಂ.ಸಿ.ಬಿ. ಒಂದೇ ಸಾಕಾಗುವುದಿಲ್ಲ, ಏಕೆಂದರೆ ಇನ್ವರ್ಟರ್ ಇನ್ನೂ ದೀಪಗಳಿಗೆ ವಿದ್ಯುತ್ ಕೊಡಬಹುದು.",
          "pic": "pics/inverter-mcb-only.jpg"
         }
        ]
       },
       {
        "say": "ಇನ್ವರ್ಟರ್ ಆಫ್ ಆಗಿದೆ, ಹಾಗಾಗಿ ಅದು ಈ ತಂತಿಗಳಿಗೆ ವಿದ್ಯುತ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ."
       }
      ]
     },
     {
      "id": "s4",
      "title": "ಮೊದಲು ಪರೀಕ್ಷಿಸಿ, ಆಮೇಲೆ ಮುಟ್ಟಿ",
      "view": "test",
      "tasks": [
       {
        "say": "ಸ್ವಿಚ್‌ಬೋರ್ಡ್ ತೆರೆ. ಮೊದಲು ನಿನ್ನ ಟೆಸ್ಟರ್ ಅನ್ನು ಜೀವಂತ ಸಾಕೆಟ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸು, ನಂತರ ಕೆಂಪು ತಂತಿಯ ಟರ್ಮಿನಲ್ ಪರೀಕ್ಷಿಸು.",
        "tap": "tester",
        "hint": "ಲೈನ್ ಟೆಸ್ಟರ್ ಅನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
        "ok": {
         "do": [
          "box:open",
          "tester:socket",
          "neon:on"
         ],
         "say": "ಇಲ್ಲಿ ಬೆಳಕಿಲ್ಲ. ವಿದ್ಯುತ್ ಇಲ್ಲ. ಮೊದಲು ಪರೀಕ್ಷಿಸು, ಆಮೇಲೆ ಮುಟ್ಟು, ಪ್ರತಿ ಬಾರಿಯೂ.",
         "then": [
          "neon:off",
          "tester:terminal"
         ]
        }
       }
      ]
     },
     {
      "id": "s5",
      "title": "ನ್ಯೂಟ್ರಲ್ ಹುಡುಕಿ",
      "view": "wiring",
      "tasks": [
       {
        "say": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್‌ಗೆ ನ್ಯೂಟ್ರಲ್ ವಿದ್ಯುತ್ ಬೇಕು, ಆದರೆ ಈ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಕಪ್ಪು ತಂತಿ ಇಲ್ಲ. ನೀನು ಏನು ಮಾಡುತ್ತೀಯ?",
        "choices": [
         {
          "text": "ಡಿ.ಬಿ.ಯಿಂದ ನ್ಯೂಟ್ರಲ್ ತಂತಿ ತರು",
          "say": "ಹೌದು. ಡಿ.ಬಿ.ಯ ನ್ಯೂಟ್ರಲ್ ಲಿಂಕ್‌ನಿಂದ ಕಂಡ್ಯೂಟ್ ಮೂಲಕ ಹೊಸ ಕಪ್ಪು ತಂತಿಯನ್ನು ತೆಗೆದುಕೊಂಡು ಬಾ.",
          "pic": "pics/neutral-new.jpg",
          "right": true
         },
         {
          "text": "ಹಸಿರು ಅರ್ಥ್ ತಂತಿ ಬಳಸು",
          "say": "ಅರ್ಥ್ ಅನ್ನು ನ್ಯೂಟ್ರಲ್ ಆಗಿ ಎಂದಿಗೂ ಬಳಸಬೇಡ. ಅರ್ಥ್ ಇರುವುದು ಸುರಕ್ಷತೆಗೆ ಮಾತ್ರ.",
          "pic": "pics/neutral-earth.jpg"
         },
         {
          "text": "ನ್ಯೂಟ್ರಲ್ ಇಲ್ಲದೆಯೇ ಅಳವಡಿಸು",
          "say": "ಅದು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. ನ್ಯೂಟ್ರಲ್ ಇಲ್ಲದಿದ್ದರೆ ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್‌ಗೆ ವಿದ್ಯುತ್ ಸಿಗುವುದಿಲ್ಲ.",
          "pic": "pics/neutral-none.jpg"
         }
        ],
        "after": [
         "newN:on",
         "box:openN"
        ]
       },
       {
        "say": "ಒಳ್ಳೆಯದು. ಹೊಸ ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್ ಈಗ ಸ್ವಿಚ್‌ಬಾಕ್ಸ್‌ಗೆ ತಲುಪಿದೆ."
       }
      ]
     },
     {
      "id": "s6",
      "title": "ಟರ್ಮಿನಲ್‌ಗಳನ್ನು ಜೋಡಿಸಿ",
      "view": "box",
      "setup": [
       "tester:off",
       "box:bare",
       "bench:old:on",
       "bench:smart:off",
       "box:c0"
      ],
      "tasks": [
       {
        "say": "ಸ್ವಿಚ್‌ನಲ್ಲಿ ಎಲ್, ಎನ್, ಎಲ್ ಒಂದು ಮತ್ತು ಎಲ್ ಎರಡು ಇವೆ. ಎಲ್‌ಗೆ ಒಳಬರುವ ವಿದ್ಯುತ್ ಹೋಗುತ್ತದೆ. ಯಾವ ತಂತಿ ಎಲ್‌ಗೆ ಹೋಗಬೇಕು?",
        "tap": "w-red",
        "glow": "t-L",
        "hint": "L ಗೆ ಹೋಗುವ ತಂತಿಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
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
         "say": "ಹೌದು. ಕೆಂಪು ಫೇಸ್ ತಂತಿ ಎಲ್‌ಗೆ ಹೋಗುತ್ತದೆ."
        },
        "wrong": {
         "w-black": {
          "say": "ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್, ಮಂಜು. ಅದು ಎನ್‌ಗೆ ಹೋಗುತ್ತದೆ."
         },
         "w-earth": {
          "say": "ಹಸಿರನ್ನು ಎಂದಿಗೂ ಎಲ್‌ಗೆ ಹಾಕಬೇಡ. ಹಸಿರು ಅರ್ಥ್, ಅದು ಸುರಕ್ಷತೆಗಾಗಿ ಇರುತ್ತದೆ."
         }
        }
       },
       {
        "say": "ಈಗ ಹೊಸ ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್ ತಂತಿಯನ್ನು ಎನ್‌ಗೆ ಜೋಡಿಸು.",
        "tap": "w-black",
        "glow": "t-N",
        "hint": "ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್ ತಂತಿಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
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
        }
       },
       {
        "say": "ಹಾಲ್ ದೀಪದ ಹಳದಿ ತಂತಿಯನ್ನು ಎಲ್ ಒಂದಕ್ಕೆ ಜೋಡಿಸು.",
        "tap": "w-y1",
        "glow": "t-L1",
        "hint": "ಹಾಲ್ ದೀಪದ ಹಳದಿ ತಂತಿಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
        "chips": [
         {
          "at": "t-L1",
          "text": "L1"
         },
         {
          "at": "w-y1",
          "text": "ಹಾಲ್"
         },
         {
          "at": "w-y2",
          "side": "right",
          "text": "ಬಾಲ್ಕನಿ"
         }
        ],
        "ok": {
         "do": [
          "box:c3"
         ]
        }
       },
       {
        "say": "ಬಾಲ್ಕನಿ ದೀಪದ ಹಳದಿ ತಂತಿಯನ್ನು ಎಲ್ ಎರಡಕ್ಕೆ ಜೋಡಿಸು.",
        "tap": "w-y2",
        "glow": "t-L2",
        "hint": "ಬಾಲ್ಕನಿ ದೀಪದ ಹಳದಿ ತಂತಿಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
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
         "say": "ನಾಲ್ಕೂ ತಂತಿಗಳು ಭದ್ರವಾಗಿವೆ."
        }
       }
      ]
     },
     {
      "id": "s7",
      "title": "ವಿದ್ಯುತ್ ಆನ್ ಮಾಡಿ",
      "view": "db",
      "setup": [
       "box:fitted"
      ],
      "tasks": [
       {
        "say": "ತಂತಿಗಳನ್ನು ಒಳಗೆ ಮಡಚಿ ಸ್ವಿಚ್ ಅನ್ನು ಸ್ಕ್ರೂ ಮಾಡು. ನಂತರ ಟ್ಯಾಗ್ ತೆಗೆದು ಎರಡೂ ವಿದ್ಯುತ್ ಮೂಲಗಳನ್ನು ಮರಳಿ ಆನ್ ಮಾಡು.",
        "tap": "lights",
        "hint": "ದೀಪಗಳ ಎಂ.ಸಿ.ಬಿ.ಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
        "ok": {
         "do": [
          "tag:off",
          "lever:lights:on",
          "wifi:blink",
          "readout:pairing"
         ],
         "say": "ಸ್ವಿಚ್‌ನ ಬೆಳಕು ಮಿಟುಕಿಸುತ್ತಿದೆ. ಅದಕ್ಕೆ ವಿದ್ಯುತ್ ಇದೆ ಮತ್ತು ವೈ-ಫೈಗೆ ಸಿದ್ಧವಾಗಿದೆ.",
         "view": "box"
        }
       }
      ]
     },
     {
      "id": "s8",
      "title": "ಫೋನ್‌ನಿಂದ ಪರೀಕ್ಷಿಸಿ",
      "view": "test",
      "setup": [
       "wifi:on",
       "readout:online",
       "pad:1:on",
       "bulb:hall:on"
      ],
      "tasks": [
       {
        "say": "ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಅವರ ಫೋನ್ ಅವರ ಮನೆಯ ವೈ-ಫೈಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ. ಆ್ಯಪ್‌ನಿಂದ ಬಾಲ್ಕನಿ ದೀಪ ಆನ್ ಮಾಡು.",
        "ask": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್",
        "tap": "app-balcony",
        "hint": "ಆ್ಯಪ್‌ನಲ್ಲಿ ಬಾಲ್ಕನಿ ದೀಪವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
        "phone": true,
        "toggles": [
         {
          "id": "app-hall",
          "on": true,
          "text": "ಹಾಲ್ ದೀಪ"
         },
         {
          "id": "app-balcony",
          "on": false,
          "text": "ಬಾಲ್ಕನಿ ದೀಪ"
         }
        ],
        "ok": {
         "do": [
          "pad:2:on",
          "bulb:balcony:on"
         ],
         "say": "ಎರಡೂ ದೀಪಗಳು ಕೆಲಸ ಮಾಡುತ್ತಿವೆ, ಗೋಡೆಯಿಂದಲೂ ಫೋನ್‌ನಿಂದಲೂ."
        }
       }
      ]
     },
     {
      "id": "s9",
      "title": "ಸ್ವಿಚ್ ವಿವರಿಸಿ",
      "view": "test",
      "tasks": [
       {
        "say": "ವೈ-ಫೈ ನಿಂತರೆ ಏನಾಗುತ್ತದೆ ಎಂದು ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಕೇಳುತ್ತಾರೆ. ನೀನು ಅವರಿಗೆ ಏನು ಹೇಳುತ್ತೀಯ?",
        "choices": [
         {
          "text": "ಪ್ಯಾಡ್‌ಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ, ಫೋನ್ ನಿಯಂತ್ರಣ ನಿಲ್ಲುತ್ತದೆ",
          "say": "ಸರಿಯಾಗಿ ಹೇಳಿದೆ. ಪ್ಯಾಡ್‌ಗಳು ಮಾಮೂಲಿ ಸ್ವಿಚ್‌ಗಳ ಹಾಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ. ಫೋನ್ ನಿಯಂತ್ರಣ ಮಾತ್ರ ನಿಲ್ಲುತ್ತದೆ.",
          "pic": "pics/explain-pads.jpg",
          "right": true
         },
         {
          "text": "ದೀಪಗಳು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ",
          "say": "ದೀಪಗಳು ಇನ್ನೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ. ಸ್ವಿಚ್‌ಗೆ ವಿದ್ಯುತ್ ಎಲ್ ಮತ್ತು ಎನ್‌ನಿಂದ ಬರುತ್ತದೆ, ವೈ-ಫೈನಿಂದ ಅಲ್ಲ.",
          "pic": "pics/explain-dark.jpg"
         }
        ]
       },
       {
        "say": "ಸರಿ. ಸ್ವಿಚ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂದು ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಅವರಿಗೆ ಗೊತ್ತಾಯಿತು. ಕೆಲಸ ಮುಗಿಯಿತು!"
       }
      ]
     }
    ]
   }
  ]
 }
};
window.WORKBENCH_LANGS = [{"code": "en", "name": "English"}, {"code": "hi", "name": "हिंदी"}, {"code": "kn", "name": "ಕನ್ನಡ"}];
window.LAB_LINES = {
 "en": {
  "s1_say": "Manju, before any electrical work, what do you put on?",
  "s1_ok": "Good. You are ready to work safely.",
  "s1_optA": "Yes. Rubber does not carry current. Keep your hands dry too.",
  "s1_optB": "The dry floor is not enough. Current can pass through your body into the floor.",
  "s2_say": "Never work on a live wire. Switch off the lights MCB in the distribution board.",
  "s2_ok": "Good. The hall light is off. Hang a tag here, so nobody switches it on.",
  "s2_miss_main": "That cuts power to the whole house. Switch off only the lights circuit.",
  "s2_miss_plugs": "That cuts power to the router, but the hall light stays on. Find the lights MCB.",
  "s3_say": "This house has an inverter for power cuts. What do you do about it?",
  "s3_ok": "The inverter is off, so it cannot send power to these wires.",
  "s3_optA": "Yes. An inverter can send power into the lights even when the MCB is off.",
  "s3_optB": "Careful. The MCB alone is not enough because the inverter can still feed the lights.",
  "s4_say": "Open the switchboard. Check your tester in a live socket, then test the red wire's terminal.",
  "s4_ok": "No glow here. There is no power. Test, then touch, every time.",
  "s5_say": "The smart switch needs neutral power, but this box has no black wire. What will you do?",
  "s5_ok": "Good. The new black neutral now reaches the switchbox.",
  "s5_optA": "Yes. Bring a new black wire from the DB's neutral link through the conduit.",
  "s5_optB": "Never use earth as neutral. Earth is only for safety.",
  "s5_optC": "That will not work. Without neutral, the smart switch gets no power.",
  "s6_say": "The switch has L, N, L1 and L2. L takes incoming power. Which wire goes into L?",
  "s6_ok": "Yes. The red phase goes into L.",
  "s6_optA": "Good. Red is the phase wire that brings power in.",
  "s6_optB": "Black is neutral, Manju. It goes into N.",
  "s6_optC": "Never put green into L. Green is earth and stays for safety.",
  "s6_then1": "Now connect the new black neutral wire to N.",
  "s6_then2": "Connect the hall light's yellow wire to L1.",
  "s6_then3": "Connect the balcony light's yellow wire to L2.",
  "s7_say": "Fold the wires in and screw the switch on. Then remove the tag and restore both power sources.",
  "s7_ok": "The switch light is blinking. It has power and is ready for Wi-Fi.",
  "s8_say": "Lakshmi madam's phone is on her home Wi-Fi. Turn on the balcony light from the app.",
  "s8_ok": "Both lights work, from the wall and from the phone.",
  "s9_say": "Lakshmi madam asks what happens when the Wi-Fi stops. What do you tell her?",
  "s9_ok": "Right. Lakshmi madam knows how the switch works. Job done!",
  "s9_optA": "Exactly. The pads still work like normal switches. Only phone control stops.",
  "s9_optB": "The lights still work. The switch gets power from L and N, not from Wi-Fi.",
  "end": "The smart switch is ready, Manju. Let Lakshmi madam try the balcony light from her phone.",
  "miss": "Not that one. Look for the object glowing gold.",
  "s6_then4": "All four wires are secure.",
  "endhead": "Well done!",
  "s1_tA": "Insulated gloves and safety shoes",
  "s1_tB": "Nothing, the floor is dry",
  "s3_tA": "Switch off the inverter too",
  "s3_tB": "Nothing, the MCB is off",
  "s5_tA": "Bring neutral wire from the DB",
  "s5_tB": "Use the green earth wire",
  "s5_tC": "Fit it without a neutral",
  "s9_tA": "Pads work, phone control stops",
  "s9_tB": "The lights will not work"
 },
 "hi": {
  "s1_say": "मंजू, बिजली का कोई भी काम शुरू करने से पहले तुम क्या पहनते हो?",
  "s1_ok": "अच्छा। अब तुम सुरक्षित ढंग से काम करने के लिए तैयार हो।",
  "s1_optA": "हाँ। रबर से करंट नहीं गुजरता। अपने हाथ भी सूखे रखना।",
  "s1_optB": "सिर्फ़ फ़र्श का सूखा होना काफ़ी नहीं है। करंट तुम्हारे शरीर से होकर फ़र्श तक जा सकता है।",
  "s2_say": "करंट वाले तार पर कभी काम मत करो। डिस्ट्रिब्यूशन बोर्ड में लाइटों की एमसीबी बंद करो।",
  "s2_ok": "अच्छा। हॉल की लाइट बंद है। यहाँ टैग लटका दो, ताकि कोई इसे चालू न करे।",
  "s2_miss_main": "इससे पूरे घर की बिजली कट जाती है। सिर्फ़ लाइटों वाला सर्किट बंद करो।",
  "s2_miss_plugs": "इससे राउटर बंद होता है, पर हॉल की लाइट चालू रहती है। लाइटों की एमसीबी ढूँढ़ो।",
  "s3_say": "इस घर में बिजली जाने पर इन्वर्टर चलता है। इसके लिए तुम क्या करोगे?",
  "s3_ok": "इन्वर्टर बंद है, इसलिए अब वह इन तारों में बिजली नहीं भेज सकता।",
  "s3_optA": "हाँ। एमसीबी बंद होने पर भी इन्वर्टर लाइटों में बिजली भेज सकता है।",
  "s3_optB": "ध्यान से। सिर्फ़ एमसीबी बंद करना काफ़ी नहीं है, क्योंकि इन्वर्टर अब भी लाइटों को बिजली दे सकता है।",
  "s4_say": "स्विचबोर्ड खोलो। पहले चालू सॉकेट में टेस्टर जाँचो, फिर लाल तार का टर्मिनल जाँचो।",
  "s4_ok": "यहाँ टेस्टर नहीं चमका। बिजली नहीं है। पहले जाँच, फिर छूना। हर बार।",
  "s5_say": "स्मार्ट स्विच को न्यूट्रल चाहिए, लेकिन इस बॉक्स में काला तार नहीं है। तुम क्या करोगे?",
  "s5_ok": "अच्छा। नया काला न्यूट्रल तार अब स्विचबॉक्स तक पहुँच गया है।",
  "s5_optA": "हाँ। डीबी की न्यूट्रल लिंक से कंड्यूट के रास्ते नया काला तार लाओ।",
  "s5_optB": "अर्थ को कभी न्यूट्रल मत बनाओ। अर्थ सिर्फ़ सुरक्षा के लिए है।",
  "s5_optC": "यह काम नहीं करेगा। न्यूट्रल के बिना स्मार्ट स्विच को बिजली नहीं मिलेगी।",
  "s6_say": "स्विच पर L, N, L1 और L2 हैं। L में आने वाली बिजली जुड़ती है। L में कौन-सा तार जाएगा?",
  "s6_ok": "हाँ। लाल फ़ेज़ तार L में जाता है।",
  "s6_optA": "अच्छा। लाल फ़ेज़ तार ही बिजली अंदर लाता है।",
  "s6_optB": "मंजू, काला तार न्यूट्रल है। यह N में जाता है।",
  "s6_optC": "हरे तार को कभी L में मत लगाओ। हरा अर्थ तार है और सुरक्षा के लिए रहता है।",
  "s6_then1": "अब नए काले न्यूट्रल तार को N से जोड़ो।",
  "s6_then2": "हॉल की लाइट का पीला तार L1 से जोड़ो।",
  "s6_then3": "बालकनी की लाइट का पीला तार L2 से जोड़ो।",
  "s7_say": "तारों को अंदर मोड़कर स्विच कस दो। फिर टैग हटाकर दोनों बिजली के स्रोत चालू करो।",
  "s7_ok": "स्विच की बत्ती टिमटिमा रही है। इसे बिजली मिल रही है और यह वाई-फ़ाई के लिए तैयार है।",
  "s8_say": "लक्ष्मी मैडम का फ़ोन उनके घर के वाई-फ़ाई से जुड़ा है। ऐप से बालकनी की लाइट चालू करो।",
  "s8_ok": "दोनों लाइटें दीवार के स्विच और फ़ोन, दोनों से चलती हैं।",
  "s9_say": "लक्ष्मी मैडम पूछती हैं कि वाई-फ़ाई बंद हो जाए तो क्या होगा। तुम उन्हें क्या बताओगे?",
  "s9_ok": "सही। लक्ष्मी मैडम समझ गईं कि स्विच कैसे चलता है। काम पूरा!",
  "s9_optA": "बिलकुल। पैड सामान्य स्विच की तरह चलते रहेंगे। सिर्फ़ फ़ोन से चलाना बंद होगा।",
  "s9_optB": "लाइटें फिर भी चलेंगी। स्विच को बिजली L और N से मिलती है, वाई-फ़ाई से नहीं।",
  "end": "स्मार्ट स्विच तैयार है, मंजू। अब लक्ष्मी मैडम को फ़ोन से बालकनी की लाइट चलाने दो।",
  "miss": "यह नहीं। सुनहरी चमक वाली चीज़ ढूँढ़ो।",
  "s6_then4": "चारों तार अच्छी तरह कस गए हैं।",
  "endhead": "शाबाश!",
  "s1_tA": "इंसुलेटेड दस्ताने और सेफ़्टी जूते",
  "s1_tB": "कुछ नहीं, फ़र्श सूखा है",
  "s3_tA": "इन्वर्टर भी बंद करें",
  "s3_tB": "कुछ नहीं, एमसीबी बंद है",
  "s5_tA": "डीबी से न्यूट्रल तार लाएँ",
  "s5_tB": "हरा अर्थ तार लगाएँ",
  "s5_tC": "न्यूट्रल के बिना लगा दें",
  "s9_tA": "पैड चलेंगे, फ़ोन से चलाना बंद होगा",
  "s9_tB": "लाइटें काम नहीं करेंगी"
 },
 "kn": {
  "s1_say": "ಮಂಜು, ಯಾವುದೇ ವಿದ್ಯುತ್ ಕೆಲಸ ಶುರು ಮಾಡುವ ಮೊದಲು ನೀನು ಏನನ್ನು ಧರಿಸುತ್ತೀಯ?",
  "s1_ok": "ಒಳ್ಳೆಯದು. ನೀನು ಸುರಕ್ಷಿತವಾಗಿ ಕೆಲಸ ಮಾಡಲು ಸಿದ್ಧನಾಗಿದ್ದೀಯ.",
  "s1_optA": "ಹೌದು. ರಬ್ಬರ್ ವಿದ್ಯುತ್ ಹರಿಸುವುದಿಲ್ಲ. ನಿನ್ನ ಕೈಗಳನ್ನೂ ಒಣಗಿಸಿಕೊಂಡಿರು.",
  "s1_optB": "ಒಣ ನೆಲ ಸಾಕಾಗುವುದಿಲ್ಲ. ವಿದ್ಯುತ್ ನಿನ್ನ ದೇಹದ ಮೂಲಕ ನೆಲಕ್ಕೆ ಹರಿಯಬಹುದು.",
  "s2_say": "ಜೀವಂತ ತಂತಿಯ ಮೇಲೆ ಎಂದಿಗೂ ಕೆಲಸ ಮಾಡಬೇಡ. ಡಿಸ್ಟ್ರಿಬ್ಯೂಷನ್ ಬೋರ್ಡ್‌ನಲ್ಲಿ ದೀಪಗಳ ಎಂ.ಸಿ.ಬಿ. ಆಫ್ ಮಾಡು.",
  "s2_ok": "ಒಳ್ಳೆಯದು. ಹಾಲ್ ದೀಪ ಆಫ್ ಆಗಿದೆ. ಇಲ್ಲಿ ಒಂದು ಟ್ಯಾಗ್ ತೂಗು ಹಾಕು, ಯಾರೂ ಅದನ್ನು ಆನ್ ಮಾಡದಂತೆ.",
  "s2_miss_main": "ಅದು ಇಡೀ ಮನೆಯ ವಿದ್ಯುತ್ ಕಡಿತಗೊಳಿಸುತ್ತದೆ. ದೀಪಗಳ ಸರ್ಕ್ಯೂಟ್ ಮಾತ್ರ ಆಫ್ ಮಾಡು.",
  "s2_miss_plugs": "ಅದು ರೂಟರ್‌ಗೆ ವಿದ್ಯುತ್ ಕಡಿತಗೊಳಿಸುತ್ತದೆ, ಆದರೆ ಹಾಲ್ ದೀಪ ಹಾಗೆಯೇ ಉರಿಯುತ್ತದೆ. ದೀಪಗಳ ಎಂ.ಸಿ.ಬಿ. ಹುಡುಕು.",
  "s3_say": "ಈ ಮನೆಯಲ್ಲಿ ಕರೆಂಟ್ ಹೋದಾಗ ಬಳಸಲು ಇನ್ವರ್ಟರ್ ಇದೆ. ಅದರ ಬಗ್ಗೆ ನೀನು ಏನು ಮಾಡುತ್ತೀಯ?",
  "s3_ok": "ಇನ್ವರ್ಟರ್ ಆಫ್ ಆಗಿದೆ, ಹಾಗಾಗಿ ಅದು ಈ ತಂತಿಗಳಿಗೆ ವಿದ್ಯುತ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
  "s3_optA": "ಹೌದು. ಎಂ.ಸಿ.ಬಿ. ಆಫ್ ಇದ್ದರೂ ಇನ್ವರ್ಟರ್ ದೀಪಗಳಿಗೆ ವಿದ್ಯುತ್ ಕಳುಹಿಸಬಹುದು.",
  "s3_optB": "ಜಾಗರೂಕ. ಎಂ.ಸಿ.ಬಿ. ಒಂದೇ ಸಾಕಾಗುವುದಿಲ್ಲ, ಏಕೆಂದರೆ ಇನ್ವರ್ಟರ್ ಇನ್ನೂ ದೀಪಗಳಿಗೆ ವಿದ್ಯುತ್ ಕೊಡಬಹುದು.",
  "s4_say": "ಸ್ವಿಚ್‌ಬೋರ್ಡ್ ತೆರೆ. ಮೊದಲು ನಿನ್ನ ಟೆಸ್ಟರ್ ಅನ್ನು ಜೀವಂತ ಸಾಕೆಟ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸು, ನಂತರ ಕೆಂಪು ತಂತಿಯ ಟರ್ಮಿನಲ್ ಪರೀಕ್ಷಿಸು.",
  "s4_ok": "ಇಲ್ಲಿ ಬೆಳಕಿಲ್ಲ. ವಿದ್ಯುತ್ ಇಲ್ಲ. ಮೊದಲು ಪರೀಕ್ಷಿಸು, ಆಮೇಲೆ ಮುಟ್ಟು, ಪ್ರತಿ ಬಾರಿಯೂ.",
  "s5_say": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್‌ಗೆ ನ್ಯೂಟ್ರಲ್ ವಿದ್ಯುತ್ ಬೇಕು, ಆದರೆ ಈ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಕಪ್ಪು ತಂತಿ ಇಲ್ಲ. ನೀನು ಏನು ಮಾಡುತ್ತೀಯ?",
  "s5_ok": "ಒಳ್ಳೆಯದು. ಹೊಸ ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್ ಈಗ ಸ್ವಿಚ್‌ಬಾಕ್ಸ್‌ಗೆ ತಲುಪಿದೆ.",
  "s5_optA": "ಹೌದು. ಡಿ.ಬಿ.ಯ ನ್ಯೂಟ್ರಲ್ ಲಿಂಕ್‌ನಿಂದ ಕಂಡ್ಯೂಟ್ ಮೂಲಕ ಹೊಸ ಕಪ್ಪು ತಂತಿಯನ್ನು ತೆಗೆದುಕೊಂಡು ಬಾ.",
  "s5_optB": "ಅರ್ಥ್ ಅನ್ನು ನ್ಯೂಟ್ರಲ್ ಆಗಿ ಎಂದಿಗೂ ಬಳಸಬೇಡ. ಅರ್ಥ್ ಇರುವುದು ಸುರಕ್ಷತೆಗೆ ಮಾತ್ರ.",
  "s5_optC": "ಅದು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. ನ್ಯೂಟ್ರಲ್ ಇಲ್ಲದಿದ್ದರೆ ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್‌ಗೆ ವಿದ್ಯುತ್ ಸಿಗುವುದಿಲ್ಲ.",
  "s6_say": "ಸ್ವಿಚ್‌ನಲ್ಲಿ ಎಲ್, ಎನ್, ಎಲ್ ಒಂದು ಮತ್ತು ಎಲ್ ಎರಡು ಇವೆ. ಎಲ್‌ಗೆ ಒಳಬರುವ ವಿದ್ಯುತ್ ಹೋಗುತ್ತದೆ. ಯಾವ ತಂತಿ ಎಲ್‌ಗೆ ಹೋಗಬೇಕು?",
  "s6_ok": "ಹೌದು. ಕೆಂಪು ಫೇಸ್ ತಂತಿ ಎಲ್‌ಗೆ ಹೋಗುತ್ತದೆ.",
  "s6_optA": "ಒಳ್ಳೆಯದು. ಕೆಂಪು ವಿದ್ಯುತ್ ತರುವ ಫೇಸ್ ತಂತಿ.",
  "s6_optB": "ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್, ಮಂಜು. ಅದು ಎನ್‌ಗೆ ಹೋಗುತ್ತದೆ.",
  "s6_optC": "ಹಸಿರನ್ನು ಎಂದಿಗೂ ಎಲ್‌ಗೆ ಹಾಕಬೇಡ. ಹಸಿರು ಅರ್ಥ್, ಅದು ಸುರಕ್ಷತೆಗಾಗಿ ಇರುತ್ತದೆ.",
  "s6_then1": "ಈಗ ಹೊಸ ಕಪ್ಪು ನ್ಯೂಟ್ರಲ್ ತಂತಿಯನ್ನು ಎನ್‌ಗೆ ಜೋಡಿಸು.",
  "s6_then2": "ಹಾಲ್ ದೀಪದ ಹಳದಿ ತಂತಿಯನ್ನು ಎಲ್ ಒಂದಕ್ಕೆ ಜೋಡಿಸು.",
  "s6_then3": "ಬಾಲ್ಕನಿ ದೀಪದ ಹಳದಿ ತಂತಿಯನ್ನು ಎಲ್ ಎರಡಕ್ಕೆ ಜೋಡಿಸು.",
  "s7_say": "ತಂತಿಗಳನ್ನು ಒಳಗೆ ಮಡಚಿ ಸ್ವಿಚ್ ಅನ್ನು ಸ್ಕ್ರೂ ಮಾಡು. ನಂತರ ಟ್ಯಾಗ್ ತೆಗೆದು ಎರಡೂ ವಿದ್ಯುತ್ ಮೂಲಗಳನ್ನು ಮರಳಿ ಆನ್ ಮಾಡು.",
  "s7_ok": "ಸ್ವಿಚ್‌ನ ಬೆಳಕು ಮಿಟುಕಿಸುತ್ತಿದೆ. ಅದಕ್ಕೆ ವಿದ್ಯುತ್ ಇದೆ ಮತ್ತು ವೈ-ಫೈಗೆ ಸಿದ್ಧವಾಗಿದೆ.",
  "s8_say": "ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಅವರ ಫೋನ್ ಅವರ ಮನೆಯ ವೈ-ಫೈಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ. ಆ್ಯಪ್‌ನಿಂದ ಬಾಲ್ಕನಿ ದೀಪ ಆನ್ ಮಾಡು.",
  "s8_ok": "ಎರಡೂ ದೀಪಗಳು ಕೆಲಸ ಮಾಡುತ್ತಿವೆ, ಗೋಡೆಯಿಂದಲೂ ಫೋನ್‌ನಿಂದಲೂ.",
  "s9_say": "ವೈ-ಫೈ ನಿಂತರೆ ಏನಾಗುತ್ತದೆ ಎಂದು ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಕೇಳುತ್ತಾರೆ. ನೀನು ಅವರಿಗೆ ಏನು ಹೇಳುತ್ತೀಯ?",
  "s9_ok": "ಸರಿ. ಸ್ವಿಚ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂದು ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಅವರಿಗೆ ಗೊತ್ತಾಯಿತು. ಕೆಲಸ ಮುಗಿಯಿತು!",
  "s9_optA": "ಸರಿಯಾಗಿ ಹೇಳಿದೆ. ಪ್ಯಾಡ್‌ಗಳು ಮಾಮೂಲಿ ಸ್ವಿಚ್‌ಗಳ ಹಾಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ. ಫೋನ್ ನಿಯಂತ್ರಣ ಮಾತ್ರ ನಿಲ್ಲುತ್ತದೆ.",
  "s9_optB": "ದೀಪಗಳು ಇನ್ನೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ. ಸ್ವಿಚ್‌ಗೆ ವಿದ್ಯುತ್ ಎಲ್ ಮತ್ತು ಎನ್‌ನಿಂದ ಬರುತ್ತದೆ, ವೈ-ಫೈನಿಂದ ಅಲ್ಲ.",
  "end": "ಸ್ಮಾರ್ಟ್ ಸ್ವಿಚ್ ಸಿದ್ಧವಾಗಿದೆ, ಮಂಜು. ಈಗ ಲಕ್ಷ್ಮಿ ಮೇಡಂ ಅವರು ತಮ್ಮ ಫೋನ್‌ನಿಂದ ಬಾಲ್ಕನಿ ದೀಪ ಹಚ್ಚಿ ನೋಡಲಿ.",
  "miss": "ಅದಲ್ಲ. ಚಿನ್ನದ ಬಣ್ಣದಲ್ಲಿ ಹೊಳೆಯುತ್ತಿರುವ ವಸ್ತುವನ್ನು ಹುಡುಕು.",
  "s6_then4": "ನಾಲ್ಕೂ ತಂತಿಗಳು ಭದ್ರವಾಗಿವೆ.",
  "endhead": "ಶಭಾಷ್!",
  "s1_tA": "ಇನ್ಸುಲೇಟೆಡ್ ಗ್ಲೌಸ್ ಮತ್ತು ಸೇಫ್ಟಿ ಶೂಗಳು",
  "s1_tB": "ಏನೂ ಇಲ್ಲ, ನೆಲ ಒಣಗಿದೆ",
  "s3_tA": "ಇನ್ವರ್ಟರ್ ಕೂಡ ಆಫ್ ಮಾಡು",
  "s3_tB": "ಏನೂ ಇಲ್ಲ, ಎಂ.ಸಿ.ಬಿ. ಆಫ್ ಇದೆ",
  "s5_tA": "ಡಿ.ಬಿ.ಯಿಂದ ನ್ಯೂಟ್ರಲ್ ತಂತಿ ತರು",
  "s5_tB": "ಹಸಿರು ಅರ್ಥ್ ತಂತಿ ಬಳಸು",
  "s5_tC": "ನ್ಯೂಟ್ರಲ್ ಇಲ್ಲದೆಯೇ ಅಳವಡಿಸು",
  "s9_tA": "ಪ್ಯಾಡ್‌ಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ, ಫೋನ್ ನಿಯಂತ್ರಣ ನಿಲ್ಲುತ್ತದೆ",
  "s9_tB": "ದೀಪಗಳು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ"
 }
};
window.LAB_UI_HI = {"back": "पीछे", "mute": "आवाज़ बंद", "next": "आगे", "step": "कदम {n}, कुल {total}", "begin": "काम शुरू करें", "sound": "आवाज़", "finish": "पूरा करें", "listen": "सुनें", "replay": "फिर सुनें", "showMe": "मुझे दिखाएँ", "chapter": "काम", "doneTag": "पूरा", "notThat": "यह नहीं। {hint}।", "chapters": "कदम", "readout_on": "ख़तरा: बिजली चालू", "readout_off": "बिजली बंद", "end_again": "फिर अभ्यास करें", "end_clean": "आपने हर कदम सही किया।", "end_mistakes": "इनका फिर अभ्यास करें", "continue": "आगे बढ़ें", "do_again": "फिर करें"};
window.LAB_UI_KN = {"back": "ಹಿಂದೆ", "mute": "ಮ್ಯೂಟ್", "next": "ಮುಂದೆ", "step": "ಹಂತ {n} / {total}", "begin": "ಕೆಲಸ ಶುರು ಮಾಡಿ", "sound": "ಧ್ವನಿ", "finish": "ಮುಗಿಸಿ", "listen": "ಕೇಳಿ", "replay": "ಮತ್ತೆ ಕೇಳಿ", "showMe": "ನನಗೆ ತೋರಿಸಿ", "chapter": "ಕೆಲಸ", "doneTag": "ಮುಗಿದಿದೆ", "notThat": "ಅದಲ್ಲ. {hint}.", "chapters": "ಹಂತಗಳು", "readout_on": "ಅಪಾಯ: ವಿದ್ಯುತ್ ಆನ್", "readout_off": "ವಿದ್ಯುತ್ ಆಫ್", "end_again": "ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಿ", "end_clean": "ನೀವು ಪ್ರತಿ ಹಂತವನ್ನೂ ಸರಿಯಾಗಿ ಮಾಡಿದಿರಿ.", "end_mistakes": "ಇವುಗಳನ್ನು ಮತ್ತೆ ಅಭ್ಯಾಸ ಮಾಡಿ", "continue": "ಮುಂದುವರಿಸಿ", "do_again": "ಮತ್ತೆ ಮಾಡಿ"};
