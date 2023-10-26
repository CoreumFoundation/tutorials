import {
  DeepPartial,
  Exact,
  MsgIssueClass as AssetNFTMsgIssueClass,
  MsgMint as AssetNFTMsgMint,
} from "./proto-ts/coreum/asset/nft/v1/tx";
import {MsgSend as NFTMsgSend} from "./proto-ts/coreum/nft/v1beta1/tx";
import {GeneratedType} from "@cosmjs/proto-signing";

import {
  DeepPartial,
  Exact,
  MsgIssue as AssetFTMsgIssueClass,
  MsgMint as AssetFTMsgMint,
} from "./proto-ts/coreum/asset/ft/v1/tx";

export const coreumRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/coreum.asset.nft.v1.MsgIssueClass", AssetNFTMsgIssueClass],
  ["/coreum.asset.nft.v1.MsgMint", AssetNFTMsgMint],
  ["/coreum.nft.v1beta1.MsgSend", NFTMsgSend],
  ["/coreum.asset.ft.v1.MsgIssue", AssetFTMsgIssueClass],
  ["/coreum.asset.ft.v1.MsgMint", AssetFTMsgMint]
];

export namespace AssetNFT {
  export const MsgIssueClass = function <I extends Exact<DeepPartial<AssetNFTMsgIssueClass>, I>>(object: I) {
    return {
      typeUrl: "/coreum.asset.nft.v1.MsgIssueClass",
      value: AssetNFTMsgIssueClass.fromPartial(object),
    };
  };

  export const MsgMint = function <I extends Exact<DeepPartial<AssetNFTMsgMint>, I>>(object: I) {
    return {
      typeUrl: "/coreum.asset.nft.v1.MsgMint",
      value: AssetNFTMsgMint.fromPartial(object),
    };
  };
}

export namespace NFT {
  export const MsgSend = function <I extends Exact<DeepPartial<NFTMsgSend>, I>>(object: I) {
    return {
      typeUrl: "/coreum.nft.v1beta1.MsgSend",
      value: NFTMsgSend.fromPartial(object),
    };
  };
}

export namespace AssetFT {
  export const MsgIssue = function <I extends Exact<DeepPartial<AssetFTMsgIssueClass>, I>>(object: I) {
    return {
      typeUrl: "/coreum.asset.ft.v1.MsgIssue",
      value: AssetFTMsgIssueClass.fromPartial(object),
    };
  };

  export const MsgMint = function <I extends Exact<DeepPartial<AssetFTMsgMint>, I>>(object: I) {
    return {
      typeUrl: "/coreum.asset.ft.v1.MsgMint",
      value: AssetFTMsgMint.fromPartial(object),
    };
  };
}

