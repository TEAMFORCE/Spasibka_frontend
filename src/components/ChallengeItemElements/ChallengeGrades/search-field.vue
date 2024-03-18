<template>
  <div class="search_field_wrapper">
    <input
      class="search_input"
      :placeholder="$t('challenges.grades.user_search_placeholder')"
      v-model="searchInput"
    />
    <div class="search_button">
      <button class="search_user">
        <!-- <img class="search_icon" src="@/assets/Search.png" /> -->
        <SearchIcon :currentColor="getIconColor()" />
      </button>
    </div>
  </div>
</template>

<script>
import SearchIcon from "@/components/Icons/search.vue";

export default {
  name: "ChallengeSearchUserInput",
  components: {
    SearchIcon,
  },
  data() {
    return {
      searchInput: "",
    };
  },
  watch: {
    searchInput() {
      this.$emit("searchValueChanged", this.searchInput);
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorSecondary");
      return generalColorWhite;
    },
  },
};
</script>

<style scoped>
.search_field_wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 32px;
  padding: 12px;
  border: 1px solid var(--negativeSecondary);
  border-radius: 8px;
  max-width: 636px;
  width: auto;
}
.search_input {
  background-color: var(--generalColorWhite);
  outline: none;
  border-style: none;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  gap: 16px;
}
.search_input::placeholder {
  color: var(--generalColorSecondary);
}
.search_button {
  gap: 16px;
  display: flex;
  height: 32px;
  width: 32px;
  padding: 0px;
}
.search_user {
  background-color: transparent;
}
.search_icon {
  height: 12px;
  width: 12px;
}
</style>