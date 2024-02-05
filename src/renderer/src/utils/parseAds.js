export default async function parseAds(track) {
  const controller = new AbortController();
  const res = await fetch(track.audioUrl, { signal: controller.signal });
  controller.abort();

  track.audioUrl = res.url;

  const payload1 = res.headers.get('X-Megaphone-Payload');
  const payload2 = res.headers.get('X-Megaphone-Payload-2');

  // If the header doesn't exist we're probably outside of electron or something changed and we can't do anything
  if (!payload2) return track;
  track._debug = { payload1, payload2, url: res.url };

  const [adSection, endSection] = payload2.split('@').map(s => s.split('#'));
  const [id, startOfContent] = adSection.splice(0, 2);
  const [contentId, bitrate, startOfAudio] = endSection;

  const ads = [];
  while (adSection.length > 0) {
    const [adType /* pre, mid, post */, index, startOfAd, adId, properties, unknown] = adSection.splice(0, 6);
    ads.push({ adType, index, startOfAd, adId, properties, unknown });
  }

  // Parsing and reverse engineering all of this was probably not necessary, but it might help debug other ad edge cases in the future
  const parsedPayload = { id, startOfContent, contentId, bitrate, startOfAudio, ads };
  track._debug.parsedPayload = parsedPayload;

  if (startOfContent != 0) {
    // Since the position values are in bytes, we need to load the ads and inspect the duration.
    // Blocking the ads would've been so much simpler fr...
    const adRes = await fetch(res.url, { headers: { range: `bytes=0-${startOfContent}` } });
    const preRollAds = await adRes.blob();
    const tracklistOffset = await getDuration(preRollAds);
    track.tracklistOffset = tracklistOffset;
    track._debug.tracklistOffset = tracklistOffset;
  }

  console.log(track);
  return track;
}

const getDuration = blob =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.ondurationchange = () => resolve(audio.duration);
    audio.onerror = e => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    audio.onload = () => URL.revokeObjectURL(url);
    audio.src = url;
  });
