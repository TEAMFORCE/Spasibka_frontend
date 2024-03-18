import { ITEM_STATUS } from "../constants/item-status"

export const ITEMS_STATUSES = (context) => [
    {
        status: ITEM_STATUS.beingConsidered,
        title: context.$t("market.statuses.beingConsidered")
    },
    {
        status: ITEM_STATUS.waiting,
        title: context.$t("market.statuses.waiting")
    },
    {
        status: ITEM_STATUS.purchased,
        title: context.$t("market.statuses.purchased")
    },
    {
        status: ITEM_STATUS.sentOrDelivered,
        title: context.$t("market.statuses.sentOrDelivered")
    },
    {
        status: ITEM_STATUS.declined,
        title: context.$t("market.statuses.declined")
    },
    {
        status: ITEM_STATUS.cancelled,
        title: context.$t("market.statuses.cancelled")
    }
]