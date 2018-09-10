<?php
    $connection = new PDO('mysql:host=localhost;dbname=shop;charset=utf8', 'root', 'passwords');
    $statement = $connection->query('select * from goods order by price desc');

    // echo '446546545646'
    // while($row=mysqli_fetch_array($result,MYSQLI_ASSOC)){
    //     $data[$row['']
    // }

    // foreach($statement as $row){
    //     echo $row['price'];
    // }

    // echo 'kkkk';
    // $postdata=file_get_contents('php://input','r')
    $data='';

    while($row = $statement -> fetch(PDO::FETCH_OBJ)){
        $data.=','.json_encode($row,JSON_UNESCAPED_UNICODE);
    }

    echo '['.substr($data,1).']';
?>