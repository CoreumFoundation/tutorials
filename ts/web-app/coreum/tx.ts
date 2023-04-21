import {
  DeepPartial,
  Exact,
  MsgIssueClass,
  MsgIssueClass as AssetNFTMsgIssueClass,
  MsgMint,
  MsgMint as AssetNFTMsgMint,
} from "./proto-ts/coreum/asset/nft/v1/tx";
import {MsgSend, MsgSend as NFTMsgSend} from "./proto-ts/coreum/nft/v1beta1/tx";
import {GeneratedType} from "@cosmjs/proto-signing";

export const coreumRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/coreum.asset.nft.v1.MsgIssueClass", MsgIssueClass],
  ["/coreum.asset.nft.v1.MsgMint", MsgMint],
  ["/coreum.nft.v1beta1.MsgSend", MsgSend],
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


