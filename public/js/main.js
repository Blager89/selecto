//create a table when loading a page
$( document ).ready(function() {
    document.onload = loadUsers();
});

//get the role of a logged-in user and his id
var userRole = $('#userRole').text();
var authUserId = $('#AuthUserId').text();

//start a user search
$('#searchUser').on('click',function () {
    var searchValue = $('#searchInput').val();
    search(searchValue);

});

//user search function
function search(searchValue) {

    var url = "/search";
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax(
        {
            url: url,
            type: 'POST',
            dataType: "JSON",
            data:{
                search:searchValue,
                userRole:userRole,
                userId:authUserId,
            },
            success: function (response)
            {
                console.log(response);
                show(response);

            },

        });

}


//we get data about all users
function loadUsers() {
    var url = "/users";

    $.ajax(
        {
            url: url,
            type: 'GET',
            dataType: "JSON",
            data:{
              userId:authUserId,

            },
            success: function (response)
            {
                console.log(response);
                show(response);
            }
        });





}

//user table generation function
function show(response) {

    // clean table
    $('.myTableRow').remove();
    $('#createForm').remove();


    // add row


    for (var i = 0; i < response.length; i++) {
        var utype = response[i].utype;
        if (utype == 2) {
            $('#table-body').append('<tr class="myTableRow">' +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + response[i].username + "</td>" +
                "<td>" + response[i].email + "</td>" +

                "<td class='delete'><button class='btn btn-warning' id=" + response[i].id + ">Update</button></td>" +
                "<td class='update'><button class='btn btn-danger' id=" + response[i].id + ">delete</button></td>" +

                "</tr>");
        } else if (utype == 1) {
            $('#table-body').append('<tr class="myTableRow">' +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + response[i].username + "</td>" +
                "<td>" + response[i].email + "</td>" +
                "<td class='delete'><button class='btn btn-warning' id=" + response[i].id + ">Update</button></td>" +
                "</tr>");
        } else {
            $('#table-body').append('<tr class="myTableRow">' +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + response[i].username + "</td>" +
                "<td>" + response[i].email + "</td>" +
                "<td></td>" +
                "</tr>");
        }
    }


    $('.update button').on('click', function () {
        var userId = $(this).attr('id');
        deleteUser(userId);

        $(this).closest ('tr').remove ();
    });

    $('.delete button').on('click', function () {
        var userId = $(this).attr('id');
        edit(userId);

    });


}

//refresh users button
$('#button').click(loadUsers);


$('#createUser').click(function () {
    createUser();
});

