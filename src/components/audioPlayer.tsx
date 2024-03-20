import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";
import { DataInterface, SentimentInterface } from "../types";
import { useCallback, useMemo, useRef, useState } from "react";
import { ButtonBase, Typography } from "@mui/material";
import {
  Forward10,
  KeyboardArrowDown,
  Pause,
  PlayArrow,
  Replay10,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import Transcript from "./transcrips";
import { timeFormat } from "../utils";
import Timeline from "./timeline";

const IconButtonStyle = {
  padding: 0,
  "& svg": {
    fontSize: "1.7em",
  },
};

export default function AudioPlayer(props: {
  visible: boolean;
  showDetail: boolean;
  onClickCollapseBtn: React.MouseEventHandler;
  data?: DataInterface;
  handleSkipPrev: () => void;
  handleSkipNext: () => void;
}) {
  const {
    visible,
    data,
    showDetail,
    onClickCollapseBtn,
    handleSkipPrev,
    handleSkipNext,
  } = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleClickCollapseBtn = useCallback(
    (e: React.MouseEvent) => {
      setShowTranscript(!showTranscript);
      onClickCollapseBtn(e);
    },
    [showTranscript, onClickCollapseBtn]
  );

  const handleClickPlayBtn = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [audioRef, isPlaying]);

  const handleTimeChange = useCallback(
    (time: number) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = time;
      audioRef.current.play();
    },
    [audioRef]
  );

  const QATime = useMemo(() => {
    if (!data) return;
    const QATranscript = data.transcript.find((item) => item["q&a"]);
    return QATranscript?.start;
  }, [data]);

  const sentimentData = useMemo(() => {
    if (!data) return;
    const sentimentData: SentimentInterface[] = [];
    data.transcript.forEach((item) => {
      const lastItem = sentimentData[sentimentData.length - 1];
      if (lastItem && lastItem.sentiment === item.sentiment) {
        lastItem.end = item.end;
      } else {
        sentimentData.push({
          start: item.start,
          end: item.end,
          sentiment: item.sentiment,
        });
      }
    });
    return sentimentData;
  }, [data]);

  return (
    <>
      <Transcript
        visible={showTranscript}
        data={data?.transcript}
        currentTime={currentTime}
        changeTime={handleTimeChange}
      />
      <Box>
        <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
          <div>
            {data ? (
              <Box
                sx={{
                  background: "#eee",
                  borderRadius: "10px 10px 0 0",
                  p: "0 10px 16px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <IconButton onClick={handleClickCollapseBtn}>
                    {showDetail ? (
                      <KeyboardArrowDown />
                    ) : (
                      <KeyboardArrowUpIcon />
                    )}
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>
                    <b>{data.title}</b>
                  </Typography>
                  <MusicVideoIcon />
                </Box>
                {showDetail && (
                  <Timeline
                    duration={duration}
                    currentTime={currentTime}
                    timeBlockData={sentimentData}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {timeFormat(currentTime)}/{timeFormat(duration)}
                  {!showDetail && (
                    <Box>
                      {data.audio_type === "EC" && QATime && (
                        <ButtonBase onClick={() => handleTimeChange(QATime)}>
                          Q&A
                        </ButtonBase>
                      )}
                      <IconButton
                        sx={IconButtonStyle}
                        onClick={() => handleTimeChange(currentTime - 15)}
                      >
                        <Replay10 />
                      </IconButton>
                      <IconButton
                        sx={IconButtonStyle}
                        onClick={handleClickPlayBtn}
                      >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <IconButton
                        sx={IconButtonStyle}
                        onClick={() => handleTimeChange(currentTime + 15)}
                      >
                        <Forward10 />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {showDetail && (
                  <Box
                    sx={{
                      pl: "17%",
                      pr: data.audio_type === "EC" ? 0 : "17%",
                      mt: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <IconButton
                      sx={IconButtonStyle}
                      onClick={() => handleTimeChange(currentTime - 15)}
                    >
                      <Replay10 />
                    </IconButton>
                    <IconButton
                      sx={IconButtonStyle}
                      onClick={() => handleSkipPrev()}
                    >
                      <SkipPrevious />
                    </IconButton>
                    <IconButton
                      sx={IconButtonStyle}
                      onClick={handleClickPlayBtn}
                    >
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton
                      sx={IconButtonStyle}
                      onClick={() => handleSkipNext()}
                    >
                      <SkipNext />
                    </IconButton>
                    <IconButton
                      sx={IconButtonStyle}
                      onClick={() => handleTimeChange(currentTime + 15)}
                    >
                      <Forward10 />
                    </IconButton>
                    {data.audio_type === "EC" && QATime && (
                      <ButtonBase
                        sx={{ ml: "5%", mr: "3%" }}
                        onClick={() => handleTimeChange(QATime)}
                      >
                        Q&A
                      </ButtonBase>
                    )}
                  </Box>
                )}
                <audio
                  ref={audioRef}
                  src={data.audio_url}
                  autoPlay
                  onLoadedMetadata={() => {
                    if (audioRef.current) {
                      setDuration(audioRef.current.duration);
                    }
                  }}
                  onPlay={() => {
                    setIsPlaying(true);
                  }}
                  onPause={() => {
                    setIsPlaying(false);
                  }}
                  onTimeUpdate={() => {
                    setCurrentTime(audioRef.current?.currentTime || 0);
                  }}
                />
              </Box>
            ) : null}
          </div>
        </Slide>
      </Box>
    </>
  );
}
