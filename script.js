/* =========================================
   نافذة How To Play
   ========================================= */
const howBtn = document.getElementById('how-button');
const modal = document.getElementById('how-to-play-modal');
const okBtn = document.getElementById('ok-btn');

howBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
});

function closeModal() {
    modal.classList.remove('active');
}

okBtn.addEventListener('click', closeModal);

// إغلاق النافذة عند الضغط في أي مكان خارجي
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

/* =========================================
   إعدادات اللعبة
   ========================================= */
const DAYS_PER_LEVEL = 10;
const EVENTS_PER_DAY = 2;
const START_STATE = { oxygen: 80, power: 65, food: 70, radiation: 20 };
const ICONS = { oxygen: '💨', power: '⚡', food: '🍎', radiation: '☢️' };

// ===== أسئلة المستوى السهل (10) =====
const EASY_EVENTS = [
    {
        title: '⚠️ SOLAR STORM ALERT! ⚠️',
        desc: 'A solar storm is heading for the base. Every choice has a price.',
        choices: [
            { label: 'Increase Shielding', type: 'shield', text: 'Shields up! The crew is safe, but it costs energy.', effects: { radiation: -25, power: -15 } },
            { label: 'Save Power', type: 'power', text: 'Power is saved, but radiation leaks in.', effects: { power: 10, radiation: 25 } },
            { label: 'Improve Food', type: 'food', text: 'The greenhouse is boosted, but the storm hurts the base.', effects: { food: 12, radiation: 15, oxygen: -5 } }
        ]
    },
    {
        title: '🌪️ DUST STORM!',
        desc: 'Martian dust is covering the solar panels.',
        choices: [
            { label: 'Clean Panels', type: 'power', text: 'The panels are clean again, but the crew spent oxygen outside.', effects: { power: 20, oxygen: -8 } },
            { label: 'Use Backup Battery', type: 'power', text: 'The backup holds, but you used up some food rations.', effects: { power: 10, food: -5 } },
            { label: 'Wait Inside', type: 'shield', text: 'Safe inside the base, but power keeps dropping.', effects: { power: -15, radiation: -5 } }
        ]
    },
    {
        title: '🔧 OXYGEN GENERATOR FAULT',
        desc: 'The oxygen generator is working at half capacity.',
        choices: [
            { label: 'Repair It', type: 'power', text: 'Repaired! It took a lot of power.', effects: { oxygen: 20, power: -15 } },
            { label: 'Open Reserve Tanks', type: 'shield', text: 'Reserve tanks give you some air, but not for long.', effects: { oxygen: 12, radiation: 5 } },
            { label: 'Reduce Activity', type: 'food', text: 'The crew rests. Less air used, less food used.', effects: { oxygen: 6, food: 5, power: -5 } }
        ]
    },
    {
        title: '🌱 GREENHOUSE HARVEST',
        desc: 'The first harvest is ready. How will you use it?',
        choices: [
            { label: 'Expand Greenhouse', type: 'food', text: 'More plants means more food and more oxygen.', effects: { food: 20, oxygen: 5, power: -10 } },
            { label: 'Eat Now', type: 'food', text: 'The crew is well fed today.', effects: { food: 15 } },
            { label: 'Sell to Storage', type: 'power', text: 'Stored for later, and power use goes down.', effects: { food: 8, power: 8, oxygen: -3 } }
        ]
    },
    {
        title: '☄️ METEOR SHOWER',
        desc: 'Small meteors are hitting the base walls.',
        choices: [
            { label: 'Reinforce Walls', type: 'shield', text: 'The walls hold strong.', effects: { radiation: -10, power: -10, oxygen: 3 } },
            { label: 'Move to Shelter', type: 'shield', text: 'The crew is safe, but the greenhouse is damaged.', effects: { food: -10, radiation: -5 } },
            { label: 'Ignore It', type: 'power', text: 'Risky! A small leak lets oxygen escape.', effects: { oxygen: -15, power: 5 } }
        ]
    },
    {
        title: '💧 WATER RECYCLER FAILURE',
        desc: 'The water recycler stopped. Plants and air depend on it.',
        choices: [
            { label: 'Fix the Recycler', type: 'power', text: 'Water is flowing again.', effects: { food: 10, oxygen: 8, power: -12 } },
            { label: 'Ration Water', type: 'food', text: 'The plants suffer, but you save power.', effects: { food: -8, power: 10 } },
            { label: 'Melt Ice Samples', type: 'power', text: 'It works, but the heater uses a lot of energy.', effects: { oxygen: 10, power: -18, food: 5 } }
        ]
    },
    {
        title: '📡 RADIATION SPIKE',
        desc: 'Sensors detect a sudden rise in radiation levels.',
        choices: [
            { label: 'Seal the Safe Room', type: 'shield', text: 'The crew is protected inside the safe room.', effects: { radiation: -20, oxygen: -6 } },
            { label: 'Boost Shields', type: 'shield', text: 'Strong shields, but a big power cost.', effects: { radiation: -30, power: -20 } },
            { label: 'Keep Working', type: 'food', text: 'Work goes on, but the radiation rises.', effects: { food: 10, power: 5, radiation: 20 } }
        ]
    },
    {
        title: '🛰️ SUPPLY DROP',
        desc: 'A supply capsule landed near the base!',
        choices: [
            { label: 'Take Oxygen Tanks', type: 'shield', text: 'Fresh air for the crew.', effects: { oxygen: 25 } },
            { label: 'Take Solar Cells', type: 'power', text: 'More power for the base.', effects: { power: 25 } },
            { label: 'Take Food Packs', type: 'food', text: 'Full bellies, happy crew.', effects: { food: 25 } }
        ]
    },
    {
        title: '🧑‍🔧 ROUTINE MAINTENANCE',
        desc: 'It is a quiet day. Which system gets the crew\'s attention?',
        choices: [
            { label: 'Check Oxygen System', type: 'shield', text: 'The air system runs better now.', effects: { oxygen: 10, power: -5 } },
            { label: 'Check Solar Panels', type: 'power', text: 'The panels work at full power.', effects: { power: 12, food: -4 } },
            { label: 'Check Greenhouse', type: 'food', text: 'The plants are healthy and growing.', effects: { food: 12, power: -5 } }
        ]
    },
    {
        title: '🌤️ CALM DAY',
        desc: 'No alarms today. The crew can use the time wisely.',
        choices: [
            { label: 'Rest and Recover', type: 'food', text: 'A rested crew uses resources better.', effects: { food: 8, oxygen: 4 } },
            { label: 'Boost Power Reserves', type: 'power', text: 'More energy stored for bad days.', effects: { power: 15, food: -5 } },
            { label: 'Extra Shield Check', type: 'shield', text: 'The shields are in great shape.', effects: { radiation: -12, power: -6 } }
        ]
    }
];

