import type { NextPage } from 'next';

import { Paper, Typography } from '@mui/material';

const UserProfile: NextPage = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Paper>the users date</Paper>
    </>
  );
};

export default UserProfile;
