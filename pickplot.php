<?php
	$radioval = $_POST['radioVal'];
	$data = base64_encode(json_encode(json_decode($_POST['data'])));
	$pickedPlot = $_POST['pickedPlot'];

	if($pickedPlot == 'line')
	{
		$result = shell_exec("python3  ../../cgi-bin/CPS4745/p2lineplot.cgi " . $radioval  . " "  . $data);
		echo $result;
	}
	else if($pickedPlot == 'bar')
	{
		$result = shell_exec("python3 ../../cgi-bin/CPS4745/p2barplot.cgi " . $radioval  . ' '  . escapeshellarg($data));
		echo $result;
	}
	else if($pickedPlot == 'histogram')
	{
		$date = $_POST['date'];
		$result = shell_exec("python3 ../../cgi-bin/CPS4745/p2histplot.cgi " . $radioval  . ' '  . escapeshellarg($data) . ' ' . "'$date'");
		echo $result;
	}
	else if($pickedPlot == 'pie')
	{
		$date = $_POST['date'];
		$result = shell_exec("python3 ../../cgi-bin/CPS4745/p2pieplot.cgi " . $radioval  . ' '  . escapeshellarg($data) . ' ' . "'$date'");
		echo $result;
	}
	else if($pickedPlot == 'map')
	{
		$date = $_POST['date'];
		$result = shell_exec("python3 ../../cgi-bin/CPS4745/p2geomap.cgi " . $radioval  . ' '  . escapeshellarg($data) . ' ' . "'$date'");
		echo $result;
	}
	else
	{
		echo "$('#fileresult').html(<font red>Plot doesn't exist!</font>);";
	}
?>
