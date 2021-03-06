<template>
  <div class="inline-calendar" :class="{'is-weekend-highlight': highlightWeekend}">
    <div class="calendar-header">
      <div class="calendar-year">
        <a class="year-prev vux-prev-icon" href="javascript:" @click="go(year - 1, month)"></a>
        <a class="calendar-year-txt calendar-title" href="javascript:">{{year}}</a>
        <a class="year-next vux-next-icon" href="javascript:" @click="go(year + 1, month)"></a>
      </div>

      <div class="calendar-month">
        <a @click="prev" class="month-prev vux-prev-icon" href="javascript:"></a>
        <a class="calendar-month-txt calendar-title" href="javascript:">{{months[month]}}</a>
        <a @click="next" class="month-next vux-next-icon" href="javascript:"></a>
      </div>
    </div>

    <table cellpadding="5">
      <thead>
        <tr>
          <td v-for="(index, week) in weeks" class="week is-week-list-{{index}}">{{week}}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(k1,day) in days">
          <td :data-date="formatDate(year, month, child)"
          :data-current="value"
          v-for="(k2,child) in day"
          :class="buildClass(k2, child, formatDate(year, month, child) === value && !child.isLastMonth && !child.isNextMonth)"
          @click="select(k1,k2,$event)">
            <span v-show="(!child.isLastMonth && !child.isNextMonth ) || (child.isLastMonth && showLastMonth) || (child.isNextMonth && showNextMonth)">{{child.day}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import format from '../datetime/format'
import {getDays} from './util'

export default {
  props: {
    value: {
      type: String,
      twoWay: true,
      default: ''
    },
    startDate: {
      type: String
    },
    endDate: {
      type: String
    },
    showLastMonth: {
      type: Boolean,
      default: true
    },
    showNextMonth: {
      type: Boolean,
      default: true
    },
    highlightWeekend: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      year: 0,
      month: 0,
      days: [],
      current: [],
      today: format(new Date(), 'YYYY-MM-DD'),
      currentMonth: Number,
      sep: '-',
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    }
  },
  created: function () {
    this.type = 'date'
    this.render()
  },
  watch: {
    value: function (val) {
      this.render(null, null, val)
    }
  },
  methods: {
    buildClass: function (index, child, isCurrent) {
      const className = {
        current: child.current || isCurrent,
        disabled: child.disabled,
        'is-today': child.isToday
      }
      className[`is-week-${index}`] = true
      return className
    },
    render: function (year, month) {
      let data = getDays({
        year: year,
        month: month,
        value: this.value,
        rangeBegin: this.startDate,
        rangeEnd: this.endDate
      })
      this.days = data.days
      this.year = data.year
      this.month = data.month
    },
    zero: function (n) {
      return n < 10 ? '0' + n : n
    },
    formatDate: function (year, month, child) {
      return year + '-' + this.zero(month + 1) + '-' + this.zero(child.day)
    },
    prev: function (e) {
      e.stopPropagation()
      var that = this
      if (that.month === 0) {
        that.month = 11
        that.year = that.year - 1
      } else {
        that.month = that.month - 1
      }
      that.render(that.year, that.month)
    },
    next: function (e) {
      e.stopPropagation()
      var that = this
      if (that.month === 11) {
        that.month = 0
        that.year = that.year + 1
      } else {
        that.month = that.month + 1
      }
      this.render(that.year, that.month)
    },
    go: function (year, month) {
      this.render(year, month)
    },
    select: function (k1, k2) {
      if (this.current.length > 0) {
        this.days[this.current[0]][this.current[1]].isCurrent = false
      }
      this.days[k1][k2].current = true
      this.current = [k1, k2]
      this.value = this.year + this.sep + this.zero(this.month + 1) + this.sep + this.zero(this.days[k1][k2].day)
      this.show = false
    },
    ok: function () {
      var that = this
      if (that.range) {
        that.value = that.output(that.rangeBegin) + ' ~ ' + that.output(that.rangeEnd)
      } else {
        that.value = that.output([that.year, that.month, that.day])
      }
      that.show = false
    },
    cancel: function () {
      this.show = false
    },
    // 格式化输出
    output: function (args) {
      var that = this
      if (that.type === 'date') {
        return args[0] + that.sep + that.zero(args[1] + 1) + that.sep + that.zero(args[2])
      }
    }
  }
}
</script>
 
