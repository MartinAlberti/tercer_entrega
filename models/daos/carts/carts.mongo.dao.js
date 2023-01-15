const mongoContainer = require('../../containers/mongo.container')
const { Schema } = require('mongoose')
const { HttpError } = require('../../../utils/utils')
const { HTTP_STATUS } = require('../../../constants/api.constants')

const collection = 'carts'

const cartSchema = new Schema({
    timestamp: { type: String },
    products: [{ type: Schema.Types.ObjectId }]
})

class DaoCartsMongo extends mongoContainer {
    constructor() {
        super(collection, cartSchema)
    }


    async createCart() {
        let item = {
            timestrap: Date.now(),
            products: []
        }
        const newDocument = new this.model(item);
        return await newDocument.save();
    }

    async getProductsInCart(id) {
        const document = await this.model.findOne({ _id: id }, { __v: 0 });
        if (!document) {
            const message = `Resource with id ${id} does not exist in our records`;
            throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
        }
        return document.products;
    }

    async addProduct(id, idProducto) {
        const updatedDocument = await this.model.updateOne(
            { _id: id },
            { $push: { products: idProducto } }
        );
        if (!updatedDocument.matchedCount) {
            const message = `Resource with id ${id} does not exist in our records`;
            throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
        }
        return updatedDocument;
    }

    async deleteProductById(idCart, idProd) {
        const updatedDocument = await this.model.updateOne(
            { _id: idCart },
            { $pull: { products: idProd } }
        );
        if (!updatedDocument.matchedCount) {
            const message = `Resource with id ${idProd} does not exist in our records`;
            throw new HttpError(HTTP_STATUS.NOT_FOUND, message);
        }
        return updatedDocument;
    }

}

module.exports = DaoCartsMongo;