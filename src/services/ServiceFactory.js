import ChartViewService from './ChartViewService'
export default class ServiceFactory {

  static getChartViewService() {
    return new ChartViewService()
  }
}