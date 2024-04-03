import axios from 'axios';
class ChartViewService {
  
    async getChartLayoutWithData(chartLayoutId, language = 'nl') {
      const response = await axios.get(this.rootUrl() + `/getChartLayoutWithData?id=${chartLayoutId}&lang=${language}`)
      return response.data;
    }

    rootUrl() {
      if (window.location.origin.indexOf('localhost') == -1) {
        return '';
      } else {
        return "http://localhost:8000";
      }
    }
}
export default ChartViewService;