<template>
  <div class="search_field_wrapper">
    <input
      class="search_input"
      :placeholder="$t('employee.search')"
      v-model="searchInput"
    />
    <div class="search_button">
      <button class="search_user">
        <img class="search_icon" src="@/assets/Search.png" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeSearchInput",
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
};
</script>

<style scoped>
.search_field_wrapper {
  display: flex;
  justify-content: space-between;
  height: 32px;
  padding: 12px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  max-width: 636px;
  width: 100%;
}
.search_input {
  background-color: var(--generalColorWhite);
  outline: none;
  border-style: none;
  font-family: "Ubuntu";
  font-weight: 400;
  font-size: 14px;
  flex-grow: 1;
  gap: 16px;
}
.search_input::placeholder {
  color: #8a8a8e;
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