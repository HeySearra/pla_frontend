<template>
    <div 
        class="range_slider" 
        v-loading="loading"
        element-loading-text="历史数据加载中"
        element-loading-spinner="el-icon-loading">
        <el-slider 
            class="_inner_slider" 
            :min="0" 
            :max="maxDate" 
            v-model="date" 
            :format-tooltip="tooltipFunction"
            :disabled="loading"
            @input="slider_change">
      </el-slider>
      <div class="start">
        <el-date-picker
            v-model="input_date"
            align="right"
            type="date"
            placeholder="日期"
            :clearable="false"
            :disabled="loading"
            @change="date_change">
        </el-date-picker>
      </div>
      <div class="clear_both"></div>
    </div>
</template>

<script>
import moment from 'moment';
import { slider_calculation } from '@/assets/global.js';

export default {
    name: 'PointSlider',

    mounted() {
        // this.init();
    },

    destroyed() {

    },

    props: {

    },

    data() {
        return {
            input_date: '',
            maxDate: 100,
            date: 0,
            format: function(){},
            value: function(){},
            tooltipFunction: function(){},
            loading: true
        }
    },

    watch: {

    },

    methods: {
        init(start, end){
            console.log('======')
            console.log(start, end);
            var ret = slider_calculation([moment(start), moment(end)]);
            this.maxDate = ret.max_value;
            this.format = ret.format;
            this.value = ret.value;
            this.tooltipFunction = function(value){return ret.format(value).msg};
            this.date = ret.max_value;
            let d = this.format(this.maxDate);
            this.input_date = moment(d.year+'-'+d.month+'-'+d.date).utc().format();
            this.loading = false;
        },

        slider_change() {
            let d = this.format(this.date);
            if(d) {
                this.input_date = moment(d.year+'-'+d.month+'-'+d.date).utc().format();
                this.emit_change();
            }
        },

        date_change() {
            let d = moment(this.input_date);
            if(d) {
                this.date = this.value(d);
                this.emit_change();
            }
        },

        emit_change() {
            this.$emit('change', moment(this.input_date));
        }
    }
}
</script>

<style scoped>
    * {
        --slider-width: 1200px;
        --date-selector-width: 118px;
    }

    .range_slider {
        padding-left: 15px;
        position: relative;
    }

    ._inner_slider {
        margin-right: 27px;
        width: calc(100% - var(--date-selector-width) - 96px);
        float: left;
    }

    .start, .end{
        margin: 0 10px;
        float: left;
    }

    .start .el-date-editor.el-input, .end .el-date-editor.el-input{
        width: var(--date-selector-width);
        padding: 0;
    }

    .start .el-date-editor.el-input>>>input, .end .el-date-editor.el-input>>>input{
        padding-right: 0px;
    }

    .range_slider>>>.el-slider__bar{
        display: none;
    }

    .range_slider>>>.el-loading-spinner i, .range_slider>>>.el-loading-spinner .el-loading-text {
        color: #999 !important;
    }
</style>



// WEBPACK FOOTER //
// src/components/point_slider.vue