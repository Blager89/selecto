@extends('layouts.app')

@section('content')
<div class="container">
    @if(Auth::user())
    <span id="userRole" hidden="">{{Auth::user()->role}}</span>
    <span id="AuthUserId" hidden="">{{Auth::user()->id}}</span>
    @endif
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header text-center">Users</div>
                <button id="button" class="btn btn-success m-2" >Reload users</button>

                @if(Auth::user() && Auth::user()->role ==1)
                    <button id="createUser" class="btn btn-success m-2" >Create users</button>
                @endif
                <div class="card-body">
                    <table class="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">email</th>
                            @if(Auth::user() && Auth::user()->role == 1)
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                                @else()
                                <th scope="col">Update</th>
                                @endif
                        </tr>
                        <tr>
                            <td colspan="5">
                                <div class="search-label text-center">
                                    Search

                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5">
                                <div class="form-group row">
                                    <div class="col-10">
                                        <input class="form-control" type="text" placeholder="Search" id="searchInput">
                                    </div>
                                    <button type="submit" id="searchUser" class="btn btn-primary">Search</button>

                                </div>
                            </td>
                        </tr>

                        </thead>
                        <tbody id="table-body">
                        <tr></tr>

                        </tbody>
                    </table>
                </div>


                </div>

            </div>
        </div>
    </div>
</div>


@endsection
