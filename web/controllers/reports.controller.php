<?php

class ReportsController extends Controller{

    public function __construct($data = array()){

        parent::__construct($data);

        $this->model = new Report();

    }

    public function index(){

        Router::redirect('/');

        $npp_units_pms = $this->model->getNPPsUnitsPMsList();
        foreach($npp_units_pms as $npp => $units ){
            foreach($units as $unit=>$pms){
                $this->data['report_menu']['main_list'][$unit] = $pms;
            }
        }

        $this->data['report_menu']['pm_tables'] = $this->model->getPMTablesList();
        rsort($this->data['report_menu']['pm_tables']);

        $multiplicity = 4 ; // unit labels layout - 4 per column
        $this->data['report_menu']['volume']['multiplicity'] = $multiplicity;

        // making array of NPPs for 'check by npp' button
        foreach ($this->data['report_menu']['main_list'] as $unit => $pms) {
            $npps[] = explode('-', $unit)[0];
            $this->data['report_menu']['npps'] = array_unique($npps);
        }


        if (count($npp_units_pms)){

            foreach($npp_units_pms as $npp){
                foreach(array_keys($npp) as $unit){
                    $this->data['report_menu']['ids_by_unit'][$unit] = $this->model->getUnitId($unit);
                }
            }

            // Computing columns quantity depending on data volume (number of available protocols)
            //counting units quantity/
            $k = 0 ;
            foreach ( $npp_units_pms as $npp ) {
                 $k += count(array_keys($npp));
            }
            $this->data['report_menu']['volume']['cell_unit'] = ceil($k/$multiplicity);

        }

        if (count($this->data['report_menu']['pm_tables'])){

            foreach($this->data['report_menu']['pm_tables'] as $pm){
                $pm = str_replace('pm', '', $pm);
                $this->data['report_menu']['units_by_pm'][$pm] = $this->model->getUnitsByPm($pm);

            }

            $this->data['report_menu']['unit_by_id'] = $this->model->getUnitIdList();

        }

    }

