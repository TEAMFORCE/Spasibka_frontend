<template>
  <div class="settings_branding_wrapper">
    <div class="settings_form">
      <div class="logo_input_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.formBranding.logoTitleTwo") }}
        </h1>
        <input
          placeholder="PHOTO..."
          type="file"
          id="logo_file_input_two"
          class="logo_input"
          :accept="allowedFileExtensions"
          ref="imageUploaderTwo"
          @change="logoUpdatedTwo"
        />
        <h4 class="logo_file_input_description">
          {{ $t("organization.settings.formBranding.logoDescriptionTwo") }}
        </h4>
        <label
          for="logo_file_input_two"
          class="label_for_logo_file_input_wrapper"
        >
          <div class="label_for_logo_file_input">
            <span class="label_placeholder">
              {{ logoPlaceholderTwo }}
            </span>
            <span class="label_select_button">
              {{ $t("organization.settings.formBranding.logoReview") }}
            </span>
          </div>
        </label>
      </div>
      <div class="logo_input_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.formBranding.logoTitle") }}
        </h1>
        <input
          placeholder="PHOTO..."
          type="file"
          id="logo_file_input"
          class="logo_input"
          :accept="allowedFileExtensions"
          ref="imageUploader"
          @change="logoUpdated"
        />
        <label for="logo_file_input" class="label_for_logo_file_input_wrapper">
          <div class="label_for_logo_file_input">
            <span class="label_placeholder">
              {{ logoPlaceholder }}
            </span>
            <span class="label_select_button">
              {{ $t("organization.settings.formBranding.logoReview") }}
            </span>
          </div>
        </label>
      </div>
      <div class="name_input_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.formBranding.bonusname") }}
        </h1>
        <input
          type="text"
          :placeholder="
            $t('organization.settings.formBranding.namePlaceholder')
          "
          class="form_input"
          v-model="formData.bonusname"
        />
      </div>
      <div class="name_input_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.formBranding.name") }}
        </h1>
        <input
          type="text"
          :placeholder="
            $t('organization.settings.formBranding.namePlaceholder')
          "
          class="form_input"
          v-model="formData.name"
        />
      </div>
      <div class="telegram_input_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.formBranding.telegram") }}
        </h1>
        <vSelect
          class="telegram_input"
          v-model="formData.telegram_group"
          :placeholder="
            $t('organization.settings.formBranding.telegramPlaceholder')
          "
          no-drop
          taggable
          multiple
        />
      </div>

      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.accentColor") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['general-brand']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['general-brand']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['general-brand']"
              @update:modelValue="changeColor('general-brand')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.mainColor") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['general-brand-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['general-brand-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['general-brand-secondary']"
              @update:modelValue="changeColor('general-brand-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.backgroundColor") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['general-negative']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['general-negative']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['general-negative']"
              @update:modelValue="changeColor('general-negative')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.borderColor") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-negative-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-negative-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-negative-secondary']"
              @update:modelValue="changeColor('minor-negative-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.bodyTextColor") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['general-contrast']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['general-contrast']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['general-contrast']"
              @update:modelValue="changeColor('general-contrast')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.labelColor") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['general-contrast-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['general-contrast-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['general-contrast-secondary']"
              @update:modelValue="changeColor('general-contrast-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.colorBorders") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['general-midpoint']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['general-midpoint']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['general-midpoint']"
              @update:modelValue="changeColor('general-midpoint')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.successNotification") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-success']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-success']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-success']"
              @update:modelValue="changeColor('minor-success')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.successNotificationBackground") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-success-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-success-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-success-secondary']"
              @update:modelValue="changeColor('minor-success-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.errorNotification") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-error']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-error']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-error']"
              @update:modelValue="changeColor('minor-error')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.errorNotificationBackground") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-error-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-error-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-error-secondary']"
              @update:modelValue="changeColor('minor-error-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.warning") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-warning']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-warning']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-warning']"
              @update:modelValue="changeColor('minor-warning')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.backgroundWarning") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-warning-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-warning-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-warning-secondary']"
              @update:modelValue="changeColor('minor-warning-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{ $t("organization.settings.colors.gratitudeCategoryHashtags") }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-info']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-info']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-info']"
              @update:modelValue="changeColor('minor-info')"
            ></Chrome>
          </div>
        </div>
      </div>
      <div class="color_picker_wrapper">
        <h1 class="input_wrapper_title">
          {{
            $t(
              "organization.settings.colors.gratitudeCategoryBackgroundHashtags"
            )
          }}
        </h1>
        <div class="color_input">
          <div
            class="color_example"
            :style="`background-color: ${colorSchemeList['minor-info-secondary']}`"
          ></div>
          <input
            class="color_hex"
            type="text"
            v-model="colorSchemeList['minor-info-secondary']"
          />
          <div class="color_picker">
            <Chrome
              v-model="colorSchemeList['minor-info-secondary']"
              @update:modelValue="changeColor('minor-info-secondary')"
            ></Chrome>
          </div>
        </div>
      </div>

      <div class="save_button_wrapper">
        <button class="save_button" @click="changeSettings">
          {{ $t("organization.settings.formBranding.save") }}
        </button>
        <button class="return_button" @click="returnBaseColors">
          {{ $t("organization.settings.formBranding.baseColors") }}
        </button>
      </div>
    </div>

    <div class="branding_phone_frame_wrapper">
      <BrandingPhoneFrame :colorSchemeList="colorSchemeList" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import vSelect from "vue-select";
