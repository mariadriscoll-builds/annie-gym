// The exercise library. Each session picks one exercise from each area.
// equipment: dumbbell | barbell | kettlebell | bodyweight
// weighted: false hides the weight box (bodyweight moves)
// reps: what to do for each of the 3 sets

export const AREAS = [
  { id: 'legs', label: 'Legs' },
  { id: 'hinge', label: 'Hips & glutes' },
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'arms', label: 'Shoulders & arms' },
  { id: 'core', label: 'Core' },
];

export const EXERCISES = [
  // Legs
  { id: 'goblet-squat-db', area: 'legs', name: 'Dumbbell goblet squat', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Hold one dumbbell at your chest, elbows pointing down. Sit back and down, then stand tall through your heels.' },
  { id: 'goblet-squat-kb', area: 'legs', name: 'Kettlebell goblet squat', equipment: 'kettlebell', weighted: true, reps: '10–12 reps',
    tip: 'Hold the kettlebell by the horns close to your chest. Knees track over your toes as you sit down between your heels.' },
  { id: 'back-squat-bb', area: 'legs', name: 'Barbell back squat', equipment: 'barbell', weighted: true, reps: '8–10 reps',
    tip: 'Bar rests on your upper back, not your neck. Brace your stomach, sit down like there is a chair behind you, and drive up.' },
  { id: 'reverse-lunge-db', area: 'legs', name: 'Dumbbell reverse lunge', equipment: 'dumbbell', weighted: true, reps: '8–10 each leg',
    tip: 'Step one foot back and lower until both knees bend to about 90 degrees. Push through the front heel to stand.' },
  { id: 'step-up-db', area: 'legs', name: 'Dumbbell step-up', equipment: 'dumbbell', weighted: true, reps: '8–10 each leg',
    tip: 'Use a knee-height box or bench. Put your whole foot on it and push through that heel, without bouncing off the back foot.' },
  { id: 'split-squat-db', area: 'legs', name: 'Dumbbell split squat', equipment: 'dumbbell', weighted: true, reps: '8–10 each leg',
    tip: 'Stand in a long stride and stay there. Lower straight down, then rise, keeping your chest up the whole time.' },
  { id: 'bodyweight-squat', area: 'legs', name: 'Bodyweight squat', equipment: 'bodyweight', weighted: false, reps: '15 reps',
    tip: 'Arms out in front for balance. Sit back and down as far as is comfortable, then stand up tall.' },
  { id: 'walking-lunge-db', area: 'legs', name: 'Dumbbell walking lunge', equipment: 'dumbbell', weighted: true, reps: '10 each leg',
    tip: 'Hold a dumbbell in each hand. Take a long step, lower your back knee toward the floor, then step through to the next one.' },

  // Hips and glutes
  { id: 'rdl-db', area: 'hinge', name: 'Dumbbell Romanian deadlift', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Soft knees, flat back. Push your hips back and slide the dumbbells down your legs until you feel a stretch, then stand up.' },
  { id: 'rdl-bb', area: 'hinge', name: 'Barbell Romanian deadlift', equipment: 'barbell', weighted: true, reps: '8–10 reps',
    tip: 'Start standing with the bar. Push your hips back, keep the bar close to your legs, and stop when your back wants to round.' },
  { id: 'kb-swing', area: 'hinge', name: 'Kettlebell swing', equipment: 'kettlebell', weighted: true, reps: '15 reps',
    tip: 'It is a hip snap, not an arm lift. Hike the bell back between your legs, then drive your hips forward so it floats to chest height.' },
  { id: 'kb-deadlift', area: 'hinge', name: 'Kettlebell deadlift', equipment: 'kettlebell', weighted: true, reps: '10–12 reps',
    tip: 'Bell between your feet. Hips back, flat back, grab the handle and stand up tall, squeezing your glutes at the top.' },
  { id: 'glute-bridge', area: 'hinge', name: 'Glute bridge', equipment: 'bodyweight', weighted: false, reps: '15 reps',
    tip: 'Lie on your back, knees bent, feet flat. Push through your heels to lift your hips, pause at the top, lower slowly.' },
  { id: 'hip-thrust-db', area: 'hinge', name: 'Dumbbell hip thrust', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Upper back on a bench, dumbbell resting on your hips. Drive your hips up until your body is flat like a table, then lower.' },
  { id: 'deadlift-bb', area: 'hinge', name: 'Barbell deadlift', equipment: 'barbell', weighted: true, reps: '6–8 reps',
    tip: 'Bar over the middle of your feet. Flat back, chest up, push the floor away, and keep the bar touching your legs all the way up.' },
  { id: 'single-leg-rdl-db', area: 'hinge', name: 'Single-leg dumbbell deadlift', equipment: 'dumbbell', weighted: true, reps: '8 each leg',
    tip: 'Stand on one leg, dumbbell in the opposite hand. Tip forward like a see-saw as your free leg goes back. Hold something for balance if you like.' },

  // Push
  { id: 'bench-db', area: 'push', name: 'Dumbbell bench press', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Feet flat, shoulder blades pinched together on the bench. Lower the dumbbells to your chest, then press them up and slightly together.' },
  { id: 'bench-bb', area: 'push', name: 'Barbell bench press', equipment: 'barbell', weighted: true, reps: '8–10 reps',
    tip: 'Eyes under the bar, hands a bit wider than shoulders. Lower to the middle of your chest and press up. Ask for a spotter if you go heavy.' },
  { id: 'incline-db', area: 'push', name: 'Incline dumbbell press', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Set the bench to a low incline. Press the dumbbells up over your upper chest and lower them under control.' },
  { id: 'push-up', area: 'push', name: 'Push-up', equipment: 'bodyweight', weighted: false, reps: '8–12 reps',
    tip: 'Hands under your shoulders, body in one straight line. Hands on a bench makes it easier, and that counts just the same.' },
  { id: 'floor-press-db', area: 'push', name: 'Dumbbell floor press', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Lie on the floor, knees bent. Lower until your upper arms touch the floor, pause, then press up.' },
  { id: 'floor-press-kb', area: 'push', name: 'Kettlebell floor press', equipment: 'kettlebell', weighted: true, reps: '10 each arm',
    tip: 'Lie on the floor with the bell resting on the back of your wrist. Press straight up, keeping your wrist straight.' },

  // Pull
  { id: 'row-db', area: 'pull', name: 'One-arm dumbbell row', equipment: 'dumbbell', weighted: true, reps: '10 each arm',
    tip: 'One hand and knee on a bench, back flat. Pull the dumbbell toward your hip, then lower it all the way down.' },
  { id: 'row-bb', area: 'pull', name: 'Barbell bent-over row', equipment: 'barbell', weighted: true, reps: '8–10 reps',
    tip: 'Hinge forward with a flat back. Pull the bar to your lower ribs, squeeze your shoulder blades, then lower slowly.' },
  { id: 'row-kb', area: 'pull', name: 'Kettlebell row', equipment: 'kettlebell', weighted: true, reps: '10 each arm',
    tip: 'Staggered stance, one hand on a bench. Row the kettlebell to your hip, keeping your elbow close to your side.' },
  { id: 'chest-supported-row-db', area: 'pull', name: 'Chest-supported dumbbell row', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Lie face down on an incline bench. Pull both dumbbells up and back, squeeze, and lower. The bench keeps your back happy.' },
  { id: 'pullover-db', area: 'pull', name: 'Dumbbell pullover', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Lie on a bench holding one dumbbell over your chest with both hands. Lower it back behind your head with soft elbows, then bring it back.' },
  { id: 'inverted-row', area: 'pull', name: 'Inverted row', equipment: 'bodyweight', weighted: false, reps: '8–12 reps',
    tip: 'Set a bar in a rack about waist height. Hang underneath, body straight, and pull your chest to the bar. Higher bar means easier.' },

  // Shoulders and arms
  { id: 'shoulder-press-db', area: 'arms', name: 'Dumbbell shoulder press', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Seated or standing, dumbbells at shoulder height. Press straight up without arching your back, then lower slowly.' },
  { id: 'lateral-raise', area: 'arms', name: 'Dumbbell lateral raise', equipment: 'dumbbell', weighted: true, reps: '12–15 reps',
    tip: 'Light weights. Raise your arms out to the sides to shoulder height with a slight bend in the elbows, then lower slowly.' },
  { id: 'curl-db', area: 'arms', name: 'Dumbbell biceps curl', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Elbows stay pinned to your sides. Curl up, squeeze, and lower all the way down without swinging.' },
  { id: 'hammer-curl', area: 'arms', name: 'Hammer curl', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Palms face each other, like holding two hammers. Curl up and lower slowly, keeping your elbows still.' },
  { id: 'triceps-ext-db', area: 'arms', name: 'Overhead triceps extension', equipment: 'dumbbell', weighted: true, reps: '10–12 reps',
    tip: 'Hold one dumbbell overhead with both hands. Bend at the elbows to lower it behind your head, then straighten your arms.' },
  { id: 'arnold-press', area: 'arms', name: 'Arnold press', equipment: 'dumbbell', weighted: true, reps: '10 reps',
    tip: 'Start with palms facing you at shoulder height. Rotate your palms forward as you press up, then reverse on the way down.' },
  { id: 'kb-halo', area: 'arms', name: 'Kettlebell halo', equipment: 'kettlebell', weighted: true, reps: '8 each direction',
    tip: 'Hold the bell upside down by the horns. Circle it slowly around your head, keeping your stomach tight and hips still.' },
  { id: 'overhead-press-bb', area: 'arms', name: 'Barbell overhead press', equipment: 'barbell', weighted: true, reps: '8–10 reps',
    tip: 'Bar starts on your upper chest. Squeeze your glutes, press it straight up past your face, and finish with the bar over your head.' },

  // Core
  { id: 'plank', area: 'core', name: 'Plank', equipment: 'bodyweight', weighted: false, reps: '30–45 seconds',
    tip: 'Forearms on the floor, body in a straight line. Squeeze your glutes and breathe. Knees down is a great plank too.' },
  { id: 'dead-bug', area: 'core', name: 'Dead bug', equipment: 'bodyweight', weighted: false, reps: '8 each side',
    tip: 'Lie on your back, arms and knees up. Slowly lower the opposite arm and leg while keeping your lower back on the floor.' },
  { id: 'bird-dog', area: 'core', name: 'Bird dog', equipment: 'bodyweight', weighted: false, reps: '8 each side',
    tip: 'On hands and knees, reach one arm forward and the opposite leg back. Pause, return, and switch. Slow is the secret.' },
  { id: 'side-plank', area: 'core', name: 'Side plank', equipment: 'bodyweight', weighted: false, reps: '20–30 seconds each side',
    tip: 'On one forearm with your feet stacked or knees down. Lift your hips so your body makes a straight line.' },
  { id: 'farmer-carry', area: 'core', name: 'Farmer carry', equipment: 'dumbbell', weighted: true, reps: '40 steps',
    tip: 'Pick up a heavy dumbbell in each hand. Stand tall, shoulders back, and walk slowly like you own the gym.' },
  { id: 'suitcase-carry-kb', area: 'core', name: 'Kettlebell suitcase carry', equipment: 'kettlebell', weighted: true, reps: '20 steps each side',
    tip: 'Carry one kettlebell in one hand like a suitcase. Stay perfectly upright without leaning toward it.' },
  { id: 'russian-twist-db', area: 'core', name: 'Dumbbell Russian twist', equipment: 'dumbbell', weighted: true, reps: '10 each side',
    tip: 'Sit leaning back slightly, feet on the floor. Hold a light dumbbell and turn your shoulders side to side.' },
];

export const CARDIO = {
  warmup: { id: 'warmup', name: 'Warm-up', minutes: 5, reps: '5 minutes, easy pace',
    tip: 'Treadmill or elliptical, your choice. Start easy and finish a little quicker than you started.' },
  finisher: { id: 'finisher', name: 'Cardio finisher', minutes: 12, reps: '10–15 minutes',
    tip: 'Treadmill or elliptical. Pick a pace where you could still chat. Last two minutes, pick it up if you feel like it.' },
};

export const SETS = 3;

export function exerciseById(id) {
  return EXERCISES.find((e) => e.id === id);
}

export function weightStep(exercise) {
  return 5;
}
