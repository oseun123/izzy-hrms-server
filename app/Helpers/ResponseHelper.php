<?php

use Illuminate\Http\Response;

if (! function_exists('successResponse')) {
    function successResponse($message = null, $data = null, Int $status_code = Response::HTTP_OK)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message, 
            'payload' => $data,
        ], $status_code);
    }
}

if (! function_exists('errorResponse')) {
    function errorResponse($message = null, $data = null, Int $status_code = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message, 
            'payload' => ["error_context" => $data]
        ], $status_code);
    }
}