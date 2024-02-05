import * as musicMetadata from 'music-metadata-browser';
import parseAds from './parseAds';
import parseTracklist from './parseTracklist';

export const processFile = async file => {
  const metadata = await musicMetadata.parseBlob(file);
  const track = {
    _file: file,
    _metadata: metadata,
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

export const processRss = item => ({
  _rss: item,
  filename: item.guid,
  artist: item.itunes.author,
  title: item.title,
  pictureUrl: item.itunes.image,
  audioUrl: item.enclosure.url,
  rawTracklist: item.contentSnippet,
  duration: item.itunes.duration,
});

export const finalizeRss = async track => {
  track.tracklist = parseTracklist(track.rawTracklist);
  track = await parseAds(track);
  return track;
};
