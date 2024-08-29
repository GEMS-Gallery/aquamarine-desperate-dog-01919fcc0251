export const idlFactory = ({ IDL }) => {
  const Stock = IDL.Record({
    'name' : IDL.Text,
    'change' : IDL.Float64,
    'price' : IDL.Float64,
    'symbol' : IDL.Text,
  });
  const UserStock = IDL.Record({ 'amount' : IDL.Nat, 'symbol' : IDL.Text });
  return IDL.Service({
    'buyStock' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'getAccountBalance' : IDL.Func([], [IDL.Float64], ['query']),
    'getStockDetails' : IDL.Func([IDL.Text], [IDL.Opt(Stock)], ['query']),
    'getStocks' : IDL.Func([], [IDL.Vec(Stock)], ['query']),
    'getUserPortfolio' : IDL.Func([], [IDL.Vec(UserStock)], ['query']),
    'sellStock' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
