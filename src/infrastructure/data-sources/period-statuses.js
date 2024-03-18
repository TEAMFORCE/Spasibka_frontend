import { PERIOD_STATUS } from "../constants/period-status"

export const PERIOD_STATUSES = (context) => [
    {
        status: PERIOD_STATUS.notActive,
        title: context.$t("common_components.period_statuses.not_active")
    },
    {
        status: PERIOD_STATUS.active,
        title: context.$t("common_components.period_statuses.active")
    },
    {
        status: PERIOD_STATUS.ended,
        title: context.$t("common_components.period_statuses.ended")
    }
]