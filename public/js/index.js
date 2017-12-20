
  $(document).ready(function() {
    $('select').material_select();
    //assign client to contract select menu
    $('#clientvalselect').on('change', function() {
    $('#client_name').val($('#clientvalselect').val());
//assign assassin to contract select menu
    $('#assassinvalselect').on('change', function() {
    $('#assassin_name').val($('#assassinvalselect').val());
  });
  });

  
  });
