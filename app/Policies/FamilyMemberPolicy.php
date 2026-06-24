<?php

namespace App\Policies;

use App\Models\FamilyMember;
use App\Models\User;

class FamilyMemberPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function view(User $user, FamilyMember $familyMember): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'family-member' && $user->familyMember?->id === $familyMember->id);
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }

    public function update(User $user, FamilyMember $familyMember): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true)
            || ($user->role?->slug === 'family-member' && $user->familyMember?->id === $familyMember->id);
    }

    public function delete(User $user, FamilyMember $familyMember): bool
    {
        return in_array($user->role?->slug, ['super-admin', 'admin'], true);
    }
}
