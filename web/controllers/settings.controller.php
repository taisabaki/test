<?php

class SettingsController extends Controller{

    public function __construct($data = array()){
        parent::__construct($data);
        $this->model = new Setup();
    }

    public function index(){

        if (!Session::get('login') || Session::get('role') != 'admin'){
            Router::redirect('/');
        }

        Lang::load('ru');
    }

}