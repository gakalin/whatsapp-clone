<template>
  <v-card flat class="d-flex">
    <v-card flat height="100vh" width="410px" color="white" class="rounded-0 row"> 
      
      <v-card flat width="100%" height="60" color="#EDEDED" class="px-4 py-3 d-flex justify-space-between rounded-0">
        <v-avatar size="38" class="rounded-circle">
          <img :src="this.$store.getters.getAvatar">
        </v-avatar>

        <div>
          <v-btn icon class="mr-4"><v-icon>mdi-message-text</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </div>
      </v-card>

      <v-card outlined width="100%" color="#F6F6F6" max-height="50" class="rounded-0" style="border-bottom: 1px solid #e2e0e0">
          <v-text-field class="py-1 px-3 rounded-xl" dense flat solo prepend-inner-icon="mdi-magnify" label="Search friends">
          </v-text-field>
      </v-card>

      <v-card flat class="rounded-0 msgPanel overflow-y-auto">
        <v-card color="grey lighten-3" flat class="rounded-0 pa-3 d-flex row" style="border-bottom: 1px solid #e2e0e0;">
          <v-avatar size="47" class="rounded-circle">
            <img src="../assets/blank_avatar.jpg">
          </v-avatar>

          <div class="msgCard column ml-5">
            <div class="d-flex justify-space-between">
              <h4>Gökberk Akalın</h4>
              <small>19:07</small>
            </div>

            <div class="d-flex row">
              <v-icon color="blue">mdi-check-all</v-icon>
              <span class="pl-1 subtitle-2 align-self-center d-inline-block text-truncate font-weight-light"> Yinelenen bir sayfa içeriğinin okuyucunun dikkatini dağıttığı bilinen bir gerçektir.</span>
            </div>
          </div>
        </v-card>

        <v-card flat class="rounded-0 pa-3 d-flex row" style="border-bottom: 1px solid #e2e0e0;">
          <v-avatar size="47" class="rounded-circle">
            <img src="../assets/blank_avatar.jpg">
          </v-avatar>

          <div class="msgCard column ml-5">
            <div class="d-flex justify-space-between">
              <h4>Test User</h4>
              <small>19:07</small>
            </div>

            <div class="d-flex row">
              <v-icon color="grey">mdi-check-all</v-icon>
              <span class="pl-1 subtitle-2 align-self-center d-inline-block text-truncate font-weight-light">message</span>
            </div>
          </div>          
        </v-card>
      </v-card>

    </v-card>

    <v-card flat height="100vh" width="100%" class="msgSide rounded-0 row">

      <v-card flat width="100%" height="60" color="#EDEDED" class="px-4 py-3 d-flex justify-space-between rounded-0" style="border-bottom: 1px solid #d3d3d3; border-left: 1px solid #d3d3d3;">
        <div class="d-flex">
          <v-avatar size="38" class="rounded-circle row">
            <img src="../assets/blank_avatar.jpg">
          </v-avatar>
          <h4 class="row align-self-center pl-3">Gökberk Akalın</h4>
        </div>
        <div>
          <v-btn icon class="mr-4"><v-icon>mdi-magnify</v-icon></v-btn>
          <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </div>
      </v-card>

      <v-card class="msgMain overflow-y-auto" flat color="transparent">
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
      </v-card>

      <v-footer color="#EDEDED" padless absolute fixed width="100%" class="rounded-0 ma-0 pa-0" style="border-top: 1px solid #d3d3d3;">
        <v-text-field clearable dense flat solo hide-details class="pa-3 row rounded-xl ma-0 pa-0" label="Type a message"></v-text-field>
      </v-footer>

    </v-card>

  </v-card>
</template>

<script>
export default {
  beforeMount() {
    if (!this.$store.state.userId) {
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>

<style>
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