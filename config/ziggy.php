<?php

return [
    'groups' => [
        'guest' => ['welcome', 'announcement'],
        'student' => ['student.*', 'welcome', 'announcement', 'dashboard'],
        'operator' => ['operator.*'],
        'admin' => ['admin.*', 'workspace'],
    ],
];