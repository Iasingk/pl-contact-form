<?php
/**
 * Created by PhpStorm.
 * User: cesarmejia
 * Date: 10/09/2017
 * Time: 01:40 PM
 */

// Retrieve data from post.
$post_data = $_POST['data'];

// Parse data to an associative array.
$data = json_decode($post_data, true);

// Sleep for 3 seconds to simulate that server is working.
sleep(3);

// For success return 1, for error return 0.
echo 1;
// print_r($data);
