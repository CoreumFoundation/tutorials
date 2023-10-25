import type { NextPage } from 'next';

import { Box, Typography } from '@mui/material';

import { VoteProposal } from './VoteProposal';

const Vote: NextPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vote
      </Typography>
      <Box>
        <VoteProposal />
      </Box>
    </Box>
  );
};

export default Vote;
