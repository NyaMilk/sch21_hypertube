
// const isValidPassword = (value) => {
//     if (value.match(/\W+$/) && value.length > 7 )
//         return true;
//     return false; 
// }

const isValidPassword = (value) => {
    return (value.length > 0);
}

const isValidInput = (type, value) => {
    let regex;

    switch (type) {
        case 'email':
            regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            break;

        case 'login':
            regex = /^[A-zА-я0-9]{3,}$/;
            console.log('tut');
            break;

        // case 'newPass':
        //     return (value.length > 0);

        // case 'rePass':
        //     return (value.length > 0);

        // case 'currentPass':
        //     return (value.length > 0);

        case 'about':
            return (value.length < 80);

        default:
            return (value.length > 0);
        // regex = /^[A-zА-я]{1,}$/;
    }

    if (value.match(regex))
        return true;
    return false;
}

exports.isValidPassword = isValidPassword;
exports.isValidInput = isValidInput;
