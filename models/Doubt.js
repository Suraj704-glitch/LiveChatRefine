const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    count: { type: Number, required: true }
});

const sessionSchema = new mongoose.Schema({
    sessionName: { 
        type: String, 
        default: () => `Class_${new Date().toLocaleDateString()}` 
    },
    timestamp: { type: Date, default: Date.now },
    topDoubts: [analysisSchema], 
    totalChatsInChunk: { type: Number }
});

module.exports = mongoose.model("DoubtSession", sessionSchema);