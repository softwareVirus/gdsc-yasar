const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soruSchema = new Schema({
    Soru:{
        type:String
    },
    A:{
        type:String
    },
    B:{
        type:String
    },
    C:{
        type:String
    },
    D:{
        type:String
    },
    Cevap:
    {
        type:String
    }
});

const soruModel = mongoose.model('soru', soruSchema);

module.exports = soruModel;