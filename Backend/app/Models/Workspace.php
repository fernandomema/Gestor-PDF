<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Document;

/**
 * @property integer $id
 * @property string $name
 * @property string $created_at
 * @property string $updated_at
 * @property Document[] $documents
 * @property UserWorkspace[] $userWorkspaces
 */
class Workspace extends Model
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
    protected $fillable = ['name', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function documents()
    {
        /* Devuelve los documentos del usuario. Definimos la relación 1:N entre los modelos Workspace y Document. Un workspace
        tiene muchos documentos */
        return $this->hasMany(Document::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        /* Definimos la relación N:M entre los modelos Workspace y User. Un workspace
        tiene muchos usuarios */
        return $this->belongsToMany(User::class);
    }
}
