var username = "";
var password = "";
var authenticated = "";

module.exports = {

  setCredentials: (user, pwd, valid) => {
    username = user;
    password = pwd;
    authenticated = valid;
  }
  ,logout: () => {
    username = "";
    password = "";
    authenticated = false;
  }
  , isAuthenticated: () => {return authenticated;}
  , getUsername: () => { return username;}
  , getPassword: () => { return password;}
}
