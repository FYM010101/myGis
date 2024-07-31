<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2023-10-18 15:37:20
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-07 14:27:58
 * @FilePath: \mytest\src\components\home\HomePage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <!-- <el-carousel :interval="4000" type="card" height="300px"> -->
    <el-carousel height="350px" indicator-position="outside" style="top:200px">
    <el-carousel-item v-for="item in 6" :key="item">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "HomePage",
  data: function () {
    return {
      
    }

  },
  methods: {

  }
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>