<?php

########### CONFIG ###############
$recipient = $_POST['sendEmailToResetPw'];
$redirect = 'http://127.0.0.1:5500/login.html';
$name = 'JOIN Support Team';
$message = "Hi there,\n
\nClick on the following link to reset your JOIN password for your $recipient account.\n
\nhttps://tobias-odermatt.developerakademie.net/Join/templates/resetPw.html?email=$recipient\n
\nIf you did not ask to reset your password, you can ignore this email.\n
\nThanks,\n
Your JOIN team";

########### CONFIG END ###########

########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $subject = "Reset password for JOIN App";
        $headers = "From:  noreply@https://tobias-odermatt.developerakademie.net";
        # noreply@tobias-odermatt.developerakademie.net
        # noreply@https://tobias-odermatt.developerakademie.net"
        # $headers = "From:  noreply@developerakademie.com";
        mail($recipient, $subject, $message, $headers);
        //header("Location: " . $redirect);

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}

#        "Location:".$_SERVER['HTTP_REFERER'] // => stay on same page
#         "Location: https://gruppenarbeit-486join.developerakademie.net/index.html" // => redirect to other html page

