<?php
	if(isset($_COOKIE['uid']))
	{
		$uid = $_COOKIE['uid'];
		$name = $_COOKIE['name'];
		$login = $_COOKIE['login'];
		$gender = $_COOKIE['gender'];
		echo "User Info:\n";
		echo "___________________________\n";
		echo "UID: $uid\n";
		echo "Login: $login\n";
		echo "Name: $name\n";
		echo "Gender: $gender";
	}
	else
	{
		echo "PLEASE LOG IN";
	}

?>
