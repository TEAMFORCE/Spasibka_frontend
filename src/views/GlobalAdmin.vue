<template>
  <div class="global_admin main-layout-page general-white-bg">
    <h1 class="global_admin_header general-contrast-color">
      {{ $t("global_admin.global_admin") }}
    </h1>
    <OrganizationCreationForm />
    <PeriodCreationForm />
    <PeriodDeletionForm />
    <ThanksEmissionForm />
    <TelegramGroupsAssignForm />
    <EmployeeCreationForm />
  </div>
</template>

<script>
import OrganizationCreationForm from "@/components/GlobalAdminElements/GlobalAdminForms/OrganizationCreationForm.vue";
import PeriodCreationForm from "@/components/GlobalAdminElements/GlobalAdminForms/PeriodCreationForm.vue";
import PeriodDeletionForm from "@/components/GlobalAdminElements/GlobalAdminForms/PeriodDeletionForm.vue";
import ThanksEmissionForm from "@/components/GlobalAdminElements/GlobalAdminForms/ThanksEmissionForm.vue";
import TelegramGroupsAssignForm from "@/components/GlobalAdminElements/GlobalAdminForms/TelegramGroupsAssignForm.vue";
import EmployeeCreationForm from "@/components/GlobalAdminElements/GlobalAdminForms/EmployeeCreationForm.vue";

export default {
  name: "GlobalAdmin",
  components: {
    OrganizationCreationForm,
    PeriodCreationForm,
    PeriodDeletionForm,
    ThanksEmissionForm,
    TelegramGroupsAssignForm,
    EmployeeCreationForm,
  },
};
</script>

<style scoped>
.global_admin {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.global_admin::-webkit-scrollbar {
  width: 8px;
}
.global_admin::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.global_admin_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
}
</style>
