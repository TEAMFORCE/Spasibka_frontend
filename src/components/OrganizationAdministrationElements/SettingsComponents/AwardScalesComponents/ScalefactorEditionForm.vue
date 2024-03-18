<template>
  <div class="scalefactor_edition_form_wrapper">
    <div class="scalefactor_edition_form general-white-bg">
      <h1 class="scale_creation_header_text general-contrast-color">
        {{ factor.name }}
      </h1>
      <h1 class="secondary_header_text general-secondary-color">
        {{ $t("organization.settings.add_scale_advance_events") }}
      </h1>
      <div class="field_inputs">
        <div class="input_field_wrapper">
          <div
            v-if="sum"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.sum") }}
          </div>
          <input
            :disabled="!sumAviable"
            class="scale_creation_text_input general-contrast-color general-white-bg"
            v-model="sum"
            :placeholder="$t('organization.settings.sum')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="percentage"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.percentage") }}
          </div>
          <input
            :disabled="!percentageAviable"
            class="scale_creation_text_input general-contrast-color general-white-bg"
            v-model="percentage"
            :placeholder="$t('organization.settings.percentage')"
          />
        </div>
        <h1 class="input_description_text general-secondary-color">
          {{ $t("organization.settings.enter_sum_or_percentage") }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="additionalCondition"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.settings.additional_condition") }}
          </div>
          <input
            class="scale_creation_text_input general-contrast-color general-white-bg"
            v-model="additionalCondition"
            :placeholder="$t('organization.settings.additional_condition')"
          />
        </div>
      </div>
      <div class="action_buttons">
        <button
          @click="proceedNext"
          class="action_button general-brand-bg general-white-color"
        >
          {{ $t("organization.settings.continue") }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="goBack"
        >
          {{ $t("organization.settings.back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "ScalefactorEditionForm",
  props: {
    factor: {
      required: true,
    },
  },
  data() {
    return {
      additionalCondition: "",
      sum: "",
      percentage: "",
      sumAviable: true,
      percentageAviable: true,
    };
  },
  watch: {
    sum() {
      if (this.sum) {
        this.percentageAviable = false;
      } else {
        this.percentageAviable = true;
      }
    },
    percentage() {
      if (this.percentage) {
        this.sumAviable = false;
      } else {
        this.sumAviable = true;
      }
    },
  },
  mounted() {
    if (this.factor.relation || this.factor.relation == 0) {
      this.percentage = this.factor.relation * 100 + "%";
    } else {
      this.percentage = "";
    }
    if (this.factor.score || this.factor.score == 0) {
      this.sum = this.factor.score;
    } else {
      this.sum = "";
    }
    this.additionalCondition = this.factor.additional_condition || "";
  },
  methods: {
    proceedNext() {
      try {
        if (
          !this.sum &&
          String(this.sum).charAt(0) !== "0" &&
          !this.percentage &&
          !String(this.percentage).charAt(0) !== "0"
        ) {
          throw new Error(
            this.$t("organization.settings.enter_either_sum_or_percentage")
          );
        } else {
          if (this.sum && String(parseFloat(this.sum)) !== String(this.sum)) {
            throw new Error(
              this.$t("organization.settings.sum_should_be_a_number")
            );
          }
          if (this.percentage) {
            let percentageWithoutPercentSign = this.percentage;
            if (this.percentage.endsWith("%"))
              percentageWithoutPercentSign = this.percentage.slice(0, -1);
            if (
              String(parseFloat(percentageWithoutPercentSign)) !==
              String(percentageWithoutPercentSign)
            ) {
              throw new Error(
                this.$t("organization.settings.percentage_should_be_a_number")
              );
            }
          }
        }
        this.$emit(
          "confirmFactorEdition",
          this.additionalCondition,
          this.sum,
          this.percentage
        );
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    goBack() {
      this.$emit("cancelFactorEdition");
    },
  },
};
</script>

<style scoped>
.scalefactor_edition_form_wrapper {
  position: fixed;
  z-index: 1050;
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
.scalefactor_edition_form {
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
.secondary_header_text {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.scale_creation_header_text {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}
.field_inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
.input_description_text {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
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