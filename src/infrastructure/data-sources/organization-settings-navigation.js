export const ORGANIZATION_SETTINGS_NAVIGATION = (context) => [
  {
    name: "settings",
    title: context.$t("organization.settings.generalSettings"),
  },
  {
    name: "branding",
    title: context.$t("organization.settings.branding"),
  },
  {
    name: "periods",
    title: context.$t("organization.settings.periods"),
  },
  {
    name: "transactions",
    title: context.$t("organization.settings.transfers"),
  },
  {
    name: "tg_groups",
    title: context.$t("organization.settings.telegram_groups"),
  },
  {
    name: "awards",
    title: context.$t("organization.settings.awards"),
  },
  {
    name: "scales",
    title: context.$t("organization.settings.award_scales"),
  },
];
