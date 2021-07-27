<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUserWorkspaceTable extends Migration {

	public function up()
	{
		Schema::create('user_workspace', function(Blueprint $table) {
			$table->unsignedBigInteger('user_id')->unsigned()->index();
			$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
			
			$table->unsignedBigInteger('workspace_id')->unsigned()->index();
			$table->foreign('workspace_id')->references('id')->on('workspaces')->onDelete('cascade');

			$table->primary(['user_id', 'workspace_id']);

			$table->timestamps();
		});
	}

	public function down()
	{
		Schema::drop('user_workspace');
	}
}
