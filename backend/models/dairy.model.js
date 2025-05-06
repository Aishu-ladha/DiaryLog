const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const diarySchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default:[] },
    createdOn: { type: Date, default: new Date().getTime() },
    userId: { type: String, required: true },
});



module.exports = mongoose.model('Diary', diarySchema);