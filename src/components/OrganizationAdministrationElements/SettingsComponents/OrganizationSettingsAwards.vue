<template>
  <div class="awards">
    <AwardCreationForm
      @closeAwardCreation="closeAwardCreation"
      v-if="awardCreationEnabled"
    />
    <div class="page_header">
      <button 
        class="add_award tooltip_container brand-secondary-bg" 
        @click="enableAwardCreation"
        :data-tooltip="$t('organization.create_award')"
      >
        <AddTransactionIcon />
      </button>
    </div>
    <div class="awards_list">
      <AwardCard
        @closeAwardCreation="closeAwardCreation"
        v-for="award in awardsList"
        :award="award"
      />
    </div>
  </div>
</template>

<script>
import AddTransactionIcon from "@/components/Icons/OrganizationAdministrationIcons/AddTransactionIcon.vue";
import { API_URIS } from "@/constants/api";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import AwardCreationForm from "./AwardsComponents/AwardCreationForm.vue";
import AwardCard from "./AwardsComponents/AwardCard.vue";

export default {
  name: "OrganizationSettingsAwards",
  components: {
    AddTransactionIcon,
    AwardCreationForm,
    AwardCard
  },
  data() {
    return {
      awardCreationEnabled: false,
      awardsList: [],
    };
  },
  watch: {
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal?.profile) {
          this.getAwardsList(newVal.profile.organization_id);
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
    enableAwardCreation() {
      this.awardCreationEnabled = true;
    },
    closeAwardCreation() {
      this.awardCreationEnabled = false;
      this.getAwardsList(this.profileStore.profileInfo.profile.organization_id);
    },
    async getAwardsList(orgID) {
      try {
        const response = await axios.get(API_URIS.awardTypes.replace("organization_id", orgID));
        this.awardsList = response.data.data;
      } catch(err) {
        throw err;
      }
    }
  }
};
</script>

<style scoped>
.awards {
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
.add_award {
  position: relative;
  height: 38px;
  width: 38px;
  border-radius: 8px;
  padding: 7px;
}

.awards_list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
