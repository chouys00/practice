<template>
<transition name='fade'>
  <div class="alert" v-if="showAlert">
    <div class="wrap">
      <div class="head">{{title}}</div>
      <div class="body">
          <h2><b><slot></slot></b></h2>
      </div>
      <div class="foot">
        <div v-if="type === 'confirm'">
          <button class="btn-base" @click="sure">确定</button>
          <!-- <button class="btn-gray" @click="cancel">取消</button> -->
        </div>
        <div v-else-if="type === 'inform'">
          <el-button type='info' @click="cancel" plain>OK</el-button>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'alert',
  data() {
    return {
      
    };
  },
  props: {
    title: {
      type: String,
      default: '提示',
    },
    message: {
      type: String,
    },
    type: {  // 可以有confirm, 和inform两个类型
      type: String,
      default: 'inform',
      validator(value) {
        return value === 'confirm' || value === 'inform';
      },
    },
    sureBtn: {
      type: Function,
    },
    cancelBtn: {
      type: Function,
    },
    context: {
      type: Object,
    },
    showAlert:{
      type:Boolean,
    }
  },
  methods: {
    cancel() {
      if (this.cancelBtn) {
        this.cancelBtn.apply(this.context);
      }
      this.close();
    },
    sure() {
      if (this.sureBtn) {
        this.sureBtn.apply(this.context);
      }
      this.close();
    },
    show() {
      this.$emit('Alerttoggle')
    },
    close() {
      this.$emit('Alerttoggle')
    },
  },
};
</script>


<style scoped>
    .alert {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0, 0.8);
        z-index: 1000;
        transition: all .3s ease-in-out;
    }
    .wrap {
        position: absolute;
        z-index: 1002;
        min-width: 400px;
        background: #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 4px;
    }
    .head {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #dedede;
        padding-left: 10px;
        color: #333;
    }
    .body {
        padding: 40px 20px;
        text-align: center;
    }
    .foot {
        height: 50px;
        text-align: center;
        /* button {
            margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
        } */
    }
</style>