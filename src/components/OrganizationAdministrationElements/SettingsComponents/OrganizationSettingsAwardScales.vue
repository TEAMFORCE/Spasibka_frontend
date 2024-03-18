<template>
  <div class="award_scales">
    <ScaleCreationForm
      @closeScaleCreation="closeScaleCreation"
      v-if="scaleCreationEnabled"
    />
    <div class="page_header">
      <button 
        class="add_scale tooltip_container brand-secondary-bg" 
        @click="enableScaleCreation"
        :data-tooltip="$t('organization.create_scale')"
      >
        <AddTransactionIcon />
      </button>
    </div>
    <div class="scales_list">
      <ScaleCard
        @closeScaleEdition="closeScaleCreation"
        @closeScaleDeletion="closeScaleCreation"
        v-for="scale in scalesList"
        :scale="scale"
      />
    </div>
  </div>
</template>

<script>
import AddTransactionIcon from "@/components/Icons/OrganizationAdministrationIcons/AddTransactionIcon.vue";
import ScaleCreationForm from "@/components/OrganizationAdministrationElements/SettingsComponents/AwardScalesComponents/ScaleCreationForm.vue";
import { API_URIS } from "@/constants/api";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import ScaleCard from "./AwardScalesComponents/ScaleCard.vue";

export default {
  name: "OrganizationSettingsAwardScales",
  components: {
    AddTransactionIcon,
    ScaleCreationForm,
    ScaleCard
  },
  data() {
    return {
      scaleCreationEnabled: false,
      scalesList: [],
    };
  },
  watch: {
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal?.profile) {
          this.getScalesList(newVal.profile.organization_id);
        } 
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapStores(useProfileStore),
  },
  methods: {
    enableScaleCreation() {
      this.scaleCreationEnabled = true;
    },
    closeScaleCreation() {
      this.scaleCreationEnabled = false;
      this.getScalesList(this.profileStore.profileInfo.profile.organization_id);
    },
    async getScalesList(orgID) {
      try {
        const response = await axios.get(API_URIS.scales.replace("organization_id", orgID));
        this.scalesList = response.data.data;
      } catch(err) {
        throw err;
      }
    }
  }
};
</script>

<style scoped>
.award_scales {
  padding-right: 52px;
  padding-bottom: 52px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.page_header {
  display: flex;
  justify-content: flex-end;
}
.add_scale {
  position: relative;
  height: 38px;
  width: 38px;
  border-radius: 8px;
  padding: 7px;
}

.scales_list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
