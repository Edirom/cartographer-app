<template>
  <div class="modal active aboutModal">
    <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
        <div class="modal-title h5">
          Cartographer<span v-if="appVersion" class="version"> · v{{ appVersion }}</span>
        </div>
      </div>
      <div class="modal-body">
        <div class="content">

          <p>
            <strong>Cartographer</strong> is a browser-based tool for linking the musical
            content of an <abbr title="Music Encoding Initiative">MEI</abbr> file to the
            corresponding regions on digital facsimiles. It lets editors draw and manage
            zones for measures and movements on page images (served locally or via
            <abbr title="International Image Interoperability Framework">IIIF</abbr>) and
            exports the resulting mapping back into MEI.
          </p>

          <h6>Resources</h6>
          <ul class="linkList">
            <li>
              <a href="https://github.com/Edirom/cartographer-app" target="_blank" rel="noopener noreferrer">
                <font-awesome-icon icon="fa-solid fa-terminal" /> Source code on GitHub
              </a>
            </li>
            <li>
              <a href="https://github.com/Edirom/cartographer-app/issues" target="_blank" rel="noopener noreferrer">
                <font-awesome-icon icon="fa-solid fa-file" /> Report an issue
              </a>
            </li>
            <li>
              <a href="https://music-encoding.org" target="_blank" rel="noopener noreferrer">
                <font-awesome-icon icon="fa-solid fa-sitemap" /> Music Encoding Initiative
              </a>
            </li>
          </ul>

          <h6>Funding &amp; Partners</h6>
          <div class="partnerLogos">
            <a href="https://zenmem.de" target="_blank" rel="noopener noreferrer" title="Zentrum Musik – Edition – Medien (ZenMEM)">
              <img :src="zenmemLogo" alt="ZenMEM logo" />
            </a>
            <a href="https://nfdi4culture.de" target="_blank" rel="noopener noreferrer" title="NFDI4Culture">
              <img :src="nfdiLogo" alt="NFDI4Culture logo" />
            </a>
          </div>

        </div>
      </div>
      <div class="modal-footer">
        <a class="btn btn-link" href="#close" @click="closeModal">Close</a>
      </div>
    </div>
  </div>
</template>

<script>
import zenmemLogo from '@/assets/logos/zenmem_logo_de_einfarbig_ultrablau.png'
import nfdiLogo from '@/assets/logos/NFDI4C_Logo_DyptichText.png'

export default {
  name: 'AboutModal',
  components: {

  },
  data () {
    return {
      zenmemLogo,
      nfdiLogo
    }
  },
  computed: {
    appVersion () {
      return process.env.VUE_APP_VERSION || ''
    }
  },
  methods: {
    closeModal: function () {
      this.$store.dispatch('toggleAboutModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.aboutModal {
  .modal-container {
    max-width: 480px;
    text-align: left;
  }

  .modal-title .version {
    color: #999999;
    font-weight: 400;
    font-size: .8rem;
  }

  .modal-body {
    padding: 0 .8rem;
  }

  .modal-footer {
    padding: 0 .8rem .8rem;
  }

  .content {
    font-size: .8rem;

    p {
      line-height: 1.5;
    }

    h6 {
      margin: 1rem 0 .4rem;
    }
  }

  .linkList {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin: .3rem 0;
    }

    a {
      color: $appColor;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      svg {
        margin-right: .4rem;
      }
    }
  }

  .partnerLogos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: .4rem;

    a {
      display: inline-flex;
      transition: transform .1s ease-in-out;

      &:hover {
        transform: translateY(-2px);
      }
    }

    img {
      height: 40px;
      width: auto;
    }
  }
}
</style>
