const request = (url, data = [], method = 'GET', type = '') => {
    const requestOptions = {
        method: method,
        credentials: 'include'
    };

    if (type === 'urlencoded')
        requestOptions.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

    if (type !== 'image' && type !== 'urlencoded')
        requestOptions.headers = {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Credentials": true
        };

    if (method === 'POST') {
        if (type !== 'image' && type !== 'urlencoded')
            requestOptions.body = JSON.stringify(data);
        else
            requestOptions.body = data;
    }

    return fetch(url, requestOptions)
}

exports.request = request;