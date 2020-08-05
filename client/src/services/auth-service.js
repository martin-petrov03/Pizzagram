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

const authService = {
    login: async(email, password) => {
        let res;
        try {
            res = await axios.post(BASE_URL + 'auth/signIn', { email, password });
        }
        catch(err) {
            return err.response.status;
        }
        
        if(res.status === 200) { 
            Cookie.set('token', res.data.token, { expires: 100 });
            Cookie.set('username', res.data.username);
            Cookie.set('userId', res.data.userId);               
        }

        return res.status;
    },
    logout: () => {        
        Cookie.set('token', '');
        Cookie.set('username', '');
        Cookie.set('userId', '');        
    },
    register: async(email, username, password) => {        
        let res;
        try {
            res = await axios.post(BASE_URL + 'auth/signup', { email, username, password });            
        }
        catch(err) {
            return err.response.status;
        }

        return res.status;
    }
}

export default authService;