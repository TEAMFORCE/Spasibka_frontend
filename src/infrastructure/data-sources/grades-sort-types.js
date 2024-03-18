import { GRADE_FILTER_TYPE } from "../constants/grade-filter-type";

export const GRADE_FILTER_TYPES = (context) => [
    {
        id: GRADE_FILTER_TYPE.all,
        title: "Все",
        icon: null
    },
    {
        id: GRADE_FILTER_TYPE.dislike,
        title: null,
        icon: "DislikeIcon"
    },
    {
        id: GRADE_FILTER_TYPE.like,
        title: null,
        icon: "LikeIcon"
    }
]