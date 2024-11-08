<template>
  <div class="custom-container">
    <router-view :chartLayout="chartLayout" />
  </div>
</template>

<script>
import ServiceFactory from './services/ServiceFactory.js'

export default { 
  name: 'App',
  data() {
    return { 
      lang: 'nl',
      formStructure: {},
      selectedElement: null,
      loadStaticData: true,
      formId: null,
      chartLayout: {},
      service: {},
    }
  },
  methods: {
    languageChanged(lang) {
      this.lang = lang
      this.getChartLayoutWithData()
    },
    async getChartLayoutWithData() {
      if (this.$route.path !== '/map' && this.$route.path !== '/map2') {
        this.chartLayout = await this.service.getChartLayoutWithData(this.chartId, this.lang)
      }
    },
    rootUrl() {
      if (window.location.origin.indexOf('localhost') == -1) {
        return '';
      } else {
        return "http://localhost:8000";
      }
    }
  },
  async mounted() {
    setTimeout(async () => {
      this.chartId = this.$route.query.id;
      this.service = ServiceFactory.getChartViewService()
      this.getChartLayoutWithData()
    }, 200)
  },
}
</script> 
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}
</style>
