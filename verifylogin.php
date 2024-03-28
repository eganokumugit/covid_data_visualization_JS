<?php
	if(isset($_POST['username']))
	{
		   include("dbconfig.php");
		   $con = mysqli_connect($host,$username,$password,$name) or die("Cannot Connect to DB!");
		   $returnarr = array();
		   $usr = $_POST['username'];
		   $pswd = $_POST['password'];

		   $usr = stripcslashes($usr);
		   $usr = mysqli_real_escape_string($con, $usr);

		   $pswd = stripcslashes($pswd);
		   $pswd = mysqli_real_escape_string($con, $pswd);
		   
		   $sql = "select uid, name,gender from datamining.DV_User where login='$usr' and password='$pswd';";
		   $result = mysqli_query($con, $sql);
		   $msg = '';
		   if(mysqli_num_rows($result) == 0)
		   {
			   $usrsql = "select * from datamining.DV_User where login='$usr';";
			   $usrcheck = mysqli_query($con,$usrsql);

			   if(mysqli_num_rows($usrcheck) == 1)
			   {

				   $msg .= "$('.fileresult').css('border-left-color','red');";
				   $msg .= "$('#resultmessage').html('<font color=red>Your login <u>$usr</u> is correct but your password is incorrect!</font>');\n";
				   $msg .= "openForm();\n";
			   }
			   else
			   {
				   $msg .= "$('.fileresult').css('border-left-color','red');";
				   $msg .= "$('#resultmessage').html('<font color=red>The login <u>$usr</u> does NOT exist in the database!</font>');\n";
				   $msg .= "openForm();\n";
			   }
			   $returnarr['msg'] = $msg;
			   echo json_encode($returnarr,JSON_NUMERIC_CHECK);
		   }
		   else
		   {
			   $usrinfo = mysqli_fetch_array($result);
			   $uid = $usrinfo['uid'];
			   $name = $usrinfo['name'];
			   $gender = $usrinfo['gender'];


			   setcookie('uid',$uid ,time() + 6400);
			   setcookie('login',$usr ,time() + 6400);
			   setcookie('password',$pswd ,time() + 6400);
			   setcookie('name',$name ,time() + 6400);
			   setcookie('gender',$gender ,time() + 6400);
			   
			   $msg .= "$('.fileresult').css('border-left-color','#1fd655');";
			   $msg .= "$('#resultmessage').html('<font color=#1fd655>Welcome back <b>$name</b>!</font>');\n";
			   $msg .= "closeForm();\n";
			   $msg .= "$('#logon').hide();\n";
			   $msg .= "$('#logout').show();\n";
			   $msg .= "$('.loaddata').show();\n";
			   $msg .= "$('#settings').show();\n";

			   $prefsql = "SELECT uid,positive,death,pd1,pd2,radio,upqt,lowqt,iqr,date,year from 2022F_okumueg.User_Setting where uid = $uid;";
			   $prefresult = mysqli_query($con,$prefsql);
			   $returnnarr['msg'] = $msg;
			   if(mysqli_num_rows($prefresult) == 0)
			   {
				   $returnarr['hasPreference'] = false;
			   }
			   else
			   {
				   $returnarr['hasPreference'] = true;
				   $preferences = mysqli_fetch_array($prefresult);
				   $parr = array();
				   $parr['uid'] = $preferences['uid'];
				   $parr['positive'] = $preferences['positive'];
				   $parr['death'] = $preferences['death'];
				   $parr['pd1'] = $preferences['pd1'];
				   $parr['pd2'] = $preferences['pd2'];
				   $parr['radio'] = $preferences['radio'];
				   $parr['upqt'] = $preferences['upqt'];
				   $parr['iqr'] = $preferences['iqr'];
				   $parr['date'] = $preferences['date'];
				   $parr['year'] = $preferences['year'];
				   $returnarr['preferences'] = $parr;
			   }
			   $returnarr['msg'] = $msg;
			   echo json_encode($returnarr,JSON_NUMERIC_CHECK);
			   
		   }
		   mysqli_close($con);
	}
?>
