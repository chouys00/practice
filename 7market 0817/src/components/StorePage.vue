import 

<template>
    <div id='storepage' class="container-fluid">
      <!-- <button type='button' @click='test()'></button>   測試用-->   
      <div class='row'>
        
        <div class='col-3 item' v-for='(v,k) in goods'>
          {{k+1}}
          <br>
          <img :src="v.img" width="200"><br>
          <!-- 價格$ {{v.price}} <br> -->
          {{v.name}} <br>
          NT$ {{(v.price * 1).toLocaleString()}}<br>
          <select v-model='v.pick' >
            <option v-for='n in 20' >{{n}}</option>
          </select>
          <button @click='putinCart(k)' class='btn btn-outline-secondary' type='button'>選購</button>
        </div>
      </div>
    </div>

</template>

<script>
// import axios from 'axios'
export default {
  name: 'StorePage',
  data() {
    return {
      goods:[]   //商品資料
    }
  },
  methods:{
    //將選購資料傳送至購物車頁
    putinCart(k){
      this.$bus.$emit('cartData',this.goods[k]);
    },
    test(){
    
    }
  },
  created(){
      //向./api獲取 index.php echo資料
      this.$http.get('./api')
      .then(response => {
          this.goods=response.data;
          //取得資料後寫入 pick,img 屬性
          for(var v of this.goods){
            v.pick=1;
            v.img=require('../assets/'+v.id+'.jpg');
          }
        })
      .catch(error => {console.log(error);})
  }
}

</script>

<style scoped>
  #storepage{
    line-height: 25px;
    border: #AAAAAA 1px solid;
  }
  div.item{
    height: 420px;
    border: #AAAAAA 1px solid;
  }
  h1{
    color:#003d79 ;
  }
</style>
