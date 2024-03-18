<template>
    <div 
        class="sub_organization general-white-bg"
        @click="$router.push('/organization_administration/' + childOrganization.id)"
    >
        <div class="child_org_info">
            <h1 class="child_org_name general-contrast-color">
                {{ childOrganization?.name }}
            </h1>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChildOrganization",
    props: {
        childOrganization: {
            required: true,
        },
    },
    data(){
        return {

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
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@700&display=swap');

.sub_organization {
    max-width: 294px;
    width: 100%;
    padding: 16px;
    box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
    border-radius: 24px;
    display: flex;
    justify-content: space-between;
}
.sub_organization:hover {
    cursor: pointer;
}
.child_org_info {
    display: flex;
    align-items: center;
    gap: 20px;
}
.child_org_logo {
    height: 54px;
    width: 54px;
}
.child_org_name {
    font-family: 'Ubuntu';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
}
.edit_child_org {
    position: relative;
    padding: 4px;
    border-radius: 5.3px;
    display: flex;
    justify-content: center;
    align-self: flex-start;
}
.edit_child_org_icon {
    height: 16px;
    width: 16px;
}
</style>