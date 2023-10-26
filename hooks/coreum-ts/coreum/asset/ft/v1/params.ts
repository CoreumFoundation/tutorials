/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { Coin } from '../../../../cosmos/base/v1beta1/coin';
import { Duration } from '../../../../google/protobuf/duration';
import { Timestamp } from '../../../../google/protobuf/timestamp';

export const protobufPackage = 'coreum.asset.ft.v1';

/** Params store gov manageable parameters. */
export interface Params {
  /** issue_fee is the fee burnt each time new token is issued. */
  issueFee?: Coin | undefined;
  /** token_upgrade_decision_timeout defines the end of the decision period for upgrading the token. */
  tokenUpgradeDecisionTimeout?: Date | undefined;
  /** token_upgrade_grace_period the period after which the token upgrade is executed effectively. */
  tokenUpgradeGracePeriod?: Duration | undefined;
}

function createBaseParams(): Params {
  return {
    issueFee: undefined,
    tokenUpgradeDecisionTimeout: undefined,
    tokenUpgradeGracePeriod: undefined,
  };
}

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.issueFee !== undefined) {
      Coin.encode(message.issueFee, writer.uint32(10).fork()).ldelim();
    }
    if (message.tokenUpgradeDecisionTimeout !== undefined) {
      Timestamp.encode(
        toTimestamp(message.tokenUpgradeDecisionTimeout),
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.tokenUpgradeGracePeriod !== undefined) {
      Duration.encode(
        message.tokenUpgradeGracePeriod,
        writer.uint32(26).fork(),
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.issueFee = Coin.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.tokenUpgradeDecisionTimeout = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tokenUpgradeGracePeriod = Duration.decode(
            reader,
            reader.uint32(),
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      issueFee: isSet(object.issueFee)
        ? Coin.fromJSON(object.issueFee)
        : undefined,
      tokenUpgradeDecisionTimeout: isSet(object.tokenUpgradeDecisionTimeout)
        ? fromJsonTimestamp(object.tokenUpgradeDecisionTimeout)
        : undefined,
      tokenUpgradeGracePeriod: isSet(object.tokenUpgradeGracePeriod)
        ? Duration.fromJSON(object.tokenUpgradeGracePeriod)
        : undefined,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.issueFee !== undefined) {
      obj.issueFee = Coin.toJSON(message.issueFee);
    }
    if (message.tokenUpgradeDecisionTimeout !== undefined) {
      obj.tokenUpgradeDecisionTimeout =
        message.tokenUpgradeDecisionTimeout.toISOString();
    }
    if (message.tokenUpgradeGracePeriod !== undefined) {
      obj.tokenUpgradeGracePeriod = Duration.toJSON(
        message.tokenUpgradeGracePeriod,
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.issueFee =
      object.issueFee !== undefined && object.issueFee !== null
        ? Coin.fromPartial(object.issueFee)
        : undefined;
    message.tokenUpgradeDecisionTimeout =
      object.tokenUpgradeDecisionTimeout ?? undefined;
    message.tokenUpgradeGracePeriod =
      object.tokenUpgradeGracePeriod !== undefined &&
      object.tokenUpgradeGracePeriod !== null
        ? Duration.fromPartial(object.tokenUpgradeGracePeriod)
        : undefined;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds.toNumber() || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === 'string') {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