// ===== أسئلة المستوى المتوسط (10) =====
const MEDIUM_EVENTS = [
    {
        title: '🔥 FIRE IN THE LAB',
        desc: 'Smoke is filling the science module. Act fast!',
        choices: [
            { label: 'Use Extinguishers', type: 'shield', text: 'The fire is out, but supplies and air were used.', effects: { oxygen: -5, power: -8 } },
            { label: 'Vent the Module', type: 'shield', text: 'The fire dies, but you lose a lot of air.', effects: { oxygen: -15, power: 5 } },
            { label: 'Cut the Power', type: 'power', text: 'The fire stops, but the base loses energy.', effects: { power: -20, oxygen: 5 } }
        ]
    },
    {
        title: '🧊 FROZEN PIPES',
        desc: 'The night was too cold. The water pipes are frozen.',
        choices: [
            { label: 'Heat the Pipes', type: 'power', text: 'The water flows again, at a high energy cost.', effects: { power: -18, food: 8 } },
            { label: 'Replace a Section', type: 'food', text: 'A repair outside costs air and power.', effects: { food: 5, power: -8, oxygen: -5 } },
            { label: 'Wait for Daytime', type: 'shield', text: 'The plants suffer while you wait.', effects: { food: -12, power: 5 } }
        ]
    },
    {
        title: '🚜 ROVER BREAKDOWN',
        desc: 'The rover stopped far from the base.',
        choices: [
            { label: 'Repair in the Field', type: 'shield', text: 'Fixed, but the crew was exposed outside.', effects: { oxygen: -12, radiation: 10, power: 8 } },
            { label: 'Tow it Back', type: 'power', text: 'It costs a lot of energy to bring it home.', effects: { power: -15, food: 5 } },
            { label: 'Abandon the Rover', type: 'food', text: 'You save power, but lose the supplies on board.', effects: { power: 5, food: -10 } }
        ]
    },
    {
        title: '🌡️ GREENHOUSE HEATER FAILS',
        desc: 'The plants are getting too cold.',
        choices: [
            { label: 'Emergency Heating', type: 'power', text: 'The crops survive, but the heater drains the batteries.', effects: { food: 15, power: -20 } },
            { label: 'Harvest Early', type: 'food', text: 'You save some food, but the plants stop making air.', effects: { food: 10, oxygen: -6 } },
            { label: 'Cover the Plants', type: 'shield', text: 'A cheap fix that only protects part of the crop.', effects: { food: 5, power: -5, radiation: -5 } }
        ]
    },
    {
        title: '📻 EARTH COMMS BLACKOUT',
        desc: 'You lost contact with mission control.',
        choices: [
            { label: 'Boost the Antenna', type: 'power', text: 'Contact returns, and Earth sends advice.', effects: { power: -14, food: 6 } },
            { label: 'Switch to Backup', type: 'power', text: 'The backup works but wastes some air.', effects: { power: -6, oxygen: -6 } },
            { label: 'Wait It Out', type: 'food', text: 'The crew works alone, with more risk.', effects: { food: 8, power: 5, radiation: 10 } }
        ]
    },
    {
        title: '🌀 AIR FILTER CLOGGED',
        desc: 'Dust is blocking the air filters.',
        choices: [
            { label: 'Replace the Filter', type: 'power', text: 'Clean air, but the new filter uses power.', effects: { oxygen: 18, power: -12 } },
            { label: 'Clean Manually', type: 'shield', text: 'It works, but takes time from other jobs.', effects: { oxygen: 10, radiation: 8, food: -5 } },
            { label: 'Run Both Fans', type: 'power', text: 'Lots of air, lots of power used.', effects: { oxygen: 14, power: -18 } }
        ]
    },
    {
        title: '🌋 MARSQUAKE',
        desc: 'The ground is shaking under the base.',
        choices: [
            { label: 'Check the Structure', type: 'shield', text: 'No big damage, but the checks cost power.', effects: { power: -10, radiation: -5, oxygen: -3 } },
            { label: 'Evacuate to Shelter', type: 'shield', text: 'The crew is safe, but the greenhouse is left alone.', effects: { food: -8, oxygen: -8 } },
            { label: 'Ignore It', type: 'power', text: 'A crack opens and air leaks out.', effects: { oxygen: -14, radiation: 12 } }
        ]
    },
    {
        title: '🚨 MEDICAL EMERGENCY',
        desc: 'A crew member is sick and needs care.',
        choices: [
            { label: 'Use Medical Supplies', type: 'food', text: 'The crew member recovers, but supplies are low.', effects: { food: -12, radiation: -8 } },
            { label: 'Rest the Crew', type: 'food', text: 'Everyone rests, but systems get less care.', effects: { food: 6, power: -8, oxygen: -6 } },
            { label: 'Continue the Mission', type: 'power', text: 'Work goes on, but the crew is weaker.', effects: { power: 8, radiation: 15, food: -5 } }
        ]
    },
    {
        title: '⚡ POWER SURGE',
        desc: 'A sudden power spike is hitting your systems.',
        choices: [
            { label: 'Shut Down Systems', type: 'power', text: 'Systems are safe, but you lose energy.', effects: { power: -15, radiation: -5 } },
            { label: 'Reroute the Power', type: 'power', text: 'You keep energy, but air systems slow down.', effects: { power: 5, oxygen: -10 } },
            { label: 'Use Surge Protector', type: 'shield', text: 'The protector absorbs the hit.', effects: { power: -8, oxygen: 5 } }
        ]
    },
    {
        title: '🧪 SOIL CONTAMINATION',
        desc: 'Something is wrong with the soil in the greenhouse.',
        choices: [
            { label: 'Replace the Soil', type: 'food', text: 'Healthy soil, but a lot of work.', effects: { food: 12, oxygen: -6, power: -6 } },
            { label: 'Filter It', type: 'power', text: 'A slow process that uses power.', effects: { food: 6, power: -12 } },
            { label: 'Use Fertilizer', type: 'food', text: 'More food now, with side effects.', effects: { food: 15, radiation: 10, oxygen: -8 } }
        ]
    }
];

