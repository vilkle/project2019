<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-header class="header" height="80px">
        <el-steps 
          class="header-steps"
          :active="active" 
          :space="400" 
          finish-status="success"
          align-center>
          <el-step
            :description="item.text" 
            v-for="(item, index) in steps" 
            :key="index"></el-step>
        </el-steps>
      </el-header>
      <keep-alive>
        <router-view @step="handleStep" :fdata.sync="formData"/>
      </keep-alive>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      steps: [
        {id: 1, text: '录入题目信息'},
        {id: 2, text: '检测题目'}
      ],
      active: 1,
      formData: {}
    }
  },
  methods: {
    handleStep(val) {
      this.active = val;
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('local_form_data');
  }
}
</script>


<style lang="less">
html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  .el-step__description {
    margin-top: 0;
  }
}
@import url('./styles/base.less');
</style>
