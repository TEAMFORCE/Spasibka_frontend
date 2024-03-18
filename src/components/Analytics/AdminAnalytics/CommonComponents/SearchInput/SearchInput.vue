<template>
  <div class="search_input_wrapper" ref="mySearchInput">
    <input
      class="_search_input"
      type="text"
      :placeholder="placeholder"
      v-model="searchString"
      v-debounce:800="searchStringChanged"
    />
    <SearchIcon />
  </div>
</template>

<script>
import { vue3Debounce } from "vue-debounce";

import SearchIcon from "@/components/Icons/search.vue";

export default {
  name: "SearchInput",
  components: {
    SearchIcon,
  },
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  props: {
    placeholder: {
      default: "",
    },
    width: {
      default: "300px",
    },
  },
  data() {
    return {
      searchString: "",
    };
  },
  methods: {
    searchStringChanged() {
      this.$emit("searchStringChanged", this.searchString);
    },
    setWidth() {
      if (this.width) {
        this.$refs.mySearchInput.style.width = this.width;
      }
    },
  },
  mounted() {
    this.setWidth();
  },
};
</script>

<style scoped>
.search_input_wrapper {
  width: 300px;
  position: relative;
}
._search_input {
  width: 100%;
  height: 52px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 12px 36px 12px 12px;
  box-sizing: border-box;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
}
._search_input::placeholder {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  color: var(--generalColorSecondary);
}
.search_icon {
  width: 14px;
  height: 14px;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translate(0, -50%);
}
</style>