    public function view(){

        function ucfirst_Execstate($string){
            $string_parts = explode(' ', $string);
            if (count ($string_parts) == 1){
                $result = mb_convert_case($string_parts[0], MB_CASE_TITLE, "UTF-8");
            } elseif (count ($string_parts) == 2){
                $result = mb_convert_case($string_parts[0], MB_CASE_TITLE, "UTF-8").' '.$string_parts[1];
            } elseif (count ($string_parts) == 3){
                $result = mb_convert_case($string_parts[0], MB_CASE_TITLE, "UTF-8").' '.$string_parts[1].' '.$string_parts[2];
            }
            return $result;
        }

        $params = $this->getParams();

        if( !isset( $params[0]) ){
            Session::setFlash('Это как вы здесь оказались - без параметров?');
            return false;
        }

        parse_str($params[0], $data);

        if( !isset($data['exec-params']) && !isset($data['term-params'])){
            Session::setFlash('Нельзя сгенерировать отчет: условия не выбраны.');

            return false;

        } elseif( !isset($data['selected']) ){
            Session::setFlash('Нельзя сгенерировать отчет: энергоблоки и ППР не выбраны.');

            return false;

        }

        $this->data['report'] = $this->model->getReportData($data);

        if(empty( $this->data['report'] )){

            Session::setFlash("По выбранным критериям информация отсутствует.");
            return false;
        }

        $this->data['model'] = $this->model;
        foreach( $data as $key => $value ){
            if( !array_key_exists($key, $this->data) ){
                $this->data[$key] = $value;
            } else {
                $this->data['_'.$key] = $value;
            }
        }

        if ( count($this->data['report']) ){
            $unit_pm = "";
            $protocol = "";
            $execstate = "";
            if ( $data['flag'] == 'npp' ){
                if ( count($this->data['report']) > 1 ){
                    $i = 1;
                    foreach ( array_keys($this->data['report']) as $unit ){
                        $unit_parts = explode('-', $this->model->getUnitById($unit));
                        $unit_name = 'энергоблока&nbsp№&nbsp'.$unit_parts[1].'&nbspОП&nbsp"'.$unit_parts[0].'"';
                        if( $i < count(array_keys($this->data['report'])) ){
                            $unit_pm .= "ППР-".$data['selected'][$unit].'&nbsp'.$unit_name.', ';
                        } else {
                            $unit_pm .= "ППР-".$data['selected'][$unit].'&nbsp'.$unit_name;
                        }
                        $i++;
                    }
                    $protocol = 'протоколов совещаний';
                } elseif ( count($this->data['report']) == 1 ){
                    $unit = array_keys($this->data['report'])[0];
                    $unit_parts = explode('-', $this->model->getUnitById($unit));
                    $unit_name = 'энергоблока&nbsp№&nbsp'.$unit_parts[1].'&nbspОП&nbsp"'.$unit_parts[0].'"';
                    $unit_pm .= "ППР-".$data['selected'][$unit].'&nbsp'.$unit_name;
                    $protocol = 'протокола совещания';
                }
            }

            if ( $data['flag'] == 'pm' ){
                $pm_keys = array_keys($this->data['report']);
                if( count($pm_keys) == 1 ){
                    $unit_keys = array_keys($this->data['report'][$pm_keys[0]]);
                    if ( count($unit_keys) == 1 ){
                        $pm = $pm_keys[0];
                        $unit = $unit_keys[0];
                        $unit_parts = explode('-', $this->model->getUnitById($unit));
                        $unit_name = 'энергоблока&nbsp№&nbsp'.$unit_parts[1].'&nbspОП&nbsp"'.$unit_parts[0].'"';
                        $unit_pm = 'ППР-'.$pm.'&nbsp'.$unit_name;
                        $protocol = 'протокола совещания';
                    }
                } else {
                    $i = 1;
                    foreach( $this->data['report'] as $pm => $units ){
                        $unit_pm .= "ППР-".$pm.':&nbsp';
                        $j = 1;
                        foreach ( $units as $unit1 => $rows ){
                            $unit_parts = explode('-', $this->model->getUnitById($unit1));
                            $unit_name = $unit_parts[1].'&nbspОП&nbsp"'.$unit_parts[0].'"';
                            if( $i == count($this->data['report'])){
                                if( $j < count($units) ){
                                    $unit_pm .= 'энергоблока&nbsp№&nbsp'.$unit_name.', ';
                                } else {
                                    $unit_pm .= 'энергоблока&nbsp№&nbsp'.$unit_name;
                                }
                            } else {
                                $unit_pm .= 'энергоблока&nbsp№&nbsp'.$unit_name.', ';
                            }
                            $j++;
                        }
                        $i++;
                    }
                }
            }

            if ( count ($data['exec-params']) ){

                if ( count ($data['exec-params']) == 1 ){
                    $string = $this->model->getExecstate($data['exec-params'][0])['title'];
                    $execstate = ucfirst_Execstate($string);

                } elseif ( count ($data['exec-params']) == 2 ){
                    $string1 = $this->model->getExecstate($data['exec-params'][0])['title'];
                    $string2 = $this->model->getExecstate($data['exec-params'][1])['title'];
                    $execstate = ucfirst_Execstate($string1).', '.$string2;
                }

                if (isset($data['term-params']) ){

                      $execstate .= (empty($execstate)) ? 'Срок выполнения: до '.$data['term-params'] : ', срок выполнения: до '.$data['term-params'];
                }
            }

            $this->data['title'][0] = "Отчет по выполнению условий {$protocol} по результатам<br/>{$unit_pm}<br/>с перегрузкой активной зоны";
            $this->data['title'][1] = $execstate;
        }

    }

    public function createDoc(){

        $this->createReport();
        Router::redirect('/');
    }