// ===== أسئلة المستوى الصعب (10) =====
const HARD_EVENTS = [
    {
        title: '☀️ MEGA SOLAR FLARE',
        desc: 'The biggest flare yet is coming. Radiation will be extreme.',
        choices: [
            { label: 'Full Shield Mode', type: 'shield', text: 'The crew survives, but the batteries are almost empty.', effects: { radiation: -35, power: -25 } },
            { label: 'Hide in the Bunker', type: 'shield', text: 'Safe underground, but air and food are used up.', effects: { radiation: -20, oxygen: -15, food: -8 } },
            { label: 'Stay at Posts', type: 'power', text: 'Work continues, with huge radiation.', effects: { radiation: 30, power: 10 } }
        ]
    },
    {
        title: '💥 HULL BREACH',
        desc: 'A meteor punched a hole in the habitat wall.',
        choices: [
            { label: 'Seal the Hole', type: 'shield', text: 'Fixed, but air escaped and power was used.', effects: { oxygen: -12, power: -15 } },
            { label: 'Seal the Whole Module', type: 'shield', text: 'The base is safe, but a lot of air is lost.', effects: { oxygen: -22, radiation: -5 } },
            { label: 'Patch It Quickly', type: 'food', text: 'A weak patch. Air keeps leaking.', effects: { oxygen: -18, food: 5, power: 5 } }
        ]
    },
    {
        title: '🔋 BATTERY CELL EXPLOSION',
        desc: 'One of the main battery cells has exploded.',
        choices: [
            { label: 'Isolate the Damaged Cell', type: 'power', text: 'The damage stops, but you lose energy.', effects: { power: -20, radiation: -5 } },
            { label: 'Switch to Solar Only', type: 'power', text: 'You keep going, but food production slows.', effects: { power: -12, food: -6 } },
            { label: 'Keep Running', type: 'power', text: 'Risky! Air systems and shields suffer.', effects: { power: 5, oxygen: -14, radiation: 10 } }
        ]
    },
    {
        title: '🥀 CROP DISEASE',
        desc: 'A disease is spreading through the greenhouse.',
        choices: [
            { label: 'Burn Infected Plants', type: 'food', text: 'You stop the disease but lose half the crop.', effects: { food: -15, oxygen: 5 } },
            { label: 'Treat the Crops', type: 'food', text: 'The treatment needs power and air.', effects: { food: 8, power: -15, oxygen: -6 } },
            { label: 'Use Emergency Rations', type: 'food', text: 'The crew eats, but the base pays for it.', effects: { food: 20, oxygen: -10, power: -5 } }
        ]
    },
    {
        title: '🌫️ TOXIC DUST IN THE AIRLOCK',
        desc: 'Dangerous dust came inside with the crew.',
        choices: [
            { label: 'Deep Clean', type: 'shield', text: 'The air is clean again, at a high cost.', effects: { oxygen: -10, power: -12, radiation: -5 } },
            { label: 'Seal the Airlock', type: 'shield', text: 'Safe, but no one can go outside for food.', effects: { oxygen: -6, food: -10 } },
            { label: 'Filter Overload', type: 'power', text: 'The filters clean the air but burn power.', effects: { oxygen: 12, power: -22 } }
        ]
    },
    {
        title: '🛠️ LIFE SUPPORT CASCADE FAILURE',
        desc: 'Three systems are failing at once. You can only fix one first.',
        choices: [
            { label: 'Fix Oxygen First', type: 'power', text: 'The crew can breathe, but power and food suffer.', effects: { oxygen: 25, power: -20, food: -8 } },
            { label: 'Fix Power First', type: 'power', text: 'Power is back, but the air gets thin.', effects: { power: 25, oxygen: -18 } },
            { label: 'Fix Food First', type: 'food', text: 'Food is safe, but the other systems are weak.', effects: { food: 25, oxygen: -15, power: -10 } }
        ]
    },
    {
        title: '🌑 LONG DUST STORM',
        desc: 'The sky is dark. This storm may last for days.',
        choices: [
            { label: 'Ration Everything', type: 'food', text: 'Everyone has less, but you last longer.', effects: { power: 8, food: -8, oxygen: -8 } },
            { label: 'Run the Generators', type: 'power', text: 'Systems run well, but fuel is burned.', effects: { power: -12, oxygen: 10, food: 8 } },
            { label: 'Wait It Out', type: 'shield', text: 'The crew waits in the dark and the batteries drain.', effects: { power: -18, radiation: -5, food: -5 } }
        ]
    },
    {
        title: '📦 DAMAGED SUPPLY DROP',
        desc: 'A capsule crashed. You can save only one kind of supply.',
        choices: [
            { label: 'Salvage Oxygen', type: 'shield', text: 'Some tanks are safe, but they leak a bit.', effects: { oxygen: 15, power: -8, radiation: 5 } },
            { label: 'Salvage Power Cells', type: 'power', text: 'You recover energy, and lose air and food time.', effects: { power: 15, oxygen: -6, food: -5 } },
            { label: 'Salvage Food', type: 'food', text: 'Food is saved, but it was a long job.', effects: { food: 15, power: -8, oxygen: -5 } }
        ]
    },
    {
        title: '🧬 RADIATION BELT CROSSING',
        desc: 'The base is moving through a high-radiation zone.',
        choices: [
            { label: 'Max Shielding', type: 'shield', text: 'Very safe, but the batteries take a big hit.', effects: { radiation: -25, power: -22 } },
            { label: 'Partial Shielding', type: 'shield', text: 'A balanced choice with some risk.', effects: { radiation: -10, power: -10 } },
            { label: 'Rush Through', type: 'power', text: 'Fast, but the crew gets a big dose.', effects: { radiation: 25, power: 5, oxygen: 5 } }
        ]
    },
    {
        title: '🚀 SUPPLY SHIP DELAYED',
        desc: 'The next supply ship will arrive late. You must stretch your supplies.',
        choices: [
            { label: 'Cut All Extras', type: 'power', text: 'Power is saved, but the crew gets less of everything.', effects: { power: 10, oxygen: -6, food: -6 } },
            { label: 'Reduce Crew Activity', type: 'food', text: 'Less work means less air and food needed.', effects: { oxygen: 6, food: 8, power: -14 } },
            { label: 'Use the Reserves', type: 'shield', text: 'Reserves help now, but the batteries pay.', effects: { oxygen: 12, food: 12, power: -20 } }
        ]
    }
];

