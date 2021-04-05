<template>
  <v-card flat class="d-flex">
    <v-card flat height="100vh" width="410px" color="white" class="rounded-0"> 
      
      <v-card flat width="100%" height="60" color="#EDEDED" class="px-4 py-3 d-flex justify-space-between rounded-0">
        <v-avatar @click.stop="showMenu('Profile')" size="38" class="rounded-circle">
          <img :src="this.$store.getters.avatar">
        </v-avatar>

        <div>
          <v-btn @click="showMenu('Notifications')" icon class="mr-4" :class="{ notificationGreen : this.$store.getters.notificationCount > 0 }"><v-icon>mdi-message-text</v-icon><small class="notificationBtn" v-if="this.$store.getters.notificationCount > 0">{{ this.$store.getters.notificationCount }}</small></v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </template>
            <v-list dense flat>
              <v-list-item-group color="primary">
                <v-list-item @click="showMenu('Online')">Online List</v-list-item>
                <v-list-item @click="showMenu('Friends')">Friends</v-list-item>
                <v-list-item @click="showMenu('Profile')">Profile</v-list-item>
                <v-list-item @click="logout()">Logout</v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </div>
      </v-card>

      <v-card outlined width="100%" color="#F6F6F6" max-height="50" class="rounded-0" style="border-bottom: 1px solid #e2e0e0">
          <v-text-field class="py-1 px-3 rounded-xl" dense flat solo prepend-inner-icon="mdi-magnify" label="Search friends">
          </v-text-field>
      </v-card>

      <v-card flat class="rounded-0 msgPanel overflow-y-auto">
        <v-card color="grey lighten-3" flat class="rounded-0 pa-3 d-flex" style="border-bottom: 1px solid #e2e0e0;">
          <v-avatar size="47" class="rounded-circle">
            <img src="../assets/blank_avatar.jpg">
          </v-avatar>

          <div class="msgCard column ml-5">
            <div class="d-flex justify-space-between">
              <h4>Gökberk Akalın</h4>
              <small>19:07</small>
            </div>

            <div class="d-flex">
              <v-icon color="blue">mdi-check-all</v-icon>
              <span class="pl-1 subtitle-2 align-self-center d-inline-block text-truncate font-weight-light"> Yinelenen bir sayfa içeriğinin okuyucunun dikkatini dağıttığı bilinen bir gerçektir.</span>
            </div>
          </div>
        </v-card>

        <v-card flat class="rounded-0 pa-3 d-flex" style="border-bottom: 1px solid #e2e0e0;">
          <v-avatar size="47" class="rounded-circle">
            <img src="../assets/blank_avatar.jpg">
          </v-avatar>

          <div class="msgCard column ml-5">
            <div class="d-flex justify-space-between">
              <h4>Test User</h4>
              <small>19:07</small>
            </div>

            <div class="d-flex">
              <v-icon color="grey">mdi-check-all</v-icon>
              <span class="pl-1 subtitle-2 align-self-center d-inline-block text-truncate font-weight-light">message</span>
            </div>
          </div>          
        </v-card>
      </v-card>

    </v-card>

    <v-card flat height="100vh" width="100%" class="msgSide rounded-0">

      <v-card flat width="100%" height="60" color="#EDEDED" class="px-4 py-3 d-flex justify-space-between rounded-0" style="border-bottom: 1px solid #d3d3d3; border-left: 1px solid #d3d3d3;">
        <div class="d-flex">
          <v-avatar size="38" class="rounded-circle">
            <img src="../assets/blank_avatar.jpg">
          </v-avatar>
          <h4 class="align-self-center pl-3">Gökberk Akalın</h4>
        </div>
        <div>
          <v-btn icon class="mr-4"><v-icon>mdi-magnify</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </div>
      </v-card>

      <v-card class="msgMain overflow-y-auto flex" flat color="transparent">
        <v-card class="pa-2 d-flex justify-start" color="transparent" flat>
          <div>
            <span>Yinelenen bir sayfa içeriğinin okuyucunun dikkatini dağıttığı bilinen bir gerçektir. Lorem Ipsum kullanmanın amacı, sürekli 'buraya metin gelecek, buraya metin gelecek' yazmaya kıyasla daha dengeli bir harf dağılımı sağlayarak okunurluğu artırmasıdır. Şu anda birçok masaüstü yayıncılık paketi ve web sayfa düzenleyicisi, varsayılan mıgır metinler olarak Lorem Ipsum kullanmaktadır. Ayrıca arama motorlarında 'lorem ipsum' anahtar sözcükleri ile arama yapıldığında henüz tasarım aşamasında olan çok sayıda site listelenir. Yıllar içinde, bazen kazara, bazen bilinçli olarak (örneğin mizah katılarak), çeşitli sürümleri geliştirilmiştir.
            </span>
            <span class="date">19:30</span>
          </div>
        </v-card>
        <v-card right class="me pa-2 d-flex justify-end" color="transparent" flat>
          <div>
            <span>test</span>
            <span class="date">22:00</span>
          </div>
        </v-card>
        <v-card right class="me pa-2 d-flex justify-end" color="transparent" flat>
          <div>
            <span>avadfasd fasdf456as d4f65asd4f65asd4f6</span>
            <span class="date">22:00</span>
          </div>
        </v-card>
      </v-card>

      <v-footer color="#EDEDED" padless absolute fixed width="100%" class="rounded-0 ma-0 pa-0" style="border-top: 1px solid #d3d3d3;">
        <v-text-field clearable dense flat solo hide-details class="pa-3 rounded-xl ma-0 pa-0" label="Type a message"></v-text-field>
      </v-footer>

    </v-card>

    <v-navigation-drawer width="410px" v-model="drawer" absolute temporary>
      <v-card flat class="rounded-0" color="#00BFA5" height="110px">
        <v-card flat class="rounded-0" color="#00BFA5" height="62px"></v-card>

        <v-card dark flat class="pl-4 pb-2 rounded-0" color="#00BFA5">
          <v-btn class="mr-4" @click.stop="drawer = !drawer" icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="subtitle-1" v-html="menu"></span>
        </v-card>

        <div v-if="menu === 'Profile'">
          <v-card flat class="rounded-0 py-7 text-center" color="#EDEDED" height="260px">
            <v-avatar size="150" class="rounded-circle">
              <img :src="this.$store.getters.avatar">
            </v-avatar>
            <v-form class="d-flex justify-content-between px-15" @submit.prevent="changeAvatar()" lazy-validation ref="avatarForm" v-model="avatarValid">
              <v-file-input v-model="userAvatar" show-size :rules="avatarRules" accept="image/png, image/jpeg" placeholder="Pick an avatar" prepend-icon="mdi-camera"></v-file-input>
              <v-btn type="submit" class="align-self-center" dense inline icon><v-icon>mdi-refresh</v-icon></v-btn>
            </v-form>
            
          </v-card>
          <v-card class="px-8 py-4 rounded-0" height="90px">
            <span style="color: #00BFA5;">Your Name</span>
            <v-form @submit.prevent="changeName()" lazy-validation ref="userNameForm" v-model="userNameValid">
              <v-text-field :counter="30" v-model="userName" :rules="userNameRules" dense append-outer-icon="mdi-pencil"></v-text-field>
            </v-form>
          </v-card>
        </div>

        <div v-if="menu == 'Online'">
          <v-card flat outlined class="rounded-0" v-for="(val, index) in this.$store.getters.onlineList" :key="index">
            <div class="d-flex justify-space-between px-5">
              <span class="align-self-center"><v-icon color="green">mdi-account</v-icon> {{ val.userName }}</span>
                <v-btn @click="addFriend({ userId: val._id, socketId: val.socketId })" class="justify-content-end" icon v-if="!isMyFriend(val._id)"><v-icon>mdi-account-plus</v-icon></v-btn>
                <v-btn @click="sendMsg(val._id)" class="justify-content-end" icon v-if="isMyFriend(val._id)"><v-icon>mdi-message-text</v-icon></v-btn>
            </div>
          </v-card>
        </div>

        <div v-if="menu == 'Notifications'">
          <v-card class="pa-2 rounded-0" v-for="(val, index) in this.$store.getters.notifications" :key="index">
            <div class="d-flex justify-space-between" v-if="val.type == 'friend_request'">
              <span class="align-self-center"><strong>{{ val.name }}</strong> want to be your friend!</span>
              <span>
                <v-btn icon @click="acceptFriendRequest(val.id)"><v-icon>mdi-account-check</v-icon></v-btn>
                <v-btn icon @click="declineFriendRequest(val.id)"><v-icon>mdi-account-cancel</v-icon></v-btn>
              </span>
            </div>
          </v-card>
        </div>

        <div v-if="menu == 'Friends'">

          <v-card elevation="0" class="pa-2 d-flex justify-space-between rounded-0" >
            <v-btn @click="this.$store.commit.filterFriends(1)" text small color="green">
              <v-icon>mdi-account</v-icon> Online
            </v-btn>
            <v-btn @click="this.$store.commit.filterFriends(2)" text small color="grey">
              <v-icon>mdi-account</v-icon> Offline
            </v-btn>
            <v-btn @click="this.$store.commit.filterFriends(3)" text small color="grey darken-3">
              <v-icon>mdi-account</v-icon> All
            </v-btn>
          </v-card>

          <v-card flat class="py-1 rounded-0" v-for="(val, index) in this.$store.state.friendsFiltered" :key="index">
            <div class="friend d-flex justify-space-between">
              <span class="friendListText align-self-center"><v-icon :class="{ notificationGreen: val.isOnline == true }">mdi-account</v-icon> {{ val.userName }}</span>
              <span>
                <v-btn icon @click="sendMsg(val._id)"><v-icon>mdi-message-text</v-icon></v-btn>
                <v-btn icon @click="removeFriend(val._id)"><v-icon>mdi-account-cancel</v-icon></v-btn>
              </span>
            </div>
          </v-card>

        </div>  

      </v-card>

    </v-navigation-drawer>

  </v-card>
