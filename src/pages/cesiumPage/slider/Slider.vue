
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