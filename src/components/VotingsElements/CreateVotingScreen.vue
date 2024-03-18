<template>
  <div class="create_voting_screen_wrapper">
    <div class="create_voting_screen general-white-bg">
      <h1 class="voting_creation_header general-contrast-color">
        {{ $t("surveys.voting_creation") }}
      </h1>
      <h1 class="voting_creation_description general-secondary-color">
        {{ $t("surveys.add_main_info") }}
      </h1>
      <div class="voting_creation_form">
        <div class="input_field_wrapper">
          <div
            v-if="votingName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("surveys.name") }}
          </div>
          <input
            class="input_field general-contrast-color"
            v-model="votingName"
            :placeholder="$t('surveys.name')"
          />
        </div>
        <div
          class="answer_options_list"
          v-for="(option, index) in answerOptions"
        >
          <button
            class="selection_checkbox_wrapper transparent-bg"
            @click="option.score ^= true"
          >
            <OptionSelectedInVotingCreationIcon
              class="selection_checkbox_icon"
              v-if="option.score"
            />
            <OptionDeselectedInVotingCreationIcon
              class="selection_checkbox_icon"
              v-else
            />
          </button>
          <div class="input_field_wrapper">
            <div
              v-if="option.answer"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.answer") }}
            </div>
            <DeleteAnswerOptionIcon
              class="delete_answer_option_icon"
              @click="deleteOption(index)"
            />
            <input
              class="input_field general-contrast-color"
              v-model="option.answer"
              :placeholder="$t('surveys.answer')"
            />
          </div>
        </div>
        <button
          class="add_another_option general-secondary-color transparent-bg"
          @click="addOption"
        >
          {{ $t("surveys.add_another_option") }}
        </button>
        <label class="file_input_button general-brand-color" for="file_input">
          <AttachFileIcon class="attach_file_icon" />
          {{ $t("surveys.cover") }}
        </label>
        <input 
          id="file_input"
          type="file"
          @change="uploadFile"
        />
        <img v-if="votingCover" class="voting_cover" :src="votingCoverURL"/>
      </div>
      <div class="additional_settings">
        <div class="anonymous_voting general-contrast-color">
          {{ $t("surveys.anonymous_voting") }}
          <div class="item_switch">
            <label class="switch">
              <input type="checkbox" v-model="isVotingAnonymous" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <button 
          @click="configureVotingTime"
          class="time_settings brand-secondary-bg general-brand-color"
        >
          {{ $t("surveys.voting_time") }}
        </button>
      </div>
      <div class="action_buttons general-white-bg">
        <button
          @click="createVoting"
          class="action_button general-brand-bg general-white-color"
        >
          {{
            $t("surveys.create")
          }}
        </button>
        <button
          @click="$emit('disableVotingCreation')"
          class="action_button brand-secondary-bg general-brand-color"
        >
          {{ $t("surveys.back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DeleteAnswerOptionIcon from "../Icons/SurveyIcons/DeleteAnswerOptionIcon.vue";
import OptionDeselectedInVotingCreationIcon from "../Icons/SurveyIcons/OptionDeselectedInVotingCreationIcon.vue";
import OptionSelectedInVotingCreationIcon from "../Icons/SurveyIcons/OptionSelectedInVotingCreationIcon.vue";
import AttachFileIcon from "../Icons/SurveyIcons/AttachFileIcon.vue";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "CreateVotingScreen",
  props: {
    votingStartTime: { default: null },
    votingEndTime: { default: null }
  },
  components: {
    OptionSelectedInVotingCreationIcon,
    OptionDeselectedInVotingCreationIcon,
    DeleteAnswerOptionIcon,
    AttachFileIcon,
  },
  data() {
    return {
      isVotingAnonymous: false,
      votingCover: null,
      votingCoverURL: null,
      votingName: "",
      answerOptions: [
        {
          answer: "",
          score: true,
        },
        {
          answer: "",
          score: false,
        },
      ],
    };
  },
  methods: {
    configureVotingTime() {
      this.$emit("configureVotingTime");
    },
    uploadFile(event) {
      this.votingCover = event.target.files[0];
      this.votingCoverURL = URL.createObjectURL(this.votingCover);
    },
    deleteOption(index) {
      this.answerOptions.splice(index, 1);
    },
    addOption() {
      this.answerOptions.push({ answer: "", score: false });
    },
    async createVoting() {
      try {
        for (let i = 0; i < this.answerOptions.length; ++i){
          if (this.answerOptions[i].score) this.answerOptions[i].score = 1;
          else this.answerOptions[i].score = 0;
        }
        let requestObject = {
          title: this.votingName,
          answers: this.answerOptions,
          anonymous: this.isVotingAnonymous,
        };
        if (this.votingStartTime) requestObject.started_at = this.votingStartTime;
        if (this.votingEndTime) requestObject.finished_at = this.votingEndTime;
        const response = await axios.post(API_URIS.questionnariesVotes, requestObject);
        this.$emit("votingCreated");
      } catch(err) {
        notify(
          err?.response?.data?.status || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    }
  },
};
</script>

<style scoped>
.create_voting_screen_wrapper {
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
.create_voting_screen {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 52px 32px 32px 32px;
  gap: 16px;
  margin: auto;
}
.voting_creation_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
}
.voting_creation_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.voting_creation_form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.input_field {
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.answer_options_list {
  display: flex;
  gap: 12px;
  align-items: center;
}
.selection_checkbox_wrapper {
  height: 16px;
  width: 16px;
}
.selection_checkbox_icon {
  height: 16px;
  width: 16px;
}
.delete_answer_option_icon {
  cursor: pointer;
  height: 24px;
  width: 24px;
  position: absolute;
  top: 15px;
  right: 14px;
}
.add_another_option {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  align-self: flex-start;
  text-decoration: underline;
}
.file_input_button {
  padding: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid var(--generalBrand);
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
.attach_file_icon {
  height: 24px;
  width: 24px;
}
#file_input {
  display: none;
}
.voting_cover {
  height: 80px;
  width: 80px;
  object-fit: cover;
  border: 1px solid var(--generalBrand);
  border-radius: 6px;
}
.additional_settings {
  display: flex;
  flex-direction: column;
}
.anonymous_voting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 16px 0px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.time_settings {
  border-radius: 12px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
.action_buttons {
  width: 100%;
  display: flex;
  gap: 12px;
  border-radius: 0px 0px 24px 24px;
}
.action_button {
  width: 50%;
  border-radius: 6px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>
