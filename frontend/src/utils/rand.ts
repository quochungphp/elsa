export const rand = (max: number, min: number = 0) => {
    if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
    }
    return Math.random() * (max - min) + min;
};

export const randInt = (max: number, min: number = 0) => {
    return Math.floor(rand(max, min));
};

const STRCHARS = 'abcdefghijklmnopqrstuvwxyz1234567890';
export const randStr = (length: number = 10, chars: string = STRCHARS) => {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += chars[randInt(chars.length)];
    }
    return s;
};

const HEXCHARS = 'abcdef1234567890';
export const randHex = (length: number = 10, chars: string = HEXCHARS) => {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += chars[randInt(chars.length)];
    }
    return s;
};
