const mogoose = require('mongoose');
const Schema = mogoose.Schema;
const ObjectId = Schema.ObjectId;
const products = new Schema(
    {
        _id: { type: ObjectId || null },
        name: {
            type: String,
            require: true
        },
        image: { type: String },
        price: { type: Number },
        rating: { type: Number },
        categoryId: { type: ObjectId },
        description: { type: String }
    }, {
    collection: "products"
}
)



module.exports = mogoose.model.products || mogoose.model('products', products);