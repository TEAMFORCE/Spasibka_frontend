import { EMPLOYEE_STATUS } from "../constants/employee-status"

export const EMPLOYEE_STATUSES = (context) => [
    {
        status: EMPLOYEE_STATUS.office,
        title: context.$t('employee.statuses.office')
    },
    {
        status: EMPLOYEE_STATUS.remotely,
        title: context.$t('employee.statuses.remotely')
    },
    {
        status: EMPLOYEE_STATUS.vacation,
        title: context.$t('employee.statuses.vacation')
    },
    {
        status: EMPLOYEE_STATUS.illness,
        title: context.$t('employee.statuses.illness')
    },
]