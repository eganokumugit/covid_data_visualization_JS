var loggedIn = false;
var fileUpload = false;
var jsonObj;
var currYear;
var pd1Plot;
var pd2Plot;
var upqt = -10000;
var lowqt = -10000;
var iqr = -10000;
function callphp()
{
	var file_data = $("#fileUpload").prop("files")[0];
	var form_data = new FormData();
	var filename = $("#fileUpload")[0].files[0].name.toString();
	var fileext = filename.substring(filename.length - 3).toLowerCase();
	var filesize = $("#fileUpload")[0].files[0].size;
	if(fileext !== "csv")
	{
		   $("#resultmessage").html("<font color='red'>File is in wrong format, only CSV format is allowed! Upload FAILED!</font>");
		   clearTable();
		   clearPlot();
		   $('.fileresult').css('border-left-color','red');
	}
	else if(filesize > 2000000)
	{
		$("#resultmessage").html("<font color='red'>ERROR! Only files 2MB and below  are allowed! Upload FAILED!</font>");
		clearTable();
		clearPlot('both')
		$('.fileresult').css('border-left-color','red');
	}
	else
	{
		clearTable();
		clearPlot('both');
		form_data.append("file",file_data);
		$.ajax({
			   url:"uploadfile.php",
				dataType: "text",
				data: form_data,
				type: 'post',
				processData: false,
				contentType: false,
				success: function(response)
				{

					$('.fileresult').css('border-left-color','red');
					$("#resultmessage").html(response);
					$("#ggltbl").append("google.charts.load('current',{'packages':['table']});");
					$("#ggltbl").append("google.charts.setOnLoadCallback(drawTable);");
					$("#ggltbl").append("function drawTable(){");
						   $("#ggltbl").append("var data = new google.visualization.DataTable();");
						   $("#ggltbl").append("data.addColumn('string','State');");
						   $("#ggltbl").append("data.addColumn('number','Total Cases');");
						   $("#ggltbl").append("data.addColumn('number','New Cases');");
						   $("#ggltbl").append("data.addColumn('number','Total Deaths');");
						   $("#ggltbl").append("data.addColumn('number','New Deaths');");
						   $("#ggltbl").append("data.addColumn('number','Total Tests');");
						   $("#ggltbl").append("data.addColumn('number','Hospitalizations');");
						   $("#ggltbl").append("data.addColumn('string','date');");
					$.ajax({
							url:"readcsv.php",
							dataType: "json",
							data: {fileName : filename},
							type: 'POST',
							cache: false,
							async:false,
							success: function(response)
							{
								jsonObj = response;		
								$("#ggltbl").append(jsonObj.ggltbl);
								eval(document.getElementById('ggltbl').innerHTML);
								fileUpload = true;
							}
					});
						   
				}

		});

	}
	
}


function openForm() 
{
  document.getElementById("myForm").style.display = "block";
}
function showAnalytics()
{
	corrPlot();
	$("#analytics").show();
}
function closeAnalytics()
{
	$("#analytics").hide();
}
function closeForm() 
{
  document.getElementById("myForm").style.display = "none";
}

