<?php
$xml = simplexml_load_file('LV2.xml');

function getGender($spol) {
    return substr($spol, 0, 1);
}

function getImageTag($imageUrl, $imageSize) {
    return "<img src='$imageUrl' $imageSize>";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Records</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>
<body>

<div class="container">
    <?php foreach ($xml->record as $record): ?>
        <?php
        $gender = getGender($record->spol);
        $imageSize = @getimagesize($record->slika);
        ?>
        <div class="row mb-3">
            <div class="col-md-6">
                <div class="d-flex align-items-center">
                    <div class="me-3"><?php echo getImageTag($record->slika, $imageSize[3]); ?></div>
                    <div>
                        <div class="fw-bold">#<?php echo $record->id . ' ' . $record->ime . ' ' . $record->prezime . ' [' . $gender . ']'; ?></div>
                        <div><?php echo $record->email; ?></div>
                        <div><?php echo $record->zivotopis; ?></div>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
</body>
</html>
