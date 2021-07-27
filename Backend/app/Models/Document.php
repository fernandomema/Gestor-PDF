<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $workspace_id
 * @property string $name
 * @property string $type
 * @property string $document
 * @property mixed $data
 * @property string $created_at
 * @property string $updated_at
 * @property Workspace $workspace
 */
class Document extends Model
{
    /**
     * The "type" of the auto-incrementing ID.
     * 
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['workspace_id', 'name', 'type', 'document', 'data', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workspace()
    {
        /* Devuelve los espacios de trabajo al que pertenece el documento (relación 1:N). 
        Un documento en particular solo puede pertenecer a un workspace */
        return $this->belongsTo('App\Models\Workspace');
    }
}