function mailFormOpen()
{
	$("#Receiver")[0].value = "";
	$("#subject")[0].value = "Subject: " + jsonObj.name + "'s DV preference";
	posSlider = $("#posAvg")[0].value;
	deathSlider = $("#deathAvg")[0].value;
	
	var date = $("input[name='date']").val();
	$("#emailcontent")[0].value = "Preferences:\nPositive Slider: " + posSlider + "\nDeath Slider: " + deathSlider + "\nPlot 1: " + pd1Plot + "\nPlot 2: " + pd2Plot + "\nDate: " + date + "\nTable: coviddata" + currYear + "\n-Egan Okumu";
	document.getElementById("mailForm").style.display = "block";
}
function closeMailForm() 
{
  document.getElementById("mailForm").style.display = "none";
}
function checkLogin()
{
	$.ajax({
			url:"verifylogin.php",
			dataType: "json",
			data: {username: $("#username").val(), password: $("#password").val()},
			type: 'POST',
			cache: false,
			success: function(response)
			{
				var logjson = response;
				$("#delnav").append(logjson.msg);
				eval(document.getElementById('delnav').innerHTML);
				setTimeout(function(){
					   if(logjson.hasPreference==true)
					   {
						   if(confirm("Load last saved session?")){loadPreferences(logjson.preferences);}
					   }
				},500);
			}

		});
}
function loadPreferences(logjson)
{
	resetSlider();
	currYear = logjson.year;
	loadData(currYear);	
	setSlider();
	$("#posAvg").prop("value", logjson.positive);

	$("#deathAvg").prop("value", logjson.death);
	$("#posSliderVal")[0].value = logjson.positive;
	$("#deathSliderVal")[0].value = logjson.death;

	pd1Plot = logjson.pd1;
	pd2Plot = logjson.pd2;
	upqt = logjson.upqt;
	lowqt = logjson.lowqt;
	iqr = logjson.iqr;
	var date = logjson.date;

	$("input[name='date']").val(logjson.date);
	$("#" + logjson.radio).prop("checked",true);
	setTimeout(function(){updatePlot();},400);
}
function sendMail()
{
	var to = $("#Receiver")[0].value;
	var subject = $("#subject")[0].value;
	var msg = $("#emailcontent")[0].value;
  $.ajax({
	  url:"sendmail.php",
	  dataType: "text",
	  data: {to:to, subject:subject,msg:msg},
	  type: 'POST',
	  cache: false,
	  success: function(response)
	  {
		$('#resultmessage').html(response);
		if(response.includes("RECEIVED")){closeMailForm();}
	  }

	});
}
function logout()
{
	if(confirm("Are you sure you want to log out?"))
	{
		$.ajax({
			url:"logout.php",
			dataType: "text",
			type: 'POST',
			cache: false,
			success: function(response)
			{
				//This will bring back the login button on the navbar. It just makes more sense to only be able to
				//logout when you're logged in and vice versa.
				$("#addnav").append(response);
				eval(document.getElementById('addnav').innerHTML);
				clearPlot('both');
				clearTable();
				location.reload();
			}

		});
	}
}
function info()
{
	alert("INFO:\n_____________________________________\nName: Egan Okumu\nClass ID: CPS4745*01\nDue Date: December 14th, 2022");
}
function usrInfo()
{
	$.ajax({
			url:"usrinfo.php",
			dataType: "text",
			type: 'POST',
			cache: false,
			success: function(response)
			{
				alert(response);
			}

	})

}
function clientInfo()
{
	$.ajax({
			url:"clinfo.php",
			dataType: "text",
			type: 'POST',
			cache: false,
			success: function(response)
			{
				let javaCheck;
				//Memory size: 8GB

				var usrOS = "Not known";
				let memSize = navigator.deviceMemory;
				let heapLim = Math.round(performance.memory.jsHeapSizeLimit / Math.pow(1000,3 ) * 100) / 100;	
				let heapSize = Math.round(performance.memory.totalJSHeapSize / Math.pow(1000, 2) * 100) / 100;	
				let heapUsed = Math.round(performance.memory.usedJSHeapSize / Math.pow(1000, 2) * 100) / 100;	


				if (navigator.appVersion.indexOf("Win") != -1) {usrOS = "Windows OS";}
				else if (navigator.appVersion.indexOf("Mac") != -1) {usrOS = "Mac OS";}
				else if (navigator.appVersion.indexOf("X11") != -1) {usrOS = "UNIX OS";}
				else if (navigator.appVersion.indexOf("Linux") != -1) {usrOS = "Linux OS";}
				if(navigator.javaEnabled())
				{
					javaCheck = "Java: Enabled";
				}
				else
				{
					javaCheck = "Java: Turned Off";
				}

				alert(response + javaCheck + "\nPlatform: " + usrOS + "\nMemory Size: " + memSize + "\nJS Heap Size Limit: " + heapLim + "GB\n" + "JS Total Heap Size: " + heapSize + "MB\n" + "JS Current Tab Usage: " + heapUsed + "MB");
			}

	});

}
function closeTab()
{
	if(confirm("Are you sure you want to exit the page? You will be logged out and the tab will close.") == true)
	{
		$.ajax({
			url:"logout.php",
			dataType: "text",
			type: 'POST',
			cache: false,
			success: function(response)
			{
				//This will bring back the login button on the navbar. It just makes more sense to only be able to
				//logout when you're logged in and vice versa.
				$("#resultmessage").html("<font color=#1fd655>Until next time!</font>");
				clearPlot('both');
				clearTable();
				window.opener = self;
				window.close();
			}

		});
	}
}
function corrPlot()
{
	if(tableIsEmpty() == false)
	{
		var df = new dfd.DataFrame(jsonObj.arr);
		df = df.groupby(["date"]).agg({"positive":"sum","death":"sum"})
		df.sortValues("date",{ascending:true,inplace:true});
		df.resetIndex({inplace:true});
		var posArr = Array();
		var deathArr = Array();
		for(var i=0;i<df.shape[0];i++)
		{
			posArr.push([i,df.at(i,"positive_sum")]);
			deathArr.push([i,df.at(i,"death_sum")]);
		}
		let posLinReg = regression.linear(posArr);
		let deathLinReg = regression.linear(deathArr);

		var posY = Array();
		var deathY = Array();
		var linX = Array();
		for(var i=0;i<df.shape[0] + 20;i++)
		{
			posY.push((posLinReg.equation[0] * i) + posLinReg.equation[1]);
			deathY.push((deathLinReg.equation[0] * i) + deathLinReg.equation[1]);
			linX.push(i);
		}

		var posScatter = {
			x: df['index'],
			y: df['positive_sum'].$data,
			name: "Cases",
			line:{
				width:5,
				color:'rgb(45,255,0)'
			},
			type: 'lines'

		};
		var posReg = {
			x: linX,
			y: posY,
			line:{
				width:5,
				dash:"dot",
				color:"rgb(30,30,255)"
			},
			name:"Cases Regression Line",
			mode:'lines'
		};
		var deathScatter = {
			x: df['index'],
			y: df['death_sum'].$data,
			xaxis:"x2",
			yaxis:"y2",
			line:{
				width:5,
				color:"rgb(255,5,5)"
			},
			name: "Deaths",
			type: 'lines'
		};
		var deathReg = {
			x: linX,
			y: deathY,
			xaxis:"x2",
			yaxis:"y2",
			line:{
				width:5,
				dash:"dot",
				color:"rgb(0,255,255)"
			},
			name:"Deaths Regression Line",
			mode:'lines'
		};
		
		var layout = {
			title: "Pearson Correlation Line Plot",
			height: 600,
			width: 800,
			yaxis:{
				title:"Total Cases",
				titlefont: {color:'#1fd655'},
				tickfont: {color:'#1fd655'},
			},
			yaxis2:{
				title:"Total Deaths",
				titlefont: {color:'#FF0000'},
				tickfont: {color:'#FF0000'},
				overlaying:"y",
			},
			xaxis:{title: posLinReg.string + "<br>Correlation Value: " + posLinReg.r2},
			xaxis2:{title: deathLinReg.string + "<br>Correlation Value: " + deathLinReg.r2},
			grid:{rows:1,columns:2,pattern:'independent'}
		};
		var data = [posScatter,deathScatter,posReg,deathReg];
		Plotly.newPlot('analytics',data,layout);

	}
}
function linePlot()
{
	var radioVal = $("input[name='charttype']:checked").val();
	clearPlot('pd1');
	if(tableIsEmpty() == false)
	{
		if(radioVal.includes("Line"))
		{
			google.charts.load('current',{packages:['corechart','line']});
			google.charts.setOnLoadCallback(line);
			var pid = radioVal.substring(0,1);
			var title = '';
			var yAxis = '';
			var df = new dfd.DataFrame(jsonObj.arr);
			var width = 100;
			var height = 100;
			var colName = '';
			var i = 0;
			df = df.groupby(['date']).agg({'death':'sum','positive':'sum'});
			if(pid == "D")
			{
				title = "Covid Death Totals Over Time";
				yAxis = "Deaths";
				colName = "death_sum";
			}
			else if(pid =="C")
			{
				title = "Positive Covid Cases Over Time";
				yAxis = "Cases";
				colName = "positive_sum";
			}
			function line()
			{
				df.sortValues('date',{ascending:true,inplace:true});
				df.resetIndex({inplace:true});
				var data = new google.visualization.DataTable();
				data.addColumn('string','Date');
				data.addColumn('number',yAxis);
				while(i < df.shape[0])
				{

					data.addRow([df.at(i,'date'), df.at(i,colName)]);
					i++;
				}
				var options = {
					   title: title,
					   width: width + "%",
					   height: height + "%",
					   legend: {position:'none'},
					   lineWidth:7,
					   colors:['red'],
					   hAxis:{title:'Date'},
					   vAxis:{title: "Total " + String(yAxis)}
				};
				var chart = new google.visualization.LineChart(document.getElementById('pd1'));
				chart.draw(data,google.charts.Line.convertOptions(options));
				$('#pd1').css('height','auto');
				$('.fileresult').css('border-left-color','#1fd655');
				$('#resultmessage').html("<font color=#1fd655>Plot Successful!</font>");
				pd1Plot = "line";
			}
		}
		else
		{
			$('.fileresult').css('border-left-color','red');
			$('#resultmessage').html("<font color=red>Selected chart doesn't support line charts!</font>");		
		}
	}
	else
	{
		   alert("Please load data first, there's nothing to plot!");
	}
}
function barPlot()
{
	//var fileName = $("#fileUpload")[0].files[0].name.toString();
	var radioVal = $("input[name='charttype']:checked").val();
	clearPlot('pd2');
	if(tableIsEmpty() == false)
	{
		if(radioVal.includes("Bar"))
		{
			google.charts.load('current',{packages:['corechart']});
			google.charts.setOnLoadCallback(bar);
			var pid = radioVal.substring(0,1);
			var title = '';
			var yAxis = '';
			var df = new dfd.DataFrame(jsonObj.arr);
			var width = 100;
			var height = 100;
			var colName = '';
			var i = 0;
			df = df.groupby(['date']).agg({'death':'sum','positive':'sum'});
			if(pid == "D")
			{
				title = "Covid Death Totals Over Time";
				yAxis = "Deaths";
				colName = "death_sum";
			}
			else if(pid =="C")
			{
				title = "Positive Covid Cases Over Time";
				yAxis = "Cases";
				colName = "positive_sum";
			}
			function bar()
			{
				df.sortValues('date',{ascending:true,inplace:true});
				df.resetIndex({inplace:true});
				var data = new google.visualization.DataTable();
				data.addColumn('string','Date');
				data.addColumn('number',yAxis);
				while(i < df.shape[0])
				{

					data.addRow([df.at(i,'date'), df.at(i,colName)]);
					i++;
				}
				var options = {
					   title: title,
					   width: width + "%",
					   height: height + "%",
					   legend: {position:'none'},
					   lineWidth:7,
					   colors:['red'],
					   hAxis:{title:'Date'},
					   vAxis:{title: "Total " + String(yAxis),scaleType:'log'}
				};
				var chart = new google.visualization.ColumnChart(document.getElementById('pd2'));
				chart.draw(data,options);
				$('#pd2').css('height','auto');
				$('.fileresult').css('border-left-color','#1fd655');
				$('#resultmessage').html("<font color=#1fd655>Plot Successful!</font>");
				pd2Plot = 'bar';
			}
		}
		else
		{
			$('.fileresult').css('border-left-color','red');
			$('#resultmessage').html("<font color=red>Selected chart doesn't support Bar charts!</font>");		
		}
	}
	else
	{
		   alert("Please load data first, there's nothing to plot!");
	}
}
function histPlot()
{
	//var fileName = $("#fileUpload")[0].files[0].name.toString();
	var radioVal = $("input[name='charttype']:checked").val();
	var date = $("input[name='date']").val();
	clearPlot('pd2');
	if(tableIsEmpty() == false)
	{
		if(radioVal.includes("Histogram"))
		{
			var pid = radioVal.substring(0,1);
			if(pid == "S")
			{
				google.charts.load('current',{packages:['corechart']});
				google.charts.setOnLoadCallback(histogram);
				var yAxis = 'State Count';
				var xAxis = 'Hospitalizations';
				var df = new dfd.DataFrame(jsonObj.arr);
				var width = 100;
				var height = 100;
				var colName = 'deathIncrease';
				var i = 0;
				df.sortValues('date',{ascending:false,inplace:true});
				if(df.query(df['date'].eq(date)).shape[0] > 0)
				{
					df = df.query(df['date'].eq(date));
				}
				else
				{
					var minDate = df.tail(1).column('date');
					var maxDate = df.head(1).column('date');
					if(date < minDate.$data[0]){date = minDate.$data[0];}
					else if(date > maxDate.$data[0]){date = maxDate.$data[0];}
					$("input[name='date']").val(date);
					df = df.query(df['date'].eq(date));

				}

				var title = 'Death Increase By State As Of ' + date + ' (States with missing values not included.)';
				function histogram()
				{
					df.sortValues('deathIncrease',{ascending:true,inplace:true});
					df = df.loc({rows:df['deathIncrease'].gt(0)});
					df.resetIndex({inplace:true});
					var data = new google.visualization.DataTable();
					data.addColumn('string','State');
					data.addColumn('number','Death Increase');
					while(i < df.shape[0])
					{

						data.addRow([df.at(i,'state'), df.at(i,colName)]);
						i++;
					}
					var options = {
						title: title,
						width: width + "%",
						height: height + "%",
						legend: {position:'none'},
						colors:['red'],
						histogram: {lastBucketPerctile:25},
						hAxis:{title:'Death'},
						vAxis:{title: "State Count "}
					};
				var chart = new google.visualization.Histogram(document.getElementById('pd2'));
				chart.draw(data,options);
				$('#pd2').css('height','auto');
				$('.fileresult').css('border-left-color','#1fd655');
				$('#resultmessage').html("<font color=#1fd655>Plot Successful!</font>");
				pd2Plot = 'histogram';
			}
			}
		}
		else
		{
			$('.fileresult').css('border-left-color','red');
			$('#resultmessage').html("<font color=red>Selected chart doesn't support histogram charts!</font>");		
		}
	}
	else
	{
		   alert("Please load data first, there's nothing to plot!");
	}
}
function geoPlot()
{
	//var fileName = $("#fileUpload")[0].files[0].name.toString();
	var radioVal = $("input[name='charttype']:checked").val();
	var pickedPlot = "map";
	var date = $("input[name='date']").val();
	clearPlot('pd2');
	if(tableIsEmpty() == false)
	{
		var pid = radioVal.substring(0,1);
		var colBar = '';
		var df = new dfd.DataFrame(jsonObj.arr);
		var width = 100;
		var height = 880;
		var i = 0;
		var colName = '';
	   if(df.query(df['date'].eq(date)).shape[0] > 0)
	   {
		  df = df.query(df['date'].eq(date));
	   }
	   else
	   {
		  var minDate = df.tail(1).column('date');
		  var maxDate = df.head(1).column('date');
		  if(date < minDate.$data[0]){date = minDate.$data[0];}
		  else if(date > maxDate.$data[0]){date = maxDate.$data[0];}
		  $("input[name='date']").val(date);
		  df = df.query(df['date'].eq(date));
	   }

	   if(pid == "D" || pid == "S")
	   {
		  title = 'Death Increase By State As Of ' + date;
		  colBar = "Deaths";
		  colName = "deathIncrease";
	   }
	   else if(pid =="C")
	   {
		  title = 'New Covid Cases By State As Of ' + date;
		  colBar = "Cases";
		  colName = "positiveIncrease";
	   }
	   var data = [{
		  type: 'choropleth',
		  locationmode:'USA-states',
		  locations: df['state'].$data,
		  z: df[colName].$data,
		  //text: "statename",
		  zmin: df[colName].min(),
		  zmax: df[colName].max(),
		  colorscale:'Jet',
		  //reversescale:true,
		  colorbar:{title:colBar,thickness:20},
		  marker:{line:{color:'rgb(0,0,0)',width:2}}
	  }];
	  var layout={
		  title:title,
		  height: height,
		  width: width +"%",
		  geo:{scope:'usa',showlakes:true,lakecolor:'rgb(25,55,255)'}
	  };
	  Plotly.newPlot('pd2',data,layout,{showLink:false});
	  $('#pd2').css('height','auto');
	  $('.fileresult').css('border-left-color','#1fd655');
	  $('#resultmessage').html("<font color=#1fd655>Plot Successful!</font>");
	  pd2Plot = 'geo';
  }
	
	else
	{
		   alert("Please load data first, there's nothing to plot!");
	}
}

