<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

use App\Models\Workspace;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function workspaces()
    {
        return $this->belongsToMany(Workspace::class);
    }

    // Método que enviará el link del reset de contraseña al correo del usuario que lo solicitó
    public function sendPasswordResetNotification($token)
    {
        $url = 'https://localhost/Gestor_PDF_Frontend/frontend/pages/reset_password.html?token='.$token;

        $this->notify(new ResetPasswordNotification($url));
    }
}
