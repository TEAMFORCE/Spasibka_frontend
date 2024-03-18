import { ROLE_TYPE } from "../constants/role-type"

export const ROLE_TYPES = (context) => [
    {
      role: ROLE_TYPE.admin,
      title: context.$t("common_components.employee_creation.admin")
    },
    {
      role: ROLE_TYPE.manager,
      title: context.$t("common_components.employee_creation.manager")
    },
    {
      role: ROLE_TYPE.controller,
      title: context.$t("common_components.employee_creation.controller")
    }
]