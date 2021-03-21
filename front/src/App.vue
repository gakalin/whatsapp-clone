<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  mounted() {
    if (!this.$store.state.userId) {
      this.$router.push({ name: 'Login' });
    } else {
      this.$router.push({ name: 'App' });
    }
  }
}
</script>