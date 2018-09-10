<template>
  <div id="app">
    <div class="container">
      <div class='row'>
        <div class='col-12'>
          
          <!-- <router-link class="btn btn-secondary" to="/StorePage" tag='button'>商品頁</router-link>
          <router-link class="btn btn-secondary" to='/ShoppingCart' tag='button'>購物車</router-link> -->
          <h1><b>MVMT</b></h1>
          <router-view class="view one" name="a"></router-view>
          <br>
          <router-view class="view two" name="b"></router-view>
          <router-view :message='message' class="view three" name="c"></router-view>

        <!-- <router-link to='/' tag='h1'>商品頁面<router-link> -->
          <!-- <router-view></router-view> -->

        </div>
      </div>
    </div>
      <!-- <router-view/> -->
    <!-- <router-view class="view one"></router-view> -->
    <!-- <router-view class="view two" name="a"></router-view> -->
    <!-- <router-view class="view three" name="b"></router-view> -->

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      message: '購買成功!!'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
