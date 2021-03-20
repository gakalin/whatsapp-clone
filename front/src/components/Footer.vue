<template>
  <v-footer absolute color="grey darken-3">
    <v-card flat align="center" justify="center" width="100%" color="grey darken-3">
      <v-btn icon class="mx-2" href="https://github.com/gakalin">
        <v-icon medium color="white">mdi-github</v-icon>
      </v-btn>
      <v-btn icon class="mx-2" href="mailto:gokberkakalin@gmail.com">
        <v-icon medium color="white">mdi-email</v-icon>
      </v-btn>
    </v-card>
    <v-card flat align="center" justify="center" width="100%" color="grey darken-3">
      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} - Designed & Coded by <strong>Gökberk Akalın</strong>  
      </v-card-text> 
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>