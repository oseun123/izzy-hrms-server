<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditableObserver
{
    public function created($model)
    {
        $this->log($model, 'created');
    }

    public function updated($model)
    {
        $this->log($model, 'updated');
    }

    public function deleted($model)
    {
        $this->log($model, 'deleted');
    }

    protected function log($model, $event)
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->id,
            'old_values' => $event === 'updated' ? $model->getOriginal() : null,
            'new_values' => $event === 'updated' ? $model->getChanges() : null,
            'url' => Request::fullUrl(),
            'ip_address' => Request::ip(),
        ]);
    }
}
