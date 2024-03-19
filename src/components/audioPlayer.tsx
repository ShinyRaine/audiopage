import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import { DataInterface } from '../types';
import { useCallback, useRef, useState } from 'react';
import { ButtonBase, Typography } from '@mui/material';
import { KeyboardArrowDown, Pause, PlayArrow } from '@mui/icons-material';

export default function AudioPlayer(props: {
  visible: boolean,
  showDetail: boolean,
  handleClickCollapseBtn: React.MouseEventHandler,
  data?: DataInterface
}) {
  const {visible, data, showDetail, handleClickCollapseBtn} = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleClickPlayBtn = useCallback(() => {
    if(audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [audioRef, isPlaying])

  return (
    <>
      <Box>
        <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
          <div>
            {data ? (
            <Box sx={{background: '#eee', borderRadius: '10px 10px 0 0', p: '0 10px 16px'}}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={handleClickCollapseBtn}>
                  {showDetail ? <KeyboardArrowDown /> : <KeyboardArrowUpIcon />}
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography><b>{data.title}</b></Typography>
                <MusicVideoIcon />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {timeFormat(currentTime)}/{timeFormat(duration)}
                  <Box>
                  {data.audio_type === 'EC' && <ButtonBase>Q&A</ButtonBase>}
                  <IconButton onClick={handleClickPlayBtn}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  </Box>
              </Box>
              <audio
                ref={audioRef}
                src={data.audio_url}
                autoPlay
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration)
                  }
                }}
                onPlay={() => {
                  setIsPlaying(true)
                }}
                onPause={() => {
                  setIsPlaying(false)
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

function timeFormat(s?: number) {
  if (!s) return '0:0';
  return `${Math.floor(s / 60)}:${(s % 60).toFixed()}`;
}