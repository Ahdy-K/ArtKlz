$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target = $(e.target);
        let id= ($target.attr('data-id'));
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: function(res){
                alert('Article has been deleted');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
            
        })
    })
})