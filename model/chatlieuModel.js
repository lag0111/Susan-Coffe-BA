const mogoose = require('mongoose');
const Schema = mogoose.Schema;
const ObjectId = Schema.ObjectId;
const chatlieu = new Schema(
    {
        _id:{type:ObjectId||null},
        name:{
            type:String,
            require:true
        }
    },{
        collection:"chatlieu"
    }
)



module.exports = mogoose.model.chatlieu || mogoose.model('chatlieu',chatlieu);