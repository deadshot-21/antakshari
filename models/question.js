const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question:String,
    answer:String,
    teams:[{
        number:String,
        marks:Number,
        isSent:Boolean,
        time:String
    }],
    current:Number,
    answered:String,
    currentQuestion:Boolean
});


const Question = mongoose.model('question',questionSchema);

module.exports = Question;