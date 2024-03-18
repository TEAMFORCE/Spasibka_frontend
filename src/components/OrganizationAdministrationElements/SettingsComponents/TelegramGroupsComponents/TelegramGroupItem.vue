<template>
  <div class="telegram_group_item general-white-bg">
    <div class="top_part">
      <h1 class="group_name">
        {{ groupInfo.name }}
      </h1>
      <button
        class="enable_actions_button brand-secondary-bg"
        @click="pressOptionsButton"
        v-click-outside="disableOptions"
      >
        <TelegramGroupOptionsIcon class="enable_actions_icon" />
        <div @click.stop class="actions_list" v-if="optionsEnabled">
          <button
            class="option_button border_bottom general-white-bg"
            @click="openGroupEdition"
          >
            <h1 class="option_button_text">
              {{ $t("organization.settings.edit_tg_group") }}
            </h1>
            <EditTelegramGroupIcon />
          </button>
          <button
            class="option_button general-white-bg"
            @click="openGroupDeletion"
          >
            <h1 class="option_button_text">
              {{ $t("organization.settings.delete_tg_group") }}
            </h1>
            <DeleteTelegramGroupIcon />
          </button>
        </div>
      </button>
    </div>
    <h1 class="info_type">
      <!-- {{ groupInfo.info_type }} -->
      {{ $t("organization.settings.chat_id_placeholder") }}
    </h1>
    <div class="group_info">
      {{ groupInfo.group_id }}
    </div>
  </div>
</template>

<script>
import TelegramGroupOptionsIcon from "@/components/Icons/OrganizationAdministrationIcons/TelegramGroupOptionsIcon.vue";
import EditTelegramGroupIcon from "@/components/Icons/OrganizationAdministrationIcons/EditTelegramGroupIcon.vue";
import DeleteTelegramGroupIcon from "@/components/Icons/OrganizationAdministrationIcons/DeleteTelegramGroupIcon.vue";

export default {
  name: "TelegramGroupItem",
  props: {
    groupInfo: {
      required: true,
    },
  },
  components: {
    TelegramGroupOptionsIcon,
    EditTelegramGroupIcon,
    DeleteTelegramGroupIcon,
  },
  data() {
    return {
      optionsEnabled: false,
    };
  },
  methods: {
    disableOptions() {
      this.optionsEnabled = false;
    },
    pressOptionsButton() {
      this.optionsEnabled ^= true;
    },
    openGroupEdition() {
      this.disableOptions();
      this.$emit("openGroupEdition");
    },
    openGroupDeletion() {
      this.disableOptions();
      this.$emit("openGroupDeletion");
    },
  },
};
</script>

<style scoped>
.telegram_group_item {
  width: 100%;
  max-width: 343px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.top_part {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.group_name {
  font-family: "Ubuntu";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
}
.enable_actions_button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 24px;
  height: 24px;
}
.enable_actions_icon {
  height: 16px;
}
.actions_list {
  transform: translateX(-100%);
  position: absolute;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
  border-radius: 8px;
  overflow: hidden;
  left: 25px;
  top: 30px;
}

@media (max-width: 600px) {
  .actions_list {
    transform: translateX(-100%);
  }
}

.option_button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 12px;
  gap: 20px;
}
.border_bottom {
  border-bottom: 1px solid var(--generalColorGrey);
}
.option_button_text {
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
.info_type {
  margin-top: 12px;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
.group_info {
  border: 1px solid var(--neutral5);
  border-radius: 8px;
  padding: 13px 12px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
</style>
