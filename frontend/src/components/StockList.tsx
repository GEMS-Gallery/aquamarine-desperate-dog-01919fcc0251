import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';
import { retryApiCall } from '../utils/apiUtils';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

function StockList() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const result = await retryApiCall(() => backend.getStocks());
        setStocks(result.map(stock => ({
          ...stock,
          price: Number(stock.price),
          change: Number(stock.change)
        })));
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Stocks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol} component={Link} to={`/stock/${stock.symbol}`} style={{ textDecoration: 'none' }}>
                <TableCell component="th" scope="row">
                  {stock.symbol}
                </TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell align="right">${stock.price.toFixed(2)}</TableCell>
                <TableCell align="right" style={{ color: stock.change >= 0 ? 'green' : 'red' }}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default StockList;
