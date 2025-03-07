<?php

namespace App\Http\Middleware;

use App\Models\Admin as ModelsAdmin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $check_admin = ModelsAdmin::where('token', $request->bearerToken());
        if($check_admin->count() == 0){
            return response($this->responses(false, 'Restricted access'), 403);
        }
        return $next($request);
    }

    function responses($status, $message, $data = array()){
        return json_encode(array(
            'status' => $status,
            'message' => $message,
            'data' => $data
        ));
    }
}
