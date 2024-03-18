<template>
  <div class="main_page_map_wrapper">
    <div class="main_page_map_header">
      <h3 class="main_page_map_title">
        {{ $t("profile.my_location") }}
      </h3>
    </div>
    <div class="main_page_map_content">
      <l-map
        ref="leafletMap"
        v-model="zoom"
        v-model:zoom="zoom"
        :maxZoom="10"
        :minZoom="3"
        :maxBounds="bound"
        :center="center"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>

        <l-marker
          v-for="employee in employeesWithLocation"
          :lat-lng="[employee.latitude, employee.longitude]"
          @click="goToUser(employee.userId)"
        >
          <l-tooltip>
            <div
              class="employees_tooltip"
              v-html="tooltip(employee.tooltip)"
            ></div>
          </l-tooltip>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import "mosha-vue-toastify/dist/style.css";

import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

import { API_URIS } from "@/constants/api";
import {
  LMap,
  LIcon,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
export default {
  name: "EmployeesMap",
  components: {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

      zoom: 4,
      center: [48, 37],
      bound: [
        [200, -200],
        [-100, 200],
      ],

      employees: [],
    };
  },

  computed: {
    employeesWithLocation() {
      let markers = [];

      for (let i = 0; i < this.employees.length; ++i) {
        if (this.employees[i].latitude) {
          let locationsEqual = false;
          for (let j = 0; j < markers.length; ++j) {
            if (
              this.employees[i].latitude == markers[j].latitude &&
              this.employees[i].longitude == markers[j].longitude
            ) {
              if (this.employees[i].first_name) {
                markers[j].tooltip +=
                  "\r\n" +
                  this.employees[i].surname +
                  " " +
                  this.employees[i].first_name;
              } else {
                markers[j].tooltip += "\r\n" + this.employees[i].tg_name;
              }
              locationsEqual = true;
              break;
            }
          }
          if (!locationsEqual) {
            markers.push({
              latitude: this.employees[i].latitude,
              longitude: this.employees[i].longitude,
              tooltip: this.employees[i].first_name
                ? this.employees[i].surname + " " + this.employees[i].first_name
                : this.employees[i].tg_name,
              userId: this.employees[i].id,
            });
          }
        }
      }
      return markers;
    },
  },
  methods: {
    goToUser(userId) {
      this.$router.push(`other_profile/${userId}`);
    },
    tooltip(marker) {
      return marker.replace(/\r\n/g, "<br>");
    },
    async getEmployees() {
      try {
        const response = await axios.get(
          API_URIS.employees + "/?offset=1&limit=99999"
        );
        this.employees = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    this.getEmployees();
  },
};
</script>

<style scoped>
.main_page_map_wrapper {
  background-color: var(--generalColorWhite);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}

.main_page_map_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: auto;
}

.main_page_map_title {
  word-break: break-word;
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
  margin: 0;
}

.location_input {
  height: 20px;
  align-items: center;
  display: flex;
  gap: 4px;
}

.location_name_input {
  padding: 6px;
  border-radius: 6px;
  border-style: none;
  border: 1px solid var(--generalColorGrey);
}

.location_name_input::placeholder {
  color: var(--generalColorGrey);
}

.main_page_map_content {
  z-index: 3;
  width: 100%;
  height: 590px;
  border-radius: 52px;
  overflow: hidden;
}
.employees_tooltip {
  text-align: left;
}

.determine_location_button {
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not_found_error_text {
  font-size: 16px;
}

.checkbox {
  accent-color: var(--generalBrand);
}

.action_wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.make_public_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  text-align: left;
}

.save_location_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 8px;
  height: 50px;
  font-size: 20px;
}
</style>