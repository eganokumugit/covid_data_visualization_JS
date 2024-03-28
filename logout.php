<?php
	setcookie('uid','',time() - 6400);
	setcookie('login','',time() - 6400);
	setcookie('password','',time() - 6400);
	setcookie('name','',time() - 6400);
	setcookie('gender','',time() - 6400);


	unset($_COOKIE['uid']);
	unset($_COOKIE['login']);
	unset($_COOKIE['password']);
	unset($_COOKIE['name']);
	unset($_COOKIE['gender']);

	echo "$('.fileresult').css('border-left-color','#1fd655');";
	echo "$('#resultmessage').html('<font color=#1fd655>Logout Successful.</font>');\n";
	echo "$('#logout').hide();\n";
	echo "$('#logon').show();\n";
	echo "$('#settings').hide();\n";
?>
