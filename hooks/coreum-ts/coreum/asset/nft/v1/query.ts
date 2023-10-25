/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../../../cosmos/base/query/v1beta1/pagination";
import { Class } from "./nft";
import { Params } from "./params";

export const protobufPackage = "coreum.asset.nft.v1";

/** QueryParamsRequest defines the request type for querying x/asset/nft parameters. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse defines the response type for querying x/asset/nft parameters. */
export interface QueryParamsResponse {
  params?: Params | undefined;
}

/** QueryTokenRequest is request type for the Query/Class RPC method. */
export interface QueryClassRequest {
  /** we don't use the gogoproto.customname here since the google.api.http ignores it and generates invalid code. */
  id: string;
}

/** QueryClassResponse is response type for the Query/Class RPC method. */
export interface QueryClassResponse {
  class?: Class | undefined;
}

/** QueryTokenRequest is request type for the Query/Classes RPC method. */
export interface QueryClassesRequest {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest | undefined;
  issuer: string;
}

/** QueryClassResponse is response type for the Query/Classes RPC method. */
export interface QueryClassesResponse {
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse | undefined;
  classes: Class[];
}

export interface QueryFrozenRequest {
  id: string;
  classId: string;
}

export interface QueryFrozenResponse {
  frozen: boolean;
}

export interface QueryWhitelistedRequest {
  id: string;
  classId: string;
  account: string;
}

export interface QueryWhitelistedResponse {
  whitelisted: boolean;
}

export interface QueryWhitelistedAccountsForNFTRequest {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest | undefined;
  id: string;
  classId: string;
}

export interface QueryWhitelistedAccountsForNFTResponse {
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse | undefined;
  accounts: string[];
}

export interface QueryBurntNFTRequest {
  classId: string;
  nftId: string;
}

export interface QueryBurntNFTResponse {
  burnt: boolean;
}

export interface QueryBurntNFTsInClassRequest {
  pagination?: PageRequest | undefined;
  classId: string;
}

