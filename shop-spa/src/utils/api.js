const BASE_URL = 'http://lifestealer86.ru/api-shop'

async function request(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    })

    let payload = null
    try {
        payload = await response.json()
    } catch (error) {
        payload = null
    }

    if (!response.ok) {
        let message = "Ошибка запроса"

        if (payload && payload.error && payload.error.message) {
            message = payload.error.message
        }

        const error = new Error(message)
        error.status = response.status
        error.payload = payload
        throw error
    }

    return payload
}

export function loginRequest(credentials) {
    return request('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
}

export function registerRequest(userData) {
    return request('/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    })
}

export function getProductsRequest() {
    return request('/products', {
        method: 'GET'
    })
}

export function addToCartRequest(productId, token) {
    return request(`/cart/${productId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function getCartRequest(token) {
    return request('/cart', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function deleteCartItemRequest(cartItemId, token) {
    return request(`/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function createOrderRequest(token) {
    return request('/order', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function getOrdersRequest(token) {
    return request('/order', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export function logoutRequest(token) {
    return request('/logout', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}