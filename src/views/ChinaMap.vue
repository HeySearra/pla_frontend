<template>
  <v-container
      id="china-map-view"
      fluid
      tag="section"
      style="width: 95%;height: auto"
  >
    <v-row>
      <v-col cols="5">
        <!--        卡片-->
        <v-row style="width: 100%;">
          <el-card style="margin-bottom: 15px;width: 100%;">
            <div style="display: flex;flex-direction: row;text-align: center;" :data="shownProvince">
              <div style="margin: auto" v-if="!city">
                <div style="font-weight: bolder;font-size: 20px">累计确诊</div>
                <div style="font-weight: bolder;font-size: 32px;color:#0D47A1 ">{{totalConfirm}}</div>
                <div style="font-weight: bolder;font-size: 16px;color:#0D47A1 ">+{{todayConfirm}}</div>
              </div>
<!--              :data="shownProvince"-->
              <div style="margin: auto" v-else >
                <div style="font-weight: bolder;font-size: 20px">累计确诊</div>
                <div style="font-weight: bolder;font-size: 32px;color:#0D47A1 ">
                  {{cityInfoCard.confirmed}}
                </div>
                <div style="font-weight: bolder;font-size: 16px;color:#0D47A1 ">+{{cityInfoCard.todayConfirm}}</div>
              </div>

              <div style="margin: auto" v-if="!city">
                <div style="font-weight: bolder;font-size: 20px">累计治愈</div>
                <div style="font-weight: bolder;font-size: 32px;color:#C62828 ">{{heal}}</div>
                <div style="font-weight: bolder;font-size: 16px;color:#C62828 ">+{{todayHeal}}</div>
              </div>
              <div style="margin: auto" v-else>
                <div style="font-weight: bolder;font-size: 20px">累计治愈</div>
                <div style="font-weight: bolder;font-size: 32px;color:#C62828 ">{{cityInfoCard.recovered}}</div>
                <div style="font-weight: bolder;font-size: 16px;color:#C62828 ">+{{cityInfoCard.todayRecovered}}</div>
              </div>


              <div style="margin: auto" v-if="!city">
                <div style="font-weight: bolder;font-size: 20px">死亡人数</div>
                <div style="font-weight: bolder;font-size: 32px;color:#004D40 ">{{dead}}</div>
                <div style="font-weight: bolder;font-size: 16px;color:#004D40 ">+{{todayDead}}</div>
              </div>
