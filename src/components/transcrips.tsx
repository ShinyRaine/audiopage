import Box from "@mui/material/Box";
import { TopicInterface, TranscriptInterface } from "../types";
import { Divider, Slide, Typography } from "@mui/material";
import { useMemo } from "react";
import { CheckCircle, Circle } from "@mui/icons-material";
import { timeFormat } from "../utils";

export default function Transcript(props: {
  visible: boolean;
  data?: TranscriptInterface[];
  currentTime: number;
  changeTime: (time: number) => void;
}) {
  const { visible, data, currentTime, changeTime } = props;

  const transcriptList = useMemo<TranscriptInterface[] | undefined>(() => {
    if (!data) return;
    const list: TranscriptInterface[] = [];
    data.forEach((item) => {
      const lastItem = list[list.length - 1];
      if (lastItem && lastItem.speaker === item.speaker) {
        lastItem.sentence += " " + item.sentence;
        lastItem.end = item.end;
      } else {
        list.push({ ...item });
      }
    });
    return list;
  }, [data]);

  const topicList = useMemo<TopicInterface[] | undefined>(() => {
    if (!data) return;
    const list: TopicInterface[] = [];
    data.forEach((item) => {
      if (item.topics.length) {
        item.topics.forEach((topic) => {
          list.push({ ...topic, start: item.start, end: item.end });
        });
      }
    });
    return list;
  }, [data]);

  if (!data) return null;
  return (
    <Box sx={{ width: "100%", overflow: "scroll" }}>
      <Slide in={visible} direction="up" mountOnEnter unmountOnExit>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "70%", pr: 1 }}>
            {transcriptList?.map((item) => (
              <Typography
                sx={{
                  m: 1,
                  cursor: "pointer",
                  color:
                    currentTime >= item.start && currentTime <= item.end
                      ? "#000"
                      : "#838383",
                }}
                key={item.start}
                onClick={() => changeTime(item.start)}
              >
                {item.sentence}
              </Typography>
            ))}
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box sx={{ mt: 1, transform: "translateX(-12px)" }}>
            {topicList?.map((item, i) => (
              <Box
                sx={{
                  display: "flex",
                  mb: 4,
                  color: currentTime >= item.start ? "#0F668A" : "#838383",
                  cursor: "pointer",
                }}
                key={item.topic_id + i}
                onClick={() => changeTime(item.start)}
              >
                {currentTime >= item.start ? <CheckCircle /> : <Circle />}
                <Box sx={{ ml: 2 }}>
                  <Typography>
                    <b>{item.name}</b>
                  </Typography>
                  <Typography>{timeFormat(item.start)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
