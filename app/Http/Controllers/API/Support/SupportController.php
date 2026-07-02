<?php

namespace App\Http\Controllers\API\Support;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\Faq;
use App\Services\Support\SupportService;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    protected $supportService;

    public function __construct(SupportService $supportService)
    {
        $this->supportService = $supportService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = SupportTicket::with(['assignee', 'user.role'])
            ->withCount('messages');

        // Non-admins can only see their own tickets
        if (!$user->hasRole(['admin', 'super-admin'])) {
            $query->where('user_id', $user->id);
        } else {
            // Admin filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            if ($request->has('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }
            if ($request->has('assigned_to')) {
                $query->where('assigned_to', $request->assigned_to);
            }
        }

        $tickets = $query->latest('updated_at')->paginate($request->get('per_page', 15));

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'priority' => 'required|in:low,medium,high,emergency',
            'description' => 'required|string',
            'attachments.*' => 'nullable|file|max:5120', // 5MB max
        ]);

        $ticket = $this->supportService->createTicket($validated, $request->user());

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket,
        ], 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        
        $ticket = SupportTicket::with([
            'messages.user.role',
            'messages.attachments',
            'attachments',
            'assignee.role',
            'user.role'
        ])->findOrFail($id);

        if (!$user->hasRole(['admin', 'super-admin']) && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($ticket);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $ticket = SupportTicket::findOrFail($id);

        if (!$user->hasRole(['admin', 'super-admin']) && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'priority' => 'nullable|in:low,medium,high,emergency',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        // Only admins can assign or change priority (usually)
        $priority = $user->hasRole(['admin', 'super-admin']) && isset($validated['priority']) ? $validated['priority'] : null;
        $assignedTo = $user->hasRole(['admin', 'super-admin']) && isset($validated['assigned_to']) ? $validated['assigned_to'] : null;

        $ticket = $this->supportService->updateTicketStatus(
            $ticket, 
            $validated['status'],
            $priority,
            $assignedTo
        );

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket
        ]);
    }

    public function reply(Request $request, $id)
    {
        $user = $request->user();
        $ticket = SupportTicket::findOrFail($id);

        if (!$user->hasRole(['admin', 'super-admin']) && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'attachments.*' => 'nullable|file|max:5120',
        ]);

        $message = $this->supportService->replyToTicket($ticket, $validated, $user);

        return response()->json([
            'message' => 'Reply sent successfully',
            'data' => $message
        ]);
    }

    public function faqs()
    {
        $faqs = Faq::where('is_active', true)
            ->orderBy('category')
            ->orderBy('order')
            ->get();
            
        return response()->json($faqs);
    }
}
