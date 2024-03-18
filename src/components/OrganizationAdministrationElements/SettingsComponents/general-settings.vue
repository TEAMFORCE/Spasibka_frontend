<template>
  <div class="settings_general_settings_wrapper">
    <div class="columns_wrapper">
      <div class="wrapper_settings_column">
        <div class="inner_settings_block">
          <h3 class="settings_column_title">
            {{ $t("organization.settings.transactions.title") }}
          </h3>
          <div class="settings_input_wrapper">
            <h4 class="settings_input_title">
              {{
                $t(
                  "organization.settings.transactions.transactionCancelEndPeriod"
                )
              }}
            </h4>
            <input
              type="text"
              :placeholder="$t('organization.settings.transactions.seconds')"
              class="settings_input"
              @input="
                (e) => (e.target.value = e.target.value.replace(/\D/g, ''))
              "
              v-model="transactionCancelEndPeriod"
            />
          </div>
          <div class="settings_input_wrapper">
            <h4 class="settings_input_title">
              {{ $t("organization.settings.disbursedAmount") }}
            </h4>
            <input
              type="text"
              :placeholder="$t('organization.settings.transactions.sum')"
              class="settings_input"
              @input="
                (e) => (e.target.value = e.target.value.replace(/\D/g, ''))
              "
              v-model="disbursedAmount"
            />
          </div>
          <div class="settings_input_wrapper">
            <div class="checkbox_wrapper">
              <input
                type="checkbox"
                class="checkbox"
                v-model="transactionAnonymity"
                @change="changeTransactionAnonymity"
              />
              <label>
                <span class="settings_input_title_checkbox">
                  {{ $t("organization.settings.transactionAnonymity") }}
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="inner_settings_block">
          <h3 class="settings_column_title">
            {{ $t("organization.settings.bot.title") }}
          </h3>
          <div class="settings_input_wrapper">
            <h4 class="settings_input_title">
              {{ $t("organization.settings.bot.commandLifetime") }}
            </h4>
            <input
              type="text"
              :placeholder="$t('organization.settings.bot.seconds')"
              class="settings_input"
              @input="
                (e) => (e.target.value = e.target.value.replace(/\D/g, ''))
              "
              v-model="botCommandLifetime"
            />
            <h4 class="settings_input_title">
              {{ $t("organization.settings.bot.messageLifetime") }}
            </h4>
            <input
              type="text"
              :placeholder="$t('organization.settings.bot.seconds')"
              class="settings_input"
              @input="
                (e) => (e.target.value = e.target.value.replace(/\D/g, ''))
              "
              v-model="botMessageLifetime"
            />
          </div>
        </div>
      </div>
      <div class="wrapper_settings_column"></div>
      <div class="wrapper_settings_column"></div>
    </div>
    <div class="buttons_wrapper">
      <button class="save_button" @click="saveSettings">
        {{ $t("organization.settings.transactions.saveButton") }}
      </button>
      <button class="cancel_button" @click="goBack">
        {{ $t("organization.settings.transactions.cancelButton") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import vSelect from "vue-select";

export default {
  name: "OrganizationSettingsGeneralSettings",
  props: {
    settings: {
      required: true,
    },
  },
  data() {
    return {
      transactionCancelEndPeriod: null,
      botCommandLifetime: null,
      botMessageLifetime: null,
      disbursedAmount: null,
      transactionAnonymity: null,
      transactionAnonymityNumber: null,
    };
  },
  watch: {
    settings() {
      this.transactionCancelEndPeriod =
        this.settings?.settings?.t_grace_period?.default_settings_value;
      this.botCommandLifetime =
        this.settings?.settings?.bot_commands_lifetime?.default_settings_value;
      this.botMessageLifetime =
        this.settings?.settings?.bot_messages_lifetime?.default_settings_value;
      this.disbursedAmount =
        this.settings?.settings?.p_distr?.default_settings_value;
      this.transactionAnonymityNumber =
        this.settings?.settings?.t_anonym?.default_settings_value;
      if (this.settings?.settings?.t_anonym?.default_settings_value === "0") {
        this.transactionAnonymity = false;
      } else if (
        this.settings?.settings?.t_anonym?.default_settings_value === "1"
      ) {
        this.transactionAnonymity = true;
      }
    },
  },
  methods: {
    changeTransactionAnonymity() {
      if (this.transactionAnonymity) {
        this.transactionAnonymityNumber = 1;
      } else if (!this.transactionAnonymity) {
        this.transactionAnonymityNumber = 0;
      }
    },
    goBack() {
      this.$router.push(
        "/organization_administration/" + this.$route.params.id
      );
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
    async saveSettings() {
      try {
        let response = await axios.post(API_URIS.organizationsSettings, {
          settings: {
            t_grace_period: this.transactionCancelEndPeriod,
            bot_messages_lifetime: this.botMessageLifetime,
            bot_commands_lifetime: this.botCommandLifetime,
            p_distr: this.disbursedAmount,
            t_anonym: this.transactionAnonymityNumber,
          },
        });
        if (response.status === 200 || 201 || 202) {
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
.settings_general_settings_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  gap: 40px;
}
.columns_wrapper {
  width: 100%;
  display: flex;
  gap: 20px;
}
.wrapper_settings_column {
  width: 28%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.inner_settings_block {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 92.2%;
  gap: 20px;
  background-color: var(--generalColorWhite);
  border-radius: 12px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  /* margin: 0 0 0 10px; */
}
.settings_column_title {
  font-family: "Ubuntu";
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
}
.settings_input_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}
.checkbox_wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
}
.settings_input_title_checkbox {
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
}
.settings_input_title {
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
}
.settings_input {
  border: 1px solid var(--neutral5);
  border-radius: 8px;
  padding: 13px 12px;
  height: 20px;
  width: 92%;
  background-color: var(--generalColorWhite);
}
.settings_input::placeholder {
  color: var(--generalColorSecondary);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.buttons_wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 0 0 20px 0;
}
.save_button {
  width: 17%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  transition: 0.4s;
}
.save_button:hover {
  background-color: var(--generalBrandLight);
}
.save_button:active {
  transform: scale(0.99);
}
.cancel_button {
  width: 17%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  transition: 0.4s;
}
.cancel_button:hover {
  background-color: var(--secondaryColorBrandDark);
}
.cancel_button:active {
  transform: scale(0.99);
}
@media (max-width: 1440px) {
  .wrapper_settings_column {
    width: 33%;
  }
}
@media (max-width: 1280px) {
  .columns_wrapper {
    flex-direction: column;
  }
  .wrapper_settings_column {
    width: 92.2%;
  }
  .settings_input {
    width: 88%;
  }
  .save_button {
    width: 22%;
  }
  .cancel_button {
    width: 22%;
  }
}
@media (max-width: 1024px) {
  .settings_input {
    width: 96%;
  }
}
@media (max-width: 1000px) {
  .settings_general_settings_wrapper {
    gap: 50px;
  }
  .buttons_wrapper {
    padding: 0 0 100px 0;
  }
}

@media (max-width: 768px) {
  .save_button {
    width: 50%;
  }
  .cancel_button {
    width: 50%;
  }
  .settings_input {
    width: 92%;
  }
  .buttons_wrapper {
    width: 90%;
    padding: 0 0 120px 0;
  }
}
</style>