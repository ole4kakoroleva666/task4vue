<template>
  <section>
    <div class="section-head">
      <div>
        <h1>Каталог товаров</h1>
        <p class="section-text">Выберите товары и добавьте их в корзину.</p>
      </div>

      <div class="head-actions">
        <template v-if="isAuthenticated">
          <router-link to="/cart" class="secondary-btn inline-flex">Корзина</router-link>
          <router-link to="/orders" class="secondary-btn inline-flex">Заказы</router-link>
          <button class="danger-btn" @click="logout">Выйти</button>
        </template>

        <template v-else>
          <router-link to="/register" class="secondary-btn inline-flex">Регистрация</router-link>
          <router-link to="/login" class="secondary-btn inline-flex">Вход</router-link>
        </template>
      </div>
    </div>

    <div v-if="loading" class="empty-card">Загрузка товаров...</div>

    <div v-else-if="!products.length" class="empty-card">
      Список товаров пуст.
    </div>

    <div v-else class="product-grid">
      <article v-for="product in products" :key="product.id" class="card product-card">
        <div class="product-top">
          <h3>{{ product.name }}</h3>
          <span class="price">{{ product.price }} ₽</span>
        </div>

        <p class="description">{{ product.description }}</p>

        <div class="card-actions">
          <button
            v-if="isAuthenticated"
            class="primary-btn"
            @click="addProduct(product.id)"
          >
            Добавить в корзину
          </button>
          <router-link v-else to="/login" class="secondary-btn inline-flex">
            Войти для покупки
          </router-link>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CatalogView',
  computed: {
    ...mapGetters(['products', 'loading', 'isAuthenticated'])
  },
  created() {
    this.$store.dispatch('fetchProducts')
    if (this.isAuthenticated) {
      this.$store.dispatch('fetchCart')
    }
  },
  methods: {
    addProduct(productId) {
      this.$store.dispatch('addToCart', productId)
    },
    async logout() {
      await this.$store.dispatch('logout')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    }
  }
}
</script>
