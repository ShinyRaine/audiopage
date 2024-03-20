import { Box } from "@mui/material";

export default function Timeline(props: {
  duration: number;
  currentTime: number;
  timeBlockData?: {
    start: number;
    end: number;
    sentiment: number;
  }[];
}) {
  const { duration, currentTime, timeBlockData } = props;
  return (
    <Box
      sx={{
        width: "100%",
        height: "3px",
        m: "10px 0",
        background: "green",
        display: "flex",
        position: "relative",
      }}
    >
      <>
        <Box
          sx={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            position: "absolute",
            left: (currentTime / duration) * 100 + "%",
            transform: "translate(-50%, -40%)",
            background: "#000",
          }}
        />
        {timeBlockData?.map((item) => (
          <Box
            key={item.start}
            sx={{
              width: ((item.end - item.start) / duration) * 100 + "%",
              height: "3px",
              background:
                item.sentiment === 0
                  ? "red"
                  : item.sentiment === 0.5
                  ? "yellow"
                  : "green",
            }}
          ></Box>
        ))}
      </>
    </Box>
  );
}
