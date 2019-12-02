<template>
  <div class="main-container">
    <el-main>
      <div class="main-title">找出{{this.type[this.fdata.type-1]}}{{this.fdata.norm}}的数</div>
      <iframe class="game-wrapper" :src="frameSrc" frameborder="0"></iframe>
    </el-main>
    <el-footer class="footer" height="90px">
      <!-- <span class="tips tips-danger">请一定不要在此页面执行“刷新”操作</span> -->
      <el-button @click="backRouter">返回</el-button>
      <el-button type="primary" @click="onSubmit">提交保存</el-button>
    </el-footer>
  </div>
</template>

<script>
const URL = "web-mobile/index.html";
export default {
  name: "game",
  data() {
    return {
      frameSrc: URL,
      type: ["大于", "小于", "不小于", "不大于"],
      query: {},
      enabled: false
    };
  },
  mounted() {
    //修改父组件的 step 进度
    this.$emit("step", 2);
    this.query = this.$route.query;
    window.addEventListener("message", this.messageHandle, false);
  },
  props: ["fdata"],
  methods: {
    backRouter() {
      this.enabled = false;
      this.$emit("step", 1);
      this.$router.push({
        path: "/home",
        query: this.$route.query
      });
    },
    setCookie(name, value) {
      let Days = 30;
      let exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${escape(
        value
      )};expires=${exp.toGMTString()};domain=.haibian.com;path=/`;
    },
    messageHandle(event) {
      //游戏通关后发送消息，解锁“提交保存”按钮
      if (typeof event.data == "string") {
        try {
          let res = JSON.parse(event.data);
          this.enabled = res.great;
        } catch {
          return false;
        }
      }
    },
    onSubmit() {
      if (this.enabled) {
        this.$confirm("是否提交数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.postQuestion();
          })
          .catch(() => {});
      } else {
        this.$alert("全部通关才可以提交题目");
      }
    },
    postQuestion() {
      let c_id = sessionStorage.getItem("local_courseware_id");
      this.setCookie(
        "Admin-Token",
        "eyJpdiI6InBNYlRMaHpCSUtocFFZTjM5VWRhdEE9PSIsInZhbHVlIjoiXC9aR09UZ1FWSjUzZDE1WDV5V25iREV3a0JlWVZVY0JHeDZGcHlPUUhRNzA9IiwibWFjIjoiNDUxOGQ0YzNhNWM3OTc2ZTg2ZDliZDA5Y2JkY2I0NDdhM2RiNjhlZDhkMjQxMzNlMjZlZWU5ZDNkOGU0NTI2ZCJ9"
      );

      // 区分保存与修改
      let uri, data;
      if (c_id) {
        (uri = "/modify"), (data = { courseware_id: c_id });
      } else {
        (uri = "/add"), (data = { title_id: this.query.title_id });
      }
      data.courseware_content = sessionStorage.getItem("local_form_data");
      data.is_result = 1;
      data.is_lavel = 1;
      this.$http.post(uri, data).then(res => {
        if (res.data.errcode == 0) {
          this.$message.success("提交成功");
        } else {
          this.$message.error(res.data.errmsg);
        }
      });
    }
  }
};
</script>

<style lang="less">
.main-title {
  margin-bottom: 10px;
  font-size: 16px;
}
.game-wrapper {
  width: 100%;
  height: 100%;
  min-height: 350px;
}
.tips {
  padding: 0 20px;

  &-danger {
    color: red;
  }
}
</style>
