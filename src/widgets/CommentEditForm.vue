<template>
  <div class="comment_edit_form">
    <h2 class="comment_edit_form_title">
      {{ $t("comments.edit_comment_title") }}
    </h2>
    <div class="comment_edit_form_iputs">
      <textarea
        class="comment_edit_form_iputs_item general-contrast-color"
        :placeholder="$t('comments.send_message')"
        v-model="commentText"
      />
      <!-- @keydown.ctrl.enter="sendComment" -->
    </div>
    <div class="comment_edit_form_control">
      <button
        class="comment_edit_form_control_button __save"
        @click="commentEdited"
      >
        {{ $t("comments.edit_comment_save") }}
      </button>
      <button
        class="comment_edit_form_control_button __cancel"
        @click="cancelEditing"
      >
        {{ $t("comments.edit_comment_cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentEditForm",
  props: {
    comment: {
      required: true,
    },
  },
  data() {
    return {
      commentText: "",
    };
  },
  methods: {
    cancelEditing() {
      this.$emit("cancelEditing");
    },
    commentEdited() {
      this.$emit("commentEdited", this.commentText, this.comment.id);
    },
  },
  mounted() {
    setTimeout(() => {
      this.commentText = this.comment.text;
    }, 100);
  },
};
</script>

<style scoped>
.comment_edit_form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.comment_edit_form_title {
  font-size: 20px;
  font-weight: 500;
  font-family: "Ubuntu";
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
}
.comment_edit_form_iputs {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.comment_edit_form_iputs_item {
  background-color: var(--generalColorWhite);
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  flex-grow: 1;
  resize: none;
  height: 160px;
  border: 1px solid var(--negativeSecondary) !important;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
}
.comment_edit_form_iputs_item::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  background: var(--secondaryColorBrand);
  border-radius: 50px;
}
.comment_edit_form_iputs_item::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: var(--generalBrand);
  width: 8px;
  cursor: pointer !important;
}
.comment_edit_form_iputs_item::placeholder {
  color: var(--generalColorSecondary) !important;
}

.comment_edit_form_control {
  width: 100%;
  display: flex;
  gap: 8px;
}
.comment_edit_form_control_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  font-family: "Roboto";
}
.__save {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.__cancel {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
</style>