import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Divider, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Suspense, memo, useCallback } from 'react';
import { Await, Link, redirect, useLoaderData, useParams } from 'react-router';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, areEqual } from 'react-window';
import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import ListTrack from '../components/ListTrack';
import Loading from '../components/Loading';
import useStore from '../components/Store';
import { finalizeRss, processRss } from '../utils/processMetadata';

const shows = {
  mss: 'https://feeds.megaphone.fm/MSC5503498991',
  cotw: 'https://feeds.megaphone.fm/MSC1713576256',
};

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const refresh = url.searchParams.get('refresh');

  const rssUrl = shows[params.show];
  if (!rssUrl) throw new Response('Invalid RSS feed', { status: 404 });

  const req = fetch(rssUrl, {
    cache: refresh ? 'reload' : 'default',
    signal: request.signal,
  });

  if (refresh) {
    url.searchParams.delete('refresh');
    return redirect(url.toString());
  }

  const parser = new Parser();
  const feed = req.then(res => {
    if (!res.ok) throw res;
    return res.text()
  }).then(xml => parser.parseString(xml));

  return {
    feed,
    requestId: uuidv4(), // random key for suspense so that loading state can be shown again so that the user knows something is happening
  };
}

export function Component() {
  const [store, dispatch] = useStore();
  const { show } = useParams();
  const data = useLoaderData();

  const addTrack = useCallback(
    async rssTrack => {
      const track = await finalizeRss(rssTrack);
      dispatch({ type: 'ADD_TRACK_TO_QUEUE', track });
    },
    [dispatch]
  );

  return (
    <Stack sx={{ height: '100%', width: '100%' }}>
      <Stack>
        <Tabs value={show} centered sx={{ mb: 1 }}>
          <Tab label="Monstercat Silk Showcase" value="mss" to="/rss/mss" component={Link} />
          <Tab label="Monstercat Call of the Wild" value="cotw" to="/rss/cotw" component={Link} />
        </Tabs>

        <Box sx={{ position: 'absolute', right: '8px', top: '8px' }}>
          <IconButton component={Link} to={{ search: '?refresh=true' }}><RefreshIcon /></IconButton>
        </Box>
      </Stack>

      <Stack sx={{ height: '100%' }}>
        <Suspense key={data.requestId} fallback={<Loading />}>
          <Await resolve={data.feed} errorElement={<p>Failed to load the feed!</p>}>
            {feed => (
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    height={height}
                    width={width}
                    itemSize={80}
                    itemCount={feed.items.length}
                    itemData={feed.items}
                    overscanCount={5}
                  >
                    {memo(function ListRow({ data, index, style }) {
                      const item = data[index];
                      const track = processRss(item);
                      return (
                        <ListTrack
                          key={item.guid}
                          track={track}
                          style={style}
                          exists={store.queue?.has(item.guid)}
                          onAdd={addTrack.bind(null, track)}
                        />
                      );
                    }, areEqual)}
                  </FixedSizeList>
                )}
              </AutoSizer>
            )}
          </Await>
        </Suspense>
      </Stack>

      <Divider flexItem />

      <Stack direction="row" alignItems="center" justifyContent="space-around" sx={{ p: 1 }}>
        <Typography>
          {store.queue?.size ?? 0} {store.queue?.size === 1 ? 'item' : 'items'} in queue
        </Typography>
        <Button variant="contained" to={store.queue?.size ? '/queue' : '/'} LinkComponent={Link}>
          {store.queue?.size ? 'Show queue' : 'Cancel'}
        </Button>
      </Stack>
    </Stack>
  );
}

Component.displayName = 'Rss';
