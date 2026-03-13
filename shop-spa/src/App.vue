<template>
  <div class="app-shell">
    <AppHeader />

    <main class="page-shell container">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <transition name="toast-fade">
      <div v-if="notification" class="toast" :class="notification.type">
        {{ notification.text }}
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from './components/ui/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  computed: {
    ...mapGetters(['notification'])
  }
}
</script>
