const request = (url, data = [], method = 'GET', type = '') => {
    const requestOptions = {
        method: method,
        credentials: 'include'
    };

    if (type !== 'image')
        requestOptions.headers = {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Credentials": true
        };
    else
        requestOptions.body = data;

    if (method === 'POST' && type !== 'image')
        requestOptions.body = JSON.stringify(data);

    return fetch(url, requestOptions)
}

exports.request = request;