<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters(['isAuthenticated', 'cartCount'])
  },
  methods: {
    async handleLogout() {
      await this.$store.dispatch('logout')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    }
  }
}
</script>