    public function createReport(){

        $this->prepareReport();

        if ( !empty($this->data['report']) ) {

        require_once (ROOT.DS.'lib/external/vendor/phpoffice/phpword/src/PhpWord/Autoloader.php');
        \PhpOffice\PhpWord\Autoloader::register();

// Creating the new document...
        $phpWord = new \PhpOffice\PhpWord\PhpWord();

// Adding an empty Section to the document...
        $section = $phpWord->addSection(
            array(
                'orientation' => 'landscape'
            )
        );

        $fontStyle = array('name' => 'Times New Roman', 'size' => 13);
        $paragraphStyle = array(
            'align' => 'center',
            'spaceAfter' => \PhpOffice\PhpWord\Shared\Converter::pointToTwip(0)
        );

        $header = $section->addHeader();

        foreach($this->data['title'] as $row){
            $header->addText(htmlspecialchars($row),$fontStyle, $paragraphStyle);
        }

// Adding table

            $tableStyle = array(
                'borderColor' => '006699',
                'borderSize' => 6,
                'cellMargin' => 100

            );

            $firstRowStyle = array('tblHeader' => true, 'cantSplit' => true, 'bgColor' => 'DDDDDD');
            $phpWord->addTableStyle('myTable', $tableStyle, $firstRowStyle);
            $table = $section->addTable('myTable');

            //Header Row
            $table->addRow(null, $firstRowStyle);

            $firstRowCellTextStyle = array('name' => 'Times New Roman', 'size' => 13, 'bold' => true);

            $cell = $table->addCell();
            $cell->addText('№ п/п', $firstRowCellTextStyle, $paragraphStyle);

            $cell = $table->addCell();
            $cell->addText('Условие', $firstRowCellTextStyle, $paragraphStyle);

            $cell = $table->addCell();
            $cell->addText('Срок', $firstRowCellTextStyle, $paragraphStyle);

            $cell = $table->addCell();
            $cell->addText('Ответственный исполнитель', $firstRowCellTextStyle, $paragraphStyle);

            if ( count($this->data['exec-params']) > 1 ) {
                $cell = $table->addCell();
                $cell->addText('Выполнение', $firstRowCellTextStyle, $paragraphStyle);
            }

            $cell = $table->addCell();
            $cell->addText('Состояние выполнения', $firstRowCellTextStyle, $paragraphStyle);

            //Table content
//            $this->data['unit_by_id'] = function($id){
//                return $this->model->getUnitById($id);
//            };

            $rowStyle = array('cantSplit' => true);
            $cellTextStyle = array('name' => 'Times New Roman', 'size' => 13);
            $cellCenterParagraphStyle = array(
                'align' => 'center',
                'spaceAfter' => \PhpOffice\PhpWord\Shared\Converter::pointToTwip(0)
            );
            $cellJustifyParagraphStyle = array(
                'spaceAfter' => \PhpOffice\PhpWord\Shared\Converter::pointToTwip(0)
            );


            if($this->data['flag'] == 'npp') {


                foreach ($this->data['report'] as $unit => $rows) {
                    foreach ($rows as $row => $columns) {
                        $table->addRow(null, $rowStyle);

                        $cell = $table->addCell();
                        $cell->addText(
                            (!empty($columns['par'])) ? htmlspecialchars($columns['par']) : 'Нет данных.',
                            $cellTextStyle, $cellCenterParagraphStyle
                        );

                        $cell = $table->addCell();
                        $cell->addText(
                            (!empty($columns['content'])) ? htmlspecialchars($columns['content']) : 'Нет данных.',
                            $cellTextStyle, $cellJustifyParagraphStyle
                        );

                        $cell = $table->addCell();
                        $cell->addText(
                            (!empty($columns['term'])) ? htmlspecialchars(str_replace('-', '.', $this->model->convertDate($columns['term']))) : 'Нет данных.',
                            $cellTextStyle, $cellCenterParagraphStyle
                        );

                        $cell = $table->addCell();
                        $cell->addText(
                            (!empty($columns['executive'])) ? htmlspecialchars($columns['executive']) : 'Нет данных.',
                            $cellTextStyle, $cellCenterParagraphStyle
                        );

                        if ( count($this->data['exec-params']) > 1 ) {
                            $cell = $table->addCell();
                            $cell->addText(
                                (!empty($columns['executive'])) ? htmlspecialchars($columns['executive']) : 'Нет данных.',
                                $cellTextStyle, $cellCenterParagraphStyle
                            );
                        }

                        $cell = $table->addCell();
                        $cell->addText(
                            (!empty($columns['state'])) ? htmlspecialchars($columns['state']) : 'Нет данных.',
                            $cellTextStyle, $cellJustifyParagraphStyle
                        );


                    }
                }
            }

            if($this->data['flag'] == 'pm') {
                foreach ($this->data['report'] as $pm => $units) {
                    foreach ($units as $unit => $rows) {
                        foreach ($rows as $row => $columns) {
                            $table->addRow(null, $rowStyle);

                            $cell = $table->addCell();
                            $cell->addText(
                                (!empty($columns['par'])) ? htmlspecialchars($columns['par']) : 'Нет данных.',
                                $cellTextStyle, $cellCenterParagraphStyle
                            );

                            $cell = $table->addCell();
                            $cell->addText(
                                (!empty($columns['content'])) ? htmlspecialchars($columns['content']) : 'Нет данных.',
                                $cellTextStyle, $cellJustifyParagraphStyle
                            );

                            $cell = $table->addCell();
                            $cell->addText(
                                (!empty($columns['term'])) ? htmlspecialchars(str_replace('-', '.', $this->model->convertDate($columns['term']))) : 'Нет данных.',
                                $cellTextStyle, $cellCenterParagraphStyle
                            );

                            $cell = $table->addCell();
                            $cell->addText(
                                (!empty($columns['executive'])) ? htmlspecialchars($columns['executive']) : 'Нет данных.',
                                $cellTextStyle, $cellCenterParagraphStyle
                            );

                            if ( count($this->data['exec-params']) > 1 ) {
                                $cell = $table->addCell();
                                $cell->addText(
                                    (!empty($columns['executive'])) ? htmlspecialchars($columns['executive']) : 'Нет данных.',
                                    $cellTextStyle, $cellCenterParagraphStyle
                                );
                            }

                            $cell = $table->addCell();
                            $cell->addText(
                                (!empty($columns['state'])) ? htmlspecialchars($columns['state']) : 'Нет данных.',
                                $cellTextStyle, $cellJustifyParagraphStyle
                            );
                        }
                    }
                }
            }

// Saving the document as OOXML file...
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save('Report.docx');

// Saving the document as ODF file...
//        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'ODText');
//        $objWriter->save('helloWorld.odt');

// Saving the document as HTML file...
//        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'HTML');
//        $objWriter->save('helloWorld.html');
        }

    }

