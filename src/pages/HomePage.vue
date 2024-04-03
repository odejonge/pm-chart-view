<template>
  <div class="container-fluid p-0 m-0">
    <div v-html="loadedContent"></div>
  </div>
</template>
<script>
export default {
  name: 'HomePage',
  props: { chartLayout: Object },
  data() {
    return {
      loadedContent: "",
      chartName: "",
      chartId: ""
    }
  },
  watch: {
    chartLayout: {
      deep: true,
      handler() {
        this.loadedContent = this.chartLayout.layout;
        console.log("layout: ", this.chartLayout.layout)
        this.chartName = this.chartLayout.chartName;
        this.chartId = this.chartLayout.chartId;
        this.executeScripts(this.loadedContent);
      }
    }
  },
  methods: {
    executeScripts(htmlString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const scripts = doc.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.text = script.textContent;
        document.head.appendChild(newScript).parentNode.removeChild(newScript);
      });
    }
  },
}
</script>