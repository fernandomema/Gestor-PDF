$(document).ready(function () {
    // Variable
    var modal = $('#modal-delete-container');

    $('#delete-account-btn').click(function (e){
        e.preventDefault(); 
        modal.css({
            'display': 'block'
        })
    })

    // Close the modal when pressing the cancel button
    $('#cancelbtn').click(function (e){
        e.preventDefault(); 
        modal.css({
            'display': 'none'
        })
    })

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function (e) {
        e.preventDefault(); 
        if (e.target == modal) {
            modal.css({
                'display': 'none'
            })
        }
    });
});