<style>
.vux-prev-icon, .vux-next-icon {
  position: absolute;
  left: 0;
  top: 15px;
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1px solid #04be02;
  border-radius: 0;
  border-top: none;
  border-right: none;
  transform: rotate(45deg);
  margin-left: 15px;
  line-height: 40px;
}
.vux-next-icon {
  transform: rotate(-135deg);
  left: auto;
  top: 14px;
  right: 15px;
}
.vux-prev-icon:before {
  display: block;
  width: 12px;
  height: 12px;
  border: 1px solid #04be02;
  border-width: 1px 0 0 1px;
  transform: rotate(315deg)
}
.is-weekend-highlight td.is-week-list-0,
.is-weekend-highlight td.is-week-list-6,
.is-weekend-highlight td.is-week-0,
.is-weekend-highlight td.is-week-6 {
  color: #E59313;
}
.inline-calendar a {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.calendar-year, .calendar-month {
  position: relative;
}
.calendar-header {
  line-height: 40px;
  font-size: 1.2em;
  overflow: hidden;
}
.calendar-header > div {
  float: left;
  width: 50%;
  text-align: center;
  overflow: hidden;
}
.calendar-header a:first-of-type {
  /**float: left;**/
}
.calendar-header a:last-of-type {
  float: right;
  vertical-align: bottom;
}
.switch-btn, .calendar-title {
  display: inline-block;
  border-radius: 4px;
  line-height: 30px;
}
.switch-btn {
  width: 30px;
  margin: 5px;
  color: #39b5b8;
  font-family: "SimSun";
}
.calendar-title {
  padding: 0 6%;
  color: #333;
}
.switch-btn:active, .calendar-title:active, .calendar-header a.active {
  background-color: #39b5b8;
  color: #fff;
}
.calendar-week {
  overflow: hidden;
}
.calendar-week span {
  float: left;
  width: 14.28%;
  font-size: 1.6em;
  line-height: 34px;
  text-align: center;
}

.inline-calendar {
  width: 100%;
  background: #fff;
  border-radius: 2px;
  opacity:.95;
  transition: all .5s ease;
}

.inline-calendar td.is-today {
  color: #04be02;
}
 
.calendar-enter, .calendar-leave {
  opacity: 0;
  transform: translate3d(0,-10px, 0);
}

.calendar:before {
  position: absolute;
  left:30px;
  top: -10px;
  content: "";
  border:5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #DEDEDE;
}
.calendar:after {
  position: absolute;
  left:30px;
  top: -9px;
  content: "";
  border:5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #fff;
}

.calendar-tools{
  height:32px;
  font-size: 20px;
  line-height: 32px;
  color: #04be02;
}
.calendar-tools .float.left{
  float:left;
}
.calendar-tools .float.right{
  float:right;
}
.calendar-tools input{
  font-size: 20px;
  line-height: 32px;
  color: #04be02;
  width: 70px;
  text-align: center;
  border:none;
  background-color: transparent;
}
.calendar-tools>i{
  margin:0 16px;
  line-height: 32px;
  cursor: pointer;
  color:#707070;
}
.calendar-tools>i:hover{
  color:#5e7a88;
}
.inline-calendar table {
  clear: both;
  width: 100%;
  border-collapse: collapse;
  color: #444444;
}
.inline-calendar td {
  padding:5px 0;
  text-align: center;
  vertical-align: middle;
  font-size:16px;
}
.inline-calendar td.week{
  pointer-events:none !important;
  cursor: default !important;
}
.inline-calendar td.disabled {
  color: #c0c0c0;
  pointer-events:none !important;
  cursor: default !important;
}
.inline-calendar td > span {
  display: inline-block;
  width: 26px;
  height: 26px;
  line-height: 26px;
  border-radius: 50%;
  text-align: center;
}
.vux-calendar-range.inline-calendar td.current {
  background-color: #04be02;
}
.vux-calendar-range table {
  margin-bottom: 10px;
}
.inline-calendar td.current > span {
  background-color: #04be02;
  color: #fff;
}
.inline-calendar thead td {
  text-transform: uppercase;
}
.inline-calendar .timer{
  margin:10px 0;
  text-align: center;
}
.inline-calendar .timer input{
  border-radius: 2px;
  padding:5px;
  font-size: 14px;
  line-height: 18px;
  color: #5e7a88;
  width: 50px;
  text-align: center;
  border:1px solid #efefef;
}
.inline-calendar .timer input:focus{
  border:1px solid #5e7a88;
}
.calendar-button{
  text-align: center;
}

.calendar-button button{
  border:none;
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  min-width: 8em;
  vertical-align: baseline;
  background:#5e7a88;
  color:#fff;
  margin: 0 .25em 0 0;
  padding: .8em 2.5em;
  font-size: 1em;
  line-height: 1em;
  text-align: center;
  border-radius: .3em;
}
.calendar-button button.cancel{
  background:#efefef;
  color:#666;
}

.inline-calendar .lunar{
  font-size:11px;
  line-height: 150%;
  color:#aaa;
}
.inline-calendar td.current .lunar{
  color:#fff;
}
</style>