// المستويات: كل مستوى له أسئلته الخاصة (events)
// daily = الاستهلاك اليومي، good = ضرب المكاسب، bad = ضرب الخسائر
const LEVELS = [
    { name: 'EASY', events: EASY_EVENTS, daily: { oxygen: -6, power: -4, food: -5, radiation: -2 }, good: 1, bad: 1 },
    { name: 'MEDIUM', events: MEDIUM_EVENTS, daily: { oxygen: -7, power: -5, food: -6, radiation: -1 }, good: 0.9, bad: 1.2 },
    { name: 'HARD', events: HARD_EVENTS, daily: { oxygen: -8, power: -6, food: -7, radiation: 0 }, good: 0.8, bad: 1.4 }
];

/* =========================================
   العناصر
   ========================================= */
const startBtn = document.getElementById('start-button');
const gameScreen = document.getElementById('game-screen');
const failScreen = document.getElementById('fail-screen');
const successScreen = document.getElementById('success-screen');
const levelScreen = document.getElementById('level-screen');
const eventModal = document.getElementById('event-modal');
const resultModal = document.getElementById('result-modal');
const eventTitle = document.getElementById('event-title');
const eventDesc = document.getElementById('event-desc');
const eventChoices = document.getElementById('event-choices');
const questionCount = document.getElementById('question-count');
const resultText = document.getElementById('result-text');
const resultChanges = document.getElementById('result-changes');
const nextDayBtn = document.getElementById('next-day-btn');
const retryBtn = document.getElementById('retry-btn');
const menuBtn = document.getElementById('menu-btn');
const homeBtn = document.getElementById('home-btn');
const levelTitle = document.getElementById('level-title');
const levelText = document.getElementById('level-text');
const nextLevelBtn = document.getElementById('next-level-btn');
const dayCount = document.getElementById('day-count');
const levelName = document.getElementById('level-name');
const crewMembers = document.querySelectorAll('#crew-icons .crew-member');

