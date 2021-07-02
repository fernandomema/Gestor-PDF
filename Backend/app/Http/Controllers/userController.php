<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Str;

class userController extends Controller
{
    // Método que guardará los datos recibidos en formato JSON y hará las respectivas validaciones
    public function register(Request $request)
    {   
        $message = '';              // variable donde almacenaremos los errores de validación
        $usuario = new User();      // Creamos un nuevo usuario llamando al modelo User
        
        /* -------------------- Validaciones ---------------- */

        // Si el usuario introducido tiene espacios en blanco, entonces retornamos mensaje de error
        if(strpos($request->input('username'), ' ') !== false)      $message .= 'The user field has blank spaces.\n';

        // Si el nombre de usuario ya existe, entonces retornamos mensaje de error
        $user_exists = User::where('username', $request->input('username'))->first();
        if($user_exists != NULL)   $message .= 'The username already exists.\n';
        
        // Si el email introducido no es válido, entonces retornamos mensaje de error
        if(!filter_var($request->input('email'), FILTER_VALIDATE_EMAIL))    $message .= 'The email format is not valid.\n';

        // Si el correo ya existe, entonces retornamos mensaje de error
        $email_exists = User::where('email', $request->input('email'))->first();
        if($email_exists != NULL)   $message .= 'The email already exists.\n';

        // Si las contraseñas no coinciden, entonces retornamos mensaje de error
        if(strcmp($request->input('password'), $request->input('password_confirmation')) !== 0)     $message .= 'The passwords did not match.\n';
        
        // Si la variable $message NO está vacía, entonces hay errores, y retornamos el JSON con status failed
        if($message != ''){
            return ['status' => 'failed', 'msg' => $message];
        } else {    // Si no hay errores, procedemos a guardar el nuevo usuario
            $usuario->username = $request->input('username');
            $usuario->email = $request->input('email');
            $usuario->password = Hash::make($request->input('password'));
            $usuario->remember_token = Str::random(60);
            $usuario->save();       // guardamos en la base de datos
            return ['status' => 'success', 'msg' => 'New user registered successfully'];
        } 
    }

    // Método que recogerá los datos de la API y comprobará con los datos existentes en la database
    public function login(Request $request)
    {
        /* -------------------- Validaciones ---------------- */
        
        // Si no existe ningún correo en la base de datos que coincida con el introducido, retornamos error
        $user = User::where('email', $request->email)->first();
        if(!$user)          return ['status' => 'failed', 'msg' => 'The email does not exist.'];

        // Si la contraseña introducida no coincide con la contraseña del correo asociado, retornamos error
        //if(!Hash::check($request->input('password'), $user->password))  return ['status' => 'failed', 'msg' => 'The password is incorrect.'];

        if (!auth()->attempt([
            'email' => $request->email,
            'password' => $request->password,
        ])) {
            return ['status' => 'failed', 'msg' => 'The password is incorrect.'];
        }

        $accessToken = auth()->user()->createToken('authToken')->accessToken;

        // Si no ha habido ningún error, redigirimos al usuario a página de ADMIN
        return ['status' => 'success', 'msg' => 'logged in successfully', 'token' => $accessToken];    
    }

    // Método que se encargará de recoger el email (vista ForgotPassword) que se ha enviado con AJAX
    public function forgot(Request $request) 
    {
        // Si no existe ningún correo en la base de datos que coincida con el introducido, retornamos error
        $user = User::where('email', $request->email)->first();
        if(!$user)          return ['status' => 'failed', 'msg' => 'The email does not exist.'];

        // Attempt to send the password reset email to user.
        $response = Password::sendResetLink($request->only('email'));

        /* Después de intentar enviar el link de resetear la contraseña, debemos evaluar la respuesta
        para poder mostrar un mensaje en el frontal */
        if($response == Password::RESET_LINK_SENT)      return ['status' => 'success', 'msg' => 'Reset password link sent on your email id.'];
        else                                            return ['status' => 'failed', 'msg' => 'An error has occurred. Please, try later'];
    }

    // Método que se encargará de validar los campos del formulario de reset contraseña tras haber recibido el email
    public function reset(Request $request)
    {   
        $message = '';              // variable donde almacenaremos los errores de validación
        /* -------------------- Validaciones ---------------- */
        
        // Si no existe ningún correo en la base de datos que coincida con el introducido, retornamos error
        $user = User::where('email', $request->email)->first();
        if(!$user)          $message .= 'The email does not exist.\n';

        // Si las contraseñas no coinciden, entonces retornamos mensaje de error
        if(strcmp($request->input('password'), $request->input('password_confirmation')) !== 0)     $message .= 'The passwords did not match.\n';
    
        // Si la variable $message NO está vacía, entonces hay errores, y retornamos el JSON con status failed
        if($message != ''){
            return ['status' => 'failed', 'msg' => $message];
        } else {
            $status = Password::reset($request->only('email', 'password', 'password_confirmation', 'token'), 
            function ($user) use ($request){
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }); 

            if($status == Password::PASSWORD_RESET)     return ['status' => 'success', 'msg' => 'Password has been successfully changed.'];
            else                                        return ['status' => 'failed', 'msg' => 'An error has occurred. Please, try later'];

            // $reset_password_status = Password::reset($request, function ($user, $password) {
            //     $user->password = $password;
            //     $user->save();
            // });
            
        }
    }
}
