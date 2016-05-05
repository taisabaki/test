<?php

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'common.php');

require_once(ROOT.DS.'lib'.DS.'init.php');

echo Config::get('site_name');

//session_start();
//App::run($_SERVER['REQUEST_URI']);





