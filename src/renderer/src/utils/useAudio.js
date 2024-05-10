import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useStore from '../components/Store';

const reset = { currentTime: 0, duration: 0, currentlyPlaying: undefined };

const getVolume = () => {
  const volume = parseFloat(localStorage.getItem('volume'));
  return !isNaN(volume) ? volume : 0.5;
};

export default function useAudio() {
  const [store] = useStore();
  const [state, setState] = useState(() => ({
    volume: getVolume(),
    queueIndex: 0,
    paused: true,
    muted: false,
    autoplay: store?.settings.autoplay ?? false,
    ...reset,
  }));
  const audioRef = useRef(null);

  const track = useMemo(() => [...(store.queue?.values() ?? [])][state.queueIndex], [state.queueIndex, store.queue]);

  useEffect(() => {
    if (!track) return;

    setState(s => ({ ...s, ...reset }));
    audioRef.current = new Audio();

    audioRef.current.src = track.audioUrl;
    audioRef.current.volume = state.volume;
    audioRef.current.muted = state.muted;

    const onPlay = () => setState(s => ({ ...s, paused: false }));
    audioRef.current.addEventListener('play', onPlay);

    const onPause = () => setState(s => ({ ...s, paused: true }));
    audioRef.current.addEventListener('pause', onPause);

    const onTimeUpdate = () => {
      const time = audioRef.current.currentTime;

      const offsetTime = time - (track.tracklistOffset ?? 0);

      let currentlyPlaying =
        offsetTime < 0 ? { artist: '', title: 'Ads' } : track.tracklist.findLast(t => t.timestampSeconds <= offsetTime);

      setState(s => ({ ...s, currentTime: time, currentlyPlaying }));
    };
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);

    const onDurationChange = () => setState(s => ({ ...s, duration: audioRef.current.duration }));
    audioRef.current.addEventListener('durationchange', onDurationChange);

    const onEnded = () => (store?.settings.autoplayNext ?? true) && skip();
    audioRef.current.addEventListener('ended', onEnded);

    const onCanPlayThrough = () => {
      if (state.autoplay) audioRef.current.play();
      setState(s => ({ ...s, autoplay: false }));
    };
    audioRef.current.addEventListener('canplaythrough', onCanPlayThrough);

    const onVolumeChange = () =>
      setState(s => ({ ...s, volume: audioRef.current.volume, muted: audioRef.current.muted }));
    audioRef.current.addEventListener('volumechange', onVolumeChange);

    const onKeyup = e => {
      switch (e.key) {
        case ' ':
        case 'k':
        case 'MediaPlayPause':
          return togglePlay();
        case 'm':
          return toggleMute();
        case 'ArrowUp':
          return setVolume(null, audioRef.current.volume + 0.05);
        case 'ArrowDown':
          return setVolume(null, audioRef.current.volume - 0.05);
        case 'ArrowLeft':
        case 'j':
          return rewind();
        case 'ArrowRight':
        case 'l':
          return forward();
        case 'MediaTrackNext':
          return skip();
        case 'MediaTrackPrevious':
          return previous();
      }
    };
    document.addEventListener('keyup', onKeyup);

    return () => {
      audioRef.current.removeEventListener('play', onPlay);
      audioRef.current.removeEventListener('pause', onPause);
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.current.removeEventListener('durationchange', onDurationChange);
      audioRef.current.removeEventListener('ended', onEnded);
      audioRef.current.removeEventListener('canplaythrough', onCanPlayThrough);
      audioRef.current.removeEventListener('volumechange', onVolumeChange);
      document.removeEventListener('keyup', onKeyup);
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, [state.queueIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, []);

  const setVolume = useCallback((_, value) => {
    audioRef.current.volume = value;
    setState(s => ({ ...s, volume: value }));
    localStorage.setItem('volume', value);
  }, []);

  const toggleMute = useCallback(() => {
    audioRef.current.muted = !audioRef.current.muted;
  }, []);

  const seek = useCallback((_, value) => {
    setState(s => ({ ...s, currentTime: value }));
    audioRef.current.currentTime = value;
  }, []);

  const canPrevious = state.queueIndex > 0;
  const canSkip = state.queueIndex < store.queue?.size - 1;

  const skip = useCallback(() => {
    setState(s => {
      if (!canSkip) return s;
      return { ...s, queueIndex: s.queueIndex + 1, currentTime: 0, paused: true, autoplay: true };
    });
  }, [canSkip]);

  const previous = useCallback(() => {
    setState(s => {
      if (!canPrevious) return s;
      return { ...s, queueIndex: s.queueIndex - 1, paused: true, autoplay: true };
    });
  }, [canPrevious]);

  const forward = useCallback(() => {
    audioRef.current.currentTime = audioRef.current.currentTime + 10;
  }, []);

  const rewind = useCallback(() => {
    audioRef.current.currentTime = audioRef.current.currentTime - 10;
  }, []);

  return {
    track,
    canPrevious,
    canSkip,
    ...state,
    togglePlay,
    setVolume,
    toggleMute,
    seek,
    skip,
    previous,
    forward,
    rewind,
  };
}
