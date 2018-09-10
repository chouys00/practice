<?php

$data=array();
$data1=array();
$data2=array();
echo '<div>';
if($_POST['act']=='qry'){  //當POST資料來自 qry.php時
//搜尋及初始頁面
    //將接收的字串資料還原成陣列
	
	if($_POST['qrydata']==''){  //若搜尋回傳沒有結果
		$today = 'y';
		$run = 'document.getElementById("yestoday").submit();';  
	}else{
		$qry=explode('@',substr($_POST['qrydata'],1));
		$count=count($qry);
		for($i=0;$i<$count;$i++){
			$qrydata=explode(',',$qry[$i]);
			$data[$qrydata[0]][$i]['time']=$qrydata[2];
			$data[$qrydata[0]][$i]['record']=$qrydata[1];
			$data[$qrydata[0]][$i]['teamA']=$qrydata[3];
			$data[$qrydata[0]][$i]['teamB']=$qrydata[4];
			$data[$qrydata[0]][$i]['odds_home']=$qrydata[5];
			$data[$qrydata[0]][$i]['odds_draw']=$qrydata[6];
			$data[$qrydata[0]][$i]['odds_away']=$qrydata[7];
			$data[$qrydata[0]][$i]['bet']=$qrydata[8];
		}
    
    //輸出成表格
		$show='<div style="width:80%;hight:100%;float:right;">';
		foreach($data as $k =>$v){
			$show.="<table class='but' ><tr><th colspan='7'>".$k."</th></tr>
			<table class='act'><tr><th>時間</th>
			<th>主場隊伍</th>
			<th>客場隊伍</th>
			<th>主場</th>
			<th>平手</th>
			<th>客場</th>
			<th>投注</th></tr>";
			foreach($v as $k2 => $v2){
			$show .=  "<tr>".
				'<td>'.$data[$k][$k2]['time'].'</td>'.
				'<td>'.$data[$k][$k2]['teamA'].'</td>'.
				'<td>'.$data[$k][$k2]['teamB'].'</td>'.
				'<td>'.$data[$k][$k2]['odds_home'].'</td>'.
				'<td>'.$data[$k][$k2]['odds_draw'].'</td>'.
				'<td>'.$data[$k][$k2]['odds_away'].'</td>'.
				'<td>'.$data[$k][$k2]['bet'].'</td></tr>';	
			} 
			$show.='</table></table>';
		}
		$show.='</div>';
		echo $show;  
	}

}else if($_POST['act']=='anz'){      //當POST資料來自anz.php時
	//寫入
    //將接收的字串資料還原成陣列
	$anz_ins=explode('@',$_POST['anz_ins']);
 	$count=count($anz_ins);
	for($i=1;$i<$count;$i++){
		
		$ins_data=explode(',',$anz_ins[$i]);
		// echo $qrydata[1];
		
		$data1[$i]['date']=$ins_data[0];
		$data1[$i]['time']=$ins_data[1];
		$data1[$i]['teamA']=$ins_data[2];
		$data1[$i]['teamB']=$ins_data[3];
		$data1[$i]['odds_home']=$ins_data[4];
		$data1[$i]['odds_draw']=$ins_data[5];
		$data1[$i]['odds_away']=$ins_data[6];
		$data1[$i]['bet']=$ins_data[7];
	}	 	 
	 
     //輸出'寫入表格'
	$show_ins='<div style="width:80%;hight:100%;float:right;">';
	$show_ins.="<table><tr><h1><th colspan='7'>".'寫入資料'."</th></h1></tr></table>
		<table><tr><th>日期</th>
		<th>時間</th>
		<th>主場隊伍</th>
		<th>客場隊伍</th>
		<th>主場</th>
		<th>平手</th>
		<th>客場</th>
		<th>投注</th></tr></table>";
		  foreach($data1 as $k =>$v){
			 $show_ins.='<table><tr>'.
			 '<td>'.$data1[$k]['date'].'</td>'.
			 '<td>'.$data1[$k]['time'].'</td>'.
			 '<td>'.$data1[$k]['teamA'].'</td>'.
			 '<td>'.$data1[$k]['teamB'].'</td>'.
			 '<td>'.$data1[$k]['odds_home'].'</td>'.
			 '<td>'.$data1[$k]['odds_draw'].'</td>'.
			 '<td>'.$data1[$k]['odds_away'].'</td>'.
			 '<td>'.$data1[$k]['bet'].'</td></tr></table>'; 
		  }
	
	$show_ins.='</div>';
	echo $show_ins; 
	
	//更新
    //將接收的字串資料還原成陣列
	$anz_upd=explode('@',substr($_POST['anz_upd'],1));
	
	$count=count($anz_upd);
	for($i=1;$i<$count;$i++){
		$upd_data=explode(',',$anz_upd[$i]);
		$data2[$i]['date']=$upd_data[0];
		$data2[$i]['time']=$upd_data[1];
		$data2[$i]['teamA']=$upd_data[2];
		$data2[$i]['teamB']=$upd_data[3];
		$data2[$i]['odds_home']=$upd_data[4];
		$data2[$i]['odds_draw']=$upd_data[5];
		$data2[$i]['odds_away']=$upd_data[6];
		$data2[$i]['bet']=$upd_data[7];
	}
	
    //輸出'更新'表格
	$show_upd='<div style="width:80%;hight:100%;float:right;">';
	$show_upd.="<table><tr><h1><th colspan='7'>".'更新資料'."</th></h1></tr></table>
	<table><tr><th>日期</th>
	<th>時間</th>
	<th>主場隊伍</th>
	<th>客場隊伍</th>
	<th>主場</th>
	<th>平手</th>
	<th>客場</th>
	<th>投注</th></tr></table>";
		
	foreach($data2 as $k =>$v){
		$show_upd.='<table><tr>'.
		'<td>'.$data2[$k]['date'].'</td>'.
		'<td>'.$data2[$k]['time'].'</td>'.
		'<td>'.$data2[$k]['teamA'].'</td>'.
		'<td>'.$data2[$k]['teamB'].'</td>'.
		'<td>'.$data2[$k]['odds_home'].'</td>'.
		'<td>'.$data2[$k]['odds_draw'].'</td>'.
		'<td>'.$data2[$k]['odds_away'].'</td>'.
		'<td>'.$data2[$k]['bet'].'</td></tr></table>'; 
	} 
		 
	$show_upd.='</div>';
	echo $show_upd;
}
 else{  //當沒有接收判斷一、判斷二的資料時，表示第一次進入網頁，強制submit到qry.php索取資料
	$today = 'y';
	$run = 'document.getElementById("yestoday").submit();';  
}     


