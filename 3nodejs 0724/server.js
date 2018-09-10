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
	database:"sports"
});

con.connect(function(err){
	if(err)throw err;
});

//建立server
var server = http.createServer(function(request, response){
console.log('Connection');
});

server.listen(8001);

var serv_io = io.listen(server);
var data={};

serv_io.sockets.on('connection', function(socket) {    
	
    //接收INDEX搜尋按鈕  
    socket.on('but_search',function(data){
        var sql='select * from schedule where';
        
        //判斷第一次載入網頁或搜尋
        if(data=='new'){
            var y = new Date();
            var today= y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
            sql+=' date>="'+today+'"';
        }else{
            
            if(data.date1 && data.date2){     //當date1和date2皆不為空
                sql+=' date between"'+data.date1+'"and"'+data.date2+'"';
            }else if(data.date1 || data.date2){  //當date1和date2其中一個為空
                 sql+=' date="'+data.date1+data.date2+'"';
            }
            
            if(data.teamA){ 	//當主隊欄位不為空時
                if(sql.substr(-5,5)=='where'){
                    sql+=' teamA="'+data.teamA+'"';
                }else{
                    sql+=' and teamA="'+data.teamA+'"';
                }
            }
            
            if(data.teamB){		//當客隊欄位不為空時
                if(sql.substr(-5,5)=='where'){
                    sql+=' teamB="'+data.teamB+'"';
                }else{
                    sql+=' and teamB="'+data.teamB+'"';
                }
            }
        }
        sql+='order by date desc;';
        
         // console.log(sql);
        // tst=data.search;
        // console.log(tst);
        var idx='';
        //資料庫
       con.query(sql,function(err,result,fields){
		if(err)throw err;
                
			var tmp='';
			var final_data={};
            for(var i in result){
                var d = result[i].date;
				var month='';
				var day = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
				// console.log(i);
				
				//日期不同才宣告1維
				if(day!=tmp){
					final_data[day]={};
					tmp=day;
					idx=0;
					// console.log(tmp);
				}
				
				//宣告2維
                final_data[day][idx]={};
            
                final_data[day][idx]['time']=result[i].time;
                final_data[day][idx]['teamA']=result[i].teamA;
                final_data[day][idx]['teamB']=result[i].teamB;
                final_data[day][idx]['odds_home']=result[i].odds_home;
                final_data[day][idx]['odds_draw']=result[i].odds_draw;
                final_data[day][idx]['odds_away']=result[i].odds_away;
                final_data[day][idx]['bet']=result[i].bet;    
				
				// console.log(idx);
				
				idx++;
				
            }
            // console.log(final_data);
			socket.emit('sql_data',final_data);	
        });   
		// connection.end();
    });  
    
    //接收INDEX更新按鈕
	
	
	
    socket.on('but_update',function(data){
        //分析功能
        request({
            url:'http://sports.williamhill.com/bet/zh-cn',
            method:"GET"
            },function(e,response,body){
                // if(!e)console.log(body);
                
   
            func_anzdata(body,function(anz_data){
                
                // var ins='insert into schedule(date,record,time,teamA,teamB,odds_home,odds_draw,odds_away,bet)'+'values';
              
				func_sqldata(anz_data);
            
            });    
        });
    });    


    //分析網頁資料並整合
    function func_anzdata(body,callback){
         //月份判斷索引
        var month={
            一月:'01',
            二月:'02',
            三月:'03',
            四月:'04',
            五月:'05',
            六月:'06',
            七月:'07',
            八月:'08',
            九月:'09',
            十月:'10',
            十一月:'11',
            十二月:'12'
        } 
        
        
         //去除換行、空白字元
        body=body.replace(/[\n\r\t]/g,"");
        body=body.replace(/&nbsp;|\s+$/g,"");
        
        //下向抓tbody資料
        $=cheerio.load(body);
        tbody=$("tbody#sph_mkt_grp_tbl_HL_9d8a08d4b13c912153e27659829a27ad");
        
        //向下抓 tr 資料
        $=cheerio.load(tbody[0]);
        tr_=$("tr");
         

        var anz_data={};
        var ins = 'insert into schedule(date,record,time,teamA,teamB,odds_home,odds_draw,odds_away,bet)'+'values';
        var upd='';
        var idx=0;
        var tmp_date='';
        
		
        //以tr一列一列抓取資料並儲存
        for(i=0;i<tr_.length;i++){
            
			// console.log(tr_.length);
             //向下挖 span 資料
            $=cheerio.load(tr_[i]);
            span_=$("span");  //span[0]14 七月 ,  span[1] 15:00 UK , span[2] 法國 對 克羅莉亞 
            
            //抓出月份, 日期資料
            var span=[];
            for(s=0;s<span_.length;s++){
                span.push($(span_[s]).text());
            }
            
            //取得現在年份
            var y = new Date();
            var time='';
			
            // console.log(span[0]+'-----------'+span[1]+'----------'+span[2]);
            
			//處理 span 區塊資料
            if(span.length==2){
               span[2]=span[1];
               span[0]='';
               span[1]='';
               
                 if(y.getMonth()+1>9){
                   var rightdate= y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
               }else{
                   var rightdate= y.getFullYear()+'-'+'0'+(y.getMonth()+1)+'-'+y.getDate();
               }
               
            }else if(span.length==1){
               span[2]=span[0];
               span[0]='';
               span[1]='';
               
                 if(y.getMonth()+1>9){
                   var rightdate= y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
               }else{
                   var rightdate= y.getFullYear()+'-'+'0'+(y.getMonth()+1)+'-'+y.getDate();
               }
               
            }else{
                //組成正確日期格式   rightdate
                var rightdate= y.getFullYear()+'-'+month[span[0].substr(3,2)]+'-'+span[0].substr(0,2);
                //正確時間
                time=span[1].substr(0,5);
            }
            // console.log(span[1]);
            // console.log('測試'+span[0]+'-----------'+span[1]+'----------'+span[2]);
            
            //正確隊伍
			//去除隊伍名稱中的單引號
			span[2]=span[2].replace("\'","")
			
			// console.log(span[2]);
            var teamAB=span[2].split(" 对 ");    //teamAB[0] 主隊 ,  teamAB[1]客隊
            // console.log(teamAB[0]+'-'+teamAB[1]+'-'+teamAB[2]);
            // console.log(teamAB[0]+'----------------------'+teamAB[1]);
			// console.log(time);
            
            div_=$('div.eventprice');
            var div=[];
            for(d=0;d<div_.length;d++){
                div.push($(div_[d]).text());
            }
            
            //投注量 nobr[0].substr(2,3);
            nobr_=$('nobr');
            var nobr=[];
            nobr.push($(nobr_[0]).text());
            
			
			
            if(tmp_date != rightdate){
                idx=0;
                tmp_date=rightdate;
                // anz_data[rightdate]={};   //宣告1維
            }else{
                idx++;
                
            }
             
            //宣告2維
            anz_data[i]={};
            
            //未使用
			
			//舊三層
			// anz_data[rightdate][idx]={};
            // anz_data[rightdate][idx]['time']=time;
            // anz_data[rightdate][idx]['teamA']=teamAB[0];
            // anz_data[rightdate][idx]['teamB']=teamAB[1];
            // anz_data[rightdate][idx]['odds_home']=div[0];
            // anz_data[rightdate][idx]['odds_draw']=div[1];
            // anz_data[rightdate][idx]['odds_away']=div[2];
            // anz_data[rightdate][idx]['bet']=nobr[0].substr(2,3);  

		
			anz_data[i]['date']=rightdate;
			anz_data[i]['time']=time;
            anz_data[i]['teamA']=teamAB[0];
            anz_data[i]['teamB']=teamAB[1];
            anz_data[i]['odds_home']=div[0];
            anz_data[i]['odds_draw']=div[1];
            anz_data[i]['odds_away']=div[2];
            anz_data[i]['bet']=nobr[0].substr(2,3); 

			

            // console.log(anz_data);
        }
         // console.log(anz_data);
		 // console.log('777777777777777777777777777777');
        // count=tr_.length;
        
        callback(anz_data);
    }
	

	 var ins='';
	var json_upd={};
	var json_ins={};
	//將整合資料做SQL處理
    function func_sqldata(anz_data){
        
		// console.log(tr_.length);
        // console.log(anz_data);
		// console.log('666666666666666666666666666666666');
			if(tr_.length>0){
                // console.log('OOOOOOOOOOOOOOOOOOOOOOO');
				
				//資料最終處理
				func_qry(0,anz_data,function(ins,json_ins,json_upd){
						if(Object.keys(json_ins).length>0){
							ins= "INSERT INTO schedule(date,time,teamA,teamB,odds_home,odds_draw,odds_away,bet) VALUES" + ins; 
							
							// console.log(ins+'');
							//用SQL字串尾判斷是否有需要執行更新 ，若values結尾表示無新資料，不必執行
							if(ins.substr(ins.length-6)!='VALUES'){
								ins=ins.substring(0,ins.length-1)+';';
								
								// console.log(ins+'我是下面');
								
								con.query(ins,function(err,result){
									if (err) throw err;
									console.log('資料已寫入');
								});  
							}
					}
					// console.log(upd_data);
					socket.emit('upd_data',json_upd);
					socket.emit('ins_data',json_ins);
				});
			}
    }
	
	
	function func_qry(i,anz_data,callback){
			// console.log(i);
		
		var sql='select * from schedule where date="'+anz_data[i]['date']+'" and teamA="'+anz_data[i]['teamA']+
		'" and teamB="'+anz_data[i]['teamB']+'";';
		console.log(sql);
		con.query(sql,function(err,result){
			
			//result長度為0, 表示是全新資料, 反之為已存在資料
			if(result.length==0){
				
				// console.log(anz_data[date][idx]['teamA']);
				console.log('new--------------------------------------');
				
				json_ins[i]={};
				json_ins[i]['date']=anz_data[i]['date'];
				json_ins[i]['time']=anz_data[i]['time'];
				json_ins[i]['teamA']=anz_data[i]['teamA'];
				json_ins[i]['teamB']=anz_data[i]['teamB'];
				json_ins[i]['odds_home']=anz_data[i]['odds_home'];
				json_ins[i]['odds_draw']=anz_data[i]['odds_draw'];
				json_ins[i]['odds_away']=anz_data[i]['odds_away'];
				json_ins[i]['bet']=anz_data[i]['bet'];  
				
				// console.log(json_ins);
				
				ins+="('"+anz_data[i]['date']+"','"+anz_data[i]['time']+"','"+anz_data[i]['teamA']+"','"+anz_data[i]['teamB']+"','"+anz_data[i]['odds_home']+"','"+anz_data[i]['odds_draw']+"','"+anz_data[i]['odds_away']+"','"+anz_data[i]['bet']+"')"+','; 
				
				// console.log(tr_.length+'------------------------');
				
				//如果還沒處理到該批資料的最後一筆, 就將i+1回call自己
				if(i<tr_.length-1){
					func_qry(i+1,anz_data,function(){
						callback(ins,json_ins,json_upd);
					});  
				}else{
					callback(ins,json_ins,json_upd);
				}
				
				// console.log('new--------------------------------------------------------');
			}else{
				console.log('old--------------------------------------');
				
				json_upd[i]={};
				json_upd[i]['date']=anz_data[i]['date'];
				json_upd[i]['time']=anz_data[i]['time'];
				json_upd[i]['teamA']=anz_data[i]['teamA'];
				json_upd[i]['teamB']=anz_data[i]['teamB'];
				json_upd[i]['teamB']=anz_data[i]['teamB'];
				json_upd[i]['odds_home']=anz_data[i]['odds_home'];
				json_upd[i]['odds_draw']=anz_data[i]['odds_draw'];
				json_upd[i]['odds_away']=anz_data[i]['odds_away'];
				json_upd[i]['bet']=anz_data[i]['bet'];  
				
				var upd='update schedule set date="'+anz_data[i]['date']+'" ,time="'+anz_data[i]['time']+'" ,teamA="'+anz_data[i]['teamA']+'" ,teamB="'+anz_data[i]['teamB']+'" ,odds_home="'+anz_data[i]['odds_home']+'" ,odds_draw="'+anz_data[i]['odds_draw']+'" ,odds_away="'+anz_data[i]['odds_away']+'" ,bet="'+anz_data[i]['bet']+'"';
				upd+='  where date="'+anz_data[i]['date']+'"'+' and teamA='+'"'+anz_data[i]['teamA']+'"'+" and teamB="+'"'+anz_data[i]['teamB']+'";'; 
				
				
				con.query(upd,function(){
					console.log('資料已更新');
					
					//如果還沒處理到該批資料的最後一筆, 就將i+1回call自己
					if(i<tr_.length-1){
						func_qry(i+1,anz_data,function(){
							callback(ins,json_ins,json_upd);
						});
					}else{
						callback(ins,json_ins,json_upd);
					}
				}); 
				// newOrold='old';
				// console.log('old--------------------------------------------------------');
			}
		// console.log('function test---------------');
		});
	}  
});	






 