    public function prepareReport(){

        function ucfirst_Execstate($string){
            $string_parts = explode(' ', $string);
            if (count ($string_parts) == 1){
                $result = mb_convert_case($string_parts[0], MB_CASE_TITLE, "UTF-8");
            } elseif (count ($string_parts) == 2){
                $result = mb_convert_case($string_parts[0], MB_CASE_TITLE, "UTF-8").' '.$string_parts[1];
            } elseif (count ($string_parts) == 3){
                $result = mb_convert_case($string_parts[0], MB_CASE_TITLE, "UTF-8").' '.$string_parts[1].' '.$string_parts[2];
            }
            return $result;
        }

        $params = $this->getParams();

        if( !isset( $params[0]) ){
            Session::setFlash('Это как вы здесь оказались - без параметров?');
            return false;
        }

        parse_str($params[0], $data);

        if( !isset($data['exec-params']) && !isset($data['term-params'])){
            Session::setFlash('Нельзя сгенерировать отчет: условия не выбраны.');

            return false;

        } elseif( !isset($data['selected']) ){
            Session::setFlash('Нельзя сгенерировать отчет: энергоблоки и ППР не выбраны.');

            return false;

        }

        $this->data['report'] = $this->model->getReportData($data);

        if(empty( $this->data['report'] )){

            Session::setFlash("По выбранным критериям информация отсутствует.");
            return false;
        }

        foreach( $data as $key => $value ){
            if( !array_key_exists($key, $this->data) ){
                $this->data[$key] = $value;
            } else {
                $this->data['_'.$key] = $value;
            }
        }

        if ( count($this->data['report']) ){
            $unit_pm = "";
            $protocol = "";
            $execstate = "";
            if ( $data['flag'] == 'npp' ){
                if ( count($this->data['report']) > 1 ){
                    $i = 1;
                    foreach ( array_keys($this->data['report']) as $unit ){
                        $unit_parts = explode('-', $this->model->getUnitById($unit));
                        $unit_name = 'энергоблока № '.$unit_parts[1].' ОП "'.$unit_parts[0].'"';
                        if( $i < count(array_keys($this->data['report'])) ){
                            $unit_pm .= "ППР-".$data['selected'][$unit].' '.$unit_name.', ';
                        } else {
                            $unit_pm .= "ППР-".$data['selected'][$unit].' '.$unit_name;
                        }
                        $i++;
                    }
                    $protocol = 'протоколов совещаний';
                } elseif ( count($this->data['report']) == 1 ){
                    $unit = array_keys($this->data['report'])[0];
                    $unit_parts = explode('-', $this->model->getUnitById($unit));
                    $unit_name = 'энергоблока № '.$unit_parts[1].' ОП "'.$unit_parts[0].'"';
                    $unit_pm .= "ППР-".$data['selected'][$unit].' '.$unit_name;
                    $protocol = 'протокола совещания';
                }
            }

            if ( $data['flag'] == 'pm' ){
                $pm_keys = array_keys($this->data['report']);
                if( count($pm_keys) == 1 ){
                    $unit_keys = array_keys($this->data['report'][$pm_keys[0]]);
                    if ( count($unit_keys) == 1 ){
                        $pm = $pm_keys[0];
                        $unit = $unit_keys[0];
                        $unit_parts = explode('-', $this->model->getUnitById($unit));
                        $unit_name = 'энергоблока № '.$unit_parts[1].' ОП "'.$unit_parts[0].'"';
                        $unit_pm = 'ППР-'.$pm.' '.$unit_name;
                        $protocol = 'протокола совещания';
                    }
                } else {
                    $i = 1;
                    foreach( $this->data['report'] as $pm => $units ){
                        $unit_pm .= "ППР-".$pm.': ';
                        $j = 1;
                        foreach ( $units as $unit1 => $rows ){
                            $unit_parts = explode('-', $this->model->getUnitById($unit1));
                            $unit_name = $unit_parts[1].' ОП "'.$unit_parts[0].'"';
                            if( $i == count($this->data['report'])){
                                if( $j < count($units) ){
                                    $unit_pm .= 'энергоблока № '.$unit_name.', ';
                                } else {
                                    $unit_pm .= 'энергоблока № '.$unit_name;
                                }
                            } else {
                                $unit_pm .= 'энергоблока № '.$unit_name.', ';
                            }
                            $j++;
                        }
                        $i++;
                    }
                    $protocol = 'протоколов совещаний';
                }
            }

            if ( count ($data['exec-params']) ){

                if ( count ($data['exec-params']) == 1 ){
                    $string = $this->model->getExecstate($data['exec-params'][0])['title'];
                    $execstate = ucfirst_Execstate($string);

                } elseif ( count ($data['exec-params']) == 2 ){
                    $string1 = $this->model->getExecstate($data['exec-params'][0])['title'];
                    $string2 = $this->model->getExecstate($data['exec-params'][1])['title'];
                    $execstate = ucfirst_Execstate($string1).', '.$string2;
                }

                if (isset($data['term-params']) ){

                    $execstate .= (empty($execstate)) ? 'Срок выполнения: до '.$data['term-params'] : ', срок выполнения: до '.$data['term-params'];
                }
            }

//            $this->data['title'][0] = "Отчет по выполнению условий {$protocol} по результатам\n{$unit_pm}\nс перегрузкой активной зоны";
            $this->data['title'][0] = "Отчет по выполнению условий ".$protocol." по результатам ";
            $this->data['title'][1] = $unit_pm;
            $this->data['title'][2] = " с перегрузкой активной зоны";
            $this->data['title'][3] = $execstate;
        }

    }

}