<template>
  <div class="employee_card" @click="goToUserProfile(employeeData.user_id)">
    <div class="employee_photo_wrapper">
      <img
        v-if="employeeData.photo"
        :src="getAvatar(employeeData.photo)"
        alt="employee_photo"
        class="employee_photo"
      />
      <NoAvatarIcon v-else />
    </div>
    <div class="employee_info_wrapper">
      <div class="employee_name_wrapper">
        <p
          class="employee_name"
          v-if="employeeData.first_name && employeeData.surname"
        >
          {{ employeeData.surname }}
          {{ employeeData.first_name }}
        </p>
        <p
          class="employee_name"
          v-if="
            (!employeeData.first_name || !employeeData.surname) &&
            employeeData.tg_name
          "
        >
          {{ employeeData.tg_name }}
        </p>
        <p class="employee_job_title">
          {{ employeeData.job_title }}
        </p>
      </div>
      <div class="employee_status" v-if="employeeData.status">
        <!-- <img :src="getImgUrl(getIcon(employeeData.status))" alt="statusIcon" /> -->
        <IllnessIcon v-if="employeeData.status === 'S'"/>
        <InOfficeIcon v-if="employeeData.status === 'O'"/>
        <RemoteIcon v-if="employeeData.status === 'D'"/>
        <VacationIcon v-if="employeeData.status === 'H'"/>
        <span class="employee_status_title">{{
          getStatus(employeeData.status)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_IP } from "@/constants/api";
import { EMPLOYEE_STATUS } from "@/infrastructure/constants/employee-status";
import { EMPLOYEE_STATUSES } from "@/infrastructure/data-sources/employee-statuses";

import NoAvatarIcon from "@/components/Icons/noAvatar.vue";
import IllnessIcon from "@/components/Icons/EmployeesListIcons/IllnessIcon.vue";
import InOfficeIcon from "@/components/Icons/EmployeesListIcons/InOfficeIcon.vue";
import RemoteIcon from "@/components/Icons/EmployeesListIcons/RemoteIcon.vue";
import VacationIcon from "@/components/Icons/EmployeesListIcons/VacationIcon.vue";

export default {
  name: "EmployeeCard",
  components: {
    NoAvatarIcon,
    IllnessIcon,
    InOfficeIcon,
    RemoteIcon,
    VacationIcon
  },
  props: {
    employeeData: {
      default: {
        first_name: "",
        job_title: "",
        photo: null,
        surname: "",
        tg_name: "",
        user_id: "",
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    employeeStatus() {
      return EMPLOYEE_STATUS;
    },
    employeeStatuses() {
      return EMPLOYEE_STATUSES(this);
    },
  },
  methods: {
    getStatus(status) {
      if (status) {
        let currentStatus = this.employeeStatuses.find(
          (el) => el.status === status
        );
        return currentStatus.title;
      }
    },
    getIcon(status) {
      if (status) {
        let currentStatus = this.employeeStatuses.find(
          (el) => el.status === status
        );
        switch (currentStatus.status) {
          case EMPLOYEE_STATUS.office:
            return "officeEmployeeIcon";
          case EMPLOYEE_STATUS.remotely:
            return "remoteEmployeeIcon";
          case EMPLOYEE_STATUS.vacation:
            return "vacationEmployeeIcon";
          case EMPLOYEE_STATUS.illness:
            return "illnessEmployeeIcon";
        }
      }
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    goToUserProfile(userId) {
      this.$router.push(`/other_profile/${userId}`);
    },
    goToUserProfile(userId) {
      this.$router.push(`/other_profile/${userId}`);
    },
  },
};
</script>

<style scoped>
.employee_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0px;
  width: 232px;
  height: 212px;
  border: 1px solid var(--negativeSecondary);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}
.employee_photo_wrapper {
  width: 102px;
  min-height: 102px;
  max-height: 102px;
  height: 102px;
  min-width: 102px;
  max-width: 102px;
  border-radius: 100%;
  background-color: var(--secondaryColorBrand);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.employee_photo {
  /* width: 120%; */
  /* height: 100%; */
  width: 102px;
  min-height: 102px;
  max-height: 102px;
  height: 102px;
  min-width: 102px;
  max-width: 102px;
  object-fit: cover;
  border-radius: 100%;
}
.employee_info_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 0 0;
  height: 100%;
}
.employee_name_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.employee_name {
  margin: 0;
  font-family: "Golos";
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: var(--generalContrast);
  text-overflow: ellipsis !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  cursor: pointer;
  transition: 0.3s;
}
.employee_name:hover {
  color: var(--generalColorSecondary);
}
.employee_job_title {
  margin: 0;
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalColorSecondary);
  text-overflow: ellipsis !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
.employee_status {
  padding: 2px 8px;
  background-color: var(--minorInfoSecondaryColor);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.employee_status_title {
  font-family: "Golos";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  margin: 0;
  color: var(--generalContrast);
}
.no_avatar_icon {
  width: 18px;
  height: 18px;
}
@media (max-width: 1600px) {
  .employee_card {
    width: 230px;
  }
}
@media (max-width: 1440px) {
  .employee_card {
    width: 220px;
    height: 202px;
  }
}
@media (max-width: 768px) {
  .employee_card {
    width: 156px;
    height: 202px;
  }
}
@media (max-width: 680px) {
  .employee_card {
    /* width: 47%; */
    height: 202px;
  }
}
@media (max-width: 400px) {
  .employee_card {
    /* width: 46%; */
    height: 202px;
  }
}
</style>