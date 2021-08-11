var oliList = document.getElementsByTagName("li");
var oman = document.getElementById("man");
var obtnYes = document.getElementById("btnYes");
var oUl = document.getElementById("vip");




var names = ["红烧肉", "葱香猪排", "香酥鸡块", "熏鱼块",
    "糖醋里脊", "香菇炖鸡", "笋干焖肉", "木须肉", 
    "油焖虾","山药炒肉", "荔枝肉", "狮子头",
    "酱汁牛肉","青椒土豆", "榨菜肉丝", "毛血旺",
    "素炒豆芽","麻辣烫", "油炸小酥肉", "蒜薹炒肉",
    "盖浇饭","海鲜烧烤", "老八秘制小汉堡", "烤肉拌饭",
    "牛排","鱼香肉丝", "可乐鸡翅", "佛跳墙"
];



var t = 0;


//格式
function place() {
    for (var i = 0; i < 28; i++) {//总数多少就是i的值
        t = i * (360 / 28) + "deg";
        oliList[i].innerHTML = names[i];
        oliList[i].style.transform = "rotate(" + t + ") translate(360px)";

        var oSpan = document.createElement("span");
        oSpan.innerHTML = "~~";
        oSpan.style.color = "#ac112c"
        oSpan.style.cursor = "pointer";
        oSpan.style.textAlign = "lift";
        oliList[i].appendChild(oSpan);

    }

}
place();
//随机度数
function fun() {    //适当修改值，多少个就是除多少，成多少
    var num = Math.round((Math.random() * 28));
    return num * (360 / 28) + 180;
}
//旋转事件
var myDeg = 0;
obtnYes.onmousedown = function () {
    myDeg = myDeg + fun();
    oman.style.transitionDuration = "3s";
    obtnYes.style.boxShadow = "none";
    console.log(myDeg);
    oman.style.transform = "rotateZ(" + myDeg + "deg)";
}
obtnYes.onclick = function () {
    btnYes.style.boxShadow = "2px 2px 5px black";
}

//VIP列表
for (var i = 0; i < oliList.length; i++) {
    oliList[i].lastElementChild.onclick = function () {
        var oVip = document.createElement("li");
        oVip.innerHTML = this.parentElement.innerHTML;
        oVip.style.height = "20px";
        oVip.style.border = "1px solid #FFFFFF";
        oUl.appendChild(oVip);
    }
}