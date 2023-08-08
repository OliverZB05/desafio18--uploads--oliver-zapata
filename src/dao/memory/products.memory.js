import mongoose from 'mongoose';

export default class Products {
    constructor() {
        this.data = [];
    }

    get_Products = async (filter, options) => {
        return this.data;
    }

    getID_Products = async (pid) => {
        const objectId = new mongoose.Types.ObjectId(pid);
        const result = this.data.filter(c => c._id.equals(objectId));
        return result;
    }

    post_Products = async (prod) => {
        prod._id = new mongoose.Types.ObjectId();
        this.data.push(prod);
        return prod;
    }

    put_Products = async (pid, prod) => {
        const objectId = new mongoose.Types.ObjectId(pid);
        const index = this.data.findIndex(c => c._id.equals(objectId));
        this.data[index] = { ...this.data[index], ...prod };
        return this.data[index];
    }
    
    
    delete_Products = async (pid) => {
        const objectId = new mongoose.Types.ObjectId(pid);
        const index = this.data.findIndex(c => c._id.equals(objectId));
        this.data.splice(index, 1);
        return { id: pid };
    }    
    
    updateProductStock = async (req, productId, newStock) => {
        // Buscar el producto en el arreglo de productos
        const product = this.data.find(p => p._id.equals(productId));
        if (!product){ 
            req.logger(req, 'error', `Producto no encontrado`);
            throw new Error("Producto no encontrado");
        };
        // Actualizar el stock del producto
        product.stock = newStock;
    }
    
}