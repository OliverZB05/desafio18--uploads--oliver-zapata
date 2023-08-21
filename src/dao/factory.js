import config from "../config/config.js";
import { developmentLogger, productionLogger } from '../logs/winston.config.js';

const persistence = config.persistence;

async function Factory() {
    let Carts;
    let Products;

    switch(persistence) {
        case 'MONGO':
            if (process.env.NODE_ENV === 'development') {
                developmentLogger.log('info', 'Trabajando con BDD');
            } else {
                productionLogger.log('info', 'Trabajando con BDD');
            }
            
            const mongoose = await import("mongoose");
            await mongoose.connect(config.mongoUrl);
            const { default: CartsMongo } = await import('./mongo/carts.mongo.js');
            const { default: ProductsMongo } = await import('./mongo/products.mongo.js');
            Carts = CartsMongo;
            Products = ProductsMongo;
            break;
        case 'MEMORY':
            if (process.env.NODE_ENV === 'development') {
                developmentLogger.log('info', 'Trabajando con MEMORY');
            } else {
                productionLogger.log('info', 'Trabajando con MEMORY');
            }
            
            const { default: CartsMemory } = await import('./memory/carts.memory.js');
            const { default: ProductsMemory } = await import('./memory/products.memory.js');
            Carts = CartsMemory;
            Products = ProductsMemory;
            break;
    }

    return {
        Carts,
        Products
    };
}

export default Factory;

