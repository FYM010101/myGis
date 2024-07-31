<template>
  <el-container
    style="
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
    "
  >
    <el-header style="padding: 0px">
      <Header/>
    </el-header>

    <el-main style="padding: 0px">
      <Content/>  
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
import Header from '@/components/Header'
import Content from '@/components/Content'
export default {
  name: "App",
  components:{Header, Content},
};
</script>

<style>
body {
  margin: 0;
}
</style>
