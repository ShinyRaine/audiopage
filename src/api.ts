import axios from "axios";
import { DataInterface } from "./types";
// mock api

export async function getAudio() {
  const res = await axios.get("/test_audio_files.json");
  return res.data as DataInterface[];
}
