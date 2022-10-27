<template>
	<div class="cah">
		<div>
			<el-row :gutter="10">
				<el-col :span="7" style="font-weight: bold; text-align: center">
					<el-image
						v-if="src"
						style="vertical-align: -7px; margin-right: 9px"
						:src="src"
						fit="scale-down"
					></el-image>
					<el-select 
						v-model="area" 
						filterable 
						placeholder="请选择"
						size="small"
						@change="change_area">
						<el-option-group
							v-for="(group, index) in options"
							:key="group.label"
							:label="group.label">
							<el-option
								v-for="item in group.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								<span style="float: left">{{ item.label }}</span>
      							<span v-if="index == 1" style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
							</el-option>
						</el-option-group>
					</el-select>
					<!-- 中国大陆<span style="width: 1em; display: inline-block;"></span>China Mainland -->
				</el-col>
				<el-col v-show="confirmed" :span="3">
					确诊<span class="number confirmed">{{confirmed}}</span>
				</el-col>
				<el-col v-show="cured" :span="3">
					治愈<span class="number cured">{{cured}}</span>
				</el-col>
				<el-col v-show="died" :span="3">
					死亡<span class="number died">{{died}}</span>
				</el-col>
				<el-col v-show="vaccinated" :span="5">
					疫苗接种剂次<span class="number vaccinated">{{vaccinated}}</span>
				</el-col>
			</el-row>
			<div 
				class="predict" 
				v-loading="predict_loading"
				element-loading-text="预测数据加载中"
        		element-loading-spinner="el-icon-loading">
				<span style="margin-right: 10px; font-weight: bold;" :style="predict?'color: var(--color-life)':'color: #aaa'">{{disabled?'无该地区预测':'开启数据预测'}}</span>
				<el-switch
					v-model="predict"
					active-color="#13ce66"
					:disabled="disabled"
					@change="change_pre">
				</el-switch>
			</div>
		</div>
	</div>
</template>

<script>
import { provinces_cn, provinces_en } from '@/assets/provinces.js';
import { nameMap } from '@/assets/world_registry.js';
import * as picMap from '@/assets/registry.json';

export default {
	name: "CrossAnalysisHeader",

	mounted() {
		this.apply_for_predict();
		this.init();
	},

	data() {
		return {
			area: '',
			options: [{
				label: '省份',
				options: []
			}, 
			{
				label: '国家',
				options: []
			}],
			src: '',
			picMap: {},
			nameMap: {},
			confirmed: '',
			cured: '',
			died: '',
			vaccinated: '',
			predict: false,
			predict_loading: true,
			disabled: false,
			data: []
		}
	},

	watch: {
		'$route': {
			handler() {
				this.init();
			}, 
			deep: true
		}
	},

	methods: {
		init() {
			this.options[0].options = [];
			for(let i=0; i<provinces_cn.length; i++) {
				this.options[0].options.push({value: provinces_en[i], label: provinces_cn[i]});
			}
			this.options[1].options = [];
			for(let k in nameMap) {
				this.options[1].options.push({value: k, label: nameMap[k]});
			}
			// this.options[1].options.sort(function (str1, str2) {
			// 	return str1.localeCompare(str2, 'zh');
			// });
			this.nameMap = nameMap;
			this.picMap = picMap.PINYIN_MAP;
			if(this.$route.query.area) {
				this.area = this.$route.query.area;
				if(nameMap[this.$route.query.area]) {
					try {
						this.src = require('@/assets/global-national-flag/'+this.picMap[this.nameMap[this.$route.query.area]].toLowerCase()+'.png');
					} catch(e) {
						this.src = '';
					}
				}
			}
			else {
				if(this.$route.query.type == 'province' || !this.$route.query.type) {
					this.change_area(provinces_en[0]);
				}
				else {
					this.change_area(this.options[1].options[0].value);
				}
			}
		},
		change_area(value) {
			if(this.nameMap[value]) {
				try {
					this.src = require('@/assets/global-national-flag/'+this.picMap[this.nameMap[value]].toLowerCase()+'.png');
				} catch(e) {
					this.src = '';
				}
				this.$router.push({name: 'cross_analysis', query: {
					type: 'country', 
					area: value
				}});
			}
			else {
				this.src = '';
				this.$router.push({name: 'cross_analysis', query: {
					type: 'province', 
					area: value
				}});
			}
			if(!this.predict_loading) {
				this.disabled = true;
				for(let i=0; i<this.data[0].countries.length; i++) {
					if(this.nameMap[this.area] == this.data[0].countries[i].name) {
						this.disabled = false;
						break;
					}
				}
			}
			this.confirmed = '';
			this.cured = '';
			this.died = '';
			this.vaccinated = '';
		},
		change(data) {
			if(data) {
				this.confirmed = data.total.confirmed?data.total.confirmed:'0';
				this.cured = data.total.cured?data.total.cured:'0';
				this.died = data.total.died?data.total.died:'0';
				this.vaccinated = data.total.vaccinated?data.total.vaccinated:'未知';
			}
			this.change_pre();
		},

		apply_for_predict() {
			this.predict_loading = true;
			this.ajax.get('/data/international_future_analyze', {}, this, {
				success(res) {
					this.data = res.data;
					this.disabled = true;
					for(let i=0; i<this.data[0].countries.length; i++) {
						if(this.nameMap[this.area] == this.data[0].countries[i].name) {
							this.disabled = false;
							break;
						}
					}
					this.predict_loading = false;
				}
			});
		},

		change_pre() {
			if(this.predict) {
				let j = 0;
				this.disabled = true;
				for(let i=0; i<this.data[0].countries.length; i++) {
					if(this.nameMap[this.area] == this.data[0].countries[i].name) {
						this.disabled = false;
						j = i;
						break;
					}
				}
				if(!this.disabled) {
					let l = [];
					for(let i=0; i<this.data.length; i++) {
						l.push({
							date: this.data[i].date,
							confirmed: this.data[i].countries[j].predict.confirmed,
							cured: this.data[i].countries[j].predict.cured,
							died: this.data[i].countries[j].predict.died
						});
					}
					this.$emit('change_pre', true, l);
				}
				else {
					this.$emit('change_pre', false);
				}
			}
			else {
				this.$emit('change_pre', false);
			}
		}
	}
}
</script>

<style scoped>
	.cah {
		height: var(--cross-analysis-header-height);
	}

	.cah > div {
		width: 1200px;
		padding: 7px 20px;
		margin: 0 auto;
	}

	.el-col {
		/*border: solid 1px #000;*/
		line-height: 36px;
	}

	.el-image {
		width: 51px;
		height: 36px;
		/* margin-top: 1px; */
	}

	.number {
		margin: 0 10px;
		padding: 0 6px;
		min-width: 2em;
    	text-align: center;
		/* border: solid 1px #000; */
		border-radius: 6px;
		color: #fff;
		display: inline-block;
	}

	.number.confirmed {
		background-color: var(--color-high-risk);
	}

	.number.cured {
		background-color: var(--color-safe);
	}

	.number.died {
		background-color: var(--color-died);
	}

	.number.vaccinated {
		background-color: var(--color-life);
	}

	.el-select {
		vertical-align: 5px;
	}

	.el-select>>>input {
		font-size: var(--font-size);
	}

	.predict {
		position: absolute;
		top: calc(var(--nav-height) + var(--cross-analysis-header-height) / 2);
		right: 30px;
	}

</style>



// WEBPACK FOOTER //
// src/components/cross-analysis-header.vue