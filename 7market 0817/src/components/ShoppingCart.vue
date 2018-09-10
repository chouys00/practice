<template>
<div id='cartpage' class="container-fluid">
  <div class='row'>

    <div class='col-10'>
      <h3><b>已選購 {{countpick}} 件商品，總金額 NT$ {{countprice}}</b></h3>
    </div>

    <div class='col-2'>
      <button class='btn btn-secondary' type='button' @click='checkout()'>結帳</button>  
    </div>
  
  </div>
  <hr>
    <table>
        <tr>
          <th class='th1'></th>
          <th>商品名稱</th>
          <th>單價</th>
          <th>購買數量</th>
          <th>小計</th>
        </tr>
        <tr v-for='(v,k) in cartData'>
          <td class='td1'><img :src="v.img" width="80"><br></td>
          <td class='td2'>{{v.name}}</td>
          <td>{{(v.price*1).toLocaleString()}}</td>
          <td>{{v.pick}}</td>
          <td>{{(v.pick * v.price).toLocaleString()}}</td>
          <td><img src="../assets/garbage.png" class='myMOUSE' width="50" @click='deletCart(k)'></td><br>
        </tr>
    </table>
</div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  data () {
    return {
      cartData:[],   //購物車資料
    }
  },
  mounted(){
      //接收store頁的資料
      this.$bus.$on('cartData',data => {
       //若該商品資料已在購物車，替換掉它(=更新)，若沒有則push進購物車
        var tmp=0;
        for(var i in this.cartData){
          if(this.cartData[i].id===data.id) {
            this.cartData.splice(i,1,data)
            tmp=1;
            break;
          }
        }
        tmp || this.cartData.push(data)  
    });
  },
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
      this.cartData.length == 0 || this.$bus.$emit('showalert','inform') , this.cartData.splice(0,this.cartData.length);
    },
    deletCart(key){
      //刪除購物車對應 key值 的資料
      this.cartData.splice(key,1)
    }
  }
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