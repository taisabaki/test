<?php

class StartHandler extends Handler{

    public function get_list($params){

        $year = $params['year'];

        $table = $params['db'];

        $license_part = '';

        if($table == 'permission'){
            $license_part = ", `{$table}`.license as `license` ";
        }

        $sql = "select `{$table}`.`year`, DATE_FORMAT(`{$table}`.`date`,'%d.%m.%Y') as `date`, `{$table}`.`fk_to_unit` as `id`, `{$table}`.`link`, `unit`.`short_name` as `unit` {$license_part}
                from `{$table}` join `unit` on `{$table}`.`fk_to_unit` = `unit`.`id`
                where `{$table}`.`year` = {$year} and `{$table}`.`link` is not null order by `{$table}`.`fk_to_unit`";

        $files_data = $this->db->query($sql);

        $this->data['files'] = $files_data;

        $this->data['year'] = $year;

        return $this->getHTML('filelist_'.$table);



        function dirToArray($dir) {

            $result = array();

            if(!file_exists($dir)){
                return $result;
            }

            $cdir = scandir($dir);
            foreach ($cdir as $key => $value)
            {
                if (!in_array($value,array(".","..")))
                {
                    if (is_dir($dir . DS . $value))
                    {
                        $result[$value] = dirToArray($dir . DS . $value);
                    }
                    else
                    {
                        $result[] = explode('.', $value)[0];

                    }
                }
            }

            return $result;
        }

        function dirToLinks($dir){

            $result = array();

            if(!file_exists($dir)){
                return $result;
            }

            $cdir = scandir($dir);
            foreach ($cdir as $key => $value)
            {
                if (!in_array($value,array(".","..")))
                {
                    if (is_dir($dir . DS . $value))
                    {
                        $result[$value] = dirToLinks($dir . DS . $value);
                    }
                    else
                    {
                        $result[] = explode('webroot', $dir.DS.$value)[1];
                    }
                }
            }

            return $result;

        }

        $dir = ROOT.DS.'webroot'.DS.'uploads'.DS.$params['db'].DS.$params['year'];

        $files_list = dirToArray($dir);
        $links_list = dirToLinks($dir);

        return $files_list;

    }



}