var http = require("http");  //調用http函式庫
// var url = require('url');   //解析網址
// var fs = require('fs');   //檔案系統，讀檔用
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
	database:"test"
});

con.connect(function(err){
	// console.log('kkkkk');
});

//建立server
var server = http.createServer(function(request, response){
	console.log('Connection');
});

server.listen(8001);

var serv_io = io.listen(server);


serv_io.sockets.on('connection', function(socket) { 
	socket.on('changepage',function(emit){
// game1 幸运快三
		request({
			url:'http://www.737398.com/lotteryV3/draw/list.do?lotCode='+emit,
			method:'GET'
			},function(e,response,body){
				//去除換行、空白字元
				body=body.replace(/[\n\r\t]/g,"");
				body=body.replace(/&nbsp;|\s+$/g,"");
				
				$=cheerio.load(body);
				tr_=$("#jq_draw_list tbody tr");

				var data={};

				//依列逐筆資料分析
				for(i=0;i<tr_.length;i++){
					$=cheerio.load(tr_[i]);
					td_=$('td');

					//抓取所有td的text值
					var td=[];
					for(s=0;s<td_.length;s++){
						td.push($(td_[s]).text());
					}

					//資料欄位還沒有內容時，跳過處理這筆資料
					if(td[3]=='--'){
						console.log('這筆還沒有資料啦啦啦啦啦啦');
						continue;
					}

					//抓取所有span的text 並去除前後空白
					var span=[];
					span_=$('td span');
					for(s=0;s<span_.length;s++){
						span.push($(span_[s]).text().trim());
					}

					data[i]={};
					//依據分析到的資料欄位數量動態產生物件欄位
					var k=0;
					for(k=0;k<span_.length-3;k++){
						var str='num'+(k+1);
						// console.log(str);
						data[i][str]=span[k];   //號碼 1,2,3 ...
					}
					data[i]['issue']=td[0];   //期號
					data[i]['date']=td[1];   //日期
					data[i]['time']=td[2];   //時間
					data[i]['nums']=span[k]+span[k+1]+span[k+2];   //總合大小雙

				}
				// console.log(data);

				

				//--------------------------------------------------------------

				//func_qry 逐筆做資料庫處理，從 data 第二筆資料開始處理   (第一筆為表頭，顧忽略)
				var ins='';
				func_qry(1,data,ins,emit,function(emit){

					//資料庫更新到最新後, 將資料表倒出, 傳給index
					var sql=`SELECT * from ${emit} ORDER BY issue DESC;`;
					con.query(sql,function(err,result){
						//將資料庫倒出時間資料校正為當地時間格式
						for(i=0;i<result.length;i++){
							result[i].date=result[i].date.toLocaleDateString();
						}
						socket.emit('search_back',result);
					});
				});
		});
	});
});




function func_qry(i,data,ins,emit,callback){
	// console.log(data);
	

	// 分析資料跳過的筆數會導致錯誤，用try&catch導向下一筆資料處理
	try{
		// var sql='select * from '+emit+' where issue="'+data[i]['issue']+'";';
		var sql=`select * from ${emit} where issue= "${data[i]['issue']}"; `;
		
		con.query(sql,function(err,result){
			
			//result長度為0, 表示是全新資料, 反之為已存在資料
				if(result.length==0){

					//依據資料欄位動態調整 insert 語法  (前半段)
					var insstr1='';
					for(j=0;j<Object.keys(data[i]).length-4;j++){
						var str='num'+(j+1);
						insstr1+= `'${data[i][str]}',`;
					}
					//串接insert語法
					ins+=`('${data[i]['issue']}','${data[i]['date']}','${data[i]['time']}',${insstr1}'${data[i]['nums']}'),`;
					// ins+="('"+data[i]['issue']+"','"+data[i]['date']+"','"+data[i]['time']+"','"+insstr1+data[i]['nums']+"')"+',';
		
						//如果該筆資料還不是最後一筆，將i+1 (下一筆)，回call函數自己
					if(i<Object.keys(data).length-1){
						func_qry(i+1,data,ins,emit,function(ins,emit){
							callback(ins,emit);
						});
					}else{
						//依據資料欄位動態調整 insert 語法  (後半段)
						var insstr2='';
						for(j=0;j<Object.keys(data[i]).length-4;j++){
							var str='num'+(j+1);
							insstr2+= `${str},`;
						}

						ins=`INSERT INTO ${emit} (issue,date,time,${insstr2} nums)values ${ins}`;
						
					
						//用SQL字串尾判斷是否有需要執行更新 ，若values結尾表示無新資料，不必執行
						if(ins.substr(ins.length-6)!='values'){
							ins=ins.substring(0,ins.length-1)+';';
							con.query(ins,function(err,result){
								console.log('資料已寫入');
							});
						}
						callback(emit);
					}
				}else{
					//如果該筆資料還不是最後一筆，將i+1 (下一筆)，回call函數自己
					if(i<Object.keys(data).length-1){
						func_qry(i+1,data,ins,emit,function(ins,emit){
							callback(ins,emit);
						});
					}else{
						//依據資料欄位動態調整 insert 語法  (後半段)
						var insstr2='';
						for(j=0;j<Object.keys(data[i]).length-4;j++){
							var str='num'+(j+1);
							insstr2+= `${str},`;
						}

						ins=`INSERT INTO ${emit} (issue,date,time,${insstr2} nums)values ${ins}`;
					
						//用SQL字串尾判斷是否有需要執行更新 ，若values結尾表示無新資料，不必執行
						if(ins.substr(ins.length-6)!='values'){
							ins=ins.substring(0,ins.length-1)+';';
							con.query(ins,function(err,result){
								console.log('資料已寫入');
							});
						}
						callback(emit);
					}
				}
		});
	}catch(e){   //當try區域發生錯誤  (網頁有未生成的資料，該筆資料在分析被跳過)
		//如果該筆資料還不是最後一筆，將i+1 (下一筆)，回call函數自己
		if(i<Object.keys(data).length-1){
			func_qry(i+1,data,ins,emit,function(ins,emit){
				callback(ins,emit);
			});
		}
	}
}



 
