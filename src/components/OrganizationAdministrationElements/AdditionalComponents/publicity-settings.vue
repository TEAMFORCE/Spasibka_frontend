<template>
    <div class="publicity_settings_wrapper">
        <h1 class="publicity_settings_header general-contrast-color">Публичность перевода</h1>
        <div class="publicity_settings">
            <button
                @click="togglePublicityOptions"
                class="selected_option general-white-bg"
            >   
                <h1 class="selected_option_setting general-secondary-color">{{ currentSetting }}</h1>
                <img class="settings_list_toggler_icon" :src="getImgUrl(showPublicityOptions ? 'SettingsListCloserIcon' : 'SettingsListOpenerIcon')"/>
            </button>
            <div
                v-if="showPublicityOptions"
                class="publicity_settings_options_wrapper"    
            >
                <button
                    class="publicity_settings_options general-white-bg"
                    v-for="item in publicitySettings"
                    @click="selectOption(item)"
                >
                    <h1 class="publicity_settings_options_text general-contrast-color">{{ item }}</h1>
                </button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "PublicitySettings",
    props: {
    
    },
    data(){
        return {
            showPublicityOptions: false,
            currentSetting: "Всегда",
            publicitySettings: [
                "Всегда",
                "Никогда",
                "Опционально",
            ],
        }
    },
    methods: {
        togglePublicityOptions(){
            this.showPublicityOptions ^= 1;
        },
        selectOption(item){
            this.currentSetting = item;
            this.showPublicityOptions = false;
            this.$emit("publicityOptionSelected", item);
        },
        getImgUrl(imageName) {
            var images = require.context("@/assets/OrganizationAdministrationImages", false, /\.png$/);
            return images("./" + imageName + ".png");
        },
    }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
.publicity_settings_wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.publicity_settings_header {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
}
.publicity_settings{
    display: flex;
    flex-direction: column;
    border: 1px solid var(--neutral5);
    border-radius: 8px;
    overflow: hidden;
}
.publicity_settings_options_wrapper {
    display: flex;
    flex-direction: column;
}
.selected_option {
    padding: 13px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.selected_option_setting {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
}
.publicity_settings_options {
    border-top: 1px solid var(--neutral5);
    padding: 13px 12px;
}
.publicity_settings_options:hover {
    background-color: var(--generalColorGrey);
}
.publicity_settings_options_text {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
}
.settings_list_toggler_icon {
    width: 14px;
    height: 14px;
}

</style>