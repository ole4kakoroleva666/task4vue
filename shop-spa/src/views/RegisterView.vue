<template>
  <section class="auth-layout">
    <div class="auth-card card">
      <div class="section-head compact">
        <div>
          <h1>Регистрация</h1>
          <p class="section-text">Создайте новый аккаунт покупателя</p>
        </div>
        <router-link to="/" class="text-link">Назад</router-link>
      </div>

      <form class="form" @submit.prevent="submitForm">
        <label class="field">
          <span>ФИО</span>
          <input v-model.trim="form.fio" type="text" :class="{ invalid: errors.fio }" placeholder="Иванов Иван Иванович">
          <small v-if="errors.fio" class="error-text">{{ firstError(errors.fio) }}</small>
        </label>

        <label class="field">
          <span>Email</span>
          <input v-model.trim="form.email" type="email" :class="{ invalid: errors.email }" placeholder="olya@example.com">
          <small v-if="errors.email" class="error-text">{{ firstError(errors.email) }}</small>
        </label>

        <label class="field">
          <span>Пароль</span>
          <input v-model.trim="form.password" type="password" :class="{ invalid: errors.password }" placeholder="Минимум 6 символов">
          <small v-if="errors.password" class="error-text">{{ firstError(errors.password) }}</small>
        </label>

        <button class="primary-btn full-width" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        fio: '',
        email: '',
        password: ''
      },
      localErrors: {}
    }
  },
  computed: {
    ...mapGetters(['registerErrors', 'loading']),
    errors() {
      return { ...this.registerErrors, ...this.localErrors }
    }
  },
  methods: {
    firstError(value) {
      return Array.isArray(value) ? value[0] : value
    },
    validate() {
      const errors = {}

      if (!this.form.fio) {
        errors.fio = ['Введите ФИО']
      }
      if (!this.form.email) {
        errors.email = ['Введите email']
      }
      if (!this.form.password) {
        errors.password = ['Введите пароль']
      } else if (this.form.password.length < 6) {
        errors.password = ['Пароль должен быть не короче 6 символов']
      }

      this.localErrors = errors
      return Object.keys(errors).length === 0
    },
    async submitForm() {
      if (!this.validate()) return
      const success = await this.$store.dispatch('register', this.form)
      if (success) {
        this.$router.push('/login')
      }
    }
  }
}
</script>
