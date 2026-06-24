<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignRoleRequest;
use App\Models\User;
use App\Services\UserAccess\AssignRoleService;
use Illuminate\Http\JsonResponse;

class RoleAssignmentController extends Controller
{
    public function __invoke(AssignRoleRequest $request, User $user, AssignRoleService $service): JsonResponse
    {
        $updatedUser = $service->handle($user, $request->validated('role'));

        return response()->json([
            'message' => 'Role assigned successfully.',
            'user' => $updatedUser,
        ]);
    }
}
