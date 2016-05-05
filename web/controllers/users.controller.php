<?php

class UsersController extends Controller{

    public function __construct($data = array()){
        parent::__construct($data);
        $this->model = new User();
    }

    public function index(){
        Router::redirect('/users/login');

    }

    public function login(){

        if($_POST && isset($_POST['login']) && isset($_POST['password'])){

            $user = $this->model->getByLogin($_POST['login']);
            $hash = md5(Config::get('salt').$_POST['password']);

            if($user && $user['is_active'] && $hash == $user['password']){
                Session::set('login', $user['login']);
                Session::set('name', $user['name']);
                Session::set('role', $user['role']);
                Router::redirect('/');
            }
            
        } elseif (Session::get('login')){
            Router::redirect('/');
        }
    }

    public function logout(){
        Session::destroy();
        Router::redirect('/users/login');
    }

}