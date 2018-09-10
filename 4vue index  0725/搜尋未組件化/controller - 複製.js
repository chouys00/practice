var socket= io.connect('http://localhost:8001');

//搜尋,載入組件
Vue.component('search_list',{
	template:'#searchlist',
	// props:['date','v','z'],
	props:{
		date:{
			type:String,
			// required:true  //必要
			//default:100   //預設值100
		},
		v:{
			type:Object,
		}
	},
	methods:{
		toggle(){
			this.showtable= !this.showtable;
			var sub_str=$(event.currentTarget).text().substr(0,10);
			if(this.showtable==true){
				$(event.currentTarget).text(sub_str+' ▲');
			}else{
				$(event.currentTarget).text(sub_str+' ▼');
			}
		}
	},
	data(){
		return{
			showtable:true
		}
		
	}
})

//更新及寫入組件
Vue.component('upd_ins_list',{
	template:'#updinslist',
	props:{
		upddata:{
			type:Object
		},
		insdata:{
			type:Object
		}
	}
})

//寫入組件
// Vue.component('insert_list',{
	// template:'#insertlist',
	// props:{
		// insdata:{
			// type:Object,
		// },
		
	// },


// })


var vm = new Vue({
 	el: '#sport',
	data: {
		showdata:{},
		insdata:{},
		upddata:{},
		z : '0',    //控制BODY呈現的表格
		show:{},
		haha:'haha'
		
	},
	mounted:function(){
		this.firstload();
	},
	methods:{
		//搜尋功能
		search(){
			this.z='1';
			socket.emit('but_search',{'date1':document.getElementById("txt_date1").value,
				'date2':document.getElementById("txt_date2").value,
				'teamA':document.getElementById("txt_teamA").value,
				'teamB':document.getElementById("txt_teamB").value
			}); 
			// this.message = 'kkkkkkkkk'
		},
		//更新功能
		update(){
			this.z='0';
			socket.emit('but_update','a'); 
			// console.log('lllllllllllllllllllllllllll');
		},
		//第一次載入頁面
		firstload(){  
			this.z='1';
			// console.log('kkkkkkkkkkkkkk');
			socket.emit('but_search','new');
		},
		toggle(date){
			
			this.show[date]=!this.show[date];
			var sub_str=$(event.currentTarget).text().substr(0,10);
			if(this.show[date]==true){
				$(event.currentTarget).text(sub_str+' ▲');
			}else{
				$(event.currentTarget).text(sub_str+' ▼');
			}
			
			console.log(this.show[date]);
		}
		

	}
});

//接收SERVER回傳的搜尋/載入頁面資料
socket.on('sql_data',function(data){
			
			vm.showdata=data;
			for(date in data){
				vm.$set(vm.show,date,true)
				// console.log(vm.show);
				// console.log(vm.show);
				// vue.show=
			}
}); 

//接收SERVER回傳的更新資料
socket.on('upd_data',function(data){
			
			vm.upddata=data;
			vm.z='2';
			// console.log(vm.upddata);
		
}); 

//接收SERVER回傳的寫入資料
socket.on('ins_data',function(data){
			
			vm.insdata=data;
			// console.log(vm.insdata);
		
}); 







