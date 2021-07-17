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
        $workspace_exists = Workspace::where('name', $request->input('name'))->first();
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
    public function show(Workspace $workspace)
    {
        return view('workspaces.show', compact('workspace'));
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
        // Variable bandera que se usará para determinar si el id que enviamos le corresponde al usuario
        $found = false; 

        /* Validación en caso de que el usuario modifique el id */
       
        // Obtenemos el usuario actual autenticado
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
            return $workspace_name;
        }
        // return $workspaces;

        // return view('workspaces.edit', compact('workspace'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Workspace $workspace)
    {
        /* ------- Validación del nombre del Workspace ------- */
        $validatedData = $request->validate([
            'name' => ['required', 'max:191']
        ]);
        if($validatedData->validated()){
            $workspace->name = $request->name;
            return ['status' => 'success', 'msg' => 'The worskpace has been updated.'];
        } else{
            $errors = $validator->errors();
            return ['status' => 'failed', 'msg' => $errors];
        }
        $workspace->update($request->all());

        // return back()->with('message', 'item updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return back()->with('message', 'item deleted successfully');
    }

    public function documents($id) {
        return Document::where('workspace_id', $id)->get();
    }
}
