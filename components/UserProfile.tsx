import type { NextPage } from 'next';
import { useContext } from 'react';
import { GuildContext } from 'contexts/guildContext';

import { Paper, Avatar, Box, Typography, Link } from '@mui/material';
import { Edit } from '@mui/icons-material';

const UserProfile: NextPage = () => {
  const ctx = useContext(GuildContext);

  console.log(`context is ${JSON.stringify(ctx)}`);
  return (
    <>
      <Typography variant="h4">My profile</Typography>
      <Paper sx={{ padding: '1rem', marginTop: '1rem' }}>
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          {/* Avatar with Edit Icon */}
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ width: 80, height: 80 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Edit fontSize="small" />
            </Box>
          </Box>

          {/* Username */}
          <Typography variant="h6">Username</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            This is your display name and how the guild will see you.
          </Typography>
          <Typography variant="body1">patrick.pirates8bcn</Typography>

          {/* Bio */}
          <Typography variant="h6">Bio</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            This is the display bio of yourself.
          </Typography>
          <Typography variant="body1">
            RPG gaming lover. Some of my favorite games are WOW and Final
            Fantasy XIV. I’m also a game developer and C# expert. I’m looking
            for new friends and communities to join, so feel free to message.
          </Typography>

          {/* Location */}
          <Typography variant="h6">Location</Typography>
          <Typography variant="body1">Spain</Typography>

          {/* Contacts */}
          <Box>
            <Typography variant="h6">Website</Typography>
            <Link
              href="http://www.patrick123.com"
              target="_blank"
              rel="noopener"
            >
              www.patrick123.com
            </Link>
          </Box>
          <Box>
            <Typography variant="h6">Discord</Typography>
            <Typography variant="body1">@patrick123</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Telegram</Typography>
            <Typography variant="body1">@patrick123</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Reddit</Typography>
            <Typography variant="body1">@patrick123</Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default UserProfile;
