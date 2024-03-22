<?php 
$db_name = 'crud';
$dir = "backup/$db_name";

if (!is_dir($dir)) {
    if if (!@mkdir($dir, 0777, true)) {
        die("<p>Ne može se stvoriti direktorij $dir.</p></body></html>");
    }
}

$time = time();

$dbc = @mysqli_connect('localhost', 'root', '', $db_name) OR die("<p>Ne možemo se spojiti na bazu $db_name.</p></body></html>");

$r = mysqli_query($dbc, 'SHOW TABLES');

if (mysqli_num_rows($r) > 0) {
    echo "<p>Backup za bazu podataka '$db_name'.</p>";
    
    while (list($table) = mysqli_fetch_array($r, MYSQLI_NUM)) {
        $q = "SELECT * FROM $table";
        $r2 = mysqli_query($dbc, $q);
        
        if (mysqli_num_rows($r2) > 0) {
            if ($fp = gzopen ("$dir/{$table}_{$time}.sql.gz", 'w9')) {
                while ($row = mysqli_fetch_array($r2, MYSQLI_NUM)) {
                    foreach ($row as $value) {
                        $value = addslashes($value);
                        gzwrite ($fp, "'$value', ");
                    }
                    gzwrite ($fp, "\n"); 
                }
                gzclose ($fp); 
                echo "<p>Tablica '$table' je pohranjena.</p>";

            } else { 
                echo "<p>Datoteka $dir/{$table}_{$time}.sql.gz se ne može otvoriti.</p>";
                break;
            }
        }    
    }

} else {
    echo "<p>Baza $db_name ne sadrži tablice.</p>";
}

?>
