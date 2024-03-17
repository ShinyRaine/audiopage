export interface DataInterface {
    id: string,
    issuer: string,
    title: string,
    audio_url: string
    audio_type: 'EC' | 'POD',
    transcript:{
      sentence: string;
      start: number;
      end: number;
      speaker: string;
      sentiment: number
      'q&a': boolean;
      topics: { 
          name: string,
          en_name: string
        }[]
    }[]
}