<?php

namespace App\Policies;

use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'operator']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Registration $registration): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'operator') {
            return $registration->assigned_operator_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Registration $registration): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'operator') {
            return $registration->assigned_operator_id === $user->id;
        }

        return false;
    }
}
