var socket = io.connect('http://localhost:8001');

Vue.component('login_page',{
    template:'#loginPage',
    props:{
        pageControl:Boolean
    },
    methods:{
        login(){
            // console.log('9487');
            socket.emit('login',{
                
                'id':document.getElementById('id_login').value,
                'code':document.getElementById('code_login').value
            });
        },
    }
})

Vue.component('register_page',{
    template:'#registerPage',
    props:{
        pageControl:Boolean
    },
    methods:{
        register(){
            // console.log('9999999');
            socket.emit('register',{
                'id':document.getElementById('id_register').value,
                'code':document.getElementById('code_register').value
            });
        },
        checkID_fun(){
            // console.log('yoyoyoyoyoyoyoyoyoyo');
            socket.emit('checkID',document.getElementById('id_register').value)
        } 
    }
})

Vue.component('game_page',{
    template:'#gamePage',
    props:{
        pageControl:Boolean,
        id:String,
        money:Number,
        card1:String,
        card2:String,
        result:String
    },
    data(){
        return{
            show:'0',
            bet:300,
            scoreActive:false,
            buttonAble:false,
            inputWrite:false,
            isDisable:false,
            brandActive1:false,
            brandActive2:false,
        }
    },
    methods:{
        getcard() {
            var self=this; //setimeout 裡無法接呼叫this, var一個變數代替即可
            console.log(vm.money);
            if(this.bet<100){
                alert('下注額度不可低於100元');
            }
            else if ((this.$root.money - this.bet) >= 0) {
                this.show = '1';
                this.inputWrite=!this.inputWrite;  //發牌鍵按下後就不能更改下注金額，直到一局結束
                this.isDisable =!this.isDisable;   //發牌鍵在按下之後就無法再次點擊，直到一局結束
                setTimeout(function () {
                    self.buttonAble=true;  //點擊發牌鍵後1.5秒 (約動畫時間) 才可以翻牌
                    // console.log(vm.buttonAble);
                }, 1500);
                socket.emit('getcard',{ 
                    'money':document.getElementById('money').innerHTML,
                    'bet':document.getElementById('money_input').value,
                    'id':vm.id
                });
            } else {
                alert('籌碼不夠了');
            }
        },
        opencard1() {
            this.brandActive1 = !this.brandActive1;   //翻開牌2
            var self=this;  //setimeout 裡無法接呼叫this, var一個變數代替即可

            //若兩張牌都已翻開，alert結果，並重置牌桌
            if((this.brandActive1==true)&&(this.brandActive2==true)){
                setTimeout(function(){
                    self.scoreActive=!self.scoreActive;
                    if (self.$root.result == 'win') {
                        alert('你贏了');
                        vm.money = vm.money + self.bet;  //計算剩餘籌碼  (籌碼+-賭金))
                        // console.log('+++++');
                    } else {
                        // console.log('-----');
                        alert('你輸了');
                        vm.money = vm.money - self.bet;  //計算剩餘籌碼  (籌碼+-賭金))
                    }
                    setTimeout(function () {
                        // this.show = '0';

                        //重置牌桌
                        self.scoreActive=!self.scoreActive;
                        self.buttonAble=!self.buttonAble;
                        self.inputWrite=!self.inputWrite;
                        self.isDisable = false;
                        self.show='0';
                        vm.card1 = '52';
                        vm.card2 = '52';
                        self.brandActive1 = !self.brandActive1;
                        self.brandActive2 = !self.brandActive2;
                    }, 150);
                },1500);
                
            }
        },
        opencard2() {
            this.brandActive2 = !this.brandActive2;  //翻開牌1
            var self=this;  //setimeout 裡無法接呼叫this, var一個變數代替即可

            //若兩張牌都已翻開，alert結果，並重置牌桌
            if((this.brandActive1==true)&&(this.brandActive2==true)){
                setTimeout(function(){
                    self.scoreActive=!self.scoreActive;
                    if (self.$root.result == 'win') {
                        alert('你贏了');
                        vm.money = vm.money + self.bet;  //計算剩餘籌碼  (籌碼+-賭金))
                        // console.log(vm.money);
                        // console.log(vm.bet);
            
                        // console.log('+++++');
                    } else {
                        // console.log('-----');
                        alert('你輸了');
                        vm.money = vm.money - self.bet;  //計算剩餘籌碼  (籌碼+-賭金))
                    }
                    setTimeout(function () {
                        // this.show = '0';
                       
                        //重置牌桌
                        self.scoreActive=!self.scoreActive;
                        self.buttonAble=!self.buttonAble;
                        self.inputWrite=!self.inputWrite;
                        self.isDisable =!self.isDisable;
                        self.show='0';
                        vm.card1 = '52';
                        vm.card2 = '52';
                        self.brandActive2 = !self.brandActive2;
                        self.brandActive1 = !self.brandActive1;
                    }, 150);
                },1500);
            }
        },
        logout(){
            vm.pageControl='0';
            alert('滾蛋掰掰');
            this.scoreActive=false;
            this.buttonAble=false;
            this.inputWrite=false;
            this.isDisable = false;
            this.show='0';
            vm.card1 = '52';
            vm.card2 = '52';
            this.brandActive1 = false;
            this.brandActive2 = false;
        },
       
    },
    //將card值轉換成img路徑
    computed: {
        imgUrl2() {
            return 'img/' + vm.card2 + '.png'
        },
        imgUrl1() {
            return 'img/' + vm.card1 + '.png'
        },
        score(){
            if(vm.result=='win'){
                return '+'+this.bet;
            }
            else{
                return '-'+this.bet;
            }
        }
    }
})

var vm = new Vue({
    el:'#all',
    data:{
        checkID:'',
        id:'',
        money:0,
        pageControl:'0',  //控制頁面
        card1:'52',
        card2:'52',
        result:'',
    },
    methods:{
        backtologinpage(){
            this.pageControl='0';
        },
        toregisterpage(){
            this.pageControl='1';
        }
   
    }
    

});

//接收卡牌及勝負資料
socket.on('postcard', function (data) {
    // console.log(data);
    vm.card1 = data['card1'];
    vm.card2 = data['card2'];
    vm.result = data['result'];

});

//接收登入回傳驗證
socket.on('login_back',function(data){
    console.log(data);
    if(data.length==0){
        alert('帳密輸入錯誤');
    }else if(data[0].newmember==true){
        // vm_login.pageControl=!vm_login.pageControl;
        vm.pageControl='2';
        alert('註冊成功，開始遊戲！！')
        vm.money=data[0].money;
        vm.id=data[0].id;
    }
    else{
        vm.pageControl='2';
        // vm.pageControl=!vm.pageControl;
        alert('歡迎回來，'+data[0].id);
        vm.money=data[0].money;
        vm.id=data[0].id;
    } 

});  






