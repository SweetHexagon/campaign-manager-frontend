import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid
} from '@mui/material';

const CampaignList = ({ onEdit }) => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        fetchCampaigns();

    }, []);

    const fetchCampaigns = async () => {
        const authHeader = localStorage.getItem('auth');
        try {
            const response = await axios.get('http://localhost:8080/api/v1/campaigns/my', {
                headers: { Authorization: authHeader }
            });
            setCampaigns(response.data);
            console.log(response.data)

        } catch (error) {
            console.error('Error fetching campaigns', error);
        }
    };

    const deleteCampaign = async (name) => {
        const authHeader = localStorage.getItem('auth');
        try {
            await axios.delete(`http://localhost:8080/api/v1/campaigns/${name}`, {
                headers: { Authorization: authHeader }
            });
            fetchCampaigns();
        } catch (error) {
            console.error('Error deleting campaign', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Campaigns
            </Typography>
            <Grid container spacing={3}>
                {campaigns.map(campaign => (
                    <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {campaign.campaignName}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {campaign.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onEdit(campaign)}
                                    sx={{ mt: 2, mr: 1 }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => deleteCampaign(campaign.campaignName)}
                                    sx={{ mt: 2 }}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CampaignList;
