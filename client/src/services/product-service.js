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
            return res.data.products;
        }
        return null;
    },
    loadAccessoryById: async(id) => {
        const res = await axios.get(BASE_URL + 'accessories/' + id);
        
        if(res.status === 200) {
            return res.data.accessory;
        }
        return null;
    },
    delete: async(id) => {
        let res;        
        try {
            res = await axios.delete(BASE_URL + `accessories/delete/${id}`);
        }
        catch(err) {
            return err.response.status;
        }
        return res.status;        
    },
    add: async(title, url, description, price) => {        
        let res;
        try {
            res = await axios.post(BASE_URL + 'accessories/add', { title, url, description, price });   
        }
        catch(err) {            
            return err.response;
        }
        return res.status;
    }
}

export default laptopService;