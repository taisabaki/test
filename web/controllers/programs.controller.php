<?php

class ProgramsController extends Controller{

    public function __construct($data = array()){
        parent::__construct($data);
    }

    public function index(){

        Router::redirect('/');

        if (!Session::get('login')){
            Router::redirect('/');
        }

        $this->model = new Protocol();

        Lang::load('ru');
    }

    public function archive(){
        Lang::load('ru');
    }

}