<!--              item.row.deceased-->
              <div style="margin: auto" v-else>
                <div style="font-weight: bolder;font-size: 20px">死亡人数</div>
                <div style="font-weight: bolder;font-size: 32px;color:#004D40 ">{{cityInfoCard.deceased}}</div>
              </div>

            </div>
          </el-card>
        </v-row>
        <!--        按钮-->
        <v-row>
          <!--
          <v-btn
              class="mx-2"
              rounded
              dark
              color="cyan"
              @click="switchMap"
          >
            <v-icon dark>mdi-cached</v-icon>
            <span v-if="!showAll">查看累计确诊人数</span>
            <span v-else>查看现存确诊人数</span>
          </v-btn>
          -->
          <v-btn
              @click="returnWholeCountry" style="background-color: #1e88e5; color: white;border-radius: 28px" v-show="isCity">
            返回全国地图
          </v-btn>
          <v-btn
              class="mx-2"
              rounded
              dark
              color="#00796B"
              v-show="isCity"
              @click="BookCity(city)"
              v-if="bookedProvinces.indexOf(city) === -1"
          >
            <v-icon right X-large>
              mdi-checkbox-marked-circle
            </v-icon>
            <div style="margin-left: 10px;">订阅{{city}}</div>
          </v-btn>

          <v-btn
              class="mx-2"
              rounded
              dark
              color="#FFA000"
              v-show="isCity"
              @click="BookCity(city)"
              v-else
          >
            <v-icon right X-large>
              mdi-checkbox-marked-circle
            </v-icon>
            <div style="margin-left: 10px;">已订阅{{city}}</div>
          </v-btn>
        </v-row>
        <!--        地图-->
        <v-row>
          <div style="width: 90%">

            <div id="china-map" ref="chinaMap" style="width: 85%;height: 500px"></div>
            <!-- 引入 ECharts 文件 -->
          </div>
        </v-row>
      </v-col>
      <v-col cols="7">
        <!--        预警条-->
        <v-row>
          <v-card
              class="mx-auto"
              color="#FFECB3"
              dark
              v-for="item in warnings"
              :key="item.id"
              style="width: 100%"
          >

            <v-card-text class="text-h5 font-weight-bold" style="color: #BF360C">
              <v-icon
                  left
                  color="#BF360C"
              >
                mdi-alert
              </v-icon>
              {{ item.province + item.city + item.district+ item.address + '升为' + item.riskLevel + '地区！' }}
            </v-card-text>
          </v-card>
        </v-row>
        <!--        表格-->
        <v-row>
          <el-card style="margin-top: 15px ;width: 100%">
            <v-tabs v-model="value">
              <v-tab style="font-size: 20px">疫情数据</v-tab>
              <v-tab style="font-size: 20px">出行预警</v-tab>
              <v-tab style="font-size: 20px">疫情轨迹</v-tab>
              <v-tab style="font-size: 20px">当前位置</v-tab>
            </v-tabs>
            <el-table
                :data="shownProvince"
                style="width: 100%;"
                v-if="value===0"
                height="600px"
                ref="table"
            >

              <el-table-column
                  fixed
                  prop="provinceName"
                  label="省市区"
                  align="center"
              >
                <template slot="header" >
                  <span style="font-size: 18px;font-weight:bold;">省市区</span>
                </template>
                <template slot-scope="item">
                  <span style="font-size: 20px;font-weight:bold;">{{item.row.provinceName}}</span>
                </template>
              </el-table-column>

              <el-table-column
                  prop="confirmed"
                  v-if="isSelect"
                  align="center"
              >
                <template slot="header" >
                  <span style="font-size: 18px;font-weight:bold">是否订阅</span>
                </template>
                <template slot-scope="item">
                  <el-button
                      size="mini"
                      type="primary"
                      round
                      icon="el-icon-star-off"
                      @click="BookCity(item.row.provinceName)"
                      v-show ="item.row.provinceName !== city"
                      v-if="bookedProvinces1.indexOf(item.row.provinceName) === -1"
                  >
                    订阅
                  </el-button>

                  <el-button
                      size="mini"
                      v-else
                      type="warning"
                      round
                      icon="el-icon-check"
                      @click="BookCity(item.row.provinceName)"
                  >
                    已订阅
                  </el-button>

                </template>

              </el-table-column>

              <el-table-column
                  prop="confirmed"
                  label="累计确诊"
                  align="center">
                <template slot="header" >
                  <span style="font-size: 18px;font-weight:bold;">累计确诊</span>
                </template>
                <template slot-scope="item">
                  <span style="font-size: 20px;font-weight:bold;color:#1B5E20;">{{item.row.confirmed}}</span>
                </template>
              </el-table-column>

              <el-table-column
                  prop="deceased"
                  label="累计死亡"
                  align="center">
                <template slot="header" >
                  <span style="font-size: 18px;font-weight:bold;">累计死亡</span>
                </template>
                <template slot-scope="item">
                  <span style="font-size: 20px;font-weight:bold;color:#B71C1C">{{item.row.deceased}}</span>
                </template>
              </el-table-column>

              <el-table-column
                  prop="recovered"
                  label="累计治愈"
                  align="center">
                <template slot="header" >
                  <span style="font-size: 18px;font-weight:bold;">累计治愈</span>
                </template>
                <template slot-scope="item">
                  <span style="color:#35791b;font-weight:bold;font-size: 20px">{{item.row.recovered}}</span>
                </template>
              </el-table-column>

            </el-table>
            <div v-else-if="value === 1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-btn

                      class="ma-2"
                      outlined
                      color="indigo"
                      @click="changeWay"
                  >
                    <v-icon >mdi-cached</v-icon>
                    <span v-if="!way">查看飞机</span>
                    <span v-else>查看铁路</span>
                  </v-btn>
                  <v-btn v-if="way"
                         class="ma-2"
                         outlined
                         color="indigo"
                         @click="changeGoOrAr"
                  >
                    <span v-if="!goOrAr">风险地区出发</span>
                    <span v-else>风险地区到达</span>
                  </v-btn>
                  <el-switch
                      v-model="value1"
                      active-text="显示轨迹"
                      style="margin-left: 0px"
                  >
                  </el-switch>
                </v-col>
                <v-col cols="12" md="6">
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      label="出发地"
                      single-line
                      hide-details
                      v-model="searchBeginning"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      label="目的地"
                      single-line
                      hide-details
                      v-model="searchArrival"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2" v-if="!way">
                  <v-btn
                      depressed
                      color="primary"
                      @click="searchTrain"
                  >
                    搜索
                  </v-btn>
                </v-col>
                <v-col  cols="12" md="2" v-if="!way">
                  <v-btn depressed @click="changeFlag">
                    返回/清空
                  </v-btn>
                </v-col>
                <v-col cols="12" md="2" v-if="way">
                  <v-btn
                      depressed
                      color="primary"
                      @click="searchPlane"
                  >
                    搜索
                  </v-btn>
                </v-col>
                <v-col  cols="12" md="2" v-if="way">
                  <v-btn depressed @click="changeFlag2">
                    返回/清空
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <el-table
                    v-if="way && goOrAr"
                    :data="airGo"
                    style="width: 100%;font-size: 16px"
                    height="440"
                >
                  <el-table-column
                      sortable
                      prop="number"
                      label="航班号"
                      style="font-weight:bold"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">航班号</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.number}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                      sortable
                      prop="beginning"
                      label="起飞机场"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">起飞机场</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.beginning}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="arrival"
                      label="到达机场"
                      align="center"
                  >
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">到达机场</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.arrival}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="actualTime"
                      label="起飞时间"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">起飞时间</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.actualTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="status"
                      label="状态"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">状态</span>
                    </template>
                    <template slot-scope="item">
                      <v-chip
                          :color="getColor2(item.row.status)"
                          dark
                          style="font-weight: bold"
                      >
                        {{ item.row.status }}
                      </v-chip>
                      <!--                    <span style="color:#000000;font-size: 20px;">{{item.row.status}}</span>-->
                    </template>
                  </el-table-column>
                </el-table>

                <el-table
                    v-if="way && !goOrAr"
                    :data="airArrival"
                    style="width: 100%;font-size: 16px"
                    height="440"
                >
                  <el-table-column
                      sortable
                      prop="number"
                      label="航班号"
                      style="font-weight:bold"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">航班号</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.number}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                      sortable
                      prop="beginning"
                      label="起飞机场"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">起飞机场</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.beginning}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="arrival"
                      label="到达机场"
                      align="center"
                  >
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">到达机场</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.arrival}}</span>
                    </template>
                  </el-table-column>
                  <!--                <el-table-column-->
                  <!--                        sortable-->
                  <!--                        prop="terminal"-->
                  <!--                        label="起飞航站楼"-->
                  <!--                        style="font-weight:bold"-->
                  <!--                        width="150">-->
                  <!--                </el-table-column>-->
                  <!--                <el-table-column-->
                  <!--                        sortable-->
                  <!--                        prop="scheduledTime"-->
                  <!--                        label="预计起飞时间"-->
                  <!--                        width="150">-->
                  <!--                </el-table-column>-->
                  <el-table-column
                      sortable
                      prop="actualTime"
                      label="起飞时间"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">起飞时间</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.actualTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="status"
                      label="状态"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">状态</span>
                    </template>
                    <template slot-scope="item">
                      <!--                    <span style="color:#000000;font-size: 20px;">{{item.row.status}}</span>-->
                      <v-chip
                          :color="getColor2(item.row.status)"
                          dark
                          style="font-weight: bold"
                      >
                        {{ item.row.status }}
                      </v-chip>

                    </template>
                  </el-table-column>
                </el-table>

                <el-table
                    v-if="!way && flag"
                    :data="train"
                    style="width: 100%;font-size: 16px"
                    height="440px"
                >
                  <el-table-column
                      sortable
                      prop="number"
                      label="车次"
                      style="font-weight:bold"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">车次</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px">{{item.row.number}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column

                      sortable
                      prop="beginning"
                      label="出发地"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">出发地</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.beginning}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column

                      sortable
                      prop="arrival"
                      label="目的地"
                      align="center"
                  >
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">目的地</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.arrival}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="beginTime"
                      label="出发时间"
                      style="font-weight:bold"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">出发时间</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.beginTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="arriveTime"
                      label="到达时间"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">到达时间</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.arriveTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column

                      prop="distance"
                      label=""
                      width="0"
                      style="display: none">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;"></span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.distance}}</span>
                    </template>
                  </el-table-column>
                </el-table>

                <el-table
                    v-if="!way && !flag"
                    :data="train2"
                    style="width: 100%;font-size: 16px"
                    height="440px"
                >
                  <el-table-column
                      sortable
                      prop="number"
                      label="车次"
                      style="font-weight:bold"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">车次</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px">{{item.row.number}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                      sortable
                      prop="beginning"
                      label="出发地"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">出发地</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.beginning}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="arrival"
                      label="目的地"
                      align="center"
                  >
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">目的地</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;font-weight:bold;">{{item.row.arrival}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="beginTime"
                      label="出发时间"
                      align="center"
                      style="font-weight:bold">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">出发时间</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.beginTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      sortable
                      prop="arriveTime"
                      label="到达时间"
                      align="center">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;">到达时间</span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.arriveTime}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column

                      prop="distance"
                      label=""
                      width="0"
                      style="display: none">
                    <template slot="header" >
                      <span style="font-size: 18px;font-weight:bold;"></span>
                    </template>
                    <template slot-scope="item">
                      <span style="color:#000000;font-size: 20px;">{{item.row.distance}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </v-row>
            </div>
            <div v-else-if="value === 2" style="min-height: 560px;">
              <el-row :span="8"
                      style="margin-bottom: 10px;margin-top: 10px"
                      v-for="(item, index) in trajectory"
                      :key="index"
              >
                <el-card shadow="hover" style="letter-spacing: .5px;line-height: 25px">
                  {{item.trajectory}}
                </el-card>
              </el-row>
            </div>
            <div v-else-if="value === 3">
              <div v-if="canLocate">
                <v-row style="margin-top: 20px">
                  <strong>当前位置：</strong>{{location.address}}
                </v-row>
                <v-row>
                  <v-col cols="5"><span style="font-size:24px">{{location.province}}</span></v-col>
                </v-row>
                <v-row>
                  <!-- **************************  -->
                  <!-- 为啥不用provinceInfo的今日信息 -->
                  <!-- **************************  -->
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#fff8f8">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #e61c1d">+{{location.cityInfo.todayConfirm}}</span></div>
                      <div style="color: #e61c1d;font-size: 32px">{{location.provinceInfo.nowConfirm}}</div>
                      <div style="font-size: 20px">现存确诊</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#fef7ff">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #ae3ac6">+{{location.cityInfo.todayWzz}}</span></div>
                      <div style="color: #ae3ac6;font-size: 32px">{{location.provinceInfo.wzz}}</div>
                      <div style="font-size: 16px">本土无症状</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#fff4f4">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #be2121">+{{location.cityInfo.todayConfirm}}</span></div>
                      <div style="color: #be2121;font-size: 32px">{{location.provinceInfo.confirm}}</div>
                      <div style="font-size: 20px">累计确诊</div>
                    </v-card>
                  </v-col>
                  <!-- ***** -->
                  <!-- +0??? -->
                  <!-- ***** -->
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#f3f6f8">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #4e5a65">+0</span></div>
                      <div style="color: #4e5a65;font-size: 32px">{{location.provinceInfo.dead}}</div>
                      <div style="font-size: 20px">累计死亡</div>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="5"><span style="font-size:24px">{{location.city}}</span></v-col>
                </v-row>
                <v-row>
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#fff8f8">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #e61c1d">+{{location.cityInfo.todayConfirm}}</span></div>
                      <div style="color: #e61c1d;font-size: 32px">{{location.cityInfo.nowConfirm}}</div>
                      <div style="font-size: 20px">现存确诊</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#fef7ff">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #ae3ac6">+{{location.cityInfo.todayWzz}}</span></div>
                      <div style="color: #ae3ac6;font-size: 32px">{{location.cityInfo.wzz}}</div>
                      <div style="font-size: 16px">本土无症状</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#fff4f4">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #be2121">+{{location.cityInfo.todayConfirm}}</span></div>
                      <div style="color: #be2121;font-size: 32px">{{location.cityInfo.confirm}}</div>
                      <div style="font-size: 20px">累计确诊</div>
                    </v-card>
                  </v-col>
                  <v-col cols="3">
                    <v-card style="text-align: center;padding: 30px" color="#f3f6f8">
                      <div><span style="color:#7c7c7c">较上日</span><span style="color: #4e5a65">+0</span></div>
                      <div style="color: #4e5a65;font-size: 32px">{{location.cityInfo.dead}}</div>
                      <div style="font-size: 20px">累计死亡</div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <div v-else>
                <v-row>
                  <v-col cols="12" style="text-align: center">
                    <span class="text-h3">使用定位服务需要您的许可</span><br>
                    <v-btn
                        depressed
                        color="error"
                        style="margin-top: 30px"
                        @click="getLocateAuth"
                    >
                      我同意平台获取我的位置
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </el-card>
        </v-row>

        <v-row justify="end">
          <div  style="margin-top: 5px">
            <a style="text-align: right;display: block;text-decoration: none;color: #999"
               href="https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5" target="_blank">
              数据来源：腾讯疫情接口（点击查看）
            </a>
          </div>
        </v-row>

      </v-col>

    </v-row>
  </v-container>
</template>

<script>
// import qs from "qs";

require("echarts/extension/bmap/bmap");
import echarts from 'echarts'
import 'echarts/map/js/china'

const option = {
  geo: {
    name: ['累计确诊人数', '今日确诊人数', '死亡人数', '治愈人数'],
    // name: ['累计确诊人数', '现存确诊人数', '今日确诊人数', '死亡人数'],
    type: 'map',
    map: 'china',
    label: {
      show: true,
      color: '#333',
      fontSize: 12
    },
    //  能否缩放
    roam: false,
    //  初始缩放
    zoom: 1.2,
    data: [],
    itemStyle: {
      areaColor: '#eee',
      //
      borderColor: '#90A4AE'
    },
    emphasis: {
      label: {
        color: '#666',
        fontSize: 14
      },
      itemStyle: {
        areaColor: '#E8EAF6'
      }
    }
  },
  series: [{
    name: ['累计确诊人数', '今日确诊人数', '死亡人数', '治愈人数'],
    // name: ['累计确诊人数', '现存确诊人数', '今日确诊人数', '死亡人数'],
    type: 'map',
    map: 'china',
    label:{
      show: true,
      color: '#333',
      fontSize: 12,
      distance: 6
    },
    //  能否缩放
    roam: false,
    //  初始缩放
    zoom: 1.2,
    data: [],
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#90A4AE'
    },
    emphasis:{
      label: {
        color: '#666',
        fontSize: 14
      },
      itemStyle: {
        areaColor: '#E8EAF6'
      }
    }
  }],
  // 出现浮标
  tooltip:{
    trigger: 'item',
    show: true,
  },
  visualMap: [{
    type: 'piecewise',
    pieces: [
      {min: 1000,  color: '#3949AB'},
      {min: 100, max: 999, color: '#5C6BC0'},
      {min: 50, max: 99, color: '#7986CB'},
      {min: 10, max: 49, color: '#9FA8DA'},
      {min: 1, max: 9, color: '#C5CAE9'},
      {min: 0, max: 0, color: '#fff'},
    ],
    orient: 'horizontal', //控制条横向
    left: 'center'
  }],
}

export default {
  name: "ChinaMap",
  data() {
    return {
      canLocate: false,
      isCity: false,
      bookedProvinces: [],    // 订阅的省份名
      bookedProvinces1: [],   // 订阅的城市名
      value1:false,
      showTrain:[],
      airArrival:[],
      airGo:[],
      airArrival1:[],
      airGo1:[],
      showAir:[],
      showAir2:[],
      city: '',
      location: {
        province: '',
        city: '',
        district: '',
        address: '',
        provinceInfo: {
          confirm: '',
          todayConfirm: '',
          dead: '',
          nowConfirm: '',
          wzz: '',
          todayWzz: ''
        },
        cityInfo: {
          confirm: '',
          todayConfirm: '',
          dead: '',
          nowConfirm: '',
          wzz: '',
          todayWzz: ''
        }
      },
      heal: 0,
      todayHeal: 0,
      totalConfirm: 0,
      nowConfirm: 0,
      dead: 0,
      todayConfirm: 0,
      todayDead: 0,
      showAll: false,
      myChart: null,
      headers: [
        { text: '是否订阅', value: 'action', align: 'start', sortable: false},
        { text: '省份', value: 'provinceName'},
        { text: '城市', value: 'name' },
        { text: '累计确诊', value: 'confirmed' },
        { text: '累计死亡', value: 'deceased' },
        { text: '现存确诊', value: 'active' },
        { text: '累计治愈', value: 'recovered' },
        { text: '疫苗接种', value: 'vaccinated' },
        { text: '风险等级', value: 'grade' },
      ],
      select: { "name": "全部", "center": [122.014129, 37.550339], "zoom": 4.5 },
      items: require('@/assets/provinces.json'),
      data: [],
      db: [],
      warnings: [],
      value:'',
      way:true,
      train:[],
      train2:[],
      plane:[],
      trainHeads:[
        {
          text: '车次',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: '出发地', value: 'beginning' },
        { text: '目的地', value: 'arrival' },
        { text: '出发时间', value: 'beginTime' },
        { text: '到达时间', value: 'arriveTime' },
        { text: '总时长', value: 'totalTime' },
        { text: '距离', value: 'distance' },
      ],
      search:'',
      searchBeginning:'',
      searchArrival:'',
      flag:true,
      shownProvince:[],
      provinceData:[],
      tempData:[],
      trajectory: [],
      provinceHeader: [
        {
          text: '省份',
          align: 'start',
          sortable: false,
          value: 'provinceName',
        },
        { text: '累计确诊', value: 'confirmed' },
        { text: '累计死亡', value: 'deceased' },
        { text: '现存确诊', value: 'active' },
        // { text: '累计治愈', value: 'recovered' },
        // { text: '疫苗接种', value: 'vaccinated' },
      ],
      goOrAr:true,
    }
  },
  watch: {
    way(val) {
      if (val && this.value1 && this.goOrAr) {
        this.deleteTrain();
        this.deleteAir();
        this.airLine();
      }
      else if(val && this.value1 && !this.goOrAr){
        this.deleteTrain();
        this.deleteAir();
        this.airLineArr();
      }
      else if (!val && this.value1) {
        this.deleteAir();
        this.trainLine()
      }
    },
    value1(val){
      if(val){
        if(this.way && this.goOrAr){
          this.deleteTrain();
          this.deleteAir();
          this.airLine();
          // this.airLineArr()
        }
        else if(this.way && !this.goOrAr){
          this.deleteTrain();
          this.deleteAir();
          this.airLineArr()
        }
        else this.trainLine();
      }
      else{
        this.deleteTrain();
        this.deleteAir();
      }
    },
    goOrAr(val){
      if(val){
        if(this.way && this.value1){
          this.deleteTrain();
          this.deleteAir();
          this.airLine();
        }
      }
      else{
        if(this.way && this.value1){
          this.deleteTrain();
          this.deleteAir();
          this.airLineArr()
        }
        else if(!this.way && this.value1){
          this.deleteTrain();
          this.deleteAir();
          this.trainLine();
        }
      }
    },
    value(val){
      if(val!==1){
        this.value1 = 0;
        this.deleteTrain();
        this.deleteAir();
        if (val === 3 && this.canLocate) {
          this.showLocationInfo()
        }
      }
    }
  },
  methods: {
    returnWholeCountry() {
      option.series[0].map = 'china';
      option.geo.map = 'china';
      const data = option.series[0].data
      for (let i in data) {
        if (data[i].dataset !== undefined) {
          /*
          if (this.showAll) {
            data[i].value = data[i].dataset[0]
          } else {
            data[i].value = data[i].dataset[1]
          }
          */
          data[i].value = data[i].dataset[0]
        }
      }
      this.data = this.db
      this.shownProvince = this.provinceData
      this.mycharts.setOption(option)
      this.city = ''
      this.isSelect = false
      this.isCity = false
    },
    contains(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    },
    // 获取当前位置
    getLocation () {
      const self = this;
      /* eslint-disable no-undef */
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);
        AMap.event.addListener(geolocation, 'error', onError);

        function onComplete (data) {
          // data是具体的定位信息
          self.location.province = data.addressComponent.province;
          self.location.city = data.addressComponent.city;
          self.location.district = data.addressComponent.district;
          self.location.address = data.formattedAddress;
          self.$axios.get('http://42.194.158.76:8001/data/today/domestic_analyze').then(res => {
            res.data.data[0].provinces.forEach(province => {
              if (province.name === self.location.province.substr(0,2)) {
                self.location.provinceInfo.confirm = province.total.confirmed
                self.location.provinceInfo.dead = province.total.died
                // self.location.provinceInfo.nowConfirm = province.total.nowConfirm
                self.location.provinceInfo.todayConfirm = province.new.confirmed
                // self.location.provinceInfo.todayWzz = province.today.wzz_add === undefined ? 0 : province.today.wzz_add
                // self.location.provinceInfo.wzz = province.total.wzz
                if (province.name === '北京' || province.name === '天津' || province.name === '上海' || province.name === '重庆') {
                  self.location.city = self.location.district
                  province.children.forEach(city => {
                    if (city.name === self.location.city.substr(0,2)) {
                      self.location.cityInfo.confirm = city.total.confirm
                      self.location.cityInfo.dead = city.total.dead
                      self.location.cityInfo.nowConfirm = city.total.nowConfirm
                      self.location.cityInfo.todayConfirm = city.today.confirm
                      self.location.cityInfo.todayWzz = city.today.wzz_add === undefined ? 0 : city.today.wzz_add
                      self.location.cityInfo.wzz = city.total.wzz
                    }
                  })
                } else {
                  province.children.forEach(city => {
                    if (city.name === self.location.city.substr(0,2)) {
                      self.location.cityInfo.confirm = city.total.confirm
                      self.location.cityInfo.dead = city.total.dead
                      self.location.cityInfo.nowConfirm = city.total.nowConfirm
                      self.location.cityInfo.todayConfirm = city.today.confirm
                      self.location.cityInfo.todayWzz = city.today.wzz_add === undefined ? 0 : city.today.wzz_add
                      self.location.cityInfo.wzz = city.total.wzz
                    }
                  })
                }
              }
            })
          })
        }

        function onError () {
          // 定位出错
          // console.log('定位失败错误：', data);
          // 调用IP定位
          self.location.province = '北京市';
          self.location.city = '';
          self.location.district = '海淀区';
          self.location.address = '北京市海淀区北京航空航天大学';
        }
      })
    },
    getLocateAuth() {
      this.canLocate = true
      sessionStorage.setItem('canLocate', 'true')
      this.showLocationInfo()
    },
    showLocationInfo() {
      this.isCity = true
      const pyMap = require('@/assets/pyMap.json')
      this.showCity(this.location.province.substr(0, 2), pyMap[this.location.province])
      this.city = this.location.province.substr(0, 2)
      const shownProvince = []
      this.provinceData.forEach(pro => {
        if (pro.provinceName === this.location.province.substr(0, 2)) {
          shownProvince.push(pro)
          this.cityInfoCard = pro
        }
      })
      this.db.forEach(city => {
        if (city.provinceName === this.location.province.substr(0, 2)) {
          shownProvince.push(
              {
                provinceName: city.name,
                deceased: city.deceased,
                active: city.active,
                confirmed: city.confirmed,
                recovered: city.recovered,
                vaccinated: city.vaccinated,
                grade: city.grade,
                priority: city.priority
              }
          )
        }
      })
      this.shownProvince = shownProvince
    },
    getDataPy(){
      //TODO:date是现在是日期
      var jsondata = {};
      var qs = require('qs')
      this.$axios.get('/map/domestic',qs.stringify(jsondata)).then(res =>{
        let list = this.myMap(res.provinces, item => {
          const value = item.total.confirmed;
          //const value = this.showAll ? item.total.confirmed : item.total.nowConfirm
          return {
            name: item.name,
            value,
            dataset: [
              item.total.confirmed, item.new.confirmed, item.total.died, item.name, item.total.cured
            ]
          }
        })
        this.heal = res.country.total.cured;
        this.todayHeal = res.country.new.cured;
        this.totalConfirm = res.country.total.confirmed;
        this.todayConfirm = res.country.new.confirmed;
        this.dead = res.country.total.died;
        this.todayDead=res.country.new.died;
        // 展示浮标信息
        option.series[0].data = list
        option.tooltip.formatter = function (params) {
        if (params.data) {
          return params.name + '<br/>累计确诊人数：' + params.data.dataset[0] +
              '<br/>今日确诊人数：' + params.data.dataset[1] + '<br/>死亡人数：' + params.data.dataset[2] +
              '<br/>治愈人数：' + params.data.dataset[4]
          }
          return '暂无数据'
        }

        this.mycharts.setOption(option)




      })

    },
    getData() {
      // this.$axios.get('/data/province').then(res => {
      this.$axios.get('http://42.194.158.76:8001/data/today/domestic_analyze').then(res => {
        let list = this.myMap(res.data.data[0].provinces, item => {
          const value = item.total.confirmed
          return {
            name: item.name,
            value,
            dataset: [
              item.total.confirmed, item.new.confirmed, item.total.died, item.name, item.total.cured
            ]
          }
        })
        // 计算全国疫情数据
        res.data.data[0].provinces.forEach(province => {
          this.heal += province.total.cured;
          this.totalConfirm += province.total.confirmed;
          this.dead += province.total.died;
          this.todayConfirm += province.new.confirmed;
          this.todayDead += province.new.died;
        })

        // 展示浮标信息
        option.series[0].data = list
        option.tooltip.formatter = function (params) {
          if (params.data) {
            return params.name + '<br/>累计确诊人数：' + params.data.dataset[0] +
                '<br/>今日确诊人数：' + params.data.dataset[1] + '<br/>死亡人数：' + params.data.dataset[2] +
                '<br/>治愈人数：' + params.data.dataset[4]
          }
          return '暂无数据'
        }

        this.mycharts.setOption(option)

        const cityArr = [
          ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门', '台湾'],
          ['shanghai', 'hebei', 'shanxi', 'neimenggu', 'liaoning', 'jilin', 'heilongjiang', 'jiangsu', 'zhejiang', 'anhui', 'fujian', 'jiangxi', 'shandong', 'henan', 'hubei', 'hunan', 'guangdong', 'guangxi', 'hainan', 'sichuan', 'guizhou', 'yunnan', 'xizang', 'shanxi1', 'gansu', 'qinghai', 'ningxia', 'xinjiang', 'beijing', 'tianjin', 'chongqing', 'xianggang', 'aomen', 'taiwan']
        ];
        this.mycharts.on('click', param => {
          // 城市中文名
          const cityName = param.data.dataset[3];
          console.log(cityName)
          if(this.city.length === 0){
            this.city = cityName
            console.log(this.city)
            this.isCity = true
          }

          // 当在省份地图选中城市时，city对应省份名，cityName对应城市名
          else{
            this.city = this.contains(cityArr[0], cityName) ? cityName : this.city
            this.isCity = this.city !== cityName
          }

          // console.log(this.cxy_totalConfirm)
          this.$axios.get('/subscription/list').then(res => {
            if (res.data.status === 200) {

              for(let pros in res.data.data){
                // console.log(res.data.data[pros].province === res.data.data[pros].location)
                // console.log(res.data.data[pros].location)
                if(res.data.data[pros].book && res.data.data[pros].province === this.city && (res.data.data[pros].province !== res.data.data[pros].location)){
                  this.bookedProvinces1.push(res.data.data[pros].location)
                }
              }
              // console.log(this.bookedProvinces1)
            }
          })

          this.isSelect = false
          // 加载省份地图
          for (let i = 0, len = cityArr[0].length; i < len; i++) {
            if (cityName === cityArr[0][i]) {
              // 获取得城市拼音
              this.showCity(cityArr[0][i], cityArr[1][i]);
              const shownProvince = []
              this.provinceData.forEach(pro => {
                if (pro.provinceName === cityName) {
                  shownProvince.push(pro)
                }
              })
              this.db.forEach(city => {
                if (city.provinceName === cityArr[0][i]) {
                  shownProvince.push(
                      {
                        provinceName: city.name,
                        deceased: city.deceased,
                        confirmed: city.confirmed,
                        recovered: city.recovered,
                        todayConfirmed: city.todayConfirmed
                      }
                  )
                }
              })
              this.shownProvince = shownProvince
              for (let i in shownProvince){
                if(shownProvince[i].provinceName === this.city){
                  this.cityInfoCard = shownProvince[i]
                  console.log(this.cityInfoCard)
                }
              }
              return
            }
          }
          //没有找到对应城市的话，那么返回到全国地图
        });
      })
    },
    showCity(zhName, pyName) {
      // console.log(this.cityInfoCard)
      require('echarts/map/js/province/' + pyName)
      option.geo.map = zhName;
      option.series[0].map = zhName;
      // 深拷贝，另建option以免丢失原始option数据
      const nameAmend = require('@/assets/nameAmend.json')
      const cityOption = JSON.parse(JSON.stringify(option));
      const shownData = []
      this.data = []
      this.isSelect = true
      if (zhName === '北京' || zhName === '上海') {
        this.db.forEach(city => {
          if (city.provinceName === zhName) {
            let alias = nameAmend[zhName][city.name]
            if (alias === undefined)
              // alias = city.name + '区'
              alias = city.name
            // const value = this.showAll ? city.confirmed : city.active
            const value = city.confirmed
            shownData.push({
              name: city.name,
              value,
              dataset: [city.confirmed, city.todayConfirmed, city.deceased, city.name, city.recovered]
            })
          }
        })
      }
      else if (zhName === '天津' || zhName === '重庆') {
        this.db.forEach(city => {
          if (city.provinceName === zhName) {
            let alias = nameAmend[zhName][city.name]
            if (alias === undefined)
              alias = city.name
            // const value = this.showAll ? city.confirmed : city.active
            const value = city.confirmed
            shownData.push({
              name: alias,
              value,
              dataset: [city.confirmed, city.todayConfirmed, city.deceased, city.name, city.recovered]
            })
          }
        })
      }
      else {
        this.db.forEach(city => {
          if (city.provinceName === zhName) {
            let alias = nameAmend[zhName][city.name]
            if (alias === undefined)
              // alias = city.name + '市'
              alias = city.name
            // const value = this.showAll ? city.confirmed : city.active
            const value = city.confirmed
            shownData.push({
              name: alias,
              value,
              dataset: [city.confirmed, city.todayConfirmed, city.deceased, city.name, city.recovered]
            })
          }
        })
        this.$nextTick(()=>{
          this.$refs.table.doLayout()
          // table那里加一个ref="table"
        })
      }
      cityOption.series[0].data = shownData
      cityOption.geo = cityOption.series[0];
      this.mycharts.setOption(cityOption);
    },
    BookCity(name) {
      console.log(this.bookedProvinces)
      // name = JSON.stringify(name)
      var jsondata = {location: name};
      var qs = require('qs')
      // console.log(jsondata)
      this.$axios.post('http://10.251.254.107:8081/subscription/add', qs.stringify(jsondata), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
        if (res.data.message === "用户未登录") {
          this.$message({
            type: 'warning',
            message: '请先登录！'
          })
        } else if (res.data.message === "您已订阅该地区") {
          this.$message({
            type: 'warning',
            message: '您已订阅过该地区！'
          })
        } else if (res.data.message === "subscription success") {
          this.$message({
            type: 'success',
            message: '订阅成功！'
          })
          const cityArr = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门', '台湾'];
          if(this.contains(cityArr, name)){
            this.bookedProvinces.push(name)
          }
          else {
            this.bookedProvinces1.push(name)
          }
          this.$forceUpdate()
        }
      })
    },
    // 原来的数组
    myMap(arr, fn) {
      let newArr = []
      for (let i in arr) {
        newArr.push(
            // 可以拿到原来的数据的每一项
            // 可以拿到原来的数据的每一项
            fn(arr[i])
        )
      }
      return newArr
    },
    convertData1(data) {
      const geoCoordMap = require('@/assets/geo_coord_map.json')
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].confirmed)
          });
        }
      }
      return res;
    },
    convertData2(data) {

      const geoCoordMap = require('@/assets/geo_coord_map.json')
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].active)
          });
        }
      }
      return res;
    },

    selectProvince(item) {
      const option = {
        bmap: {
          center: item.center,
          zoom: item.zoom,
          roam: true,
          mapStyle: {
            styleJson: require('@/assets/custom_map_config.json')
          }
        }
      }
      this.myChart.setOption(option)
      this.data = []
      this.isSelect = true
      if (item.name === '全部') {
        this.db.forEach(city => {
          const copy = {
            provinceName: city.provinceName,
            deceased: city.deceased,
            active: city.active,
            confirmed: city.confirmed,
            name: city.name,
            recovered: city.recovered,
            vaccinated: city.vaccinated,
            grade: city.grade,
            priority: city.priority
          }
          this.data.push(copy)
        })
      } else if (item.name !== '境外输入') {
        this.db.forEach(city => {
          if (city.provinceName === item.name) {
            const copy = {
              provinceName: city.provinceName,
              deceased: city.deceased,
              active: city.active,
              confirmed: city.confirmed,
              name: city.name,
              recovered: city.recovered,
              vaccinated: city.vaccinated,
              grade: city.grade,
              priority: city.priority
            }
            this.data.push(copy)
          }
        })
      }
      this.$nextTick(()=>{
        this.$refs.table.doLayout()

        // table那里加一个ref="table"

      })
    },
    switchMap() {
      this.showAll = !this.showAll;
      const option = this.mycharts.getOption()
      const data = option.series[0].data
      for (let i in data) {
        if (data[i].dataset !== undefined) {
          if (this.showAll) {
            data[i].value = data[i].dataset[0]
          } else {
            data[i].value = data[i].dataset[1]
          }
        }
      }
      option.series.geo = option.series[0];
      this.mycharts.setOption(option)
    },
    getColor(risk) {
      if (risk === '高风险') {
        return '#e60000'
      } else {
        return '#ffc137'
      }
    },
    getColor2 (x) {
      if (x==="起飞") return 'green'
      else if (x==="延误")  return 'orange'
      else if (x==="取消")  return 'red'
      else if (x==="计划")  return 'blue'
      else return ''
    },
    changeWay() {
      this.way = !this.way;
      this.changeFlag();
      this.changeFlag2();
    },
    changeGoOrAr() {
      this.goOrAr = !this.goOrAr;
      this.changeFlag();
      this.changeFlag2();
      //alert(this.goOrAr)
    },
    getTrain() {
      const _this = this
      this.$axios.get('/data/railway').then(function (resp) {
        _this.train = resp.data.data;
        console.log(_this.train)
        // _this.trainLine();
      })
    },
    searchTrain() {
      var i = 0;
      var len = this.train.length
      var temp = [];
      var findOrNot = false;
      if (this.searchBeginning == '' && this.searchArrival != '') {
        for (i = 0; i < len; i++) {
          // if (this.searchArrival == this.train[i].arrival) {
          //   temp.push(this.train[i]);
          //   var xxxx=this.train[i].arrival.search(this.searchArrival)
          //   alert(xxxx)
          //   findOrNot = true
          // }
          if ((this.train[i].arrival.search(this.searchArrival))!=-1) {
            temp.push(this.train[i]);
            findOrNot = true
          }
        }
      } else if (this.searchBeginning != '' && this.searchArrival == '') {
        for (i = 0; i < len; i++) {
          // if (this.train[i].beginning == this.searchBeginning) {
          //   temp.push(this.train[i])
          //   findOrNot = true
          // }
          if ((this.train[i].beginning.search(this.searchBeginning))!=-1) {
            temp.push(this.train[i])
            //alert(this.searchBeginning)
            findOrNot = true
          }
        }
      } else if (this.searchBeginning != '' && this.searchArrival != '') {
        for (i = 0; i < len; i++) {
          // if (this.train[i].beginning == this.searchBeginning && this.searchArrival == this.train[i].arrival) {
          //   temp.push(this.train[i])
          //   findOrNot = true
          // }
          if ((this.train[i].beginning.search(this.searchBeginning))!=-1 && (this.train[i].arrival.search(this.searchArrival))!=-1) {
            temp.push(this.train[i])
            findOrNot = true
          }
        }
      }
      else if (this.searchBeginning == '' && this.searchArrival == '') {
        this.$message({
          type: 'warning',
          message: '请输入出发地或目的地！'
        })
        //alert('请输入出发地或目的地！')
        return
      }

      if (findOrNot == false) {
        this.$message({
          type: 'warning',
          message: '当前搜索地没有风险高铁/火车'
        })
        //alert("未找到符合要求的高铁/火车")
        return
      }
      this.train2 = temp;
      this.flag = false;
    },
    searchPlane() {
      var i = 0;
      if(this.goOrAr){
        var len = this.airGo.length
        var temp = [];
        var findOrNot = false;
        if (this.searchBeginning == '' && this.searchArrival != '') {
          for (i = 0; i < len; i++) {
            // if (this.searchArrival == this.airGo[i].arrival) {
            //   temp.push(this.airGo[i]);
            //   findOrNot = true
            // }
            if ((this.airGo[i].arrival.search(this.searchArrival))!=-1) {
              temp.push(this.airGo[i]);
              findOrNot = true
            }
          }
        } else if (this.searchBeginning != '' && this.searchArrival == '') {
          for (i = 0; i < len; i++) {
            // if (this.airGo[i].beginning == this.searchBeginning) {
            //   temp.push(this.airGo[i])
            //   findOrNot = true
            // }
            if ((this.airGo[i].beginning.search(this.searchBeginning))!=-1) {
              temp.push(this.airGo[i])
              findOrNot = true
            }
          }
        } else if (this.searchBeginning != '' && this.searchArrival != '') {
          for (i = 0; i < len; i++) {
            // if (this.airGo[i].beginning == this.searchBeginning && this.searchArrival == this.airGo[i].arrival) {
            //   temp.push(this.airGo[i])
            //   findOrNot = true
            // }
            if ((this.airGo[i].beginning.search(this.searchBeginning))!=-1 && (this.airGo[i].arrival.search(this.searchArrival))!=-1) {
              temp.push(this.airGo[i])
              findOrNot = true
            }
          }
        }
        else if (this.searchBeginning == '' && this.searchArrival == '') {
          this.$message({
            type: 'warning',
            message: '请输入出发地或目的地！'
          })
          //alert('请输入出发地或目的地！')
          return
        }

        if (findOrNot == false) {
          this.$message({
            type: 'warning',
            message: '当前搜索地没有风险航班'
          })
          //alert("未找到符合要求的高铁/火车")
          return
        }
        this.airGo=temp;
      }
      else{
        var len2 = this.airArrival.length
        var temp2 = [];
        var findOrNot2 = false;
        if (this.searchBeginning == '' && this.searchArrival != '') {
          for (i = 0; i < len2; i++) {
            // if (this.searchArrival == this.airArrival[i].arrival) {
            //   temp2.push(this.airArrival[i]);
            //   findOrNot2 = true
            // }
            if ((this.airArrival[i].arrival.search(this.searchArrival))!=-1) {
              temp2.push(this.airArrival[i]);
              findOrNot2 = true
            }
          }
        } else if (this.searchBeginning != '' && this.searchArrival == '') {
          for (i = 0; i < len2; i++) {
            // if (this.airArrival[i].beginning == this.searchBeginning) {
            //   temp2.push(this.airArrival[i])
            //   findOrNot2 = true
            // }
            if ((this.airArrival[i].beginning.search(this.searchBeginning))!=-1) {
              temp2.push(this.airArrival[i])
              findOrNot2 = true
            }
          }
        } else if (this.searchBeginning != '' && this.searchArrival != '') {
          for (i = 0; i < len2; i++) {
            // if (this.airArrival[i].beginning == this.searchBeginning && this.searchArrival == this.airArrival[i].arrival) {
            //   temp2.push(this.airArrival[i])
            //   findOrNot2 = true
            // }
            if ((this.airArrival[i].beginning.search(this.searchBeginning))!=-1 && (this.airArrival[i].arrival.search(this.searchArrival))!=-1) {
              temp2.push(this.airArrival[i])
              findOrNot2 = true
            }
          }
        }
        else if (this.searchBeginning == '' && this.searchArrival == '') {
          this.$message({
            type: 'warning',
            message: '请输入出发地或目的地！'
          })
          //alert('请输入出发地或目的地！')
          return
        }

        if (findOrNot2 == false) {
          this.$message({
            type: 'warning',
            message: '当前搜索地没有风险航班'
          })
          //alert("未找到符合要求的高铁/火车")
          return
        }
        this.airArrival=temp2;
      }
    },
    changeFlag() {
      this.flag = true
      this.searchBeginning = ''
      this.searchArrival = ''
      this.search = ''
      this.getAir()
    },
    changeFlag2(){
      this.getAir()
      this.searchBeginning = ''
      this.searchArrival = ''
      this.search = ''
      this.flag = true
    },
    // 构造全国省份数据，并构造初始页面的全国省份疫情信息表
    getProvinceTotal() {
      const _this = this;
      _this.creatTable();
    },
    creatTable() {
      // console.log(this.tempData[0].name)
      // eslint-disable-next-line no-unused-vars
      var provinceName = '';
      // eslint-disable-next-line no-unused-vars
      var confirmed = '';
      // eslint-disable-next-line no-unused-vars
      var active = '';
      // eslint-disable-next-line no-unused-vars
      var deceased = '';
      // eslint-disable-next-line no-unused-vars
      var recovered = '';
      // eslint-disable-next-line no-unused-vars
      var vaccinated = '未公布'
      var temp = [];

      this.$axios.get('http://42.194.158.76:8001/data/today/domestic_analyze').then(res => {
        if (res.data.status === 0) {
          res.data.data[0].provinces.forEach(province => {
            let item = {
              provinceName: province.name,
              confirmed: province.total.confirmed,
              deceased: province.total.died,
              recovered: province.total.cured,
              todayConfirm: province.new.confirmed,
              todayRecovered: province.new.cured
            }
            temp.push(item)
          })
          this.provinceData = temp;
          this.shownProvince = this.provinceData
          console.log(this.shownProvince)
        }
      })
    },
    //画火车
    trainLine() {
      const _this = this;
      const geoCoordMap = require('@/assets/geo_coord_map.json')

      for (var i = 0; i < _this.train.length; i++) {
        var addTrain = {
          fromName: '',
          toName: '',
          coords: [],
        }
        addTrain['fromName'] = _this.train[i].beginning;
        var geoCoord1 = geoCoordMap[addTrain.fromName];
        addTrain['toName'] = _this.train[i].arrival;
        var geoCoord2 = geoCoordMap[addTrain.toName];
        if (geoCoord2 && geoCoord1) {
          addTrain['coords'] = [geoCoord1, geoCoord2];
          _this.showTrain.push(addTrain);
        }
      }

      _this.addTraintoMap();

    },
    addTraintoMap() {
      const option = this.mycharts.getOption()
      option.series.push({
            type: 'lines',//用于带有起点和终点信息的线数据的绘制，主要用于地图上的航线，路线的可视化。
            zlevel: 1,
            coordinateSystem: 'geo', // 选用坐标系
            // effect: {//线特效的配置
            //   show: true,
            //   period: 6,//特效动画的时间
            //   trailLength: 0.7,//特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
            //   color: '#fff',
            //   symbolSize: 3,//特效标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示高和宽，例如 [20, 10] 表示标记宽为20，高为10。
            // },
            lineStyle: {
              normal: {
                color: 'color:#F65164',
                width: 0,
                curveness: 0.2,//边的曲度，支持从 0 到 1 的值，值越大曲度越大
              }
            },
            data: this.showTrain,
          },
          {
            type: 'lines',
            zlevel: 2,
            coordinateSystem: 'geo', // 选用坐标系
            symbol: ['none', 'arrow'],//线两端的标记类型，可以是一个数组分别指定两端
            symbolSize: 7,
            // effect: {
            //   show: true,
            //   period: 6,
            //   trailLength: 0,
            //   // symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
            //   // symbolSize: 15
            // },
            lineStyle: {
              color: '#d09600',
              width: 1,//0.2
              opacity: 0.6,
              curveness: 0.2,
            },
            data: this.showTrain,
          },
      )
      this.mycharts.setOption(option);
    },
    getAir() {
      const _this = this
      var temp=[];
      var i=0;
      var len;
      var change;
      var temp2=[];
      var i2=0;
      var len2;
      var change2;
      this.$axios.get('/data/arrivalFlightsChina').then(function (resp) {
        temp=resp.data.data;
        len=temp.length
        for(i=0;i<len;i++){
          if(temp[i].status=='取消'){
            change=temp[i]
            temp.splice(i,1)
            temp.unshift(change)
          }
        }
        //_this.airArrival = resp.data.data;
        _this.airArrival =temp
        _this.airArrival1=_this.airArrival
        //console.log(_this.airArrival)

      })
      this.$axios.get('/data/beginningFlightsChina').then(function (resp) {
        temp2=resp.data.data;
        len2=temp2.length
        for(i2=0;i2<len2;i2++){
          if(temp2[i2].status=='取消'){
            change2=temp2[i2]
            temp2.splice(i2,1)
            temp2.unshift(change2)
          }
        }
        _this.airGo =temp2
        // _this.airGo = resp.data.data;
        _this.airGo1=_this.airGo
        // _this.airLine();
        //console.log(_this.airGo)

      })

    },
    //画飞机
    airLine() {
      const _this = this;
      const geoCoordMap = require('@/assets/geo_coord_map.json')
      for (var i = 0; i < _this.airGo1.length; i++) {
        let addAir = {
          fromName: '',
          toName: '',
          coords: [],
        }
        addAir['fromName'] = _this.airGo1[i].beginning;
        var geoCoord1 = geoCoordMap[addAir.fromName];
        addAir['toName'] = _this.airGo1[i].arrival;
        var geoCoord2 = geoCoordMap[addAir.toName];
        if (geoCoord2 && geoCoord1) {
          addAir['coords'] = [geoCoord1, geoCoord2];
          _this.showAir.push(addAir);
        }
      }
      // for (let i = 0; i < _this.airArrival.length; i++) {
      //   let addAir = {
      //     fromName: '',
      //     toName: '',
      //     coords: [],
      //   }
      //   addAir['fromName'] = _this.airArrival[i].beginning;
      //   let geoCoord1 = geoCoordMap[addAir.fromName];
      //   addAir['toName'] = _this.airArrival[i].arrival;
      //   let geoCoord2 = geoCoordMap[addAir.toName];
      //   if (geoCoord2 && geoCoord1) {
      //     addAir['coords'] = [geoCoord1, geoCoord2];
      //     _this.showAir.push(addAir);
      //   }
      // }
      _this.addAirtoMap();
      // _this.mycharts.setOption(option);
    },
    airLineArr() {
      const _this = this;
      const geoCoordMap = require('@/assets/geo_coord_map.json')
      for (let i = 0; i < _this.airArrival1.length; i++) {
        let addAir = {
          fromName: '',
          toName: '',
          coords: [],
        }
        addAir['fromName'] = _this.airArrival1[i].beginning;
        let geoCoord1 = geoCoordMap[addAir.fromName];
        addAir['toName'] = _this.airArrival1[i].arrival;
        let geoCoord2 = geoCoordMap[addAir.toName];
        if (geoCoord2 && geoCoord1) {
          addAir['coords'] = [geoCoord1, geoCoord2];
          _this.showAir2.push(addAir);
        }
      }
      _this.addAirtoMap2();
    },
    addAirtoMap() {
      const option = this.mycharts.getOption()
      option.series.push({
            type: 'lines',//用于带有起点和终点信息的线数据的绘制，主要用于地图上的航线，路线的可视化。
            zlevel: 1,
            coordinateSystem: 'geo', // 选用坐标系
            // effect: {//线特效的配置
            //   show: true,
            //   period: 6,//特效动画的时间
            //   trailLength: 0.7,//特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
            //   color: '#fff',
            //   symbolSize: 3,//特效标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示高和宽，例如 [20, 10] 表示标记宽为20，高为10。
            // },
            lineStyle: {
              normal: {
                color: 'color:#F65164',
                width: 0,
                curveness: 0.2,//边的曲度，支持从 0 到 1 的值，值越大曲度越大
              }
            },
            data: this.showAir,
          },
          {
            type: 'lines',
            zlevel: 2,
            coordinateSystem: 'geo', // 选用坐标系
            symbol: ['none', 'arrow'],//线两端的标记类型，可以是一个数组分别指定两端
            symbolSize: 7,
            // effect: {
            //   show: true,
            //   period: 6,
            //   trailLength: 0,
            //   // symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
            //   // symbolSize: 15
            // },
            lineStyle: {
              color: 'red',
              width: 1,//0.2
              opacity: 0.6,
              curveness: 0.2,
            },
            data: this.showAir,
          },
          // {
          //   type: 'effectScatter',//带有涟漪特效动画的散点（气泡）图。利用动画特效可以将某些想要突出的数据进行视觉突出。
          //   coordinateSystem: 'geo',//该系列使用的坐标系
          //   zlevel: 2,
          //   rippleEffect: {//涟漪特效相关配置
          //     brushType: 'stroke'
          //   },
          //   label: {//图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
          //     show: true,
          //     position: 'right',
          //     formatter: '{b}'
          //   },
          //   // symbolSize: function (val) {//标记的大小
          //   //   return val[2] / 8;
          //   // },
          //   itemStyle: {
          //     color:  '#46bee9'
          //   },
          //   data: this.showAir.map(obj => {
          //     return obj.arrival
          //   }),
          // }
      )
      this.mycharts.clear()
      this.mycharts.setOption(option);
    },
    addAirtoMap2() {
      const option = this.mycharts.getOption()
      option.series.push({
            type: 'lines',//用于带有起点和终点信息的线数据的绘制，主要用于地图上的航线，路线的可视化。
            zlevel: 1,
            coordinateSystem: 'geo',
            lineStyle: {
              normal: {
                color: 'color:#F65164',
                width: 0,
                curveness: 0.2,//边的曲度，支持从 0 到 1 的值，值越大曲度越大
              }
            },
            data: this.showAir2,
          },
          {
            type: 'lines',
            zlevel: 2,
            coordinateSystem: 'geo', // 选用坐标系
            symbol: ['none', 'arrow'],//线两端的标记类型，可以是一个数组分别指定两端
            symbolSize: 7,
            lineStyle: {
              color: 'red',
              width: 1,//0.2
              opacity: 0.6,
              curveness: 0.2,
            },
            data: this.showAir2,
          },
      )
      this.mycharts.clear()
      this.mycharts.setOption(option);
    },
    deleteAir() {
      const option = this.mycharts.getOption()
      // for(var i =1 ;i<option.series.length;i++){
      //   option.series.data=[];
      // }
      while (option.series.length > 1) {
        option.series.pop();
        this.$forceUpdate();
      }
      this.mycharts.clear();

      this.mycharts.setOption(option, true);
      // console.log(option)
    },
    deleteTrain() {
      const option = this.mycharts.getOption()
      // for(var i =1 ;i<option.series.length;i++){
      //   option.series.data=[];
      // }
      while (option.series.length > 1) {
        option.series.pop();
        this.$forceUpdate();
      }
      this.mycharts.clear();

      this.mycharts.setOption(option, true);
      // console.log(option)
    }

  },
  created() {
    this.$vuetify.theme.dark = false
    this.getTrain()
    this.getAir()
    this.getProvinceTotal()
    if (sessionStorage.canLocate) {
      this.canLocate = true
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.chinaMap)
    // map初始化
    this.getData()
    this.getTrain()
    this.getAir()
    this.mycharts.setOption(option)

    // this.$axios.get('/data/province').then(res => {
    /*
    this.$axios.get('http://42.194.158.76:8001/data/today/domestic_analyze').then(res => {
      // 生成db数据
      res.data.data[0].provinces.forEach(province => {
        const provinceName = province.name
        province.children.forEach(city => {
          if (city.name !== '境外输入' && city.name !== '地区待确认' &&
              city.name !== '境外来沪' && city.name !== '外地来沪' && city.name !== '外地来京') {
            const cityInfo = {
              todayConfirmed: city.today.confirm,
              provinceName,
              deceased: city.total.dead,
              active: city.total.nowConfirm,
              confirmed: city.total.confirm,
              name: city.name,
              recovered: city.total.heal,
              vaccinated: '未公布'
            }
            if (city.total.grade === undefined) {
              cityInfo.grade = '全部低风险'
              cityInfo.priority = 2
            } else if (city.total.grade.indexOf('中风险') !== -1) {
              cityInfo.grade = city.total.grade
              cityInfo.priority = 1
            } else if (city.total.grade.indexOf('低风险') !== -1) {
              cityInfo.grade = city.total.grade
              cityInfo.priority = 2
            } else if (city.total.grade.indexOf('高风险') !== -1) {
              cityInfo.grade = city.total.grade
              cityInfo.priority = 0
            } else {
              cityInfo.grade = '全部低风险'
              cityInfo.priority = 2
            }
            if (cityInfo.name === '吉林') {
              cityInfo.name = cityInfo.name + '市'
            }
            this.db.push(cityInfo)
          }
        })
      })
      // 对city信息按风险升序排列
      this.db.sort((a, b) => {
        const val1 = a.priority
        const val2 = b.priority
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      })
      // 创建data数据
      this.data = []
      this.db.forEach(city => {
        const copy = {
          provinceName: city.provinceName,
          deceased: city.deceased,
          active: city.active,
          confirmed: city.confirmed,
          name: city.name,
          recovered: city.recovered,
          vaccinated: city.vaccinated,
          grade: city.grade,
          priority: city.priority,
          todayConfirmed: city.todayConfirmed
        }
        this.data.push(copy)
      })
    })
     */
    // 构建db、data数据
    const cityArr = ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆', '香港', '澳门', '台湾'];
    for (let i = 0, len = cityArr.length; i < len; i++) {
      const provinceName = cityArr[i];
      this.$axios.get('http://42.194.158.76:8001/map/today/province?name=' + provinceName).then(res => {
        res.data.cities.forEach(city => {
          const cityInfo = {
            todayConfirmed: city.new.confirmed,
            provinceName: provinceName,
            deceased: city.total.died,
            confirmed: city.total.confirmed,
            name: city.name,
            recovered: city.total.cured
          }
          this.db.push(cityInfo)
        })
      })
    }
    this.data = []
    this.db.forEach(city => {
      const copy = {
        provinceName: city.provinceName,
        deceased: city.deceased,
        confirmed: city.confirmed,
        name: city.name,
        recovered: city.recovered,
        todayConfirmed: city.todayConfirmed
      }
      this.data.push(copy)
    })
    // 风险信息
    // 可以和html部分的预警条一起删了
    this.$axios.get('/data/riskArea').then(res => {
      this.warnings = res.data.data
    })
    // 本土患者轨迹
    // 可能得和html部分的疫情轨迹模块一起删除
    this.$axios.get('/data/trajectory').then(res => {
      if (res.data.status === 200) {
        this.trajectory = res.data.data
      } else {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      }
    })
    // 订阅的省份
    this.$axios.get('/subscription/province').then(res => {
      if (res.data.status === 200) {
        for(let pros in res.data.data){
          if(res.data.data[pros].book)
            this.bookedProvinces.push(res.data.data[pros].province)
        }
      }
      else if(res.data.status === 403){
        this.$message({
          type: 'warning',
          message: '请先登录！'
        })
        this.isCity = false
      }
    })
    console.log(this.isCity)
    this.getLocation()
  },
  beforeDestroy() {
    option.geo.map = 'china';
    option.series[0].map = 'china';
    this.myChart.setOption(option)
  }
}
</script>

<style scoped>
#china-map {
  padding: 0;
  margin: 0;
  height: 90vh;
  width: 100%;
}
.el-message--info{
  background-color: #0288D1;
  border: #0288D1;
}
.el-message--warning{
  background-color: #FFB300;
  border: #FFB300;
}
.el-message--error{
  background-color: #F44336;
  border: #F44336;
}
.el-message--success{
  background-color: #4CAF50;
  border: #4CAF50;
}
.el-message ,.el-message--info .el-message__content{
  color: white;
}
.el-message ,.el-message--error .el-message__content{
  color: white;
}
.el-message ,.el-message--warning .el-message__content{
  color: white;
}
.el-message ,.el-message--success .el-message__content{
  color: white;
}
.el-message .el-icon-info {
  color: white;
}
.el-message .el-icon-success {
  color: white;
}
.el-message .el-icon-warning {
  color: white;
}
.el-message .el-icon-error {
  color: white;
}



.el-message__closeBtn.el-icon-close{
  color: white;
}
-webkit-scrollbar {/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(21, 101, 192,0.5);
}
-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10px;
  background: #EDEDED;
}
.v-application .mt-4 {
  margin-top: 0px !important;
}
.v-application .text-start {
  text-align: center !important;
}
</style>
