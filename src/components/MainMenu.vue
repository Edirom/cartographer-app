<template>
  <div class="dropdown">
    <button class="btn btn-action btn-sm dropdown-toggle" title="menu">
      <font-awesome-icon icon="fa-solid fa-bars"/>
      <!--<font-awesome-icon icon="fa-regular fa-images"/>-->
    </button>
    <ul class="menu mainMenu">
      <li class="divider" data-content="Data"></li>

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
        <button class="btn btn-action btn-sm" @click="importXML" title="load MEI file">
          <font-awesome-icon icon="fa-solid fa-file-import"/>
        </button>
        Upload MEI File
      </li>
      <li class="menu-item">
        <button class="btn btn-action btn-sm" @click="importManifest" title="import IIIF Manifest">
          <font-awesome-icon icon="fa-solid fa-cloud-arrow-down"/>
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
export default {
  name: 'MainMenu',
  props: {
  },
  mounted () {

  },
  computed: {
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
    firstMeasureWithoutZone: function () {
      return this.$store.getters.firstMeasureWithoutZone
    },
    existingMusicMode: function () {
      return this.$store.getters.existingMusicMode
    }
  },
  methods: {
    importXML: function () {
      this.$store.dispatch('toggleLoadXMLModal')
    },
    importManifest: function () {
      this.$store.dispatch('toggleLoadIIIFModal')
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
    }
  }
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
