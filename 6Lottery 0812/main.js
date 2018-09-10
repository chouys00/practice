import Vue from 'vue'
import showdata from './showdata.vue'

var socket= io.connect('http://localhost:8001');

// Vue.filter('filterissue',function(value){
//   return `$${value}`
// })

var vm = new Vue({
  el: '#app',
  components:{showdata},
  data:{
    listdata:{},        
    selectdate:'',      //搜尋條件 '日期'
    selectissue:'',     //搜尋條件 '期號'
    selecttime:'',     //搜尋條件 '時間'
    gametype:'幸运快三'  //資料表TITLE
  },
  methods:{
    clickgame1(){     //按下按鈕傳送相對應的需求到server，傳回對應資料
      socket.emit('changepage','WFK3');
      this.gametype='幸运快三'
    },
    clickgame2(){    //按下按鈕傳送相對應的需求到server，傳回對應資料
      socket.emit('changepage','BJK3');
      this.gametype='北京快三'
    },
    clickgame3(){    //按下按鈕傳送相對應的需求到server，傳回對應資料
      socket.emit('changepage','CQSSC');
      this.gametype='重庆时时彩'
    },
    changedate(){   //若日期搜尋條件選擇 '--' 表示不下條件  (設為空字串)
      this.selectdate=''
    },
    changetime(){   //若時間搜尋條件選擇 '--' 表示不下條件  (設為空字串)
      this.selecttime=''
    },
  },
  mounted(){
    socket.emit('changepage','WFK3');
    var today=new Date();
    this.selectdate=today.toLocaleDateString('ch').replace(/\//g,'-');
    console.log(this.selectdate);
  },
  computed:{
    duplicate(){
        // console.log(this.listdata);
        var set = new Set();
        var result = [];
        // var result
        

        for(var i=0;i<this.listdata.length;i++){
          // console.log(i);
          if(!set.has(this.listdata[i].date)){
            set.add(this.listdata[i].date);
            result.push(this.listdata[i].date);
            // console.log('YOYOYOYOYOYO');
          }
        }


        
        // console.log(typeof(set));
        // console.log(set)
        //  var result= this.listdata.filter(item => !set.has(item.date) ? set.add(item.date) : false)
        // }
        return result
    }
  }
})

socket.on('search_back',(data)=>{
  console.log(data);
  // vm.listdata=Object.assign({},vm.listdata,data)
  vm.listdata=data;
});

