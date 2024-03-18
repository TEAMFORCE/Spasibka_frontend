<template>
  <div class="test_management_participants">
    <ParticipantsTabHeader :departmentsList="departmentsList" />
    <ParticipantsStatistic :userList="userList" />
    <ParticipantsTab :userList="userList" :departmentsList="departmentsList" />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import ParticipantsTabHeader from "@/components/TestElements/TestManagementParticipants/ParticipantsTabHeader.vue";
import ParticipantsStatistic from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsStatistic.vue";
import ParticipantsTab from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsTab.vue";
import { userListMock } from "./userListMock";

export default {
  name: "TestManagementParticipants",
  components: {
    ParticipantsTabHeader,
    ParticipantsStatistic,
    ParticipantsTab,
  },
  data() {
    return {
      departmentsList: [],
      userList: [],

      orderBy: "",
      currentSortDetails: {
        desc: 0,
        order_by: "passing",
      },
    };
  },
  methods: {
    setMockUserList() {
      setTimeout(() => {
        this.userList = userListMock;
      }, 500);
    },
    async getDepartments() {
      try {
        let response = await axios.get(API_URIS.departmentsTree);
        this.departmentsList = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    this.getDepartments();
    this.setMockUserList();
  },
};
</script>

<style scoped>
.test_management_participants {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}
</style>