</template>


<style scoped>
.friend {
  border-bottom: 1px solid #c5c9c6!important;
  padding: 2px;
}
.friendListText {
  font-size: 0.95rem;
}
.notificationGreen {
  color: #0cab2c!important;
}
.notificationBtn {
  position: absolute;
  left: 27px;
  top: -4px;
  font-size: 0.7rem;
  font-weight: bold;
}
.msgMain .v-card div span.date {
  font-size: 0.75rem;
  color: #9b9b9b;
  padding-right: 5px;
  text-indent: 10px;
  float: right;
}
.msgMain .v-card.me div {
  background: #DCF8C6;
}
.msgMain .v-card div {
  font-size: 0.90rem;
  line-height: 1.20rem;
  background: #FFF;
  padding: 5px 10px;
  border-radius: 50px;
  -webkit-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.18);
  -moz-box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.18);
  box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.18);
  max-width: 500px;
}
.msgMain .v-card {
  padding: 0 50px !important;
  margin-bottom: 2px;
}
.msgMain {
  margin-top: 5px;
  height: calc(100vh - 135px);
}
.msgSide {
  background: url('../assets/wp_bg.jpg') repeat center center fixed !important;
  background-size: cover;
}
.msgCard {
  width: calc(100% - 80px);
}
.msgCard small {
  color: #939393;
}
.msgPanel {
  max-height: calc(100vh - 110px);
}
</style>

