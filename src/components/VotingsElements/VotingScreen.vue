<template>
  <div class="voting_screen_wrapper">
    <div class="voting_screen general-white-bg">
      <CloseFiltersIcon
        class="close_filters_icon"
        @click="$emit('closeVoting')"
      />
      <h1 class="voting_name general-contrast-color">
        {{ votingName }}
      </h1>
      <img 
        class="voting_picture"
        :src="'https://i.ibb.co.com/H7MhkNt/unsplash-l-HUdfk5-WGXc.png'"
      />
      <div class="voting_parameters general-contrast-color">
        {{ $t("surveys.public_voting") }}
        <div class="black_dot general-contrast-bg">
        </div>
        {{ resultsPublic ? $t("surveys.results_visible_to_everyone") : $t("surveys.results_visible_to_admin") }}
      </div>
      <div
        v-if="userVoted"
        class="voting_results"
      >
        <div 
          class="voting_option_results minor-error-secondary-bg"
          v-for="(votingOption, index) in votingOptions"
        > 
          <div 
            class="percentage_bar"
            :style="{ width: `${votingOption.percentage}%` }"
          >
          </div>
          <h1 class="voting_option_name">
            {{ votingOption.name }}
          </h1>
          <div class="voting_option_participants_info">
            <UserVotedIcon
              class="user_voted_icon"
              v-if="index === userSelectedOptionIndex"
            />
            {{ resultsPublic ? 
              `${votingOption.participants} ${peopleDeclension(votingOption.participants)}` :
              `${votingOption.percentage}%`
            }}
          </div>
        </div>
      </div>
      <div 
        v-else
        class="voting_options"
      >
        <button 
          class="voting_option minor-error-secondary-bg general-contrast-color"
          v-for="(votingOption, index) in votingOptions"
          @click="selectVotingOption(index)"
        >
          {{ votingOption.name }} 
          <div 
            :class="{ selected: votingOption.selected }"
            class="single_choice_selector minor-info-secondary-bg"
          >
            <div 
              :class="{ selected: votingOption.selected }"
              class="inner_circle general-brand-bg"
            >
            </div>
          </div>
        </button>
        <button
          v-if="anyOptionSelected"
          @click="makeVote"
          class="vote_button general-brand-bg general-white-color"
        >
          {{ $t("surveys.vote") }}
        </button>
      </div>
      <button 
        @click="$emit('openParticipants')"
        class="participants_preview general-secondary-color transparent-bg"
      >
        <div class="participants_avatars">
          <div 
            class="participant_avatar general-brand-bg"
            v-for="(participant, index) in participants"
            :style="{ transform: `translateX(${index*(-24)}px)` }"
          >
            <img
              class="participant_photo"
              v-if="participant.photo"
              :src="photoAddress(participant.photo)"
            />
            <h1
              v-else
              class="participant_initials general-white-color"
            >
              {{ participantInitials(participant) }}
            </h1>
          </div>
        </div>
        {{ votingParticipantsCount + " " + participantsDeclension(votingParticipantsCount) }}
      </button>
    </div>
  </div>
</template>

<script>
import CloseFiltersIcon from "@/components/Icons/SurveyIcons/CloseFiltersIcon.vue";
import UserVotedIcon from "../Icons/SurveyIcons/UserVotedIcon.vue";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { photoAddress } from "@/general-scripts/photo-address";

