<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary text-white fixed-top">
    <div class="container main d-flex justify-content-between">
      <router-link class="nav-link" :to="`/submit/form?id=${formId}`"><img src="/../img/logo-building-balance.svg"
          class="img-fluid" style="height:2rem;" /></router-link>
      <button class="navbar-toggler" type="button" @click="isNavCollapsed = !isNavCollapsed"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
        aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" :class="{ 'show': !isNavCollapsed }" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" ref="dropdownToggler"
              @click="toggleDropdown" aria-expanded="false">
              {{ lang.value == 'en' ? 'Selecteer taal' : 'Select Language' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" ref="dropdownMenu" @change="emitLanguageChanged"
              aria-labelledby="navbarDropdown">
              <li v-for="(language, index) in languages" :key="`select_${index}`">
                <a class="dropdown-item" href="#" @click="selectLanguage(language); closeDropdown()">{{ language.text
                  }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CNavBar',
  props: ['languages', 'formId'],
  emits: ['languageChanged'],
  data() {
    return {
      lang: {},
      isNavCollapsed: true,
    }
  },
  methods: {
    toggleDropdown(event) {
      let dropdownMenu = event.target.nextElementSibling;
      dropdownMenu.classList.toggle('show');
    },
    closeDropdown() {
      console.log("close Dropdown")
      this.$refs.dropdownMenu.classList.remove('show');
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownMenu && !this.$refs.dropdownMenu.contains(event.target) &&
        // Voeg een extra controle toe om te zien of de klik op de toggler was
        event.target !== this.$refs.dropdownToggler &&
        // Controleer ook of de klik niet binnen de toggler plaatsvond (voor nested elements binnen de toggler)
        !this.$refs.dropdownToggler.contains(event.target)) {
        this.closeDropdown();
      }
    },
    selectLanguage(language) {
      this.lang = language;
      this.emitLanguageChanged(this.lang)
      this.isNavCollapsed = true;
    },
    emitLanguageChanged(lang) {
      this.$emit('languageChanged', lang.value)
    }
  },
  mounted() {
    document.addEventListener('click', (event) => this.handleClickOutside(event));
  },
  beforeUnmount() {
    document.removeEventListener('click', (event) => this.handleClickOutside(event));
  },
}
</script>
