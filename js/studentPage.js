function MyPage(pageIndex,size,count){
    this.pageIndex = pageIndex;
    this.size = size;
    this.count = count;
    var prevActiveNode,nextActiveNode;
  
    var page = {
        pageContentNode : document.getElementsByClassName("pageContent")[0],    //分页最外层元素
        prevBtnNode : document.getElementsByClassName("pageBtn")[0],     //上一页按钮
        nextBtnNode : document.getElementsByClassName("pageBtn")[1],     //下一页按钮
        nowIndexNode : document.getElementsByClassName("nowIndex")[0],   //当前页面元素
        totalPageNode : document.getElementsByClassName("totalPage")[0], //总页数元素
        pageListNode : document.getElementsByClassName("pageIndexList")[0],     //页码集合
        selectNode : document.getElementsByClassName("selectList")[0],           //下拉框元素
        goPageNode : document.getElementsByClassName("gotoPageIndex")[0]        //跳转某一页
        
    };
    //页面初始化
    function init(){
        renderPage(pageIndex,size);
        addEvent();
        var prevBtn = getBtn()[0];
        var nextBtn = getBtn()[1];
        dirBtn(prevBtn,nextBtn);
    }
    //渲染分页元素内容
    function renderPage(pageIndex,size){
        var dataTotal = this.count % size == 0 ? this.count / size : Math.ceil(this.count / size); //总共的页数
        
        if (pageIndex < dataTotal) {
            page.nextBtnNode.classList.add("nextPage");
            
        } else {
            page.nextBtnNode.classList.remove("nextPage");
        }
        if (pageIndex > 1) {
            page.prevBtnNode.classList.add("prevPage");
            
        } else {
            page.prevBtnNode.classList.remove("prevPage");
        }
        renderUl(pageIndex,dataTotal);
        changeIndex(pageIndex,dataTotal);
        page.nowIndexNode.innerHTML = pageIndex;
        page.totalPageNode.innerHTML = dataTotal;
        for (var i = 0; i < page.selectNode.options.length; i++) {
            page.selectNode.options[i].selected = false;
            if (page.selectNode.options[i].value == size) {
                page.selectNode.options[i].selected = true;
            }
        }
                
    }
    //事件绑定
    function addEvent(){
         //下拉框变化
        page.selectNode.addEventListener("change",changeSel,false);
        //跳转到某一页
        page.goPageNode.oninput = debouce(function(){
            var nowTotal = parseInt(page.totalPageNode.innerHTML);
            if(this.value <= nowTotal && this.value > 0){
                gotoPage(this.value);
            }else{
                if(this.value){
                    alert("输入的页码有误！请重新输入！");
                    page.goPageNode.value = "";
                }
                return;
            }
        },2000);
         //点击页码
         page.pageListNode.addEventListener('click', function(e){
            var e = e || window.event;
            var index = e.target.getAttribute("data-index");
            var optionIndex = page.selectNode.selectedIndex;
            var _option = page.selectNode.options[optionIndex];
            var pageObj = {"page":index,"size":_option.value};
            var dataTotal = count % parseInt(_option.value) == 0 ? count / parseInt(_option.value) : Math.ceil(count / parseInt(_option.value)); //总共的页数
            renderDataByPage(pageObj);
            changeIndex(index,dataTotal);
        }, false);
        
        
    }
    
    //点击向前向后按钮时，分页渲染
    function changePage(dir,nowIndex,totalPage){
        page.goPageNode.value = "";
        var optionIndex = page.selectNode.selectedIndex;
        var _option = page.selectNode.options[optionIndex];
        if(dir == "goNext"){    //下一页按钮
            if(nowIndex != totalPage){
                if(nowIndex % 5 == 0){
                    nowIndex ++;
                    renderPage(nowIndex,size);
                }else{
                    nowIndex ++;
                    var pageObj = {"page":nowIndex,"size":_option.value};
                    renderDataByPage(pageObj);
                    changeIndex(nowIndex,totalPage);
                    
                }
            }
        }else if(dir == "goPrev"){
            if(nowIndex != 1){
                if(nowIndex % 5 == 1){
                    nowIndex--;
                    renderPage(nowIndex, size);
                }else{
                    nowIndex --;
                    var pageObj = {"page":nowIndex,"size":_option.value};
                    renderDataByPage(pageObj);
                    changeIndex(nowIndex,totalPage);
                   
                }
                
                
                
            }
        }
    }

    //跳转到某一页
    function gotoPage(pageIndex){
        var optionIndex = page.selectNode.selectedIndex;
        var _option = page.selectNode.options[optionIndex];
        var pageObj = {"page":pageIndex,"size":_option.value};
        size = _option.value;
        renderDataByPage(pageObj);
        renderPage(pageIndex,size);
        page.goPageNode.value = "";
    }

    //防抖
    function debouce(handler,delay){
        var timer = null;
        return function(){
            clearTimeout(timer);
            var _self = this,_arg = arguments;
            timer = setTimeout(function(){
                handler.apply(_self,_arg)
            },delay)
        }
    }
    
    //下拉框改变时，页面重新渲染
    function changeSel(){
        var optionIndex = this.selectedIndex;
        var _option = this.options[optionIndex];
        for(var i = 0; i < this.options.length; i++){
            this.options[i].selected = false;
        }
        _option.selected = true;
        renderDataByPage({"page":1,"size":parseInt(_option.value)});
        renderPage(1,parseInt(_option.value));
        page.goPageNode.value = "";
    }

    //改变页码样式
    function changeIndex(pageIndex, dataTotal){
        var liArr = page.pageListNode.getElementsByTagName("li");
        for (var i = 0; i < liArr.length; i++) {
            (function(j){
                var _now = liArr[j].getAttribute("data-index");
                liArr[j].className = "";
                if (_now == pageIndex) {
                    liArr[j].className = "active";
                }
            }(i))
        }
        page.nowIndexNode.innerHTML = pageIndex;
        if (pageIndex < dataTotal) {
            page.nextBtnNode.classList.add("nextPage");
            
        } else {
            page.nextBtnNode.classList.remove("nextPage");
        }
        if (pageIndex > 1) {
            page.prevBtnNode.classList.add("prevPage");
            
        } else {
            page.prevBtnNode.classList.remove("prevPage");
        }
    }

    //根据每次传入的页码数，判断是否重新渲染ul内容
    function renderUl(nowIndex,totalPage){
        var ulStr = "";
        if(nowIndex <= 5){
            nowIndex = 1;
        }else{
            nowIndex = parseInt(nowIndex / 5) * 5 + 1;
        }
        var liLen = (nowIndex + 5) > totalPage ? (totalPage - nowIndex + 1) : 5;
        for(var i = nowIndex; i < (liLen + nowIndex ); i++){
            var li = '<li data-index=' + i + '>' + i + '</li>';
            ulStr += li;
        }
        page.pageListNode.innerHTML = ulStr;
        
    }

    //获取前进或后退按钮 
    function getBtn(){
        prevActiveNode = page.prevBtnNode;
        nextActiveNode = page.nextBtnNode;
        return [prevActiveNode,nextActiveNode];
    }
    //按钮事件调用
    function dirBtn(prevBtn,nextBtn){
        if(nextBtn){
            btnEvent(nextBtn,"goNext");
        }
        if(prevBtn){
            btnEvent(prevBtn,"goPrev");
        }
    }
    //按钮事件绑定
    function btnEvent(dom,dirStr){
        dom.addEventListener("click", function () {
            if(dirStr == "goNext"){
                page.prevBtnNode.classList.add("prevPage");
            }
            var nowLiIndex = page.pageListNode.getElementsByClassName("active")[0].getAttribute("data-index");
            nowLiIndex = parseInt(nowLiIndex);
            var optionIndex = page.selectNode.selectedIndex;
            var _option = page.selectNode.options[optionIndex];
            var nowSize = parseInt(_option.value);
            var pageTotal = count % nowSize == 0 ? count / nowSize : Math.ceil(count / nowSize); //总共的页数
            changePage(dirStr, nowLiIndex, pageTotal);
           
        }, false);
    }
        
   init();
}