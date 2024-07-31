<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-04-16 14:48:07
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-07 17:42:30
 * @FilePath: \mytest\src\components\examplePage\ExamplePage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="example">
    <el-row>
      <el-col :span="7" v-for="(value, index) in exampleOpts" :key="value" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }" shadow="hover"
          @click.native="toExample(value.routePath)">
          <img :src="require('@/assets/image/' + value.imageUrl)" class="image" />
          <div style="padding: 14px;top:25px">
            <span>{{ value.name }}</span>
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
  name: "ExamplePage",
  data: function () {
    return {
      imageBaseUrl: '@/assets/image/',
      exampleOpts: [
        {
          routePath: '/planeExample',
          imageUrl: 'circleQuery.png',
          name: '平面场景示例',
          description: '包含基于mapboxgl的功能示例'
        },
        {
          routePath: '/sphereExample',
          imageUrl: 'specialEffects.png',
          name: '球面场景示例',
          description: '包含基于cesium的功能示例'
        }
      ],
    }
  },
  methods: {
    toExample(path) {
      if (window.location.pathname != path) {
        this.$router.push({ path })
      }
    }
  }
};
</script>

<style>
#example {
  position: absolute;
    /* width: 250px;
    height: 150px; */
    top: 30%;
    left: 20%;
    /* background-color: rgba(0, 0, 0, 0.5); */
}
.bottom {
    margin-top: 13px;
    line-height: 20px;
  }
.image {
  /* position: absolute; */
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.routerStyle {
  color: #000000;
  text-decoration: none;
}
</style>