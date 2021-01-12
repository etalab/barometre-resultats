<template>
  <div>
    <div
      v-show="!isLoading"
      >

      <!-- text | brief if isBrief === true -->
      <div
        v-if="!showMore"
        :class="`${!fromKpiTable && isBrief ? 'mb-3' :'' }`"
        >
        <span 
          v-html="htmlText"
          class="no-pointer"
        />
        <a v-if="isBrief && !showMore"
          class="text-primary text-decoration-underline"
          @click="toggleShowMore(true)"
          >
          {{ readMore[locale] }}
        </a>
      </div>
      
      <!-- full text -->
      <div
        v-if="showMore"
        class="mb-3"
        >
        <span 
          v-html="rawHtml"
        />
        <a v-if="isBrief && showMore"
          class="text-primary text-decoration-underline"
          @click="toggleShowMore(false)"
          >
          {{ readLess[locale] }}
        </a>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import axios from 'axios'

export default {
  name: 'RawHtml',

  props: [
    'templateURL',
    'isBrief',
    'fromKpiTable',
    'isModal',
    'mobileShowMore'
  ],

  data: () => {
    return {
      rawHtml: '',
      errorRawHtml: '-',
      isLoading: false,
      // errorRawHtml : '<br><br>there was an <strong> error </strong> getting the distant html<br><br>',
      head: {
        // baseURL: "https://raw.githubusercontent.com/",
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          accept: 'text/html',
        },
      },
      readMore: {
        fr: 'Lire plus'
      },
      readLess: {
        fr: 'Réduire'
      },
      showMore: false,
    }
  },

  watch: {
    isRouteLoading (next, prev) {
      this.isLoading = true
    },

    templateURL(next, prev) {
      this.getRawHtml(next)
    },
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      isRouteLoading: (state) => state.isRouteLoading,
    }),
    htmlText () {
      // this.log && console.log('C-RawHtml / htmlText / this.rawHtml : ', this.rawHtml)
      let rawHtml = this.rawHtml
      if (this.isBrief && rawHtml !== '') {
        let parser = new DOMParser()
        const html = parser.parseFromString(rawHtml, 'text/html')
        // this.log && console.log('C-RawHtml / htmlText / html : ', html)
        var brief = html.getElementById('brief')
        // this.log && console.log('C-RawHtml / htmlText / brief.innerHTML : ', brief.innerHTML)
        rawHtml = brief ? `${brief.innerHTML}` : rawHtml
        // this.log && console.log('C-RawHtml / htmlText / rawHtml : ', rawHtml)
      }
      return rawHtml
    },
    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },

  mounted() {
    // this.log && console.log('\nC-RawHtml / mounted... ')
    // this.log && console.log('\nC-RawHtml / mounted / this.isBrief : ', this.isBrief)

    // here we go fetch the raw HTML content of a webpage
    let templateUrl = this.templateURL ? this.templateURL : ''
    // this.log && console.log('C-RawHtml / mounted / templateUrl : ', templateUrl)

    this.getRawHtml(templateUrl)
    // if (this.isBrief) {
    //   this.log && console.log('\nC-RawHtml / getRawHtml / this.rawHtml : ', this.rawHtml)
    // }

    if (this.isMobileWidth && !this.fromKpiTable) {
      this.showMore = this.mobileShowMore
    }
    this.$store.commit('toggleTriggerComponentLoaded')

  },

  methods: {
    toggleShowMore(value) {
      if (this.fromKpiTable && this.isModal ) {
        this.$emit('toggleModal', true)
      } else {
        this.showMore = value
      }
    },
    getRawHtml(templateUrl) {
      // let raw_html = ""
      this.isLoading = true
      // this.log && console.log('C-RawHtml / getRawHtml / this.isBrief : ', this.isBrief)

      if (templateUrl && templateUrl != '') {
        axios
          .get(templateUrl, this.head)
          .then((response) => {
            this.rawHtml =
              response && response.data
                ? response.data
                : '<br><br>there is an Error <br><br>'
            // if (this.isBrief) {
            //   this.log && console.log('C-RawHtml / getRawHtml / this.rawHtml : ', this.rawHtml)
            // }
            this.isLoading = false
          })
          .catch((err) => {
            console.log(err)
            this.rawHtml = this.errorRawHtml
          })
      }
    },
  },
}
</script>
