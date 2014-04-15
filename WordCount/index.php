<!DOCTYPE html>
<html>
<head>
<title>HTML5, CSS3 and JavaScript demo</title>
</head>
<body>
<!-- Start your code here -->

<p>Hello Weaver!</p>

<?php

$text = "A very nice to tot to text. Something nice to think about if you're into text.";


$words = str_word_count($text, 1); 

$frequency = array_count_values($words);

arsort($frequency);

echo '<pre>';
print_r($frequency);
echo '</pre>';
?>  
  
<!-- End your code here -->
</body>
</html>