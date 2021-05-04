const mongoose = require('mongoose');
const { Schema } = mongoose;

// PLayer model - Istantier nyt schema object
const Player = new Schema({
	fullname: {type:String},
	gamertag: {type:String},
	team: {type:String},
	age: {type:Number},
	image: {type:String},
	isAvailable: {type:Boolean}
},
{ versionKey: false });

module.exports = mongoose.model("Player", Player, 'players');