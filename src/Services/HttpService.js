const axios = require('axios');

let headers = { 'Content-Type': 'application/json' };
let token="add3bf9b-0851-4692-9ef0-286d84fe7d29";
const setheaders = _ => headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken')

const getHeaders = _ => localStorage.getItem('accessToken')
// const setheaders = _ => headers.Authorization = 'Bearer ' + token

// const getHeaders = _ => token

setheaders();

const HttpService = {
    posts(url, x) {
        return {
            loginUrl: () => axios.get(url),
            post: body => {
                if (headers.Authorization === 'Bearer null') {
                    headers.Authorization = 'Bearer ' + getHeaders();
                    return axios.post(url, body, { headers: headers });
                } else {
                    return axios.post(url, body, { headers: headers });
                }
            },
            get: () => {
                if (headers.Authorization === 'Bearer null') {
                    headers.Authorization = 'Bearer ' + getHeaders();
                    return axios.get(url, { headers: headers });
                } else {
                    return axios.get(url, { headers: headers });
                }
            }
        };
    },

    auth(url, config) {
        return {
            Login: () => axios.get(url, { headers: config }),
            authAll: body => axios.post(url, body, { headers: config }),
            refreshToken: () => {
                let refreshUrl = url + localStorage.getItem('refreshToken');
                let oAuthConfig = { headers: { 'Content-Type': 'application/json', Authorization: 'Basic aGNhcHA6aGNhcHA=', } };
                return axios.get(refreshUrl, oAuthConfig);
            },
        };
    },
    async setNewToken() { return setheaders(); },
};
export default HttpService;
