import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';
import StockList from './components/StockList';
import Portfolio from './components/Portfolio';
import StockDetails from './components/StockDetails';
import { retryApiCall } from './utils/apiUtils';

function App() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await retryApiCall(() => backend.getAccountBalance());
        setBalance(Number(result));
      } catch (error) {
        console.error('Failed to fetch account balance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Robinhood Clone
          </Typography>
          <Button color="inherit" component={Link} to="/">Stocks</Button>
          <Button color="inherit" component={Link} to="/portfolio">Portfolio</Button>
          <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : `Balance: $${balance.toFixed(2)}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<StockList />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/stock/:symbol" element={<StockDetails />} />
          </Routes>
        </Box>
      </Container>
    </div>
  );
}

export default App;
