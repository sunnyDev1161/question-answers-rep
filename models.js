const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var sortanswers = function (a, b) {
    //  - a before b
    //  + b before a
    //  0 no change
    if (a.votes === b.votes) {
        // if (a.updatedAt > b.updatedAt) {
        //     return -1 // put a before b
        // } else if (a.updatedAt < b.updatedAt) {
        //     return 1  // put b before a
        // } else {
        //     return 0 // no change
        // }

        // the upper condition is also the same  as following
        return b.updatedAt - a.updatedAt
    }
    return b.votes - a.votes;
}

const AnswersSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 }
})

// this is a istance method on the answers documents

AnswersSchema.method("update", function (update, callback) {
    Object.assign(this, update, { updatedAt: new Date() });
    this.parent().save(callback)
})


// instance method for voting

AnswersSchema.method("vote", function (vote, callback) {
    if (vote === "up") {
        this.votes += 1
    } else {
        this.votes -= 1
    }
})

const QuestionSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    answers: [AnswersSchema]
})

QuestionSchema.pre("save", function (next) {
    this.answers.sort(sortanswers);
    next();
})


const Questions = mongoose.model("Questions", QuestionSchema);
module.exports.Questions = Questions;