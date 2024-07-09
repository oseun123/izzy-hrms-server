<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function createRole(Request $request)
    {
        try {
            $role = Role::updateOrCreate([
                'name' => $request->name,
                'description' => $request->description,
                'isDefault' => $request->isDefault
            ]);
        } catch (\Throwable $th) {
            return errorResponse('Action failed!');
        }
          
        return successResponse('Role created successfully', $role);
    }

    public function viewRole()
    {
        $roles = Role::all();
        return successResponse('Role(s) fetched successfully', $roles);
    }

    public function editRole(Request $request, $role_id)
    {
        try{
            $role = Role::findOrFail($role_id);
        }catch(\Exception $ex)
        {
            return errorResponse('Department not found', ['context'   => $ex->getMessage()]);
        }

        $role->update($request->only('name', 'description', 'isDefault'));
        
        return successResponse('Department updated successfully', ['department' => $role]);
    }

    public function deleteRole($role_id)
    {
        try{
            $role = Role::findOrFail($role_id);
        }catch(\Exception $ex)
        {
            return errorResponse('Department not found', ['context'   => $ex->getMessage()]);
        }

        $role->delete();
        
        return successResponse('Department removed from list successfully');
    }
}
