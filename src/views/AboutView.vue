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
            <strong>Cartographer</strong> is a platform-independent tool for linking the
            musical content of an <abbr title="Music Encoding Initiative">MEI</abbr> file
            to the corresponding regions on digital facsimiles. It lets editors draw and
            manage zones for measures and movements on page images (served locally or via
            <abbr title="International Image Interoperability Framework">IIIF</abbr>) and
            exports the resulting mapping back into MEI. Built from a single web-based
            codebase, it runs in any modern browser, as an institutionally hosted web
            service (Docker), or as a native desktop and Android application (via Tauri).
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

          <h6>Imprint</h6>
          <address class="imprint">
            <p>
              Paderborn University<br />
              Center for Music, Edition, Media (ZenMEM)<br />
              Warburger Str. 100<br />
              33098 Paderborn<br />
              Germany
            </p>
            <p>
              E-Mail:
              <a href="mailto:peter.stadler@uni-paderborn.de">peter.stadler@uni-paderborn.de</a>
            </p>
          </address>

          <div class="partnerLogos">
            <a href="https://zenmem.de" target="_blank" rel="noopener noreferrer" title="Zentrum Musik – Edition – Medien (ZenMEM)">
              <img :src="zenmemLogo" alt="ZenMEM logo" />
            </a>
            <a href="https://nfdi4culture.de" target="_blank" rel="noopener noreferrer" title="NFDI4Culture">
              <img :src="nfdiLogo" alt="NFDI4Culture logo" />
            </a>
          </div>

          <p class="license">
            Licensed under the
            <a href="https://github.com/Edirom/cartographer-app/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>.
          </p>

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

.aboutModal .content {
  text-align: left;

  p {
    line-height: 1.5;
  }

  h6 {
    margin-top: 1.25rem;
    margin-bottom: .5rem;
  }
}

.modal-title .version {
  color: #666666;
  font-size: .9rem;
  font-weight: normal;
}

.linkList {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin: .35rem 0;
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

.imprint {
  font-style: normal;

  p {
    margin: 0 0 .75rem;
  }

  a {
    color: $appColor;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.partnerLogos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: .75rem;

  a {
    display: inline-flex;
    transition: transform .1s ease-in-out;

    &:hover {
      transform: translateY(-2px);
    }
  }

  img {
    height: 44px;
    width: auto;
  }
}

.license {
  border-top: $thinBorder;
  margin-top: 1.25rem;
  padding-top: .75rem;
  color: #888888;
  font-size: .8rem;
}
</style>