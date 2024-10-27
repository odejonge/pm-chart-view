<template>
  <div class="map-container">
    <div class="sidebar" :class="{ 'sidebar-open': isPanelOpen }">
      <div class="sidebar-toggle" @click="isPanelOpen = !isPanelOpen">
        <i class="fas" :class="isPanelOpen ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
      </div>
      
      <div class="filter-panel p-3">
        <h5>Filters</h5>
        
        <!-- Type filters -->
        <div class="mb-3">
          <label class="form-label">Type</label>
          <div v-for="type in availableTypes" :key="type" class="form-check form-switch">
            <input class="form-check-input" type="checkbox" 
                   v-model="selectedTypes" 
                   :value="type">
            <label class="form-check-label">{{ type }}</label>
          </div>
        </div>

        <!-- Size -->
        <div class="mb-3">
          <label class="form-label">Size (ft²): {{ sizeRange[0] }} - {{ sizeRange[1] }}</label>
          <div ref="sizeSlider"></div>
        </div>

        <!-- Bedrooms -->
        <div class="mb-3">
          <label class="form-label">Bedrooms: {{ bedRange[0] }} - {{ bedRange[1] }}</label>
          <div ref="bedSlider"></div>
        </div>

        <!-- Bathrooms -->
        <div class="mb-3">
          <label class="form-label">Bathrooms: {{ bathRange[0] }} - {{ bathRange[1] }}</label>
          <div ref="bathSlider"></div>
        </div>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import ServiceFactory from '../services/ServiceFactory';
