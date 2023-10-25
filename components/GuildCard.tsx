import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

import { styled } from '@mui/styles';

//@ts-ignore
import { type Guild } from 'util/types';
import { SIZES } from 'pages/theme';

type Props = {
  guild: Guild;
  handleClick: () => void;
};

function GuildCard({ guild, handleClick }: Props) {
  const StyledName = styled(Typography)({
    textTransform: 'none',
  });

  return (
    <Card onClick={handleClick}>
      <CardActionArea
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 150, objectFit: 'cover', height: 150 }}
          image={guild.thumbnail}
          alt={guild.name}
        />
        <CardContent sx={{ textAlign: 'left', margin: SIZES.lineHeight }}>
          <StyledName variant="h5" gutterBottom>
            {guild.name}
          </StyledName>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            <b>members: {guild.totalMembers}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default GuildCard;
