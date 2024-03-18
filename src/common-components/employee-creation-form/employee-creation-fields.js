import i18n from "@/i18n";

import { EMPLOYEE_GENDERS } from "@/infrastructure/data-sources/employee-genders";
import { EMPLOYEE_STATUSES } from "@/infrastructure/data-sources/employee-statuses";
import { ROLE_TYPES } from "@/infrastructure/data-sources/role-types";

export const employeeFields = [
  {
    type: "vSelect",
    textName: i18n.global.t(
      "common_components.employee_creation.organization_selection"
    ),
    fieldName: "organization_id",
    label: "name",
  },
  {
    type: "vSelect",
    textName: i18n.global.t(
      "common_components.employee_creation.department_selection"
    ),
    fieldName: "department_id",
    label: "name",
  },
  {
    type: "vSelect",
    textName: i18n.global.t(
      "common_components.employee_creation.role_selection"
    ),
    fieldName: "role",
    label: "title",
    options: (context) => ROLE_TYPES(context),
  },
  {
    type: "input",
    textName: i18n.global.t(
      "common_components.employee_creation.tg_name_input"
    ),
    fieldName: "tg_name",
  },
  {
    type: "input",
    textName: i18n.global.t("common_components.employee_creation.tg_id_input"),
    fieldName: "tg_id",
  },
  {
    type: "input",
    textName: i18n.global.t(
      "common_components.employee_creation.surname_input"
    ),
    fieldName: "surname",
  },
  {
    type: "input",
    textName: i18n.global.t("common_components.employee_creation.name_input"),
    fieldName: "first_name",
  },
  {
    type: "input",
    textName: i18n.global.t(
      "common_components.employee_creation.patronymic_input"
    ),
    fieldName: "middle_name",
  },
  {
    type: "input",
    textName: i18n.global.t(
      "common_components.employee_creation.nickname_input"
    ),
    fieldName: "nickname",
  },
  {
    type: "vSelect",
    textName: i18n.global.t(
      "common_components.employee_creation.gender_selection"
    ),
    fieldName: "gender",
    label: "title",
    options: (context) => EMPLOYEE_GENDERS(context),
  },
  {
    type: "vSelect",
    textName: i18n.global.t(
      "common_components.employee_creation.status_selection"
    ),
    fieldName: "status",
    label: "title",
    options: (context) => EMPLOYEE_STATUSES(context),
  },
  {
    type: "datepicker",
    textName: i18n.global.t("common_components.employee_creation.hired_date"),
    fieldName: "hired_at",
  },
  {
    type: "datepicker",
    textName: i18n.global.t("common_components.employee_creation.birth_date"),
    fieldName: "date_of_birth",
  },
  {
    type: "input",
    textName: i18n.global.t("common_components.employee_creation.email_input"),
    fieldName: "email",
  },
  {
    type: "input",
    textName: i18n.global.t(
      "common_components.employee_creation.phone_number_input"
    ),
    fieldName: "phone_number",
  },
  {
    type: "input",
    textName: i18n.global.t(
      "common_components.employee_creation.position_input"
    ),
    fieldName: "job_title",
  },
];
