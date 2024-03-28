<?php
	if(isset($_COOKIE['uid']))
	{
		   include("dbconfig.php");
		   $con = mysqli_connect($host,$username,$password,$name) or die("Cannot Connect to DB!");
		   $uid = $_COOKIE['uid'];
		   $login = $_COOKIE['login'];
		   $positive = $_POST['positive'];
		   $death = $_POST['death'];
		   $pd1 = $_POST['pd1'];
		   $pd2 = $_POST['pd2'];
		   $radio = $_POST['radio'];
		   $upqt = $_POST['upqt'];
		   $lowqt = $_POST['lowqt'];
		   $iqr = $_POST['iqr'];
		   $date = $_POST['date'];
		   $year = $_POST['year'];


		   $sql ="SELECT x.uid,x.login,positive,death,pd1,pd2,radio,upqt,lowqt,iqr,date,year FROM 2022F_okumueg.User_Setting x, datamining.DV_User y WHERE x.uid=$uid AND x.uid=y.uid;"
		   ;
		   $result = mysqli_query($con, $sql);
		   if(mysqli_num_rows($result) == 0)
		   {
			   $insertsql = "INSERT INTO 2022F_okumueg.User_Setting(uid,login,positive,death,pd1,pd2,radio,upqt,lowqt,iqr,date,year) VALUES ($uid, '$login',$positive, $death,'$pd1','$pd2','$radio',$upqt,$lowqt,$iqr,'$date',$year);";
			   $insertcheck = mysqli_query($con,$insertsql);
			   if($insertcheck)
			   {
				echo "<font color=1fd655>User settings successfully saved!</font>"; 
			   }
			   else
			   {
				echo "<font color=red>ERROR: User settings were not added!</font>";
			   }
		   }
		   else
		   {
			   $updatesql = "UPDATE 2022F_okumueg.User_Setting SET positive=$positive,death=$death,pd1='$pd1',pd2='$pd2',radio='$radio',upqt=$upqt,lowqt=$lowqt,iqr=$iqr,date='$date',year=$year WHERE uid=3;";
			   $updatecheck = mysqli_query($con,$updatesql);
			   if($updatecheck)
			   {
				echo "<font color=1fd655>User settings successfully updated!</font>";
			   }
			   else
			   {
				echo "<font color=red>ERROR: User settings were not saved!</font>";
			   }
			   
		   }
	}
	else
	{
		echo "<font color=red>ERROR: PLEASE LOG IN!!</font>"; 
	}
?>
