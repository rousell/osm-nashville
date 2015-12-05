app.controller("AuthCtrl",
  [
    "$location",
    "$firebaseAuth",
    "AuthService",
    function($location, $firebaseAuth, AuthService) {

      this.AuthData = null;

      this.AuthLogin = function(){
        console.log("calling login");

        AuthService.$authWithPassword({
          email: this.email,
          password: this.password
        }).then(function(authData){
          this.AuthData = authData;
          $location.path("/map");
          console.log("Auth Data? : ", authData);
        }.bind(this)).catch(function(error){
          console.log("Authentication Failed: ", error);
        });
      };

      this.AuthRegister = function(){
        console.log("registration called");

        console.log(this.emailrg);
        AuthService.$createUser({
          email: this.emailrg,
          password: this.passwordrg
        }).then(function(authData){
          console.log("registration = successful! ", authData);
          this.ref = new Firebase("https://osm-nashville.firebaseio.com/Users/");
          this.ref.push({
            'uid': authData.uid
          });
        }).catch(function(error){
          console.log("error in creating account: ", error);
        });
      };

      this.AuthLogout = function(){
        console.log("logout clicked!");
        AuthService.$unauth();
        this.AuthData = null;
        $location.path("/");
      };
    }
  ]);
