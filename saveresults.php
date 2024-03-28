<?php
	if(isset($_COOKIE['uid']))
	{
		   include("dbconfig.php");
		   $con = mysqli_connect($host,$username,$password,$name) or die("Cannot Connect to DB!");
		if(isset($_POST['jsonobj']))
		{

				
				$jsonobj = json_decode($_POST['jsonobj'],true);
				$values = '';
				for($i = 0; $i < count($jsonobj);$i++)
				{
					   $state = $jsonobj[$i]['state'];
					   $positive = (int)$jsonobj[$i]['positive'];
					   $positiveinc = (int)$jsonobj[$i]['positiveIncrease'];
					   $death = (int)$jsonobj[$i]['death'];
					   $deathinc = (int)$jsonobj[$i]['deathIncrease'];
					   $tests = (int)$jsonobj[$i]['totalTestResults'];
					   $hospitalized = (int)$jsonobj[$i]['hospitalized'];
					   $date = $jsonobj[$i]['date'];
					 $values .= "('$state',$positive,$positiveinc, $death,$deathinc,$tests,$hospitalized,'$date'),\n";
				}
				$values = substr($values,0,-2);
				
				 $sql ="SELECT * FROM 2022F_okumueg.filtered_results;";
				 $result = mysqli_query($con, $sql);
				 if(mysqli_num_rows($result) > 0)
				 {
					 $drop = "DELETE FROM 2022F_okumueg.filtered_results;";
					 $dropresult = mysqli_query($con,$drop);
				 }
			  $insertsql = "INSERT INTO 2022F_okumueg.filtered_results(state,positive,positiveIncrease,death,deathIncrease,totalTests,hospitalized,date) VALUES $values;";
			   $insertcheck = mysqli_query($con,$insertsql);
			   if($insertcheck)
			   {
				echo "<font color=1fd655>Filtered table successfully uploaded!</font>";
			   }
			   else
			   {
				echo "<font color=red>ERROR: Filtered table could not be saved!</font>";
			   }
			   
		   
		}
		else
		{
		   echo "<font color=red>ERROR: MISSING JSON OBJECT!!</font>"; 
		}

	}
	else
	{
		echo "<font color=red>ERROR: PLEASE LOG IN!!</font>"; 
	}
?>
