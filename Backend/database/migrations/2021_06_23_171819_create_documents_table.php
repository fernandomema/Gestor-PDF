<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateDocumentsTable extends Migration {

	public function up()
	{
		Schema::create('documents', function(Blueprint $table) {
			$table->id();
			$table->string('name', 250);
			$table->string('type', 50);
			$table->longText('document');
			$table->json('data');
      		$table->unsignedBigInteger('workspace_id');
			$table->timestamps();
      
      		$table->foreign('workspace_id')->references('id')->on('workspaces');
		});
	}

	public function down()
	{
		Schema::drop('documents');
	}
}
