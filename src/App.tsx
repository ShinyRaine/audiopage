import React, { useCallback, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { getAudio } from './api';
import FeedItem from './components/feedItem';
import { DataInterface } from './types';

function App() {
  const [value, setValue] = useState('EarningsCall');
  const [earningsCallData, setEarningsCallData] = useState<DataInterface[]|null>(null);
  const [podcastsData, setPodcastsData] = useState<DataInterface[]|null>(null);
  

  useEffect(() => {
    getData();
  }, []);

  const getData = useCallback(async () => {
    const data = await getAudio();
    console.log(data)
    setEarningsCallData(data.filter(item => item.audio_type === 'EC'));
    setPodcastsData(data.filter(item => item.audio_type === 'POD'))
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Container sx={{width: '100vw'}}>
      <Paper
      component="form"
      sx={{ m: '10px 0 0', display: 'flex', alignItems: 'center'}}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <TabContext value={value}>
        <TabList onChange={handleChange}>
          <Tab label="Podcasts" value="Podcasts" sx={{flexGrow: 1}} />
          <Tab label="Earnings Call" value="EarningsCall" sx={{flexGrow: 1}} />
        </TabList>
        <TabPanel value="Podcasts" sx={{ p: 0 }}>
          {podcastsData && podcastsData.map(item => (
            <FeedItem key={item.id} title={item.title} />
          ))}
        </TabPanel>
        <TabPanel value="EarningsCall" sx={{ p: 0 }}>
          {earningsCallData && earningsCallData.map(item => (
            <FeedItem key={item.id} title={item.title} />
          ))}
        </TabPanel>
      </TabContext>
    </Container>
  );
}

export default App;