export interface QueryBurntNFTsInClassResponse {
  pagination?: PageResponse | undefined;
  nftIds: string[];
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): QueryParamsRequest {
    return {};
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(base?: I): QueryParamsRequest {
    return QueryParamsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(_: I): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse = {
  encode(message: QueryParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    return { params: isSet(object.params) ? Params.fromJSON(object.params) : undefined };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(base?: I): QueryParamsResponse {
    return QueryParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(object: I): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseQueryClassRequest(): QueryClassRequest {
  return { id: "" };
}

export const QueryClassRequest = {
  encode(message: QueryClassRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryClassRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClassRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryClassRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: QueryClassRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryClassRequest>, I>>(base?: I): QueryClassRequest {
    return QueryClassRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryClassRequest>, I>>(object: I): QueryClassRequest {
    const message = createBaseQueryClassRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseQueryClassResponse(): QueryClassResponse {
  return { class: undefined };
}

export const QueryClassResponse = {
  encode(message: QueryClassResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.class !== undefined) {
      Class.encode(message.class, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryClassResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClassResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.class = Class.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryClassResponse {
    return { class: isSet(object.class) ? Class.fromJSON(object.class) : undefined };
  },

  toJSON(message: QueryClassResponse): unknown {
    const obj: any = {};
    if (message.class !== undefined) {
      obj.class = Class.toJSON(message.class);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryClassResponse>, I>>(base?: I): QueryClassResponse {
    return QueryClassResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryClassResponse>, I>>(object: I): QueryClassResponse {
    const message = createBaseQueryClassResponse();
    message.class = (object.class !== undefined && object.class !== null) ? Class.fromPartial(object.class) : undefined;
    return message;
  },
};

function createBaseQueryClassesRequest(): QueryClassesRequest {
  return { pagination: undefined, issuer: "" };
}

export const QueryClassesRequest = {
  encode(message: QueryClassesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    if (message.issuer !== "") {
      writer.uint32(18).string(message.issuer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryClassesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClassesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.issuer = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryClassesRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
      issuer: isSet(object.issuer) ? String(object.issuer) : "",
    };
  },

  toJSON(message: QueryClassesRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    if (message.issuer !== "") {
      obj.issuer = message.issuer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryClassesRequest>, I>>(base?: I): QueryClassesRequest {
    return QueryClassesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryClassesRequest>, I>>(object: I): QueryClassesRequest {
    const message = createBaseQueryClassesRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    message.issuer = object.issuer ?? "";
    return message;
  },
};

function createBaseQueryClassesResponse(): QueryClassesResponse {
  return { pagination: undefined, classes: [] };
}

export const QueryClassesResponse = {
  encode(message: QueryClassesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.classes) {
      Class.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryClassesResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClassesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.classes.push(Class.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryClassesResponse {
    return {
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
      classes: Array.isArray(object?.classes) ? object.classes.map((e: any) => Class.fromJSON(e)) : [],
    };
  },

  toJSON(message: QueryClassesResponse): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    if (message.classes?.length) {
      obj.classes = message.classes.map((e) => Class.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryClassesResponse>, I>>(base?: I): QueryClassesResponse {
    return QueryClassesResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryClassesResponse>, I>>(object: I): QueryClassesResponse {
    const message = createBaseQueryClassesResponse();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    message.classes = object.classes?.map((e) => Class.fromPartial(e)) || [];
    return message;
  },
};

function createBaseQueryFrozenRequest(): QueryFrozenRequest {
  return { id: "", classId: "" };
}

export const QueryFrozenRequest = {
  encode(message: QueryFrozenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.classId !== "") {
      writer.uint32(18).string(message.classId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryFrozenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryFrozenRequest();
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

          message.classId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryFrozenRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      classId: isSet(object.classId) ? String(object.classId) : "",
    };
  },

  toJSON(message: QueryFrozenRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.classId !== "") {
      obj.classId = message.classId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryFrozenRequest>, I>>(base?: I): QueryFrozenRequest {
    return QueryFrozenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryFrozenRequest>, I>>(object: I): QueryFrozenRequest {
    const message = createBaseQueryFrozenRequest();
    message.id = object.id ?? "";
    message.classId = object.classId ?? "";
    return message;
  },
};

function createBaseQueryFrozenResponse(): QueryFrozenResponse {
  return { frozen: false };
}

export const QueryFrozenResponse = {
  encode(message: QueryFrozenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.frozen === true) {
      writer.uint32(8).bool(message.frozen);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryFrozenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryFrozenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.frozen = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryFrozenResponse {
    return { frozen: isSet(object.frozen) ? Boolean(object.frozen) : false };
  },

  toJSON(message: QueryFrozenResponse): unknown {
    const obj: any = {};
    if (message.frozen === true) {
      obj.frozen = message.frozen;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryFrozenResponse>, I>>(base?: I): QueryFrozenResponse {
    return QueryFrozenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryFrozenResponse>, I>>(object: I): QueryFrozenResponse {
    const message = createBaseQueryFrozenResponse();
    message.frozen = object.frozen ?? false;
    return message;
  },
};

function createBaseQueryWhitelistedRequest(): QueryWhitelistedRequest {
  return { id: "", classId: "", account: "" };
}

export const QueryWhitelistedRequest = {
  encode(message: QueryWhitelistedRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.classId !== "") {
      writer.uint32(18).string(message.classId);
    }
    if (message.account !== "") {
      writer.uint32(26).string(message.account);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryWhitelistedRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryWhitelistedRequest();
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

          message.classId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.account = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryWhitelistedRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      classId: isSet(object.classId) ? String(object.classId) : "",
      account: isSet(object.account) ? String(object.account) : "",
    };
  },

  toJSON(message: QueryWhitelistedRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.classId !== "") {
      obj.classId = message.classId;
    }
    if (message.account !== "") {
      obj.account = message.account;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryWhitelistedRequest>, I>>(base?: I): QueryWhitelistedRequest {
    return QueryWhitelistedRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryWhitelistedRequest>, I>>(object: I): QueryWhitelistedRequest {
    const message = createBaseQueryWhitelistedRequest();
    message.id = object.id ?? "";
    message.classId = object.classId ?? "";
    message.account = object.account ?? "";
    return message;
  },
};

function createBaseQueryWhitelistedResponse(): QueryWhitelistedResponse {
  return { whitelisted: false };
}

export const QueryWhitelistedResponse = {
  encode(message: QueryWhitelistedResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.whitelisted === true) {
      writer.uint32(8).bool(message.whitelisted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryWhitelistedResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryWhitelistedResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.whitelisted = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryWhitelistedResponse {
    return { whitelisted: isSet(object.whitelisted) ? Boolean(object.whitelisted) : false };
  },

  toJSON(message: QueryWhitelistedResponse): unknown {
    const obj: any = {};
    if (message.whitelisted === true) {
      obj.whitelisted = message.whitelisted;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryWhitelistedResponse>, I>>(base?: I): QueryWhitelistedResponse {
    return QueryWhitelistedResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryWhitelistedResponse>, I>>(object: I): QueryWhitelistedResponse {
    const message = createBaseQueryWhitelistedResponse();
    message.whitelisted = object.whitelisted ?? false;
    return message;
  },
};

function createBaseQueryWhitelistedAccountsForNFTRequest(): QueryWhitelistedAccountsForNFTRequest {
  return { pagination: undefined, id: "", classId: "" };
}

export const QueryWhitelistedAccountsForNFTRequest = {
  encode(message: QueryWhitelistedAccountsForNFTRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.classId !== "") {
      writer.uint32(26).string(message.classId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryWhitelistedAccountsForNFTRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryWhitelistedAccountsForNFTRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.classId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryWhitelistedAccountsForNFTRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
      id: isSet(object.id) ? String(object.id) : "",
      classId: isSet(object.classId) ? String(object.classId) : "",
    };
  },

  toJSON(message: QueryWhitelistedAccountsForNFTRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.classId !== "") {
      obj.classId = message.classId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryWhitelistedAccountsForNFTRequest>, I>>(
    base?: I,
  ): QueryWhitelistedAccountsForNFTRequest {
    return QueryWhitelistedAccountsForNFTRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryWhitelistedAccountsForNFTRequest>, I>>(
    object: I,
  ): QueryWhitelistedAccountsForNFTRequest {
    const message = createBaseQueryWhitelistedAccountsForNFTRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    message.id = object.id ?? "";
    message.classId = object.classId ?? "";
    return message;
  },
};

function createBaseQueryWhitelistedAccountsForNFTResponse(): QueryWhitelistedAccountsForNFTResponse {
  return { pagination: undefined, accounts: [] };
}

export const QueryWhitelistedAccountsForNFTResponse = {
  encode(message: QueryWhitelistedAccountsForNFTResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.accounts) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryWhitelistedAccountsForNFTResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryWhitelistedAccountsForNFTResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.accounts.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryWhitelistedAccountsForNFTResponse {
    return {
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
      accounts: Array.isArray(object?.accounts) ? object.accounts.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: QueryWhitelistedAccountsForNFTResponse): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    if (message.accounts?.length) {
      obj.accounts = message.accounts;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryWhitelistedAccountsForNFTResponse>, I>>(
    base?: I,
  ): QueryWhitelistedAccountsForNFTResponse {
    return QueryWhitelistedAccountsForNFTResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryWhitelistedAccountsForNFTResponse>, I>>(
    object: I,
  ): QueryWhitelistedAccountsForNFTResponse {
    const message = createBaseQueryWhitelistedAccountsForNFTResponse();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    message.accounts = object.accounts?.map((e) => e) || [];
    return message;
  },
};

function createBaseQueryBurntNFTRequest(): QueryBurntNFTRequest {
  return { classId: "", nftId: "" };
}

export const QueryBurntNFTRequest = {
  encode(message: QueryBurntNFTRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.classId !== "") {
      writer.uint32(10).string(message.classId);
    }
    if (message.nftId !== "") {
      writer.uint32(18).string(message.nftId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBurntNFTRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBurntNFTRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.classId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nftId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryBurntNFTRequest {
    return {
      classId: isSet(object.classId) ? String(object.classId) : "",
      nftId: isSet(object.nftId) ? String(object.nftId) : "",
    };
  },

  toJSON(message: QueryBurntNFTRequest): unknown {
    const obj: any = {};
    if (message.classId !== "") {
      obj.classId = message.classId;
    }
    if (message.nftId !== "") {
      obj.nftId = message.nftId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryBurntNFTRequest>, I>>(base?: I): QueryBurntNFTRequest {
    return QueryBurntNFTRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryBurntNFTRequest>, I>>(object: I): QueryBurntNFTRequest {
    const message = createBaseQueryBurntNFTRequest();
    message.classId = object.classId ?? "";
    message.nftId = object.nftId ?? "";
    return message;
  },
};

function createBaseQueryBurntNFTResponse(): QueryBurntNFTResponse {
  return { burnt: false };
}

export const QueryBurntNFTResponse = {
  encode(message: QueryBurntNFTResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.burnt === true) {
      writer.uint32(8).bool(message.burnt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBurntNFTResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBurntNFTResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.burnt = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryBurntNFTResponse {
    return { burnt: isSet(object.burnt) ? Boolean(object.burnt) : false };
  },

  toJSON(message: QueryBurntNFTResponse): unknown {
    const obj: any = {};
    if (message.burnt === true) {
      obj.burnt = message.burnt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryBurntNFTResponse>, I>>(base?: I): QueryBurntNFTResponse {
    return QueryBurntNFTResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryBurntNFTResponse>, I>>(object: I): QueryBurntNFTResponse {
    const message = createBaseQueryBurntNFTResponse();
    message.burnt = object.burnt ?? false;
    return message;
  },
};

function createBaseQueryBurntNFTsInClassRequest(): QueryBurntNFTsInClassRequest {
  return { pagination: undefined, classId: "" };
}

export const QueryBurntNFTsInClassRequest = {
  encode(message: QueryBurntNFTsInClassRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    if (message.classId !== "") {
      writer.uint32(18).string(message.classId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBurntNFTsInClassRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBurntNFTsInClassRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.classId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryBurntNFTsInClassRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
      classId: isSet(object.classId) ? String(object.classId) : "",
    };
  },

  toJSON(message: QueryBurntNFTsInClassRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    if (message.classId !== "") {
      obj.classId = message.classId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryBurntNFTsInClassRequest>, I>>(base?: I): QueryBurntNFTsInClassRequest {
    return QueryBurntNFTsInClassRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryBurntNFTsInClassRequest>, I>>(object: I): QueryBurntNFTsInClassRequest {
    const message = createBaseQueryBurntNFTsInClassRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    message.classId = object.classId ?? "";
    return message;
  },
};

function createBaseQueryBurntNFTsInClassResponse(): QueryBurntNFTsInClassResponse {
  return { pagination: undefined, nftIds: [] };
}

export const QueryBurntNFTsInClassResponse = {
  encode(message: QueryBurntNFTsInClassResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.nftIds) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBurntNFTsInClassResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBurntNFTsInClassResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nftIds.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryBurntNFTsInClassResponse {
    return {
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
      nftIds: Array.isArray(object?.nftIds) ? object.nftIds.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: QueryBurntNFTsInClassResponse): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    if (message.nftIds?.length) {
      obj.nftIds = message.nftIds;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryBurntNFTsInClassResponse>, I>>(base?: I): QueryBurntNFTsInClassResponse {
    return QueryBurntNFTsInClassResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryBurntNFTsInClassResponse>, I>>(
    object: I,
  ): QueryBurntNFTsInClassResponse {
    const message = createBaseQueryBurntNFTsInClassResponse();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    message.nftIds = object.nftIds?.map((e) => e) || [];
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Params queries the parameters of x/asset/nft module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Class queries the non-fungible token class of the module. */
  Class(request: QueryClassRequest): Promise<QueryClassResponse>;
  /** Classes queries the non-fungible token classes of the module. */
  Classes(request: QueryClassesRequest): Promise<QueryClassesResponse>;
  /** Frozen queries to check if an NFT is frozen or not. */
  Frozen(request: QueryFrozenRequest): Promise<QueryFrozenResponse>;
  /** Whitelisted queries to check if an account is whitelited to hold an NFT or not. */
  Whitelisted(request: QueryWhitelistedRequest): Promise<QueryWhitelistedResponse>;
  /** WhitelistedAccountsForNFT returns the list of accounts which are whitelisted to hold this NFT. */
  WhitelistedAccountsForNFT(
    request: QueryWhitelistedAccountsForNFTRequest,
  ): Promise<QueryWhitelistedAccountsForNFTResponse>;
  /** BurntNFTsInClass checks if an nft if is in burnt NFTs list. */
  BurntNFT(request: QueryBurntNFTRequest): Promise<QueryBurntNFTResponse>;
  /** BurntNFTsInClass returns the list of burnt nfts in a class. */
  BurntNFTsInClass(request: QueryBurntNFTsInClassRequest): Promise<QueryBurntNFTsInClassResponse>;
}

export const QueryServiceName = "coreum.asset.nft.v1.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.Class = this.Class.bind(this);
    this.Classes = this.Classes.bind(this);
    this.Frozen = this.Frozen.bind(this);
    this.Whitelisted = this.Whitelisted.bind(this);
    this.WhitelistedAccountsForNFT = this.WhitelistedAccountsForNFT.bind(this);
    this.BurntNFT = this.BurntNFT.bind(this);
    this.BurntNFTsInClass = this.BurntNFTsInClass.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(_m0.Reader.create(data)));
  }

  Class(request: QueryClassRequest): Promise<QueryClassResponse> {
    const data = QueryClassRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Class", data);
    return promise.then((data) => QueryClassResponse.decode(_m0.Reader.create(data)));
  }

  Classes(request: QueryClassesRequest): Promise<QueryClassesResponse> {
    const data = QueryClassesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Classes", data);
    return promise.then((data) => QueryClassesResponse.decode(_m0.Reader.create(data)));
  }

  Frozen(request: QueryFrozenRequest): Promise<QueryFrozenResponse> {
    const data = QueryFrozenRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Frozen", data);
    return promise.then((data) => QueryFrozenResponse.decode(_m0.Reader.create(data)));
  }

  Whitelisted(request: QueryWhitelistedRequest): Promise<QueryWhitelistedResponse> {
    const data = QueryWhitelistedRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Whitelisted", data);
    return promise.then((data) => QueryWhitelistedResponse.decode(_m0.Reader.create(data)));
  }

  WhitelistedAccountsForNFT(
    request: QueryWhitelistedAccountsForNFTRequest,
  ): Promise<QueryWhitelistedAccountsForNFTResponse> {
    const data = QueryWhitelistedAccountsForNFTRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "WhitelistedAccountsForNFT", data);
    return promise.then((data) => QueryWhitelistedAccountsForNFTResponse.decode(_m0.Reader.create(data)));
  }

  BurntNFT(request: QueryBurntNFTRequest): Promise<QueryBurntNFTResponse> {
    const data = QueryBurntNFTRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "BurntNFT", data);
    return promise.then((data) => QueryBurntNFTResponse.decode(_m0.Reader.create(data)));
  }

  BurntNFTsInClass(request: QueryBurntNFTsInClassRequest): Promise<QueryBurntNFTsInClassResponse> {
    const data = QueryBurntNFTsInClassRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "BurntNFTsInClass", data);
    return promise.then((data) => QueryBurntNFTsInClassResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Long ? string | number | Long : T extends Array<infer U> ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
