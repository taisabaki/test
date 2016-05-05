<?php

class Handler{

    protected $data;

    protected $ajax;

    protected $db;

    public function getData(){
        return $this->data;
    }

    public function getAjax(){
        return $this->ajax;
    }

    public function setAjax($ajax){
        $this->ajax = $ajax;
    }

    public function __construct($data = array()){

        $this->db = Ajax::$db;

    }

    public function getHTML($template){
        $data = $this->data;
        $path = ROOT.DS.'webroot'.DS.'ajax'.DS.'templates'.DS.str_replace('handler', '', strtolower(get_class($this))).DS.$template.'.html';

        ob_start();
        include($path);
        $content = ob_get_clean();
        return $content;
    }

}