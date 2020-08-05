import axios from 'axios';
import Cookie from 'js-cookie';
import config from './config';
const BASE_URL = config.BASE_URL;

const userId = Cookie.get('userId');
const token = Cookie.get('token');

axios.defaults.headers = {
    'Content-Type': 'application/json',
    'token': token,
    'userId': userId
};

const laptopService = {
    load: async() => {
        const res = await axios.get(BASE_URL + 'products/all');
        
        if(res.status === 200) {
            return {
                products: res.data.products,
                likedProducts: res.data.likedProducts
            };            
        }
        return null;
    },
    like: async(productId) => {
        let res;
        try {
            res = await axios.post('http://localhost:3001/products/like/' + productId);
        }
        catch(err) {            
            return err.response.status;
        }
        return res.status;
    },
    delete: async(productId) => {
        let res;        
        try {
            res = await axios.post('http://localhost:3001/products/delete/' + productId);
        }
        catch(err) {
            return err.response.status;
        }
        return res.status;        
    },
    add: async(name, description, url) => {        
        let res;        
        try {
            res = await axios.post("http://localhost:3001/products/add",
                { name, url, description });
        }
        catch(err) {
            return err.response;
        }
        return res.status;
    }
}

export default laptopService;