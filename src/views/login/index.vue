<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <div class="login-left">
        <img src="../../assets/login_left.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img src="../../assets/logo.png" alt="" />
          <h2 class="logo-text" data-v-a2265173="">Vite-Admin</h2>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          label-width="0px"
          class="ruleForm"
        >
          <el-form-item
            label=""
            prop="userName"
            :rules="[
              { required: true, message: '请输入用户名', trigger: 'blur' },
            ]"
          >
            <el-input
              type="text"
              autocomplete="off"
              placeholder="用户名：admin / user"
              :prefix-icon="User"
              v-model.trim="ruleForm.userName"
            />
          </el-form-item>
          <el-form-item
            label=""
            prop="password"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
            ]"
          >
            <el-input
              type="password"
              autocomplete="off"
              placeholder="密码：123456"
              :prefix-icon="Lock"
              v-model="ruleForm.password"
            />
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button class="btn" round :icon="CircleClose" @click="resetForm"
            >重 置</el-button
          >
          <el-button
            class="btn"
            round
            type="primary"
            :icon="User"
            :loading="loading"
            @click="submitForm(ruleFormRef)"
            >登 录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { client } from '@/utils/https/client';
import * as API from '@/api';
import routers from '@/routers'
import { User, Lock, CircleClose } from "@element-plus/icons-vue";
import { ElForm } from 'element-plus';

export default defineComponent({
  setup() {
    type FormInstance = InstanceType<typeof ElForm>
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
      userName: "",
      password: "",
    });
    const loading = ref(false)

    const resetForm = () => {
      ruleForm.userName = ''
      ruleForm.password = ''
    };
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          loading.value = true
          const params = { ...ruleForm };
          client.post(API.login, params)
          .then(() => {
            routers.replace('/');
          }).catch(() => {
          }).finally(() => {
            loading.value = false
          });
        }
      })
    };
    return {
      ruleForm,
      User,
      Lock,
      CircleClose,
      ruleFormRef,
      loading,
      resetForm,
      submitForm,
    };
  },
});
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  min-width: 550px;
  height: 100%;
  min-height: 500px;
  background-color: #eee;
  background-image: url("../../assets/login_bg.svg");
  background-position: 50%;
  background-size: 100% 100%;
  background-size: cover;
  .login-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 96%;
    height: 94%;
    padding: 0 50px;
    background-color: #fffc;
    border-radius: 10px;
    .login-left {
      width: 800px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-form {
      width: 420px;
      padding: 50px 40px 45px;
      border-radius: 10px;
      box-shadow: 2px 3px 7px #0003;
      .login-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 45px;
        img {
          width: 60px;
          height: 52px;
        }
        .logo-text {
          padding: 0 0 0 25px;
          margin: 0;
          font-size: 42px;
          font-weight: 700;
          color: #34495e;
          white-space: nowrap;
        }
      }
      .login-btn {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin: 0 auto;
        white-space: nowrap;
        .btn {
          width: 185px;
          height: 40px;
        }
      }
    }
  }
}
.flx-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style lang="scss">
.ruleForm {
  .el-form-item {
    margin-bottom: 40px;
  }
  .el-input__wrapper {
    height: 40px;
  }
}
</style>