<?php 
	
	$filename = $_POST['fileName'];
	
	/*
		The following code will populate the table created in the callphp() function in jslinks/functions.js 
		This php script will not be called until the uploaded file has already been accepted in that js file.
	*/
	$openfile = fopen("uploads/$filename",'r') or die("Unable to open file!");
	//Skip header of the csv file
	fgetcsv($openfile,10000,",");
	$rowcount = shell_exec("wc -l uploads/$filename");
	$rowcount = intval(substr($rowcount,0,strpos($rowcount,' ')));
	$ggltbl = '';
	$arr = array();
	$temparr = array();
	while(($line = fgetcsv($openfile,10000,',')) !== FALSE)
	{
		if(strtoupper($line[1]) == "GU"){continue;}
		else if(strtoupper($line[1]) == "PR"){continue;}
		else if(strtoupper($line[1]) == "AS"){continue;}
		else if(strtoupper($line[1]) == "MP"){continue;}
		else if(strtoupper($line[1]) == "VI"){continue;}

		$ggltbl .=  "data.addRow(['$line[1]', $line[19], $line[21], $line[3], $line[4], $line[31], $line[6], '$line[0]']);\n"; 
		$temparr['state'] = $line[1];
		$temparr['positive'] = $line[19];
		$temparr['positiveIncrease'] = $line[21];
		$temparr['death'] = (int)$line[3];
		$temparr['deathIncrease'] = $line[4];
		$temparr['totalTests'] = $line[31];
		$temparr['hospitalizations'] = (int)$line[6];
		$temparr['date'] = $line[0];
		$arr[] = $temparr;
	}

	$ggltbl .= "var tbl = new google.visualization.Table(document.getElementById('tbl'));\n";
	$ggltbl .= "tbl.draw(data,{showRowNumber:true, page:'enable', pageSize:30, width: '100%', height: '100%'});\n";
	$ggltbl .= "}";
	$ggltbl .= "$('.fileresult').css('border-left-color','#1fd655');";
	$ggltbl .= "$('#view').show();";
	$ggltbl .= "$('#showleft').show();";
	$ggltbl .= "$('#mail').hide();";
	$ggltbl .= "$('.loaddata').show();";
	$ggltbl .= "$('#sliderPrompt').hide();";
	$ggltbl .= "$('.save').hide();";
	

	$json = array();
	$json['ggltbl'] = $ggltbl;
	$json['arr'] = $arr;
	echo json_encode($json,JSON_NUMERIC_CHECK);

	
	fclose($openfile);
	//CLOSE THE FILE PLEASE
	
?>
