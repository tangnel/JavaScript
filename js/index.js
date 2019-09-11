var modal = document.getElementsByClassName('modal')[0];
var tableData = [];
var count;
function init(){
    bindEvent();
}
function bindEvent(){
    //菜单栏和内容区域切换
    var menuList = document.getElementById("menuList");
    menuList.addEventListener("click",changeTab,false);
    //新增学生提交事件
    var addSubmit = document.getElementById("addSubmit");
    addSubmit.addEventListener("click",function(e){
        updateStudent(e,"addStudentForm","/api/student/addStudent")
    },false);
    //页面初始化
    // renderData();
    renderDataByPage({"page":1,"size":1});
    // 表格里面的按钮添加点击事件：编辑和删除按钮
    var tbody = document.getElementById('tbody');
    tbody.addEventListener('click', tbodyClick, false);
    // 给弹出框的遮罩层添加点击事件
    var mask = document.getElementsByClassName('mask')[0];
    mask.onclick = function () {
        modal.classList.remove('show');
    }

    //编辑学生提交事件
    var editSubmit = document.getElementById("editSubmit");
    editSubmit.addEventListener("click",function(e){
        updateStudent(e,"editStudentForm","/api/student/updateStudent")
    },false);

    new MyPage(1,1,count)
}

//点击左边的菜单栏，切换右边区域内容
function changeTab(e){
    var e = e || window.event;
    var tagName = e.target.tagName;
    if(tagName != "DD"){
        return false;
    }else{
        toggleContent(e.target,"active");
        var _id = e.target.getAttribute("data-id");
        var dom = document.getElementById(_id);
        toggleContent(dom,"contentActive");
        if (_id == 'studentList') {
            // 渲染右侧表格
            // renderData();
            renderDataByPage({"page":1,"size":10});
        }
    }
}

//切换内容
function toggleContent(dom,className){
    var active = document.getElementsByClassName(className);
    for(var i = 0; i < active.length; i++){
        active[i].classList.remove(className);
    }
    dom.classList.add(className);
}

//更新学生信息
function updateStudent(e,id,url){
    e.preventDefault();
    var form = document.getElementById(id);
    var studentObj = getData(form);
    transfer(url,studentObj,function(){
        var studentListTab = document.getElementsByClassName('list')[0];
        studentListTab.click();
        form.reset();
        if (id == "editStudentForm") {
            // 遮罩层添关闭
            var mask = document.getElementsByClassName('mask')[0];
            mask.click();
        }
    })
    
}

//获取数据
function getData(form){
    // var form = document.getElementById(id);
    var name = form.name.value;
    var sex = form.sex.value;
    var sNo = form.sNo.value;
    var email = form.email.value;
    var birth = form.birth.value;
    var phone = form.phone.value;
    var address = form.address.value;
    if(!name || !sex || !sNo || !email || !birth || !phone || !address){
        alert("表单数据未填写完整，请检查！");
        return false;
    }else{
        var studentObj = {
            name: name,
            sex: sex,
            sNo: sNo,
            email: email,
            birth: birth,
            phone: phone,
            address: address
        };
        return studentObj;
    }
    
}

//转换数据
function transfer(url,obj,callback){
    if(!obj){
        obj = {};
    }
    var result = saveData('http://api.duyiedu.com' + url,Object.assign(obj,{"appkey":"tangnel_1558968879272"}));
    if(result.status == "success"){
        callback(result);
    }else{
        alert(result.msg);
    }
}

//渲染表格数据
function renderData(){
    transfer('/api/student/findAll', "", function (res) {
        var data = res.data;
        tableData = data;
        var str = "";
        data.forEach(function (item, index) {
            str += ' <tr>\
            <td>' + item.sNo +'</td>\
            <td>' + item.name + '</td> \
            <td>' + ( item.sex ? '女' : '男') + '</td>\
            <td>' + item.email + '</td>\
            <td>' + (new Date().getFullYear() - item.birth) + '</td>\
            <td>' + item.phone +'</td>\
            <td>' + item.address + '</td>\
            <td>\
                <button class="btn edit" data-index=' + index + '>编辑</button>\
                <button class="btn del" data-index=' + index + '>删除</button>\
            </td>\
        </tr>'
        });
        var tBody = document.getElementById('tbody');
        tBody.innerHTML = str;
    })
}

//table里面的按钮事件处理
function tbodyClick(e){
    var e = e || window.event;
    var tagName = e.target.tagName;
    var index = e.target.getAttribute("data-index");
    if(tagName != "BUTTON"){
        return false;
    }else{
        if(e.target.className.indexOf("edit") != -1){ //编辑按钮
            modal.classList.add("show");
            console.log(tableData[index])
            renderEditForm(tableData[index]);
        }else{//删除按钮
            if(confirm("是否删除？")){
                transfer('/api/student/delBySno', {
                    sNo: tableData[index].sNo
                }, function () {
                    alert('已删除');
                    var list = document.getElementsByClassName('list')[0];
                    list.click();
                });
            }
        }
    }
}

//回填数据
function renderEditForm(obj){
    var form = document.getElementById("editStudentForm");
    for(var prop in obj){
        if(form[prop]){
            form[prop].value = obj[prop];
        }
        console.log(prop,obj[prop])
    }
}
// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

//分页渲染
function renderDataByPage(config){
    transfer('/api/student/findByPage', config, function (res) {
        var data = res.data.findByPage;
        count = res.data.cont;
        tableData = data;
        var str = "";
        data.forEach(function (item, index) {
            str += ' <tr>\
            <td>' + item.sNo +'</td>\
            <td>' + item.name + '</td> \
            <td>' + ( item.sex ? '女' : '男') + '</td>\
            <td>' + item.email + '</td>\
            <td>' + (new Date().getFullYear() - item.birth) + '</td>\
            <td>' + item.phone +'</td>\
            <td>' + item.address + '</td>\
            <td>\
                <button class="btn edit" data-index=' + index + '>编辑</button>\
                <button class="btn del" data-index=' + index + '>删除</button>\
            </td>\
        </tr>'
        });
        var tBody = document.getElementById('tbody');
        tBody.innerHTML = str;
       // var newPage = {};
       // MyPage.call(newPage,config.page, config.size,count);
    })
}


init();
