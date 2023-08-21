import { cartsModel } from "../dao/mongo/models/carts.model.js";

export default class CartRepository {
    
    async create (cart) {
        const result = await cartsModel.create(cart);
        return result;
    }

    async findOne(filter) {
        const cart = await cartsModel.findOne(filter).lean();
        return cart;
    }

    async deleteOne(filter) {
        const result = await cartsModel.deleteOne(filter);
        return result;
    }

    async find(filter) {
        const carts = await cartsModel.find(filter).lean();
        return carts;
    }

    async findById(id) {
        const cart = await cartsModel.findById(id);
        return cart;
    }

    async findByIdPage(id) {
        const query = cartsModel.findById(id).exec();
        return query;
    }

    async save(cart) {
        await cart.save();
    }
}