/* =========================================
   الحالة
   ========================================= */
let state = null;
let eventPool = [];
let lastEvent = null;

function clamp(n) {
    return Math.max(0, Math.min(100, n));
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// بيختار حدث عشوائي من أسئلة المستوى الحالي، من غير تكرار لحد ما كلها تخلص
function nextEvent() {
    if (eventPool.length === 0) {
        eventPool = shuffle(LEVELS[state.level].events);
        // عشان نفس الحدث ما يتكررش مرتين ورا بعض
        if (eventPool[eventPool.length - 1] === lastEvent) {
            eventPool.unshift(eventPool.pop());
        }
    }
    lastEvent = eventPool.pop();
    return lastEvent;
}

// بيزوّد صعوبة القرار حسب المستوى (المكاسب أقل والخسائر أكبر)
function scaleDelta(res, delta) {
    const lvl = LEVELS[state.level];
    const good = res === 'radiation' ? delta < 0 : delta > 0;
    return Math.round(delta * (good ? lvl.good : lvl.bad));
}

function showScreen(screen) {
    [gameScreen, failScreen, successScreen, levelScreen].forEach(s => s.classList.remove('active'));
    if (screen) screen.classList.add('active');
}

/* =========================================
   تحديث الواجهة
   ========================================= */
function render() {
    dayCount.textContent = state.day;
    levelName.textContent = LEVELS[state.level].name;

    ['oxygen', 'power', 'food', 'radiation'].forEach(res => {
        const value = state[res];
        document.getElementById(res + '-value').textContent = value + '%';
        const bar = document.getElementById(res + '-bar');
        bar.style.width = value + '%';
        // الإشعاع خطر لما يعلى، والباقي خطر لما يقل
        const danger = res === 'radiation' ? value >= 70 : value <= 25;
        bar.classList.toggle('danger', danger);
    });

    crewMembers.forEach((member, i) => {
        member.classList.toggle('dead', i >= state.crew);
    });
}

/* =========================================
   سير اللعبة
   ========================================= */
function startGame() {
    state = { level: 0, day: 1, q: 1, crew: 4, ...START_STATE };
    eventPool = [];
    eventModal.classList.remove('active');
    resultModal.classList.remove('active');
    render();
    showScreen(gameScreen);
    showEvent();
}

function showEvent() {
    const ev = nextEvent();
    questionCount.textContent = `Question ${state.q}/${EVENTS_PER_DAY}`;
    eventTitle.textContent = ev.title;
    eventDesc.textContent = ev.desc;
    eventChoices.innerHTML = '';

    ev.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn ' + choice.type;
        btn.textContent = choice.label;
        btn.addEventListener('click', () => chooseOption(choice));
        eventChoices.appendChild(btn);
    });

    eventModal.classList.add('active');
}

