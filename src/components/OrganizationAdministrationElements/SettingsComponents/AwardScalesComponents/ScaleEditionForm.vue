<template>
  <div class="scale_creation_form_wrapper">
    <div class="scale_creation_form general-white-bg">
      <ScalefactorEditionForm
        v-if="factorEditionEnabled"
        :factor="scaleFactors[currentFactorIndex]"
        @cancelFactorEdition="cancelFactorEdition"
        @confirmFactorEdition="confirmFactorEdition"
      />
      <div class="scale_creation_header">
        <h1 class="scale_creation_header_text general-contrast-color">
          {{ $t("organization.settings.scale_edition") }}
        </h1>
        <h1 class="scale_creation_header_text general-contrast-color">
          {{ $t("organization.settings.step") + " " + this.step + "/2" }}
        </h1>
      </div>
      <h1 class="secondary_header_text general-secondary-color">
        {{ secondaryHeaderText }}
      </h1>
      <div v-show="step === 1" class="field_inputs">
        <div class="input_field_wrapper">
          <div
            v-if="scaleName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.title") }}
          </div>
          <input
            class="scale_creation_text_input general-contrast-color general-white-bg"
            v-model="scaleName"
            :placeholder="$t('organization.settings.title')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="scaleDescription"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.description") }}
          </div>
          <textarea
            class="scale_creation_text_input textarea_height general-contrast-color general-white-bg"
            v-model="scaleDescription"
            :placeholder="$t('organization.settings.description')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="scaleStartDate"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.start_date") }}
          </div>
          <Datepicker
            v-model="scaleStartDate"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            :clearable="true"
            :placeholder="$t('organization.settings.start_date')"
            :enable-time-picker="false"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="scaleEndDate"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.end_date") }}
          </div>
          <Datepicker
            v-model="scaleEndDate"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            :clearable="true"
            :placeholder="$t('organization.settings.end_date')"
            :enable-time-picker="false"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <div class="period_setting">
          <input v-model="isPeriodic" type="checkbox" class="checkbox" />
          <h1 class="is_periodic_setting_text general-contrast-color">
            {{ $t("organization.settings.count_within_bounds_of_period") }}
          </h1>
        </div>
      </div>
      <div v-show="step === 2" class="field_inputs">
        <vSelect
          v-model="selectedEvent"
          :options="eventsList"
          :placeholder="$t('organization.settings.events')"
          label="name"
          @option:selected="addEvent"
        />
        <div v-for="(factor, index) in scaleFactors" class="scalefactor">
          <h1 class="scalefactor_name general-contrast-color">
            {{ factor.name }}
          </h1>
          <div class="scalefactor_action_buttons">
            <button
              @click="openScalefactorEdition(index)"
              class="scalefactor_action_button brand-secondary-bg"
            >
              <EditScalefactorIcon class="scalefactor_action_icon" />
            </button>
            <button
              @click="deleteScalefactor(index)"
              class="scalefactor_action_button brand-secondary-bg"
            >
              <DeleteScalefactorIcon class="scalefactor_action_icon" />
            </button>
          </div>
        </div>
      </div>
      <div class="action_buttons">
        <button
          @click="proceedNext"
          class="action_button general-brand-bg general-white-color"
        >
          {{ proceedNextButtonText }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="goBack"
        >
          {{ goBackButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { notify } from "@/general-scripts/toast-notification";
import Datepicker from "@vuepic/vue-datepicker";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import vSelect from "vue-select";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import EditScalefactorIcon from "@/components/Icons/OrganizationAdministrationIcons/EditScalefactorIcon.vue";
import DeleteScalefactorIcon from "@/components/Icons/OrganizationAdministrationIcons/DeleteScalefactorIcon.vue";
import ScalefactorEditionForm from "./ScalefactorEditionForm.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "ScaleEditionForm",
  emits: ["closeScaleEdition"],
  props: {
    scale: {
      required: true,
    },
  },
  components: {
    Datepicker,
    vSelect,
    EditScalefactorIcon,
    DeleteScalefactorIcon,
    ScalefactorEditionForm,
    CloseIcon,
  },
  data() {
    return {
      step: 1,
      scaleName: "",
      scaleDescription: "",
      selectedEvent: null,
      scaleStartDate: null,
      scaleEndDate: null,
      eventsList: [],
      scaleFactors: [],
      currentFactorIndex: null,
      factorEditionEnabled: false,
      isPeriodic: false,

      eventsMapper: {
        A: this.$t("organization.settings.fill_out_profile"),
        B: this.$t("organization.settings.first_transaction"),
        C: this.$t("organization.settings.first_challenge"),
        D: this.$t("organization.settings.active_beginner"),
        E: this.$t("organization.settings.traveler"),
        F: this.$t("organization.settings.several_logins_in_a_row"),
        G: this.$t("organization.settings.outgoing_transaction"),
        H: this.$t("organization.settings.birthday"),
        I: this.$t("organization.settings.participation_in_challenge"),
      },
    };
  },
  mounted() {
    this.scaleFactors = this.scale.scale_factors;
    for (let i = 0; i < this.scaleFactors?.length; ++i) {
      this.scaleFactors[i].name =
        this.eventsMapper[
          this.scaleFactors[i].system_event_type || this.scaleFactors[i].type
        ];
    }
    this.scaleName = this.scale.name;
    this.scaleDescription = this.scale.description;
    this.scaleStartDate = this.scale.start_date;
    this.scaleEndDate = this.scale.end_date;
    this.isPeriodic = this.scale.is_periodic;
  },
  watch: {
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal?.profile) {
          this.getSystemEvents(newVal.profile.organization_id);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapStores(useProfileStore),
    secondaryHeaderText() {
      if (this.step === 1) {
        return this.$t("organization.settings.add_main_scale_info");
      } else {
        return this.$t("organization.settings.add_scale_advance_events");
      }
    },
    proceedNextButtonText() {
      if (this.step === 1) {
        return this.$t("organization.settings.continue");
      } else {
        return this.$t("organization.settings.create");
      }
    },
    goBackButtonText() {
      return this.$t("organization.settings.back");
    },
  },
  methods: {
    proceedNext() {
      try {
        if (this.step === 1) {
          if (!this.scaleName) {
            throw new Error(this.$t("organization.settings.enter_scale_name"));
          }
          if (!this.scaleDescription) {
            throw new Error(
              this.$t("organization.settings.enter_scale_description")
            );
          }
          this.step = 2;
        } else {
          this.createScale();
        }
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    goBack() {
      if (this.step === 2) {
        this.step = 1;
      } else {
        this.$emit("closeScaleEdition");
      }
    },
    addEvent(event) {
      this.scaleFactors.push(JSON.parse(JSON.stringify(event)));
      this.selectedEvent = null;
    },
    deleteScalefactor(index) {
      this.scaleFactors.splice(index, 1);
    },
    openScalefactorEdition(index) {
      this.currentFactorIndex = index;
      this.factorEditionEnabled = true;
    },
    cancelFactorEdition() {
      this.factorEditionEnabled = false;
    },
    confirmFactorEdition(additionalCondition, sum, percentage) {
      try {
        this.scaleFactors[this.currentFactorIndex].additional_condition =
          additionalCondition;
        if (percentage || String(percentage).charAt(0) === "0") {
          let number = percentage;
          if (number.endsWith("%")) {
            number = number.slice(0, -1);
          }
          this.scaleFactors[this.currentFactorIndex].relation = number / 100;
        } else {
          delete this.scaleFactors[this.currentFactorIndex].relation;
        }
        if (sum || String(sum).charAt(0) === "0") {
          this.scaleFactors[this.currentFactorIndex].score = parseFloat(sum);
        } else {
          delete this.scaleFactors[this.currentFactorIndex].score;
        }
        this.factorEditionEnabled = false;
        notify(this.$t("organization.settings.scalefactor_edited"), "success");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async getSystemEvents(orgID) {
      try {
        const response = await axios.get(
          API_URIS.systemEvents.replace("organization_id", orgID)
        );
        this.eventsList = response.data.data.map((obj) => ({
          ...obj,
          name: this.eventsMapper[obj.type],
        }));
      } catch (err) {
        throw err;
      }
    },
    async createScale() {
      try {
        let scaleObject = {
          name: this.scaleName,
          description: this.scaleDescription,
          is_periodic: this.isPeriodic,
        };
        if (this.scaleStartDate) {
          if (typeof this.scaleStartDate === "string")
            scaleObject.start_date = this.scaleStartDate.slice(0, 10);
          else
            scaleObject.start_date = this.scaleStartDate
              .toISOString()
              .slice(0, 10);
        }
        if (this.scaleEndDate) {
          if (typeof this.scaleEndDate === "string")
            scaleObject.end_date = this.scaleEndDate.slice(0, 10);
          else
            scaleObject.end_date = this.scaleEndDate.toISOString().slice(0, 10);
        }
        let scalefactorsToSend = [];
        for (let i = 0; i < this.scaleFactors.length; ++i) {
          let curObject = {};
          curObject.event_id =
            this.scaleFactors[i].event_id || this.scaleFactors[i].id;
          if (this.scaleFactors[i].additional_condition) {
            curObject.additional_condition =
              this.scaleFactors[i].additional_condition;
          }
          if ("score" in this.scaleFactors[i]) {
            curObject.score = this.scaleFactors[i].score;
          }
          if ("relation" in this.scaleFactors[i]) {
            curObject.relation = this.scaleFactors[i].relation;
          }
          scalefactorsToSend.push(curObject);
        }
        await axios.patch(
          API_URIS.scales.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ) + this.scale.id,
          {
            scale: scaleObject,
            scale_factors: scalefactorsToSend,
          }
        );
        this.$emit("closeScaleEdition");
        notify(this.$t("organization.settings.scale_got_edited"), "success");
      } catch (err) {
        notify(
          err?.response?.data?.errors ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.scale_creation_form_wrapper {
  position: fixed;
  z-index: 1001;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.scale_creation_form {
  z-index: 1000;
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 52px 32px 32px 32px;
  gap: 24px;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
}
.scale_creation_header {
  display: flex;
  justify-content: space-between;
}
.scale_creation_header_text {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
}
.period_setting {
  display: flex;
  gap: 16px;
  align-items: center;
}
.is_periodic_setting_text {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
}
.field_inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.scale_creation_text_input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 16px;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
::v-deep(.dp__input) {
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.textarea_height {
  height: 100px;
  resize: vertical;
}
.secondary_header_text {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.scalefactor {
  display: flex;
  justify-content: space-between;
  padding: 16px 12px;
  border-radius: 12px;
  gap: 12px;
  align-items: center;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.scalefactor_name {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
}
.scalefactor_action_buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}
.scalefactor_action_button {
  display: flex;
  padding: 4px;
  border-radius: 8px;
}
.scalefactor_action_icon {
  height: 16px;
  width: 16px;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>