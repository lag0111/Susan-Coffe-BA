const mogoose = require('mongoose');
const Schema = mogoose.Schema;
const ObjectId = Schema.ObjectId;
const user = new Schema(
    {
        _id: { type: ObjectId || null },
        fullname: {
            type: String,
            require: true
        },
        username: { type: String },
        email: { type: String },
        address: { type: String },
        password: { type: String },
        phone: { type: String },
        role: { type: String }
    }, {
    collection: "user"
}
)



module.exports = mogoose.model.user || mogoose.model('user', user);