<script>
export default {
  data: () => ({
    drawer: null,
    menu: null,
    userName: null,
    userNameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 30) || 'Name must be less than 30 characters',
      v => (v && v.length >= 2) || 'Name must be longer than 2 characters',
    ],
    userNameValid: true,
    avatarRules: [
      v => !!v || 'Avatar is required',
      v => !v || v.size < 2000000 || 'Avatar size should be less than 2MB',
    ],
    avatarValid: false,
    userAvatar: null,
  }),
  methods: {
    removeFriend(id) {
      this.$store.dispatch('removeFriend', id);
    },
    acceptFriendRequest(id) {
      this.$store.dispatch('acceptFriendRequest', id);
    },
    declineFriendRequest(id) {
      this.$store.dispatch('declineFriendRequest', id);
    },
    addFriend(to) {
      this.$store.dispatch('updateSocketId');
      this.$store.dispatch('addFriend', to);
    },
    sendMsg(id) {
      console.log('send msg', id);
    },
    isMyFriend(id) {
      return this.$store.state.userFriends.find(u => u === id);
    },
    logout() {
      this.$store.dispatch('logout');
    },
    showMenu(type) {
      if (type === 'Profile' && this.$store.state.userName) {
        this.userName = this.$store.state.userName;
      }
      if (type === 'Notifications') {
        this.$store.dispatch('readAllNotifications');
      }
      if (type === 'Friends') {
        this.$store.commit('getFriends');
      }
      this.drawer = !this.drawer;
      this.menu = type;
    },
    changeName() {
      if (this.$refs.userNameForm.validate()) {
        this.$store.dispatch('changeName', this.userName);
      }
    },
    changeAvatar() {
      if (this.$refs.avatarForm.validate()) {
        let formData = new FormData();
        formData.append('file', this.userAvatar);
        this.userAvatar = null;
        this.$store.dispatch('changeAvatar', formData);
      }
    }
  },
  beforeMount() {
    if (!this.$store.state.userId) {
      this.$router.push({ name: 'Login' }).catch(() => {});
    } else {
      this.$store.dispatch('updateSocketId');
    }
    /*if (this.$store.state.userName) {
      this.userName = this.$store.state.userName;
    }*/
  }
}
</script>
