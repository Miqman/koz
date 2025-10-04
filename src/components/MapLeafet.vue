<template>
  <div class="map-container">
    <div :id="mapId" class="map" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const props = defineProps({
  // Mode: 'single' untuk satu titik dengan fitur klik, 'multiple' untuk banyak titik
  mode: {
    type: String,
    default: 'single',
    validator: (value) => ['single', 'multiple'].includes(value),
  },
  // Data lokasi untuk mode multiple
  locations: {
    type: Array,
    default: () => [],
  },
  // Latitude dan longitude untuk mode single
  latitude: {
    type: [Number, String],
    default: -7.2575,
  },
  longitude: {
    type: [Number, String],
    default: 112.7521,
  },
  // Tinggi dan lebar map
  height: {
    type: String,
    default: '400px',
  },
  width: {
    type: String,
    default: '100%',
  },
  // Zoom level
  zoom: {
    type: Number,
    default: 13,
  },
  // Apakah bisa diklik untuk memilih lokasi (hanya untuk mode single)
  clickable: {
    type: Boolean,
    default: false,
  },
  // Apakah marker bisa di-drag (hanya untuk mode single)
  draggable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['location-selected'])

const mapId = ref(`map-${Math.random().toString(36).substr(2, 9)}`)
const map = ref(null)
const markers = ref([])
const currentMarker = ref(null)
const isUpdatingFromProps = ref(false)

// Expose methods untuk parent component
const moveToLocation = (lat, lng, zoom = null) => {
  if (!map.value) return

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lng)

  if (isNaN(latitude) || isNaN(longitude)) {
    console.warn('Invalid coordinates:', lat, lng)
    return
  }

  // Move camera ke lokasi yang dipilih
  const targetZoom = zoom || map.value.getZoom()
  map.value.setView([latitude, longitude], targetZoom, {
    animate: true,
    duration: 1.0, // durasi animasi dalam detik
    easeLinearity: 0.25,
  })
}

// Expose methods ke parent component
defineExpose({
  moveToLocation,
  getMap: () => map.value,
  getCurrentCenter: () => (map.value ? map.value.getCenter() : null),
  getCurrentZoom: () => (map.value ? map.value.getZoom() : null),
})

const initMap = () => {
  // Inisialisasi map
  const lat = parseFloat(props.latitude) || -7.2575
  const lng = parseFloat(props.longitude) || 112.7521

  map.value = L.map(mapId.value).setView([lat, lng], props.zoom)

  // Tambahkan tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)

  // Setup berdasarkan mode
  if (props.mode === 'single') {
    setupSingleMode()
  } else {
    setupMultipleMode()
  }
}

const setupSingleMode = () => {
  // Tambahkan marker jika ada koordinat yang valid
  const lat = parseFloat(props.latitude)
  const lng = parseFloat(props.longitude)

  if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
    addSingleMarker(lat, lng)
  }

  // Tambahkan event listener untuk klik jika clickable
  if (props.clickable) {
    map.value.on('click', onMapClick)
  }
}

const setupMultipleMode = () => {
  // Tambahkan semua marker dari props.locations
  props.locations.forEach((location) => {
    if (location.latitude && location.longitude) {
      addMultipleMarker(
        parseFloat(location.latitude),
        parseFloat(location.longitude),
        location.nama || 'Lokasi',
        location.alamat || '',
      )
    }
  })

  // Fit bounds jika ada marker
  if (markers.value.length > 0) {
    const group = new L.featureGroup(markers.value)
    map.value.fitBounds(group.getBounds().pad(0.1))
  }
}

const addSingleMarker = (lat, lng) => {
  if (!map.value) return

  // Hapus marker sebelumnya jika ada
  if (currentMarker.value) {
    map.value.removeLayer(currentMarker.value)
  }

  // Tambahkan marker baru dengan opsi draggable
  currentMarker.value = L.marker([lat, lng], {
    draggable: props.draggable && props.mode === 'single',
  }).addTo(map.value)

  // Tambahkan event listener untuk drag jika draggable
  if (props.draggable && props.mode === 'single') {
    currentMarker.value.on('dragend', onMarkerDragEnd)
  }

  // Update center map hanya jika tidak sedang update dari props
  if (!isUpdatingFromProps.value) {
    map.value.setView([lat, lng], map.value.getZoom())
  }
}

const addMultipleMarker = (lat, lng, title, description) => {
  const marker = L.marker([lat, lng]).addTo(map.value)

  // Tambahkan popup jika ada title atau description
  if (title || description) {
    const popupContent = `
      ${title ? `<h6 style="margin: 0 0 5px 0; font-weight: bold;">${title}</h6>` : ''}
      ${description ? `<p style="margin: 0;">${description}</p>` : ''}
    `
    marker.bindPopup(popupContent)
  }

  markers.value.push(marker)
}

const onMapClick = (e) => {
  const { lat, lng } = e.latlng

  // Tambahkan marker di lokasi yang diklik
  addSingleMarker(lat, lng)

  // Emit event dengan koordinat yang dipilih
  emit('location-selected', {
    latitude: lat.toFixed(6),
    longitude: lng.toFixed(6),
  })
}

const onMarkerDragEnd = (e) => {
  const { lat, lng } = e.target.getLatLng()

  // Emit event dengan koordinat baru setelah drag
  emit('location-selected', {
    latitude: lat.toFixed(6),
    longitude: lng.toFixed(6),
  })
}

// Watch untuk perubahan koordinat pada mode single
watch(
  () => [props.latitude, props.longitude],
  ([newLat, newLng]) => {
    if (props.mode === 'single' && map.value) {
      const lat = parseFloat(newLat)
      const lng = parseFloat(newLng)

      // Hanya update jika koordinat valid dan berbeda dari marker saat ini
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        isUpdatingFromProps.value = true
        addSingleMarker(lat, lng)

        // Reset flag setelah update
        nextTick(() => {
          isUpdatingFromProps.value = false
        })
      }
    }
  },
  { immediate: false },
)

// Watch untuk perubahan locations pada mode multiple
watch(
  () => props.locations,
  () => {
    if (props.mode === 'multiple' && map.value) {
      // Hapus semua marker sebelumnya
      markers.value.forEach((marker) => {
        map.value.removeLayer(marker)
      })
      markers.value = []

      // Tambahkan marker baru
      setupMultipleMode()
    }
  },
  { deep: true },
)

// Watch untuk perubahan draggable property
watch(
  () => props.draggable,
  (newDraggable) => {
    if (props.mode === 'single' && currentMarker.value) {
      // Update draggable state dari marker yang ada
      if (newDraggable) {
        currentMarker.value.dragging.enable()
        currentMarker.value.on('dragend', onMarkerDragEnd)
      } else {
        currentMarker.value.dragging.disable()
        currentMarker.value.off('dragend', onMarkerDragEnd)
      }
    }
  },
)

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
</script>

<style scoped>
.map-container {
  position: relative;
}

.map {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* Override Leaflet styles */
:deep(.leaflet-container) {
  font-family: inherit;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
}

/* Style untuk marker yang bisa di-drag */
:deep(.leaflet-marker-draggable) {
  cursor: move;
}
</style>
