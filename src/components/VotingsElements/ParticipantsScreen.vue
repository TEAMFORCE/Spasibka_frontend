<template>
  <div class="participants_screen_wrapper">
    <div class="participants_screen general-white-bg">
      <CloseFiltersIcon
        class="close_filters_icon"
        @click="$emit('closeParticipants')"
      />
      <h1 class="voting_name general-contrast-color">
        {{ votingName }}
      </h1>
      <div class="participants_by_options">
        <div 
          v-for="option in participantsByOptions"
          class="participants_of_option"
        >
          <div class="option_header">
            <h1 class="option_name general-contrast-color">{{ option.optionName }}</h1>
            <h1 class="participants_count general-secondary-color">{{ `${option.participantsCount} ${participantsDeclension(option.participantsCount)}` }}</h1>
          </div>
          <div 
            class="participant"
            v-for="participant in option.participantsListActual"
          >
            <div class="participant_avatar general-brand-bg">
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
            <h1 class="participant_name general-contrast-color">{{ participantName(participant) }}</h1>
          </div>  
          <button
            v-if="option.participantsList.length > 10"
            class="show_or_hide_all_participants transparent-bg general-contrast-color"
            @click="showOrHideAllParticipants(option)"
          >
            {{ option.isParticipantsListContracted ? $t("surveys.show_fully") : $t("surveys.hide") }}
          </button>   
        </div>
      </div>
      <button 
        v-if="isAdmin"
        class="download_as_excel general-brand-bg general-white-color"
        @click="downloadAsExcel"
      >
        <DownloadAsExcelIcon
          class="download_as_excel_icon"
        />
        {{ $t("surveys.download_as_excel") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CloseFiltersIcon from '../Icons/SurveyIcons/CloseFiltersIcon.vue';
import { API_URIS } from '@/constants/api';
import { photoAddress } from '@/general-scripts/photo-address';
import { mapStores } from 'pinia';
import { useStore as useProfileStore } from "@/store/profile";
import DownloadAsExcelIcon from '../Icons/SurveyIcons/DownloadAsExcelIcon.vue';

export default {
  name: "ParticipantsScreen",
  components: { CloseFiltersIcon, DownloadAsExcelIcon },
  data() {
    return {
      votingName: "Какую пиццу вы хотите заказать на корпоратив?",
      participantsByOptions: [
        {
          optionName: "Пеперони",
          participantsCount: 54,
          participantsList: [],
          participantsListContracted: [],
          participantsListActual: [],
          isParticipantsListContracted: true,
        },
        {
          optionName: "Маргарита",
          participantsCount: 0,
          participantsList: [],
          participantsListContracted: [],
          participantsListActual: [],
          isParticipantsListContracted: true,
        },
        {
          optionName: "Гавайская",
          participantsCount: 6,
          participantsList: [],
          participantsListContracted: [],
          participantsListActual: [],
          isParticipantsListContracted: true,
        },
      ]
    };
  },
  mounted() {
    this.getParticipantsByOptions();
  },
  computed: {
    ...mapStores(useProfileStore),
    isAdmin() {
      if (this.profileStore?.profileInfo?.privileged.length > 0) {
        if (
          this.profileStore?.profileInfo.privileged.some((el) => el.role === "A")
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    async getParticipantsByOptions() {
      try {
        const response = await axios.get(API_URIS.employees);
        this.participantsByOptions[0].participantsList = response.data.slice(0, 15);
        this.participantsByOptions[0].participantsListActual = response.data.slice(0, 10);
        this.participantsByOptions[0].participantsListContracted = response.data.slice(0, 10);

        this.participantsByOptions[2].participantsList = response.data.slice(10, 13);
        this.participantsByOptions[2].participantsListActual = response.data.slice(10, 13);
        this.participantsByOptions[2].participantsListContracted = response.data.slice(10, 13);
      } catch(err) {
        throw err;
      }
    },
    async downloadAsExcel() {
      try {
        console.log("Yes");
      } catch(err) {
        throw err;
      }
    },
    photoAddress: photoAddress,
    showOrHideAllParticipants(option) {
      if (option.isParticipantsListContracted) {
        option.participantsListActual = option.participantsList;
      } else {
        option.participantsListActual = option.participantsListContracted;
      }
      option.isParticipantsListContracted ^= true;
    },
    participantName(participant) {
      if (participant.first_name) {
        return (participant.surname || "") + (participant.surname ? " " : "") + (participant.first_name || "");
      } else {
        return participant.nickname;
      }
    },
    participantInitials(participant) {
      if (participant.first_name) {
        return (participant.surname ? participant.surname.charAt(0) + " " : "") 
          + participant.first_name.charAt(0);
      } else {
        return participant.nickname.charAt(0);
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
  }
}
</script>

<style scoped>
.participants_screen_wrapper {
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

.participants_screen {
  width: 100%;
  height: 80%;
  overflow-y: auto;
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
.participants_screen::-webkit-scrollbar {
  width: 8px;
}
.participants_screen::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
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
.participants_by_options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.participants_of_option {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.option_header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.option_name {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
}
.participants_count {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
}
.participant {
  display: flex;
  gap: 8px;
  align-items: center;
}
.participant_avatar {
  position: relative;
  border-radius: 50%;
  height: 34px;
  width: 34px;
  min-height: 34px;
  min-width: 34px;
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
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}
.participant_name {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.show_or_hide_all_participants {
  align-self: flex-end;
  text-decoration: underline;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}
.download_as_excel {
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 12px;
  padding: 17px 20px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  width: fit-content;
  align-self: center;
}
.download_as_excel_icon {
  height: 24px;
  width: 24px;
}
</style>