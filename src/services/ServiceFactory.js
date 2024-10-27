import ChartViewService from './ChartViewService'
import MapViewService from './MapViewService'

export default class ServiceFactory {

  static getChartViewService() {
    return new ChartViewService()
  }
  static getMapViewService() {
    return MapViewService;
  }
}