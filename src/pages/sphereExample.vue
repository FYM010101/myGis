<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-04-16 14:48:07
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-07 16:45:52
 * @FilePath: \mytest\src\components\examplePage\ExamplePage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="sphereExample" style="padding: 20px;">
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
      name: "sphereExample",
      data: function () {
        return {
          // homeImgurl: imgurl,
          imageBaseUrl: '@/assets/image/',
          exampleOpts: [
            {
              "卷帘分析": {
                routePath: '/slider',
                imageUrl: 'mapCompare.png',
                name: 'mapCompare',
                description:'cesium的slider实现卫星影像的卷帘分析'
              },
              '车辆轨迹动画(cesium)': {
                routePath: '/slider',
                imageUrl: 'carSimulator.png',
                name: 'carSimulator',
                description:'cesium实现车辆模型在3dtiles模型上的贴地行驶动画'
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