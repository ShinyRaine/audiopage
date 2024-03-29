import React, { useCallback, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { getAudio } from "./api";
import FeedItem from "./components/feedItem";
import { DataInterface } from "./types";
import AudioPlayer from "./components/audioPlayer";

function App() {
  const [tab, setTab] = useState("EarningsCall");
  const [earningsCallData, setEarningsCallData] = useState<DataInterface[]>();
  const [podcastsData, setPodcastsData] = useState<DataInterface[]>();
  const [currentAudio, setCurrentAudio] = useState<DataInterface>();
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>();
  const [showTranscript, setShowTranscript] = useState(false);

  const getData = useCallback(async () => {
    const data = await getAudio();
    setEarningsCallData(data.filter((item) => item.audio_type === "EC"));
    setPodcastsData(data.filter((item) => item.audio_type === "POD"));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleToggleTranscript = useCallback(() => {
    setShowTranscript(!showTranscript);
  }, [showTranscript]);

  const handleChangeAudio = useCallback(
    (audioData: DataInterface, i?: number) => {
      setCurrentAudio(audioData);
      setCurrentAudioIndex(i);
    },
    []
  );

  const handleSkip = useCallback(
    (index: number) => {
      if (
        !currentAudio ||
        !podcastsData ||
        !earningsCallData ||
        currentAudioIndex === undefined
      )
        return;
      if (tab === "Podcasts") {
        handleChangeAudio(podcastsData[index], index);
      }
      if (tab === "EarningsCall") {
        handleChangeAudio(earningsCallData[index], index);
      }
    },
    [
      currentAudio,
      tab,
      podcastsData,
      earningsCallData,
      currentAudioIndex,
      handleChangeAudio,
    ]
  );

  const listStyle = {
    p: 0,
    overflow: "auto",
    transition: "height 0.5s",
  };
  return (
    <Container
      sx={{
        width: "100vw",
        height: "100vh",
        p: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        component="form"
        sx={{ m: "10px 0 0", display: "flex", alignItems: "center" }}
      >
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <TabContext value={tab}>
        <TabList onChange={handleTabChange}>
          <Tab label="Podcasts" value="Podcasts" sx={{ flexGrow: 1 }} />
          <Tab
            label="Earnings Call"
            value="EarningsCall"
            sx={{ flexGrow: 1 }}
          />
        </TabList>
        <TabPanel
          value="Podcasts"
          sx={listStyle}
          style={{ height: showTranscript ? 0 : "auto" }}
        >
          {podcastsData &&
            podcastsData.map((item, i) => (
              <FeedItem
                key={item.id}
                title={item.title}
                onClick={() => handleChangeAudio(item, i)}
              />
            ))}
        </TabPanel>
        <TabPanel
          value="EarningsCall"
          sx={listStyle}
          style={{ height: showTranscript ? 0 : "auto" }}
        >
          {earningsCallData &&
            earningsCallData.map((item, i) => (
              <FeedItem
                key={item.id}
                title={item.title}
                onClick={() => handleChangeAudio(item, i)}
              />
            ))}
        </TabPanel>
      </TabContext>
      <AudioPlayer
        visible={!!currentAudio}
        data={currentAudio}
        showDetail={showTranscript}
        onClickCollapseBtn={handleToggleTranscript}
        handleSkipNext={() =>
          currentAudioIndex !== undefined && handleSkip(currentAudioIndex + 1)
        }
        handleSkipPrev={() =>
          currentAudioIndex !== undefined && handleSkip(currentAudioIndex - 1)
        }
      />
    </Container>
  );
}

export default App;