function chooseOption(choice) {
    eventModal.classList.remove('active');

    resultChanges.innerHTML = '';
    resultText.textContent = choice.text;

    Object.entries(choice.effects).forEach(([res, base]) => {
        const delta = scaleDelta(res, base);
        state[res] = clamp(state[res] + delta);

        const good = res === 'radiation' ? delta < 0 : delta > 0;
        const chip = document.createElement('div');
        chip.className = 'change-chip ' + (good ? 'up' : 'down');
        chip.textContent = `${ICONS[res]} ${delta > 0 ? '+' : ''}${delta}`;
        resultChanges.appendChild(chip);
    });

    nextDayBtn.textContent = state.q < EVENTS_PER_DAY ? 'Next Question →' : 'Next Day →';
    render();
    resultModal.classList.add('active');
}

function checkFail() {
    if (state.oxygen <= 0) return 'The oxygen ran out!';
    if (state.power <= 0) return 'The power ran out! Life support shut down.';
    if (state.food <= 0) return 'The food ran out!';
    if (state.radiation >= 100) return 'Radiation reached a deadly level!';
    if (state.crew <= 0) return 'The whole crew was lost to radiation.';
    return null;
}

function failGame(reason) {
    document.getElementById('fail-reason').textContent = reason;
    showScreen(failScreen);
}

function endDay() {
    resultModal.classList.remove('active');

    // لسه فيه سؤال تاني في نفس اليوم
    if (state.q < EVENTS_PER_DAY) {
        const reason = checkFail();
        if (reason) {
            failGame(reason);
            return;
        }
        state.q++;
        showEvent();
        return;
    }

    // آخر سؤال في اليوم: الاستهلاك اليومي حسب المستوى
    Object.entries(LEVELS[state.level].daily).forEach(([res, delta]) => {
        state[res] = clamp(state[res] + delta);
    });

    // لو الإشعاع عالي جدًا، واحد من الطاقم بيتأذى
    if (state.radiation >= 80 && state.crew > 0) {
        state.crew--;
    }

    render();

    const reason = checkFail();
    if (reason) {
        failGame(reason);
        return;
    }

    if (state.day >= DAYS_PER_LEVEL) {
        finishLevel();
        return;
    }

    state.day++;
    state.q = 1;
    render();
    showEvent();
}

/* =========================================
   المستويات والنهاية
   ========================================= */
// نهاية مستوى: لو لسه فيه مستوى بعده، نعرض صفحة الانتقال
function finishLevel() {
    if (state.level >= LEVELS.length - 1) {
        winGame();
        return;
    }

    const done = LEVELS[state.level].name;
    const next = LEVELS[state.level + 1].name;

    levelTitle.textContent = `${done} LEVEL COMPLETE!`;
    levelText.textContent = `You survived ${DAYS_PER_LEVEL} days. Next level is harder: bigger risks and fewer supplies.`;
    document.getElementById('lvl-crew').textContent = `${state.crew}/4`;
    document.getElementById('lvl-done').textContent = `${state.level + 1}/${LEVELS.length}`;
    nextLevelBtn.textContent = `Start ${next} Level →`;

    showScreen(levelScreen);
}

// بداية مستوى جديد: الموارد بتتعوض جزئيًا والطاقم بيفضل زي ما هو
function startLevel(index) {
    state.level = index;
    state.day = 1;
    state.q = 1;
    state.oxygen = Math.max(state.oxygen, 60);
    state.power = Math.max(state.power, 60);
    state.food = Math.max(state.food, 60);
    state.radiation = Math.min(state.radiation, 30);
    eventPool = [];

    render();
    showScreen(gameScreen);
    showEvent();
}

function winGame() {
    const totalDays = DAYS_PER_LEVEL * LEVELS.length;
    document.getElementById('success-text').textContent = `You kept the crew alive for ${totalDays} days!`;
    document.getElementById('stat-days').textContent = `${totalDays}/${totalDays}`;
    document.getElementById('stat-crew').textContent = `${state.crew}/4`;

    const balanced = state.oxygen >= 30 && state.power >= 30 &&
        state.food >= 30 && state.radiation <= 60;
    document.getElementById('stat-resources').textContent = balanced ? 'Balanced' : 'Low';

    showScreen(successScreen);
}

/* =========================================
   الأزرار
   ========================================= */
startBtn.addEventListener('click', startGame);
nextDayBtn.addEventListener('click', endDay);
retryBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', () => startLevel(state.level + 1));
menuBtn.addEventListener('click', () => showScreen(null));

