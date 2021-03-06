<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Str;
use Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Illuminate\Validation\Rules\Password as RulesPassword;

class userController extends Controller
{
    // Método que guardará los datos recibidos en formato JSON y hará las respectivas validaciones
    public function register(Request $request)
    {   
        $message = '';              // variable donde almacenaremos los errores de validación
        $usuario = new User();      // Creamos un nuevo usuario llamando al modelo User
        
        /* -------------------- Validaciones ---------------- */

        // Si el nombre del workspace está vacío, retornamos error
        if($request->input('username') == NULL)      $message .= 'You must enter an username.\n';
        
        // Si la longitud de caracteres del nombre de usuario supera los 191 caracteres, retornamos error
        if(strlen($request->input('username')) >= 191)   $message .= 'The username is too long.\n';
        
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
            /* -------- Creando un nuevo workspace al usuario por defecto --------- */
            /* ---------------- Inserción de registro en tabla workspaces --------------- */
            // Creamos un nuevo registro en el modelo Workspace...
            $workspace = new Workspace();

            // y asignamos en el campo 'name' el nombre
            $workspace->name = 'Personal Workspace';

            // Guardamos el nuevo registro Workspace
            $workspace->save();

            /* ---------------- Inserción de registro en tabla PIVOTE user_workspace --------------- */
            // Insertamos un nuevo registro en la tabla pivote
            $usuario->workspaces()->attach($workspace->id, array('isManager' => true));

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
        return [
            'status' => 'success', 
            'msg' => 'logged in successfully', 
            'token' => $accessToken,
            'username' => $request->user()->username,
            'avatar' => "https://www.gravatar.com/avatar/" . md5( strtolower( trim( $request->email ) ) )
        ];    
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
    
        // Si el campo correo está vacío, retornamos error
        if($request->input('email') == NULL)      $message .= 'You must enter your email.\n';

        // Si no existe ningún correo en la base de datos que coincida con el introducido, retornamos error
        $user = User::where('email', $request->email)->first();
        if(!$user)          $message .= 'The email does not exist.\n';

        // Si el campo contraseña está vacío, retornamos error
        if($request->input('password') == NULL)      $message .= 'You must enter a new password.\n';

        // Si el campo repetir contraseña está vacío, retornamos error
        if($request->input('password_confirmation') == NULL)      $message .= 'You must enter again your new password.\n';

        // Si la longitud de caracteres del campo contraseña o repetir contraseña supera los 191 caracteres, retornamos error
        if(strlen($request->input('password')) >= 191 || strlen($request->input('password_confirmation')) >= 191)   $message .= 'The password(s) is/are too long.\n';
        
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
        }
    }

    // Método para mostrar la información del usuario en la página de Profile & Account settings
    public function show_info(Request $request)
    {
        /* Guardando los datos en un array para mostrarlos en el Front */
        $user_info = array(
            'username' => $request->user()->username,
            'email' => $request->user()->email
        );

        if($user_info['username'] == NULL || $user_info['email'] == NULL)    return ['status' => 'failed', 'msg' => 'An error has occurred. Try again later'];
        else return ['status' => 'success', 'msg' => $user_info];
    }

    // Método para editar los cambios hechos en la página de Profile & Account settings
    public function edit(Request $request)
    {
        $message = '';              // variable donde almacenaremos los errores de validación

        /* -------------------- Validaciones ---------------- */
        
        // Si ha habido algún cambio en el nombre, realizamos algunas validaciones
        if($request->input('name_changed') == 'true'){
            // Si el usuario introducido tiene espacios en blanco, entonces retornamos mensaje de error
            if(strpos($request->input('name'), ' ') !== false)      $message .= 'The user field has blank spaces.\n';

            // Si el campo contraseña está vacío, retornamos error
            if($request->input('name') == NULL)      $message .= 'You must enter a new username.\n';
            
            // Si la longitud de caracteres del nombre de usuario supera los 191 caracteres, retornamos error
            if(strlen($request->input('name')) >= 191)   $message .= 'The username is too long.\n';
            
            // Si el nombre de usuario ya existe, entonces retornamos mensaje de error
            $user_exists = User::where('username', $request->input('name'))->first();
            if($user_exists != NULL)   $message .= 'The username already exists.\n';
        }
        
        // Si ha habido algún cambio en el correo, realizamos algunas validaciones
        if($request->input('email_changed') == 'true'){
            // Si el campo correo está vacío, retornamos error
            if($request->input('email') == NULL)      $message .= 'You must enter an email.\n';
            
            // Si el email introducido no es válido, entonces retornamos mensaje de error
            if(!filter_var($request->input('email'), FILTER_VALIDATE_EMAIL))    $message .= 'The email format is not valid.\n';
            
            // Si la longitud de caracteres del nombre de correo supera los 191 caracteres, retornamos error
            if(strlen($request->input('email')) >= 191)   $message .= 'The email is too long.\n';
            
            // Si el correo ya existe, entonces retornamos mensaje de error
            $email_exists = User::where('email', $request->input('email'))->first();
            if($email_exists != NULL)   $message .= 'The email already exists.\n';
        }

        // Si el usuario quiere cambiar su contraseña, hacemos primero algunas validaciones
        if($request->input('update_pass') == 'true'){
            // Si el usuario ha dejado en blanco el campo para escribir su contraseña actual, mostramos error
            if($request->input('current_password') == NULL){
                $message .= 'You must enter your current password to change it.\n';
            }

            // Si el usuario ha dejado en blanco el campo para escribir una nueva contraseña, mostramos error
            if($request->input('new_password') == NULL){
                $message .= 'You must enter a new password.\n';
            }

            // Si el usuario no ha vuelto a confirmar la nueva contraseña, mostramos error
            if($request->input('confirm_new_password') == NULL){
                $message .= 'You must enter again the new password.\n';
            }

            // Si la contraseña introducida no coincide con la contraseña del usuario actual, retornamos error
            if(!Hash::check($request->input('current_password'), Auth::user()->password)){
                $message .= 'The password is not correct.\n';
            }

            // Si la longitud de caracteres del campo contraseña supera los 191 caracteres, retornamos error
            if(strlen($request->input('new_password')) >= 191)   $message .= 'The new password is too long.\n';

            // Si las contraseñas no coinciden, entonces retornamos mensaje de error
            if(strcmp($request->input('new_password'), $request->input('confirm_new_password')) !== 0) {
                $message .= 'The passwords did not match.\n';
            }    
        }

        // Si la variable $message NO está vacía, entonces hay errores, y retornamos el JSON con status failed
        if($message != ''){
            return ['status' => 'failed', 'msg' => $message];
        } else {
            $user = Auth::user();    
            $user->username = $request->input('name');
            $user->email = $request->input('email');
            if($request->input('update_pass') == 'true'){
                $user->password = Hash::make($request->input('new_password'));
            }
            $user->save();
            return ['status' => 'success', 'msg' => 'saves changed successfully'];
        }
    }

    // Método para cerrar sesión
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return ['status' => 'success', 'msg' => 'logged out successfully'];
    }
    
    // Método para eliminar una cuenta
    public function delete(Request $request)
    {
        $user = Auth::user();

        $request->user()->token()->revoke();

        if($user->delete())     return ['status' => 'success', 'msg' => 'Your account has been deleted!'];
        else                    return ['status' => 'failed', 'msg' => 'An error has occurred. Try again later'];
    }
}
