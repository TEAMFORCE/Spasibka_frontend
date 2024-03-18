import { BENEFIT_STATUS } from "../constants/benefit-status"

export const BENEFIT_STATUSES = (context) => [
    {
        status: BENEFIT_STATUS.ACTIVE,
        title: context.$t("types.benefitStatuses.active")
    },
    {
        status: BENEFIT_STATUS.DECLINED,
        title: context.$t("types.benefitStatuses.declined")
    }
]