homeBtn.addEventListener('click', () => {
    if (!confirm('Return to the main menu? Your progress is saved, so you can continue later.')) return;

    eventModal.classList.remove('active');
    resultModal.classList.remove('active');
    showScreen(null);
});

/* =========================================
   مؤثرات الصوت والأنيميشن
   ========================================= */
let audioCtx = null;
let soundOn = true;
try { soundOn = localStorage.getItem('mm-sound') !== 'off'; } catch (e) { }

function getCtx() {
    if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// نغمة واحدة: التردد، المدة، والنوع والصوت والتأخير
function tone(freq, dur, { type = 'sine', vol = 0.15, delay = 0, to = null } = {}) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
}

const SFX = {
    click: () => tone(700, 0.07, { type: 'square', vol: 0.05 }),
    good: () => { tone(523, 0.12); tone(784, 0.2, { delay: 0.1 }); },
    bad: () => tone(300, 0.3, { type: 'sawtooth', vol: 0.1, to: 120 }),
    alert: () => {
        tone(880, 0.16, { type: 'square', vol: 0.06 });
        tone(660, 0.16, { type: 'square', vol: 0.06, delay: 0.2 });
    },
    level: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, { type: 'triangle', delay: i * 0.12 })),
    win: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0.35, { type: 'triangle', vol: 0.18, delay: i * 0.14 })),
    fail: () => {
        tone(220, 0.7, { type: 'sawtooth', vol: 0.12, to: 55 });
        tone(165, 0.9, { type: 'sawtooth', vol: 0.1, delay: 0.3, to: 40 });
    }
};

function playSound(name) {
    if (!soundOn) return;
    try { SFX[name](); } catch (e) { }
}

// موسيقى فضاء هادية في الخلفية (طنين منخفض بيتموج)
let ambient = null;

function startAmbient() {
    if (!soundOn || ambient) return;
    const c = getCtx();
    if (!c) return;

    const master = c.createGain();
    master.gain.setValueAtTime(0.0001, c.currentTime);
    master.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 2);

    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;

    const sources = [55, 82.5, 110.3].map(f => {
        const o = c.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        o.connect(filter);
        o.start();
        return o;
    });

    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();

    filter.connect(master).connect(c.destination);
    ambient = { master, sources: [...sources, lfo] };
}

function stopAmbient() {
    if (!ambient || !audioCtx) return;
    const { master, sources } = ambient;
    master.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.3);
    sources.forEach(o => o.stop(audioCtx.currentTime + 1.5));
    ambient = null;
}

// ---------- تأثيرات بصرية ----------
function shakeScreen() {
    document.body.classList.remove('shake');
    void document.body.offsetWidth;
    document.body.classList.add('shake');
}

function flash(color) {
    const f = document.createElement('div');
    f.className = 'fx-flash';
    f.style.background = color;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 700);
}

function confetti() {
    const colors = ['#22d3ee', '#4ade80', '#facc15', '#fb7185', '#c084fc'];
    for (let i = 0; i < 70; i++) {
        const p = document.createElement('div');
        p.className = 'confetti';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[i % colors.length];
        p.style.animationDuration = (2.5 + Math.random() * 2) + 's';
        p.style.animationDelay = (Math.random() * 0.8) + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5500);
    }
}

// ---------- زرار الصوت ----------
const soundBtn = document.getElementById('sound-btn');

function updateSoundBtn() {
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
}
updateSoundBtn();

soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('mm-sound', soundOn ? 'on' : 'off'); } catch (e) { }
    updateSoundBtn();
    if (!soundOn) stopAmbient();
    else if (gameScreen.classList.contains('active')) startAmbient();
});

// صوت نقرة لكل الأزرار
document.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && b !== soundBtn) playSound('click');
});

/* =========================================
   ربط المؤثرات بدوال اللعبة (من غير تعديل الدوال نفسها)
   ========================================= */
const _showScreen = showScreen;
showScreen = function (screen) {
    _showScreen(screen);
    if (screen === gameScreen) startAmbient();
    else stopAmbient();
};

const _showEvent = showEvent;
showEvent = function () {
    _showEvent();
    playSound('alert');
    flash('rgba(239, 68, 68, 0.22)');
    shakeScreen();
};

const _chooseOption = chooseOption;
chooseOption = function (choice) {
    let score = 0;
    Object.entries(choice.effects).forEach(([res, base]) => {
        const d = scaleDelta(res, base);
        score += (res === 'radiation' ? -d : d);
    });
    _chooseOption(choice);
    playSound(score >= 0 ? 'good' : 'bad');
};

const _failGame = failGame;
failGame = function (reason) {
    _failGame(reason);
    playSound('fail');
    flash('rgba(239, 68, 68, 0.45)');
    shakeScreen();
};

