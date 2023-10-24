export default interface Guild {
  address: string;
  codeId: number;
  creator: string;
  label: string;
}

export default interface Member {
  addr: string;
  name: string;
  weight: number;
}

type GuildType = {
  name: string;
  thumbnail: string;
  totalMembers: number;
};

export type { GuildType };
