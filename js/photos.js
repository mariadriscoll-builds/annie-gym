// Selfies are saved on Annie's phone in the browser's photo storage (IndexedDB),
// one per workout, keyed by the workout's id. Nothing is ever uploaded.
// Every call is guarded: if storage is unavailable the app carries on without photos.

const DB_NAME = 'annie-gym-photos';
const STORE = 'selfies';
let dbPromise = null;

function openDB() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('no IndexedDB'));
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }).catch((e) => { dbPromise = null; throw e; });
  }
  return dbPromise;
}

function run(mode, fn) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  }));
}

export async function saveSelfie(id, blob) {
  try { await run('readwrite', (s) => s.put(blob, id)); return true; } catch (e) { return false; }
}

export async function getSelfie(id) {
  try { return (await run('readonly', (s) => s.get(id))) || null; } catch (e) { return null; }
}

export async function deleteSelfie(id) {
  try { await run('readwrite', (s) => s.delete(id)); return true; } catch (e) { return false; }
}

// The pairs that can peek into the frame. One is picked at random for each selfie,
// never the same pair twice in a row, so it's a surprise every time.
// Everyone appears full-body; people are drawn bigger because they're taller.
const DOGS = new Set(['dobby', 'luna']);
export const FRAME_PAIRS = [
  ['dobby', 'luna'], ['maria', 'keith'], ['ian', 'gavin'], ['mom', 'dad'],
  ['shauna', 'emily'], ['andrew', 'brad'], ['maria-moira', 'dobby'], ['keith', 'luna'],
  ['shauna', 'ryan'],
];

function framePicture(id) {
  return `images/${id}-full.png`;
}

export function randomPairIndex(lastIndex, rng = Math.random) {
  const n = FRAME_PAIRS.length;
  let i = Math.floor(rng() * n);
  if (i === lastIndex) i = (i + 1 + Math.floor(rng() * (n - 1))) % n;
  return i;
}

// Turn the camera photo into a framed picture: workout number up top,
// two family members peeking in from the bottom corners. Returns a JPEG blob.
export async function frameSelfie(file, { title, subtitle, pair = FRAME_PAIRS[0] }) {
  const W = 1080, H = 1350;
  const photo = await loadImage(URL.createObjectURL(file));
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // photo, cropped to fill the frame
  const scale = Math.max(W / photo.width, H / photo.height);
  const pw = photo.width * scale, ph = photo.height * scale;
  ctx.drawImage(photo, (W - pw) / 2, (H - ph) / 2, pw, ph);
  URL.revokeObjectURL(photo.src);

  // shading so the words and dogs stand out
  let g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, 'rgba(21,19,31,0.85)'); g.addColorStop(1, 'rgba(21,19,31,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 300);
  g = ctx.createLinearGradient(0, H - 340, 0, H);
  g.addColorStop(0, 'rgba(21,19,31,0)'); g.addColorStop(1, 'rgba(21,19,31,0.75)');
  ctx.fillStyle = g; ctx.fillRect(0, H - 340, W, 340);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#b79cff';
  ctx.font = '700 72px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(title, W / 2, 110);
  ctx.fillStyle = '#f4f1fb';
  ctx.font = '500 40px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(subtitle, W / 2, 170);

  // the two characters, if their pictures load
  const pics = await Promise.all(pair.map((id) => loadImage(framePicture(id)).catch(() => null)));
  pics.forEach((pic, i) => {
    if (!pic) return;
    // scale each character by its own outline, so a full-length picture and a
    // waist-up picture come out a similar size: dogs a little smaller than people
    const box = figureBox(pic);
    const waistUp = box.w / box.h > 0.55; // portrait pictures (like Maria's and Mom's) sit a bit smaller
    let dh = DOGS.has(pair[i]) ? 300 : waistUp ? 320 : 440;
    let dw = box.w * (dh / box.h);
    if (dw > 400) { dh *= 400 / dw; dw = 400; }
    const x = i === 0 ? 12 : W - dw - 12;
    ctx.drawImage(pic, box.x, box.y, box.w, box.h, x, H - dh + 6, dw, dh);
  });

  ctx.fillStyle = 'rgba(244,241,251,0.85)';
  ctx.font = '700 30px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText("Annie's Gym", W / 2, H - 40);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}

// The visible part of a transparent picture (where the character actually is)
const boxCache = new Map();
function figureBox(img) {
  if (boxCache.has(img.src)) return boxCache.get(img.src);
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  let box = { x: 0, y: 0, w: c.width, h: c.height };
  try {
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
    for (let y = 0; y < c.height; y += 2) {
      for (let xx = 0; xx < c.width; xx += 2) {
        if (d[(y * c.width + xx) * 4 + 3] > 20) {
          if (xx < minX) minX = xx; if (xx > maxX) maxX = xx;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX > minX && maxY > minY) box = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  } catch (e) { /* use the whole picture */ }
  boxCache.set(img.src, box);
  return box;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Hand the picture to the phone: the share sheet on iPhone has "Save Image".
// Falls back to a normal download where sharing files isn't supported.
export async function saveToPhone(blob, name) {
  const file = new File([blob], name, { type: 'image/jpeg' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      return 'shared';
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}
