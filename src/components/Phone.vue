<template>
  <div class="tel">
    <div :class="'tel-input-flag active-flag ' + activeFlag" @click="showFlags = !showFlags"/>
    <input type="tel" 
      v-model="tel"
      ref="input"
      placeholder="Phone"
      @focus="formatPhone"
      @blur="onBlur"
      @input="onInput">
      valid: {{ valid }}

    <transition name="slide-down">
      <div class="tel-input-flags" v-if="showFlags">
        <div v-for="country in countries"
          class="tel-input-item"
          @click="selectFlag(country)"
          :key="country[1]">
          <div :class="'tel-input-flag ' + country[1]"></div>
          {{ country[0] }} <span class="gray">+{{ country[2] }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { format, isValidNumber, AsYouType } from "libphonenumber-js";
import countries from "../assets/countries.js";
import lengths from "../assets/lengths.js";

export default {
  data() {
    return {
      tel: "",
      mode: "International",
      countries,
      activeFlag: "us",
      showFlags: false
    };
  },
  computed: {
    valid() {
      return isValidNumber(this.tel);
    },
    meta() {
      const asYouType = new AsYouType();
      asYouType.input(this.tel);
      return asYouType;
    },
    defaultValue() {
      const [, , dial] = countries.find(el => el[1] === this.activeFlag);
      return `+${dial}`;
    }
  },
  methods: {
    onInput() {
      // Update formatting
      this.formatPhone();
      // Try to determine country and update flag
      if (this.meta.country) {
        this.activeFlag = this.meta.country.toLowerCase();
      }

      this.$emit("input", this.meta.parsed_input);
    },
    formatPhone() {
      const currentLength = this.meta.parsed_input.length;
      const maxLength = lengths[this.activeFlag] + 1;

      // Remove any digits beyound max length
      if (currentLength > maxLength) {
        this.tel = this.meta.parsed_input.substr(0, maxLength);
      }

      // Format phone
      this.tel = format(this.tel || this.defaultValue, "", this.mode);
    },
    onBlur() {
      // Show placeholder if only code was entered
      if (this.meta.parsed_input === this.defaultValue) {
        this.tel = "";
      }
    },
    selectFlag(country) {
      const [, code] = country;
      const nationalNumber = this.meta.parsed_input.replace(
        this.defaultValue,
        ""
      );

      // Set active flag
      this.activeFlag = code;
      // Change number according to new flag
      this.tel = `${this.defaultValue}${nationalNumber}`;
      // Hide flag select
      this.showFlags = false;
      // Focus on input
      this.$refs.input.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.tel {
  position: relative;
  width: 300px;

  input {
    padding-left: 30px;
    height: 20px;
  }
}

.active-flag {
  position: absolute;

  top: -6px;
  left: -15px;
  cursor: pointer;
}

$countries: ad ae af ag ai al am ao ar as at au aw az ba bb bd be bf bg bh bi bl
  bm bn bo bq br bs bt bw by bz ca cd cf cg ch ci ck cl cm cn co cr cu cv cw cy
  cz de dj dk dm do dz ec ee eg er es et fi fj fk fm fo fr ga gb gd ge gf gh gi
  gl gm gn gp gq gr gt gu gw gy hk hn hr ht hu id ie il in io iq ir is it jm jo
  jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md
  me mf mg mh mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na nc ne nf ng ni
  nl no np nr nu nz om pa pe pf pg ph pk pl pm pr ps pt pw py qa re ro rs ru rw
  sa sb sc sd se sg sh si sk sl sm sn so sr ss st sv sx sy sz tc td tg th tj tk
  tl tm tn to tr tt tv tw tz ua ug us uy uz va vc ve vg vi vn vu wf ws ye za zm
  zw bj cx cc gg im xk yt sj eh ax je;

.tel-input-flags {
  height: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
  position: absolute;
  width: 100%;
  background: white;
  z-index: 1;
}

.tel-input-flag {
  margin-right: 10px;
  width: 60px;
  height: 40px;
  background-image: url("../../static/flags.png");
  background-repeat: no-repeat;
  transform: scale(0.3);
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.tel-input-item {
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: lightgrey;
  }

  .gray {
    margin-left: 5px;
    color: gray;
  }
}

@each $country in $countries {
  $i: index($countries, $country) - 1;

  .tel-input-flag.#{$country} {
    background-position: -#{$i*70}px 0;
  }
}
</style>
