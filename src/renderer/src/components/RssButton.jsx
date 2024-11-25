import RssFeedIcon from '@mui/icons-material/RssFeed';
import { Button } from '@mui/material';
import { Link } from 'react-router';

export default function RssButton() {
  return (
    <Button fullWidth variant="contained" color="rss" startIcon={<RssFeedIcon />} to="/rss/mss" LinkComponent={Link}>
      RSS Feeds
    </Button>
  );
}
