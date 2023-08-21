import mongoose from 'mongoose';

export default class Carts {
    constructor() {
        this.data = [];
    }

    create = async (cart) => {
        cart._id = new mongoose.Types.ObjectId();
        this.data.push(cart);
        return cart;
    }

    getId = async (id) => {
        const objectId = new mongoose.Types.ObjectId(id);
        return this.data.find(c => c._id.equals(objectId));
    }
    

    erase = async (id) => {
        const objectId = new mongoose.Types.ObjectId(id);
        const index = this.data.findIndex(c => c._id.equals(objectId));
        if (index !== -1) {
            this.data.splice(index, 1);
        }
        return { id };
    }

    getAll = async (ids) => {
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
        const carts = this.data.filter(c => objectIds.some(objectId => c._id.equals(objectId)));
        carts.forEach(cart => {
            cart.products || (cart.products = []);
        });
        return carts;
    }

    addProductToCart = async (req, cartId, prodId, quantity) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(prodId);
        const cart = this.data.find(c => c._id.equals(cartObjectId));
        if (!cart) {
            req.logger(req, 'error', `Carrito no encontrado`);
            throw new Error("Carrito no encontrado");
        };

        // Obtener el producto y verificar el stock
        const product = await productRepository.findById(prodId);
        if (!product) {
            req.logger(req, 'error', `Producto no encontrado`);
            throw new Error("Producto no encontrado")
        };
        if (quantity > product.stock){
            req.logger(req, 'error', `Stock insuficiente`);
            throw new Error("Stock insuficiente");
        };

        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => {
            if (!p.product) {
                req.logger(req, 'error', `Falta la propiedad del producto`);
                throw new Error("Falta la propiedad del producto");
            };
            return p.product.equals(productObjectId);
        });
        let finalQuantity = quantity;
        if (index !== -1) {
            // Verificar que la cantidad total no exceda el stock
            if (cart.products[index].quantity + quantity > product.stock){
                req.logger(req, 'error', `Stock insuficiente`);
                throw new Error("Stock insuficiente")
            };
            cart.products[index].quantity += quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            // Verificar que la cantidad solicitada no exceda el stock
            if (quantity > product.stock){
                req.logger(req, 'error', `Stock insuficiente`);
                throw new Error("Stock insuficiente");
            };
            cart.products.push({ product: productObjectId, quantity });
        }
        return { id: prodId, quantity: finalQuantity };
    }

    updateProductToCart = async (req, cartId, productId, quantity) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const cart = this.data.find(c => c._id.equals(cartObjectId));
        if (!cart) { 
            req.logger(req, 'error', `Carrito no encontrado`);
            throw new Error("Carrito no encontrado");
        };

        // Obtener el producto y verificar el stock
        const product = await productRepository.findById(productId);
        if (!product) {
            req.logger(req, 'error', `Producto no encontrado`);
            throw new Error("Producto no encontrado")
        };
        if (quantity > product.stock){
            req.logger(req, 'error', `Stock insuficiente`);
            throw new Error("Stock insuficiente");
        };

        cart.products || (cart.products = []);
        let index = cart.products.findIndex(p => p.product.equals(productObjectId));
        let finalQuantity = quantity;
        if (index !== -1) {
            // Verificar que la cantidad total no exceda el stock
            if (quantity > product.stock){
                req.logger(req, 'error', `Stock insuficiente`);
                throw new Error("Stock insuficiente");
            };
            cart.products[index].quantity = quantity;
            finalQuantity = cart.products[index].quantity;
        } else {
            // Verificar que la cantidad solicitada no exceda el stock
            if (quantity > product.stock){
                req.logger(req, 'error', `Stock insuficiente`);
                throw new Error("Stock insuficiente");
            };
            cart.products.push({ product: productObjectId, quantity });
        }
        return { id: productId, quantity: finalQuantity };
    }


    updateCart = async (req, cartId, sort, page, limit) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const cartIndex = this.data.findIndex(c => c._id.equals(cartObjectId));

        if (cartIndex === -1) {
            req.logger(req, 'error', `Carrito no encontrado`);
            throw new Error("Carrito no encontrado");
        };
        const cart = this.data[cartIndex];
        if (sort === 'asc') {
            cart.products.sort((a, b) => a.quantity - b.quantity);
        } else if (sort === 'desc') {
            cart.products.sort((a, b) => b.quantity - a.quantity);
        }
        let skip = ((page = parseInt(page) || 1) - 1) * (limit = parseInt(limit) || 3);
        const products = cart.products.map(p => ({ id: p.product.toString(), quantity: p.quantity }));
        var payload = products.slice(skip, skip + limit),
            totalProducts = products.length,
            totalPages = Math.ceil(totalProducts / limit),
            hasPrevPage = page > 1,
            hasNextPage = page < totalPages;
        return {
            status: "success", payload, totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page, hasPrevPage, hasNextPage
        };
    }

    deleteProdsOneToCart = async (req, cartId, productId, quantity) => {
        const cartObjectId = new mongoose.Types.ObjectId(cartId);
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const index = this.data.findIndex(c => c._id.equals(cartObjectId));

        if (index === -1) {
            req.logger(req, 'error', `Carrito no encontrado`);
            throw new Error("Carrito no encontrado");
        };

        let prodIndex = this.data[index].products.findIndex(p => p.product && p.product.toString() === productObjectId.toString());

        if (prodIndex === -1) {
            req.logger(req, 'error', `Producto no encontrado en el carrito`);
            throw new Error("Producto no encontrado en el carrito");
        };

        this.data[index].products[prodIndex].quantity -= quantity;
        let finalQuantity = this.data[index].products[prodIndex].quantity;
        if (this.data[index].products[prodIndex].quantity <= 0) {
            this.data[index].products.splice(prodIndex, 1);
            finalQuantity = 0;
        }
        return finalQuantity;
    }

    deleteProdsToCart=async(req, cartId)=>{
        const objectId=new mongoose.Types.ObjectId(cartId);
        const index=this.data.findIndex(c=>c._id.equals(objectId));
        if(index===-1){ 
            req.logger(req, 'error', `Carrito no encontrado`);
            throw new Error("Carrito no encontrado") 
        };
        this.data[index].products=[];
    }
}