import Forward10Icon from '@mui/icons-material/Forward10';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Replay10Icon from '@mui/icons-material/Replay10';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, Fab, IconButton, Slider, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DebugInfoDialog from '../components/DebugInfoDialog';
import useStore from '../components/Store';
import { stringTimestamp } from '../utils/timestamp';
import useAudio from '../utils/useAudio';

export function Component() {
  const [store] = useStore();
  const navigate = useNavigate();
  const {
    track,
    canPrevious,
    canSkip,
    currentlyPlaying,
    currentTime,
    duration,
    paused,
    muted,
    volume,
    togglePlay,
    setVolume,
    toggleMute,
    seek,
    skip,
    previous,
    forward,
    rewind,
  } = useAudio();

  const artistText = currentlyPlaying?.artist ?? track?.artist ?? '';
  const fileTitleText = track?.title ?? track?.filename ?? '';
  const titleText = currentlyPlaying?.title ?? fileTitleText;

  const bodyVariant = store.settings.useFont === false ? 'body1' : 'mcat_body1';
  const h3Variant = store.settings.useFont === false ? 'h3' : 'mcat_h3';
  const h4Variant = store.settings.useFont === false ? 'h4' : 'mcat_h4';

  const transformText = useCallback(
    text => (store.settings.useCaps === false ? text : text.toUpperCase()),
    [store.settings.useCaps]
  );

  return (
    <Stack sx={{ height: '100%', p: 2 }} spacing={2}>
      <Typography variant={bodyVariant}>{currentlyPlaying && transformText(fileTitleText)}</Typography>

      <Stack justifyContent="end" sx={{ flexGrow: 1 }}>
        {/* <img> was being annoying so this is the workaround :) */}
        {track?.pictureUrl && (
          <Stack justifyContent="center" alignItems="center" sx={{ height: '100%', mb: 2 }}>
            <Box
              sx={{
                backgroundImage: `url(${track.pictureUrl})`,
                backgroundSize: 'cover',
                height: '100%',
                aspectRatio: 1,
              }}
            />
          </Stack>
        )}
        <Typography variant={h3Variant}>{transformText(artistText)}</Typography>
        <Typography variant={h4Variant}>{transformText(titleText)}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Typography>{stringTimestamp(currentTime)}</Typography>
        <Slider min={0} max={duration} value={currentTime} onChange={seek} />
        <Typography>{stringTimestamp(duration)}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" justifyContent="start" sx={{ flexGrow: 1, flexBasis: 0 }}>
          <IconButton size="large" onClick={() => navigate('/queue')}>
            <QueueMusicIcon fontSize="inherit" />
          </IconButton>
          {track?._debug && <DebugInfoDialog data={track._debug} />}
        </Stack>

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mx: 6 }}>
          <IconButton size="large" disabled={!canPrevious} onClick={previous}>
            <SkipPreviousIcon fontSize="inherit" />
          </IconButton>
          <IconButton size="large" onClick={rewind}>
            <Replay10Icon fontSize="inherit" />
          </IconButton>
          <Fab color="primary" onClick={togglePlay} onKeyUp={e => e.key === ' ' && e.stopPropagation()}>
            {paused ? <PlayArrowIcon /> : <PauseIcon />}
          </Fab>
          <IconButton size="large" onClick={forward}>
            <Forward10Icon fontSize="inherit" />
          </IconButton>
          <IconButton size="large" disabled={!canSkip} onClick={skip}>
            <SkipNextIcon fontSize="inherit" />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="end"
          spacing={2}
          sx={{ flexGrow: 1, flexBasis: 0, mr: 2 }}
        >
          <IconButton onClick={toggleMute}>
            {muted ? (
              <VolumeOffIcon fontSize="large" color="action" />
            ) : (
              <VolumeUpIcon fontSize="large" color="action" />
            )}
          </IconButton>
          <Slider
            value={volume}
            disabled={muted}
            min={0}
            max={1}
            step={0.01}
            size="small"
            sx={{ maxWidth: '30%' }}
            onChange={setVolume}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `${Math.floor(v * 100)}%`}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

Component.displayName = 'Player';
