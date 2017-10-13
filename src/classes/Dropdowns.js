/**
 * Created by mac002 on 6/6/17.
 */

class Dropdowns {
  constructor(
    biblicalBooksDropdown
    , biblicalChaptersDropdown
    , biblicalVersesDropdown
    , biblicalSubversesDropdown
    , formsDropdown
    , ontologyTypesDropdown
  ) {
    this.biblicalBooksDropdown = (biblicalBooksDropdown ? biblicalBooksDropdown : []);
    this.biblicalChaptersDropdown = (biblicalChaptersDropdown ? biblicalChaptersDropdown : []);
    this.biblicalVersesDropdown = (biblicalVersesDropdown ? biblicalVersesDropdown : []);
    this.biblicalSubversesDropdown = (biblicalSubversesDropdown ? biblicalSubversesDropdown : []);
    this.formsDropdown = (formsDropdown ? formsDropdown : []);
    this.ontologyTypesDropdown = (ontologyTypesDropdown ? ontologyTypesDropdown : []);
  };
}
export default Dropdowns;