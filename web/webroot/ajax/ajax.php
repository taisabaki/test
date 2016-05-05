<?php

require_once(dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'common.php');

require_once(ROOT.DS.'lib'.DS.'init.php');

Ajax::run($_POST);
