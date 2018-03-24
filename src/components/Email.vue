<template>
  <div class="email-input">
    <input placeholder="Email" 
      v-model="email" 
      type="email"
      @input="emit"
      @keyup.down="keyDown"
      @keyup.up="keyUp"
      @keyup.enter="select"
      @keydown.tab="select"
      @focus="focused = true" 
      @blur="focused = false">
      valid: {{ valid }}
    <transition name="slide-down">
      <div class="email-ac" v-show="showAc">
        <div v-for="(domain, index) in domains" 
          :key="index"
          @mouseenter="domainFocus = index"
          :class="{ focused: domainFocus === index }">
          @{{ domain }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      domains: ["google.com", "yahoo.com", "aol.com"],
      domainFocus: 0,
      focused: false,
      email: "",
      regExp: /^\w+([_.-]\w+)*\w@\w((\.\w)*\w+)*(-)*((\.\w)*\w+)*\.\w{2,3}$/i
    };
  },
  computed: {
    showAc() {
      return (
        this.focused && this.email.length > 1 && this.email.slice(-1) === "@"
      );
    },
    valid() {
      return Boolean(this.email && this.regExp.test(this.email));
    }
  },
  methods: {
    keyDown() {
      if (this.domainFocus === this.domains.length - 1) {
        this.domainFocus = 0;
      } else {
        this.domainFocus++;
      }
    },
    keyUp() {
      if (this.domainFocus === 0) {
        this.domainFocus = this.domains.length - 1;
      } else {
        this.domainFocus--;
      }
    },
    select() {
      if (this.showAc) {
        this.email += this.domains[this.domainFocus];
        this.emit();
      }
    },
    emit() {
      this.$emit("input", this.email);
    }
  }
};
</script>

<style>
.email-input {
  position: relative;
}

.email-ac {
  padding: 5px;
  position: absolute;
  top: 100%;
  border: 1px solid black;
  background: white;
  z-index: 1;
}

.focused {
  color: white;
  background: blue;
}

.slide-down-leave-active,
.slide-down-enter-active {
  transition: transform 0.3s;
  transform-origin: top;
}

.slide-down-leave-to {
  transform: scaleY(0);
}

.slide-down-leave {
  transform: scaleY(1);
}

.slide-down-enter {
  transform: scaleY(0);
}

.slide-down-enter-to {
  transform: scaleY(1);
}
</style>
