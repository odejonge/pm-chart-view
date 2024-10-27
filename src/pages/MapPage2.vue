<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      center: { lat: 37.43238031167444, lng: -122.16795397128632 },
      zoom: 11,
      properties: [
        {
          address: "215 Emily St, MountainView, CA",
          description: "Single family house with modern design",
          price: "$ 3,889,000",
          type: "home",
          bed: 5,
          bath: 4.5,
          size: 300,
          position: {
            lat: 37.50024109655184,
            lng: -122.28528451834352,
          },
        },
        {
          address: "108 Squirrel Ln &#128063;, Menlo Park, CA",
          description: "Townhouse with friendly neighbors",
          price: "$ 3,050,000",
          type: "building",
          bed: 4,
          bath: 3,
          size: 200,
          position: {
            lat: 37.44440882321596,
            lng: -122.2160620727,
          },
        },
        {
          address: "100 Chris St, Portola Valley, CA",
          description: "Spacious warehouse great for small business",
          price: "$ 3,125,000",
          type: "warehouse",
          bed: 4,
          bath: 4,
          size: 800,
          position: {
            lat: 37.39561833718522,
            lng: -122.21855116258479,
          },
        }
      ],
      colors: {
        home: '#0288D1',
        building: '#FF9800',
        warehouse: '#558B2F',
        storeAlt: '#7B1FA2'
      }
    };
  },
  mounted() {
    if (typeof google !== 'undefined') {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: this.center,
        zoom: this.zoom,
        mapId: "4504f8b37365c3d2",
      });

      this.properties.forEach(property => {
        const markerElement = document.createElement('div');
        markerElement.style.backgroundColor = this.colors[property.type];
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: property.position,
          map,
          title: property.address,
          content: markerElement,
        });

        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3>${property.address}</h3>
                <p>${property.description}</p>
                <p>Price: ${property.price}</p>
                <p>Bed: ${property.bed}, Bath: ${property.bath}</p>
                <p>Size: ${property.size} sqft</p>
              </div>
            `,
          });
          infoWindow.open(map, marker);
        });
      });
    } else {
      console.error('Google Maps API is niet geladen.');
    }
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
