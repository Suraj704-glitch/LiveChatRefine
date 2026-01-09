const axios = require('axios');

class YoutubeService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    // Finds the unique Chat ID linked to a video
    async getLiveChatId(videoId) {
        try {
            const response = await axios.get(`${this.baseUrl}/videos`, {
                params: { part: 'liveStreamingDetails', id: videoId, key: this.apiKey }
            });
            return response.data.items[0].liveStreamingDetails.activeLiveChatId;
        } catch (error) {
            console.error("Error fetching LiveChatID:", error.message);
            return null;
        }
    }

    // Fetches the actual text messages
    async fetchMessages(liveChatId, nextPageToken = '') {
        try {
            const response = await axios.get(`${this.baseUrl}/liveChat/messages`, {
                params: { liveChatId, part: 'snippet', pageToken: nextPageToken, key: this.apiKey }
            });
            const messages = response.data.items.map(item => item.snippet.displayMessage);
            return { messages, nextPageToken: response.data.nextPageToken };
        } catch (error) {
            console.error("Error fetching YT messages:", error.message);
            return { messages: [], nextPageToken: '' };
        }
    }
}

module.exports = YoutubeService;