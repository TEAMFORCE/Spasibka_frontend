<template>
  <div 
    class="challenge_chain_participants general-white-bg"
    ref="scrollContainer"
  >
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <div
      class="participant_card"
      v-for="person in participants"
      @click="openProfile(person)"
    >
      <img
        class="person_photo"
        v-if="person?.photo"
        :src="photoAddress(person.photo)"
      />
      <UserIcon class="person_photo_alt" v-else/>
      <div class="person_name general-contrast-color">
        {{ person.participant_name }}
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import { photoAddress } from "@/general-scripts/photo-address";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import { mapStores } from "pinia";
import UserIcon from "@/components/Icons/user.vue";
import Loading from "vue3-loading-overlay";

export default {
  name: "ChallengeChainParticipants",
  props: {
    scrolledToBottom: {
      required: true
    }
  },
  components: { UserIcon, Loading },
  data() {
    return {
      limit: 20,
      offset: 1,
      isLoading: false,
      stopFetching: false,

      participants: [],
    };
  },
  watch: {
    scrolledToBottom: {
      handler() {
        this.handleScrollEnd();
      }
    },
    isLoading: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      }
    },
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal) {
          this.getParticipants();
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useProfileStore),
  },
  methods: {
    photoAddress: photoAddress,
    openProfile(person) {
      this.$router.push("/other_profile/" + person.participant_id);
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      if (el) {
        const rect = el.getBoundingClientRect();
        const loaderEl = this.$refs.spinnerLoader.$el;
        loaderEl.style.position = "fixed";
        loaderEl.style.top = `${rect.top}px`;
        loaderEl.style.left = `${rect.left}px`;
        loaderEl.style.width = `${rect.width}px`;
        loaderEl.style.height = `${rect.height}px`;
      }
    },
    handleScrollEnd() {
      if (!this.isLoading && !this.stopFetching) {
        this.offset++;
        this.getParticipants();
      }
    },
    async getParticipants() {
      try {
        this.isLoading = true;
        let params = {
          offset: this.offset,
          limit: this.limit,
        };
        const response = await axios.get(
          API_URIS.challengeGroupsParticipants
            .replace(
              "organization_id",
              this.profileStore.profileInfo.profile.organization_id
            )
            .replace("group_id", this.$route.params.id),
          {
            params,
          }
        );
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
        this.participants.push(...response.data.data);
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenge_chain_participants {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.participant_card {
  cursor: pointer;
  display: flex;
  gap: 12px;
  width: 300px;
  padding: 12px;
  border-radius: 12px; 
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.person_photo_alt {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  overflow: hidden;
}

.person_photo {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.person_name {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
}
</style>
