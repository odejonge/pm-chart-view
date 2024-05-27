<template>
  <div class="container-fluid custom-container p-0">
    <div class="container main p-0">
      <router-view :chartLayout="chartLayout" />
    </div>
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
      this.chartLayout = await this.service.getChartLayoutWithData(this.chartId, this.lang)
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
      //this.chartLayout = await this.service.getChartLayoutWithData(this.chartId, this.lang)
    }, 200)
  }
}
</script>
<style>

.custom-container {
  max-width: 900px;
  /* Of welke maximale breedte je ook verkiest */
  margin-right: 0px;
  margin-left: 0px;
  width: 100%;
}
</style>
