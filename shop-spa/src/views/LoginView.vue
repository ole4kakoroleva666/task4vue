<template>
  <section class="auth-layout">
    <div class="auth-card card">
      <div class="section-head compact">
        <div>
          <h1>Вход в систему</h1>
          <p class="section-text">Введите email и пароль.</p>
        </div>
        <router-link to="/" class="text-link">Назад</router-link>
      </div>

      <form class="form" @submit.prevent="submitForm">
        <label class="field">
          <span>Email</span>
          <input v-model.trim="form.email" type="email" :class="{ invalid: errors.email }" placeholder="mail@example.com">
          <small v-if="errors.email" class="error-text">{{ firstError(errors.email) }}</small>
        </label>

        <label class="field">
          <span>Пароль</span>
          <input v-model.trim="form.password" type="password" :class="{ invalid: errors.password }" placeholder="Введите пароль">
          <small v-if="errors.password" class="error-text">{{ firstError(errors.password) }}</small>
        </label>

        <button class="primary-btn full-width" :disabled="loading">
          {{ loading ? 'Выполняется вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      localErrors: {}
    }
  },
  computed: {
    ...mapGetters(['authErrors', 'loading']),
    errors() {
      return { ...this.authErrors, ...this.localErrors }
    }
  },
  methods: {
    firstError(value) {
      return Array.isArray(value) ? value[0] : value
    },
    validate() {
      const errors = {}

      if (!this.form.email) {
        errors.email = ['Введите email']
      }

      if (!this.form.password) {
        errors.password = ['Введите пароль']
      }

      this.localErrors = errors
      return Object.keys(errors).length === 0
    },
    async submitForm() {
      if (!this.validate()) return
      const success = await this.$store.dispatch('login', this.form)
      if (success) {
        await this.$store.dispatch('fetchCart')
        this.$router.push('/')
      }
    }
  }
}
</script>
