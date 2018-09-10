
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src="jquery-3.3.1.js"></script>
<script type="text/javascript">

//搜尋及載入頁面表單函數
function show_data(data){
					show='<div style="width:1200px;margin:auto">';
					$.each(data,function(i,n){
					show+='<table class="but"><tr><th colspan="7" class="toggle">'+i+'</th></tr>';
					show+='<table class="act"><tr><th>時間</th><th>主場隊伍</th><th>客場隊伍</th><th>主場賠率</th><th>平手賠率</th><th>客場賠率</th><th>賭注數</th></r>';
					$.each(n,function(i1,n1){
						show+='<tr><td>'+n1['time']+'</td><td>'+n1['teamA']+'</td><td>'+n1['teamB']+'</td><td>'+n1['odds_home']+'</td><td>'+n1['odds_draw']+'</td><td>'+n1['odds_away']+'</td><td>'+n1['bet']+'</td></tr>';
						
						// alert(n1['teamA']+n1['teamB']);
						// console.log(n1['teamA']+n1['teamB']);
						// document.getElementById('info').innerHTML = '<table><tr><td>'+n1['teamA'];
					});
					show+='</table>';
				}); 
				show+='</table></div>'; 
			}

//搜尋
var Search=function(){
	// var URLs_ary='qry.php';
	$.ajax({
		url:'qry.php',
		data:$('#search').serialize(),
		type:'POST',
		dataType:'json',
		success:function(json_data){
		

			
			//印出搜尋表單
			show_data(json_data);
			  
			$('#Body').empty();  //每次都將之前印的表單清除，避免表格重複印出
			$('#Body').append(show); 
            
            //表格可依照日期收起欄位
             $(document).ready(function(){
                var i=1;
                $(".but").on("click",function(){
                    
                    var sub_str=$(this).text().substr(0,10);
                    // var str2=substr(str,0,4);
                    if(i==1){
                        
                        $(this).next('.act').hide(); 
                        $(this).find('.toggle').text(sub_str+' ▼');
                        i-=1;
                        
                    }
                    else{
                        $(this).next('.act').show();
                        $(this).find('.toggle').text(sub_str);
                        i+=1;
                    }
                        
                    
                });
            });
		},
		error:function(){
			alert('查無此筆資料');   //若比對結果無法傳回，表示無該筆資料
		}
	});
}

    //寫入/更新
var Update=function(){
	$.ajax({
		url:'anz.php',
		data:$('#update').serialize(),
		type:'POST',
		dataType:'json',
		success:function(json_data){
			

			
            //印出insert表單
			show_ins='<div id="left"><table><tr><th colspan="8">新資料已寫入</th></tr><tr><th>日期</th><th>時間</th><th>主場隊伍</th><th>客場隊伍</th><th>主場賠率</th><th>平局賠率</th><th>客場賠率</th><th>賭注數</th></tr>';
			$.each(json_data['ins'],function(i,n){
				 $.each(n,function(i1,n1){
					 // console.log(n1['time']);
					show_ins+='<tr><td>'+i+'</td><td>'+n1['time']+'</td><td>'+n1['teamA']+'</td><td>'+n1['teamB']+'</td><td>'+n1['odds_home']+'</td><td>'+n1['odds_draw']+'</td><td>'+n1['odds_away']+'</td><td>'+n1['bet']+'</td></tr>';
					// $.each(n1,function(i2,n2){
						// console.log(n2['time']);
					// });
				}); 
				
			});  
			show_ins+='</table></div>';   
			// $('#Body').empty();  //每次都將之前印的表單清除，避免表格重複印出
			// $('#Body').append(show_ins);
			
			
			
			//印出update表單
			show_upd='<div id="right"><table><tr><th colspan="8">資料已更新</th></tr><tr><th>日期</th><th>時間</th><th>主場隊伍</th><th>客場隊伍</th><th>主場賠率</th><th>平局賠率</th><th>客場賠率</th><th>賭注數</th></tr>';
			$.each(json_data['upd'],function(i,n){
				 $.each(n,function(i1,n1){
					 // console.log(n1['time']);
					show_upd+='<tr><td>'+i+'</td><td>'+n1['time']+'</td><td>'+n1['teamA']+'</td><td>'+n1['teamB']+'</td><td>'+n1['odds_home']+'</td><td>'+n1['odds_draw']+'</td><td>'+n1['odds_away']+'</td><td>'+n1['bet']+'</td></tr>';
					// $.each(n1,function(i2,n2){
						// console.log(n2['time']);
					// });
				}); 
				
			});  
			show_upd+='</table></div>';   
			$('#Body').empty();  //每次都將之前印的表單清除，避免表格重複印出
			$('#Body').append(show_upd);
            $('#Body').append(show_ins);
		}, 
		error:function(){
			alert('error!!!');
		}
	});
}

    //載入頁面時執行
