<?php

class Protocol extends Model{

    public function get_units(){
        $sql = "select
                `unit`.`id`,
                `unit`.`short_name` as `unit_name`,
                `npp`.`name` as `npp_name`,
                `npp`.`full_name` as `npp_full_name`
                from `unit` join `npp` on `unit`.`fk_to_npp` = `npp`.`id` order by `unit`.`id`";
        $result = $this->db->query($sql);
        $list = array();
        foreach($result as $row){
            $list[$row['id']] = array(
                'unit_name' => $row['unit_name'],
                'npp_name' => $row['npp_name'],
                'npp_full_name' => $row['npp_full_name']
            );
        }

        return $list;
    }

    public function get_defaults(){

        $sql = "select * from `defaults`";
        $result = $this->db->query($sql);
        $list = array();
        if (count($result)){
            foreach ($result as $row){
                $list[$row['name']] = $row['value'];
            }
        }

        return $list;

    }


}