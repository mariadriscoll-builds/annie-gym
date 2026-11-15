// Everything the app says. Edit freely: each line is one message.
// "who" lists the caricatures shown with the message (see CHARACTERS).

export const CHARACTERS = {
  annie:   { name: 'Annie',  initials: 'A',  color: '#e86a92' },
  maria:   { name: 'Maria',  initials: 'M',  color: '#7b5cd6' },
  'maria-moira': { name: 'Maria as Moira', initials: 'MR', color: '#2b2b2b' },
  dobby:   { name: 'Dobby',  initials: 'D',  color: '#8a5a3b' },
  luna:    { name: 'Luna',   initials: 'L',  color: '#e0a526' },
  keith:   { name: 'Keith',  initials: 'K',  color: '#2f80c9' },
  brad:    { name: 'Brad',   initials: 'B',  color: '#3a9d6e' },
  shauna:  { name: 'Shauna', initials: 'S',  color: '#d4572b' },
  emily:   { name: 'Emily',  initials: 'E',  color: '#c94fc2' },
  andrew:  { name: 'Andrew', initials: 'An', color: '#4a6fd6' },
  ian:     { name: 'Ian',    initials: 'I',  color: '#1e9bb0' },
  gavin:   { name: 'Gavin',  initials: 'G',  color: '#6aa83a' },
  mom:     { name: 'Mom',    initials: 'Mo', color: '#d9488b' },
  dad:     { name: 'Dad',    initials: 'Da', color: '#5c6b7a' },
};

export const PROPS = {
  sock: { emoji: '🧦' },
  toast: { emoji: '🍞' },
  ball: { emoji: '🎾' },
  crown: { emoji: '👑' },
  candle: { emoji: '🕯️' },
  paw: { emoji: '🐾' },
};

export const FAMILY = ['maria', 'keith', 'dobby', 'luna', 'shauna', 'emily', 'andrew', 'ian', 'gavin', 'brad', 'mom', 'dad'];

// After each exercise
export const EXERCISE_MESSAGES = [
  // Maria
  { who: ['maria'], text: "Older sister privilege: I get to say I'm proud of you. Loudly. In public." },
  { who: ['maria'], text: 'By the power vested in me, I now pronounce that set DONE.' },
  { who: ['maria'], text: 'Ten years younger and lifting circles around me. Rude. Amazing, but rude.' },
  { who: ['maria'], text: 'That was nothing short of a triumph of sheer, unbridled gumption. (Read it in your best Moira voice.)' },
  { who: ['maria'], text: "I'd officiate a wedding between you and that dumbbell. Nobody would faint this time." },
  { who: ['maria'], text: "I told you so. About what? Doesn't matter. Older sister rules." },
  { who: ['maria'], text: 'Bébé, that was magnificent.' },
  { who: ['maria'], text: "Write that one down. We'll need proof it's not an Annie story." },
  { who: ['maria'], text: "If I had a puppy I'd name it after that set." },
  { who: ['maria'], text: 'Still your favourite sister. Just saying.' },
  { who: ['maria'], text: 'Dumpster baby? More like dumpster-to-deadlift champion.' },

  // Dobby
  { who: ['dobby'], text: "I barked at that dumbbell for you. Very loudly. You're welcome." },
  { who: ['dobby'], text: "That was so good I'd trade a sock for it. Not a GOOD sock. But a sock." },
  { who: ['dobby'], text: "Grandma's toast is great. You're greater. Don't tell Grandma." },
  { who: ['dobby'], text: "I was your first. I'm proud of you first. Luna can be proud second." },
  { who: ['dobby'], text: 'Was that a snack in your hand? No? A dumbbell? Still impressed.' },
  { who: ['dobby'], text: 'LOUD BARK. That means good job. All my barks mean good job now.' },
  { who: ['dobby'], text: "I'm putting this one in my sock pile of greatest moments." },
  { who: ['dobby', 'shauna'], text: 'Aunt Shauna gave me a treat to celebrate you. Unrelated, but please keep going.' },

  // Luna
  { who: ['luna'], text: 'THAT WAS AMAZING. CAN WE RUN NOW.' },
  { who: ['luna'], text: "I'd fetch that dumbbell for you, but honestly, you've got it." },
  { who: ['luna'], text: "Look at me. Now look at you. Okay, look at me again. You're doing great." },
  { who: ['luna'], text: "You stayed on track better than I've ever stayed on a leash." },
  { who: ['luna'], text: "Keith says I'm his dog. Today I'm your dog. Great set." },
  { who: ['luna'], text: "I don't beg for food. I beg for you to do one more exercise." },
  { who: ['luna'], text: "Zoomies in your honour. Starting now. Can't stop." },

  // Keith
  { who: ['keith'], text: 'Best decision since October 2nd.' },
  { who: ['keith'], text: "That's my wife. Just so everyone at the gym knows." },
  { who: ['keith'], text: 'Proud husband alert. Proud husband alert.' },
  { who: ['keith', 'luna'], text: "Luna and I watched that. We're both impressed. Dobby is just hungry." },
  { who: ['keith'], text: 'Strongest person in the house. Dobby is a close second, at stealing socks.' },

  // Ian and Gavin
  { who: ['ian', 'gavin'], text: 'Ant Danny is STRONG.' },
  { who: ['ian', 'gavin'], text: "Coolest aunt in the whole family. Don't tell Aunt Shauna." },
  { who: ['ian', 'gavin'], text: 'Ant Danny, can you lift us next time?' },

  // Emily and Andrew
  { who: ['emily'], text: "Favourite niece reporting: that was awesome. (I'm the only niece. Still counts.)" },
  { who: ['andrew'], text: "Andrew says that was legit. Andrew doesn't say that about much." },
  { who: ['emily', 'andrew'], text: 'Emily and Andrew rate that set: 10 out of 10.' },

  // Shauna
  { who: ['shauna', 'dobby'], text: "I've fed Dobby three snacks to celebrate. He supports this program." },
  { who: ['shauna'], text: "Little sister's got serious strength. Who knew. (We knew.)" },

  // Mom and Dad
  { who: ['mom', 'dad'], text: "That's our girl." },
  { who: ['mom', 'dad'], text: "We still won't petsit Luna. But we're very proud of you." },
  { who: ['mom', 'dad', 'dobby'], text: 'Dobby can stay with us any time. So can that energy.' },
  { who: ['mom'], text: 'We thought you were something serious. Turned out you were just a third child. Best news we ever got, and look at you now.' },

  // Brad
  { who: ['brad', 'luna'], text: 'Better than Luna at fetch. And Luna is excellent at fetch.' },
  { who: ['brad'], text: 'Only dog I like is Luna. Only workout I like watching is this one.' },

  // The whole family
  { who: ['maria', 'shauna', 'mom', 'dad'], text: "This one's real. Not an Annie story. We have receipts." },
  { who: ['emily', 'ian', 'gavin', 'andrew'], text: 'Group chat has been notified. Everyone is cheering.' },
  { who: ['maria', 'shauna', 'keith'], text: 'From dumpster baby to gym legend. We always knew. (We did not always know. But we know now.)' },
];

