import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Stock {
  'name' : string,
  'change' : number,
  'price' : number,
  'symbol' : string,
}
export interface UserStock { 'amount' : bigint, 'symbol' : string }
export interface _SERVICE {
  'buyStock' : ActorMethod<[string, bigint], boolean>,
  'getAccountBalance' : ActorMethod<[], number>,
  'getStockDetails' : ActorMethod<[string], [] | [Stock]>,
  'getStocks' : ActorMethod<[], Array<Stock>>,
  'getUserPortfolio' : ActorMethod<[], Array<UserStock>>,
  'sellStock' : ActorMethod<[string, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
