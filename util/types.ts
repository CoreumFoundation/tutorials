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

type Proposal = {
  id: number;
  title: string;
  description: string;
  msgs: any[];
  status: any;
  expires: any;
  threshold: any;
  proposer: string;
  deposit: any;
  vault: string;
};

export type { GuildType };
export type { Guild };
