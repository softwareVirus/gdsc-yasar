const mongoose = require("mongoose");
const soru = require("../models/soru.model")



exports.getMainPage = async(req, res, next) => {


    const sorular = [];
    if(sorular)
    {
        console.log("Soru var");
    }
    console.log(sorular[0]);

    res.render("homepage",{
        sorular
    });


}