function piePlot()
{
	//var fileName = $("#fileUpload")[0].files[0].name.toString();
	var radioVal = $("input[name='charttype']:checked").val();
	var pickedPlot = "line";
	var date = $("input[name='date']").val();
	clearPlot('pd1');
	if(tableIsEmpty() == false)
	{
		if(radioVal.includes("Pie"))
		{
			var pid = radioVal.substring(0,1);
			if(pid == "S")
			{
				google.charts.load('current',{packages:['corechart']});
				google.charts.setOnLoadCallback(pie);
				var df = new dfd.DataFrame(jsonObj.arr);
				var width = 100;
				var height = 100;
				var colName = 'positiveIncrease';
				var i = 0;
				df.sortValues('date',{ascending:false,inplace:true});
				if(df.query(df['date'].eq(date)).shape[0] > 0)
				{
					df = df.query(df['date'].eq(date));
				}
				else
				{
					var minDate = df.tail(1).column('date');
					var maxDate = df.head(1).column('date');
					if(date < minDate.$data[0]){date = minDate.$data[0];}
					else if(date > maxDate.$data[0]){date = maxDate.$data[0];}
					$("input[name='date']").val(date);
					df = df.query(df['date'].eq(date));
				}

				var title = 'New Covid Cases By State As Of ' + date + ' (States with missing values not included.)';
				function pie()
				{
					df.sortValues('positiveIncrease',{ascending:false,inplace:true});
					df = df.loc({rows:df['positiveIncrease'].gt(0)});
					df.resetIndex({inplace:true});
					var data = new google.visualization.DataTable();
					data.addColumn('string','State');
					data.addColumn('number','New Cases');
					while(i < df.shape[0])
					{

						data.addRow([df.at(i,'state'), df.at(i,colName)]);
						i++;
					}
					var options = {
						title: title,
						width: width + "%",
						height: height + "%",
						pieSliceText:'label',
						pieStartAngle:270,
						legend: {position:'none'},
					};
				var chart = new google.visualization.PieChart(document.getElementById('pd1'));
				chart.draw(data,options);
				$('#pd1').css('height','auto');
				$('.fileresult').css('border-left-color','#1fd655');
				$('#resultmessage').html("<font color=#1fd655>Plot Successful!</font>");
				pd1Plot = 'pie';
			}
			}
		}
		else
		{
			$('.fileresult').css('border-left-color','red');
			$('#resultmessage').html("<font color=red>Selected chart doesn't support pie charts!</font>");		
		}
	}
	else
	{
		   alert("Please load data first, there's nothing to plot!");
	}
}

