<template>
  <div class="main_page_votings_wrapper">
    <VotingScreen
      @closeVoting="closeVoting"
      @openParticipants="openParticipants"
      v-if="votingVisible"
    />
    <ParticipantsScreen
      v-if="participantsVisible"
      @closeParticipants="closeParticipants"
    />
    <div class="votings_header">
      <h1 class="votings_text general-contrast-color">
        {{ $t("surveys.votings") }}
      </h1>
      <button class="see_all general-brand-color transparent-bg" @click="goToVotings">
        {{ $t("surveys.see_all") }}
      </button>
    </div>
    <div class="votings_list hide_scrollbar">
      <div 
        class="voting_card" v-for="(voting, index) in votingsList"
        @click="openVoting"
      >
        <img v-if="voting.image" class="voting_image" :src="voting.image"/>
        <img v-else class="voting_image" :src="getImageURL('SurveysImages', 'DefaultSurveyImage.png')"/>
        <div class="top_voting" v-if="index === 0">
          <div class="top_voting_header">
            <h1 class="top_voting_name general-white-color">
              {{ voting.name }}
            </h1>
            <div class="top_voting_top general-white-color">
              <TopVotingIcon class="top_voting_icon" />
              {{ $t("mainPage.surveys.top") + " " + voting.top }}
            </div>
          </div>
          <div class="top_voting_options">
            <div v-for="option in voting.options" class="top_voting_option">
              <h1 class="option_percentage general-white-color">
                {{ option.percentage + "%" }}
              </h1>
              <h1 class="option_name general-white-color">{{ option.name }}</h1>
            </div>
          </div>
        </div>
        <div class="ordinary_voting" v-else>
          <h1 class="voting_header general-white-color">
            {{ voting.name }}
          </h1>
          <h1 class="voting_participants general-white-color">
            {{ voting.participants_count + " " + participantsDeclension(voting.participants_count) }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import TopVotingIcon from "../Icons/MainPageIcons/TopVotingIcon.vue";
import { getImageURL } from "@/general-scripts/get-image-url";
import VotingScreen from "../VotingsElements/VotingScreen.vue";
import ParticipantsScreen from "../VotingsElements/ParticipantsScreen.vue";

export default {
  name: "MainPageVotings",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    TopVotingIcon,
    VotingScreen,
    ParticipantsScreen
},
  data() {
    return {
      votingVisible: false,
      participantsVisible: false,
      votingsList: [
        {
          name: "Как назвать котенка?",
          top: 3,
          image: "https://i.ibb.co.com/gzjmG6g/Felis-silvestris-silvestris.jpg",
          options: [
            {
              name: "Мурзик",
              percentage: 75,
            },
            {
              name: "Малыш робертович",
              percentage: 12,
            },
            {
              name: "Барсик",
              percentage: 10,
            },
          ],
          participants_count: 15,
        },
        {
          name: "Салаты на новый год",
          top: 3,
          image: "",
          options: [
            {
              name: "Мурзик",
              percentage: 75,
            },
          ],
          participants_count: 15,
        },
        {
          name: "Какую пиццу вы хотите заказать на корпоратив",
          top: 3,
          image: "",
          options: [
            {
              name: "Мурзик",
              percentage: 75,
            },
          ],
          participants_count: 15,
        },
        {
          name: "Салаты на новый год",
          top: 3,
          image: "",
          options: [
            {
              name: "Мурзик",
              percentage: 75,
            },
          ],
          participants_count: 15,
        },
        {
          name: "Какую пиццу вы хотите заказать на корпоратив",
          top: 3,
          image: "",
          options: [
            {
              name: "Мурзик",
              percentage: 75,
            },
          ],
          participants_count: 15,
        },
      ],
    };
  },
  methods: {
    getImageURL: getImageURL,
    participantsDeclension(amount) {
      if (amount === 1) return this.$t("surveys.participants_declension_1");
      if (amount % 100 >= 11 && amount % 100 <= 14) {
        return this.$t("surveys.participants_declension_2");
      }
      switch (amount % 10) {
        case 1: 
            return this.$t("surveys.participants_declension_2");
        case 2:
        case 3:
        case 4:
            return this.$t("surveys.participants_declension_3");
        default:
            return this.$t("surveys.participants_declension_2");
      }
    },
    openParticipants() {
      this.votingVisible = false;
      this.participantsVisible = true;
    },
    closeParticipants() {
      this.participantsVisible = false;
    },
    openVoting() {
      this.votingVisible = true;
    },
    closeVoting() {
      this.votingVisible = false;
    },
    goToVotings() {
      this.$router.push("/surveys");
    },
  }
};
</script>

<style scoped>
.main_page_votings_wrapper {
  width: auto;
  background-color: var(--generalColorWhite);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  padding: 52px 0px 52px 52px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (max-width: 1280px) {
  .main_page_votings_wrapper {
    padding: 24px 0px 24px 24px;
  }
  .see_all {
    margin-right: 24px;
  }
}
.votings_header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}
.votings_text {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}
.see_all {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  line-height: 36px;
  margin-right: 52px;
}
.votings_list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
}
.votings_list.hide_scrollbar {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.votings_list.hide_scrollbar::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
.voting_card {
  cursor: pointer;
  position: relative;
}
.voting_image {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
  filter: brightness(55%);
}
.top_voting {
  position: relative;
  z-index: 3;
  width: 318px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 18px 22px 16px;
  border-radius: 20px;
}
.top_voting_header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.top_voting_name {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.top_voting_top {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Golos";
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}
.top_voting_icon {
  height: 32px;
  width: 32px;
}
.top_voting_options {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.top_voting_option {
  display: flex;
  gap: 4px;
}
.option_percentage {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
}
.option_name {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
}
.ordinary_voting {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  justify-content: space-between;
  padding: 18px 18px 22px 16px;
  position: relative;
  z-index: 3;
  width: 240px;
  box-sizing: border-box;
}
.voting_header {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
}
.voting_participants {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
}
</style>
