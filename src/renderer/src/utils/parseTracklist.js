import { parseTimestamp } from './timestamp';
const re = /(?:(?<special>.+):\n)?(?:\d+\. (?<l_track>.+?))?\[?(?<timestamp>\d+:\d+(?::\d+)?)\]?(?<r_track>.+)?/g;

export default function parseTracklist(tracklist) {
  const parsed = [];
  const matches = tracklist.matchAll(re);

  for (const match of matches) {
    const track = match.groups.l_track ?? match.groups.r_track;
    if (!track) continue;
    const [artist, ...titleParts] = track.split(' - ');
    let title = titleParts.join(' - ').trim();

    if (match.groups.special) {
      title += ` [${match.groups.special}]`;
    }

    parsed.push({
      artist: artist.trim(),
      title,
      timestamp: match.groups.timestamp,
      timestampSeconds: parseTimestamp(match.groups.timestamp),
    });
  }

  return parsed.sort((a, b) => a.timestampSeconds - b.timestampSeconds);
}