const _finishLevel = finishLevel;
finishLevel = function () {
    _finishLevel();
    if (levelScreen.classList.contains('active')) {
        playSound('level');
        confetti();
    }
};

const _winGame = winGame;
winGame = function () {
    _winGame();
    playSound('win');
    confetti();
    setTimeout(confetti, 1500);
};

// وميض الموارد واهتزاز لما حد من الطاقم يتأثر
let lastRender = null;
let lastStateObj = null;
const _render = render;
render = function () {
    _render();

    if (lastRender && lastStateObj === state && lastRender.level === state.level) {
        ['oxygen', 'power', 'food', 'radiation'].forEach(res => {
            const diff = state[res] - lastRender[res];
            if (diff === 0) return;
            const good = res === 'radiation' ? diff < 0 : diff > 0;
            const card = document.querySelector(`.resource[data-resource="${res}"]`);
            card.classList.remove('pulse-up', 'pulse-down');
            void card.offsetWidth;
            card.classList.add(good ? 'pulse-up' : 'pulse-down');
        });

        if (state.crew < lastRender.crew) {
            playSound('bad');
            flash('rgba(239, 68, 68, 0.4)');
            shakeScreen();
        }
    }

    lastStateObj = state;
    lastRender = {
        level: state.level, crew: state.crew,
        oxygen: state.oxygen, power: state.power, food: state.food, radiation: state.radiation
    };
};

/* =========================================
   حفظ التقدم (Continue)
   ========================================= */
const SAVE_KEY = 'mm-save-v1';
const continueBtn = document.getElementById('continue-button');

function saveProgress() {
    if (!state) return;
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
            level: state.level, day: state.day, q: state.q, crew: state.crew,
            oxygen: state.oxygen, power: state.power, food: state.food, radiation: state.radiation
        }));
    } catch (e) { }
}

function clearProgress() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
}

// بيقرا التقدم المحفوظ ويتأكد إن البيانات سليمة
function loadProgress() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        const inRange = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
        const valid =
            inRange(s.level, 0, LEVELS.length - 1) &&
            inRange(s.day, 1, DAYS_PER_LEVEL) &&
            inRange(s.q, 1, EVENTS_PER_DAY) &&
            inRange(s.crew, 1, 4) &&
            ['oxygen', 'power', 'food', 'radiation'].every(k => inRange(s[k], 0, 100));
        return valid ? s : null;
    } catch (e) {
        return null;
    }
}

// بيظهر زرار Continue، والمستوى واليوم بيظهروا كتلميح لما تقف عليه بالماوس
function refreshContinue() {
    const s = loadProgress();
    document.body.classList.toggle('has-save', !!s);
    if (s) {
        continueBtn.title = `${LEVELS[s.level].name} · Day ${s.day}`;
    }
}

function continueGame() {
    const s = loadProgress();
    if (!s) {
        refreshContinue();
        return;
    }
    state = { ...s };
    eventPool = [];
    eventModal.classList.remove('active');
    resultModal.classList.remove('active');
    render();
    showScreen(gameScreen);
    showEvent();
}

continueBtn.addEventListener('click', continueGame);

// لو فيه تقدم محفوظ، نسأل قبل ما نبدأ لعبة جديدة تمسحه
startBtn.addEventListener('click', (e) => {
    if (loadProgress() && !confirm('Start a new game? Your saved progress will be replaced.')) {
        e.stopImmediatePropagation();
    }
}, true);

/* ---------- ربط الحفظ بدوال اللعبة ---------- */

// بنحفظ في بداية كل سؤال
const _showEventSave = showEvent;
showEvent = function () {
    saveProgress();
    _showEventSave();
};

// الفشل أو الفوز: نمسح الحفظ
const _failGameSave = failGame;
failGame = function (reason) {
    clearProgress();
    _failGameSave(reason);
};

const _winGameSave = winGame;
winGame = function () {
    clearProgress();
    _winGameSave();
};

// نهاية مستوى: نحفظ بداية المستوى الجاي (بنفس تعويض الموارد في startLevel)
const _finishLevelSave = finishLevel;
finishLevel = function () {
    _finishLevelSave();
    if (levelScreen.classList.contains('active')) {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                level: state.level + 1, day: 1, q: 1, crew: state.crew,
                oxygen: Math.max(state.oxygen, 60),
                power: Math.max(state.power, 60),
                food: Math.max(state.food, 60),
                radiation: Math.min(state.radiation, 30)
            }));
        } catch (e) { }
    }
};

// لما اللاعب يرجع للقائمة الرئيسية، نحدّث زرار Continue
const _showScreenSave = showScreen;
showScreen = function (screen) {
    _showScreenSave(screen);
    if (screen === null) refreshContinue();
};

// عند فتح الصفحة
refreshContinue();
