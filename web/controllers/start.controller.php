<?php

class StartController extends Controller{

    public function __construct($data = array()){
        parent::__construct($data);
        $this->model = new Startpage();

    }

    public function index(){

        if(!Session::get('login')){
            Router::redirect('/users/login');
        }

        $years_range = $this->model->getYearsRange();
        sort($years_range);

        $this->data['years_range'] = $years_range;

    }

    public function admin_index(){

    }


}