function boxPlot()
{
	clearPlot('pd1');
	if(tableIsEmpty() == false)
	{

		   var date = $("input[name='date']").val();
		   var df = new dfd.DataFrame(jsonObj.arr);
		   df.sortValues('date',{ascending:false,inplace:true});
		   if(df.query(df['date'].eq(date)).shape[0] > 0)
		   {
			   df = df.query(df['date'].eq(date));
		   }
		   else
		   {
			   var minDate = df.tail(1).column('date');
			   var maxDate = df.head(1).column('date');
			   if(date < minDate.$data[0]){date = minDate.$data[0];}
			   else if(date > maxDate.$data[0]){date = maxDate.$data[0];}
			   $("input[name='date']").val(date);
			   df = df.query(df['date'].eq(date));
		   }
		   
		   var posBox = {
			   y:df['positive'].$data,
			   boxpoints: 'all',
			   jitter: 0.3,
			   type:'box',
			   name:'Cases',
			   text: df['state'].$data
		   };

		   var deathBox = {
			   y:df['death'].$data,
			   boxpoints: 'all',
			   jitter: 0.3,
			   type:'box',
			   name:'Deaths',
			   xaxis:'x2',
			   yaxis:'y2',
			   text: df['state'].$data
		   };
		   var data = [posBox,deathBox];
		   var layout = {
			   title: 'Total Covid Cases/Deaths as of ' + date,
			   grid:{rows:1,columns:2,pattern:'independent'}
		   };
		   Plotly.newPlot("pd1",data,layout);
		   $('#pd1').css('height','auto');
		   $('.fileresult').css('border-left-color','#1fd655');
		   $('#resultmessage').html("<font color=#1fd655>Plot Successful!</font>");
		   pd1Plot = "box";
	}
	else
	{
		   alert("Please load data first, there's nothing to plot!");
	}
}
function newPlots()
{
	boxPlot();
	geoPlot();
}
function displayPlots()
{
	var radioVal = $("input[name='charttype']:checked").val();
	var pid = radioVal.substring(0,1);
	switch(pid)
	{
		case "D":
			linePlot();
			barPlot();
			break;
		case "C":
			linePlot();
			barPlot();
			break;
		case "S":
			piePlot();
			histPlot();
			break;
		default:
			$('#resultmessage').html("<font color=red>ERROR</font>");
			break;
	}
}
function updatePlot()
{
	loadData(currYear);
	switch(pd1Plot)
	{
		case "line":
			setTimeout(function(){linePlot();},100);
			break;
		case "pie":
			setTimeout(function(){piePlot();},100);
			break;
		case "box":
			setTimeout(function(){boxPlot();},100);
			break;
		default:
			setTimeout(function(){linePlot();},100);
			break;
	}
	switch(pd2Plot)
	{
		case "bar":
			setTimeout(function(){barPlot();},100);
			break;
		case "geo":
			setTimeout(function(){geoPlot();},100);
			break;
		case "histogram":
			setTimeout(function(){histPlot();},100);
			break;
		default:
			setTimeout(function(){barPlot();},100);	
			break;
	}
	
	
	setTimeout(function(){corrPlot();},100);	
}
function tableIsEmpty()
{
	//The idea behind this stems from me noticing that
	//upon the table being drawn by the google API, the
	//script tag I placed in this div is replaced by the table
	//data. If this script tag is there, then the google table is not
	//there, and nothing can be plotted.
	const tbldiv = document.getElementById("tbl");
	const ggltbl = document.getElementById("ggltbl");
	var isEmpty;
	if(tbldiv.contains(ggltbl))
	{
		isEmpty = true;
	}
	else
	{
		isEmpty = false;
	}

	return isEmpty;
}

