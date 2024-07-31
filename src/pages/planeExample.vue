<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-04-16 14:48:07
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-11 16:56:08
 * @FilePath: \mytest\src\components\examplePage\ExamplePage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="planExample" style="padding: 20px;">
        <el-row
          :span="5"
          v-for="(exampleOpt, index) in exampleOpts"
          :key="index"
          :offset="index > 0 ? 1 : 0"
        >
          <el-col
            :span="5"
            v-for="(value, key, index) in exampleOpt"
            :key="key"
            :offset="index > 0 ? 1 : 0"
          >
            <el-card
              :body-style="{ padding: '0px'}" 
              shadow="hover" @click.native="toExample(value.routePath)"
            >
              <img
                :src="require('@/assets/image/' + value.imageUrl)"
                class="image"
              />
              <div style="padding: 14px;top:25px">
                <span>{{ key }}</span>
                <div class="bottom clearfix">
                  <div class="description">{{ value.description }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </div>
  </template>
  
  <script>
  export default {
      name: "planeExample",
      data: function () {
        return {
          // homeImgurl: imgurl,
          imageBaseUrl: '@/assets/image/',
          exampleOpts: [
            {
              '画圈查询': {
                routePath: '/circleQuery',
                imageUrl: 'circleQuery.png',
                name: 'circleQuery',
                description:'使用mapbox框架实现可编辑画圈查询'
              },
              '特效图层': {
                routePath: '/specialEffects',
                imageUrl: 'specialEffects.png',
                name: 'specialEffects',
                description:'mapbox自定义图层'
              },
              '点位移动动画': {
                routePath: '/pointMove',
                imageUrl: 'pointMove.png',
                name: 'pointMove',
                description:'点位沿轨迹移动'
              }
            },
          ],
        }
      },
      methods: {
        toExample(path){
          if(window.location.pathname != path) {
            this.$router.push({path})
          }
        }
      }
    };
  </script>
  
  <style>
  
  .el-row {
      margin-bottom: 25px;
      /* &:last-child {
        margin-bottom: 0;
      } */
  }
  
  .routerStyle {
      color: #000000;
      text-decoration: none;
  }
  
  .description {
      position: relative;
      top: 10px;
      font-size: 16px;
      color: #999;
  }
  
  </style>