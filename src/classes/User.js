/**
 * Created by mac002 on 6/6/17.
 */

class User {
  constructor(
      username
      , password
      , domain
      , email
      , firstname
      , lastname
      , title
      , authenticated
      , domains
  ) {
    this.username = (username ? username : "");
    this.password = (password ? password : "");
    this.domain = (domain ? domain : "");
    this.email = (email ? email: "");
    this.firstname = (firstname ? firstname : "");
    this.lastname = (lastname ? lastname: "");
    this.title = (title ? title: "");
    this.authenticated = (authenticated ? authenticated : false);
    this.domains = (domains ? domains : {});;
  };

  /**
   * Does the user have permission to author (create, update) records in this library?
   * @param library
   * @returns {boolean}
   */
  isAdminFor = (library) => {
    let authorized = false;
    if (this.domains && this.domains.admin) {
      for (let entry of this.domains.admin) {
        if (entry.value == library) {
          authorized = true;
          break;
        }
      }
    }
    return authorized;
  }

  /**
   * Does the user have permission to author (create, update) records in this library?
   * @param library
   * @returns {boolean}
   */
  isAuthorFor = (library) => {
    let authorized = false;
    if (this.isAdminFor(library)) {
      authorized = true;
    } else {
      if (this.domains && this.domains.author) {
        for (let entry of this.domains.author) {
          if (entry.value == library) {
            authorized = true;
            break;
          }
        }
      }
    }
    return authorized;
  }
  /**
   * Does the user have permission to read records in this library?
   * @param library
   * @returns {boolean}
   */
  isReaderFor = (library) => {
    let authorized = false;
    if (this.domains && this.domains.reader) {
      if (this.isAdminFor(library) || this.isAuthorFor(library)) {
        authorized = true;
      } else {
        for (let entry of this.domains.reader) {
          if (entry.value == library) {
            authorized = true;
            break;
          }
        }
      }
    }
    return authorized;
  }

}

export default User;