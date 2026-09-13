const ACCOUNTS_KEY = 'altigoAccounts'
const SESSION_KEY = 'altigoSession'

const userScopedKeys = new Set([
    'altigoUser',
    'activeTrail',
    'completedTrails',
    'routePlannerTrail',
    'altigoFriends',
    'friendConversations',
    'altigoFriendCode',
    'friendPosts',
    'socialPosts'
])

export const normalizeEmail = (email = '') => email.trim().toLowerCase()

export const createDefaultUser = ({ name = '', email = '', password = '' } = {}) => ({
    id: normalizeEmail(email),
    name: name.trim(),
    email: normalizeEmail(email),
    password,
    age: null,
    bio: '',
    avatar: '',
    postsShared: 0,
    likesReceived: 0,
    xp: 0,
    level: 1,
    achievements: []
})

const readJson = (key, defaultValue) => {
    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : defaultValue
    } catch (err) {
        console.error('Error loading data', err)
        return defaultValue
    }
}

const writeJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

const migrateLegacyAccount = () => {
    const accounts = readJson(ACCOUNTS_KEY, null)
    if (accounts && typeof accounts === 'object') return accounts

    const legacyUser = readJson('altigoUser', null)
    if (!legacyUser?.email) return {}

    const email = normalizeEmail(legacyUser.email)
    const account = { ...createDefaultUser(legacyUser), ...legacyUser, id: email, email }
    const migratedAccounts = { [email]: account }
    writeJson(ACCOUNTS_KEY, migratedAccounts)

    for (const key of userScopedKeys) {
        if (key === 'altigoUser') continue
        const legacyData = localStorage.getItem(key)
        if (legacyData && !localStorage.getItem(`${key}:${email}`)) {
            localStorage.setItem(`${key}:${email}`, legacyData)
        }
        localStorage.removeItem(key)
    }
    localStorage.removeItem('altigoUser')
    return migratedAccounts
}

const getAccounts = () => migrateLegacyAccount()

const getSessionEmail = () => normalizeEmail(readJson(SESSION_KEY, ''))

const scopedKey = (key, email = getSessionEmail()) => `${key}:${normalizeEmail(email)}`

export function getCurrentUser() {
    const email = getSessionEmail()
    return email ? getAccounts()[email] || null : null
}

export function registerUser({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email)
    const accounts = getAccounts()
    if (accounts[normalizedEmail]) return { error: 'exists' }

    const user = createDefaultUser({ name, email: normalizedEmail, password })
    accounts[normalizedEmail] = user
    writeJson(ACCOUNTS_KEY, accounts)
    return { user }
}

export function authenticateUser(email, password) {
    const normalizedEmail = normalizeEmail(email)
    const user = getAccounts()[normalizedEmail]
    if (!user || user.password !== password) return null

    writeJson(SESSION_KEY, normalizedEmail)
    window.dispatchEvent(new Event('altigo-session-changed'))
    return user
}

export function hasUser(email) {
    return Boolean(getAccounts()[normalizeEmail(email)])
}

export function logoutUser() {
    localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('altigo-session-changed'))
}

export function loadData(key, defaultValue) {
    if (key === 'altigoUser') return getCurrentUser() || defaultValue
    if (!userScopedKeys.has(key)) return readJson(key, defaultValue)

    const email = getSessionEmail()
    return email ? readJson(scopedKey(key, email), defaultValue) : defaultValue
}

export function saveData(key, value) {
    try {
        if (key === 'altigoUser') {
            const currentUser = getCurrentUser()
            if (!currentUser) return
            const accounts = getAccounts()
            accounts[currentUser.id] = { ...currentUser, ...value, id: currentUser.id, email: currentUser.email }
            writeJson(ACCOUNTS_KEY, accounts)
            window.dispatchEvent(new Event('altigo-profile-updated'))
            return
        }

        if (userScopedKeys.has(key)) {
            if (!getSessionEmail()) return
            writeJson(scopedKey(key), value)
        } else {
            writeJson(key, value)
        }
    } catch (err) {
        console.error('Error saving data', err)
    }
}

export function removeData(key) {
    try {
        if (userScopedKeys.has(key)) {
            const email = getSessionEmail()
            if (email) localStorage.removeItem(scopedKey(key, email))
        } else {
            localStorage.removeItem(key)
        }
    } catch (err) {
        console.error('Error removing data', err)
    }
}
