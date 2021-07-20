$(document).ready(function () {
    $('#search-bar').keyup(function (e) { 
        // Declare variables
        var input, filter, ul, li, a, i, txtValue;
        input = $('#search-bar').val();
        filter = input.toUpperCase();
        ul = $('#questions-section');
        li = $('.question');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            } else {
            li[i].style.display = "none";
            }
        }
    });
});