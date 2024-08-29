import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { backend } from 'declarations/backend';
import StockList from './components/StockList';
import Portfolio from './components/Portfolio';
import StockDetails from './components/StockDetails';

function App() {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const result = await backend.getAccountBalance();
      setBalance(Number(result));
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
            Balance: ${balance.toFixed(2)}
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
