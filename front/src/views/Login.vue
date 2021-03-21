<template>
  <v-container>
  <v-row background="teal darken-3" align="center" justify="center">
    <v-card align="center" justify="center" elevation="2" outlined shaped flat width="400px" class="ma-10 pa-5">
      <v-btn center color="red" elevation="2" large rounded x-large class="my-10 white--text d-block">
        <v-icon left large class="mx-5">
          mdi-google
        </v-icon>
        Login with Google
      </v-btn>
      <v-btn center color="blue accent-3" elevation="2" large rounded x-large class="my-10 white--text d-block">
        <v-icon left large class="mx-5">
          mdi-discord
        </v-icon>
        Login with DISCORD
      </v-btn>
    </v-card>
  </v-row>
  <Footer></Footer>
  </v-container>  
</template>

<script>
import Footer from '@/components/Footer.vue';
export default {
  components: {
    Footer,
  },
  beforeMount() {
    if (this.$store.state.userId) {
      this.$router.push({ name: 'App' });
    }
  }
}
</script>