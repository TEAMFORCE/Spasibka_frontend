<template>
  <div class="survey_user_result">
    <div class="top_container_with_button">
      <button
        class="back_to_surveys tooltip_container brand-secondary-bg"
        :data-tooltip="$t('challenges.back')"
        @click="
          $router.push({
            path: `/survey_management/${$route.params.id}`,
            query: { section: 'participants' }
          })
        "
      >
        <BackArrowIcon />
      </button>
    </div>
    <div class="detail_result_header_wrapper">
      <Transition name="fade" mode="out-in">
        <div class="content_loading" v-if="isLoading">
          <span class="loader"></span>
        </div>
        <DetailResultHeader
          v-else
          :transferredUser="user"
          :userNumber="getUserNumber()"
          @prevUser="prevUser"
          @nextUser="nextUser"
        />
      </Transition>
    </div>
    <Transition name="fade" mode="out-in">
      <DetailResult :answers="answers" v-if="!isLoading" />
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";

import BackArrowIcon from "@/components/Icons/backArrow.vue";
import DetailResultHeader from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsDetailResult/DetailResultHeader.vue";
import DetailResult from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsDetailResult/DetailResult.vue";

export default {
  name: "SurveyUserResult",
  components: {
    BackArrowIcon,
    DetailResultHeader,
    DetailResult,
  },
  data() {
    return {
      isLoading: true,

      user: "",
      userIndex: null,
      answers: "",

      participantsList: [],
    };
  },
  methods: {
    goTo() {
      this.$router.push({
        path: `/survey_management/${this.$route.params.id}/user_result/`,
        query: { user_id: 1000 },
      });
    },
    async getParticipants() {
      let response = await axios.get(
        API_URIS.questionnariesParticipants.replace("id", this.$route.params.id)
      );

      this.participantsList = response.data.filter((el) => el.session);
      this.userIndex = this.participantsList.findIndex(
        (el) => el.session.id == this.$route.query.session_id
      );
    },
    async getSurveyDetailResult(sessionId) {
      if (sessionId) {
        this.isLoading = true;
        let response = await axios.get(
          API_URIS.questionnariesDetailResult.replace("id", sessionId)
        );
        this.isLoading = false;
        this.user = response.data.session.user;
        this.answers = response.data.questionnairegroup_set;
      } else {
        this.isLoading = true;
        let response = await axios.get(
          API_URIS.questionnariesDetailResult.replace(
            "id",
            this.$route.query.session_id
          )
        );
        this.isLoading = false;
        this.user = response.data.session.user;
        this.answers = response.data.questionnairegroup_set;
      }
    },
    prevUser() {
      if (this.userIndex > 0) {
        this.userIndex -= 1;
        this.getSurveyDetailResult(
          this.participantsList[this.userIndex].session.id
        );
      } else {
        this.userIndex = this.participantsList.length - 1;
        this.getSurveyDetailResult(
          this.participantsList[this.userIndex].session.id
        );
      }
    },
    nextUser() {
      if (this.userIndex < this.participantsList.length - 1) {
        this.userIndex += 1;
        this.getSurveyDetailResult(
          this.participantsList[this.userIndex].session.id
        );
      } else {
        this.userIndex = 0;
        this.getSurveyDetailResult(
          this.participantsList[this.userIndex].session.id
        );
      }
    },
    getUserNumber() {
      return this.userIndex + 1;
    },
  },
  mounted() {
    this.getParticipants();
    this.getSurveyDetailResult();
    // window.onpopstate = (event) => {
    //   // this.$router.push({
    //   //   path: `/survey_management/${this.$route.params.id}`,
    //   // });
    // };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.survey_user_result {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  background-color: var(--generalColorWhite);
  padding: 52px;
  margin: 0 4% 0 0;
  border-radius: 24px 24px 0px 0px;
  overflow-y: auto;
  border-left: 1px solid var(--negativeSecondary);
  border-top: 1px solid var(--negativeSecondary);
  border-right: 1px solid var(--negativeSecondary);
}
.survey_user_result::-webkit-scrollbar {
  display: none;
}
.top_container_with_button {
  width: 100%;
  display: flex;
  margin-bottom: 28px;
}
.back_to_surveys {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  padding: 7px;
  background-color: var(--secondaryColorBrand);
}
.back_arrow_icon {
  height: 16px;
}

.detail_result_header_wrapper {
  width: 100%;
}
.content_loading {
  width: 100%;
  height: 100px;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--generalColorWhite);
  border-bottom-color: var(--generalBrand);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
</style>