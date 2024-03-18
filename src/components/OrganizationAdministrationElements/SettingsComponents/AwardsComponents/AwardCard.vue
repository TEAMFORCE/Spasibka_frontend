<template>
  <div class="award_card general-white-bg">
    <AwardDeletionForm
      v-if="awardDeletionEnabled"
      @closeAwardDeletion="closeAwardDeletion"
      :awardID="award.id"
    />
    <AwardEditionForm
      v-if="awardEditionEnabled"
      @closeAwardEdition="closeAwardEdition"
      :award="award"
    />
    <button
      v-click-outside="closeAwardOptions"
      class="award_parameters brand-secondary-bg"
      @click="toggleAwardOptions"
    >
      <div v-if="awardOptionsEnabled" class="award_parameters_options">
        <button 
          @click="openAwardEdition"
          class="award_parameter_option_button round_borders general-white-bg"
        >
          {{ $t("organization.settings.edit_award") }}
        </button>
        <!-- <button 
          @click="openAwardDeletion"
          class="award_parameter_option_button round_bottom general-white-bg"
        >
          {{ $t("organization.settings.delete_award") }}
        </button> -->
      </div>
      <ScaleParametersIcon class="scale_parameters_icon" />
    </button>
    <img 
      v-if="award.cover"
      class="award_cover"
      :src="photoAddress(award.cover)"
    />
    <div class="award_header">
      <h1 class="award_name general-contrast-color">{{ award.name }}</h1>
      <h1 class="award_description second-colo-color">{{ award.description }}</h1>
    </div>
    <div class="info_list">
      <div class="info_block">
        <h1 class="info_header general-secondary-color">{{ $t("organization.settings.scale") }}</h1>
        <h1 class="info_value general-contrast-color">{{ award.scale_name }}</h1>
      </div>
      <div class="info_block">
        <h1 class="info_header general-secondary-color">{{ $t("organization.settings.scale_points") }}</h1>
        <h1 class="info_value general-contrast-color">{{ award.amount }}</h1>
      </div>
      <div class="info_block">
        <h1 class="info_header general-secondary-color">{{ $t("organization.settings.category") }}</h1>
        <h1 class="info_value general-contrast-color">{{ award.award_group_name ? award.award_group_name : "-" }}</h1>
      </div>
      <div class="info_block">
        <h1 class="info_header general-secondary-color">{{ $t("organization.settings.restriction_by_period") }}</h1>
        <h1 class="info_value general-contrast-color">{{ award.lifetime ? $t("general.yes") : $t("general.no") }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import ScaleParametersIcon from "@/components/Icons/OrganizationAdministrationIcons/ScaleParametersIcon.vue";
import { photoAddress } from "@/general-scripts/photo-address";
import { formatTimestamp } from "@/general-scripts/timestamps";
import AwardEditionForm from "./AwardEditionForm.vue";
import AwardDeletionForm from "./AwardDeletionForm.vue";

export default {
  name: "ScaleCard",
  components: { ScaleParametersIcon, AwardEditionForm, AwardDeletionForm },
  props: {
    award: {
      required: true,
    },
  },
  data() {
    return {
      awardOptionsEnabled: false,
      awardEditionEnabled: false,
      awardDeletionEnabled: false,

      eventsMapper: {
        "A": this.$t("organization.settings.fill_out_profile"),
        "B": this.$t("organization.settings.first_transaction"),
        "C": this.$t("organization.settings.first_challenge"),
        "D": this.$t("organization.settings.active_beginner"),
        "E": this.$t("organization.settings.traveler"),
        "F": this.$t("organization.settings.several_logins_in_a_row"),
        "G": this.$t("organization.settings.outgoing_transaction"),
        "H": this.$t("organization.settings.birthday"),
        "I": this.$t("organization.settings.participation_in_challenge")
      }
    };
  },
  methods: {
    photoAddress: photoAddress,
    openAwardDeletion() {
      this.awardDeletionEnabled = true;
    },
    closeAwardDeletion() { 
      this.awardDeletionEnabled = false;
      this.$emit("closeAwardCreation");
    },
    openAwardEdition() {
      this.awardEditionEnabled = true;
    },
    closeAwardEdition() {
      this.awardEditionEnabled = false;
      this.$emit("closeAwardCreation");
    },
    closeAwardOptions() {
      this.awardOptionsEnabled = false;
    },
    toggleAwardOptions() {
      this.awardOptionsEnabled ^= true;
    },
    formatDate(date) {
      if (!date) return "-";
      let startDate = formatTimestamp(date);
      return String(startDate.day).padStart(2, '0') + "." + String(startDate.month + 1).padStart(2, '0') + "." + startDate.year;
    },
    scaleFactors(events) {
      let eventNames = "";
      for (let i = 0; i < events?.length; ++i) {
        eventNames += this.eventsMapper[events[i].system_event_type];
        if (i < events?.length - 1) {
          eventNames += ", ";
        }
      }
      if (!eventNames) {
        eventNames = "-";
      }
      return eventNames;
    },
  }
};
</script>

<style scoped>
.award_card {
  position: relative;
  width: 396px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.award_parameters {
  height: 24px;
  width: 24px;
  border-radius: 8px;
  padding: 4px;
  position: absolute;
  right: 20px;
  top: 20px;
}
.award_parameters_options {
  z-index: 13;
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.award_parameter_option_button {
  position: relative;
  z-index: 13;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  padding: 6px;
  border: 1px solid var(--generalContrast);
  white-space: nowrap;
}
.award_parameter_option_button.round_top {
  border-radius: 12px 12px 0 0;
}
.award_parameter_option_button.round_bottom {
  border-radius: 0 0 12px 12px;
  border-top: none;
}
.award_parameter_option_button.round_borders {
  border-radius: 12px;
}
.award_cover {
  height: 52px;
  width: 52px;
  object-fit: cover;
}
.award_header {
  display: flex;
  flex-direction: column;
}
.award_name {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
}
.award_description {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
.info_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info_block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.info_header {
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
}
.info_value {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
</style>
