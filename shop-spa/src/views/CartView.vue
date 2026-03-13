<template>
  <section>
    <div class="section-head">
      <div>
        <h1>Корзина</h1>
        <p class="section-text">Управляйте количеством товаров и оформляйте заказ.</p>
      </div>
      <router-link to="/" class="text-link">Назад</router-link>
    </div>

    <div v-if="loading" class="empty-card">Загрузка корзины...</div>

    <div v-else-if="!groupedCart.length" class="empty-card">
      В корзине пока нет товаров.
    </div>

    <div v-else class="stack">
      <article v-for="item in groupedCart" :key="item.product_id" class="card cart-item">
        <div>
          <h3>{{ item.name }}</h3>
          <p class="description">{{ item.description }}</p>
        </div>

        <div class="cart-meta">
          <span class="price">{{ item.price }} ₽</span>
          <div class="quantity-box">
            <button class="icon-btn" @click="decrease(item)">−</button>
            <span>{{ item.quantity }}</span>
            <button class="icon-btn" @click="increase(item.product_id)">+</button>
          </div>
          <button class="danger-btn" @click="remove(item.product_id)">Удалить</button>
        </div>
      </article>

      <div class="card summary-card">
        <div>
          <h3>Итого</h3>
          <p class="section-text">Общая стоимость выбранных товаров</p>
        </div>
        <div class="summary-actions">
          <strong class="total-price">{{ cartTotal }} ₽</strong>
          <button class="primary-btn" :disabled="loading" @click="checkout">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CartView',
  computed: {
    ...mapGetters(['groupedCart', 'cartTotal', 'loading'])
  },
  created() {
    this.$store.dispatch('fetchCart')
  },
  methods: {
    increase(productId) {
      this.$store.dispatch('addToCart', productId)
    },
    decrease(item) {
      const id = item.cartItemIds?.[0]
      if (id) {
        this.$store.dispatch('removeOneCartItem', id)
      }
    },
    remove(productId) {
      this.$store.dispatch('removeGroupFromCart', productId)
    },
    async checkout() {
      const success = await this.$store.dispatch('createOrder')
      if (success) {
        this.$router.push('/orders')
      }
    }
  }
}
</script>
