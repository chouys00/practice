<?php
$servername = 'localhost';
$username = 'root';
$password = 'passwords';
$dbname ='sports';
$con = mysqli_connect($servername, $username, $password,$dbname);
$today=date('Y-m-d');


 //修正資料庫亂碼問題
mysqli_query($con,'SET NAMES UTF8');


//依$_POST的值及來源判斷是否為第一次載入頁面，是的話印出所有今天以後的資料
if(@$_POST['newpage']=='newpage'){
	$sql='select * from schedule where date>="'.$today.'"';
}else{
	
	$sql='select * from schedule where';   
    
    //用變數接收index的搜尋關鍵字
	$hometeam=$_POST['hometeam'];
	$awayteam=$_POST['awayteam'];
	$date1=$_POST['date1'];
	$date2=$_POST['date2'];
	
    
	if($date1 && $date2){     	//當date1和date2皆不為空
		$sql.=' date between"'.$date1.'"and"'.$date2.'"';
	}  
	else if($date1 or $date2){   //當date1和date2其中一個為空
		$sql.=' date="'.$date1.$date2.'"';
	}
	//皆為空不用動作

	if(!empty($hometeam)){   //當主隊欄位不為空時
		if(substr($sql,-5)=='where'){
			$sql.=' teamA="'.$hometeam.'"';
		}else{
			$sql.=' and teamA="'.$hometeam.'"';
		}
	}
	if(!empty($awayteam)){   //當客隊欄位不為空時
		if(substr($sql,-5)=='where'){
			$sql.=' teamB="'.$awayteam.'"';
		}else{
			$sql.=' and teamB="'.$awayteam.'"';
		}
	}	
}


$sql.='order by date desc;'; 


 // mysqli_query($con,$sql))
$result=mysqli_query($con,$sql);



// print_r($result);
while($row=mysqli_fetch_array($result,MYSQLI_ASSOC)){
	// print_r($row);
	$data[$row['date']][$row['record']]['time']=$row['time'];
	$data[$row['date']][$row['record']]['teamA']=$row['teamA'];
	$data[$row['date']][$row['record']]['teamB']=$row['teamB'];
	$data[$row['date']][$row['record']]['odds_home']=$row['odds_home'];
	$data[$row['date']][$row['record']]['odds_draw']=$row['odds_draw'];
	$data[$row['date']][$row['record']]['odds_away']=$row['odds_away'];
	$data[$row['date']][$row['record']]['bet']=$row['bet'];	
}	
// var_dump($data);

// print_r($data);
// print_r($data);

$json_data=json_encode($data,JSON_UNESCAPED_UNICODE); 

echo $json_data;

//釋放資料庫連結資源佔用的記憶體
mysqli_close($con);