// After finishing a whole session
export const SESSION_MESSAGES = [
  { who: ['dobby'], props: ['sock'], text: 'SESSION DONE! Dobby has stolen a sock to celebrate.' },
  { who: ['luna'], props: ['ball'], text: 'Luna has done three laps of the yard in your honour.' },
  { who: ['keith'], text: 'Workout complete. Keith is making the victory face.' },
  { who: ['maria'], text: 'Maria has officially pronounced this session finished. You may now kiss the treadmill.' },
  { who: ['dobby'], text: 'Done and dusted. Dobby is barking at nothing out of pure joy.' },
];

// Shown on the home screen, a new one each week. Never mentions last week.
export const FRESH_WEEK_MESSAGES = [
  { who: ['dobby'], text: "New week! Dobby hasn't stolen a single sock yet. Let's go." },
  { who: ['dobby'], props: ['sock'], text: 'Fresh week, fresh socks. Hide them.' },
  { who: ['maria'], text: 'Remember the wedding? Someone fainted, we paused, and we started again. Best wedding ever. Every week works like that.' },
  { who: ['luna'], text: 'New week. Luna is already at the door with her leash. Sort of.' },
  { who: ['maria', 'keith', 'dobby', 'luna'], text: 'Three gym days this week. The family conga line is warming up.' },
];

// When a week reaches 3 sessions
export const WEEK_MESSAGES = [
  'Three sessions this week. That is a whole week done!',
  'Week complete! The group chat is losing its mind.',
  'Three for three. Dobby is howling. Luna is zooming. Everyone is proud.',
];

// A 4th (or 5th...) session in one week
export const BONUS_SOCK_MESSAGES = [
  { who: ['dobby'], props: ['sock'], text: 'BONUS SOCK! Dobby adds it to his collection. He has never been prouder.' },
  { who: ['dobby'], props: ['sock'], text: "A bonus session? Dobby is speechless. Just kidding, he's barking." },
];

// The opening screen, a new line each time the app opens
export const OPENING_LINES = [
  { who: ['dobby'], text: 'Dobby has hidden every sock in the house. Coincidence? No.' },
  { who: ['luna'], text: 'Luna is ready. Luna is always ready.' },
  { who: ['keith'], text: "Keith says hi. Dobby says LOUD BARK. They mean the same thing." },
  { who: ['maria'], text: 'Bébé, the gym awaits.' },
  { who: ['maria'], text: "Today's workout: 100% real. Not an Annie story." },
  { who: ['ian', 'gavin'], text: 'Ant Danny has entered the building.' },
  { who: ['mom', 'dad'], text: "That's our girl. Off you go." },
  { who: ['emily'], text: 'Favourite niece checking in. Go get it.' },
  { who: ['shauna', 'dobby'], text: "Shauna is feeding Dobby a snack for luck. It's tradition now." },
  { who: ['brad', 'luna'], text: 'Brad and Luna are cheering. Brad is mostly cheering for Luna.' },
];

// Shown once, the very first time the app opens
export const WELCOME = {
  who: ['maria'],
  title: 'Hi Annie!',
  text: "I made you a gym app. It plans your workouts, cheers you on, and counts every week you get three sessions in. That number only ever goes up. The whole family (and both dogs) will be popping in. Love, Maria",
};
