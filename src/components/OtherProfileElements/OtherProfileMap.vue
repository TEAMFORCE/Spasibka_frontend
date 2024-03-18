<template>
  <div class="other_profile_page_wrapper">
    <div class="other_profile_map_header">
      <h1 class="other_profile_map_title general-contrast-color">
        {{ $t("profile.my_location") }}
      </h1>
    </div>
    <h1 class="other_profile_location_name general-secondary-color">
      {{ profile_info?.profile?.location_text }}
    </h1>
    <div class="other_profile_page_map_content">
      <l-map
        ref="leafletMap"
        v-model="zoom"
        v-model:zoom="zoom"
        :maxZoom="10"
        :minZoom="2"
        :maxBounds="bound"
        :center="center"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>

        <l-marker
          v-if="
            profile_info?.profile?.latitude && profile_info?.profile?.longitude
          "
          :lat-lng="[
            profile_info?.profile?.latitude,
            profile_info?.profile?.longitude,
          ]"
        >
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import "mosha-vue-toastify/dist/style.css";

import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

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
import "leaflet/dist/leaflet.css";

export default {
  name: "OtherProfileMap",
  props: ["profile_info"],
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
      bound: [
        [200, -200],
        [-100, 200],
      ],
    };
  },

  computed: {
    ...mapStores(useProfileStore),
    center() {
      return [
        this.profile_info?.profile?.latitude || 0,
        this.profile_info?.profile?.longitude || 0,
      ];
    },
  },
};
</script>

<style scoped>
.other_profile_page_wrapper {
  box-sizing: border-box;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  padding: 16px;
}

.other_profile_map_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: auto;
}

.other_profile_map_title {
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
}

.other_profile_location_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}

.other_profile_page_map_content {
  z-index: 3;
  width: 100%;
  height: 590px;
  border-radius: 52px;
  overflow: hidden;
}
</style>