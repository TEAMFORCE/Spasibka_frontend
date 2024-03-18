<template>
  <div class="scale general-white-bg">
    <ScaleDeletionForm
      v-if="scaleDeletionEnabled"
      @closeScaleDeletion="closeScaleDeletion"
      :scaleID="scale.id"
    />
    <ScaleEditionForm
      v-if="scaleEditionEnabled"
      @closeScaleEdition="closeScaleEdition"
      :scale="scale"
    />
    <button
      v-click-outside="closeScaleOptions"
      class="scale_parameters brand-secondary-bg"
      @click="toggleScaleOptions"
    >
      <div v-if="scaleOptionsEnabled" class="scale_parameters_options">
        <button 
          @click="openScaleEdition"
          class="scale_parameter_option_button round_top general-white-bg"
        >
          {{ $t("organization.settings.edit_scale") }}
        </button>
        <button 
          @click="openScaleDeletion"
          class="scale_parameter_option_button round_bottom general-white-bg"
        >
          {{ $t("organization.settings.delete_scale") }}
        </button>
      </div>
      <ScaleParametersIcon class="scale_parameters_icon" />
    </button>
    <div class="scale_header">
      <h1 class="scale_name general-contrast-color">{{ scale.name }}</h1>
      <h1 class="scale_description second-colo-color">{{ scale.description }}</h1>
    </div>
    <div class="info_block">
      <h1 class="info_header general-secondary-color">
        {{ $t("organization.settings.start_date") }}
      </h1>
      <h1 class="info_value general-contrast-color">
        {{ formatDate(scale.start_date) }}
      </h1>
    </div>
    <div class="info_block">
      <h1 class="info_header general-secondary-color">
        {{ $t("organization.settings.end_date") }}
      </h1>
      <h1 class="info_value general-contrast-color">
        {{ formatDate(scale.end_date) }}
      </h1>
    </div>
    <div class="info_block">
      <h1 class="info_header general-secondary-color">
        {{ $t("organization.settings.is_counted_within_period") }}
      </h1>
      <h1 class="info_value general-contrast-color">
        {{ scale.is_periodic ? $t("general.yes") : $t("general.no") }}
      </h1>
    </div>
    <div class="info_block">
      <h1 class="info_header general-secondary-color">
        {{ $t("organization.settings.events") }}
      </h1>
      <h1 class="info_value general-contrast-color">
        {{ scaleFactors(scale.scale_factors) }}
      </h1>
    </div>
    <div class="scalefactors_info">
      <div
        class="scalefactors_info_block"
        v-for="scalefactor in scale.scale_factors"
      >
        <h1 class="scalefactor_name general-contrast-color">
          {{ eventsMapper[scalefactor.system_event_type] }}
        </h1>
        <div class="scalefactor_details">
          <h1 class="scalefactor_detail_header general-secondary-color">
            {{ $t("organization.settings.sum") }}
          </h1>
          <h1 class="scalefactor_detail_value general-contrast-color">
            {{ String(scalefactor.score) || "-" }}
          </h1>
        </div>
        <div class="scalefactor_details">
          <h1 class="scalefactor_detail_header general-secondary-color">
            {{ $t("organization.settings.percentage") }}
          </h1>
          <h1 class="scalefactor_detail_value general-contrast-color">
            {{ String(scalefactor.relation) ? scalefactor.relation * 100 + "%" : "-" }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScaleParametersIcon from "@/components/Icons/OrganizationAdministrationIcons/ScaleParametersIcon.vue";
import { formatTimestamp } from "@/general-scripts/timestamps";
import ScaleEditionForm from "./ScaleEditionForm.vue";
import ScaleDeletionForm from "./ScaleDeletionForm.vue";

export default {
  name: "ScaleCard",
  components: { ScaleParametersIcon, ScaleEditionForm, ScaleDeletionForm },
  props: {
    scale: {
      required: true,
    },
  },
  data() {
    return {
      scaleOptionsEnabled: false,
      scaleEditionEnabled: false,
      scaleDeletionEnabled: false,

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
    openScaleDeletion() {
      this.scaleDeletionEnabled = true;
    },
    closeScaleDeletion() { 
      this.scaleDeletionEnabled = false;
      this.$emit("closeScaleDeletion");
    },
    openScaleEdition() {
      this.scaleEditionEnabled = true;
    },
    closeScaleEdition() {
      this.scaleEditionEnabled = false;
      this.$emit("closeScaleEdition")
    },
    closeScaleOptions() {
      this.scaleOptionsEnabled = false;
    },
    toggleScaleOptions() {
      this.scaleOptionsEnabled ^= true;
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
.scale {
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
.scale_parameters {
  height: 24px;
  width: 24px;
  border-radius: 8px;
  padding: 4px;
  position: absolute;
  right: 20px;
  top: 20px;
}
.scale_parameters_options {
  z-index: 13;
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.scale_parameter_option_button {
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
.scale_parameter_option_button.round_top {
  border-radius: 12px 12px 0 0;
}
.scale_parameter_option_button.round_bottom {
  border-radius: 0 0 12px 12px;
  border-top: none;
}


.scale_header {
  display: flex;
  flex-direction: column;
}
.scale_name {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
}
.scale_description {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
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
.scalefactors_info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.scalefactors_info_block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.scalefactor_name {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;
}
.scalefactor_details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.scalefactor_detail_header {
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
}
.scalefactor_detail_value {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
</style>
