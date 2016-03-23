/**
* field properties are almost the same as https://github.com/vuejs/vue-validator
*
* valid: whether field is valid; if it's valid, then return true, else return false.
* invalid: reverse of valid.
* touched: whether field is touched. if field was focused, return true, else return false.
* untouched: reverse of touched.
* dirty: whether field value was changed at least once; if so, return true, else return false.
* pristine: reverse of dirty.
* errors: if invalid field exist, return error message wrapped with array, else undefined.
*/

export default {
  props: {
    /**
    * Default value is false
    * Switch element always matches `required`
    */
    required: {
      type: Boolean,
      default: false
    }
  },
  created: function () {
    // every form element has a unique uuid
    this.uuid = Math.random().toString(36).substring(3, 8)
  },
  computed: {
    pristine: function () {
      return !this.dirty
    },
    invalid: function () {
      return !this.valid
    },
    untouched: function () {
      return !this.touched
    }
  },
  methods: {
    // manually validate function
    validate: function () {
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      /**
      * whether field value was changed at least once
      */
      if (newVal !== oldVal && !this.dirty) {
        this.dirty = true
      }
      /**
      * change event triggers by each component as logics are different
      * this.$dispatch('change', newVal)
      */
    }
  },
  data: function () {
    return {
      errors: [], // {validator: 'customValidator', message: 'invalid fieldX'}
      dirty: false,
      touched: true,
      valid: false
    }
  }
}
