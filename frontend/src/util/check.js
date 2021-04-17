const isValidPassword = (value) => {
    return (value.length > 0);
}

const isValidInput = (type, value) => {
    let regex;

    switch (type) {
        case 'email':
            regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            break;

        case 'username':
            regex = /^[A-zА-я0-9]{3,}$/;
            break;

        case 'about':
            return (value.length < 80);

        default:
            return (value.length > 0);
    }

    if (value.match(regex))
        return true;
    return false;
}

exports.isValidPassword = isValidPassword;
exports.isValidInput = isValidInput;
