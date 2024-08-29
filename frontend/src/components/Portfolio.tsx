import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';
import { retryApiCall } from '../utils/apiUtils';

interface UserStock {
  symbol: string;
  amount: number;
}

function Portfolio() {
  const [portfolio, setPortfolio] = useState<UserStock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const result = await retryApiCall(() => backend.getUserPortfolio());
        setPortfolio(result.map(stock => ({
          ...stock,
          amount: Number(stock.amount)
        })));
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Portfolio
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell component="th" scope="row">
                  {stock.symbol}
                </TableCell>
                <TableCell align="right">{stock.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Portfolio;
