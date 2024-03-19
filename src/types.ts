export interface DataInterface {
    id: string;
    issuer: string;
    title: string;
    audio_url: string;
    audio_type: 'EC' | 'POD';
    transcript: TranscriptInterface[]
}

export interface TranscriptInterface {
  sentence: string;
  start: number;
  end: number;
  speaker: string;
  sentiment: number;
  'q&a': boolean;
  topics: { 
      name: string;
      en_name: string;
      topic_id: string;
  }[]
}

export interface TopicInterface {
  start: number;
  end: number;
  name: string;
  en_name: string;
  topic_id: string;
}

export interface SentimentInterface {
  start: number;
  end: number;
  sentiment: number;
}