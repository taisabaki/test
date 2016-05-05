<?php

class Ajax{

    protected static $router;

    public static $db;

    private static $messages = array(
        'error' => array(
            'paragraph_not_unique' => 'Ошибка! Номера пунктов протоколов должны быть уникальными',
            'paragraph_empty' => 'Ошибка! Номера пунктов протоколов не должны быть пустыми'
        )
    );

    public static function getMessage($status, $code){
        return isset(self::$messages[$status][$code]) ? self::$messages[$status][$code] : null;
    }

    public static function getRouter(){
        return self::$router;
    }

    public static function run($request){

        self::$db = new DB(Config::get('db.host'), Config::get('db.user'), Config::get('db.password'), Config::get('db.db_name'));

        $handler_class = ucfirst($request['handler']).'Handler';
        $handler = new $handler_class();

        $method = $request['request_method'];
        $data = isset($request['data']) ? $request['data'] : null;
        $method_key = str_replace('get_', '', $method);

        echo json_encode(array($method_key => $handler->$method($data)), JSON_UNESCAPED_UNICODE);

    }





}