export default {
  name: "VotingScreen",
  components: {
    CloseFiltersIcon,
    UserVotedIcon
  },
  data() {
    return {
      votingName: "Какую пиццу вы хотите заказать на корпоратив?",
      resultsPublic: true,
      votingParticipantsCount: 10,
      votingOptions: [
        {
          name: "Пепперони",
          selected: false,
          participants: 3,
          percentage: 45,
        },
        {
          name: "Маргарита",
          selected: false,
          participants: 0,
          percentage: 0,
        }, 
        {
          name: "Курица терияки",
          selected: false,
          participants: 6,
          percentage: 100,
        }
      ],
      participants: [],
      userVoted: false,
      userSelectedOptionIndex: null,
    }
  },
  mounted() {
    this.getParticipants();
  },
  computed: {
    ...mapStores(useProfileStore),
    anyOptionSelected() {
      for (let i = 0; i < this.votingOptions?.length; ++i) {
        if (this.votingOptions[i].selected) {
          return true;
        }
      }
      return false;
    },
    isAdmin() {
      if (this.profileInfo?.privileged.length > 0) {
        if (
          this.profileInfo.privileged.some((el) => el.role === "A")
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    photoAddress: photoAddress,
    participantInitials(participant) {
      if (participant.first_name) {
        return participant.first_name.charAt(0) 
          + (participant.surname ? " " + participant.surname.charAt(0) : "");
      } else {
        return participant.nickname.charAt(0);
      }
    }, 
    async getParticipants() {
      if (!this.resultsPublic && !this.isAdmin) return;
      try {
        const response = await axios.get(API_URIS.employees);
        this.participants = response.data.slice(10, 13);
      } catch(err) {
        throw err;
      }
    },
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
    peopleDeclension(amount) {
      if (amount === 1) return this.$t("surveys.people_declension_1");
      if (amount % 100 >= 11 && amount % 100 <= 14) {
        return this.$t("surveys.people_declension_2");
      }
      switch (amount % 10) {
        case 1: 
            return this.$t("surveys.people_declension_2");
        case 2:
        case 3:
        case 4:
            return this.$t("surveys.people_declension_3");
        default:
            return this.$t("surveys.people_declension_2");
      }
    },
    selectVotingOption(index) {
      for (let i = 0; i < this.votingOptions.length; ++i) {
        if (i !== index) this.votingOptions[i].selected = false;
      }
      this.votingOptions[index].selected = true;
      this.userSelectedOptionIndex = index;
    },
    makeVote() {
      if (this.userSelectedOptionIndex !== null) {
        this.sendVoteToBackend(this.userSelectedOptionIndex);
      }
    },
    sendVoteToBackend(votingOptionIndex) {
      this.userVoted = true;
    },
  },  
}
</script>

<style scoped>
.voting_screen_wrapper {
  position: fixed;
  z-index: 5000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  display: flex;
}
.voting_screen {
  width: 100%;
  max-width: 599px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
  margin: auto;
}
.close_filters_icon {
  position: absolute;
  right: 20px;
  top: 18px;
  cursor: pointer;
}
.voting_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 400;
  line-height: 36px;
  text-align: left;
}
.voting_picture {
  height: 323px;
  object-fit: cover;
  border-radius: 20px;
}
.voting_parameters {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.black_dot {
  height: 4px;
  width: 4px;
  border-radius: 50%;
}

.voting_results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.voting_option_results {
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--generalColorGrey);
  overflow: hidden;
}
.percentage_bar {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #FF916E;
}
.voting_option_name {
  position: relative;
  z-index: 3;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.voting_option_participants_info {
  position: relative;
  z-index: 3;
  display: flex;
  gap: 4px;
  align-items: center;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.voting_options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.voting_option {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-radius: 12px;
  padding: 16px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  border: 1px solid var(--generalColorGrey);
}
.single_choice_selector {
  height: 20px;
  width: 20px;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.single_choice_selector.selected {
  border: 2px solid var(--generalBrand);
}
.inner_circle {
  display: none;
  height: 10px;
  width: 10px;
  border-radius: 50%;
}
.inner_circle.selected {
  display: block;
}
.participants_preview {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.participants_avatars {
  display: flex;
  width: 90px;
}
.participant_avatar {
  position: relative;
  border-radius: 50%;
  height: 46px;
  width: 46px;
  min-height: 46px;
  min-width: 46px;
  border: 1px solid var(--generalColorWhite);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.participant_photo {
  position: relative;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.participant_initials {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.vote_button {
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  padding: 16px;
  border-radius: 6px;
  width: 232.5px;
  box-sizing: border-box;
  align-self: center;
}
</style>