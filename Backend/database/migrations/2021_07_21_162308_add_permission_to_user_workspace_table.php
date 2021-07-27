<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPermissionToUserWorkspaceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_workspace', function (Blueprint $table) {
            $table->boolean('canCreate')->default(false);
            $table->boolean('canUpload')->default(false);
            $table->boolean('canRename')->default(false);
            $table->boolean('canPrint')->default(false);
            $table->boolean('canFill')->default(false);
            $table->boolean('canSign')->default(false);
            $table->boolean('canDelete')->default(false);
            $table->boolean('isManager')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_workspace', function (Blueprint $table) {
            $table->dropColumn('canCreate');
            $table->dropColumn('canUpload');
            $table->dropColumn('canRename');
            $table->dropColumn('canPrint');
            $table->dropColumn('canFill');
            $table->dropColumn('canSign');
            $table->dropColumn('canDelete');
            $table->dropColumn('isManager');
        });
    }
}
