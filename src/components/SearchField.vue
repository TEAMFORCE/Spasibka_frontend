<template>
  <div class="search_field">
    <input
      type="text"
      v-model="inputText"
      :placeholder="placeholder"
      @focus="focus"
      v-click-outside="closeInput"
    />
    <div v-if="inputFocused" class="drop_down_list">
      <button
        class="particular_option general-white-bg"
        v-for="item in dropDownList"
        :key="keyReduce(item)"
        @click="onSelect(item)"
      >
        <h1 class="list_item_text character-title-dot85-color">
          {{ valueReduce(item) }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchField",
  props: {
    dropDownList: {
      default: [],
    },
    inputString: {
      default: "",
    },
    keyReduce: {},
    valueReduce: {},
    placeholder: {
      default: "",
    },
    minInputLength: {
      default: "1",
    },
    clearInputOnSelect: {
      default: true,
    },
  },
  data() {
    return {
      inputText: this.inputString,
      inputFocused: false,
    };
  },
  watch: {
    inputText: {
      handler(newText) {
        if (newText.length > 0 && newText.charAt(0) == " ") {
          this.inputText = "";
        } else {
          if (newText.length >= this.minInputLength) {
            this.$emit("onInput", newText);
          } else {
            this.$emit("clearInput");
          }
        }
      },
      flush: "post",
    },
  },
  methods: {
    async onSelect(item) {
      await this.emitInput(item);
      this.$emit("onSelect", item);
      this.unfocus();
    },
    emitInput(item) {
      if (this.clearInputOnSelect) {
        this.inputText = "";
      } else {
        this.inputText = item.tg_name;
      }
    },
    focus() {
      this.inputFocused = true;
    },
    unfocus() {
      this.inputFocused = false;
    },
    closeInput() {
      setTimeout(() => {
        this.inputFocused = false;
      }, 10);
    },
  },
};
</script>


<style scoped>
.search_field {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  background-color: var(--generalColorWhite);
}
.drop_down_list {
  top: 48px;
  display: flex;
  flex-direction: column;
  max-height: 300px;
  box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  z-index: 2;
}

@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
input {
  height: 22px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  padding: 12px;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.85);
}
input:focus {
  outline: none;
}

.particular_option {
  padding: 5px 12px;
}
.particular_option:hover {
  background-color: var(--conditionalItemBackgroundHover) !important;
}
.list_item_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
}
</style>