function clearPlot(div)
{
	if(div=='both')
	{
		$("#plotdiv").html('');
		$("#plotdiv").append('<div id=pd1></div>');
		$("#plotdiv").append('<div id=pd2></div>');
		$('#plotdiv').css('height','880px');
	}
	else
	{
		$("#" + div).html('');
		$('#' + div).css('height','880px');
	}
}

function clearTable()
{
	$("#tbl").html('');
	$("#tbl").append('<script id=ggltbl></script>');
	$('#view').hide();
	$('#showleft').hide();
	$('#sliderPrompt').hide();
}

function loadData(year)
{
	clearTable();
	var posAvg = parseInt(document.getElementById("posAvg").value);
	var deathAvg = parseInt(document.getElementById("deathAvg").value);
	clearPlot('both');
	if(typeof jsonObj !== 'undefined' && jsonObj.arr !=="ERROR" && currYear==year)
	{
		posdf = new dfd.DataFrame(jsonObj.arr);
		posdf = posdf.query(posdf['positive'].ge(posAvg).and(posdf['death'].ge(deathAvg)));
		upqt = d3.quantile(posdf['positive'].$data,0.75);
		lowqt = d3.quantile(posdf['positive'].$data,0.25);
		iqr = d3.quantile(posdf['positive'].$data,0.5);
	}
	currYear = year;
	$.ajax({
			url:"loadData.php",
			dataType: "json",
			data: {year: year,posAvg:posAvg,deathAvg:deathAvg,upqt:upqt,lowqt:lowqt,iqr:iqr},
			type: 'POST',
			cache: false,
			async:false,
			success: function(response)
			{
				fileUpload = false;
				jsonObj = response;
				if(jsonObj.ggltbl !== "ERROR")
				{	
					   $('.fileresult').css('border-left-color','red');
					   $("#resultmessage").html("<font color=1fd655>" + year + " Covid Data Succesfully Loaded!</font>");

					   $("#ggltbl").append("google.charts.load('current',{'packages':['table']});");
					   $("#ggltbl").append("google.charts.setOnLoadCallback(drawTable);");
					   $("#ggltbl").append("function drawTable(){");
						   $("#ggltbl").append("var data = new google.visualization.DataTable();");
						   $("#ggltbl").append("data.addColumn('string','State');");
						   $("#ggltbl").append("data.addColumn('number','Total Cases');");
						   $("#ggltbl").append("data.addColumn('number','New Cases');");
						   $("#ggltbl").append("data.addColumn('number','Total Deaths');");
						   $("#ggltbl").append("data.addColumn('number','New Deaths');");
						   $("#ggltbl").append("data.addColumn('number','Total Tests');");
						   $("#ggltbl").append("data.addColumn('number','Hospitalizations');");
						   $("#ggltbl").append("data.addColumn('string','date');");
					   $("#ggltbl").append(jsonObj.ggltbl);
					   eval(document.getElementById('ggltbl').innerHTML);
				}
				else{$("#resultmessage").html("<font color=red>ERROR: Please Log In First!!</font>");}
			}
		});
	
}

