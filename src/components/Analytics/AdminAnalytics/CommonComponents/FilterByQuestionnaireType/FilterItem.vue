<template>
  <div class="_list_item">
    <input
      type="checkbox"
      class="checkbox"
      :id="`checkbox${item.type}`"
      v-model="checked"
      @change="checkedItm"
    />
    <label :for="`checkbox${item.type}`" class="_list_item_text">
      {{ item.title }}
    </label>
  </div>
</template>

<script>
export default {
  name: "FilterByQuestionnaireTypeListItem",
  props: {
    item: {
      required: true,
    },
    items: {
      required: true,
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    checkedItm() {
      if (this.checked) {
        this.$emit("itemChecked", this.item);
      } else {
        this.$emit("itemUnchecked", this.item);
      }
    },
  },
  mounted() {
    if (this.items.some((el) => el.type === this.item.type)) {
      this.checked = true;
    }
  },
};
</script>

<style scoped>
._list_item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}
</style>