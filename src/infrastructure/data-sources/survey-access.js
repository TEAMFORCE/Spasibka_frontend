import { SURVEY_ACCESS_CONDITIONS } from "@/infrastructure/constants/survey-access-condition"

export const SURVEY_ACCESS = (context) => [
    {
        condition: SURVEY_ACCESS_CONDITIONS.all,
        title: context.$t("surveys.management_settings.access_list.all"),
    },
    {
        condition: SURVEY_ACCESS_CONDITIONS.someUsers,
        title: context.$t("surveys.management_settings.access_list.someUsers"),
    },
]