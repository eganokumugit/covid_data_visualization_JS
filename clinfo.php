<?php
	$browser = $_SERVER['HTTP_USER_AGENT'];
	setcookie('check', '', time() + 3600,'./');
	$_COOKIE['check'] = 'cookie check';
	echo "Client Info:\n";
	echo "____________________________\n";
	echo "Browser: $browser \n";

	if(!isset($_COOKIE['check']))
	{
		echo "Cookies: Turned Off\n";
	}
	else
	{
		echo "Cookies: Enabled\n";
	}
	setcookie('check','', time()-3600);
	unset($_COOKIE['check']);
?>
