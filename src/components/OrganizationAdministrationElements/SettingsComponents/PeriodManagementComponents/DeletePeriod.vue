<template>
  <div class="delete_period_wrapper">
    <div class="delete_period general-white-bg">
      <h1 class="delete_period_header general-contrast-color">
        {{ $t("organization.settings.are_you_sure_to_delete") }}
      </h1>
      <DeletePeriodPromptIcon />
      <div class="action_buttons">
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="deletePeriod"
        >
          {{ $t("organization.settings.delete_period") }}
        </button>
        <button
          class="action_button general-white-color general-brand-bg"
          @click="$emit('disablePeriodDeletion')"
        >
          {{ $t("organization.settings.cancel_deletion") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DeletePeriodPromptIcon from "@/components/Icons/OrganizationAdministrationIcons/DeletePeriodPromptIcon.vue";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import axios from "axios";

export default {
  name: "DeletePeriod",
  props: {
    selectedRow: {
      required: true,
    },
  },
  components: {
    DeletePeriodPromptIcon,
  },
  data() {
    return {};
  },
  methods: {
    async deletePeriod() {
      try {
        await axios.delete(API_URIS.periodsAPI, {
          data: {
            period_id: this.selectedRow.id,
          },
        });
        notify(this.$t("organization.settings.period_deleted"), "success");
        this.$emit("disablePeriodDeletion", true);
      } catch (err) {
        let errorMessage = "";
        if (
          err?.response?.data?.errors ===
          "Cant change period because of period status. Period status: 2 You can change periods only with no status or status 0"
        ) {
          errorMessage = this.$t(
            "organization.settings.cannot_delete_active_period"
          );
        }
        notify(
          errorMessage ||
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
.delete_period_wrapper {
  position: fixed;
  z-index: 1000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
.delete_period {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
}
.delete_period_header {
  font-family: "Golos";
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  height: 56px;
  box-sizing: border-box;
  padding: 6.4px 24px;
  border-radius: 6px;
  font-family: "Roboto";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
</style>