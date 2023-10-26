/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { Any } from '../../google/protobuf/any';
import { Timestamp } from '../../google/protobuf/timestamp';

export const protobufPackage = 'coreum.delay.v1';

/** GenesisState defines the module genesis state. */
export interface GenesisState {
  /** tokens keep the fungible token state */
  delayedItems: DelayedItem[];
}

export interface DelayedItem {
  id: string;
  executionTime?: Date | undefined;
  data?: Any | undefined;
}

function createBaseGenesisState(): GenesisState {
  return { delayedItems: [] };
}

export const GenesisState = {
  encode(
    message: GenesisState,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.delayedItems) {
      DelayedItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.delayedItems.push(
            DelayedItem.decode(reader, reader.uint32()),
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

  fromJSON(object: any): GenesisState {
    return {
      delayedItems: Array.isArray(object?.delayedItems)
        ? object.delayedItems.map((e: any) => DelayedItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    if (message.delayedItems?.length) {
      obj.delayedItems = message.delayedItems.map((e) => DelayedItem.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenesisState>, I>>(
    base?: I,
  ): GenesisState {
    return GenesisState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(
    object: I,
  ): GenesisState {
    const message = createBaseGenesisState();
    message.delayedItems =
      object.delayedItems?.map((e) => DelayedItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDelayedItem(): DelayedItem {
  return { id: '', executionTime: undefined, data: undefined };
}

export const DelayedItem = {
  encode(
    message: DelayedItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    if (message.executionTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.executionTime),
        writer.uint32(18).fork(),
      ).ldelim();
    }
    if (message.data !== undefined) {
      Any.encode(message.data, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelayedItem {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelayedItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.executionTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32()),
          );
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DelayedItem {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      executionTime: isSet(object.executionTime)
        ? fromJsonTimestamp(object.executionTime)
        : undefined,
      data: isSet(object.data) ? Any.fromJSON(object.data) : undefined,
    };
  },

  toJSON(message: DelayedItem): unknown {
    const obj: any = {};
    if (message.id !== '') {
      obj.id = message.id;
    }
    if (message.executionTime !== undefined) {
      obj.executionTime = message.executionTime.toISOString();
    }
    if (message.data !== undefined) {
      obj.data = Any.toJSON(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DelayedItem>, I>>(base?: I): DelayedItem {
    return DelayedItem.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DelayedItem>, I>>(
    object: I,
  ): DelayedItem {
    const message = createBaseDelayedItem();
    message.id = object.id ?? '';
    message.executionTime = object.executionTime ?? undefined;
    message.data =
      object.data !== undefined && object.data !== null
        ? Any.fromPartial(object.data)
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
