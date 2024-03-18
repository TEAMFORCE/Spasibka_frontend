<template>
  <div class="section_deletion_form_wrapper">
    <div class="section_deletion_form general-white-bg">
      <div class="section_deletion_texts">
        <h1 class="section_deletion_header general-contrast-color">{{ $t("surveys.section_deletion") }}</h1>
        <h1 class="section_deletion_description general-secondary-color">{{ $t("surveys.are_you_sure_to_delete_section") }}</h1>
      </div>
      <div class="action_buttons general-white-bg">
        <button
          @click="$emit('cancelSectionDeletion')"
          class="action_button general-brand-bg general-white-color"
        >
          {{
            $t("surveys.cancel")
          }}
        </button>
        <button
          @click="$emit('deleteSection')"
          class="action_button brand-secondary-bg general-brand-color"
        >
          {{ $t("surveys.delete") }}
        </button>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: "SectionDeletionForm",
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.section_deletion_form_wrapper {
  position: fixed;
  z-index: 5000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  display: flex;
}

.section_deletion_form {
  width: 100%;
  max-width: 425px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  margin: auto;
}
.section_deletion_texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.section_deletion_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
}
.section_deletion_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
}

.action_buttons {
  /* box-shadow: 0px -9px 24px 0px rgba(138, 138, 138, 0.1); */
  width: 100%;
  display: flex;
  gap: 12px;
  border-radius: 0px 0px 24px 24px;
}
.action_button {
  width: 50%;
  border-radius: 6px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>