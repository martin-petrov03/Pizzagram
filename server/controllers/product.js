const User = require('../models/User');
const Product = require('../models/Product');
const ProductUser = require('../models/ProductUser');
const isAuth = require('../middleware/isAuth');

const getAllProducts = async(req, res) => {
    try {
        let likedProducts = [];
        const products = await Product.find();

        if(req.headers.userid) {
            const userId = req.headers.userid;
            const productUsers = await ProductUser.find();            
            for (let i = 0; i < productUsers.length; i++) {
                const obj = productUsers[i];                
                if(obj.user == userId) {                    
                    for (let p = 0; p < products.length; p++) {
                        if(products[p].id == obj.product) {                            
                            likedProducts.push(products[p].id)
                        }
                    }             
                }
            }
        }
                
        res.status(200).json(
        {
            products,
            likedProducts
        });
    }    
    catch(err) {        
        res.status(err.status || 500).json(
        {
            message: 'Cannot get products!'
        });
    }
}

const createNewProduct = async(req, res) => {
    if(await isAuth(req, res)){
        //Check for duplication
        const product = await Product.findOne({ name: req.body.name });
        
        if(product) {
            res.status(409).json(
            {
                message: 'A product with this name already exist!',
            });
            return false;
        }

        const authorId = req.headers.userid;
        const { name, description, url } = req.body;

        if(!url.startsWith('http'))
        {
            res.status(500).json(
            {
                message: 'Product cannot be created!',
            });
            return;
        }

        const newProduct = { name, description, url, likes: 0, author: authorId };

        try{
            await Product.create(newProduct)
            res.status(200).json(
                {
                    message: 'Product successfully created!'                  
                }
            );
        }
        catch(err) {
            console.log(err);
            res.status(500).json(
            {
                message: 'Product cannot be created!',
            });
        }
    }
}

const likeProduct = async(req, res) => {
    const productId = req.params.id;
    
    if(await isAuth(req, res)){        
        const userId = req.headers.userid;
        
        Product.findById(productId).then(async product => {
            try {
                const user = await User.findById(userId);

                if(user.likedProductsIds.includes(productId)){
                    res.status(400).json(
                    {
                        message: 'You have already liked this product!',
                    });
                    return;
                }
    
                const newLikesCount = product.likes + 1;
                product.likes = newLikesCount;
                product.save();
                        
                await ProductUser.create({
                    product: productId,
                    user: userId
                })
                
                res.status(200).json(
                {
                    message: 'Product was liked successfully!'
                });
            }                        
            catch(err) {
                res.status(500).json(
                {
                    message: 'Cannot find the user!',
                });
            }
        })    
        .catch(err => {
            res.status(500).json(
            {
                message: 'Cannot find the product!',
            });
        });
    }
}

const deleteProduct = async(req, res) => {
    const productId = req.params.id;

    if(await isAuth(req, res)){
        Product.findById(productId).then(product => {
            if(product) {
                Product.deleteOne({
                    _id: productId 
                }).then(() => {
                    res.status(200).json(
                    {
                        message: 'Product has been successfully deleted!',
                    });
                })
            }else {
                res.status(500).json(
                {
                    message: 'Cannot find the product!',
                });                
            }
        })
        .catch(err => {
            res.status(500).json(
            {
                message: 'Cannot find the product!',
            });
        });
    }
}

module.exports = {    
    getAllProducts,
    createNewProduct,
    likeProduct,    
    deleteProduct
};