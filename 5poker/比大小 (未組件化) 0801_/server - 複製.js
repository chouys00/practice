var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require("socket.io");
var request = require('request');
var cheerio =require("cheerio");
var mysql=require('mysql');
// var port=8001;

//http://127.0.0.1:8001/index.html


//建立與資料庫連線
var con=mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"passwords",
	database:"game"
});

// var con2=mysql.createConnection({
// 	host:"localhost",
// 	user:"root",
// 	password:"passwords",
// 	database:"git"
// });

con.connect(function(err){
	console.log('aaaa');
});

// con.connect((err)=>{
// 	console.log('bbbb');
// });

//建立server
var server = http.createServer(function(request, response){
	console.log('Connection');
});

server.listen(8001);

var serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket) {    
	
	socket.on('getcard',function(moneydata){
		
		//創建長度為54的連續數組
		var poker = Object.keys(Array.apply(null,{length:52}));
		var result=[];

		//亂數產生2數字
		for(var i=0;i<2;i++){
			var ran=Math.floor(Math.random()*(poker.length-i));
			result.push(poker[ran]);
			poker[ran]=poker[poker.length-i-1];
			
			// var ran=Math.floor(Math.random()*poker.legth);
			// result.push(poker[ran]);
			// var center=poker[ran];
			// poker[ran]=poker[poker.length-1];
			// poker[poker.length-1]=center;
			// poker=poker.slice(0,poker.length-1);
		}

		// console.log(poker);
		// console.log('-----------------------');
		// console.log('result[0]= '+result[0]);
		// console.log('result[1]= '+result[1]);

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

	socket.on('login',function(data){
		// console.log(data);
		var sql='select * from poker where id="'+data.id+'" and code="'+data.code+'";';
		// console.log(sql);
		// var sql='select * from poker ;';

		// console.log(data.id)
		con.query(sql,function (i,result,k) {
			// console.log(fields);
			
			// if(result.length==0){
			// 	socket.emit('login_back','Y');
			// }else{
			// 	socket.emit('login_back','N');
			// }

			// console.log(result[id]);
			socket.emit('login_back',result);
		});
		// socket.emit('test','hi');
	});

	socket.on('register',function(data){
		var ins='insert into poker (id,code,money) values("' + data.id + '","' + data.code + '","5000");';
		// console.log(ins);
		con.query(ins,function () {
			socket.emit('login_back',[{id:data.id,code:data.code,money:5000,newmember:true}]);
			console.log('寫入');
		});
	});

});	
	








 
