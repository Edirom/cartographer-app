<template>
  <div class="about">
    <div class="aboutInner">

      <header class="aboutHeader">
        <router-link to="/" class="backLink" title="Back to the application">
          <font-awesome-icon icon="fa-solid fa-angle-left" /> Back to Cartographer
        </router-link>
        <h1>Cartographer</h1>
        <p class="version" v-if="appVersion">Version {{ appVersion }}</p>
      </header>

      <section class="aboutSection">
        <p>
          <strong>Cartographer</strong> is a browser-based tool for linking the musical
          content of an <abbr title="Music Encoding Initiative">MEI</abbr> file to the
          corresponding regions on digital facsimiles. It lets editors draw and manage
          zones for measures and movements on page images (served locally or via
          <abbr title="International Image Interoperability Framework">IIIF</abbr>) and
          exports the resulting mapping back into MEI.
        </p>
      </section>

      <section class="aboutSection">
        <h2>Resources</h2>
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
      </section>

      <section class="aboutSection">
        <h2>Funding &amp; Partners</h2>
        <p>
          Cartographer is developed within the Edirom context and supported by the
          following institutions and infrastructures.
        </p>
        <div class="partnerLogos">
          <a href="https://zenmem.de" target="_blank" rel="noopener noreferrer" title="Zentrum Musik – Edition – Medien (ZenMEM)">
            <img :src="zenmemLogo" alt="ZenMEM logo" />
          </a>
          <a href="https://nfdi4culture.de" target="_blank" rel="noopener noreferrer" title="NFDI4Culture">
            <img :src="nfdiLogo" alt="NFDI4Culture logo" />
          </a>
        </div>
      </section>

      <footer class="aboutFooter">
        <p>Licensed under the terms described in the project repository.</p>
      </footer>

    </div>
  </div>
</template>

<script>
import zenmemLogo from '@/assets/logos/zenmem.svg'
import nfdiLogo from '@/assets/logos/nfdi4culture.svg'

export default {
  name: 'AboutView',
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/_variables.scss';

.about {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background-color: #f7f8fa;
  color: $fontColorDark;
  overflow-y: auto;
  text-align: left;
}

.aboutInner {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  box-sizing: border-box;
}

.aboutHeader {
  border-bottom: $thickBorder;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;

  .backLink {
    display: inline-block;
    margin-bottom: 1rem;
    color: $appColor;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  h1 {
    margin: 0;
    color: $appColor;
  }

  .version {
    margin: .2rem 0 0;
    color: #666666;
    font-size: .9rem;
  }
}

.aboutSection {
  margin-bottom: 1.75rem;

  h2 {
    font-size: 1.1rem;
    margin-bottom: .5rem;
  }

  p {
    line-height: 1.5;
  }
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

.aboutFooter {
  border-top: $thinBorder;
  padding-top: 1rem;
  color: #888888;
  font-size: .8rem;
}
</style>
