<?php

class StartPage extends Model{

    public function getYearsRange(){
        $sql = "select `min`, `max` from `years_range`";
        $result = $this->db->query($sql);
        $min = (int)$result[0]['min'];
        $max = $result[0]['max'];

        if($max == 'next'){
            $max = date('Y') + 1;
        } else {
            $max = (int)$max;
        }

        return range($max, $min);
    }

}