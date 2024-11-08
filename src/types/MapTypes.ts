export interface Position {
  lat: number;
  lng: number;
}

export interface Property {
  id: number;
  position: Position;
  type: string;
  size: number;
  bed: number;
  bath: number;
  price: number;
  description: string;
}

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
  center: Position;
  zoom: number;
  markerStyles: MapMarkerStyle[];
  filters: MapFilterConfig[];
}

