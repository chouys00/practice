<template>
<div id='cartpage' class="container-fluid">
  <el-row>
    
    <el-col :span='20'>
      <h3><b>已選購 {{countpick}} 件商品，總金額 NT$ {{countprice}}</b></h3>
    </el-col>

    <el-col :span='4'>
      <el-button type='info' @click='checkout()'>結帳</el-button>  
    </el-col>

  </el-row>

  
  <hr>
    <table>
        <tr>
          <th class='th1'></th>
          <th>商品名稱</th>
          <th>單價</th>
          <th>購買數量</th>
          <th>小計</th>
        </tr>
        <tr v-for='(v,k) in cartData' :key="k">
          <td class='td1'><img :src="v.img" width="80"><br></td>
          <td class='td2'>{{v.name}}</td>
          <td>{{(v.price*1).toLocaleString()}}</td>
          <td>{{v.pick}}</td>
          <td>{{(v.pick * v.price).toLocaleString()}}</td>
          <td><img src="../assets/garbage.png" class='myMOUSE' width="50" @click='deletCart(k)'></td><br>
        </tr>
    </table>

    <AlertPage  @Alerttoggle='Alerttoggle' :showAlert='showAlert'>{{message}}</AlertPage>
</div>
</template>

<script>
import AlertPage from './AlertPage'

export default {
  name: 'ShoppingCart',
  data () {
    return {
         //購物車資料
      message:'購買成功!!',
      showAlert:false
    }
  },
  props:{
    cartData:null
  },
  components:{AlertPage},
  computed:{
    //加總件數
    countpick(){
      var a=0
      for(var v of this.cartData){
        a+= parseInt(v.pick)
      }
      return a
    },
    //加總金額
    countprice(){
       var a=0
       for(var v of this.cartData){
         a += parseInt(v.price) * parseInt(v.pick);
       }
      return a.toLocaleString()    //三位一撇
    }
  },
  methods:{
     //如果購物車內有資料，結帳 >> 清空購物車資料並傳送 alert 需求到 alertpage 組件
    checkout(){
      if(this.cartData.length != 0){
        this.$emit('clearCart');
        this.showAlert=true
      }
    },
    deletCart(key){
      //刪除購物車對應 key值 的資料
      this.cartData.splice(key,1)
    },
    Alerttoggle(){
      this.showAlert= !this.showAlert
    }
  },
}
</script>

<style scoped>
  div.cart{
    height: 150px;
  }
  #cartpage{
    border: #AAAAAA 1px solid;
    line-height: 24px;
    padding-top: 20px;
    padding-bottom: 15px;
  }
  table{
    width: 100%
  }
  .th1,td1{
    width: 15%
  }
  .td2{
    width: 25%
  }
  .myMOUSE {
    cursor: pointer;
  } 
</style>