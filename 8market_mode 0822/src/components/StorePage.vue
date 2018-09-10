
<template>
    <el-row>
    <!-- <button type='button' @click='test()'></button>   測試用-->   
      <el-col :span='18'>
        <el-row>
          <el-col :span='6' class='item' v-for='(v,k) in goods' :key='k'>
            {{k+1}}
            <br>
            <img :src="v.img" width="200"><br>
            <!-- 價格$ {{v.price}} <br> -->
            {{v.name}} <br>
            NT$ {{(v.price * 1).toLocaleString()}}<br>
            <select v-model='v.pick' >
              <option v-for='(n,k) in 20' :key='k' >{{n}}</option>
            </select>
            <el-button  @click='putinCart(k)' type='info' plain>選購</el-button>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span='6'>
        <ShoppingCart @clearCart='clearCart'  :cartData='cartData'></ShoppingCart>
      </el-col>

    </el-row>

       

</template>

<script>
import ShoppingCart from './ShoppingCart'

export default {
  name: 'StorePage',
  components:{ShoppingCart},
  data() {
    return {
      goods:[],   //商品資料
      cartData:[],
    }
  },
  methods:{
    putinCart(k){
      // this.$bus.$emit('cartData',this.goods[k]);  //傳遞給bus

      //cart有相同id的資料就 splice (=更新)，沒有的話就push進cart
      var tmp=0;
        for(var i in this.cartData){
          if(this.cartData[i].id===this.goods[k].id) {
            this.cartData.splice(i,1,this.goods[k])
            tmp=1;
            break;
          }
        }
        tmp || this.cartData.push(this.goods[k])  
    },
    //結帳號清空cart
    clearCart(){
       this.cartData.splice(0,this.cartData.length)
       for(var v of this.goods){
         v.pick=1
       }
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
