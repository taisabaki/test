<?php

class ProtocolsController extends Controller{

    public function __construct($data = array()){
        parent::__construct($data);
        $this->model = new Protocol();
    }

    public function index(){

        if (!Session::get('login')){
            Router::redirect('/');
        }

        $this->data['units'] = $this->model->get_units();



        Lang::load('ru');
    }

    public function archive(){
        Lang::load('ru');
    }

}