$(function(){
    $.ajax({
        url:'qry.php',
        data:$('#loadpage').serialize(),
        type:'POST',
        dataType:'json',
        success:function(json_data){
            
            //印出完整資料庫表單
     /*        show='<div style="width:1200px;margin:auto">';
            $.each(json_data,function(i,n){
                show+='<table class="but"><tr><th colspan="7" class="toggle">'+i+'</th></tr>';
                show+='<table class="act"><tr><th>時間</th><th>主場隊伍</th><th>客場隊伍</th><th>主場賠率</th><th>平手賠率</th><th>客場賠率</th><th>賭注數</th></r>';
                $.each(n,function(i1,n1){
                    show+='<tr><td>'+n1['time']+'</td><td>'+n1['teamA']+'</td><td>'+n1['teamB']+'</td><td>'+n1['odds_home']+'</td><td>'+n1['odds_draw']+'</td><td>'+n1['odds_away']+'</td><td>'+n1['bet']+'</td></tr>';
                
                // alert(n1['teamA']+n1['teamB']);
                // console.log(n1['teamA']+n1['teamB']);
                // document.getElementById('info').innerHTML = '<table><tr><td>'+n1['teamA'];
                });
                show+='</table>';
            }); 
            
            show+='</table></div>';   */ 
			
			//印出表單
			show_data(json_data);
			
            $('#Body').empty();  //每次都將之前印的表單清除，避免表格重複印出
            $('#Body').append(show);
            
            //依日期縮放表單
           // $(document).ready(function(){
                // $(".but").on("click",function(){
                    // $(this).next('.act').toggle();     
                    
                // });
            // });

            //表格可依照日期收起欄位
            $(document).ready(function(){
                var i=1;
                $(".but").on("click",function(){
                    
                    var sub_str=$(this).text().substr(0,10);
                    // var str2=substr(str,0,4);
                    if(i==1){
                        $(this).next('.act').hide(); 
                        $(this).find('.toggle').text(sub_str+' ▼');
                        i-=1;
                    }
                    else{
                        $(this).next('.act').show();
                        $(this).find('.toggle').text(sub_str);
                        i+=1;
                    }
                        
                    
                });
            });

            
        },
            error:function(){
                alert('error');
            }
        
    }); 
});

        
 
//滑鼠點擊input框的時候清除其內容
$(document).ready(function(){
	$('input:text').on("click",function(){
		$(this).val('');
	});
});

     
        
</script>
<style>

    
    h1{
        text-align: center;
        border:1px;
    }
    table { 
        float:left;
        border:1px solid #000; 
        font-family: 微軟正黑體; 
        font-size:16px; 
        width:100%;
        border:1px solid #000;
        text-align:center;
        border-collapse:collapse;
        
    } 
    th { 
      background-color: #009FCC;
      padding:10px;
      border:1px solid #000;
      width:50px;
      color:#fff;
    } 
    td { 
        border:1px solid #000;
        padding:5px;
        width:50px;
        height:50px;
    } 
    
    #Header{
        width:800px;
        height:200px;
        text-align:center;
        line-height:80px;
        font-size:15px;
        color:#000000;
        font-weight:bold;
        background-color:#f9c81e;
        margin: auto;
    }
    
    #body{
        width: 90%;
        height:80%;
        text-align:center;
        line-height:280px;
        font-size:15px;
        color:#f9c81e;
        font-weight:bold;
        margin: auto;
        
    }
    
    #Right{
        width: 50%;
        height:80%;
        text-align:center;
        line-height:280px;
        font-size:15px;
        color:#f9c81e;
        font-weight:bold;
        
        float:right;
        
    }
    
    #Left{
        width: 50%;
        height:80%;
        text-align:center;
        line-height:280px;
        font-size:15px;
        color:#f9c81e;
        font-weight:bold;
       
        float:left;
    }
    
    #search{
        width: 50%;
        height:80%;
        margin: auto;
        
    }
    
</style>
</head>

</head>


<body>
	
	<div id="Header" style="line-height:40px">
	<form id='search'>
		日期：<input style="line-height:26px" type='text' name='date1'> ~ <input style="line-height:26px" type='text' name='date2'><br>
		主隊：<input style="line-height:26px" type='text' name='hometeam'><br>
		客隊：<input style="line-height:26px" type='text' name='awayteam'><br> 
		<input style="line-height:26px" type='button' value='搜尋' onclick='Search()'>  
	</form>
    
    <form id='update'>
		<input style="line-height:26px" type='button' value='更新資料' onclick='Update()'>
	</form>
	</div>
	
    
    <div id='Body'>
        
    </div>


	
	<form id='loadpage'>
		<input  type="hidden" name='newpage' value='newpage' >
	</form>
	

</body>
</html>

