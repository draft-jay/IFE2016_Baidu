/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = dat.getDate();
	d = d < 10 ? '0' + d : d;
	return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = ''
	for (var i = 1; i < 92; i++) {
		datStr = getDateStr(dat);
		returnData[datStr] = Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}

var aqiSourceData = {
	"北京": randomBuildData(500),
	"上海": randomBuildData(300),
	"广州": randomBuildData(200),
	"深圳": randomBuildData(100),
	"成都": randomBuildData(300),
	"西安": randomBuildData(500),
	"福州": randomBuildData(100),
	"厦门": randomBuildData(100),
	"沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
	nowSelectCity: -1,
	nowGraTime: "day"
}

/**
 * 渲染图表
 * Todo:样式、行为分离，chartBar设置改为增加css类名
 */
function renderChart() {
	var chartWrap = document.getElementById("aqi-chart-wrap");
	var count = 1; //匹配当前选择的第count个option（从1开始）
	var color = 555555; //or	var color = randomColor();
	chartWrap.innerHTML = "";

	console.log("chratWrap:" + chartWrap);
	if (pageState.nowSelectCity === -1 || pageState.nowSelectCity === 0) {
		alert("选择城市");
		return false;
	}

	for (var city in chartData) { //get all of city data
		if (count === pageState.nowSelectCity) { //certen city
			var dat = chartData[city][pageState.nowGraTime]; //get special data of date type 
			for (var x in dat) {
				var div = document.createElement("div");
				div.setAttribute("class", "chart-bar");
				div.style.height = (dat[x]) + "px";
				div.style.backgroundColor = "#" + color;
				div.title = dat[x];
//				console.log(div);
				if (pageState.nowGraTime === "day") {
					div.style.width = "10px";
				}
				if (pageState.nowGraTime === "week") {
					div.style.width = "30px";
				}
				if (pageState.nowGraTime === "month") {
					div.style.width = "50px";
				}

				chartWrap.appendChild(div);
				color += 300;
			}
		}
		count += 1;
	}
}

/**
 * 日、周、月的radio事件点击时的处理函数
 * this = selected option node
 * this.value = "day" / "week" / "month"
 * 也可传event过来，再event.target.value
 */
function graTimeChange(e) {
	// 确定是否选项发生了变化 
	if (e.target.value === pageState.nowGraTime) {
		return;
	}
	// 设置对应数据
	pageState.nowGraTime = e.target.value;
	console.log("graTime:" + e.target.value);
	// 调用图表渲染函数
	renderChart();
}

/**
 * select发生变化时的处理函数
 * 这里this ＝ event.target
 * 使用event属性名的话，无须写明形参格式，可以直接使用浏览器原生的Event对象event
 */
function citySelectChange(e) {
	// 确定是否选项发生了变化 
	//this[this.selectedIndex].value
	console.log("selected index:" + e.target.selectedIndex);
	console.log("selected event index:" + this.selectedIndex);
	if (this.selectedIndex === pageState.nowSelectCity) {
		return;
	}
	// 设置对应数据
	pageState.nowSelectCity = this.selectedIndex;
	// 调用图表渲染函数
	renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var graTime = document.getElementById("form-gra-time");
	//	var clickedRadio = graTime.getElementsByTagName("input");
	graTime.addEventListener("click", graTimeChange, false);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
	// 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	var citySelect = document.getElementById("city-select");
	for (var city in aqiSourceData) {
		var opt = document.createElement("option");
		opt.innerHTML = city;
		citySelect.appendChild(opt);
		//or 
		//html += "<option>"+city+"</option>";
		//citySelect.innerHTML = html;
		console.log(city);
	}
	// 给select设置事件，当选项发生变化时调用函数citySelectChange
	citySelect.addEventListener("change", citySelectChange, false);
}

/**
 * 初始化图表需要的数据格式
 * 处理后数据格式
 * chartData = {
 * 	"北京":{
 * 		day:{
 * 		  2016-01-01:10,
 * 		  2016-01-01:10,
 * 		},
 * 		week:{
 * 		  1:10,
 * 		  2:10,
 * 		},
 * 		month:{
 * 		  1:10,
 * 		  2:10,
 * 		}
 * }
 * "上海":{day:{},week:{},month:{}}
 */
function initAqiChartData() {
	// 将原始的源数据处理成图表需要的数据格式
	var n = weekNum = sum = 0;
	for (var cur in aqiSourceData) {
		chartData[cur] = {
			day: {},
			week: {},
			month: {}
		};
		chartData[cur]["day"] = aqiSourceData[cur]; //get all of original data and transfer to data of "day"

		for (var x in aqiSourceData[cur]) { //transfer to data of "week"
			n += 1;
			sum += aqiSourceData[cur][x];
			//console.log();
			if (n % 7 === 0) {
				weekNum += 1;
				chartData[cur]["week"][weekNum] = parseInt(sum / 7);
				sum = 0;
			} else {
				chartData[cur]["week"][weekNum] = parseInt(sum / (n % 7));
				sum = 0;
			}
		}
		//筋疲力尽，做不动了，月数据复制来的
		sum = 0;
		for (var i = 1; i <= 12; i++) {
			for (var j = 1; j <= 31; j++) {
				if (aqiSourceData[cur]["2016-" + [((i + '').length == 1) ? ("0" + i) : i] + "-" + [(('' + j).length == 1) ? ("0" + j) : j]]) {
					sum += aqiSourceData[cur]["2016-" + [((i + '').length == 1) ? ("0" + i) : i] + "-" + [(('' + j).length == 1) ? ("0" + j) : j]];
					chartData[cur]["month"][i] = parseInt(sum / j);
				}
			}
		}
	}
}

/**
 * 初始化函数
 */
function init() {
	initGraTimeForm()
	initCitySelector();
	initAqiChartData();
}

init();