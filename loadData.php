<?php
	if(isset($_COOKIE['uid']))
	{
		   if(isset($_POST['year']))
		   {
			   include('dbconfig.php');
			   $con = mysqli_connect($host,$username,$password,$name) or die("Cannot connect to DB");
			   #$year = 2021;
			   $year = $_POST['year'];
			   $posavg = $_POST['posAvg'];
			   $deathavg = $_POST['deathAvg'];
			   $upqt = $_POST['upqt'];
			   $lowqt = $_POST['lowqt'];
			   $iqr = $_POST['iqr'];
			   $table = "2022F_okumueg.coviddata$year";
			   if($posavg == -500)
			   {
				   $query = "SELECT state,positive,positiveIncrease,death,deathIncrease,totalTestResults, hospitalized, date FROM $table";
				   $avgquery = "SELECT date, AVG(CASE WHEN positive !=' ' AND positive > 0 THEN positive END) AS posAvg, AVG(CASE WHEN death !=' ' AND death > 0 THEN death END) AS deathAvg FROM $table";
			   }
			   else
			   {
				   $query = "SELECT state,positive,positiveIncrease,death,deathIncrease,totalTestResults, hospitalized, date FROM $table WHERE positive >= $posavg AND death >= $deathavg";
				   $avgquery = "SELECT date, AVG(CASE WHEN positive >= $posavg  AND death >= $deathavg THEN positive END) AS posAvg, AVG(CASE WHEN positive >= $posavg AND death >= $deathavg THEN death END) AS deathAvg FROM $table;";

			   }

			   
			   $avgresult = mysqli_query($con,$avgquery);
			   $result = mysqli_query($con,$query);
			   
			   $avgarr = mysqli_fetch_assoc($avgresult);
			   $ggltbl = '';
			   $arr = array();
			   $rcount = 0;
			   while($row = mysqli_fetch_assoc($result))
			   {
				   $color = '';
				   $ggltbl .= "data.addRow(['" . $row['state'] . "'," . $row['positive'] . "," . $row['positiveIncrease'] . ",". $row['death'] . ",". $row['deathIncrease'] . ",". $row['totalTestResults'] . ",". $row['hospitalized'] . ",'". $row['date'] . "']);\n";
				   
				   $arr[] = $row;
					   
				   if($deathavg != -500)
				   {
					   if($avgarr['deathAvg'] < $deathavg)
					   {
						   $ggltbl.="data.setProperty($rcount,3,'style','background:#1fd655');\n";
					   }
				   }
				   if($iqr != -10000)
				   {
					   $lowol = $lowqt - (1.5 * $iqr);
					   $highol = $upqt + (1.5 * $iqr);
					   if($row['positive'] > $highol || $row['positive'] < $lowol)
					   {
						   $ggltbl.="data.setProperty($rcount,0,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,1,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,2,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,3,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,4,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,5,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,6,'style','background:yellow');\n";
						   $ggltbl.="data.setProperty($rcount,7,'style','background:yellow');\n";
					   }
				   }
					   
				   
				   if($avgarr['posAvg'] <  $row['positive'])
				   {
					   $ggltbl .= "data.setProperty($rcount, 1,'style','background-color:red');\n";
				   }
				   if($avgarr['deathAvg'] >  $row['death'])
				   {
					   $ggltbl .= "data.setProperty($rcount, 3,'style','background-color:#1fd655');\n";
				   }
				   $rcount += 1;
			   }
			   mysqli_close($con);
			   $ggltbl .= "var tbl = new google.visualization.Table(document.getElementById('tbl'));\n";
			   $ggltbl .= "tbl.draw(data,{allowHtml: true, showRowNumber:true, page:'enable', pageSize:30, width: '100%', height: '100%'});\n";
			   $ggltbl .= "}";
			   $ggltbl .= "$('.fileresult').css('border-left-color','#1fd655');";
			   $ggltbl .= "$('#view').show();";
			   $ggltbl .= "$('#showleft').show();";
			   $ggltbl .= "$('.loaddata').show();";
			   $ggltbl .= "$('#sliderPrompt').show();";
			   $ggltbl .= "$('#mail').show();";
			   $ggltbl .= "$('.save').show();";

			   $json = array();
			   $json['ggltbl'] = $ggltbl;
			   $json['arr'] = $arr;
			   $json['posAvg'] = $avgarr['posAvg'];
			   $json['deathAvg'] = $avgarr['deathAvg'];
			   $json['name'] = $_COOKIE['name'];


			   echo json_encode($json,JSON_NUMERIC_CHECK);


	   }	
		   else
		   {
				 echo "ERROR";
		   }
	}
	else
	{
		$json = array();
		$json['ggltbl'] = "ERROR";
		$json['arr'] = "ERROR";
		echo json_encode($json);
	}

?>




	
