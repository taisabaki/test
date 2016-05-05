<?php

class PermissionsController extends Controller{

    public function __construct($data = array()){
        parent::__construct($data);
        $this->model = new Permission();
    }

    public function index(){

        if (!Session::get('login')){
            Router::redirect('/');
        }

        $this->data['units'] = $this->model->get_units();

        $this->data['license_prefix'] = $this->model->get_defaults()['license_prefix'];

        Lang::load('ru');

    }

}