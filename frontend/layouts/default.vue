<style scoped>
body {
  padding-top: constant(safe-area-inset-top); /* iOS 11.0 */
  padding-top: env(safe-area-inset-top); /* iOS 11.2 */
}
.no-scroll{
  overflow: hidden;
}

.loader-text-animation-A {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #000, #fff, #000);
  background-repeat: no-repeat;
  background-size: 80%;
  animation: animate 3s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: rgba(255, 255, 255, 0);
}

@keyframes animate {
  0% {
    background-position: -500%;
  }
  100% {
    background-position: 500%;
  }
}

.loader-text-animation-B-1 {
  animation: w1anim 2s infinite;
}
.loader-text-animation-B-2 {
  animation: w2anim 2.5s infinite;
}

@keyframes w1anim {
  0%{
    opacity: 0;
  }
  20%{
    opacity: 1;
  }
  80% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

@keyframes w2anim {
  0%{
    opacity: 0;
  }
  25%{
    opacity: 1;
  }
  50%{
    opacity: 0;
  }
  75% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

</style>

<template>
  <v-app
    id="ODAMAP-root"
    :class="`${isIframe && browser && browser.isFirefox ? 'hide-scrollbar' :  ''}`"
    :style="`${isIframe ? 'overflow:hidden;' : ''}`"	
    >
    <!-- :style="`${isIframe ? 'overflow:hidden;' : ''}`" -->
    <!-- :style="`${isIframe && routeConfig.forceHeightIfIframe ? '' : 'overflow:hidden;' } `" -->
    <!-- max-height:${layoutHeight}px; -->
    <!-- :style="`overflow: hidden;`" -->

    <!-- DYNAMIC CSS -->
    <DynamicCSS />

    <!-- LEFT DRAWER -->
    <Drawer v-if="routeDrawer" />

    <!-- NAVBAR -->
    <Navbar v-if="!isIframe" />

    <div
      v-show="readyStateComplete && !isRouteLoading"
      >

      <!-- TABS ROUTES -->
      <TabsRoutes v-if="!routeConfig.noRouteTabs && routesTabs && routesTabs.isActivated" />

      <!-- CONTENT LAYOUT -->
      <v-main
        id="ODAMAP-layout-content"
        class="ma-0 pa-0"
        :style="`${ isMobileWidth ? '' : 'height:' + layoutHeight + 'px;' } padding: 0 0 0 0;'`"
        >

        <!-- <Filters /> -->
        <!-- <FiltersFeedback/> -->

        <v-container 
          id="ODAMAP-layout-container"
          fluid
          pa-0
          >
          <nuxt />
        </v-container>
      </v-main>
    </div>

    <!-- isRouteLoading: <code>{{isRouteLoading}}</code> -->
    <v-main
      v-show="!readyStateComplete || isRouteLoading"
      >
      <v-container 
        fill-height fluid
        >
        <v-row
          align="center"
          justify="center"
          >
          <v-col class="text-center">

            <h3 class="mt-5 loader-text-animation-B-1">
              {{ appTitle[locale] }}
            </h3>

            <p class="mt-3 loader-text-animation-B-2">
              {{ loadingText[locale] }}
            </p>

          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- RIGHT DRAWER -->
    <!-- 
      <v-navigation-drawer
        v-model="rightDrawer"
        :right="right"
        temporary
        fixed
        >
        <v-list>
          <v-list-item @click.native="right = !right">
            <v-list-item-action>
              <v-icon light>
                icon-repeat
              </v-icon>
            </v-list-item-action>
            <v-list-item-title>Switch drawer (click me) </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer> 
    -->
    
    <!-- FOOTER -->
    <!-- <Footer/> -->

    <!-- NAVBARFOOTER -->
    <NavbarFooter
      v-if="routeNavbarFooter && routeNavbarFooter.activated"
      :settings="routeNavbarFooter.settings"
    />
  </v-app>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { detectBrowser } from '~/utils/utils.js'

// import DynamicCSS from '~/components/UI/DynamicCSS.vue'

// import Navbar from '~/components/UX/Navbar.vue'
// import Drawer from '~/components/UX/Drawer.vue'
// import Filters from '~/components/DataViews/Filters.vue'
// import FiltersFeedback from '~/components/DataViews/FiltersFeedback.vue'
// import Footer from '~/components/UX/Footer.vue'
// import NavbarFooter from '~/components/UX/NavbarFooter.vue'
// import TabsRoutes from '~/components/UX/TabsRoutes.vue'

// const Navbar = () => import(/* webpackChunkName: "popup" */ './UX/Navbar.vue')
// const Drawer = () => import(/* webpackChunkName: "popup" */ './UX/Drawer.vue')
// const Filters = () => import(/* webpackChunkName: "popup" */ './DataViews/Filters.vue')
// const FiltersFeedback = () => import(/* webpackChunkName: "popup" */ './DataViews/FiltersFeedback.vue')
// const Footer = () => import(/* webpackChunkName: "popup" */ './UX/Footer.vue')
// const NavbarFooter = () => import(/* webpackChunkName: "popup" */ './UX/NavbarFooter.vue')
// const TabsRoutes = () => import(/* webpackChunkName: "popup" */ './UX/TabsRoutes.vue')

export default {
  components: {

    DynamicCSS: () => import('@/components/UI/DynamicCSS.vue'),
    Navbar: () => import('@/components/UX/Navbar.vue'),
    Drawer: () => import('@/components/UX/Drawer.vue'),
    Filters: () => import('@/components/DataViews/Filters.vue'),
    FiltersFeedback: () => import('@/components/DataViews/FiltersFeedback.vue'),
    Footer: () => import('@/components/UX/Footer.vue'),
    NavbarFooter: () => import('@/components/UX/NavbarFooter.vue'),
    TabsRoutes: () => import('@/components/UX/TabsRoutes.vue'),

  },

  data() {
    return {
      readyStateComplete: true,
      // isRouteLoading: true,
      layoutHeight: undefined,
      loadingText: {
        fr : 'chargement des données'
      },
      browser:  undefined,
      resizeIndex: 0,
      userParams: {
        kpifamilies : '',
        datasetid : '',
        value : ''
      }
    }
  },

  watch: {
    triggerResize (next, prev) {
      this.handleResize()
    },
    triggerResizeNoScroll (next, prev) {
      this.handleResize(true)
    },
    triggerComponentsLoaded (next, prev) {
      this.handleResize()
    },
    routeParams(){
      this.handleRouteChange()
    }
  },

  beforeMount() {
    // this.log && console.log("\n", ". ".repeat(20))
    // this.log && console.log("L-default / beforeMount ...")

    // this.log && console.log("L-default / beforeMount / window : ", window )
    // this.log && console.log("L-default / beforeMount / document : ", document )
    // this.log && console.log("L-default / beforeMount / navigator : ", navigator )
    this.browser = detectBrowser(window, document, navigator)
    // this.log && console.log("L-default / beforeMount / this.browser : ", this.browser )

    // NOT WORKING IN SPA MODE !!!
    // cf : ref on stackoverflow...
    // this.log &&
    //   console.log(
    //     "L-default / beforeMount / this.vuetifyThemeIsSet :",
    //     this.vuetifyThemeIsSet
    //   )
    // if (!this.vuetifyThemeIsSet) {
    //   this.log &&
    //     console.log("L-default / beforeMount / this.configUI :", this.configUI)

    //   let isDarkTheme = this.configUI.isDarkTheme
    //   let themes = this.configUI.themes
    //   this.log &&
    //     console.log(
    //       "L-default / beforeMount / this.$vuetify.theme :",
    //       this.$vuetify.theme
    //     )
    //   this.$vuetify.theme.primary = this.configUI.themes.light.primary
    //   this.$vuetify.theme = {
    //     dark: isDarkTheme,
    //     themes: themes,
    //   }
    // this.$store.commit("configs/setVuetifyThemeIsSet")
    // }
  },

  // head() {
  //   // let global = this.globalConfig

  //   return {
  //     // title: global.app_title.content,
  //     // meta: [

  //     // ],
  //     link: [
  //       // { rel: 'icon', type: 'image/x-icon', href: global.app_favicon.url },
  //       // { rel: 'icon', href: global.app_favicon.url, sizes: '32x32' },
  //     ],
  //   }
  // },

  created() {
    // this.log && console.log("L-default / created ...")
    window.addEventListener('resize', this.handleResize)
    if (this.isIframe) {
      document.addEventListener('contextmenu', function(e){
        e.preventDefault()
      })
    }

  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
    if (this.isIframe) {
      document.removeEventListener('contextmenu', function(e){
        e.preventDefault()
      })
    }
  },

  mounted() {
    // console.log('L-default / mounted...')
    // console.log('L-default / mounted / document : ', document)
    // document.onreadystatechange = () => {
      // console.log('L-default / mounted / document.readyState : ', document.readyState)
      // if (document.readyState == 'complete') {
        // console.log('L-default / Page completed with image and files!')
        // this.readyStateComplete = true
    //   }
    // }
    this.handleResize()
    this.handleRouteChange()
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      appTitle: (state) => state.appTitle,
      isIframe: (state) => state.isIframe,
      configUX: (state) => state.configUX,
      isRouteLoading: (state) => state.isRouteLoading,

      triggerResize: (state) => state.triggerResize,
      triggerResizeNoScroll: (state) => state.triggerResizeNoScroll,
      triggerComponentsLoaded: (state) => state.triggerComponentsLoaded,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      defaultOdamapHeight: (state) => state.defaultOdamapHeight,
      // vuetifyThemeIsSet: (state) => state.configs.vuetifyThemeIsSet,
      // configUI: (state) => state.configUI,
      routeParams: (state) => state.routeParams,


      // navbarHeight: (state) => state.navbar.height,
      // windowSize: (state) => state.windowSize,
    }),

    ...mapGetters({
      // getCurrentLocale: 'getCurrentLocale',
      routesTabs: 'getRoutesTabs',
      routeConfig: 'getLocalRouteConfig',
      // getCurrentNavbarFooter: 'getCurrentNavbarFooter',
    }),

    routeNavbarFooter() {
      let routeConf = this.routeConfig
      return routeConf && routeConf.navbarFooter
    },

    routeDrawer() {
      let configUX = this.configUX
      return configUX.hasDrawer
    },

    windowHeight() {
      let winHeight = window.innerHeight
      return winHeight
    },

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },

  methods: {
    handleResize(noScroll = false) {
      // send iframe height to parent if isIframe
      // let iframeHeight = this.contentWindowHeight
      // this.log && console.log('L-default / handleResize / iframeHeight : ', iframeHeight)
      // this.log && console.log('L-default / handleResize / this.isIframe : ', this.isIframe)
      this.contentWindowHeight()
      if (this.isIframe) {
        this.sendPostMessage(noScroll)
      }
    },
    contentWindowHeight() {
      // check if forceFullHeight is needed
      // console.log('\nL-default / contentWindowHeight / this.routeConfig : ', this.routeConfig)
      const forceFullHeight = this.isIframe // || this.isMobileWidth // && this.routeConfig.forceHeightIfIframe
      // console.log('L-default / contentWindowHeight / forceFullHeight : ', forceFullHeight)
      
      // check if overrideIframeMaxHeight is precised
      const overrideIframeMaxHeight = this.configUX.overrideIframeMaxHeight
      // console.log('L-default / contentWindowHeight / overrideIframeMaxHeight : ', overrideIframeMaxHeight)

      let winHeight = window.innerHeight

      // console.log("L-default / contentWindowHeight ... window : ", window )
      // console.log("L-default / contentWindowHeight ... document : ", document )
      let ODAMAP_height = document.getElementById('ODAMAP-root') ? document.getElementById('ODAMAP-root').clientHeight : undefined 
      // console.log("L-default / contentWindowHeight ... ODAMAP_height : ", ODAMAP_height )
      
      let height

      if (forceFullHeight) {

        // let iframe = window.top.document //.find("#iframe")
        // console.log("L-default / contentWindowHeight ... iframe : ", iframe )
        // iframe.height(iframe[0].ownerDocument.body.scrollHeight+'px' );

        height = winHeight
        // height = ODAMAP_height

        // let iframeBlock = window.top[0].document 
        // console.log("L-default / contentWindowHeight ... iframeBlock : ", iframeBlock )
        // let iframeBlockHeight = iframeBlock.height(iframe[0].ownerDocument.body.scrollHeight )
        // console.log("L-default / contentWindowHeight ... iframeBlockHeight : ", iframeBlockHeight )

      } else {
        var docNavbars = document.querySelectorAll(`.odm-navbar`)
        let docNavbarsArray = Array.prototype.slice.call(docNavbars)
        let sumNavbarsHeights = docNavbarsArray
          .map((i) => i.offsetHeight)
          .reduce((prev, curr) => prev + curr, 0)
        height = winHeight - sumNavbarsHeights
      }

      // this.log && console.log("L-default / contentWindowHeight ... height : ", height )
      this.layoutHeight = height
      return height
    },
    // contentWindowHeightPx() {
    //   const forceFullHeight = this.isIframe && this.routeConfig.forceHeightIfIframe

    //   let inPixels = forceFullHeight ? '' : 'px'
    //   let contentWindowHeight = forceFullHeight ? 'none' : this.contentWindowHeight()
    //   let heightString = `${contentWindowHeight}${inPixels}`

    //   // this.log && console.log("L-default / contentWindowHeight ... heightString : ", heightString )
    //   return heightString
    // },
    contentMaxScrollHeight() {
      // console.log("\nL-default / contentMaxScrollHeight ... document : ", document )

      let docRows = document.querySelectorAll(`.odm-row`)
      // console.log("L-default / contentMaxScrollHeight ... docRows : ", docRows )

      let docRowsArray = Array.prototype.slice.call(docRows)
      // console.log("L-default / contentMaxScrollHeight ... docRowsArray : ", docRowsArray )

      let ODAMAP_scrolHeight = 0
      docRowsArray.forEach( (row) => {
        // console.log("L-default / contentMaxScrollHeight ... row : ", row )
        // console.log("L-default / contentMaxScrollHeight ... row.clientHeight : ", row.clientHeight )
        // console.log("L-default / contentMaxScrollHeight ... ODAMAP_scrolHeight : ", ODAMAP_scrolHeight )
        ODAMAP_scrolHeight = ODAMAP_scrolHeight + row.scrollHeight
      })
      // console.log("L-default / contentMaxScrollHeight ... ODAMAP_scrolHeight : ", ODAMAP_scrolHeight )
      
      ODAMAP_scrolHeight = ODAMAP_scrolHeight < this.defaultOdamapHeight ? this.defaultOdamapHeight : ODAMAP_scrolHeight
      return ODAMAP_scrolHeight
    },
    sendPostMessage(noScroll = false) {

      let heightToSend
      const forceFullHeight = this.isIframe && this.routeConfig.forceHeightIfIframe
      // console.log('L-default / sendPostMessage / forceFullHeight : ', forceFullHeight)

      if (forceFullHeight || this.isMobileWidth) {
        heightToSend = Math.ceil(this.contentMaxScrollHeight() * 1.01)
      } else {
        heightToSend = this.defaultOdamapHeight
      }
      // console.log('L-default / sendPostMessage / heightToSend - B : ', heightToSend)
      let messageToIframeParent = {
        // fixedHeight: !forceFullHeight,
        frameHeight: heightToSend,
        resizeIndex: this.resizeIndex,
        // frameHeight: Math.ceil(heightToSend * 1.3),
        needScrollToTop: !noScroll
      }
      // console.log('L-default / sendPostMessage / messageToIframeParent : ', messageToIframeParent)
      this.resizeIndex = this.resizeIndex + 1
      window.parent.postMessage(messageToIframeParent,'*')
    },

    handleRouteChange(){

      let eventToStore = ''
      let splitParams = this.routeParams.split('&')
      let parsedParams = { kpifamilies: '', datasetid: '', value: '' }

      splitParams.forEach((item, index) => {
        var tabParam = item.split('=')
        switch(tabParam[0]){
          case 'kpifamilies':
            parsedParams.kpifamilies=tabParam[1]
            break
          case 'datasetid':
            parsedParams.datasetid=tabParam[1]
            break
          case 'value':
            parsedParams.value=tabParam[1]
            break
        }
      })

      if (this.routeConfig.id != 'kpi-territoires-national') {
        if (parsedParams.value == '') {
          eventToStore = `consulte la carte ${this.routeConfig.id} au niveau France`
        }
        else {
          eventToStore = `consulte la carte ${this.routeConfig.id} au niveau ${parsedParams.datasetid} ( ${parsedParams.value} )`
        }
      } else {
        var allThematiques = false
        if (parsedParams.kpifamilies.split(',').length >1){allThematiques = true}
        
        if (parsedParams.value == '') {
          if (allThematiques) {
            eventToStore = `consulte toutes les thématiques au niveau France`
          } else {
            eventToStore = `consulte la thématique ${parsedParams.kpifamilies} au niveau France`
          }
        } else {
          if (allThematiques) {
            eventToStore = `consulte toutes les thématiques au niveau ${parsedParams.datasetid} ( ${parsedParams.value} )`
          } else {
            eventToStore = `consulte la thématique ${parsedParams.kpifamilies} au niveau ${parsedParams.datasetid} ( ${parsedParams.value} )`
          }
        }
      }

      window._paq.push(['trackEvent', 'Page view', 'Change page', eventToStore])

    }

  }
}
</script>
