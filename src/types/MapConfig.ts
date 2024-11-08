export interface MapMarkerStyle {
  type: string;
  icon: string;
  color: string;
}

export interface MapFilterConfig {
  type: 'checkbox' | 'range';
  label: string;
  field: string;
  options?: {
    value: string;
    label: string;
    icon?: string;
  }[];
  range?: {
    min: number;
    max: number;
    step: number;
    unit?: string;
  };
}

export interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markerStyles: MapMarkerStyle[];
  filters: MapFilterConfig[];
}
