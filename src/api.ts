import axios from "axios";
import { DataInterface } from "./types";
// mock api
axios.defaults.baseURL = "http://localhost:3000";

export async function getAudio() {
  const res = await axios.get("/test_audio_files.json");
  return res.data as DataInterface[];
}
