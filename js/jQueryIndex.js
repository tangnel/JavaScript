var tableData = [];
var count;
function init(){
    bindEvent();
}

function bindEvent(){
    //菜单栏和内容区域切换
    $("#menuList").on("click","dd",function(){
        var id = $(this).data("id");
        $(".content").removeClass("contentActive").fadeOut();
        $("#"+id).fadeIn();
        if(id == "studentList"){
            var pageSize = $(".selectList option:selected").val();
            renderDataByPage({"page":1,"size":pageSize});
        }
    })
    //新增学生提交事件
    $("#addSubmit").click(function(e){
        updateStudent(e,"addStudentForm","/api/student/addStudent")
    })
    //编辑学生提交事件
    $("#editSubmit").click(function(e){
        updateStudent(e,"editStudentForm","/api/student/updateStudent")
    })
    //页面初始化
    renderDataByPage({"page":1,"size":1});
    // 表格里面的按钮添加点击事件：编辑和删除按钮
    $("#tbody").on("click",".btn",function(){
        if($(this).hasClass("edit")){
            $(".modal").slideDown();
            var index =  $(this).data("index");
            renderEditForm(tableData[index]);
        }else{
            if(confirm("是否删除？")){
                transfer('/api/student/delBySno', {
                    sNo: tableData[index].sNo
                }, function () {
                    alert('已删除');
                    $("#menuList .list").trigger("click")
                });
            }
        }
    })
    // 给弹出框的遮罩层添加点击事件
    $(".mask").click(function(){
        $(".modal").removeClass("show");
    })
    
    new MyPage(1,1,count)
}

//更新学生信息
function updateStudent(e,id,url){
    e.preventDefault();
    var data = $("#"+id).serializeArray();
    var studentObj = checkForm(data);
    if(studentObj){
        transfer(url, studentObj, function () {
            $("#menuList  .list").trigger("click");
            if (id == "editStudentForm") {
                // 遮罩层添关闭
               $(".modal").slideUp();
            }
        })
    }
    
    
}

//校验数据
function checkForm(data){
    var obj = {};
    var flag = true;
    // Array.forEach
    data.forEach(function(item){
        if(!item.value){
            flag = false;
        }
        obj[item.name] = item.value;
    });
    if(!flag){
        return false
    }
    return obj;
}

//数据转化
function transfer(posurl, obj, callback){
    if(!obj){
        obj = {};
    }
    $.ajax({
        url:'http://api.duyiedu.com' + posurl,
        data:$.extend(obj,{"appkey":"tangnel_1558968879272"}),
        dataType:"json",
        success: function(result){
            if(result.status == "success"){
                callback(result);
            }else{
                alert(result.msg);
            }
        }
    });
    
}

//渲染页面
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
        $("#tbody").html(str);
    })
}

//回填数据
function renderEditForm(obj){
    var form = $("#editStudentForm")[0];
    for(var prop in obj){
        if(form[prop]){
            form[prop].value = obj[prop];
        }
    }
}
init();