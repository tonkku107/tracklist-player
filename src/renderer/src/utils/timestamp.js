export function parseTimestamp(timestamp) {
  const splits = timestamp.split(':');
  let hours, minutes, seconds;
  if (splits.length === 3) {
    [hours, minutes, seconds] = splits;
  } else {
    [minutes, seconds] = splits;
  }
  let time = parseInt(seconds);
  time += parseInt(minutes) * 60;
  time += parseInt(hours ?? 0) * 3600;

  return time;
}

export function stringTimestamp(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor((time % 3600) % 60);

  return `${hours > 0 ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
