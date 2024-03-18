<template>
    <div class="organization_contacts general-white-bg">
        <h1 class="organization_contacts_label general-contrast-color">
            {{ organizationService }}
        </h1>
        <div
            class="contacts_list"
            v-for="item in contactsList"
        >       
            <div class="contact">
                <h1 class="contact_header general-secondary-color">
                    {{ item.header }}
                </h1>
                <h1 class="contact_value general-contrast-color">
                    {{ item.value }}
                </h1>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "OrganizationContacts",
    data(){
        return {
            organizationService: "Telegram",
            contactsList: [
                {
                    header: "Имя бота, обслуживающего группу",
                    value: "@DigitalRef"
                },
                {
                    header: "Имя группы",
                    value: "TeamForce"
                }
            ]
        }
    },
    methods: {
        getImgUrl(imageName) {
            var images = require.context("@/assets/OrganizationAdministrationImages", false, /\.png$/);
            return images("./" + imageName + ".png");
        },
    }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@700&display=swap");
.organization_contacts {
    box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
    border-radius: 24px;
    width: 311px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.organization_contacts_label {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    text-align: left;
}
.contacts_list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.contact {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.contact_header {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-align: left;
}
.contact_value {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
}
</style>