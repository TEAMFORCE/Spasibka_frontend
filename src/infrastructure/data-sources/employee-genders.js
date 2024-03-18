import { EMPLOYEE_GENDER } from "../constants/employee-gender"

export const EMPLOYEE_GENDERS = (context) => [
    {
        gender: EMPLOYEE_GENDER.man,
        title: context.$t("genders.male"),
    },
    {
        gender: EMPLOYEE_GENDER.woman,
        title: context.$t("genders.female"),
    },
]