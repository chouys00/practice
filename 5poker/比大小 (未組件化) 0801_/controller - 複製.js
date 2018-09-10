var socket = io.connect('http://localhost:8001');



var vm = new Vue({
    el: '#game',
    data: {
        card1: '52',
        card2: '52',
        result: '',
        money: 5000,
        bet: 300,
        show: '0',
        isDisable: false,    //按鈕可否被點擊
        brandActive1: false,   //圖片1的翻牌動畫啟用
        brandActive2: false,    //圖片2的翻牌動畫啟用
        buttonAble:false,      //圖片可否被點擊
        inputWrite:false,     //input是否可更改數字
        scoreActive:false,
        pageControl:false,
        id:''
    },
    methods: {
        getcard() {
            if(this.bet<100){
                alert('下注額度不可低於100元');
            }
            else if ((this.money - this.bet) >= 0) {
                this.show = '1';
                this.inputWrite=!this.inputWrite;  //發牌鍵按下後就不能更改下注金額，直到一局結束
                this.isDisable =!this.isDisable;   //發牌鍵在按下之後就無法再次點擊，直到一局結束
                setTimeout(function () {
                    vm.buttonAble=true;  //點擊發牌鍵後1.5秒 (約動畫時間) 才可以翻牌
                    
                }, 1500);
                socket.emit('getcard',{ 
                    'money':document.getElementById('money').innerHTML,
                    'bet':document.getElementById('money_input').value,
                    'id':this.id
                });

            } else {
                alert('籌碼不夠了');
            }
        },
        opencard1() {

            this.brandActive1 = !this.brandActive1;
            if((this.brandActive1==true)&&(this.brandActive2==true)){
                


                setTimeout(function(){
                    vm.scoreActive=!vm.scoreActive;
                    if (vm.result == 'win') {
                        alert('你贏了');
                        vm.money = vm.money + vm.bet;
            
                        // console.log('+++++');
                    } else {
                        // console.log('-----');
                        alert('你輸了');
                        vm.money = vm.money - vm.bet;
                    }
                    setTimeout(function () {
                        // this.show = '0';
                       

                        //牌桌初始設置
                        
                        vm.scoreActive=!vm.scoreActive;
                        vm.buttonAble=!vm.buttonAble;
                        vm.inputWrite=!vm.inputWrite;
                        vm.isDisable = false;
                        vm.show='0';
                        vm.card1 = '52';
                        vm.card2 = '52';
                        vm.brandActive1 = !vm.brandActive1;
                        vm.brandActive2 = !vm.brandActive2;
                    }, 150);
                },1500);
                
            }
        },
        opencard2() {
            this.brandActive2 = !this.brandActive2;

            //若兩張牌都已翻開，alert結果，並重置牌桌
            if((this.brandActive1==true)&&(this.brandActive2==true)){
                setTimeout(function(){
                    vm.scoreActive=!vm.scoreActive;
                    if (vm.result == 'win') {
                        alert('你贏了');
                        vm.money = vm.money + vm.bet;
            
                        // console.log('+++++');
                    } else {
                        // console.log('-----');
                        alert('你輸了');
                        vm.money = vm.money - vm.bet;
                    }
                    setTimeout(function () {
                        // this.show = '0';
                       
                        
                        //牌桌初始設置
                        vm.scoreActive=!vm.scoreActive;
                        vm.buttonAble=!vm.buttonAble;
                        vm.inputWrite=!vm.inputWrite;
                        vm.isDisable =!vm.isDisable;
                        vm.show='0';
                        vm.card1 = '52';
                        vm.card2 = '52';
                        vm.brandActive2 = !vm.brandActive2;
                        vm.brandActive1 = !vm.brandActive1;
                    }, 150);
                    
                },1500);

                
                // console.log('kkkkkkkkkkkkkkkkkkk');
                
            }
        },
        logout(){
            this.pageControl=false;
            vm_login.pageControl=true;
            alert('滾蛋掰掰');
        }
    },
    //將card值轉換成img路徑
    computed: {
        imgUrl2() {
            return 'img/' + this.card2 + '.png'
        },
        imgUrl1() {
            return 'img/' + this.card1 + '.png'
        },
        score(){
            
            if(this.result=='win'){
                return '+'+this.bet;
            }
            else{
                return '-'+this.bet;
            }
            
        }


    }
});


var vm_login = new Vue({
    el:'#loginPage',
    data:{
        pageControl:true,
        show:'0',

    },
    methods:{
        login(){
            socket.emit('login',{
                'id':document.getElementById('id_login').value,
                'code':document.getElementById('code_login').value
            });
        },
        toregisterPage(){
            this.show='1';
        },
        register(){
            // console.log('9999999');
            socket.emit('register',{
                'id':document.getElementById('id_register').value,
                'code':document.getElementById('code_register').value
            });
        },
        backtologinPage(){
            this.show='0';
        }
    }

});



socket.on('postcard', function (data) {
    // console.log(data);
    vm.card1 = data['card1'];
    vm.card2 = data['card2'];
    vm.result = data['result'];

});

socket.on('login_back',function(data){
    console.log(data);
    if(data.length==0){
        alert('帳密輸入錯誤');
    }else if(data[0].newmember==true){
        vm_login.pageControl=!vm_login.pageControl;
        vm.pageControl=!vm.pageControl;
        alert('註冊成功，開始遊戲！！')
        vm.money=data[0].money;
        vm.id=data[0].id;
    }
    else{
        vm_login.pageControl=!vm_login.pageControl;
        vm.pageControl=!vm.pageControl;
        alert('歡迎回來，'+data[0].id);
        vm.money=data[0].money;
        vm.id=data[0].id;
    }


    /* if(data=='Y'){
        vm_login.pageControl=!vm_login.pageControl;
        vm.pageControl=!vm.pageControl;
        alert('歡迎回來');
    }
    else if(data=='N'){
        alert('帳密錯誤');
    } */
});






