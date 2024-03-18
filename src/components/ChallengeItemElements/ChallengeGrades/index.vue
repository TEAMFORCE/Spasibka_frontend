<template>
  <div class="challenge_grades_wrapper">
    <ChallengeSearchUserInput @searchValueChanged="searchValueChanged" />
    <!-- <ChallengeGradesFilter @filterTypeChanged="changeFilter" /> -->
    <div v-if="searchValue.length === 0" class="challenge_grades_list_wrapper">
      <ChallengeGradesListItem
        v-if="allLikes"
        v-for="(item, index) in allLikes"
        :itemData="item"
      />
    </div>
    <div v-else class="challenge_grades_search_wrapper">
      <ChallengeGradesListItem
        v-for="(item, index) in foundedLikes"
        :itemData="item"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { LIKE_TYPES } from "@/constants/likeTypes";
import { GRADE_FILTER_TYPE } from "@/infrastructure/constants/grade-filter-type";
import { API_URIS, SERVER_IP } from "@/constants/api";

import ChallengeSearchUserInput from "./search-field.vue";
import ChallengeGradesFilter from "./filter.vue";
import ChallengeGradesListItem from "./list-item.vue";

export default {
  name: "ChallengeGrades",
  components: {
    ChallengeSearchUserInput,
    ChallengeGradesFilter,
    ChallengeGradesListItem,
  },
  props: {
    challengeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      likes: null,
      dislikes: null,
      allLikes: null,
      searchValue: "",
      foundedLikes: null,
    };
  },
  methods: {
    searchValueChanged(value) {
      this.searchValue = value;
      let likesToSearch = this.allLikes;
      this.foundedLikes = likesToSearch.filter((el) => {
        return (
          el.user.name.slice(0, value.length) == value ||
          el.user.surname.slice(0, value.length) == value
        );
      });
    },
    async getChallengeGrades(type) {
      await axios
        .post(API_URIS.getLikes, {
          challenge_id: this.challengeData.id,
          include_name: true,
          is_reverse_order: true,
        })
        .then((res) => {
          this.likes = res.data.likes.find(
            (el) => el.like_kind.id === LIKE_TYPES.like
          ).items;
          this.dislikes = res.data.likes.find(
            (el) => el.like_kind.id === LIKE_TYPES.dislike
          ).items;
          if (type) {
            this.getAllLikes(type);
          } else {
            this.getAllLikes();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    getAllLikes(type) {
      if (this.likes.length > 0) {
        this.likes.map(function (current) {
          current.type = LIKE_TYPES.like;
        });
      }
      if (this.dislikes.length > 0) {
        this.dislikes.map(function (current) {
          current.type = LIKE_TYPES.dislike;
        });
      }
      this.allLikes = this.likes.concat(this.dislikes);
      if (type) {
        this.allLikes = this.allLikes.filter((el) => el.type === type);
      }
    },
    changeFilter(filterType) {
      if (filterType === GRADE_FILTER_TYPE.like) {
        this.getChallengeGrades(LIKE_TYPES.like);
      } else if (filterType === GRADE_FILTER_TYPE.dislike) {
        this.getChallengeGrades(LIKE_TYPES.dislike);
      } else if (filterType === GRADE_FILTER_TYPE.all) {
        this.getChallengeGrades();
      }
    },
  },
  mounted() {
    this.getChallengeGrades();
  },
};
</script>

<style scoped>
.challenge_grades_wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.challenge_grades_list_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  max-width: 662px;
  width: auto;
}
.challenge_grades_search_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: auto;
  max-width: 662px;
}
</style>