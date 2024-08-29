import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, TextField, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { backend } from 'declarations/backend';
import { retryApiCall } from '../utils/apiUtils';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

function StockDetails() {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<Stock | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStockDetails = async () => {
      if (symbol) {
        try {
          const result = await retryApiCall(() => backend.getStockDetails(symbol));
          if (result) {
            setStock({
              ...result,
              price: Number(result.price),
              change: Number(result.change)
            });
          }
        } catch (error) {
          console.error('Failed to fetch stock details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStockDetails();
  }, [symbol]);

  const handleBuy = async () => {
    if (stock && amount > 0) {
      try {
        const result = await retryApiCall(() => backend.buyStock(stock.symbol, BigInt(amount)));
        if (result) {
          alert('Stock purchased successfully!');
        } else {
          alert('Failed to purchase stock. Please check your balance.');
        }
      } catch (error) {
        console.error('Error buying stock:', error);
        alert('An error occurred while buying the stock. Please try again.');
      }
    }
  };

  const handleSell = async () => {
    if (stock && amount > 0) {
      try {
        const result = await retryApiCall(() => backend.sellStock(stock.symbol, BigInt(amount)));
        if (result) {
          alert('Stock sold successfully!');
        } else {
          alert('Failed to sell stock. Please check your portfolio.');
        }
      } catch (error) {
        console.error('Error selling stock:', error);
        alert('An error occurred while selling the stock. Please try again.');
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!stock) {
    return <Typography>Stock not found</Typography>;
  }

  const chartData = {
    labels: ['1D', '1W', '1M', '3M', '1Y', '5Y'],
    datasets: [
      {
        label: 'Stock Price',
        data: [stock.price * 0.98, stock.price * 0.99, stock.price * 1.02, stock.price * 1.05, stock.price * 1.1, stock.price * 1.5],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {stock.name} ({stock.symbol})
      </Typography>
      <Typography variant="h5" gutterBottom>
        ${stock.price.toFixed(2)} <span style={{ color: stock.change >= 0 ? 'green' : 'red' }}>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
      </Typography>
      <Box sx={{ width: '100%', height: 300, marginBottom: 4 }}>
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleBuy} sx={{ marginRight: 2 }}>
          Buy
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSell}>
          Sell
        </Button>
      </Box>
    </div>
  );
}

export default StockDetails;
