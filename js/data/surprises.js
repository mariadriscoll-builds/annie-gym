// Hidden surprises. Each unlocks once, then lives in the Surprises gallery to replay.
// trigger: { type: 'total', weeks } | { type: 'run', weeks } | { type: 'first-session' } | { type: 'date', month, day }
// scene: which animation plays (see SCENES in app.js)

export const SURPRISES = [
  {
    id: 'first-session',
    trigger: { type: 'first-session' },
    scene: 'dance',
    who: ['dobby', 'luna'],
    title: 'Your very first session!',
    lines: ['Dobby and Luna have heard the news.', 'They are dancing. Badly. Proudly.'],
  },
  {
    id: 'total-1',
    trigger: { type: 'total', weeks: 1 },
    scene: 'conga',
    who: ['maria', 'keith', 'dobby', 'luna', 'shauna', 'ryan', 'emily', 'andrew', 'ian', 'gavin', 'brad', 'mom', 'dad'],
    title: 'First full week!',
    lines: ['The whole family is doing a conga line in your honour.', 'Dad is out of rhythm. Nobody minds.'],
  },
  {
    id: 'total-4',
    trigger: { type: 'total', weeks: 4 },
    scene: 'danceoff',
    who: ['dobby', 'luna'],
    title: '4 weeks! Dance-off!',
    lines: ['Dobby wins on volume.', 'Luna wins on enthusiasm.', 'You win on everything.'],
  },
  {
    id: 'total-8',
    trigger: { type: 'total', weeks: 8 },
    scene: 'moira',
    who: ['maria-moira'],
    title: '8 weeks. A speech.',
    lines: [
      'Annie. My darling. My bébé.',
      'Eight weeks! You have been nothing less than a veritable cyclone of commitment.',
      'A paragon of persistence. A titan of the treadmill.',
      'I am, quite frankly, verklempt.',
      'Now go hydrate. With gusto.',
    ],
  },
  {
    id: 'total-12',
    trigger: { type: 'total', weeks: 12 },
    scene: 'banner',
    who: ['ian', 'gavin'],
    banner: 'ANT DANNY',
    title: '12 weeks!',
    lines: ['Ian and Gavin made you a banner.', 'They spelled it the way they say it.'],
  },
  {
    id: 'total-26',
    trigger: { type: 'total', weeks: 26 },
    scene: 'dance',
    who: ['mom', 'dad', 'luna'],
    title: 'Half a year!',
    lines: ['Mom and Dad have finally agreed to petsit Luna.', "(In the app only. Let's not push it.)"],
  },
  {
    id: 'total-52',
    trigger: { type: 'total', weeks: 52 },
    scene: 'party',
    who: ['maria', 'keith', 'dobby', 'luna', 'shauna', 'ryan', 'emily', 'andrew', 'ian', 'gavin', 'brad', 'mom', 'dad'],
    title: 'ONE WHOLE YEAR',
    lines: [
      'Fifty-two weeks. Every single one of us is dancing.',
      "Annie, I'm so proud of you I could officiate something. Love, Maria",
    ],
  },
  {
    id: 'run-2',
    trigger: { type: 'run', weeks: 2 },
    scene: 'zoomies',
    who: ['luna'],
    title: '2 weeks in a row!',
    lines: ['Luna has the zoomies.', 'She will not be stopping.'],
  },
  {
    id: 'run-4',
    trigger: { type: 'run', weeks: 4 },
    scene: 'sockpile',
    who: ['dobby'],
    title: '4 weeks in a row!',
    lines: ["Dobby reveals his secret sock pile.", 'Every sock was stolen in your honour.'],
  },
  {
    id: 'run-8',
    trigger: { type: 'run', weeks: 8 },
    scene: 'fetch',
    who: ['keith', 'luna'],
    title: '8 weeks in a row!',
    lines: ['Keith and Luna are playing fetch to celebrate.', 'Luna never misses. Neither do you.'],
  },
  {
    id: 'run-12',
    trigger: { type: 'run', weeks: 12 },
    scene: 'crown',
    who: ['emily', 'annie'],
    title: '12 weeks in a row!',
    lines: ['Emily, the favourite, hereby crowns you.', 'Queen of the gym. Long may she lift.'],
  },
  {
    id: 'birthday',
    trigger: { type: 'date', month: 8, day: 29 },
    scene: 'birthday',
    who: ['maria', 'keith', 'dobby', 'luna', 'shauna', 'ryan', 'emily', 'ian', 'gavin', 'mom', 'dad'],
    title: 'Happy birthday, Annie!',
    lines: [
      'The whole family is singing.',
      "Dobby is bringing you a slice of Grandma's toast with a candle in it.",
      'He is also giving you his best sock. He would like it back.',
      "Happy birthday to my favourite little sister. Today's workout is optional. Being celebrated is not. Love, Maria",
    ],
  },
  {
    id: 'anniversary',
    trigger: { type: 'date', month: 10, day: 2 },
    scene: 'anniversary',
    who: ['keith', 'maria'],
    title: 'Happy anniversary!',
    lines: [
      'Keith and Maria, as officiant, renew your vows to the gym.',
      '*mic cuts out*',
      'fuck fuck fuck fuck fuck',
      'Nerves gone. Happy anniversary. Nobody fainted this time.',
    ],
  },
];

// ---------- the one-year finale (52 full weeks) ----------
// Plays as three cards: her year in numbers, the family's toasts, then everyone dancing.

export const YEAR_TOASTS = [
  { who: ['dobby'], text: 'A whole year. I celebrated by stealing every sock in the house. You are welcome.' },
  { who: ['luna'], text: 'FIFTY-TWO WEEKS. I would like to do fifty-two laps of the yard about it. Starting now.' },
  { who: ['keith'], text: 'Year one of marriage and year one of this. Proud doesn’t begin to cover it.' },
  { who: ['mom', 'dad'], text: 'That’s our girl. A whole year. (We still won’t petsit Luna.)' },
  { who: ['shauna'], text: 'We never believed the Annie stories. This one’s on the record. All 52 weeks of it.' },
  { who: ['ryan'], text: 'Toddler, university roommate, now gym legend. I’ve seen every era. This one’s my favourite.' },
  { who: ['ian', 'gavin'], text: 'Ant Danny: one year, undefeated.' },
  { who: ['emily'], text: 'Favourite niece reporting: proudest I have ever been.' },
  { who: ['andrew'], text: 'One whole year. Legit.' },
  { who: ['brad', 'luna'], text: 'Luna says congratulations. So do I. In that order.' },
];

export const YEAR_NOTE = 'Annie, a whole year! I already knew I was your favourite sister, and now I’m also your proudest. For the record, I’ve never made it a full year at the gym. You’re officially the strong one. Love, Maria';
