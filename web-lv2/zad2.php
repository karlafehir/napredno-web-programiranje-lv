<?php

function encrypt_file($inputFile, $outputFile) {
    $encryption_key = md5('jed4n j4k0 v3l1k1 kljuc');
    $cipher = "AES-128-CTR";
    $options = 0;
    $iv_length = openssl_cipher_iv_length($cipher);
    $encryption_iv = random_bytes($iv_length);

    $data = file_get_contents($inputFile);
    $encrypted_data = openssl_encrypt($data, $cipher, $encryption_key, $options, $encryption_iv);

    file_put_contents($outputFile, $encrypted_data);
}

function decrypt_file($inputFile, $outputFile) {
    $decryption_key = md5('jed4n j4k0 v3l1k1 kljuc');
    $cipher = "AES-128-CTR";
    $options = 0;

    $data = file_get_contents($inputFile);
    $decrypted_data = openssl_decrypt($data, $cipher, $decryption_key, $options);

    file_put_contents($outputFile, $decrypted_data);
}

if(isset($_POST['submit'])) {
    if(isset($_FILES['file'])) {
        $uploadedFile = $_FILES['file']['tmp_name'];
        $encryptedFile = 'encrypted_file.enc';
        encrypt_file($uploadedFile, $encryptedFile);
        echo "Datoteka uspješno enkriptirana.";
    } else {
        echo "Niste uploadali datoteku.";
    }
}

if(isset($_POST['decrypt'])) {
    $encryptedFile = 'encrypted_file.enc';
    $decryptedFile = 'decrypted_file.jpg';
    decrypt_file($encryptedFile, $decryptedFile);
    echo "Datoteka uspješno dekriptirana.";
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>File Encryption and Decryption</title>
</head>
<body>

<h2>File Encryption and Decryption</h2>

<form method="post" enctype="multipart/form-data">
    Odaberite datoteku:<br>
    <input type="file" name="file" id="file"><br>
    <input type="submit" value="Upload & Encrypt" name="submit">
</form>

<form method="post">
    <input type="submit" value="Decrypt & Download" name="decrypt">
</form>

</body>
</html>
