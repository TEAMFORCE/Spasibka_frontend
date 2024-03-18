<template>
  <div class="survey_management_participants">
    <ParticipantsTabHeader
      :departmentsList="departmentsList"
      @searchByUserName="searchByUserNameAndDepartment"
      @searchByDepartment="searchByUserNameAndDepartment"
    />
    <ParticipantsStatistic :userList="userList" />
    <ParticipantsTab
      :userList="userList"
      :departmentsList="departmentsList"
      @sortChanged="sortChanged"
    />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { ANSWER_TYPE } from "@/infrastructure/constants/survey-answer-type";

import ParticipantsTabHeader from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsTabHeader.vue";
import ParticipantsStatistic from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsStatistic.vue";
import ParticipantsTab from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsTab.vue";

export default {
  name: "SurveyManagementParticipants",
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
    async getDepartments() {
      try {
        let response = await axios.get(API_URIS.departmentsTree);
        this.departmentsList = response.data;
      } catch (error) {
        throw error;
      }
    },
    sortChanged(sortDetails) {
      this.currentSortDetails = sortDetails;
      this.getParticipants();
    },
    async getParticipants() {
      let response = await axios.get(
        API_URIS.questionnariesParticipants.replace(
          "id",
          this.$route.params.id
        ),
        { params: this.currentSortDetails }
      );
      this.userList = response.data;
    },
    async searchByUserNameAndDepartment(name, departmentIds) {
      let departmentArray = [];
      for (let i = 0; i < departmentIds.length; i++) {
        departmentArray.push(`department_id=${departmentIds[i]}`);
      }
      let queryParams = departmentArray.join("&");

      let response = await axios.get(
        `${API_URIS.questionnariesParticipants.replace(
          "id",
          this.$route.params.id
        )}?name=${name}&${queryParams}`
      );
      this.userList = response.data;
    },
  },
  mounted() {
    this.getDepartments();
    this.getParticipants();
  },
};
</script>

<style scoped>
.survey_management_participants {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}
</style>