<?php

namespace App\Http\Controllers\ClientManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientManagement\StoreClientRequest;
use App\Http\Requests\ClientManagement\UpdateClientRequest;
use App\Http\Requests\ClientManagement\UploadClientAttachmentRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ClientCollection;
use App\Models\Client;
use App\Repositories\Contracts\ClientRepositoryInterface;
use App\Services\ClientManagement\ClientManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClientController extends Controller
{
    public function __construct(
        protected ClientRepositoryInterface $clientRepository,
        protected ClientManagementService $clientService
    ) {}

    public function index(Request $request): ClientCollection
    {
        Gate::authorize('viewAny', Client::class);

        $perPage = (int) $request->input('per_page', 15);
        $with = ['user'];
        
        if ($request->has('search')) {
            $clients = $this->clientRepository->search($request->input('search'), $with, $perPage);
        } else {
            $filters = $request->only(['status', 'city']);
            $clients = $this->clientRepository->all($filters, $with, $perPage);
        }

        return new ClientCollection($clients);
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        Gate::authorize('create', Client::class);

        $client = $this->clientService->createClient($request->validated());

        return (new ClientResource($client->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Client $client): ClientResource
    {
        Gate::authorize('view', $client);

        return new ClientResource($client->load(['user', 'familyMembers.user', 'attachments']));
    }

    public function update(UpdateClientRequest $request, Client $client): ClientResource
    {
        Gate::authorize('update', $client);

        $client = $this->clientService->updateClient($client, $request->validated());

        return new ClientResource($client->load('user'));
    }

    public function destroy(Client $client): JsonResponse
    {
        Gate::authorize('delete', $client);

        $this->clientService->deleteClient($client);

        return response()->json(['message' => 'Client deleted successfully.']);
    }

    public function restore(int $id): JsonResponse
    {
        Gate::authorize('restore', Client::class);

        $this->clientService->restoreClient($id);

        return response()->json(['message' => 'Client restored successfully.']);
    }

    public function bookings(Client $client): JsonResponse
    {
        Gate::authorize('view', $client);
        // Using standard pagination for sub-resources
        return response()->json($client->bookings()->with(['service', 'assignedCaregiver.user'])->paginate(10));
    }

    public function payments(Client $client): JsonResponse
    {
        Gate::authorize('view', $client);
        return response()->json(
            \App\Models\Payment::whereHas('booking', function($query) use ($client) {
                $query->where('client_id', $client->id);
            })->with('booking')->paginate(10)
        );
    }

    public function visitReports(Client $client): JsonResponse
    {
        Gate::authorize('view', $client);
        return response()->json(
            \App\Models\VisitReport::whereHas('booking', function($query) use ($client) {
                $query->where('client_id', $client->id);
            })->with('booking')->paginate(10)
        );
    }

    public function familyMembers(Client $client): JsonResponse
    {
        Gate::authorize('view', $client);
        return response()->json($client->familyMembers()->with('user')->get());
    }

    public function uploadAttachment(UploadClientAttachmentRequest $request, Client $client): JsonResponse
    {
        Gate::authorize('update', $client);

        $attachment = $this->clientService->uploadAttachment($client, $request->file('attachment'));

        return response()->json([
            'message' => 'Attachment uploaded successfully.',
            'attachment' => $attachment,
        ], 201);
    }
}
