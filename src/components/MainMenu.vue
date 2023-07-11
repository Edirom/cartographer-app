<template>
  <div class="dropdown">
    <a class="btn btn-action btn-sm dropdown-toggle" tabindex="1" title="menu" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
      <font-awesome-icon icon="fa-solid fa-bars"/>
      <!--<font-awesome-icon icon="fa-regular fa-images"/>-->
    </a >
    <ul class="menu mainMenu">
      <li class="divider" data-content="User"></li>

      <!--<li class="menu-item">
        <a href="#">
          <i class="icon icon-refresh"></i> Fetch updates
        </a>
      </li>
      <li class="menu-item">
        <a href="#">
          <i class="icon icon-upload"></i> Commit changes
        </a>
      </li>-->
      <li class="menu-item">
        <template v-if="isLoggedin">
          <p>Welcome! <b>{{ getOwner() }}</b></p>
      <button class="btn btn-action btn-sm" @click="logoutGithub" title="Github Logout">
        <font-awesome-icon icon="fa-solid fa-file-import"/>
      </button>
        Logout Github 
    </template>
    <template v-else>
      <button class="btn btn-action btn-sm" @click="loginGithub" title="Github Login">
        <font-awesome-icon icon="fa-solid fa-user"/>
      </button>
        Login Github
    </template>
    <li class="divider" data-content="Data"></li>
    <li class="menu-item">
        <template v-if="isLoggedin">
        <button  class="btn btn-action btn-sm"  @click="getDirectory"  title="Git Path">
          <font-awesome-icon class="fa-solid fa-user"/>
        </button>
        Git Path
      </template>
      </li>
    </li>
      <li class="menu-item">
      <button class="btn btn-action btn-sm" @click="commitGithub" title="Commit Github">
          <font-awesome-icon icon="fa-solid fa-code-commit"/>
      </button>
       Commit Github
      </li>
        <li class="menu-item">
        <button class="btn btn-action btn-sm" @click="importXML" title="load MEI file">
          <font-awesome-icon icon="fa-solid fa-file"/> 
        </button>
        Upload MEI File
      </li>
      <li class="menu-item">
        <button class="btn btn-action btn-sm" @click="importManifest" title="import IIIF Manifest">
          <font-awesome-icon icon="fa-solid fa-circle-arrow-down"/> 
        </button>
        Import IIIF Manifest
      </li>
      <li class="menu-item">
        <template v-if="downloadAvailable">
          <a class="btn btn-action btn-sm" :href="xmlDataUrl()" target="_blank" title="download MEI file" :download="xmlFilename">
            <font-awesome-icon icon="fa-solid fa-download"/>
          </a>
          Download MEI File
        </template>
        <template v-else>
          <a class="btn btn-action btn-sm" :href="xmlDataUrl()" target="_blank" title="download MEI file" disabled :download="xmlFilename">
            <font-awesome-icon icon="fa-solid fa-download"/>
          </a>
          Download MEI File
        </template>
      </li>
      <li class="divider" data-content="Actions"></li>
      <li class="menu-item">
        <button class="btn btn-action btn-sm" @click="showPagesModal" title="Show Page Overview">
          <font-awesome-icon icon="fa-regular fa-images"/>
        </button>
        Show Page Overview
      </li>
      <li class="menu-item">
        <button class="btn btn-action btn-sm" @click="toggleMeasureList" title="Toggle Measure List">
          <font-awesome-icon icon="fa-solid fa-list-ol"/>
        </button>
        Toggle Measure List
      </li>
      <template v-if="firstMeasureWithoutZone !== null">
        <li class="divider" data-content="Options"></li>
        <li class="menu-item" @click="toggleExistingMusicMode">
          <button class="btn btn-action btn-sm" title="Toggle Existing Music Mode">
            <font-awesome-icon icon="fa-solid fa-vector-square"/>
          </button>
          <span style="margin-left: .3rem;">
            <template v-if="existingMusicMode">Merge Mode On</template>
            <template v-else>Merge Mode Off</template>
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MainMenu',
  props: {
  },
  mounted () {

  },
  computed: {
    ...mapGetters({
      accessToken: 'accessToken',
      directories: 'directories',
      selectedDirectory: state => state.selectedDirectory // Define a getter function for selectedDirectory
    }),
    selectedDirectory: {
      set (val) {
        selectedDirectory: ''
      },
      get(){

      }
    },
    manifest: function () {
      return this.$store.getters.manifest
    },
    xmlFilename: function () {
      // TODO: Come up with better name, maybe generate from first title in file?!
      return 'meiFile.xml'
    },
    downloadAvailable: function () {
      return this.$store.getters.meiFileForDownload !== null
    },
    isLoggedin: function (){
      return this.$store.getters.getLoginStatus !== false
    },
    firstMeasureWithoutZone: function () {
      return this.$store.getters.firstMeasureWithoutZone
    },
    existingMusicMode: function () {
      return this.$store.getters.existingMusicMode
    },
    getUserName: function (){
      console.log("this is the log in data " + this.$store.getters.getUserName)
      return this.$store.getters.getUserName
    }
  },
  methods: {
    ...mapActions([
      'fetchDirectories',
    ]),
    importXML: function () {
      this.$store.dispatch('toggleLoadXMLModal')
    },
    loginGithub: function (){
      this.$store.dispatch('login')
    },
    logoutGithub: function (){
      this.$store.dispatch('logout')
    },
    commitGithub: function (){
      this.$store.dispatch('commitGithub')
    },
    getDirectory: function (){
      this.$store.dispatch('toggleLoadGitModal')
    },
    importManifest: function () {
      this.$store.dispatch('toggleLoadIIIFModal')
    },
    getUsername: function () {
      this.$store.state.username;
    },
    xmlDataUrl () {
      const xml = this.$store.getters.meiFileForDownload
      if (xml !== null) {
        return 'data:text/xml,' + encodeURIComponent(xml)
      }
      return '#'
    },
    toggleMeasureList () {
      this.$store.dispatch('toggleMeasureList')
    },
    showPagesModal () {
      this.$store.dispatch('togglePagesModal')
    },
    toggleExistingMusicMode: function () {
      if (this.firstMeasureWithoutZone !== null) {
        this.$store.dispatch('toggleExistingMusicMode')
      }
      },
      getOwner: function(){
        console.log(this.$store.getters.getOwner )
        return this.$store.state.owner

    }
  }
  // async handleLogin() {
  //     try {
  //       const { data } = await axios.post('/api/github/login');
  //       window.location = data.redirectUrl;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   async handleAuth() {
  //     const code = new URLSearchParams(window.location.search).get('code');
  //     if (code) {
  //       try {
  //         const { data } = await axios.post('/api/github/token', { code });
  //         this.$store.commit('setAccessToken', data.accessToken);
  //         this.fetchDirectories();
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   },
  //   async created() {
  //   await this.handleAuth();
  // }  

   }



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/css/_variables.scss';

// This will determine the width of the menu
$gitMenuOffset: -200px;

button {
  color: $fontColorDark;
  border-color: $fontColorDark;
  margin-left: .3rem;

  svg {
    position: relative;
    top: 1px;
  }
}

.customBtn.btn.btn-link {
   text-align: left;
   margin: 0;
   padding: 0;
   border: none;
}

.mainMenu {
  width: calc( abs($gitMenuOffset) + 33px);
  left: $gitMenuOffset !important;

  color: $fontColorDark;
  font-weight: 300;
  text-align: left;

  button, a {
    position: relative;
    top: -4px;
  }

  &.menu .menu-item > a {
    display: inline;
    margin: 0 0 0 0.3rem;
    height: 28px;
    padding: .15rem .3rem;
  }

  .icon {
    font-size: .7rem;
    position: relative;
    top: -1px;
    padding-right: 5px;
  }
}
</style>
