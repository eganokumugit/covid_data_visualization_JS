<?php
	if(isset($_COOKIE['uid']))
	{
		   if(isset($_POST['to']))
		   {
				$myemail = "okumueg@kean.edu";
				$to = $_POST['to']; 
				$subject = $_POST['subject']; 
				$msg = $_POST['msg'];
				
				$email = mail($to,$subject,$msg);
				if($email)
				{
					echo "<font color=#1fd655>MESSAGE RECEIVED</font>";
				}
				else
				{
					echo "<font color=red>ERROR:MESSAGE COULD NOT BE SENT</font>";
				}
		   }
		  else
		  {
			  echo "<font color=red>ERROR: MISSING DESTINATION ADDRESS!</font>";
		  }
	}
    else
    {
	    echo "<font color = red>ERROR: LOG IN TO SEND E-MAILS!</font>";
    }
?>
