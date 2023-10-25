import type { NextPage } from 'next';

import { useSigningClient } from 'contexts/client';

import {
  Box,
  Grid,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';

import { useContext } from 'react';
import { GuildContext } from 'contexts/guildContext';

// const GuildProfile: NextPage = () => {
//   const { walletAddress } = useSigningClient();
//   const ctx = useContext(GuildContext);
//   console.log(`context is ${JSON.stringify(ctx)}`);
//   return (
//     <>
//       <Typography variant="h4" gutterBottom>
//         Guild Profile
//       </Typography>
//       <Paper>
//         <Container>
//           <Typography variant="h5" gutterBottom>
//             Guild:{' '}
//             {ctx?.guildContract ? (
//               ctx?.guildContract.label
//             ) : (
//               <CircularProgress />
//             )}
//           </Typography>
//           <Typography variant="h5" gutterBottom>
//             Created by:{' '}
//             {ctx?.guildContract ? (
//               ctx.guildContract.creator
//             ) : (
//               <CircularProgress />
//             )}
//           </Typography>
//           {ctx?.guildAdmin && (
//             <Typography variant="h5" gutterBottom>
//               Admin is:{' '}
//               {ctx?.guildAdmin == walletAddress ? 'YOU' : ctx?.guildAdmin}
//             </Typography>
//           )}
//         </Container>
//       </Paper>

//       {ctx?.guildMembers && ctx?.guildMembers?.length > 0 && (
//         <Box>
//           <Typography variant="h6" gutterBottom>
//             Members:
//           </Typography>
//           <Paper>
//             <Container>
//               {ctx?.guildMembers?.map((member) => (
//                 <Typography variant="h6" gutterBottom key={member.name}>
//                   {member.name}
//                 </Typography>
//               ))}
//             </Container>
//           </Paper>
//         </Box>
//       )}
//     </>
//   );
// };

// export default GuildProfile;

const GuildProfile: NextPage = () => {
  const { walletAddress } = useSigningClient();
  const ctx = useContext(GuildContext);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Guild Profile
      </Typography>
      <Box>
        <Paper>
          <Typography variant="h6">Name</Typography>
          <Typography>
            {ctx?.guildContract ? (
              ctx?.guildContract.label
            ) : (
              <CircularProgress />
            )}
          </Typography>

          <Typography variant="h6">Bio</Typography>
          <Typography>
            {/* Here, you can pull the description from your context or state. */}
            The PIRaTeS BCN is a guild of elite warriors...
          </Typography>

          <Typography variant="h6">Location</Typography>
          <Typography>Spain</Typography>

          <Typography variant="h6">Website</Typography>
          <Typography>www.patrick123.com</Typography>

          {/* You can continue to add more items for Discord, Telegram, Reddit, etc... */}
        </Paper>
        <Paper>
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>
          <li>
            {ctx?.guildMembers?.map((member) => (
              <ul key={member.name}>
                <Typography variant="h6" gutterBottom key={member.name}>
                  {member.name}
                </Typography>
              </ul>
            ))}
          </li>
        </Paper>
      </Box>
    </>
  );
};

export default GuildProfile;
