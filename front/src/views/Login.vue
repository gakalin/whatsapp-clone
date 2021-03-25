<template>
  <v-container>
  <v-row background="teal darken-3" align="center" justify="center" class="mt-5">
    <v-card align="center" justify="center" elevation="2" width="300px" outlined shaped flat class="pa-5">

      <v-form v-if="registerPanel" ref="registerForm" v-model="registerValid" lazy-validation>
        <v-text-field v-model="email" :rules="emailRules" label="E-Mail" required></v-text-field>
        <v-text-field v-model="userName" :rules="userNameRules" :counter="30" label="Name" required></v-text-field>
        <v-text-field v-model="userPw1" label="Password" required :append-icon="showPw1 ? 'mdi-eye' : 'mdi-eye-off'" :type="showPw1 ? 'text' : 'password'" @click="showPw1 = !showPw1" :rules="passwordRules"></v-text-field>
        <v-text-field v-model="userPw2" label="Confirm Password" required :append-icon="showPw2 ? 'mdi-eye' : 'mdi-eye-off'" :type="showPw2 ? 'text' : 'password'" @click="showPw2 = !showPw2" :rules="passwordConfirmRules"></v-text-field>
        <v-btn color="deep-orange" width="100%" x-large @click.prevent="register" rounded class="white--text mt-5">
          <v-icon left large class="mx-2 pr-2">
            mdi-account-plus
          </v-icon>
          Register
        </v-btn>
          <v-btn color="green darken-3" width="100%" x-large @click.prevent="registerPanelToggle(false)" rounded class="white--text mt-5">
            <v-icon left large class="mx-2 pr-2">
              mdi-login-variant
            </v-icon>
            Sign In
          </v-btn>
      </v-form>

      <v-form v-if="!registerPanel" ref="loginForm" v-model="loginValid" lazy-validation>
        <v-text-field v-model="email" :rules="emailRules" label="E-Mail" required></v-text-field>
        <v-text-field v-model="userPw1" label="Password" required :append-icon="showPw1 ? 'mdi-eye' : 'mdi-eye-off'" :type="showPw1 ? 'text' : 'password'" @click="showPw1 = !showPw1" :rules="loginPasswordRules"></v-text-field>
        <v-btn color="green darken-3" width="100%" @click.prevent="login" x-large rounded class="white--text mt-5">
          <v-icon left large class="mx-2 pr-2">
            mdi-login-variant
          </v-icon>
          Sign In
        </v-btn>
        <v-btn color="deep-orange" width="100%" @click.prevent="registerPanelToggle(true)" x-large rounded class="white--text mt-5">
          <v-icon left large class="mx-2 pr-2">
            mdi-account-plus
          </v-icon>
          Register
        </v-btn>
        <v-btn :href="googleLoginUrl" center color="red" elevation="2" x-large rounded class="white--text mt-5">
          <v-icon left large class="mx-2 pr-2">
            mdi-google
          </v-icon>
          Login with Google
        </v-btn>
        <v-btn center color="blue accent-3" elevation="2" x-large rounded class="white--text mt-5">
          <v-icon left large class="mx-2 pr-2">
            mdi-discord
          </v-icon>
          Login with DISCORD
        </v-btn>
      </v-form>

    </v-card>
  </v-row>
  <Footer></Footer>
  </v-container>  
</template>

<script>
import Footer from '@/components/Footer.vue';
import validator from 'validator';
import queryString from 'query-string';

export default {
  data: () => ({
    /* Form Validations and Datas */
    registerValid: true,
    registerPanel: false,
    email: null,
    emailRules: [
      v => !!v || 'Email is required',
      v => validator.isEmail(v ? v.toString() : '') || 'Email must be valid',
    ],
    userName: null,
    userNameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 30) || 'Name must be less than 30 characters',
      v => (v && v.length >= 2) || 'Name must be longer than 2 characters',
    ],
    showPw1: true,
    userPw1: null,
    passwordRules: [
      v => !!v || 'Password is required',
      v => validator.isStrongPassword(v ? v.toString(): '', { minLength: 6, minLowercase: 1, minUpperCase: 1, minSymbols: 0, returnScore: false }) || 'Password needs to contain at least 1 number, 1 uppercase, 1 lowercase characters (min 6 chars)',
    ],
    showPw2: true,
    userPw2: null,
    loginValid: true,
    loginPasswordRules: [
      v => !!v || 'Password is required',
    ]
  }),
  watch: {
    userPw1() {
      this.userPw2 = null;
    }
  },
  computed: {
    passwordConfirmRules() {
      return [
        v => !!v || 'Need to confirm your password',
        v => (this.userPw1 == v) || 'Passwords doesn\'t match',  
      ];
    },
    googleLoginUrl() {
        let params = queryString.stringify({
          client_id: process.env.VUE_APP_GOOGLECLIENTID,
          redirect_uri: process.env.VUE_APP_GOOGLEAUTHREDIRECTURI,
          scope: [
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/userinfo.profile',
          ].join(' '),
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    },
  },
  methods: {
    registerPanelToggle(val) {
      this.registerPanel = val;
    },
    register() {
      if (this.$refs.registerForm.validate()) {
        this.$axios({ url: '/user/register', method: 'post', data: {
          email: this.email,
          userName: this.userName,
          password: this.userPw1,
          passwordConfirm: this.userPw2,
        }})
        .then((result) => {
          if (result.data.success)
            this.$store.commit('setUserInfos', result.data.data);
            this.$router.push({ name: 'App' }).catch(() => {});
        })
        .catch((error) => {
          if (error.response.data.message)
            this.$toast.error(Array.isArray(error.response.data.message) ? error.response.data.message.join('\n') : error.response.data.message);
        })
      }
    },
    login() {
      if (this.$refs.loginForm.validate()) {
        this.$axios({ url: '/user/login', method: 'post', data: {
          email: this.email,
          password: this.userPw1,
        }})
        .then((result) => {
          if (result.data.success) {
            this.$store.commit('setUserInfos', result.data.data);
            this.$router.push({ name: 'App' }).catch(() => {});
          }
        })
        .catch((error) => {
          if (error.response.data.message)
            this.$toast.error(Array.isArray(error.response.data.message) ? error.response.data.message.join('\n') : error.response.data.message);
        });
      }
    }
  },
  components: {
    Footer,
  },
  mounted() {
    if (this.$route.params.app && this.$route.query.code) {
      if (this.$route.params.app === 'google') {
        this.$axios({ url: '/user/googleAuth', method: 'post', data: { code: this.$route.query.code }})
          .then((result) => {
            if (result.data.success) {
              this.$store.commit('setUserInfos', result.data.data);
              this.$router.push({ name: 'App' }).catch(() => {});
            } else
              this.$toas.error('Google authentication error');
          })
          .catch(() => {
            this.$toast.error('Google authentication error');
          })
      } else if (this.$route.params.app === 'discord') {
        console.log('discord');
      }
    }
  },
  beforeMount() {
    if (this.$store.state.userId) {
      this.$router.push({ name: 'App' }).catch(() => {});
    }
  }
}
</script>
