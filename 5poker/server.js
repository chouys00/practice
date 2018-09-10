var http = require("http");  //調用http函式庫
var url = require('url');   //解析網址
var fs = require('fs');   //檔案系統，讀檔用
var io = require("socket.io");   //另瀏覽器與伺服器雙向溝通
var request = require('request');   //http 客戶端輔助 (建立伺服器)
var cheerio =require("cheerio");  //server端的 jquery實作 (解析網址用)
var mysql=require('mysql');   //資料庫
// var port=8001;

//http://127.0.0.1:8001/index.html


//建立與資料庫連線
var con=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"passwords",
	database:"game"
});

con.connect(function(err){
});

//建立server
var server = http.createServer(function(request, response){
	console.log('Connection');
});

server.listen(8001);

var serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket) {    
	
	socket.on('getcard',function(moneydata){
		
		//創建長度為52的連續數組
		var poker = Object.keys(Array.apply(null,{length:52}));
		var result=[];
		// console.log(poker);

		//亂數產生2數字
		for(var i=0;i<2;i++){
			var ran=Math.floor(Math.random()*(poker.length));
			result.push(poker[ran]);

			poker.splice(ran,1);

			// var ran=Math.floor(Math.random()*(poker.length-i));
			// poker[ran]=poker[poker.length-i-1];

			
			// var ran=Math.floor(Math.random()*poker.legth);
			// result.push(poker[ran]);
			// var center=poker[ran];
			// poker[ran]=poker[poker.length-1];
			// poker[poker.length-1]=center;
			// poker=poker.slice(0,poker.length-1);
		}

		// console.log(poker);
		// console.log('-----------------------');
		console.log('result[0]= '+result[0]);
		console.log('result[1]= '+result[1]);

		//展生遊戲結果，並將該局剩餘金額回存資料庫
		var winOrlose='';
		var newmoney=0;
		if(parseInt(result[0])>parseInt(result[1])){
			winOrlose='win';
			newmoney=parseInt(moneydata.money.slice(5)) + parseInt(moneydata.bet);
		}else if(parseInt(result[0])<parseInt(result[1])){
			winOrlose='lose';
			newmoney=parseInt(moneydata.money.slice(5)) - parseInt(moneydata.bet);
		}

		// console.log(moneydata);
		// var sql='insert into poker(
		

		var data={};
		data['card1']=result[0];
		data['card2']=result[1];
		data['result']=winOrlose;

		// console.log(data);
		socket.emit('postcard',data);

		var upd='update poker set money ='+newmoney+' where id="'+moneydata.id+'";';
		con.query(upd,function () {
			console.log('更新');
		});
		// console.log(ins);
	});

	//接收登入資料
	socket.on('login',function(data){
		// console.log(data);
		var sql='select * from poker where id="'+data.id+'" and code="'+data.code+'";';
		con.query(sql,function (i,result,k) {
			console.log(result);
			socket.emit('login_back',result);
		});
		// socket.emit('test','hi');
	});

	//接收註冊資料
	socket.on('register',function(data){
		var ins='insert into poker (id,code,money) values("' + data.id + '","' + data.code + '","5000");';
		console.log(ins);
		con.query(ins,function () {
			socket.emit('login_back',[{id:data.id,code:data.code,money:5000,newmember:true}]);
			console.log('寫入');
		});
	});

	//檢查註冊ID
	socket.on('checkID',function(data){
		
		var sql='select * from poker where id="'+data+'";';
		var meg='';
		con.query(sql,function(i,result,k){
			if(result.length==0){
				meg='';
				// console.log('LALALALALALALALALALA');
			}else{
				meg='已存在相同帳號';
				// console.log('GOGOGOGOGGOGOGO');
				socket.emit('checkIDback',meg);
			}
		});
	});
});	
	








 
