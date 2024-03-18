<template>
  <div class="footer general-white-bg" ref="appFooter">
    <div class="needed_info">
      <div class="feedback_info">
        <h1 class="feedback_header general-contrast-color">
          {{ $t("footer.feedback") + ":" }}
        </h1>
        <div class="feedback_contacts">
          <a
            class="feedback_contact feedback_email general-contrast-color"
            :href="'mailto:' + email"
          >
            {{ $t("footer.email") + ": " + email }}
          </a>
          <a
            class="feedback_contact feedback_telegram general-contrast-color"
            :href="'https://t.me/' + telegram"
            target="_blank"
          >
            {{ $t("footer.telegram") + ": @" + telegram }}
          </a>
        </div>
      </div>
      <div class="documents">
        <a class="link_to_doc" :href="'/terms_of_use'" target="_blank">
          <h1 class="document_name general-contrast-color">
            Пользовательское соглашение
          </h1>
        </a>
        <a class="link_to_doc" :href="'/privacy_policy'" target="_blank">
          <h1 class="document_name general-contrast-color">
            Политика конфиденциальности
          </h1>
        </a>
      </div>
    </div>
    <h1 class="copyright general-brand-color">© 2008-2024 , ТИМ ФОРС</h1>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      email: "benefits@teamforce.ru",
      telegram: "teamforce_360",
    };
  },
};
</script>

<style scoped>
.footer {
  padding: 24px 52px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  align-items: flex-end;
}
.needed_info {
  display: flex;
  gap: 52px;
  align-items: flex-end;
}
.feedback_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feedback_header {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
}
.feedback_contacts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.feedback_email {
  text-decoration: underline;
}
.feedback_telegram {
  text-decoration: none;
}
.feedback_contact {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
}
.documents {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.link_to_doc {
  text-decoration: none;
}
.document_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
}
.copyright {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
}
@media (max-width: 768px) {
  .footer {
    padding: 24px 12px 24px 12px;
    gap: 12px;
  }
  .needed_info {
    gap: 12px;
  }
}
</style>