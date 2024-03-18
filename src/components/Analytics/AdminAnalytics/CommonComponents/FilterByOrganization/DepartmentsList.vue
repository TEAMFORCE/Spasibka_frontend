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
          <span class="item_text" @click="showChildren">{{
            itemData.name
          }}</span>
        </div>
        <ul v-if="hasChild && childrensWisible">
          <DepartmentList
            v-for="item in itemData.children"
            :parentItem="item"
            :index="item.id"
            :checkedItems="checkedItems"
            v-bind:itemData="item"
            @checkedItm="checkedItm"
            @checkChildren="checkChildren"
          />
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DepartmentList",
  props: {
    itemData: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    parentItem: {
      required: false,
    },
    checkedItems: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      checked: false,
      childrensWisible: false,
    };
  },
  watch: {
    checked() {
      if (this.checked) {
        this.childrensWisible = true;
      }
    },
  },
  computed: {
    hasChild() {
      if (this.itemData.children && this.itemData.children.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    hasChecked() {
      if (this.checkedItems.includes(this.index)) {
        this.checked = true;
      }
    },
    showChildren() {
      this.childrensWisible ^= true;
    },
    checkedItm(itemData) {
      this.$emit("checkedItm", itemData);
      if (this.hasChild) {
        this.$emit("checkChildren", itemData.children);
      }
    },
    checkChildren(itemData) {
      this.$emit("checkChildren", itemData);
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