import Card from "@mui/material/Card";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const cardStyle = {
  m: "10px",
  p: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:focus, &:active": {
    border: "1px solid #1976d2",
    "& svg": {
      color: "#1976d2",
    },
  },
};

export default function FeedItem(props: {
  title: string;
  onClick: React.MouseEventHandler;
}) {
  const { title, onClick } = props;
  return (
    <Card variant="outlined" sx={cardStyle} onClick={onClick}>
      {title}
      <PlayArrowIcon />
    </Card>
  );
}
