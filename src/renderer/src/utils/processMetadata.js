import { parseBlob } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';
import parseAds from './parseAds';
import parseTracklist from './parseTracklist';

export const processFile = async file => {
  const metadata = await parseBlob(file);
  const track = {
    _file: file,
    _metadata: metadata,
    id: uuidv4(),
    filename: file.name,
    artist: metadata.common.artist,
    title: metadata.common.title,
  };

  if (metadata.common.picture?.[0]) {
    const blob = new Blob([new Uint8Array(metadata.common.picture[0].data)], {
      type: metadata.common.picture[0].format,
    });
    track.pictureUrl = URL.createObjectURL(blob);
  }

  track.audioUrl = URL.createObjectURL(file);

  console.log(track);
  return track;
};

export const processRss = item => {
  const thumbnailUrl = URL.parse(item.itunes.image);
  if (thumbnailUrl?.searchParams.has('max-w') || thumbnailUrl?.searchParams.has('max-h')) {
    thumbnailUrl.searchParams.set('max-w', '128');
    thumbnailUrl.searchParams.set('max-h', '128');
  }

  return {
    _rss: item,
    id: item.guid,
    filename: `${item.guid}.mp3`,
    artist: item.itunes.author,
    title: item.title,
    pictureUrl: item.itunes.image,
    thumbnailUrl: thumbnailUrl?.toString(),
    audioUrl: item.enclosure.url,
    rawTracklist: item.contentSnippet,
    duration: item.itunes.duration,
  }
};

export const finalizeRss = async track => {
  track.tracklist = parseTracklist(track.rawTracklist);
  track = await parseAds(track);
  return track;
};
