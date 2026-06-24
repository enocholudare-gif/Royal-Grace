<?php

namespace App\Http\Controllers\ServiceManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceManagement\ListServicesRequest;
use App\Http\Requests\ServiceManagement\StoreServiceRequest;
use App\Http\Requests\ServiceManagement\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\ServiceManagement\ServiceManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ServiceController extends Controller
{
    public function index(ListServicesRequest $request, ServiceManagementService $services): AnonymousResourceCollection
    {
        $validated = $request->validated();

        return ServiceResource::collection(
            $services->list($validated, (int) ($validated['per_page'] ?? 15))
        );
    }

    public function store(StoreServiceRequest $request, ServiceManagementService $services): JsonResponse
    {
        $service = $services->create($request->validated());

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Service $service): ServiceResource
    {
        return new ServiceResource($service);
    }

    public function update(UpdateServiceRequest $request, Service $service, ServiceManagementService $services): ServiceResource
    {
        return new ServiceResource(
            $services->update($service, $request->validated())
        );
    }

    public function disable(Service $service, ServiceManagementService $services): ServiceResource
    {
        Gate::authorize('update', $service);

        return new ServiceResource($services->disable($service));
    }

    public function destroy(Service $service, ServiceManagementService $services): JsonResponse
    {
        Gate::authorize('delete', $service);

        $services->delete($service);

        return response()->json([
            'message' => 'Service deleted successfully.',
        ]);
    }
}
