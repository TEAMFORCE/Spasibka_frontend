<template>
  <div class="participant_statistic">
    <div class="participants_statistic_header">
      <h2 class="participant_statistic_title">
        {{ $t("surveys.management_participants.statistic") }}
      </h2>
      <h4 class="participant_statistic_title_count" v-if="userList.length">
        {{ getVoted() }}
      </h4>
    </div>
    <div class="participant_statistic_graph">
      <div class="graph_line" v-if="userList.length">
        <div class="graph_part _completed" :style="getWidth(completedSurveys)">
          <span class="graph_part_value">
            {{ getPercentage(completedSurveys) }}
          </span>
        </div>
        <div class="graph_part _taking" :style="getWidth(takingSurveys)">
          <span class="graph_part_value">
            {{ getPercentage(takingSurveys) }}
          </span>
        </div>
        <div
          class="graph_part _notComplete"
          :style="getWidth(notCompleteSurveys)"
        >
          <span class="graph_part_value">
            {{ getPercentage(notCompleteSurveys) }}
          </span>
        </div>
      </div>
      <div class="graph_description">
        <div class="description_item">
          <div class="_circle _completed"></div>
          <span class="_item_text">
            {{ $t("surveys.management_participants.survey_graph.completed") }}
          </span>
        </div>
        <div class="description_item">
          <div class="_circle _taking"></div>
          <span class="_item_text">
            {{ $t("surveys.management_participants.survey_graph.taking") }}
          </span>
        </div>
        <div class="description_item">
          <div class="_circle _notComplete"></div>
          <span class="_item_text">
            {{ $t("surveys.management_participants.survey_graph.notComplete") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParticipantsStatistic",
  props: {
    userList: {
      requred: true,
    },
  },
  data() {
    return {
      completedSurveys: 0,
      takingSurveys: 0,
      notCompleteSurveys: 0,

      allParticipants: 0,
    };
  },
  watch: {
    userList() {
      this.setCounts();
      this.allParticipants = this.userList.length;
    },
  },
  methods: {
    getVoted() {
      return `${this.$t("surveys.management_participants.voted")} ${
        this.completedSurveys
      } ${this.$t("surveys.management_participants.from")} ${
        this.allParticipants
      }`;
    },
    getWidth(value) {
      let percentage = (value / this.allParticipants) * 100;
      return `width:${Math.round(percentage)}%`;
    },
    getPercentage(value) {
      let percentage = (value / this.allParticipants) * 100;
      if (percentage == 0) {
        return "";
      }
      return `${Math.round(percentage)}%`;
    },
    setCounts() {
      this.notCompleteSurveys = this.userList.filter(
        (el) => el.session === null
      ).length;
      this.takingSurveys = this.userList.filter((obj) => {
        return (
          obj.session !== null &&
          obj.session.started_at !== undefined &&
          obj.session.finished_at === null
        );
      }).length;
      this.completedSurveys = this.userList.filter((obj) => {
        return (
          obj.session &&
          obj.session.started_at !== undefined &&
          obj.session.finished_at !== undefined
        );
      }).length;
    },
  },
};
</script>

<style scoped>
.participant_statistic {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
}
.participants_statistic_header {
  width: 100%;
  max-width: 1356px;
  display: flex;
  justify-content: space-between;
}
.participant_statistic_title {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  margin: 0;
  color: var(--generalContrast);
}
.participant_statistic_title_count {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  margin: 0;
  color: var(--generalColorSecondary);
}
.participant_statistic_graph {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 85px;
  width: 100%;
  max-width: 1356px;
}
.graph_line {
  height: 100%;
  flex-grow: 1;
  display: flex;
}
.graph_part {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.graph_part_value {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  color: var(--generalColorWhite);
}
.graph_description {
  height: 100%;
  max-height: 363px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.description_item {
  display: flex;
  align-items: center;
  gap: 18px;
}
._circle {
  width: 9px;
  height: 9px;
  border-radius: 100%;
}
._item_text {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  color: var(--generalContrast);
  cursor: default;
}
._completed {
  background-color: var(--surveyGraphCompleted);
}
._taking {
  background-color: var(--surveyGraphTaking);
}
._notComplete {
  background-color: var(--surveyGraphNotCompleted);
}
</style>