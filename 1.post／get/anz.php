<?php

//擷取檔案編碼
// $myfile=file_get_contents("sports.html");

//擷取網頁編碼
$ch=curl_init();
curl_setopt($ch,CURLOPT_URL, 'http://sports.williamhill.com/bet/zh-cn');
curl_setopt($ch,CURLOPT_HEADER,false);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
$myfile=curl_exec($ch);
curl_close($ch); 

// 建立資料庫連結
$servername = 'localhost';
$username = 'root';
$password = 'passwords';
$dbname ='sports';
$con = mysqli_connect($servername, $username, $password,$dbname);
$today=date('Y-m-d');

//修正資料庫亂碼問題
mysqli_query($con,'SET NAMES UTF8');

/* // 檢查與資料庫的連結
if (!$con) {
    die("Connection failed:".mysqli_connect_error());
}
echo "connected successfully"; */


$data=array();
$idx=0;   //每日資料計數
$ch_d='0';   //前一筆日期資料
$month=array(      //月份判斷索引陣列
	'一月'=>'01',
	'二月'=>'02',
	'三月'=>'03',
	'四月'=>'04',
	'五月'=>'05',
	'六月'=>'06',
	'七月'=>'07',
	'八月'=>'08',
	'九月'=>'09',
	'十月'=>'10',
	'十一月'=>'11',
	'十二月'=>'12');
	
$myfile=str_replace(array("\r","\n","\t","\s"), '', $myfile);   //去除換行符號
preg_match_all('/<table(.*?)<\/table>/',$myfile,$table);  //preg_match_all抓出表格資料
preg_match_all('/<tr(.*?)<\/tr>/',$table[1][1],$tr);   //preg_match_all抓出表格中的列


//跑迴圈針對各列搜尋，並將資料塞入$data索引陣列
$trcount=count($tr[1]);  //先計算count結果再丟入迴圈，避免程序重複運算
for($i=1;$i<$trcount;$i++){
    
    //http://seanphpbook.blogspot.com/2010/08/php-regular-expressions.html  正則表示法
	preg_match_all('/<td(.*?)<\/td>/',$tr[1][$i],$td);   
	
	//年月日資料
	//$rightdate → 年月日資料 
    preg_match_all('/br:dd_MMM:br:[0-9]+(.*?)<\/span>/',$td[1][0],$md);  //preg_match搜尋日期月份資料
	if(!empty($md[1])){
		$m=substr($md[1][0],5,6);
		$rightdate = date('Y').'-'.$month[$m].'-'.substr($md[1][0],2,2);    //將日期月份組合成正確格式
	}else{
		$rightdate=$today;   //沒有搜尋到資料，則抓取當天年月日
	}
	
	//時間      
	//$t[1][0] → 時間
	preg_match_all('/br:HH:mm_C:br:[0-9]+\">(.*?)\s+UK<\/span>/',$td[1][1],$t); //preg_match搜尋時間資料
    //沒有搜尋到資料，則塞入空字串
	if(empty($t[1])){
		$t[1][0]='';
	}
	 
	preg_match_all('/leftPad\">(.*?)UK<\/a>/',$myfile,$d2);
	//echo $d2[1][0];
	
    //主客場隊伍   
	//$teamAB[0] → 主場隊伍
	//$teamAB[3] → 客場隊伍
	preg_match_all('/mkt_namespace\">(.*?)<\/span>/',$td[1][2],$team);  //用preg_match搜尋隊伍資料
	$teamAB=explode('&nbsp;',$team[1][0]);  //擷取的隊伍資料範例 '主隊 對 客隊'，用空白分割
	
	//主場/平手/客場 分數
	preg_match_all('/eventprice\">(.*?)<\/div>/',$td[1][4],$odds_home);  //用preg_match主場分數，$s1[1][0] → 主場分數
	preg_match_all('/eventprice\">(.*?)<\/div>/',$td[1][5],$odds_draw);  //用preg_match平手分數，$s2[1][0] → 平手分數
	preg_match_all('/eventprice\">(.*?)<\/div>/',$td[1][6],$odds_away);  //用preg_match客場分數，$s3[1][0] → 客場分數
       
	//投注數
	//$bet → 投注數
    preg_match_all('/nobr>(.*?)<\/nobr>/',$td[1][7],$b);  //用preg_match搜尋投注資料
    //沒有搜尋到資料，則塞入空字串
	if(empty($b[1])){
		$bet='';
	}else{
		$bet=substr($b[1][0],2,4);
	}
	
    //當下日期與上一回日期比較，若同一天資料筆數+1，日期不同則資料計數刷新
    if($ch_d!=$rightdate){   
         $idx=0;            
    }else{
         $idx++;
    }  
    $ch_d=$rightdate;   //將當下的資料筆數存入ch_d，供下一迴圈比較
   
    $data[$ch_d][$idx]['time'] = $t[1][0];    	
    $data[$ch_d][$idx]['teamA'] = $teamAB[0];   	
    $data[$ch_d][$idx]['teamB'] = $teamAB[3];   	
    $data[$ch_d][$idx]['odds_home'] = $odds_home[1][0];   	
    $data[$ch_d][$idx]['odds_draw'] = $odds_draw[1][0];   	
    $data[$ch_d][$idx]['odds_away'] = $odds_away[1][0];   	
    $data[$ch_d][$idx]['bet'] = $bet;   
	
}
unset($myfile,$table,$tr,$td);  //釋放變數資源

