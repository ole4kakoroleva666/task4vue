import { createStore } from 'vuex'
import {
    addToCartRequest,
    createOrderRequest,
    deleteCartItemRequest,
    getCartRequest,
    getOrdersRequest,
    getProductsRequest,
    loginRequest,
    logoutRequest,
    registerRequest
} from '@/utils/api'

function normalizeError(error) {
    const payload = (error && error.payload) ? error.payload : {}
    const payloadError = (payload && payload.error) ? payload.error : payload

    let fields = (payloadError && payloadError.errors) ? payloadError.errors : {}

    if (Array.isArray(fields)) {
        fields = fields.reduce((acc, item) => {
            if (item && typeof item === 'object') {
                return {...acc, ...item }
            }
            return acc
        }, {})
    }

    return {
        status: (error && error.status) ? error.status : 500,
        message: (payloadError && payloadError.message) ?
            payloadError.message :
            (error && error.message) ?
            error.message : 'Неизвестная ошибка',
        fields
    }
}

function groupCartItems(items) {
    const groupedMap = items.reduce((acc, item) => {
        if (!acc[item.product_id]) {
            acc[item.product_id] = {
                product_id: item.product_id,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                quantity: 0,
                cartItemIds: []
            }
        }

        acc[item.product_id].quantity += 1
        acc[item.product_id].cartItemIds.push(item.id)
        return acc
    }, {})

    return Object.values(groupedMap)
}

export default createStore({
    state: {
        token: localStorage.getItem('token') || '',
        products: [],
        cart: [],
        orders: [],
        loading: false,
        notification: null,
        authErrors: {},
        registerErrors: {}
    },
    getters: {
        isAuthenticated: state => Boolean(state.token),
        products: state => state.products,
        groupedCart: state => groupCartItems(state.cart),
        orders: state => state.orders,
        cartCount: state => state.cart.length,
        loading: state => state.loading,
        notification: state => state.notification,
        authErrors: state => state.authErrors,
        registerErrors: state => state.registerErrors,
        cartTotal: (state, getters) => getters.groupedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    mutations: {
        SET_LOADING(state, value) {
            state.loading = value
        },
        SET_TOKEN(state, token) {
            state.token = token
            if (token) {
                localStorage.setItem('token', token)
            } else {
                localStorage.removeItem('token')
            }
        },
        SET_PRODUCTS(state, products) {
            state.products = products
        },
        SET_CART(state, cart) {
            state.cart = cart
        },
        SET_ORDERS(state, orders) {
            state.orders = orders
        },
        SET_NOTIFICATION(state, notification) {
            state.notification = notification
        },
        CLEAR_NOTIFICATION(state) {
            state.notification = null
        },
        SET_AUTH_ERRORS(state, errors) {
            state.authErrors = errors || {}
        },
        SET_REGISTER_ERRORS(state, errors) {
            state.registerErrors = errors || {}
        },
        CLEAR_SESSION_DATA(state) {
            state.token = ''
            state.cart = []
            state.orders = []
            state.authErrors = {}
            state.registerErrors = {}
            localStorage.removeItem('token')
        }
    },
    actions: {
        showNotification({ commit }, notification) {
            commit('SET_NOTIFICATION', notification)
            setTimeout(() => {
                commit('CLEAR_NOTIFICATION')
            }, 2800)
        },
        async fetchProducts({ commit, dispatch }) {
            commit('SET_LOADING', true)
            try {
                const response = await getProductsRequest()
                commit('SET_PRODUCTS', response.data || [])
            } catch (error) {
                dispatch('showNotification', { type: 'error', text: normalizeError(error).message })
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async login({ commit, dispatch }, credentials) {
            commit('SET_AUTH_ERRORS', {})
            commit('SET_LOADING', true)
            try {
                const response = await loginRequest(credentials)
                commit('SET_TOKEN', response.data.user_token)
                dispatch('showNotification', { type: 'success', text: 'Вход выполнен успешно' })
                return true
            } catch (error) {
                const normalized = normalizeError(error)
                commit('SET_AUTH_ERRORS', normalized.fields)
                dispatch('showNotification', { type: 'error', text: normalized.message })
                return false
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async register({ commit, dispatch }, userData) {
            commit('SET_REGISTER_ERRORS', {})
            commit('SET_LOADING', true)

            try {
                const response = await registerRequest(userData)

                if (response && response.data && response.data.user_token) {
                    dispatch('showNotification', {
                        type: 'success',
                        text: 'Регистрация прошла успешно'
                    })
                }

                return true
            } catch (error) {
                const normalized = normalizeError(error)

                commit('SET_REGISTER_ERRORS', normalized.fields)

                dispatch('showNotification', {
                    type: 'error',
                    text: normalized.message
                })

                return false
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async logout({ state, commit, dispatch }) {
            try {
                if (state.token) {
                    await logoutRequest(state.token)
                }
            } catch (error) {

            } finally {
                commit('CLEAR_SESSION_DATA')
                dispatch('showNotification', { type: 'info', text: 'Вы вышли из аккаунта' })
            }
        },
        async fetchCart({ state, commit, dispatch }) {
            if (!state.token) return
            commit('SET_LOADING', true)
            try {
                const response = await getCartRequest(state.token)
                commit('SET_CART', response.data || [])
            } catch (error) {
                dispatch('showNotification', { type: 'error', text: normalizeError(error).message })
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async addToCart({ state, dispatch }, productId) {
            if (!state.token) {
                dispatch('showNotification', { type: 'error', text: 'Сначала войдите в аккаунт' })
                return false
            }

            try {
                await addToCartRequest(productId, state.token)
                await dispatch('fetchCart')
                dispatch('showNotification', { type: 'success', text: 'Товар добавлен в корзину' })
                return true
            } catch (error) {
                dispatch('showNotification', { type: 'error', text: normalizeError(error).message })
                return false
            }
        },
        async removeOneCartItem({ state, dispatch }, cartItemId) {
            try {
                await deleteCartItemRequest(cartItemId, state.token)
                await dispatch('fetchCart')
                dispatch('showNotification', { type: 'info', text: 'Количество товара уменьшено' })
            } catch (error) {
                dispatch('showNotification', { type: 'error', text: normalizeError(error).message })
            }
        },
        async removeGroupFromCart({ dispatch, getters }, productId) {
            const target = getters.groupedCart.find(item => item.product_id === productId)
            if (!target) return

            for (const id of target.cartItemIds) {
                await dispatch('silentRemoveCartItem', id)
            }

            await dispatch('fetchCart')
            dispatch('showNotification', { type: 'info', text: 'Товар удалён из корзины' })
        },
        async silentRemoveCartItem({ state }, cartItemId) {
            await deleteCartItemRequest(cartItemId, state.token)
        },
        async createOrder({ state, commit, dispatch }) {
            commit('SET_LOADING', true)
            try {
                await createOrderRequest(state.token)
                dispatch('showNotification', { type: 'success', text: 'Заказ оформлен' })
                await dispatch('fetchCart')
                await dispatch('fetchOrders')
                return true
            } catch (error) {
                dispatch('showNotification', { type: 'error', text: normalizeError(error).message })
                return false
            } finally {
                commit('SET_LOADING', false)
            }
        },
        async fetchOrders({ state, commit, dispatch }) {
            if (!state.token) return
            commit('SET_LOADING', true)
            try {
                const response = await getOrdersRequest(state.token)
                commit('SET_ORDERS', response.data || [])
            } catch (error) {
                dispatch('showNotification', { type: 'error', text: normalizeError(error).message })
            } finally {
                commit('SET_LOADING', false)
            }
        }
    }
})