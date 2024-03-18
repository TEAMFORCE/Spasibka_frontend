<template>
  <div class="award_edition_form_wrapper">
    <div class="award_edition_form general-white-bg">
      <div class="award_edition_header">
        <h1 class="award_edition_header_text general-contrast-color">
          {{ $t("organization.settings.award_edition") }}
        </h1>
        <h1 class="award_edition_header_text general-contrast-color">
          {{ $t("organization.settings.step") + " " + this.step + "/2" }}
        </h1>
      </div>
      <h1 class="secondary_header_text general-secondary-color">
        {{ secondaryHeaderText }}
      </h1>
      <div v-show="step === 1" class="field_inputs">
        <div class="input_field_wrapper">
          <div
            v-if="awardName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.title") }}
          </div>
          <input
            class="award_edition_text_input general-contrast-color general-white-bg"
            v-model="awardName"
            :placeholder="$t('organization.settings.title')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="awardAchievementConditions"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.achievement_conditions") }}
          </div>
          <textarea
            class="award_edition_text_input textarea_height general-contrast-color general-white-bg"
            v-model="awardAchievementConditions"
            :placeholder="$t('organization.settings.achievement_conditions')"
          />
        </div>
        <h1 class="input_field_description general-secondary-color">
          {{
            $t(
              "organization.settings.use_short_description_for_achievement_conditions"
            )
          }}
        </h1>
        <!-- <input
          class="award_edition_text_input general-contrast-color general-white-bg"
          v-model="awardPoints"
          :placeholder="$t('organization.settings.points_for_achievement')"
        /> -->
        <input type="file" id="fileUpload" @change="handleFileInput" hidden />
        <label
          for="fileUpload"
          class="upload_photo_button general-brand-color general-white-bg"
        >
          <AddAwardPhotoIcon class="add_award_photo_icon" />
          {{ $t("organization.settings.award_photo") }}
        </label>
        <h1 class="input_field_description general-secondary-color">
          {{ $t("organization.settings.upload_photo_in_png") }}
        </h1>
        <div v-if="awardPhoto" class="award_photo_wrapper">
          <img :src="awardPhotoURL" class="award_photo" />
          <DeleteTelegramGroupIcon
            @click="deletePhoto"
            class="delete_photo_icon"
          />
        </div>
      </div>
      <div v-show="step === 2" class="field_inputs">
        <div class="input_field_wrapper">
          <div
            v-if="selectedAwardGroup"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.type") }}
          </div>
          <vSelect
            v-model="selectedAwardGroup"
            :options="awardGroupsList"
            :placeholder="$t('organization.settings.type')"
            label="name"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="selectedAwardScale"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.scale") }}
          </div>
          <vSelect
            v-model="selectedAwardScale"
            :options="awardScalesList"
            :placeholder="$t('organization.settings.scale')"
            label="name"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="scaleActionsSum"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.scale_actions_sum") }}
          </div>
          <input
            class="award_edition_text_input general-contrast-color general-white-bg"
            v-model="scaleActionsSum"
            :placeholder="$t('organization.settings.scale_actions_sum')"
          />
        </div>
        <h1 class="input_field_description general-secondary-color">
          {{ $t("organization.settings.scale_actions_sum_field_description") }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="awardExpireDate"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.award_expire_date") }}
          </div>
          <Datepicker
            v-model="awardExpireDate"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            :clearable="true"
            :placeholder="$t('organization.settings.award_expire_date')"
            :enable-time-picker="false"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <div class="is_award_active">
          <input class="checkbox" type="checkbox" v-model="isAwardActive" />
          <h1 class="is_award_active_text general-secondary-color">
            {{ $t("organization.settings.award_active") }}
          </h1>
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
import AddAwardPhotoIcon from "@/components/Icons/OrganizationAdministrationIcons/AddAwardPhotoIcon.vue";
import DeleteTelegramGroupIcon from "@/components/Icons/OrganizationAdministrationIcons/DeleteTelegramGroupIcon.vue";
import { photoAddress } from "@/general-scripts/photo-address";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "AwardEditionForm",
  emits: ["closeAwardEdition"],
  components: {
    Datepicker,
    AddAwardPhotoIcon,
    vSelect,
    DeleteTelegramGroupIcon,
    CloseIcon,
  },
  props: {
    award: {
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      awardName: "",
      awardAchievementConditions: "",
      awardPoints: null,
      awardPhoto: null,
      awardPhotoURL: null,
      selectedAwardGroup: null,
      selectedAwardScale: null,
      scaleActionsSum: null,
      awardExpireDate: null,
      isAwardActive: false,
      awardGroupsList: [],
      awardScalesList: [],
    };
  },
  mounted() {
    this.awardName = this.award.name;
    this.awardAchievementConditions = this.award.description;
    this.scaleActionsSum = this.award.amount;
    this.isAwardActive = this.award.is_active;
    if (this.award.cover) {
      this.awardPhotoURL = photoAddress(this.award.cover);
      fetch("/api" + this.award.cover)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const file = new File([imageBlob], "filename.jpg", {
            type: imageBlob.type,
          });
          this.awardPhoto = file;
        });
    }
  },
  watch: {
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal?.profile) {
          this.getAwardTypeInfo(newVal.profile.organization_id);
          this.getAwardTypes(newVal.profile.organization_id);
          this.getAwardScales(newVal.profile.organization_id);
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
        return this.$t("organization.settings.add_main_award_info");
      } else {
        return this.$t("organization.settings.add_award_scale_info");
      }
    },
    proceedNextButtonText() {
      if (this.step === 1) {
        return this.$t("organization.settings.continue");
      } else {
        return this.$t("organization.settings.edit");
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
          if (!this.awardName) {
            throw new Error(this.$t("organization.settings.enter_award_name"));
          }
          if (!this.awardAchievementConditions) {
            throw new Error(
              this.$t(
                "organization.settings.enter_award_achievement_conditions"
              )
            );
          }
          // if (!this.awardPoints) {
          //   throw new Error(this.$t("organization.settings.enter_award_points"));
          // }
          this.step = 2;
        } else {
          if (!this.selectedAwardScale) {
            throw new Error(this.$t("organization.settings.select_scale"));
          }
          if (!this.scaleActionsSum) {
            throw new Error(
              this.$t("organization.settings.enter_scale_actions_sum")
            );
          }
          this.editAwardType();
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
        this.$emit("closeAwardEdition");
      }
    },
    handleFileInput(event) {
      this.awardPhoto = event.target.files[0];
      this.awardPhotoURL = URL.createObjectURL(this.awardPhoto);
    },
    deletePhoto() {
      this.awardPhoto = null;
      this.awardPhotoURL = null;
    },
    async getAwardTypeInfo(orgID) {
      try {
        const response = await axios.get(
          API_URIS.awardTypes.replace("organization_id", orgID) + this.award.id
        );
        this.isAwardActive = response.data.is_active;
        this.awardExpireDate = response.data.death_date;
      } catch (err) {
        throw err;
      }
    },
    async getAwardTypes(orgID) {
      try {
        const response = await axios.get(
          API_URIS.awardGroups.replace("organization_id", orgID)
        );
        this.awardGroupsList = response.data.data;
        for (let i = 0; i < this.awardGroupsList.length; ++i) {
          if (this.awardGroupsList[i].id === this.award.award_group_id) {
            this.selectedAwardGroup = this.awardGroupsList[i];
          }
        }
      } catch (err) {
        throw err;
      }
    },
    async getAwardScales(orgID) {
      try {
        const response = await axios.get(
          API_URIS.scales.replace("organization_id", orgID)
        );
        this.awardScalesList = response.data.data;
        for (let i = 0; i < this.awardScalesList.length; ++i) {
          if (this.awardScalesList[i].id === this.award.scale_id) {
            this.selectedAwardScale = this.awardScalesList[i];
          }
        }
      } catch (err) {
        throw err;
      }
    },
    async editAwardType() {
      try {
        let requestObject = new FormData();
        requestObject.append("name", this.awardName);
        requestObject.append("description", this.awardAchievementConditions);
        requestObject.append("amount", this.scaleActionsSum);
        requestObject.append("scale_id", this.selectedAwardScale.id);
        requestObject.append("is_active", this.isAwardActive);
        if (this.selectedAwardGroup)
          requestObject.append("award_group_id", this.selectedAwardGroup.id);
        if (this.awardExpireDate) {
          if (typeof this.awardExpireDate === "string")
            requestObject.append(
              "death_date",
              this.awardExpireDate.slice(0, 10)
            );
          else
            requestObject.append(
              "death_date",
              this.awardExpireDate.toISOString().slice(0, 10)
            );
        }
        if (this.awardPhoto) requestObject.append("cover", this.awardPhoto);
        await axios.patch(
          API_URIS.awardTypes.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ) + this.award.id,
          requestObject
        );
        this.$emit("closeAwardEdition");
        notify(this.$t("organization.settings.award_got_edited"), "success");
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
.award_edition_form_wrapper {
  position: fixed;
  z-index: 1000;
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
.award_edition_form {
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
.award_edition_header {
  display: flex;
  justify-content: space-between;
}
.award_edition_header_text {
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
.award_edition_text_input {
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
.input_field_description {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.upload_photo_button {
  padding: 17px;
  border: 1px solid var(--generalBrand);
  border-radius: 12px;
  display: flex;
  gap: 8px;
  justify-content: center;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
.add_award_photo_icon {
  height: 24px;
  width: 24px;
}
.award_photo_wrapper {
  height: 60px;
  width: 60px;
  position: relative;
}
.award_photo_wrapper:hover > .award_photo {
  opacity: 50%;
}
.award_photo {
  position: relative;
  border-radius: 12px;
  height: 60px;
  width: 60px;
  object-fit: cover;
  cursor: pointer;
}
.award_photo:hover {
  opacity: 50%;
}
.delete_photo_icon {
  display: none;
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
}
.delete_photo_icon:hover {
  display: block;
}
.is_award_active {
  display: flex;
  gap: 8px;
  align-items: center;
}
.is_award_active_text {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.award_photo:hover + .delete_photo_icon {
  display: block;
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