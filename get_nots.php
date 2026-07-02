<?php
$notifications = App\Models\User::find(2)->notifications;
file_put_contents('n.json', $notifications->toJson());
