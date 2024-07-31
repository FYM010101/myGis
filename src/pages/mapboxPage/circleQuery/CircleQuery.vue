<template>
  <el-container>
    <el-header style="padding: 5px; height: 35px;">
      <el-page-header style="padding:0px" @back="goBack" :content="pageName"> </el-page-header>
    </el-header>
    <el-main style="padding:0px">
      <div id="control">
        <button id="drawButton" style=" margin-right: 20px;" @click="drawCircle">开始画圈</button>
        <button id="clearButton"  @click="clearCircle">清除画圈</button>
      </div>
      <div id="map"></div>
    </el-main>
    <el-footer style="padding:0px;display:none"></el-footer>
  </el-container>
</template>

<script src="./circleQuery.js"></script>

<style src="./circleQuery.css"></style>
