/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

var cityInput = document.getElementById("aqi-city-input");
var pointInput = document.getElementById("aqi-value-input");
var table = document.getElementById("aqi-table");

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = cityInput.value.trim();
	var point =pointInput.value.trim();

	if (!city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)) { //仅能输入中英文
		alert("city wrong");
		return;
	}
	if (!point.match(/[\d+]/)) {//仅允许正正数
		alert("value wrong");
		return;
	}
	aqiData[city] = point;//cannot use aqiData.city here
	console.log(aqiData);
}

/**
 * 渲染aqi-table表格,只渲染一次
 */
function renderAqiList() {
	strTr = "<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
	for(var city in aqiData){
		strTr += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button data-city='"+city+"'>删除</button></td></tr>";
	}
	table.innerHTML = city ? strTr : "";//若city为undifined则隐藏表格
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
	// do sth.
	delete aqiData[city];
	renderAqiList();
}
/**
*两种方式传参给delBtnHandle（）
*	1.dataset.city
*	2.找target.parentNode
*	3.delBtnHandle.call(null,city);
*/
function init() {
	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	document.getElementById("add-btn").addEventListener("click",addBtnHandle);
	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	document.getElementById("aqi-table").addEventListener("click",function(event){
		if(event.target.nodeName.toLowerCase()==='button')
			delBtnHandle(event.target.dataset.city);
	});

}

init();