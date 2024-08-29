import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Stock = {
    symbol: Text;
    name: Text;
    price: Float;
    change: Float;
  };

  type UserStock = {
    symbol: Text;
    amount: Nat;
  };

  stable var stocks: [Stock] = [
    { symbol = "AAPL"; name = "Apple Inc."; price = 150.25; change = 2.5 },
    { symbol = "GOOGL"; name = "Alphabet Inc."; price = 2750.80; change = -1.2 },
    { symbol = "MSFT"; name = "Microsoft Corporation"; price = 305.50; change = 1.8 },
    { symbol = "AMZN"; name = "Amazon.com, Inc."; price = 3380.00; change = -0.5 },
    { symbol = "FB"; name = "Meta Platforms, Inc."; price = 330.75; change = 0.8 },
  ];

  stable var userPortfolio: [UserStock] = [];
  stable var accountBalance: Float = 10000.00;

  public query func getStocks(): async [Stock] {
    return stocks;
  };

  public query func getStockDetails(symbol: Text): async ?Stock {
    return Array.find<Stock>(stocks, func(s) { s.symbol == symbol });
  };

  public query func getUserPortfolio(): async [UserStock] {
    return userPortfolio;
  };

  public query func getAccountBalance(): async Float {
    return accountBalance;
  };

  public func buyStock(symbol: Text, amount: Nat): async Bool {
    switch (Array.find<Stock>(stocks, func(s) { s.symbol == symbol })) {
      case (null) { return false; };
      case (?stock) {
        let cost = Float.fromInt(amount) * stock.price;
        if (cost > accountBalance) { return false; };
        accountBalance -= cost;
        switch (Array.find<UserStock>(userPortfolio, func(s) { s.symbol == symbol })) {
          case (null) {
            userPortfolio := Array.append(userPortfolio, [{ symbol = symbol; amount = amount }]);
          };
          case (?userStock) {
            userPortfolio := Array.map<UserStock, UserStock>(userPortfolio, func(s) {
              if (s.symbol == symbol) { { symbol = s.symbol; amount = s.amount + amount } } else { s }
            });
          };
        };
        return true;
      };
    };
  };

  public func sellStock(symbol: Text, amount: Nat): async Bool {
    switch (Array.find<UserStock>(userPortfolio, func(s) { s.symbol == symbol })) {
      case (null) { return false; };
      case (?userStock) {
        if (userStock.amount < amount) { return false; };
        switch (Array.find<Stock>(stocks, func(s) { s.symbol == symbol })) {
          case (null) { return false; };
          case (?stock) {
            let revenue = Float.fromInt(amount) * stock.price;
            accountBalance += revenue;
            userPortfolio := Array.map<UserStock, UserStock>(userPortfolio, func(s) {
              if (s.symbol == symbol) {
                { symbol = s.symbol; amount = if (s.amount > amount) s.amount - amount else 0 }
              } else { s }
            });
            userPortfolio := Array.filter<UserStock>(userPortfolio, func(s) { s.amount > 0 });
            return true;
          };
        };
      };
    };
  };
}
