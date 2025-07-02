const mogoose = require('mongoose');
const Schema = mogoose.Schema;
const ObjectId = Schema.ObjectId;
const cart = new Schema(
    {
        _id: { type: ObjectId || null },
        name: {
            type: String,
            require: true
        },
        img: { type: String },
        giagoc: { type: Number },
        sale: { type: Number },
        quantity: { type: Number },
        chatlieuId: { type: String },
        thuonghieuId: { type: String },
        sanphamId: { type: String },
        userId: { type: String }
    }, {
    collection: "cart"
}
)



module.exports = mogoose.model.cart || mogoose.model('cart', cart);