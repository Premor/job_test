$(document).ready(function(){
    $('button[name=add]').click(function(){
        let path_split = window.location.pathname.split('/');
        window.location.href = `/db/add/${path_split[path_split.length-2]}`;
    })
});