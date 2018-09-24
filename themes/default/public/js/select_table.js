$(document).ready(function (){
    $('form').submit(function(e){
        e.preventDefault();
        let table = $(this).children('select').val();
        window.location.href=`/db/view/${table}/`;
    })
})