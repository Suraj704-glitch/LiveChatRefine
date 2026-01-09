// controllers/doubtController.js

const YoutubeService = require("../services/youtubeService");
const DoubtSession = require("../models/Doubt");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const ytService = new YoutubeService(process.env.YT_API_KEY);

// Global state for tracking (Server chalne tak memory mein rahega)
let currentLiveChatId = null;
let nextPageToken = "";
let activeVideoId = null; 

/**
 * Helper: Similarity check logic
 */
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    const s1 = new Set(str1.toLowerCase().split(/\s+/));
    const s2 = new Set(str2.toLowerCase().split(/\s+/));
    const intersection = new Set([...s1].filter(x => s2.has(x)));
    const union = new Set([...s1, ...s2]);
    return intersection.size / union.size;
}

exports.renderDashboard = catchAsync(async (req, res) => {
    res.render("dashboard", { topDoubts: [] });
});

/**
 * Connection Status Check (Persistent state ke liye)
 */
exports.getConnectionStatus = catchAsync(async (req, res) => {
    if (currentLiveChatId) {
        res.status(200).json({ 
            status: "success", 
            connected: true, 
            videoId: activeVideoId 
        });
    } else {
        res.status(200).json({ status: "success", connected: false });
    }
});

exports.connectYoutube = catchAsync(async (req, res) => {
    const { videoId } = req.body;
    if (!videoId) throw new ExpressError("Video ID is required", 400);

    const chatId = await ytService.getLiveChatId(videoId);
    if (!chatId) throw new ExpressError("Live stream chat not found.", 400);
    
    currentLiveChatId = chatId;
    activeVideoId = videoId; // Store active video ID
    nextPageToken = ""; 
    res.status(200).json({ status: "success", message: "Connected to YouTube! ✅" });
});

/**
 * Manually break connection
 */
exports.disconnectYoutube = catchAsync(async (req, res) => {
    currentLiveChatId = null;
    activeVideoId = null;
    nextPageToken = "";
    res.status(200).json({ status: "success", message: "Connection closed." });
});

exports.analyzeDoubts = catchAsync(async (req, res) => {
    let chatsToProcess = [];

    if (currentLiveChatId) {
        const result = await ytService.fetchMessages(currentLiveChatId, nextPageToken);
        chatsToProcess = result.messages;
        nextPageToken = result.nextPageToken;
    } else {
        chatsToProcess = req.body.chatChunk || [];
    }

    if (chatsToProcess.length === 0) {
        return res.status(200).json({ status: "success", data: [] });
    }

    const clusters = [];
    chatsToProcess.forEach(chat => {
        const text = chat.trim();
        if (text.length < 5) return; 

        let foundCluster = false;
        for (let cluster of clusters) {
            if (calculateSimilarity(text, cluster.representativeText) > 0.6) {
                cluster.count++;
                if (text.length > cluster.representativeText.length) {
                    cluster.representativeText = text;
                }
                foundCluster = true;
                break;
            }
        }
        if (!foundCluster) {
            clusters.push({ representativeText: text, count: 1 });
        }
    });

    clusters.sort((a, b) => b.count - a.count);
    const topDoubts = clusters.slice(0, 5).map(c => ({
        text: c.representativeText,
        count: c.count
    }));

    if (topDoubts.length > 0) {
        const session = new DoubtSession({
            topDoubts: topDoubts.map(d => ({ keyword: d.text, count: d.count })),
            totalChatsInChunk: chatsToProcess.length
        });
        await session.save();
    }

    res.status(200).json({ status: "success", data: topDoubts });
});

exports.getHistory = catchAsync(async (req, res) => {
    const history = await DoubtSession.find().sort({ timestamp: -1 });
    res.render("history", { history });
});

exports.deleteAllHistory = catchAsync(async (req, res) => {
    await DoubtSession.deleteMany({});
    res.redirect("/doubts/history");
});

exports.deleteSession = catchAsync(async (req, res) => {
    const { id } = req.params;
    await DoubtSession.findByIdAndDelete(id);
    res.redirect("/doubts/history");
});