//create user table
function createUser() {


    // clean table
    $('.myTableRow').remove();
    $('#createForm').remove();


    $('.card-body').append(
        '<div id="createForm"><div class="form-group">\n' +
        '    <label for="createUsername">Username</label>\n' +
        '    <input type="text" class="form-control" id="createUsername" aria-describedby="emailHelp" placeholder="Enter username" required>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="createEmail">Email address</label>\n' +
        '    <input type="email" class="form-control" id="createEmail" aria-describedby="emailHelp" placeholder="Enter email" required>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="createPassword">Password</label>\n' +
        '    <input type="password" class="form-control" id="createPassword" aria-describedby="emailHelp" placeholder="Enter password" required>\n' +
        '  </div>'+

        '<div class="form-group">\n' +
        '    <label for="createRole">Example multiple select</label>\n' +
        '    <select  class="form-control" id="createRole">\n' +
        '      <option value="0">User</option>\n' +
        '      <option value="1">Admin</option>\n' +
        '    </select>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="createName">Name</label>\n' +
        '    <input type="text" class="form-control" id="createName" aria-describedby="emailHelp" placeholder="Enter name">\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="createSurname">Surname</label>\n' +
        '    <input type="text" class="form-control" id="createSurname" aria-describedby="emailHelp" placeholder="Enter surname">\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="createPhone">Phone</label>\n' +
        '    <input type="number" class="form-control" id="createPhone" aria-describedby="emailHelp" placeholder="Enter phone">\n' +
        '  </div>' +
        '<button id="userCreate" class="btn btn-success">Create</button>'+
        '</div>'

    );
    $('#userCreate').on('click', function () {

        var createUsername = $('#createUsername').val();
        var createEmail = $('#createEmail').val();
        var createPassword = $('#createPassword').val();
        var createRole = $('#createRole').val();
        var createName = $('#createName').val();
        var createSurname = $('#createSurname').val();
        var createPhone = $('#createPhone').val();
        create(createUsername,createEmail,createPassword,createRole,createName,createSurname,createPhone);
    });




}
//send data to create a user
function create(createUsername,createEmail,createPassword,createRole,createName,createSurname,createPhone) {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax(
        {
            url: 'users',
            type: 'POST',
            dataType: "JSON",
            data: {
                username:createUsername,
                email:createEmail,
                password: createPassword,
                role: createRole,
                //aboutUser
                name: createName,
                surname:createSurname,
                phone:createPhone,

            },

            success: function (response)
            {
                console.log(response);

                loadUsers();
            },
            error: function(data) {
                $('.errorMsg').remove();
                data = data['responseJSON'];
                for (key in data['errors']) {
                    arr = data['errors'][key];
                    for (i = 0; i < arr.length; i++) {
                        console.log(arr[i]);
                        $('#table-body').append('<tr class="myTableRow errorMsg" >' +
                            "<td colspan='5'><div class=\"alert alert-danger\" role=\"alert\">\n" +
                            arr[i] +
                            "</div></td>" +

                            "</tr>");
                    }

                }

            }

        });
}
//get  data for the update
function edit(id) {

    var url = "/users/"+id+'/edit';
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax(
        {
            url: url,
            type: 'GET',
            dataType: "JSON",
            success: function (response)
            {
                console.log(response);
                editTable(response);

            },

        });

}
//show  update table with user data
function editTable(response) {

    $('.myTableRow').remove();
    $('#createForm').remove();


    if (response.name == "null"){
        response.name = '';
    }
    if (response.surname == "null"){
        response.surname = '';
    }


    $('.card-body').append(
        '<div id="createForm"><div class="form-group">\n' +
        '    <label for="updateUsername">Update username</label>\n' +
        '    <input type="text" class="form-control" id="updateUsername" aria-describedby="emailHelp" value='+response.username+'>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="updateEmail">Update email</label>\n' +
        '    <input type="email" class="form-control" id="updateEmail" aria-describedby="emailHelp" value='+response.email+'>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="updatePassword">Update password</label>\n' +
        '    <input type="password" class="form-control" id="updatePassword" aria-describedby="emailHelp" placeholder="Enter password" required>\n' +
        '  </div>'+
        '<div class="form-group " id="updateUserRole">\n' +
        '    <label for="createRole">Update role</label>\n' +
        '    <select  class="form-control" id="updateRole">\n' +
        '      <option id="0" value="0">User</option>\n' +
        '      <option id="1" value="1">Admin</option>\n' +
        '    </select>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="updateName">Update name</label>\n' +
        '    <input type="text" class="form-control" id="updateName" aria-describedby="emailHelp" value='+ response.name + '>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="updateSurname">Update surname</label>\n' +
        '    <input type="text" class="form-control" id="updateSurname" aria-describedby="emailHelp" value='+response.surname+'>\n' +
        '  </div>'+
        '<div class="form-group">\n' +
        '    <label for="updatePhone">Update phone</label>\n' +
        '    <input type="number" class="form-control" id="updatePhone" aria-describedby="emailHelp" value='+response.phone+'>\n' +
        '  </div>' +
        '<button class="btn btn-success" id="userCreate" data-id='+response.user_id+'>Update</button>'+
        '</div>'

    );

    if (response.role == 1) {
        $('#updateRole' ).val(1);
    }else{
        $('#updateRole' ).val(0);
    }

    if(userRole == 0) {
        $('#updateUserRole').remove()
    }
    $('#userCreate').on('click', function () {
        var userId = $(this).attr('data-id');
        var updateUsername = $('#updateUsername').val();
        var updateEmail = $('#updateEmail').val();
        var updatePassword = $('#updatePassword').val();
        var updateRole = $( "#updateRole option:selected" ).val();
        var updateName = $('#updateName').val();
        var updateSurname = $('#updateSurname').val();
        var updatePhone = $('#updatePhone').val();
        update(userId,updateUsername,updateEmail,updatePassword,updateRole,updateName,updateSurname,updatePhone);

    });
}

//send updated data
function update(userId,updateUsername,updateEmail,updatePassword,updateRole,updateName,updateSurname,updatePhone) {

    var url = "/users/"+userId;
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax(
        {
            url: url,
            type: 'put',
            dataType: "JSON",
            data: {
                'id' : userId,
                'username' : updateUsername,
                'email' : updateEmail,
                'password': updatePassword,
                'role': updateRole,
                //aboutUser
                'name': updateName,
                'surname': updateSurname,
                'user_id': userId,
                'phone': updatePhone,

            },
            success: function (response)
            {
                console.log(response);
                loadUsers();
            },
            error: function(data) {
                $('.errorMsg').remove();
                data = data['responseJSON'];
                for (key in data['errors']) {
                    arr = data['errors'][key];
                    for (i = 0; i < arr.length; i++) {
                        console.log(arr[i]);
                        $('#table-body').append('<tr class="myTableRow errorMsg" >' +
                            "<td colspan='5'><div class=\"alert alert-danger\" role=\"alert\">\n" +
                            arr[i] +
                            "</div></td>" +

                            "</tr>");
                    }

                }

            }

        });

}

//delete user
function deleteUser(id) {

    var url = "/users/"+id;
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax(
        {
            url: url,
            type: 'delete',
            dataType: "JSON",
            success: function (response)
            {
                console.log(response);
            },
            error: function(xhr) {
                console.log(xhr.responseText);
            }
        });

}