import { Chrome } from "@ckpack/vue-color";

import { organizationSettingsStore } from "@/store/organization-settings";

import BrandingPhoneFrame from "@/components/OrganizationAdministrationElements/SettingsComponents/phone-frame.vue";

export default {
  name: "OrganizationSettingsBranding",
  components: {
    vSelect,
    Chrome,
    BrandingPhoneFrame,
  },
  props: {
    settings: {
      required: true,
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      logoPlaceholder: this.$t(
        "organization.settings.formBranding.logoPlaceholder"
      ),
      logoPlaceholderTwo: this.$t(
        "organization.settings.formBranding.logoPlaceholder"
      ),
      formData: {
        name: "",
        telegram_group: [],
        photo: null,
        photo2: null,
        bonusname: "",
      },
      telegramIds: null,

      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],

      colorSchemeList: {
        extra1: "#ACD5F8",
        extra2: "#FAE38E",

        "general-brand": "#F15929",
        "general-brand-secondary": "#FFF0D9",

        "general-negative": "#FFFFFF",
        "minor-negative-secondary": "#EAEAEA",

        "general-contrast": "#212121",
        "general-contrast-secondary": "#8A8A8E",

        "general-midpoint": "#CECECE",

        "minor-success": "#42AB44",
        "minor-success-secondary": "#EDF8ED",

        "minor-error": "#FF4E4E",
        "minor-error-secondary": "#FEEFEF",

        "minor-warning": "#FCCE2A",
        "minor-warning-secondary": "#FFF4EC",

        "minor-info": "#2E5AAC",
        "minor-info-secondary": "#EEF2FA",
      },
      defaultColors: {
        extra1: "#ACD5F8",
        extra2: "#FAE38E",

        "general-brand": "#F15929",
        "general-brand-secondary": "#FFF0D9",

        "general-negative": "#FFFFFF",
        "minor-negative-secondary": "#EAEAEA",

        "general-contrast": "#212121",
        "general-contrast-secondary": "#8A8A8E",

        "general-midpoint": "#CECECE",

        "minor-success": "#42AB44",
        "minor-success-secondary": "#EDF8ED",

        "minor-error": "#FF4E4E",
        "minor-error-secondary": "#FEEFEF",

        "minor-warning": "#FCCE2A",
        "minor-warning-secondary": "#FFF4EC",

        "minor-info": "#2E5AAC",
        "minor-info-secondary": "#EEF2FA",
      },
    };
  },

  watch: {
    settings() {
      this.formData = {
        name: this.settings.name,
        telegram_group: this.settings.telegram_group,
        photo: null,
        photo2: null,
        bonusname: this.settings.bonusname.rawbonusname,
      };
      if (
        this.settings?.colors_json &&
        Object.keys(this.settings.colors_json)?.length > 0
      ) {
        this.colorSchemeList = this.settings.colors_json;
      }
    },
  },
  methods: {
    changeColor(colorName) {
      this.colorSchemeList[colorName] = this.colorSchemeList[colorName].hex;
    },
    openSuccess() {
      this.$moshaToast(
        {
          title: this.$t("organization.settings.notification.success"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "success",
        }
      );
    },
    openError() {
      this.$moshaToast(
        {
          title: this.$t("organization.settings.notification.error"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "danger",
        }
      );
    },
    logoUpdated() {
      const file = this.$refs.imageUploader.files[0];
      this.logoPlaceholder = file.name;
      this.formData.photo = file;
    },
    logoUpdatedTwo() {
      const file = this.$refs.imageUploaderTwo.files[0];
      this.logoPlaceholderTwo = file.name;
      this.formData.photo2 = file;
    },

    async changeSettings() {
      try {
        let forSending = new FormData();
        forSending.append("bonusname", this.formData.bonusname);
        forSending.append("name", this.formData.name);
        for (let i = 0; i < this.formData.telegram_group.length; i++) {
          forSending.append("telegram_group", this.formData.telegram_group[i]);
        }
        forSending.append("colors_json", JSON.stringify(this.colorSchemeList));
        if (this.formData.photo)
          forSending.append("photo", this.formData.photo);
        if (this.formData.photo2) {
          forSending.append("photo2", this.formData.photo2);
        }
        let request = await axios.put(
          API_URIS.organizations + this.$route.params.id + API_URIS.brand,
          forSending
        );
        if (request.status === 200) {
          this.openSuccess();
          this.$emit("settingsChanged");
          this.$router.push(
            "/organization_administration/" + this.$route.params.id
          );
        } else {
          this.openError();
          this.$router.push(
            "/organization_administration/" + this.$route.params.id
          );
        }
      } catch (err) {
        this.openError();
        this.$router.push(
          "/organization_administration/" + this.$route.params.id
        );
        throw err;
      }
    },
    async returnBaseColors() {
      try {
        let forSending = new FormData();
        forSending.append("colors_json", JSON.stringify(this.defaultColors));
        let request = await axios.put(
          API_URIS.organizations + this.$route.params.id + API_URIS.brand,
          forSending
        );
        if (request.status === 200) {
          this.openSuccess();
          this.$emit("settingsChanged");
          this.$router.push(
            "/organization_administration/" + this.$route.params.id
          );
        } else {
          this.openError();
          this.$router.push(
            "/organization_administration/" + this.$route.params.id
          );
        }
      } catch (err) {
        this.openError();
        this.$router.push(
          "/organization_administration/" + this.$route.params.id
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.vc-chrome {
  width: 319px;
}

.settings_branding_wrapper {
  width: 100%;
  display: flex;
  gap: 32px;
  position: relative;
}
.settings_form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 50%;
}
.logo_input_wrapper {
  width: 100%;
  box-sizing: border-box;
}
.logo_input {
  display: none;
  z-index: -1;
  width: 100%;
  max-width: 436px;
}
.input_wrapper_title {
  text-align: left;
  font-size: 16px;
  font-weight: 600 !important;
  font-family: "Golos";
}
.label_for_logo_file_input {
  margin: 16px 0 0 0;
  max-width: 436px;
  width: 100%;
  height: 46px;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px 0 16px;
  box-sizing: border-box;
}
.label_placeholder {
  font-family: "Golos";
  font-weight: 400;
  font-size: 14px;
  color: var(--generalColorSecondary);
}
.label_select_button {
  width: 111px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
  font-size: 16px;
  transition: 0.3s;
}
.label_select_button:hover {
  background-color: #fce5c3;
}
.logo_file_input_description {
  text-align: left;
  font-size: 16px;
  font-weight: 300;
  color: var(--generalColorSecondary);
  margin: 10px 0 0 0;
}

.name_input_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.telegram_input_wrapper {
  width: 99%;
  display: flex;
  flex-direction: column;
}
.telegram_input {
  width: 100%;
  max-width: 436px;
  margin: 16px 0 0 0;
}
.form_input {
  background-color: var(--generalColorWhite);
  margin: 16px 0 0 0;
  width: 100%;
  max-width: 436px;
  height: 18px;
  outline: none;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  padding: 14px 16px;
}
.form_input::placeholder {
  color: var(--generalColorSecondary) !important;
  font-size: 14px;
  font-family: "Golos";
}
.color_picker_wrapper {
  max-width: 436px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.color_input {
  max-width: 402px;
  width: 100%;
  height: 18px;
  border: 1px solid var(--neutral5);
  padding: 14px 16px;
  border-radius: var(--vs-border-radius);
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}
.color_example {
  width: 30px;
  height: 30px;
}
.color_hex {
  background-color: var(--generalColorWhite);
  width: 100%;
  height: 40px;
  border: none;
  font-family: "Golos";
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--generalContrast);
}
.color_picker {
  transition: 0.3s;
  opacity: 0;
  z-index: -1;
  position: absolute;
  bottom: 104%;
  left: 0;
}
.color_input:hover .color_picker {
  opacity: 1;
  z-index: 10;
}
.save_button_wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px 0;
}
.save_button {
  max-width: 200px;
  width: 100%;
  height: 56px;
  margin-top: 16px;
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  padding: 16px 60px;
  border-radius: 12px;
  font-size: 16px;
  font-family: "Roboto";
}
.return_button {
  max-width: 200px;
  width: 100%;
  height: 56px;
  margin-top: 16px;
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
  border-radius: 12px;
  font-size: 16px;
  font-family: "Roboto";
}

.branding_phone_frame_wrapper {
  width: 50%;
  max-height: 575px;
  height: 100%;
  position: sticky;
  top: 0;
}
@media (max-width: 1024px) {
  .settings_branding_wrapper {
    flex-direction: column-reverse;
  }
  .settings_form {
    width: 100%;
    margin: 0 0 100px 0;
  }
  .logo_input {
    max-width: 100% !important;
    width: 100%;
  }
  .label_for_logo_file_input {
    max-width: 658px !important;
    width: 92% !important;
  }
  .form_input {
    max-width: 86%;
    width: 100%;
  }
  .telegram_input {
    max-width: 91%;
    width: 100%;
  }
  .color_picker_wrapper {
    max-width: 100%;
  }
  .color_input {
    max-width: 86%;
  }
  .branding_phone_frame_wrapper {
    position: relative;
    width: 100%;
  }
}
@media (max-width: 600px) {
  .settings_branding_wrapper {
    flex-direction: column-reverse;
  }
  .settings_form {
    width: 100%;
    margin: 0 0 100px 0;
  }
  .logo_input_wrapper {
    width: 100%;
  }
  .logo_input {
    max-width: 100% !important;
    width: 100%;
  }
  .label_for_logo_file_input {
    max-width: 658px !important;
    width: 92% !important;
  }
  .form_input {
    max-width: 86%;
    width: 100%;
  }
  .telegram_input {
    max-width: 91%;
    width: 100%;
  }
  .color_picker_wrapper {
    max-width: 100%;
  }
  .color_input {
    max-width: 86%;
  }
  .branding_phone_frame_wrapper {
    position: relative;
    width: 100%;
  }
  .save_button {
    max-width: 200px;
    width: 150px;
    height: 56px;
    margin-top: 16px;
    background-color: var(--generalBrand);
    color: var(--generalColorWhite);
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-family: "Roboto";
  }
  .return_button {
    max-width: 200px;
    width: 150px;
    height: 56px;
    margin-top: 16px;
    background-color: var(--secondaryColorBrand);
    color: var(--generalBrand);
    border-radius: 12px;
    font-size: 16px;
    font-family: "Roboto";
  }
}
</style>