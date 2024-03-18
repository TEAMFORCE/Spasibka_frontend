<template>
  <div class="main_page_map_wrapper">
    <div class="main_page_map_header">
      <h1 class="main_page_map_title general-contrast-color">
        {{ $t("profile.my_location") }}
      </h1>
    </div>
    <div class="location_input">
      <input
        class="location_name_input general-contrast-color"
        :placeholder="$t('profile.location')"
        v-model="locationName"
      />
      <button
        v-if="emptyLocation"
        class="general-secondary-bg general-white-color determine_location_button"
        @click="determineLocation"
        disabled
      >
        {{ $t("profile.find") }}
      </button>
      <button
        v-else
        class="general-brand-bg general-white-color determine_location_button"
        @click="findLocation"
      >
        {{ $t("profile.find") }}
      </button>
      <h1 class="minor-error-color not_found_error_text" v-if="notFoundError">
        {{ $t("profile.not_found") }}
      </h1>
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
          v-if="markerCoords"
          :lat-lng="markerCoords"
          draggable
          @moveend="updateCoords"
        >
        </l-marker>
      </l-map>
    </div>
    <div class="action_wrap">
      <input type="checkbox" class="checkbox" v-model="makeLocationPublic" />
      <label>
        <h1 class="make_public_text">{{ $t("profile.show_everyone") }}</h1>
      </label>
    </div>
    <button
      class="save_location_button general-brand-bg general-white-color"
      @click="saveLocation"
    >
      {{ $t("profile.save") }}
    </button>
  </div>
</template>
  
<script>
import "mosha-vue-toastify/dist/style.css";
import { notify } from "@/general-scripts/toast-notification";

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
  name: "ProfileMap",
  emits: ["saveProfile", "locationUpdatedFalse", "locationUpdatedTrue"],
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
      locationName: "",
      notFoundError: false,

      zoom: 4,
      center: [48, 37],
      bound: [
        [200, -200],
        [-100, 200],
      ],

      makeLocationPublic: false,

      markerCoords: null,
    };
  },

  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    emptyLocation() {
      return !this.locationName;
    },
  },
  watch: {
    profileInfo: {
      handler(newVal) {
        if (newVal) this.initialLocation();
      },
      immediate: true,
    },
  },
  methods: {
    async updateCoords(event) {
      try {
        this.notFoundError = false;
        const lng = event.target._latlng.lng;
        const lat = event.target._latlng.lat;
        // let apiURL = "http://api.positionstack.com/v1/reverse?access_key=f10a9c6c5fb17a487e1256f81ae5ceb2&query=";
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
            lat +
            "&lon=" +
            lng
        );
        // apiURL += lat + "," + lng;
        // const response = await axios.get(apiURL);
        // this.locationName = response.data.data[0].label;
        this.locationName = response.data.display_name;
        this.markerCoords = [lat, lng];
      } catch (err) {
        this.$moshaToast(
          {
            title:
              err?.response?.data || "Не удалось определить местоположение",
          },
          {
            position: "bottom-right",
            timeout: 3000,
            transition: "slide",
            type: "danger",
          }
        );
        throw err;
      }
    },
    async determineLocation() {
      try {
        let response = await axios.get(API_URIS.getUserLocation);
        this.locationName =
          (response?.data?.city ? response.data.city : "") +
          (response?.data?.country ? ", " + response.data.country : "");

        this.markerCoords = [
          response?.data?.latitude,
          response?.data?.longitude,
        ];
        this.center = [response?.data?.latitude, response?.data?.longitude];
        notify(this.$t("profile.location_detected"), "success");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async findLocation() {
      try {
        this.notFoundError = false;
        // let apiURL = "http://api.positionstack.com/v1/forward?access_key=f10a9c6c5fb17a487e1256f81ae5ceb2&query=";
        // apiURL += this.locationName;
        // const response = await axios.get(apiURL);
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search?format=jsonv2&q=" +
            this.locationName
        );
        // this.markerCoords = [response.data.data[0].latitude, response.data.data[0].longitude];
        // this.locationName = response.data.data[0].label;
        this.markerCoords = [response.data[0].lat, response.data[0].lon];
        // this.locationName = response.data
      } catch (err) {
        this.notFoundError = true;
        this.$moshaToast(
          {
            title: err?.response?.data || "Не удалось определить координаты",
          },
          {
            position: "bottom-right",
            timeout: 3000,
            transition: "slide",
            type: "danger",
          }
        );
        throw err;
      }
    },
    async initialLocation() {
      try {
        // let response = null;
        // if (!this.profileInfo || !this.profileInfo?.profile?.location_text)
        //   response = await axios.get(API_URIS.getUserLocation);

        if (this.profileInfo.profile?.location_text)
          this.locationName = this.profileInfo.profile.location_text;
        // else
        //   this.locationName =
        //     (response?.data?.city ? response.data.city : "") +
        //     (response?.data?.country ? ", " + response.data.country : "");

        if (
          this.profileInfo.profile?.latitude &&
          this.profileInfo.profile?.longitude
        ) {
          this.markerCoords = [
            this.profileInfo.profile.latitude,
            this.profileInfo.profile.longitude,
          ];
          this.center = [
            this.profileInfo.profile.latitude,
            this.profileInfo.profile.longitude,
          ];
        }
        this.makeLocationPublic = this.profileInfo.profile.show_location;
        // else
        //   this.markerCoords = [
        //     response?.data?.latitude,
        //     response?.data?.longitude,
        //   ];
      } catch (err) {
        throw err;
      }
    },
    async saveLocation() {
      this.$emit("saveProfile");
      try {
        this.$emit("locationUpdatedFalse");
        const response = await axios.post(API_URIS.profileSettingsLocation, {
          show_location: this.makeLocationPublic,
          latitude: this.markerCoords[0],
          longitude: this.markerCoords[1],
          location_text: this.locationName,
        });
        notify(this.$t("profile.location_updated"), "success");
        // this.$router.push("/other_profile/" + this.profileInfo?.id);
        //this.$router.go(-1);
        this.$emit("locationUpdatedTrue");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        //this.$router.go(-1);
        throw err;
      }
    },
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
  width: auto;
}
.main_page_map_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: auto;
}
.main_page_map_title {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
}
.location_input {
  width: 100%;
  max-width: 700px;
  align-items: center;
  display: flex;
  gap: 4px;
}

.location_name_input {
  max-width: 400px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border-style: none;
  font-size: 16px;
  font-family: "Roboto";
  line-height: 24px;
  border: 1px solid var(--generalColorGrey);
}
.location_name_input::placeholder {
  color: var(--generalColorGrey);
}
.main_page_map_content {
  width: 100%;
  height: 590px;
  border-radius: 52px;
  overflow: hidden;
}
.determine_location_button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-family: "Roboto";
  line-height: 24px;
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
  padding: 6.4px 24px;
  border-radius: 6px;
  margin-top: 12px;
  /* height: 50px; */
  width: 230px;
  font-size: 16px;
  font-family: "Roboto";
  line-height: 24px;
}
</style>