?>


<html>
<head>
	<script src="jquery-3.3.1.js"></script>
    <script type="text/javascript">
		
            $(document).ready(function(){
                $('.but').click(function(){
                    $(this).next('.act').toggle();        
                });
            });
         
         
    /*     $(document).ready(function(){
			for(var i=1;i<=<?php echo $table_idx?>;i++){
			var but='#'+i;
			var act='.'+i;
			(function(but,act){
				$(but).click(function(){
					$(act).toggle('slow');
					});
				})(but,act);
			}
		});    */    

     
         
			
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

</head>


<body>
	
	<div style="width:20%;hight:100%;float:left；" valign="top">
	<form action='qry.php' method='post' >
		日期：<input type='text' name='date1'> ~ <input type='text' name='date2'><br>
		主隊：<input type='text' name='hometeam'><br>
		客隊：<input type='text' name='awayteam'><br> 
		<input type='submit' name='act1' value='搜尋'>  
	</form>
	
	<form action='anz.php' method='post'>
		<input type='submit' name='act2' value='更新資料'>
	</form>
	
	<form action="qry.php" id='yestoday' method='post'>
		<input type="hidden" name="yestoday" value="<?php echo $today;?>">
		<input type='submit' style="display:none;" >
	</form>
	
	<h1></h1>
	
	</div>
</body>
</html>
<script>
	<?php echo $run; ?>
</script>