import type { NextPage } from 'next';

import { Box, Typography } from '@mui/material';

import { VoteProposal } from './VoteProposal';
import { useContext } from 'react';
import { GuildContext } from 'contexts/guildContext';
//@ts-ignore
import { Proposal } from 'util/types';

const Vote: NextPage = () => {
  const ctx = useContext(GuildContext);
  let proposals = ctx?.guildProposals;
  let members = ctx?.guildMembers;

  function getUsername(address: string) {
    if (!members) return;
    let m = members.find((x) => x.addr == address);
    return m.name;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vote
      </Typography>
      <Box>
        {proposals.length > 0 ? (
          <>
            {proposals.map((p: Proposal) => {
              return (
                <VoteProposal
                  key={p.id}
                  //@ts-ignore
                  prop={p}
                  creatorName={getUsername(p.proposer)}
                />
              );
            })}
          </>
        ) : (
          <Typography variant="h5" gutterBottom>
            No proposals in this guild.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Vote;
