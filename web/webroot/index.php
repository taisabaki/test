<?php

//define('DS', DIRECTORY_SEPARATOR);
//define('SL', '/');
//define('ROOT', dirname(dirname(__FILE__)));
//define('VIEWS_PATH', ROOT.DS.'views');
//define('CONTROLLERS_PATH', ROOT.DS.'controllers');
//
//define('SCRIPT_PATH', DS.'js');
//define('STYLE_PATH', DS.'css');

//require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'common.php');

//require_once(ROOT.DS.'lib'.DS.'init.php');

//session_start();
//App::run($_SERVER['REQUEST_URI']);

ob_start();

include('\webroot\default.html');

$a = ob_get_clean();

echo ROOT;







