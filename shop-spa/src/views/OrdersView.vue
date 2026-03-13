<template>
  <section>
    <div class="section-head">
      <div>
        <h1>Оформленные заказы</h1>
        <p class="section-text">История заказов текущего пользователя.</p>
      </div>
      <router-link to="/" class="text-link">Назад</router-link>
    </div>

    <div v-if="loading" class="empty-card">Загрузка заказов...</div>

    <div v-else-if="!orders.length" class="empty-card">
      У вас пока нет оформленных заказов.
    </div>

    <div v-else class="stack">
      <article v-for="order in orders" :key="order.id" class="card order-card">
        <div class="order-head">
          <h3>Заказ №{{ order.id }}</h3>
          <span class="price">{{ order.order_price }} ₽</span>
        </div>

        <p class="section-text">Товары в заказе: {{ order.products.join(', ') }}</p>
      </article>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OrdersView',
  computed: {
    ...mapGetters(['orders', 'loading'])
  },
  created() {
    this.$store.dispatch('fetchOrders')
  }
}
</script>
