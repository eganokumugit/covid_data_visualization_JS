<?php

	$targetdirectory = "./uploads/";
	$tempdirectory = $targetdirectory . "temp" . basename($_FILES['file']['name']);
	$finaldirectory = $targetdirectory . basename($_FILES['file']['name']);
	$file = $_FILES['file'];
	$filename = $_FILES['file']['name'];
	$filesize = $_FILES['file']['size'];
	$filetype = $_FILES['file']['type'];
	$filetemppath = $_FILES['file']['tmp_name'];
	$fileext = substr($filename, strlen($filename)-4);
	$fileext = strtolower($fileext);

	
	if(strcmp($fileext, '.csv') != 0)
	{
		echo "<font color='red'>File is in wrong format, only CSV format is allowed! Upload <b>FAILED</b>!</font>";
	}
	else if($filesize > 2000000)
	{
		echo "<font color='red'>The file size must be less than 2MB! Upload <b>FAILED</b>!</font>";
	}
	else
	{

		$openfile = fopen($filetemppath, 'r') or die("Unable to open file!");
		move_uploaded_file($filetemppath, $tempdirectory);
		copy($tempdirectory, $finaldirectory);
		chmod($finaldirectory, 0777);
		unlink($tempdirectory);
		//Using a shell command here to return the amount of lines in the uploaded file, and then cutting out the file name that's always included at the end of the output
		//It's also much faster than using a for loop to count each row individually.
		$rowcount = shell_exec("wc -l uploads/$filename");
		$rowcount = substr($rowcount,0,strpos($rowcount,' '));
		echo "<font color='#1fd655'> The file: $filename was successfully uploaded! It has $rowcount records.</font>";
		fclose($openfile);
	}
				
?>



