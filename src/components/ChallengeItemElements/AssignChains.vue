<template>
  <div class="challenge_update_card">
    <div class="challenge_update_card_title_wrapper">
      <h3 class="challenge_update_card_title">
        {{ $t("challenges.challenge_chains.challenge_chain") }}
      </h3>
      <h5 class="challenge_update_card_description">
        {{ $t("challenges.challenge_chains.choose_chains") }}
      </h5>
    </div>
    <div
      class="chains_list"
      v-if="newlySelectedChains?.length"
      v-scroll-end="handleScrollEnd"
      ref="scrollContainer"
    >
      <Loading
        class="spinner_loader"
        :active="isLoading"
        :isFullPage="false"
        ref="spinnerLoader"
      />
      <div class="chain_selection" v-for="(item, index) in newlySelectedChains">
        <div
          class="checkbox_and_chain_name general-contrast-color"
          @click="selectChain(index)"
        >
          <SelectedChainIcon
            class="chain_select_checkbox"
            v-if="item.selected"
          />
          <UnselectedChainIcon class="chain_select_checkbox" v-else />
          {{ item.name }}
        </div>
        <hr class="separator" v-if="index < newlySelectedChains?.length - 1" />
      </div>
    </div>
    <div class="challenge_update_card_buttons">
      <button class="challenge_button _save" @click="selectChains">
        {{ $t("challenges.challenge_chains.select") }}
      </button>
      <button class="challenge_button _cancel" @click="cancelSelection">
        {{ $t("challenges.challenge_chains.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import vSelect from "vue-select";

import SelectedChainIcon from "../Icons/ChallengesIcons/SelectedChainIcon.vue";
import UnselectedChainIcon from "../Icons/ChallengesIcons/UnselectedChainIcon.vue";

import Loading from "vue3-loading-overlay";

export default {
  name: "AssignChains",
  components: {
    vSelect,
    SelectedChainIcon,
    UnselectedChainIcon,
    Loading,
  },
  directives: {
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler; // Store the handler on the element
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  props: {
    selectedChains: {
      required: true,
      default: [],
    },
    isLoading: {
      required: true,
      default: false,
    },
    stopFetching: {
      required: true,
      default: false,
    },
  },
  data() {
    return {
      newlySelectedChains: [],
    };
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    selectedChains: {
      handler(newVal) {
        let curSelected = [];
        for (let i = 0; i < this.newlySelectedChains?.length; ++i) {
          let curChain = this.newlySelectedChains[i];
          if (curChain.selected) {
            curSelected.push(i);
          }
        }
        if (newVal)
          this.newlySelectedChains = JSON.parse(JSON.stringify(newVal));
        for (let i = 0; i < curSelected.length; ++i) {
          this.newlySelectedChains[curSelected[i]].selected = true;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
  methods: {
    selectChain(index) {
      if (this.newlySelectedChains[index].selected) {
        this.newlySelectedChains[index].selected = false;
        return;
      }

      let alreadySelected = false;
      let alreadySelectedIndex = -1;
      for (let i = 0; i < this.newlySelectedChains?.length; ++i) {
        if (i === index) continue;
        let curChain = this.newlySelectedChains[i];
        if (curChain.selected) {
          alreadySelected = true;
          alreadySelectedIndex = i;
          break;
        }
      }
      if (alreadySelected) {
        this.newlySelectedChains[alreadySelectedIndex].selected = false;
      }
      this.newlySelectedChains[index].selected = true;
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
        this.$emit("getChains");
      }
    },
    cancelSelection() {
      this.newlySelectedChains = JSON.parse(
        JSON.stringify(this.selectedChains)
      );
      this.$emit("goToMainInfo", this.newlySelectedChains);
    },
    selectChains() {
      this.$emit("selectChains", this.newlySelectedChains);
    },
  },
};
</script>

<style scoped>
.challenge_update_card {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.challenge_update_card_title_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.challenge_update_card_title {
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  font-family: "Ubuntu";
  color: var(--generalContrast);
  margin: 0;
}
.challenge_update_card_description {
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  font-family: "SF Pro Text";
  color: var(--generalColorSecondary);
  margin: 0;
}
.chains_list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 8px;
}
.chain_selection {
  display: flex;
  flex-direction: column;
}
.checkbox_and_chain_name {
  padding: 13px 13px 13px 0px;
  display: flex;
  align-items: center;
  gap: 32px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
}
.chain_select_checkbox {
  height: 20px;
  width: 20px;
}
.separator {
  width: 100%;
}
.challenge_update_card_buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}
.challenge_button {
  width: 50%;
  height: 48px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 400;
}
._save {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
._cancel {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
.vs__selected {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.vs__selected-options {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vs__dropdown-option {
  white-space: normal;
  word-wrap: break-word;
}
</style>