<template>
  <div>
      <!-- 資料表 -->
     <table  class='table' >
       <thead>
        <tr><th :colspan='countcol'><slot></slot></th></tr>   
        <tr>
          <th v-for='(v,k) in listdata[0]'>{{colname[k]}}</th>     
        </tr>
       </thead>

       <tbody>
        <tr v-for ='v in list.slice(pageStart,pageStart+countOfPage)'>      
          <td v-for='v1 in v'>{{v1}}</td>
        </tr>
       </tbody>
      </table>

      <!--換頁 -->
      <!-- 依照 countOfPage 值將資料拆分成多個等份，切換分頁就印出該等份的資料 -->
      <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li :class="{'disabled': (currPage === 1)}" class="page-item" @click.prevent="setPage(currPage-1)">
                <a class="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                  <span class="sr-only">Previous</span>
                </a>
            </li>
            <li v-for="n in totalPage"  v-bind:class="{'active': (currPage === (n))}" class="page-item"  @click.prevent="setPage(n)">
                <a class="page-link" href="#">{{n}}</a>
            </li>
            <li :class="{'disabled': (currPage === totalPage)}" class="page-item" @click.prevent="setPage(currPage+1)">
                <a class="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                  <span class="sr-only">Next</span>
                </a>
            </li>
          </ul>
      </nav>
  </div>
</template>
  
<script>

export default {
  data () {
    return {
      colname:{     //表頭欄位名稱依 listdata 的 key 
        'issue':'期號',
        'date':'開獎日期',
        'time':'開獎時間',
        'num1':'號碼1',
        'num2':'號碼2',
        'num3':'號碼3',
        'num4':'號碼4',
        'num5':'號碼5',
        'nums':'--'
      },
      countOfPage:30,    //一頁的資料筆數
      currPage:1,     //當下分頁
    }
  },
  props:
  {
    listdata:[Object,Array],     //彩票資料 
    selectissue:String,     //搜尋條件 '期號'
    selecttime:String,      //搜尋條件 '時間'
    selectdate:String,      //搜尋條件 '日期'
  },
  computed:{
    list(){
      var arr=[];
      //資料變動的時候 (條件搜尋中)，回到分頁1 
      this.currPage=1

      //若搜尋條件選擇 -- emit父層讓搜尋條件默認為無
      this.selectdate =='--' && this.$emit('changedate')
      // if(this.selectdate=='--'){
      //   this.$emit('changedate');   //
      // }

      //若搜尋條件選擇 -- emit父層讓搜尋條件默認為無
      this.selecttime=='--' && this.$emit('changetime')
      // if(this.selecttime=='--'){
      //   this.$emit('changetime');
      // }
  
      //條件篩選，拿條件跟資料比對，search不到會回傳 -1 , 當不等於 -1時做下一層比對，最後 push 到另一新陣列回傳   (當用空字串做比對，結果回傳0)
      for(var i=0;i<this.listdata.length;i++){
        if(this.listdata[i].issue.indexOf(this.selectissue)!=-1 ){
          if(this.listdata[i].time.indexOf(this.selecttime)!=-1){
            if(this.listdata[i].date.indexOf(this.selectdate)!=-1){
              arr.push(this.listdata[i]);
            }
          }
        }
      }

      

      // if(this.selectdate!=''){
      //   var self=this;
      //   arr=this.listdata.filter(function(item,index,arr){
      //     return item.date==self.selectdate
      //   });
      // }
      return arr;
    },
    countcol(){
      //如果 listdata 已經接收到資料，回傳資料欄位數，動態產生表格欄位
      if(this.listdata[0]){
        return Object.keys(this.listdata[0]).length
      }
    },
   
    pageStart(){
      //計算各分頁的資料起始筆數
      return (this.currPage - 1) * this.countOfPage
    },
    totalPage(){
        //總頁數(totalPage)為 篩選過的資料(list)筆數 / 每分頁的資料筆數，取整數
        return Math.ceil(this.list.length / this.countOfPage); 
    }
  },
  methods:{
    setPage(idx){
      //按下按鈕的結果會小於 0 或大於 totalPage 時，終止此按鈕函數
      if( idx <= 0 || idx > this.totalPage ){
        return;
      }
      this.currPage = idx;  //設定按下按鈕後 currPage 的值
    },
  }
  
}
</script>

<style>


.table table {
  width:100%;
  margin:1ㄎ5px 0;
  border:0;
}
.table th {
  background-color:#00A5FF;
  color:#FFFFFF
}
.table,.table th,.table td {
  font-size:1.1em;
  text-align:center;
  padding:4px;
  border-collapse:collapse;
}
.table th,.table td {
  border: 1px solid #6dcbfe;
  border-width:1px 0 1px 0
}
.table tr {
  border: 1px solid #6dcbfe;
}
.table tr:nth-child(odd){
  background-color:#aae1fe;
}
.table tr:nth-child(even){
  background-color:#fdfdfd;
}



</style>
