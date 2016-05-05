<?php

require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'common.php');

require_once(ROOT.DS.'lib'.DS.'init.php');

if(isset($_REQUEST['action'])){

    if($_REQUEST['action'] = 'upload'){

        $db = new DB(Config::get('db.host'), Config::get('db.user'), Config::get('db.password'), Config::get('db.db_name'));

        $category = $_REQUEST['category'];
        $year = $_REQUEST['year'];
        $id = $_REQUEST['id'];
echo '<pre>';
        print_r($_FILES);
        echo UPLOAD_ERR_OK;
        return false;
        if ($_FILES["file"]["error"] == UPLOAD_ERR_OK) {

            $tmp_name = $_FILES["file"]["tmp_name"];
            $dirname = ROOT.DS.'webroot'.DS.'uploads'.DS.$category.DS.$year;
            if(!file_exists($dirname)){
                mkdir($dirname);
            }
            $ext = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
            $name = $year.'-'.$id.'.'.$ext;
            $db_path = DS.'uploads'.DS.$category.DS.$year.DS.$name;
            $link = $db->escape($db_path);
            $path = ROOT.DS.'webroot'.$db_path;

            if(move_uploaded_file($tmp_name, $path)){
                $table = substr($category, 0, -1);
                $sql = "update `{$table}` set `link` = '{$link}' where `fk_to_unit` = {$id} and `year` = {$year}";

                if($db->query($sql)){
                    Router::redirect(SL.$category);
                }

            }
        }


    }

    return false;
}

