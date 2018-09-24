$(document).ready(function(){
    let path_split = window.location.pathname.split('/');
    $('button[name=add]').click(function(){
        window.location.href = `/db/add/${path_split[path_split.length-2]}/`;
    });
    $('button[name=change]').click(function(){
        window.location.href = `/db/change/${path_split[path_split.length-2]}?id=${$(this).val()}`;
    });
    $('button[name=delete]').click(function(){
        window.location.href = `/db/delete/${path_split[path_split.length-2]}?id=${$(this).val()}`;
    });
});