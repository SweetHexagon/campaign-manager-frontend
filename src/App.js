import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import CampaignList from './components/CampaignList';
import CampaignForm from './components/CampaignForm';
import UpdateCampaign from './components/UpdateCampaign';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (loggedIn) {
      fetchBalance();
    }
  }, [currentView, loggedIn]);

  const handleLogin = async () => {
    setLoggedIn(true);
  };

  const fetchBalance = async () => {
    const authHeader = localStorage.getItem('auth');
    try {
      const response = await axios.get('http://localhost:8080/api/v1/users/balance', {
        headers: { Authorization: authHeader }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance', error);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentCampaign(null);
  };

  const handleEditCampaign = (campaign) => {
    setCurrentCampaign(campaign);
    setCurrentView('update');
  };

  return (
      <div>
        {!loggedIn ? (
            <Login onLogin={handleLogin} />
        ) : (
            <div>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Campaign Manager
                  </Typography>
                  <Typography variant="h6" sx={{ marginRight: 2 }}>
                    Balance: {balance.toFixed(2)} PLN
                  </Typography>
                  <Button color="inherit" onClick={() => handleViewChange('list')}>View Campaigns</Button>
                  <Button color="inherit" onClick={() => handleViewChange('form')}>Create Campaign</Button>
                </Toolbar>
              </AppBar>
              <Box sx={{ padding: 2 }}>
                {currentView === 'list' && (
                    <CampaignList onEdit={handleEditCampaign} />
                )}
                {currentView === 'form' && (
                    <CampaignForm
                        campaign={currentCampaign}
                        onSave={() => handleViewChange('list')}
                    />
                )}
                {currentView === 'update' && currentCampaign && (
                    <UpdateCampaign
                        campaign={currentCampaign}
                        onSave={() => handleViewChange('list')}
                    />
                )}
              </Box>
            </div>
        )}
      </div>
  );
};

export default App;
