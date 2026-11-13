<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class HealthController
{
    public function __invoke(): Response
    {
        return response('ok', 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
