import styled from '@emotion/styled';
import { Typography, Box } from '@mui/material';
import { StyledLink } from './StyledLink';
import { COLORS, SIZES } from 'pages/theme';

import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';

const StyledFooter = styled(Box)`
  align-items: center;
  display: flex;
  height: ${SIZES['lineHeight'] * 3}rem;
  justify-content: center;
  display: flex;
  flex-direction: column;
  gap: ${SIZES['lineHeight']}rem;
  flex-grow: 1;
`;

const LinkContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: ${SIZES['lineHeight']}rem;
`;

const IconsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: ${SIZES['lineHeight']}rem;
`;

const FooterLink = styled(StyledLink)`
  color: ${COLORS['lightGrey']};

  &:hover {
    color: ${COLORS['white']};
    text-decoration: none;
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
      <LinkContainer>
        <Typography variant="body2" color="textPrimary">
          <FooterLink
            href={process.env.NEXT_PUBLIC_CHAIN_EXPLORER || ''}
            target="_blank"
            rel="noreferrer"
          >
            Partners Request
          </FooterLink>
        </Typography>
        <Typography variant="body2" color="textPrimary">
          <FooterLink
            href={process.env.NEXT_PUBLIC_CHAIN_EXPLORER || ''}
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </FooterLink>
        </Typography>
        <Typography variant="body2" color="textPrimary">
          <FooterLink
            href={process.env.NEXT_PUBLIC_CHAIN_EXPLORER || ''}
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </FooterLink>
        </Typography>
      </LinkContainer>
      <IconsContainer>
        <FooterLink href={''} target="_blank" rel="noreferrer">
          <FacebookIcon width="24" height="24" />
        </FooterLink>
        <FooterLink href={''} target="_blank" rel="noreferrer">
          <RedditIcon width="24" height="24" />
        </FooterLink>
        <FooterLink href={''} target="_blank" rel="noreferrer">
          <TelegramIcon width="24" height="24" />
        </FooterLink>
        <FooterLink href={''} target="_blank" rel="noreferrer">
          <TwitterIcon width="24" height="24" />
        </FooterLink>
        <FooterLink href={''} target="_blank" rel="noreferrer">
          <YouTubeIcon width="24" height="24" />
        </FooterLink>
        <FooterLink href={''} target="_blank" rel="noreferrer">
          <EmailIcon width="24" height="24" />
        </FooterLink>
      </IconsContainer>
    </StyledFooter>
  );
}
