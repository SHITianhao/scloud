const get = (key, json=true) => {
    const value = localStorage.getItem(key);
    if(json) {
        return JSON.parse(value);
    } else {
        return value;
    }
}

const set = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export default {
    set,
    get
}