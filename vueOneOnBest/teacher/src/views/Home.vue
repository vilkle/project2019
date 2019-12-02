<template>
<div class="main-container">
  <el-main>
    <el-form 
      class="main-form"
      :model="formData"
      :rules="formRules"
      ref="mainForm"
      label-position="top">
      <el-form-item label="1. 设置题干类型" prop="type">
        <el-radio 
          v-model="formData.type"
          v-for="(item, index) of enums.type"
          :key="index"
          :label="item.id">{{item.text}}</el-radio>
      </el-form-item>
      <el-form-item label="2. 题干标准数（不大于30的整数）" prop="norm">
        <el-col :span="12">
          <el-input
            placeholder="不大于30的整数"
            v-model="formData.norm"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="3. 选数区数量（8～15的整数）" prop="count">
        <el-col :span="12">
          <el-input
            placeholder="8～15的整数"
            v-model="formData.count"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="4. 输入第一题（00~50的两位数）">
        <el-row :gutter="20">
          <el-col 
            :span="3"
            v-for="(q, index) of showCount(formData.count)"
            :key="index">
            <el-input
              size="small"
              v-model="formData.question[index]"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-main>
  <el-footer class="footer" height="90px">
    <el-button 
      type="primary"
      @click="onSubmit">提交</el-button>
  </el-footer>
</div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        enums: {
          type: [
            {id: 1, text: '大于'},
            {id: 2, text: '小于'},
            {id: 4, text: '不大于'},
            {id: 3, text: '不小于'},
          ]
        },
        formData: {
          norm: undefined,
          type: 1,
          count: 8,
          // vue无法对数组即时渲染，所以采用对象
          // 实际业务中 question 的长度可能会大于 count，编辑器不做判断，在游戏里面处理
          question: {}
        },
        formRules: {
          norm: [
            { required: true, message: '请设置题干标准数', trigger: 'blur' },
            { pattern: /^([0-9]|[12][0-9]|30)$/, message: '限输入不大于30的整数'}
          ],
          count: [
            { required: true, message: '请设置选区数量', trigger: 'blur' },
            { pattern: /^([8-9]|1[0-5])$/, message: '限输入8-15的整数' }
          ],
          type: [
            { required: true, message: '必选', trigger: 'blur' },
          ]
        },
        query: {}
      }
    },
    mounted() {
      this.query = this.$route.query;
      //修改父组件的 step 进度
      this.$emit('step', 1);
      this.getTitleDetail(this.query.title_id);
    },
    props: ['fdata'],
    methods: {
      showCount(val) {
        let count = ~~val;
        return (8 <= count && count <= 15) ? count : 8;
      },
      validAnwsers () {
        let res = true;
        let count = 0;
        let str = '还有未填写的题目';
        let regExp = /^([0-4][0-9]|50)$/
        for(let index in this.formData.question) {
          count++;
          let ans = this.formData.question[index];
          // 排除个位数
          if (ans.length == 1) {
            console.log('个位数 ====> ', index);
            this.$set(this.formData.question, index, ans);
            continue;
          }
          // 校验题目数字
          if (regExp.test(ans)) {
            continue
          } else {
            res = false;
            str = `题目只能输入00～50的整数 [第${~~index+1}个输入框]`;
            break;
          }
        }
        //判断是否有未填写
        if (this.formData.count > count) {
          this.$message.warning(str);
          res = false;
        }
        return res;
      },
      getTitleDetail(id) {
        if (!id) return
        // 获取课程信息
        this.$http.get(`/get/title?title_id=${id}`).then(res=>{
          if (res.data.errcode == 0 && res.data.data.courseware_id) {
            sessionStorage.setItem('local_courseware_id',JSON.stringify(res.data.data.courseware_id));
            let resContent = JSON.parse(res.data.data.courseware_content);
            this.formData = Object.assign(this.formData, resContent);
            if (this.formData.count < 8) {
              // 根据数量切换元素的显示状态
              for (let i=8; i>this.formData.count;) {
                this.birds[--i].enabled = false;
              }
            }
          }
        })
      },
      onSubmit () {
        this.$refs.mainForm.validate((valid) => {
          if (valid) {
            if (this.validAnwsers()) {
              this.$emit('update:fdata', this.formData)
              //将参数写入本地缓存
              sessionStorage.setItem('local_form_data',JSON.stringify(this.formData));
              this.$emit('step', 2);
              this.$router.push({
                path: '/game',
                query: this.query
              });
            }
          } else {
            this.$message.warning('请填写必填项')
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="less">
.main-container {
  .el-main {
    min-height: 300px;
  }
}
</style>
