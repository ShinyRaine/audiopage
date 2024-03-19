import Box from '@mui/material/Box';
import { TranscriptInterface } from '../types';
import { Collapse, Slide } from '@mui/material';


export default function Transcript(props: {
  visible: boolean,
  data?: TranscriptInterface[]
}) {
  const { visible, data } = props
  if (!data) return null
  return (
    <Box sx={{ width: '100%', overflow: 'scroll' }}>
      <Slide in={visible}  direction="up" mountOnEnter unmountOnExit>
        <Box>
          {data.toString()}
        </Box>
      </Slide>
    </Box>
  )
}