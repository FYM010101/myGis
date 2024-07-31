<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-04-16 14:16:23
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-07 09:20:52
 * @FilePath: \mytest\src\pages\cesiumPage\slider\Slider.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-container>
    <el-header style="padding: 5px; height: 35px">
      <el-page-header style="padding: 0px" @back="goBack" :content="pageName">
      </el-page-header>
    </el-header>
    <el-main style="padding: 0px">
      <div id="control">
        <button id="openSlider" style="margin-right: 20px" @click="openSlider">
          打开卷帘分析
        </button>
        <button
          id="leftImage"
          style="margin-right: 20px"
          @click="closeSlider('left')"
        >
          保留左边影像
        </button>
        <button id="rightImage" @click="closeSlider('right')">
          保留右边影像
        </button>
      </div>
      <div id="cesiumContainer"></div>
    </el-main>
    <el-footer style="padding: 0px; display: none"></el-footer>
  </el-container>
</template>
<script src="./slider.js"></script>

<style src="./slider.css"></style>