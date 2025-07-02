const mogoose = require('mongoose');
const Schema = mogoose.Schema;
const ObjectId = Schema.ObjectId;
const order = new Schema(
    {
        _id: { type: ObjectId || null },
        user: {
            fullname: { type: String },
            phone: { type: Number },
            address: { type: String }
        },
        detail:
            [
                {
                    _id: { type: ObjectId },
                    name: {
                        type: String,
                    },
                    image: { type: String },
                    price: { type: Number },
                    quantity: { type: Number },
                    rating: { type: Number },
                    size: { type: String },
                    description: { type: String },
                    categoryId: { type: String }
                }
            ],
        total_money: { type: Number }
    }, {
    collection: "order"
}
)

module.exports = mogoose.model.order || mogoose.model('order', order);