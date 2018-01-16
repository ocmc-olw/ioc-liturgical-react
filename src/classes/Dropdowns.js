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
    , templateNewTemplateDropdown
    , templatePartsDropdown
    , templateWhenDayNameCasesDropdown
    , templateWhenDayOfMonthCasesDropdown
    , templateWhenDayOfSeasonCasesDropdown
    , templateWhenModeOfWeekCasesDropdown
    , templateWhenMonthNameCasesDropdown
    , liturgicalBooksDropdown
    ) {
    this.liturgicalBooksDropdown = (liturgicalBooksDropdown ? liturgicalBooksDropdown : []);
    this.biblicalBooksDropdown = (biblicalBooksDropdown ? biblicalBooksDropdown : []);
    this.biblicalChaptersDropdown = (biblicalChaptersDropdown ? biblicalChaptersDropdown : []);
    this.biblicalVersesDropdown = (biblicalVersesDropdown ? biblicalVersesDropdown : []);
    this.biblicalSubversesDropdown = (biblicalSubversesDropdown ? biblicalSubversesDropdown : []);
    this.formsDropdown = (formsDropdown ? formsDropdown : []);
    this.ontologyTypesDropdown = (ontologyTypesDropdown ? ontologyTypesDropdown : []);
    this.templatePartsDropdown = (templatePartsDropdown ?  templatePartsDropdown: []);
    this.templateNewTemplateDropdown = (templateNewTemplateDropdown ? templateNewTemplateDropdown : []);
    this.templateWhenDayNameCasesDropdown = (templateWhenDayNameCasesDropdown ? templateWhenDayNameCasesDropdown  : []);
    this.templateWhenDayOfMonthCasesDropdown = (templateWhenDayOfMonthCasesDropdown ? templateWhenDayOfMonthCasesDropdown : []);
    this.templateWhenDayOfSeasonCasesDropdown = (templateWhenDayOfSeasonCasesDropdown ? templateWhenDayOfSeasonCasesDropdown : []);
    this.templateWhenModeOfWeekCasesDropdown = (templateWhenModeOfWeekCasesDropdown ? templateWhenModeOfWeekCasesDropdown : []);
    this.templateWhenMonthNameCasesDropdown = (templateWhenMonthNameCasesDropdown ? templateWhenMonthNameCasesDropdown : []);
  };
}
export default Dropdowns;