function setSlider()
{
	if(typeof jsonObj !== 'undefined' && jsonObj.arr !=="ERROR")
	{
		var df = new dfd.DataFrame(jsonObj.arr);
		var pos = df.query(df['positive'].gt(0)).column('positive');
		var death = df.query(df['death'].gt(0)).column('death');
		   
		$("#posAvg").prop("min",pos.min());
		  $("#posAvg").prop("max",pos.max());
		   $("#posAvg").prop("value",jsonObj.posAvg);

		   $("#deathAvg").prop("min",death.min());
		   $("#deathAvg").prop("max",death.max());
		   $("#deathAvg").prop("value",jsonObj.deathAvg);

		  $("#posSliderVal").prop("value",jsonObj.posAvg);
		  $("#deathSliderVal").prop("value",jsonObj.deathAvg);

	}
 	

}
function resetSlider()
{
	if(typeof jsonObj !== 'undefined' && jsonObj.arr !=="ERROR")
	{
		$("#posAvg").prop("min",-1000);
		$("#posAvg").prop("max",0);
		$("#posAvg").prop("value", -500);

		$("#deathAvg").prop("min",-1000);
		$("#deathAvg").prop("max",0);
		$("#deathAvg").prop("value", -500);
	
		upqt = -10000;
		lowqt = -10000;
		iqr = -10000;
	}
}
function saveSettings()
{
	if(tableIsEmpty() == false)
	{
		var posAvg = parseInt(document.getElementById("posAvg").value);
		var deathAvg = parseInt(document.getElementById("deathAvg").value);
		var radioVal = $("input[name='charttype']:checked").val();
		var pickedPlot = "line";
		var date = $("input[name='date']").val();
		var pid = radioVal.substring(0,1);
		$.ajax({
			url:"savesettings.php",
			dataType: "text",
			data: {positive:posAvg,death:deathAvg,pd1:pd1Plot,pd2:pd2Plot, radio:pid,upqt:upqt,lowqt:lowqt,iqr:iqr,date,year:currYear},
			type: 'POST',
			cache: false,
			success: function(response)
			{
			   $("#resultmessage").html(response);
			}

		});
	}
	else
	{
		$("#resultmessage").html("<font color=red>ERROR: Load data first!!!!");
	}

}

function saveResults()
{	
	if(tableIsEmpty() == false)
	{
		   $.ajax({
			url:"saveresults.php",
			dataType: "text",
			data: {jsonobj : JSON.stringify(jsonObj.arr)},
			type: 'POST',
			cache: false,
			success: function(response)
			{
			   $("#resultmessage").html(response);
			}

		});
	}
	else
	{
		$("#resultmessage").html("<font color=red>ERROR: Load data first!!!!");
	}
}









