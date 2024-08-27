import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    InputLabel,
    FormControl,
    Select as MuiSelect,
    Typography,
    Box
} from '@mui/material';

const CampaignForm = ({ campaign, onSave }) => {
    const [campaignName, setCampaignName] = useState(campaign ? campaign.campaignName : '');
    const [description, setDescription] = useState(campaign ? campaign.description : '');
    const [bidAmount, setBidAmount] = useState(campaign ? campaign.bidAmount : '');
    const [fund, setFund] = useState(campaign ? campaign.fund : '');
    const [status, setStatus] = useState(campaign ? campaign.status : true);
    const [town, setTown] = useState(campaign ? campaign.town.id : '');
    const [radius, setRadius] = useState(campaign ? campaign.radius : '');
    const [selectedKeywords, setSelectedKeywords] = useState(campaign ? campaign.keywords.map(k => ({ value: k.id, label: k.name })) : []);

    const [towns, setTowns] = useState([]);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        const fetchTownsAndKeywords = async () => {
            const authHeader = localStorage.getItem('auth');

            try {
                const townsResponse = await axios.get('http://localhost:8080/api/v1/data/towns', {
                    headers: { Authorization: authHeader }
                });
                setTowns(townsResponse.data);

                const keywordsResponse = await axios.get('http://localhost:8080/api/v1/data/keywords', {
                    headers: { Authorization: authHeader }
                });
                setKeywords(keywordsResponse.data.map(k => ({ value: k.id, label: k.name })));
            } catch (error) {
                console.error('Error fetching towns or keywords', error);
            }
        };

        fetchTownsAndKeywords();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authHeader = localStorage.getItem('auth');

        const campaignData = {
            campaignName,
            description,
            bidAmount,
            fund,
            status,
            town,
            radius,
            keywords: selectedKeywords.map(keyword => ({
                name: keyword.label
            }))
        };
        console.log(campaignData);
        try {
            if (campaign) {
                await axios.put(`http://localhost:8080/api/v1/campaigns/${campaign.id}`, campaignData, {
                    headers: { Authorization: authHeader }
                });
            } else {
                await axios.post('http://localhost:8080/api/v1/campaigns', campaignData, {
                    headers: { Authorization: authHeader }
                });
            }
            onSave();
        } catch (error) {
            console.error('Error saving campaign', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {campaign ? 'Edit Campaign' : 'Create Campaign'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Campaign Name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Bid Amount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Fund"
                    type="number"
                    value={fund}
                    onChange={(e) => setFund(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <FormControlLabel
                    control={<Checkbox checked={status} onChange={(e) => setStatus(e.target.checked)} />}
                    label="Status"
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Town</InputLabel>
                    <MuiSelect
                        value={town}
                        onChange={(e) => setTown(e.target.value)}
                        label="Town"
                    >
                        <MenuItem value=""><em>Select a town</em></MenuItem>
                        {towns.map(t => (
                            <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>
                        ))}
                    </MuiSelect>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                    <Select
                        isMulti
                        options={keywords}
                        value={selectedKeywords}
                        onChange={setSelectedKeywords}
                        placeholder="Select keywords..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isSearchable
                        required
                    />
                </FormControl>
                <TextField style={{zIndex: 0}}
                    label="Radius"
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {campaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
            </form>
        </Box>
    );
};

export default CampaignForm;
