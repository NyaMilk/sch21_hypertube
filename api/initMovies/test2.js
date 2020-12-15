const extensions = ['.mp4', '.mkv', '.avi', '.ogg'];
const check = (filename, extensions) => {
    let res = false;
    extensions.forEach((item) => {
        res =  (filename.includes(item)) ? true : res;
    })

    return res;
}

console.log(check('test.mp4', extensions));