// src/services/storage.js
export function loadData(key, defaultValue) {
    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : defaultValue
    } catch (err) {
        console.error('Error loading data', err)
        return defaultValue
    }
}

export function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        if (key === 'altigoUser') {
            window.dispatchEvent(new Event('altigo-profile-updated'))
        }
    } catch (err) {
        console.error('Error saving data', err)
    }
}
