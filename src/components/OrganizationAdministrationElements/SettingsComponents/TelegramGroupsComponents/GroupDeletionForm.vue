<template>
  <div class="group_deletion_form_wrapper">
    <div class="group_deletion_form general-white-bg">
      <h1 class="group_deletion_header">
        {{ $t("organization.settings.telegram_group_deletion") }}
      </h1>
      <DeletePeriodPromptIcon 
        class="delete_group_icon"
      />
      <div class="action_buttons">
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="deleteGroup"
        >
          {{ $t("organization.settings.delete_tg_group") }}
        </button>
        <button
          class="action_button general-white-color general-brand-bg"
          @click="cancelGroupDeletion"
        >
          {{ $t("organization.settings.cancel_tg_group_deletion") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DeletePeriodPromptIcon from "@/components/Icons/OrganizationAdministrationIcons/DeletePeriodPromptIcon.vue";

export default {
  name: "GroupDeletionForm",
  components: { DeletePeriodPromptIcon },
  methods: {
    deleteGroup() {
      this.$emit("deleteGroup");
    },
    cancelGroupDeletion() {
      this.$emit("cancelGroupDeletion");
    },
  },
};
</script>

<style scoped>
.group_deletion_form_wrapper {
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
.group_deletion_form {
  width: 100%;
  max-width: 800px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
}

.group_deletion_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: center;
}
@media (max-width: 450px) {
  .delete_group_icon {
    display: none;
  } 
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
