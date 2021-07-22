<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Models\Document;
use Illuminate\Http\Request;
use Auth;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $workspaces = Auth::user()->workspaces()->get();
        foreach ($workspaces as $workspace) {
            $workspace->documents = $this->documents($workspace->id);
        }
        return $workspaces;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

    //  Método para crear un nuevo workspace para el usuario
    public function store(Request $request)
    {
        $message = '';              // variable donde almacenaremos los errores de validación
        
        /* -------------------- Validaciones ---------------- */
        
        // Si el nombre del workspace está vacío, retornamos error
        if($request->name == NULL)      $message .= 'You must enter a workspace name.\n';

        // Si el nombre de workspace ya existe, entonces retornamos mensaje de error
        $workspace_exists = Auth::user()->workspaces()->where('name', $request->input('name'))->first();
        if($workspace_exists != NULL)   $message .= 'A workspace with this name already exists.\n';

        // Si la longitud de caracteres del nombre del workspace supera los 191 caracteres, retornamos error
        if(strlen($request->name) >= 191)   $message .= 'The name of the workspace is too long.\n';

        // Si la variable $message NO está vacía, entonces hay errores, y retornamos el JSON con status failed
        if($message != ''){
            return ['status' => 'failed', 'msg' => $message];
        } else {
            /* ---------------- Inserción de registro en tabla workspaces --------------- */
            // Creamos un nuevo registro en el modelo Workspace...
            $workspace = new Workspace();
    
            // y asignamos en el campo 'name' el nombre
            $workspace->name = $request->name;
    
            // Guardamos el nuevo registro Workspace
            $workspace->save();
    
            /* ---------------- Inserción de registro en tabla PIVOTE user_workspace --------------- */
            // Obtenemos el usuario actual autenticado
            $user = Auth::user();
    
            // Insertamos un nuevo registro en la tabla pivote
            $user->workspaces()->attach($workspace->id);
    
            return ['status' => 'success', 'msg' => 'A new worskpace has been created.'];
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $workspace = Auth::user()->Workspaces()->where('id', $id)->get();
        if ($workspace != null) {
            $workspace->documents = Document::where('workspace_id', $workspace->id);
            return ['status' => 'success', 'workspace' => $workspace];
        } else {
            return ['status' => 'failed', 'msg' => "workspace not found"];
        }
    }

    /**
     * Show the form for editing the specified resource.
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    
    // Método para retornar el nombre del workspace al usuario para que pueda modificarlo
    public function edit(Request $request, Workspace $workspace)
    {
        // Variable bandera que se usará para determinar si el id que enviamos le corresponde a algun workspace del usuario
        $found = false; 

        /* Validación en caso de que el usuario modifique el id */
       
        // Obtenemos el usuario actual autenticado y buscamos algún workspace con el id que le pasamos
        $user = Auth::user();
        $workspaces = $user->workspaces()->get();
        foreach($workspaces as $workspace){
            if($request->id == $workspace->id){
                $nombre = $workspace->name;
                $found = true;
                break;
            }
        }
        /* Si no se encuentra un workspace, significa que el usuario maliciosamente ha modificado el valor del
        id desde Session Storage y retornamos mensaje de error. De esta manera, evitamos que quiera acceder
        a los workspaces de otros usuarios. */
        if(!$found){
            return ['status' => 'failed', 'msg' => 'This workspace does not exist.'];
        }else{
            /* Guardando los datos en un array para mostrarlos en el Front */
            $workspace_name = array(
                'workspace_name' => $nombre
            );
            return ['status' => 'success', 'msg' => $workspace_name];
        }
        // return view('workspaces.edit', compact('workspace'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */

    //  Método para actualizar información relacionada con el workspace
    public function update(Request $request, Workspace $workspace)
    {
        $message = '';              // variable donde almacenaremos los errores de validación
        
        /* ------- Validación del nuevo nombre del Workspace ------- */
        
        // Si el nombre del workspace está vacío, retornamos error
        if($request->name == NULL)      $message .= 'You must enter a workspace name.\n';

        // Si el nombre de workspace ya existe, entonces retornamos mensaje de error
        if($request->input('name_changed') == 'true'){
            $workspace_exists = Workspace::where('name', $request->input('name'))->first();
            if($workspace_exists != NULL)   $message .= 'A workspace with this name already exists.\n';
        }

        // Si la longitud de caracteres del nombre del workspace supera los 191 caracteres, retornamos error
        if(strlen($request->name) >= 191)   $message .= 'The name of the workspace is too long.\n';

        // Si la variable $message NO está vacía, entonces hay errores, y retornamos el JSON con status failed
        if($message != ''){
            return ['status' => 'failed', 'msg' => $message];
        } else {
            $user = Auth::user();
            $workspaces = $user->workspaces()->get();
            foreach($workspaces as $workspace){
                if($request->id == $workspace->id){
                    $workspace->name = $request->name;
                    $workspace->save();
                    break;
                }
            }
            return ['status' => 'success', 'msg' => 'saves changed successfully'];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */

    //  Método para eliminar un workspace de manera permanente
    public function destroy(Request $request, Workspace $workspace)
    {
        /* Procedemos a buscar el workspace correspondiente a eliminar */
        $user = Auth::user();
        $workspaces = $user->workspaces()->get();
        foreach($workspaces as $workspace){
            if($request->id == $workspace->id){
                $deleted = Workspace::where('id', $request->input('id'))->delete();
                break;
            }
        }

        if($deleted)    return ['status' => 'success', 'msg' => 'workspace deleted successfully'];
        else            return ['status' => 'failed', 'msg' => 'An error has occurred. Try again later'];

        // $workspace->delete();
        // return back()->with('message', 'item deleted successfully');
    }

    public function documents($id) {
        return Document::where('workspace_id', $id)->get();
    }
}
