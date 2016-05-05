<?php

Config::set('site_name', 'ЭНЕРГОАТОМ - ПУСК ЭНЕРГОБЛОКОВ');

Config::set('languages', array('en', 'fr'));

// Routes. Route name => method prefix

Config::set('routes', array(
    'default' => '',
    'admin'   => 'admin_',
));

Config::set('default_route', 'default');
Config::set('default_language', 'en');
Config::set('default_controller', 'start');
Config::set('default_action', 'index');

Config::set('db.host', 'localhost');
Config::set('db.user', 'root');
Config::set('db.password', '');
Config::set('db.db_name', 'nnegc_licensing');

Config::set('PM_min', 2008);
Config::set('PM_max', date('Y') + 1);

Config::set('salt', 'rutjkfei9rjf940kd02');