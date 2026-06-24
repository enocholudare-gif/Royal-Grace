<?php

namespace App\Http\Controllers\CaregiverManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\CaregiverManagement\AssignCaregiverServicesRequest;
use App\Http\Requests\CaregiverManagement\ListCaregiversRequest;
use App\Http\Requests\CaregiverManagement\StoreCaregiverAttendanceRequest;
use App\Http\Requests\CaregiverManagement\StoreCaregiverAvailabilityRequest;
use App\Http\Requests\CaregiverManagement\StoreCaregiverRequest;
use App\Http\Requests\CaregiverManagement\UpdateCaregiverRequest;
use App\Http\Requests\CaregiverManagement\UploadCaregiverDocumentRequest;
use App\Http\Resources\CaregiverAttendanceResource;
use App\Http\Resources\CaregiverAvailabilityResource;
use App\Http\Resources\CaregiverDocumentResource;
use App\Http\Resources\CaregiverResource;
use App\Models\Caregiver;
use App\Services\CaregiverManagement\CaregiverManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class CaregiverController extends Controller
{
    public function index(ListCaregiversRequest $request, CaregiverManagementService $caregivers): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return CaregiverResource::collection(
            $caregivers->list($validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function store(StoreCaregiverRequest $request, CaregiverManagementService $caregivers): JsonResponse
    {
        return (new CaregiverResource($caregivers->create($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Caregiver $caregiver): CaregiverResource
    {
        Gate::authorize('view', $caregiver);

        return new CaregiverResource(
            $caregiver->load(['user', 'services', 'documents', 'availabilities', 'attendanceRecords'])
        );
    }

    public function update(UpdateCaregiverRequest $request, Caregiver $caregiver, CaregiverManagementService $caregivers): CaregiverResource
    {
        return new CaregiverResource($caregivers->update($caregiver, $request->validated()));
    }

    public function uploadDocument(UploadCaregiverDocumentRequest $request, Caregiver $caregiver, CaregiverManagementService $caregivers): JsonResponse
    {
        $document = $caregivers->uploadDocument(
            $caregiver,
            $request->file('document'),
            $request->user(),
            $request->validated()
        );

        return (new CaregiverDocumentResource($document))
            ->response()
            ->setStatusCode(201);
    }

    public function assignServices(AssignCaregiverServicesRequest $request, Caregiver $caregiver, CaregiverManagementService $caregivers): CaregiverResource
    {
        return new CaregiverResource(
            $caregivers->assignServices(
                $caregiver,
                $request->validated('service_ids'),
                $request->validated('primary_service_id')
            )
        );
    }

    public function recordAttendance(StoreCaregiverAttendanceRequest $request, Caregiver $caregiver, CaregiverManagementService $caregivers): JsonResponse
    {
        return (new CaregiverAttendanceResource(
            $caregivers->recordAttendance($caregiver, $request->user(), $request->validated())
        ))->response()->setStatusCode(201);
    }

    public function createAvailability(StoreCaregiverAvailabilityRequest $request, Caregiver $caregiver, CaregiverManagementService $caregivers): JsonResponse
    {
        return (new CaregiverAvailabilityResource(
            $caregivers->createAvailability($caregiver, $request->validated())
        ))->response()->setStatusCode(201);
    }
}
