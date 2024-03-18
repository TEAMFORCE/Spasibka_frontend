export const ORGANIZATION_NAVIGATION = (context) => [
    {
        name: "copyLink",
        icon: "copyLinkIcon",
        path: "/organization_administration_settings/",
        tooltipHeader: context.$t("organization.copy_invite_link")
    },
    {
        name: "branding",
        icon: "BrandingIcon",
        path: "/organization_administration_settings/",
        tooltipHeader: context.$t("organization.branding_settings")
    },
    {
        name: "settings",
        icon: "SettingsIcon",
        path: "/organization_administration_settings/",
        tooltipHeader: context.$t("organization.organization_settings")
    },
]
