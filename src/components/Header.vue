<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="1" @click.native="toMenuItem('/')">
            首页
        </el-menu-item>
        <el-menu-item index="2" @click.native="toMenuItem('/examplePage')">
            功能示例
        </el-menu-item>
        <el-menu-item index="3" @click.native="toMenuItem('/examplePage')">
            笔记
        </el-menu-item>
        <el-menu-item index="4" @click.native="toMenuItem('/examplePage')">
            项目管理
        </el-menu-item>
    </el-menu>
</template>
<script type="text/javascript">
export default {
    name: "Header",
    data() {
        return {
            activeIndex: "1",
        };
    },
    methods: {
        toMenuItem(path) {
            if (window.location.pathname != path) {
                this.$router.push({ path });
            }
        },
    },
    mounted() { },
};
</script>

<style>
body {
    margin: 0;
}
</style>