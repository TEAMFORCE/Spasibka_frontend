<template>
  <div class="step_component">
    <h1 class="step-title">{{ step.title }}</h1>
    <SlickList
      v-model:list="step.items"
      group="steps"
      class="list"
      lock-axis="y"
      :accept="acceptFunction"
    >
      <SlickItem
        v-for="(item, idx) in step.items"
        :index="idx"
        :key="idx"
        class="item general-white-bg general-contrast-color"
      >
        <div class="circle_number general-brand-bg general-white-color">
          {{ index + 1 }}
        </div>
        {{ item.name }}
      </SlickItem>
    </SlickList>
  </div>
</template>

<script>
import { SlickList, SlickItem } from "vue-slicksort";

export default {
  props: ["step", "index"],
  components: {
    SlickList,
    SlickItem,
  },
  data() {
    return {
      newItem: "",
    };
  },
  methods: {
    addItem() {
      if (this.newItem.trim()) {
        this.step.items.push({ text: this.newItem });
        this.newItem = "";
      }
    },
    acceptFunction({ source, dest, payload }) {
      if (payload.id === "new") return true;
      return false;
    },
  },
};
</script>

<style scoped>
.step_component {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.step-title {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  display: flex;
  gap: 12px;
  padding: 18px 12px;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
}
.circle_number {
  box-sizing: border-box;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  height: 20px;
  width: 20px;
}

.item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.input-field {
  width: calc(100% - 20px);
  padding: 10px;
  box-sizing: border-box;
  margin: 10px 0;
  border-radius: 3px;
  border: 1px solid #d3d3d3;
}

.add-button {
  padding: 10px 20px;
  background-color: #4caf50; /* Green */
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #45a049;
}
</style>