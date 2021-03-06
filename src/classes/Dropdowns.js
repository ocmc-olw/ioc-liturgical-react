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
    , noteTypesDropdown
    , noteTypesBilDropdown
    , schemaEditorDropdown
    , bibTexStylesDropdown
    , uiDomainsDropdown
      , uiLanguagesDropdown
      , uiSystemsDropdown
      , isoCountries
      , isoLanguages
    ) {
    this.liturgicalBooksDropdown = (liturgicalBooksDropdown ? liturgicalBooksDropdown : []);
    this.biblicalBooksDropdown = (biblicalBooksDropdown ? biblicalBooksDropdown : []);
    this.biblicalChaptersDropdown = (biblicalChaptersDropdown ? biblicalChaptersDropdown : []);
    this.biblicalVersesDropdown = (biblicalVersesDropdown ? biblicalVersesDropdown : []);
    this.biblicalSubversesDropdown = (biblicalSubversesDropdown ? biblicalSubversesDropdown : []);
    this.formsDropdown = (formsDropdown ? formsDropdown : []);
    this.noteTypesDropdown = (noteTypesDropdown ? noteTypesDropdown : []);
    this.noteTypesBilDropdown = (noteTypesBilDropdown ? noteTypesBilDropdown : []);
    this.ontologyTypesDropdown = (ontologyTypesDropdown ? ontologyTypesDropdown : []);
    this.templatePartsDropdown = (templatePartsDropdown ?  templatePartsDropdown: []);
    this.templateNewTemplateDropdown = (templateNewTemplateDropdown ? templateNewTemplateDropdown : []);
    this.templateWhenDayNameCasesDropdown = (templateWhenDayNameCasesDropdown ? templateWhenDayNameCasesDropdown  : []);
    this.templateWhenDayOfMonthCasesDropdown = (templateWhenDayOfMonthCasesDropdown ? templateWhenDayOfMonthCasesDropdown : []);
    this.templateWhenDayOfSeasonCasesDropdown = (templateWhenDayOfSeasonCasesDropdown ? templateWhenDayOfSeasonCasesDropdown : []);
    this.templateWhenModeOfWeekCasesDropdown = (templateWhenModeOfWeekCasesDropdown ? templateWhenModeOfWeekCasesDropdown : []);
    this.templateWhenMonthNameCasesDropdown = (templateWhenMonthNameCasesDropdown ? templateWhenMonthNameCasesDropdown : []);
    this.schemaEditorDropdown = (schemaEditorDropdown ? schemaEditorDropdown : []);
    this.bibTexStylesDropdown = (bibTexStylesDropdown ? bibTexStylesDropdown : []);
    this.uiDomainsDropdown = (uiDomainsDropdown ? uiDomainsDropdown : []);
    this.uiLanguagesDropdown = (uiLanguagesDropdown ? uiLanguagesDropdown : []);
    this.uiSystemsDropdown = (uiSystemsDropdown ? uiSystemsDropdown : []);
    this.isoCountries = (isoCountries ? isoCountries : []);
    this.isoLanguages = (isoLanguages ? isoLanguages : []);
  };
}
export default Dropdowns;