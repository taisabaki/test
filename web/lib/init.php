<?php

require_once(ROOT.DS.'config'.DS.'config.php');

function __autoload($class_name){

    $lib_path = ROOT.DS.'lib'.DS.strtolower($class_name).'.class.php';
    $controller_path = ROOT.DS.'controllers'.DS.str_replace('controller','',strtolower($class_name)).'.controller.php';
    $model_path = ROOT.DS.'models'.DS.strtolower($class_name).'.php';

    $ajax_lib_path = ROOT.DS.'webroot'.DS.'ajax'.DS.'lib'.DS.strtolower($class_name).'.class.php';
    $ajax_handler_path = ROOT.DS.'webroot'.DS.'ajax'.DS.'handlers'.DS.str_replace('handler', '', strtolower($class_name)).'.handler.php';


    if( file_exists($lib_path) ){
        require_once($lib_path);
    } elseif ( file_exists($controller_path) ){
        require_once($controller_path);
    } elseif ( file_exists($model_path)){
        require_once($model_path);
    } elseif( file_exists($ajax_lib_path) ){
        require_once($ajax_lib_path);
    } elseif ( file_exists($ajax_handler_path) ){
        require_once($ajax_handler_path);
    } else {
        throw new Exception('Failed to include class: '.$class_name);
    }

}

function __($key, $default_value = ''){

    return Lang::get($key, $default_value);
}


