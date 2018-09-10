<?php
$servername = 'localhost';
$username = 'root';
$password = 'passwords';
$dbname ='sports';
$con = mysqli_connect($servername, $username, $password,$dbname);
$today=date('Y-m-d');

//修正資料庫亂碼問題
mysqli_query($con,'SET NAMES UTF8');

//搜尋
if($_POST['yestoday']=='y'){
	$sql='select * from schedule where date>="'.$today.'"';
}else{
	$sql='select * from schedule where';
	$hometeam=$_POST['hometeam'];
	$awayteam=$_POST['awayteam'];
	$date1=$_POST['date1'];
	$date2=$_POST['date2'];

	
	if($date1 && $date2)  //當date1和date2皆不為空
		$sql.=' date between"'.$date1.'"and"'.$date2.'"';
	elseif($date1 or $date2)   //當date1和date2其中一個為空
		$sql.=' date="'.$date1.$date2.'"';
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
	$sql=$sql.'order by date desc;'; 
}


$data='';
// mysqli_query($con,$sql))
$result=mysqli_query($con,$sql);

while($row=mysqli_fetch_array($result,MYSQLI_ASSOC)){
$data.='@'.implode(',',$row);
}	


?>


<html>
<head>
	<script src="jquery-3.3.1.js"></script>
    <script type="text/javascript">

	</script>
    <style>
        h1{
            text-align: center;
            border:1px;
        }
		table { 
			border:1px solid #000; 
			font-family: 微軟正黑體; 
			font-size:16px; 
			width:1000px;
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
	</style>
</head>

<body>
	<form action='index.php' method='post' id='qry_submit' >
	<input type="hidden" name='qrydata' value='<?php echo $data; ?>'>
    <input type="hidden" name='act' value='qry'>
    <input type="submit" name='qry_submit' >
	</form>
	
	
	<script>
		document.getElementById('qry_submit').submit();
	</script>
	
</body>
</html>