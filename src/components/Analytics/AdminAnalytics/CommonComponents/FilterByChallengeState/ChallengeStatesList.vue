<template>
  <div class="department_list_wrapper">
    <ul class="department_list">
      <li class="list_item">
        <div class="item_wrapper">
          <input
            type="checkbox"
            class="checkbox"
            v-model="checked"
            @change="checkedItm(itemData)"
          />
          <span class="item_text">{{
            itemData.title
          }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ChallengeStatesList",
  props: {
    itemData: {
      type: Object,
      required: true,
    },
    index: {
      type: String,
      required: true,
    },
    checkedItems: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    hasChecked() {
      if (this.checkedItems.includes(this.index)) {
        this.checked = true;
      }
    },
    checkedItm(itemData) {
      this.$emit("checkedItm", itemData);
    },
  },
  mounted() {
    this.hasChecked();
  },
};
</script>

<style scoped>
ul {
  padding: 0;
  margin: 2px 0;
}
.department_list_wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.department_list {
  list-style: none;
}
.list_item {
  padding: 0 0 0 10px;
}
.item_wrapper {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}

.checkbox {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #ecf0f3;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
.item_text {
  font-family: "Golos" !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: var(--generalColorDark);
  margin: 0;
}
</style>