$ins="<div><table align='center'><tr><h1><th colspan='7'>"."新增資料</th></h1></tr></table>
		<table align='center'><tr><th>時間</th>
		<th>主場隊伍</th>
		<th>客場隊伍</th>
		<th>主場</th>
		<th>平手</th>
		<th>客場</th>
		<th>投注</th></tr></table>";
		
$ins='';
$upd='';
//foreach出雜湊資料，逐筆組成SQL insert語法
$insert='insert into schedule(date,record,time,teamA,teamB,odds_home,odds_draw,odds_away,bet)'.'values';
foreach($data as $date => $v){
    foreach($v as $record => $v2){
		
		//搜尋資料庫中 date、teamA、teamB 相符的資料
		$sql='select * from schedule where date="'.$date.'"'.'and teamA='.'"'.$v2['teamA'].'"'."and teamB=".'"'.$v2['teamB'].'";';
		$result=mysqli_query($con,$sql);  
		$newrow=mysqli_fetch_array($result,MYSQLI_ASSOC);  
        
        //確定此筆資料為全新資料後，寫入SQL insert語法 (新)
        if(empty($newrow)){       
			$fields=implode("','",$v2);   
            $insert.="('".$date."','".$record."','".$fields."')".',';   
			
			$ins_fields=implode(",",$v2);
			$ins.='@'.$date.','.$ins_fields;
            
           
		} else{
			$update='update schedule set date="'.$date.'" ,time="'.$v2['time'].'" ,record="'.$record.'" ,teamA="'.$v2['teamA'].'" ,teamB="'.$v2['teamB'].'" ,odds_home="'.$v2['odds_home'].'" ,odds_draw="'.$v2['odds_draw'].'" ,odds_away="'.$v2['odds_away'].'" ,bet="'.$v2['bet'].'"';
			$update.='where date="'.$date.'"'.'and teamA='.'"'.$v2['teamA'].'"'."and teamB=".'"'.$v2['teamB'].'";';
			
			$upd_fields=implode(",",$v2);
			$upd.='@'.$date.','.$upd_fields;

		}
    }	
}


//用上述SQL字串尾判斷是否有需要執行更新  (如果SQL語法是 values結尾的的話)
if(substr($insert,-6)!='values'){
	$insert=substr($insert,0,-1).';';  //將$insert字串最後的,替換為;完成SQl語法
	
	if(mysqli_multi_query($con,$insert)){
			echo 'new records created successfully';
		}else{
			echo 'error:'.$insert.'<br>'.mysqli_error($con);
		}   
} 
?>


<html>
<head>
	<script src="jquery-3.3.1.js"></script>
    <script type="text/javascript">

	</script>
</head>

<body>
	<form action='index.php' method='post' id='anz_sumbit' >
	
	<input type="hidden" name='anz_ins' value='<?php echo $ins; ?>'>
	<input type="hidden" name='anz_upd' value='<?php echo $upd; ?>'>
    <input type="hidden" name='act' value='anz'>
    <input type="hidden" type="submit" >
	</form>
	
	<script>
		document.getElementById('anz_sumbit').submit();
	</script>
	
</body>
</html>
