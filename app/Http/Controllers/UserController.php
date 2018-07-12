<?php

namespace App\Http\Controllers;

use App\AboutUser;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;

class UserController extends Controller
{
    //we get user data relative to the role
    public function index(Request $request)
    {
        if(Auth::user()->isAdmin()){
             $users = User::all();
            foreach ($users as $user) {
                if ($user->role == 1) {
                    $user->utype = 0;
                } else {
                    $user->utype = 2;
                }
            }

        }else{
            $users = User::where('role','=',0)->get();


            foreach ($users as $user) {
                if ($user->id == $request->userId) {
                    $user->utype = 1;
                } else {
                    $user->utype = 0;
                }
            }

        }
        return response()->json($users);

    }

    public function show(User $user)
    {
        return $user;
    }


    //user creation function
    public function store(Request $request)
    {

        //Validation of entered data

        $request->validate([

            'username' => 'required',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'max:10',
        ]);

        //create a new user in the database
        $user = new User();
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        if ($request->role){
        $user->role = $request->role;
        }
        try {
            $user->save();
        } catch (\Exception $e) {
            $res = array();
            $res['result'] = false;
            $res['message'] = $e->getMessage();
            return $res;
        }

        //we add additional data to the database "about_users"
        if ($request->name || $request->surname || $request->phone) {
            $about = new AboutUser();
            $about->name = $request->name;
            $about->surname = $request->surname;
            $about->user_id = $user->id;
            $about->phone = $request->phone;
            $about->save();
        }else{
            $about = new AboutUser();
            $about->user_id = $user->id;
            $about->save();
        }
        return response()->json($user, 201);
    }


    //get the data from the database,for display in the update table
    public function edit(User $user)
    {
        $id = $user->id;

        $abouts = AboutUser::where('user_id','=',$user->id)->get();
        if (count($abouts) == 0) {
            $about = new AboutUser();
            $about->user_id = $user->id;
            $about->save();
        }

        $user = DB::table('users')
            ->join('about_users', function ($join)use ($id) {
                $join->on('users.id', '=', 'about_users.user_id')
                    ->where('users.id', '=', $id);
            })
            ->get()[0];
        $user->password = '';

        return response()->json($user, 200);
    }

    //update user in the database
    public function update(Request $request, User $user,AboutUser $aboutUser)
    {

        $request->validate([

            'username' => 'required',
            //'email' => 'required|string|email|max:255|unique:users',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone' => 'max:10',
        ]);

        //$user->update($request->all());
        $userUpdate = User::find($user->id);
        $userUpdate->username = $request->username;
        $userUpdate->email = $request->email;
        if (!$request->role) {
            $userUpdate->role = 0;
        }else{
            $userUpdate->role = $request->role;
        }
        $userUpdate->password =  Hash::make($request->password);
        $userUpdate->save();



        if ($request->name || $request->surname || $request->phone) {

            $about = AboutUser::where('user_id','=',$request->id)->get()[0];
            $about->name = $request->name;
            $about->surname = $request->surname;
            $about->user_id = $request->id;
            $about->phone = $request->phone;
            $about->save();
        }else{
            $about = new AboutUser();
            $about->user_id = $request->user_id;
            $about->save();
        }


        return response()->json($userUpdate, 200);
    }




    //delete user
    public function destroy($id)
    {
        $item = User::findOrFail($id);
        $item->delete();

    }


    //get search data
    public function search(Request $request)
    {

        if($request->search != ""){
        //if admin search
            if ($request->userRole == 1){
                $users = User::where ( 'username', 'LIKE', '%' . $request->search . '%' )
                    ->orWhere ( 'email', 'LIKE', '%' . $request->search . '%' )
                    ->get ();
                foreach ($users as $user) {
                    if ($user->role == 1) {
                        $user->utype = 0;
                    } else {
                        $user->utype = 2;
                    }
                }
            }else{
                //if user search
                $users = DB::table('users')
                    ->where('role', '!=', 1)
                    ->where(function($query) use ($request)
                    {
                        $query->where('email', 'LIKE', '%' . $request->search . '%')
                            ->orWhere('username', 'LIKE', '%' . $request->search . '%');
                    })
                    ->get();
                foreach ($users as $user) {
                    if ($user->id == $request->userId) {
                        $user->utype = 1;
                    } else {
                        $user->utype = 0;
                    }
                }

            }

        }
        return response()->json($users, 200);
    }
}
