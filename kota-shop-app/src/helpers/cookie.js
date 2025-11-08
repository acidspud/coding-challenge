const cookie = {
    save: (key, value) => {
        localStorage.setItem(key, value)
    },
    load: (key) => {
        return localStorage.getItem(key)
    },
    remove: (key) => {
        localStorage.removeItem(key)
    },
}

export default cookie
