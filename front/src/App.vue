<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  beforeMount() {
    this.$axios({ url: '/user/auth', method: 'get', data: {}})
      .then((result) => {
        if (result.data.success) {
            this.$store.commit('setUserInfos', result.data.data);
            this.$router.push({ name: 'App' });
            this.$socket.client.emit('login', result.data.data);
        }
      });
  },
  mounted() {
    /*
    if (!this.$store.state.userId) {
      this.$router.push({ name: 'Login' });
    } else {
      this.$router.push({ name: 'App' });
    }
    */
  }
}
</script>