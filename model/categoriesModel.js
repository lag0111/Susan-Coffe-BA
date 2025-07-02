const mogoose = require('mongoose');
const Schema = mogoose.Schema;
const ObjectId = Schema.ObjectId;
const categories = new Schema(
    {
        _id:{type:ObjectId||null},
        name:{
            type:String,
            require:true
        },
        image:{
            type:String
        }
    },{
        collection:"categories"
    }
)



module.exports = mogoose.model.categories || mogoose.model('categories',categories);