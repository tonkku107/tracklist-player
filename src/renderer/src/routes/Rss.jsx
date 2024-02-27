import { Button, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Suspense, memo, useCallback } from 'react';
import { Await, Link, defer, useLoaderData, useParams } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, areEqual } from 'react-window';
import Parser from 'rss-parser';
import ListTrack from '../components/ListTrack';
import Loading from '../components/Loading';
import useStore from '../components/Store';
import { finalizeRss, processRss } from '../utils/processMetadata';

const shows = {
  mss: 'https://feeds.megaphone.fm/MSC5503498991',
  cotw: 'https://feeds.megaphone.fm/MSC1713576256',
};

export async function loader({ params }) {
  const rssUrl = shows[params.show];
  if (!rssUrl) throw new Response('Invalid RSS feed', { status: 404 });
  const parser = new Parser();

  return defer({ feed: parser.parseURL(rssUrl) });
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
      <Tabs value={show} centered sx={{ mb: 1 }}>
        <Tab label="Monstercat Silk Showcase" value="mss" to="/rss/mss" component={Link} />
        <Tab label="Monstercat Call of the Wild" value="cotw" to="/rss/cotw" component={Link} />
      </Tabs>

      <Stack sx={{ height: '100%' }}>
        <Suspense fallback={<Loading />}>
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
        <Button variant="contained" disabled={!store.queue?.size} to="/queue" LinkComponent={Link}>
          Show queue
        </Button>
      </Stack>
    </Stack>
  );
}

Component.displayName = 'Rss';
