<template>
  <form @submit.prevent novalidate>
      <Email v-model="email"/>
      <Phone v-model="phone"/>

      <div>Phone: {{ phone }}</div>
      <div>Email: {{ email }}</div>
  </form>
</template>

<script>
import Email from "./Email.vue";
import Phone from "./Phone.vue";
export default {
  components: {
    Email,
    Phone
  },
  data() {
    return {
      phone: "",
      email: ""
    };
  },
  methods: {}
};
</script>

styl
