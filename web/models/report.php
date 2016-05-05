<?php

class Report extends Model{

    public function getReportData($data){

        $count = count($data['exec-params']);
        $exec_string = "";
        if ( $count > 1 ){
            $i = 0;
            while ( $i < $count - 1 ){
                $exec_string .= "execstate = ".$data['exec-params'][$i]." or ";
                $i++;
            }
            $exec_string .= "execstate = ".$data['exec-params'][$i];
        } else {
            $exec_string = "execstate = ".$data['exec-params'][0];
        }

        if( $data['flag'] == 'npp' ){

            foreach( $data['selected'] as $unit => $pm){
                $table = Config::get('pm_table_prefix').$pm;
                if( !isset($data['term-params']) ){
                    $sql = "select par, content, term, executive, execstate, state from {$table} where unit = {$unit} and ({$exec_string}) order by par";
                } else {
                    $term = $this->convertDate($data['term-params']);
                    $sql = "select par, content, term, executive, execstate, state from {$table} where unit = {$unit} and ({$exec_string}) and term <= '{$term}' order by par";
                }
                $temp = $this->db->query($sql);
                if (!empty($temp)){
                    $result[$unit] = $temp;

                }
            }
        }


        if ( $data['flag'] == 'pm' ){

            foreach( $data['selected'] as $pm => $units){
                $table = Config::get('pm_table_prefix').$pm;
                foreach( $units as $index => $unit){
                    if( !isset($data['term-params']) ){
                        $sql = "select par, content, term, executive, execstate, state from {$table} where unit = {$unit} and ({$exec_string}) order by par";
                    } else {
                        $term = $this->convertDate($data['term-params']);
                        $sql = "select par, content, term, executive, execstate, state from {$table} where unit = {$unit} and ({$exec_string}) and term <= '{$term}' order by par";
                    }
                    $temp = $this->db->query($sql);
                    if (!empty($temp)){
                        $result[$pm][$unit] = $temp;
                    }
                }
            }
        }

        return isset($result)? $result : null; //array: unit=> execstate => rows
    }

    public function getUnitsByPm($pm){
        $list = array();
        $table = Config::get('pm_table_prefix').$pm;
        $sql = "select unit from {$table} group by unit";
        $result = $this->db->query($sql);
        foreach ( $result as $row ){
            $list[] = $row['unit'];
        }

        return $list;
    }

    public function convertDate($date){
        $date_parts = explode('-', $date);
        return implode('-', array_reverse($date_parts));
    }

    public function getExecstate($execstate){
        $result = "";
        switch ($execstate){
            case "0":
                $result['title'] = "не выполненные";
                $result['table'] = "Не выполнено";
                break;
            case "1":
                $result['title'] = "на стадии выполнения";
                $result['table'] = "На стадии выполнения";
                break;
            case "2":
                $result['title'] = "выполненные";
                $result['table'] = "Выполнено";
                break;
        }
        return $result;
    }

}