export default {
  name: 'MapPage',
  data() {
    return {
      properties: [],
      colors: {
        home: '#0288D1',
        building: '#FF9800',
        warehouse: '#558B2F',
        'store-alt': '#7B1FA2'
      },
      zIndex: 1,
      isPanelOpen: false,
      availableTypes: ['home', 'building', 'warehouse', 'store-alt'],
      selectedTypes: ['home', 'building', 'warehouse', 'store-alt'],
      minPrice: 0,
      maxPrice: 10000000,
      priceRange: [0, 10000000],
      minBed: 0,
      maxBed: 10,
      bedRange: [0, 10],
      minBath: 0,
      maxBath: 10,
      bathRange: [0, 10],
      minSize: 0,
      maxSize: 1000000,
      sizeRange: [0, 1000000],
      markers: [], // Nieuwe property om markers bij te houden
      lastValidSize: null,
    };
  },
  watch: {
    // Watch voor veranderingen in filters
    selectedTypes: {
      handler() {
        this.updateMarkers();
      },
      deep: true
    }
  },
  methods: {
    toggleHighlight(markerView) {
      const content = markerView.content;
      if (content.classList.contains("highlight")) {
        content.classList.remove("highlight");
        markerView.zIndex = 1; // Reset de z-index op markerView
        content.querySelector('.details').style.display = 'none';
        content.style.borderRadius = '50%';
        content.style.backgroundColor = content.querySelector('.icon').style.color;
        content.style.boxShadow = 'none';
        content.style.height = '30px';
        content.style.padding = '4px';
        content.style.width = '30px';
        content.querySelector('.icon').style.transform = 'scale(1)';
        content.querySelector('.icon').style.padding = '8px';
        content.style.backgroundColor = content.querySelector('.icon').style.color;
        content.querySelector('.arrow-decoration').style.borderTopColor = content.style.backgroundColor;
        content.querySelector('.icon').style.color = '#FFFFFF';
      } else {
        content.classList.add("highlight");
        markerView.zIndex = this.zIndex; // Zorg ervoor dat markerView bovenaan staat
        content.style.borderRadius = '8px';
        content.style.boxShadow = '10px 10px 5px rgba(0, 0, 0, 0.2)';
        content.style.height = 'auto';
        content.style.padding = '8px 20px 10px 20px';
        content.style.width = 'auto';
        content.querySelector('.details').style.display = 'block';
        content.querySelector('.icon').style.transform = 'scale(1.8)';
        content.querySelector('.icon').style.color = content.style.backgroundColor;
        content.querySelector('.icon').style.padding = '0px 11px 0px 0px';
        content.style.backgroundColor = '#FFFFFF';
        content.querySelector('.arrow-decoration').style.borderTopColor = content.style.backgroundColor;
      }
      this.zIndex++;
    },
    // Functie om de pijl decoratie toe te voegen
    addDecoration(content, iconColor) {
      // Creëer een nieuw element
      const afterElement = document.createElement('div');

      afterElement.className = 'arrow-decoration';

      // Stijl het nieuwe element
      afterElement.style.position = 'absolute';
      afterElement.style.bottom = '-6px';
      afterElement.style.left = '50%';
      afterElement.style.transform = 'translateX(-50%)';
      afterElement.style.borderLeft = '9px solid transparent';
      afterElement.style.borderRight = '9px solid transparent';
      afterElement.style.borderTop = `9px solid ${iconColor}`;
      afterElement.style.width = '0';
      afterElement.style.height = '0';

      // Voeg het nieuwe element toe aan het doel-element
      content.style.position = 'relative'; // Zorg ervoor dat het doel-element relatief gepositioneerd is
      content.appendChild(afterElement);
    },
    buildContent(property) {
      const content = document.createElement("div");
      content.classList.add("propertyMap");
      const iconColor = this.colors[property.type] || '#FFFFFF';
      content.style.backgroundColor = iconColor;
      const self = this;
      setTimeout(() => self.addDecoration(content, iconColor), 200);
      
      content.innerHTML = `
        <div class="icon"  >
          <i aria-hidden="true" class="fa fa-icon fa-${property.type}" title="${property.type}"></i>
          <span class="fa-sr-only">${property.type}</span>
        </div>
          
          <div class="details row ms-1" style="display: none;">
            <div class="col-12 fw-bold">${property.price}</div>
            <div class="col-12 text-muted-small">${property.address}</div>
            <div class="col-12 text-muted-small text-center border rounded-box px-0 py-1 mt-1 ">
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span>${property.bed}</span>
            </div>
            <div class="col-12 text-muted-small text-center border rounded-box px-0 py-1  mt-1">
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span>${property.bath}</span>
            </div>
            <div class="col-12 text-muted-small text-center border rounded-box px-0 py-1  mt-1">
              <i aria-hidden="true" class="fa fa-ruler fa-lg size " title="size"></i>
              <span>${property.size} ft<sup>2</sup></span>
            </div>
          </div>
      `;
      return content;
    },
    async initMap() {
      const loader = new Loader({
        apiKey: "AIzaSyDEsgErswj7mloq5AP83ih0iD8npbjTn-U",
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const center = { lat: 37.43238031167444, lng: -122.16795397128632 };
      this.map = new Map(document.getElementById("map"), {
        zoom: 11,
        center,
        mapId: "4504f8b37365c3d1",
      });

      // Maak markers voor alle properties
      this.markers = this.properties.map(property => {
        const advancedMarker = new AdvancedMarkerElement({
          map: this.map,
          content: this.buildContent(property),
          position: property.position,
          title: property.description,
        });

        advancedMarker.property = property; // Bewaar property reference
        
        advancedMarker.addListener("click", () => {
          this.toggleHighlight(advancedMarker);
        });

        return advancedMarker;
      });

      this.updateMarkers(); // Update initiële zichtbaarheid
    },
    updateMarkers() {
      this.markers.forEach(marker => {
        const visible = (
          (this.selectedTypes.length === 0 || this.selectedTypes.includes(marker.property.type)) &&
          marker.property.size >= this.sizeRange[0] && 
          marker.property.size <= this.sizeRange[1] &&
          marker.property.bed >= this.bedRange[0] &&
          marker.property.bed <= this.bedRange[1] &&
          marker.property.bath >= this.bathRange[0] &&
          marker.property.bath <= this.bathRange[1]
        );
        marker.map = visible ? this.map : null;
      });
    },
    validateRange(type) {
      switch(type) {
        case 'size':
          if (this.sizeRange[0] > this.sizeRange[1]) {
            if (this.lastValidSize) {
              this.sizeRange = [...this.lastValidSize];
            }
          } else {
            this.lastValidSize = [...this.sizeRange];
          }
          break;
        // Voeg andere cases toe voor price, bed, bath indien nodig
      }
    },
  },
  async mounted() {
    const mapViewService = ServiceFactory.getMapViewService();
    this.properties = await mapViewService.getMockProperties();

    this.initMap();
    this.lastValidSize = [...this.sizeRange];
    
    try {
      // Size slider
      const sizeSlider = this.$refs.sizeSlider;
      noUiSlider.create(sizeSlider, {
        start: [0, 1000],
        connect: true,
        range: {
          'min': 0,
          'max': 1000
        },
        step: 10,
        format: {
          to: (value) => Math.round(value / 10) * 10,
          from: (value) => value
        }
      });

      // Bed slider
      const bedSlider = this.$refs.bedSlider;
      noUiSlider.create(bedSlider, {
        start: [0, 10],
        connect: true,
        range: {
          'min': 0,
          'max': 10
        },
        step: 1,
        format: {
          to: value => Math.round(value),
          from: value => value
        }
      });

      // Bath slider
      const bathSlider = this.$refs.bathSlider;
      noUiSlider.create(bathSlider, {
        start: [0, 10],
        connect: true,
        range: {
          'min': 0,
          'max': 10
        },
        step: 0.5,  // Voor halve badkamers
        format: {
          to: value => value,
          from: value => value
        }
      });

      // Update events
      sizeSlider.noUiSlider.on('update', (values) => {
        this.sizeRange = values.map(Number);
        this.updateMarkers();
      });

      bedSlider.noUiSlider.on('update', (values) => {
        this.bedRange = values.map(Number);
        this.updateMarkers();
      });

      bathSlider.noUiSlider.on('update', (values) => {
        this.bathRange = values.map(Number);
        this.updateMarkers();
      });

    } catch (error) {
      console.error('Error creating sliders:', error);
    }
  }
}
</script>

<style>
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
}

@import 'https://use.fontawesome.com/releases/v6.2.0/css/all.css';

.propertyMap {
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 50%;
  color: #263238;
  display: flex;
  font-size: 14px;
  height: 30px;
  justify-content: center;
  padding: 4px;
  position: relative;
  width: 30px;
  transition: all 0.3s ease-out;
}

.propertyMap .icon {
  align-items: center;
  display: flex;
  justify-content: center;
  color: #FFFFFF;
  border-radius: 50%;
  width: 30px;
  height: 30px;
}

.propertyMap .details {
  display: none;
  flex-direction: column;
  flex: 1;
}

.text-muted-small {
  color: #6c757d; 
  font-size: 0.7em;
}
.rounded-box {
  background-color: #f0f0f0;
  padding: 2px;
  border-radius: 4px;
}

.propertyMap .bed {
  color: #FFA000;
}

.propertyMap .bath {
  color: #03A9F4;
}

.propertyMap .size {
  color: #388E3C;
}

.sidebar {
  position: absolute;
  left: -200px; /* Aangepast van -400px */
  top: 0;
  width: 200px;  /* Aangepast van 400px */
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: left 0.3s ease;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar-open {
  left: 0;
}

.sidebar-toggle {
  position: absolute;
  right: -40px;
  bottom: 30px;
  width: 40px;
  height: 40px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

/* Maak labels en content kleiner voor smaller panel */
.filter-panel {
  font-size: 0.9rem;
}

.filter-panel h5 {
  font-size: 1rem;
}

/* Zorg dat ranges goed passen */
.range-slider {
  position: relative;
  width: 100%;
  height: 24px;
}

.range-slider .form-range {
  position: absolute;
  width: 100%;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 1;
}

.range-slider .form-range::-webkit-slider-thumb {
  pointer-events: all;
  width: 24px;
  height: 24px;
  -webkit-appearance: none;
  cursor: pointer;
  z-index: 3;
}

.range-slider .form-range::-moz-range-thumb {
  pointer-events: all;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 3;
}

/* Zorg dat de tweede slider over de eerste heen ligt */
.range-slider .form-range:nth-child(2) {
  background: none;
}

.range-slider .form-range:nth-child(1) {
  background: #dee2e6;
  background: linear-gradient(to right, #dee2e6 0%, #007bff 100%);
}

/* noUiSlider custom styling */
.noUi-connect {
  background: #0d6efd; /* Bootstrap primary blue */
}

.noUi-target {
  height: 8px;  /* Smaller height */
  border: none;
  background: #e9ecef; /* Bootstrap light gray */
  box-shadow: none;
}

.noUi-handle {
  width: 18px !important;
  height: 18px !important;
  border-radius: 50%;
  background: #0d6efd;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  cursor: pointer;
}

.noUi-handle:before,
.noUi-handle:after {
  display: none; /* Verwijder de default lijnen in de handle */
}

.noUi-handle:hover {
  background: #0b5ed7; /* Iets donkerder bij hover */
}

/* Maak de slider wat compacter */
.noUi-horizontal {
  margin: 10px 0;
}

.noUi-horizontal .noUi-handle {
  right: -9px !important;
  top: -5px !important;
}
</style>















