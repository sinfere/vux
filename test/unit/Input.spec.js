/* global describe, it, expect */

import Vue from 'vue'
import XInput from 'src/components/input/'

describe('Input.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div><x-input></x-input></div>',
      components: { XInput }
    }).$mount()
    expect(/weui_input/.test(vm.$el.innerHTML)).toBe(true)
  })
})

describe('should has default properties', () => {
  it('should return dirty=false', () => {
    const vm = new Vue({
      template: '<x-input v-ref:input></x-input>',
      components: { XInput }
    }).$mount()
    expect(vm.$refs.input.uuid.length).toBe(5)
    expect(vm.$refs.input.dirty).toBe(false)
    expect(vm.$refs.input.pristine).toBe(true)
    expect(vm.$refs.input.touched).toBe(true)
    expect(vm.$refs.input.untouched).toBe(false)
    expect(vm.$refs.input.required).toBe(false)
  })

  it('should return valid = false', () => {
    const vm = new Vue({
      template: '<x-input v-ref:input required></x-input>',
      components: { XInput }
    }).$mount()
    expect(vm.$refs.input.required).toBe(true)
    expect(vm.$refs.input.valid).toBe(false)
    expect(vm.$refs.input.invalid).toBe(true)
  })

  it('should return valid = true', () => {
    const vm = new Vue({
      template: '<x-input v-ref:input></x-input>',
      components: { XInput }
    }).$mount()
    vm.$nextTick(function () {
      expect(vm.$refs.input.required).toBe(false)
      expect(vm.$refs.input.valid).toBe(true)
      expect(vm.$refs.input.invalid).toBe(false)
    })
  })

  it('should return dirty = true', () => {
    const vm = new Vue({
      template: '<x-input v-ref:input></x-input>',
      components: { XInput }
    }).$mount()
    const input = vm.$refs.input
    input.value = 'test'
    vm.$nextTick(function () {
      expect(vm.$refs.input.dirty).toBe(true)
      expect(vm.$refs.input.prisine).toBe(false)
    })
  })

  it('should return touched = true', () => {
    const vm = new Vue({
      template: '<x-input v-ref:input></x-input>',
      components: { XInput }
    }).$mount()
    const input = vm.$refs.input
    input.$el.querySelector('input').blur()
    vm.$nextTick(function () {
      expect(vm.$refs.input.touched).toBe(true)
      expect(vm.$refs.input.untouched).toBe(false)
    })
  })

  it('should return touched = false', () => {
    const vm = new Vue({
      template: '<x-input v-ref:input></x-input>',
      components: { XInput }
    }).$mount()
    const input = vm.$refs.input
    input.$el.querySelector('input').focus()
    vm.$nextTick(function () {
      expect(vm.$refs.input.touched).toBe(false)
      expect(vm.$refs.input.untouched).toBe(true)
    })
  })

})

