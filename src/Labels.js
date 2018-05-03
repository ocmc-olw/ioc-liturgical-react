/**
 * Default user interface labels
 * TODO: reorganize to eliminate duplicates.
 * TODO: Flatten the structure so that each object under en and gr can be used in the parallel column editor.
 */

const   labels = {
  en: {
    button: {
      cancel: "Cancel"
      , close: "Close"
      , downloadAsPdf: "Download as PDF"
      , downloadAsTex: "Download as LaTeX"
      , remove: "Remove"
      , removeAll: "Remove All"
      , saveAsDraft: "Save as Draft"
      , search: "Search"
      , select: "Select"
      , submit: "Submit"
      , update: "Update"
    }
    , schemaBasedAddButton: {

    }
    , ChangePasswordPage: {
      doNotMatch: "The new password and reentered password do not match."
      , changed: "Your password was sucessfully changed."
    }
    , TextNoteEditor: {
      type: "Type"
      , bibleRef: "Bible Ref"
      , biblicalScope: "Biblical Scope"
      , biblicalLemma: "Biblical Lemma"
      , ids: "IDs"
      , settings: "Settings"
      , typeLabel: "please set the note type in the settings tab"
      , dbIds: "You can use the dropdowns below to select the database libraries you are using for the note..."
      , noteLibrary: "Note"
      , liturgicalGreekLibrary: "Liturgical Greek"
      , liturgicalTranslationLibrary: "Liturgical Translation"
      , biblicalGreekLibrary: "Biblical Greek"
      , biblicalTranslationLibrary: "Biblical Translation"
      , liturgicalScope: "Liturgical Scope"
      , liturgicalLemma: "Liturgical Lemma"
      , note: "Note"
      , title: "Title"
      , refersTo: "Refers to"
      , revisions: "Revisions"
      , setTypeScope: "Set Type, Scope, Lemma, Title"
      , viewLiturgicalText: "View Liturgical Text"
      , viewBiblicalText: "View Biblical Text"
      , viewFormattedNote: "Preview"
      , tags: "Tags"
      , workflow: "Workflow"
      , requiredMsg: "The note and fields in the settings tab are required."
    }
    , WorkflowForm: {
      visibility: "Visibility"
      , status: "Status"
      , AssignedTo: "Assigned to"
      , statusTypes: {
        edit: "Edit"
        , review: "Review"
        , final: "Final"
      }
      , visibilityTypes: {
        personal: "Personal - only the library owner can see/edit it"
        , private: "Private - only those granted access can see/edit it"
        , public: "Public - anyone can see it, but not edit it"
      }
    }
    , BibleRefSelector: {
      book: "Book"
      , chapter: "Chapter"
      , verse: "Verse"
      }
    , OntologyRefSelector: {
      type: "Ontology Type"
      , entity: "Entity"
    }
    , liturgicalAcronyms: {
      baptism: "Baptism"
      , funeral: "Funeral"
      , funeral_brightweek: "Funeral (Brightweek)"
      , li: "Divine Liturgy"
      , greatwaterblessing: "Blessing of the Waters (Great)"
      , hymnbystnektarios: "Hymn by Saint Nektarios"
      , ma: "Matins"
      , matinsordinary: "Matins (Ordinary)"
      , matinsordinary_paschal: "Matins (Ordinary - Paschal)"
      , matinsordinary_ascension: "Matins (Ordinary - Ascension)"
      , ma2: "Matins - full options"
      , memorial: "Memorial"
      , smallwaterblessing: "Blessing of the Waters (Small)"
      , unction: "Unction"
      , ve: "Vespers"
      , wedding: "Wedding"
    }
    , treebanksResultsTable: {
      filterPrompt: "type here to filter search results..."
      , headerParentLabel: "P.Relation"
      , headerParentToken: "P.Word"
      , headerParentLemma: "P.Lemma"
      , headerParentGrammar: "P.Grammar"
      , headerLabel: "Relation"
      , headerToken: "Word"
      , headerLemma: "Lemma"
      , headerGrammar: "Grammar"
      , headerChildLabel: "C.Relation"
      , headerChildToken: "C.Word"
      , headerChildLemma: "C.Lemma"
      , headerChildGrammar: "C.Grammar"
    }
    , resultsTable: {
      filterPrompt: "type here to filter search results..."
      , headerComments: "Comments"
      , headerDate: "Date"
      , headerDesc: "Description"
      , headerDomain: "Library"
      , headerKey: "Key"
      , headerLemma: "Source"
      , headerLink: "Link"
      , headerName: "Name"
      , headerNote: "Note"
      , headerOntologyInstance: "Ontology Instance"
      , headerOntologyType: "Ontology Category"
      , headerScope: "Subject"
      , headerTags: "Tags"
      , headerText: "Text"
      , headerTo: "Refers To"
      , headerTopic: "Topic"
      , headerType: "Type"
      , headerValue: "Value"
    }
    , linkSearchResultsTable: {
      filterPrompt: "type here to filter search results..."
      , headerDomain: "Library"
      , headerFromId: "From (Topic)"
      , headerType: "Type"
      , headerTopic: "Topic"
      , headerToId: "To (Key)"
      , headerTags: "Tags"
      , headerKey: "Key"
      , headerName: "Name"
      , headerDesc: "Description"
    }
    , header: {
      about: "About"
      , browser: "Cypher"
      , myRecords: "My Records"
      , help: "Help"
      , login: "Login"
      , logout: "Logout"
      , search: "Search"
      , password: "Password"
    }
    , pageAbout: {
      DbServer: "DB server at"
      , RestServer: "REST server at"
      , wsVersion: "REST server version"
      , appVersion: "Front-end app version"
      , synchEnabled: "DB synchronization enabled"
      , synchDbConnectionOk: "DB Synchronization service running"
      , pageTitle: "About the Database"
      , para01: "This Liturgical Database contains the common Greek version of the Eastern Orthodox Christian liturgical texts and translations of the Greek text. Because the liturgical texts make reference to the Bible, the database also contains biblical texts, which include the LXX (Greek Old Testament), the Greek Patriarchal New Testament, and translations."
      , para02: "All translations in the database are either public domain or available by their license, or used by permission."
      , para03s1: "The database was developed by and is maintained by staff of the Orthodox Christian Mission Center"
      , para03s2: "The primary purpose of the database is to provide tools for liturgical translation and the generation of liturgical services and books. However, it is provided as a public service to Orthodox Christians worldwide."
      , para04s1: "The IDs used to identify parts of liturgical texts were created by Fr. Seraphim Dedes and are used in the AGES Liturgical Workbench (ALWB). ALWB was jointly developed by OCMC and"
      , para04s2: "ALWB is used to produce the website of services found at the "
      , para04s3: "ALWB and other software developed by OCMC are intended to support any language as spoken in any country for any jurisdiction. This is why an ID is made of three parts: an ISO language code, an ISO country code, and a realm. This same system of identification is used with biblical texts."
      , contact: "Contact us by email:"
      , acknowledgements: "Acknowledgements"
      , ackPara01s1: "The Greek liturgical texts and the translations of the liturgical texts in this database are from the AGES Liturgical Workbench, created by AGES, Initiatives and OCMC.  Please refer to the"
      , ackPara01s2: "About"
      , ackPara01s3: "page on the AGES website regarding copyrights."
      , ackPara02s1: "Greek LXX texts are from the University of Pennsylvania (UP), Center for Computer Analysis of Texts (CCAT)."
      , ackPara03s1: "The World English Bible British Edition with Deuterocanon (webbe) is public domain."
      , ackPara04s1: "The Septuagint in American English 2012 (lxx2012) is public domain."
      , ackHebrew: "The Hebrew Old Testament (heb_il_wlc) is public domain.  It is the text as found in the Westminster Leningrad Codex (wlc). It was made available by the J. Alan Groves Center for Advanced Biblical Research."
      , website: "Website"
    }
    , pageLogin: {
      password: "password"
      , prompt: "Please enter this information to login..."
      , username: "username"
      , good: "Logged in OK."
      , bad: "Incorrect username or password."
    }
    , help: {
      search: {
      pageTitle: "How to Search the Liturgical Database"
      , para01: "Please keep in mind that the primary purpose of the database is to be the backend of applications that provide tools for translation of liturgical texts, and the generation of services and books. The texts are not stored as books. The liturgical text has been broken into paragraphs, and sometimes even a single word or phrase."
      , para02: "Although the primary purpose of the database is for use by applications, as a public service to the Orthodox Christian community worldwide, we have provided a search capability on this website. Below is information that will help you use the search function. Click on a topic to open its contents. Click again to hide them."
      , para03: "The user interface for searching the database is still being worked on. What you see on screens and how they look on the help page might be different for short periods of time."
      , secDocIds: "Doc IDs"
      , secSearchResults: "Search Results"
      , secDocProps: "Doc Properties"
      , secDocPropsP01: "Each biblical and liturgical doc stored in the database has the following properties:"
      , secDocPropsP02: "The ID has been described above. The value is the actual text of the document. The nnp means Normalized, No Punctuation. It is not displayed to you, but is a version of the text with the diacritics (e.g. accent marks) removed, uppercase converted to lowercase, and punctuation removed. The importance of the nnp property is that it allows you to search without worrying about case, accents, or punctuation. What is returned back from a search is the actual text, not the nnp."
      , secDocPropsP03: "Note that in the search function (described below), the phrase Value (nonsensitive) means the search uses the nnp property, and the phrase Search (sensitive) means the search uses the Value property."
      , secDocRegExSearch: "Regular Expression Search"
      , secDocSearchAdvancedP01: "The advanced search displays after you click on the link that says Advanced when you are on the Search page."
      , secDocSearchAdvancedP02: "To use it:"
      , secDocSearchAdvancedP03: "Select the type of doc you want to search for from the dropdown labeled Find Doc(s) where type is...."
      , secDocSearchAdvancedP04: "Any"
      , secDocSearchAdvancedP05: "Biblical"
      , secDocSearchAdvancedP06: "Liturgical"
      , secDocSearchAdvancedP07: "Select the domain from the dropdown labeled 'and domain is:'."
      , secDocSearchAdvancedP08: "If you select Biblical as the search doc type, and select the 'NT - Greek - Patriarchal' domain, and the book of 'Acts', and chapter 1, you will see the following:"
      , secDocSearchAdvancedP09: "If you select 'Liturgical' as the search doc type, and 'Common Orthodox Greek' as the domain, and 'Menaion' as the book, and 'January' as the month, you will see the following:"
      , secDocSearchAdvancedP10: "Once you get this far, you can either click on the search button,"
      , secDocSearchAdvancedP11: "or you can set property options."
      , secDocSearchAdvancedP12: "To set property options for an advanced search, do the following:"
      , secDocSearchAdvancedP13: "Select the property:"
      , secDocSearchAdvancedP14: "Select the part of the property to search:"
      , secDocSearchAdvancedP15: "contains"
      , secDocSearchAdvancedP16: "starts with"
      , secDocSearchAdvancedP17: "ends with"
      , secDocSearchAdvancedP18: "matches regular expression"
      , secDocSearchAdvancedP19: "Enter the word or phrase to search for, or if it is a regular expression, enter the regular expression."
      , secDocSearchAdvancedP20: "Click on the search button"
      , secDocSearchAdvancedP21: "Notes"
      , secDocSearchAdvancedP22: "contains means the property has this word or phrase anywhere in the property value."
      , secDocSearchAdvancedP23: "starts with means the desired word or phrase must occur at the beginning of the property value."
      , secDocSearchAdvancedP24: "ends with means the desired word or phrase must occur at the end of the property value."
      , secDocSearchAdvancedP25: "matches regular expression means that you are not entering a simple word or phrase, but you are using a special tool known as a regular expression. See below."
      , secDocSearchAdvancedP26: "Tip: In a dropdown, if you start typing, it will filter the dropdown values to match what you are typing."
      , secDocSearchRegExP01: "The use of regular expressions is a powerful but very advanced feature. To learn about regular expressions in general, search the Internet. The following information specific to this database is adapted from a Neo4j manual:"
      , secDocSearchRegExP02: "The regular expression syntax used by the database is inherited from the Java regular expressions. This includes support for flags that change how strings are matched, including case-insensitive (?i), multiline (?m) and dotall (?s). Flags are given at the start of the regular expression."
      , secDocSearchRegExP03: "If the string you want does not occur at the start of the property, it is necessary to put .* before the string. And, if it does not occur at the end, it is necessary to put .* at the end. For example, doing a regular expression search using the expression blessed will only find docs that both start with and end with blessed. There are none. The expression blessed.* will find docs that start with the word blessed. The expression .*blessed will find docs that end with the word blessed. And the expression .*blessed.* will find docs that have the word blessed anywhere in the text. This is such a simple example that you would not use a regular expression. But, it illustrates the use of .* when creating regular expressions."
      , secDocSearchRegExP04: "Regular expressions can be escaped using a forward slash. Remember that back slash needs to be escaped in string literals."
      , secDocSearchRegExP05: "By pre-pending a regular expression with (?i), the whole expression becomes case insensitive."
      , secDocSearchRegExP06: "Let's consider an example of the use of a regular expression. Let's say that we are interested in seeing places in the liturgical text where we ask for God to do something through the prayers or intercessions of someone.. We could use the following regular expression: .*through the (prayers|intercessions) of.*"
      , secDocSearchRegExP07: "We have .* at the beginning and end to search for its occurrence anywhere in a doc. And, we want to search for either prayers or intercessions, so we put them in parentheses and separate the two words using the pipe symbol | which in a regular expression means or."
      , secDocSearchRegExP09: "When we examine the results of the search, we can see that the phrase 'through the prayers of' or the phrase 'through the intercessions of' has the following petitioners:"
      , secDocSearchRegExP10: "Apostles"
      , secDocSearchRegExP11: "Archangels"
      , secDocSearchRegExP12: "hierarchies on high"
      , secDocSearchRegExP13: "holy Mother"
      , secDocSearchRegExP14: "Martyrs"
      , secDocSearchRegExP15: "Saints"
      , secDocSearchRegExP16: "Theotokos"
      , secDocSearchRegExP17: "the Forerunner"
      , secDocSearchRegExP18: "etc."
      , secDocSearchRegExP19: "You can also use regular expressions to search the Greek docs. The Greek equivalent regular expression to find the variations of the phrase kingdom of God or heaven or the Father in the Greek text is .*βασιλεια.*(Θεια|οθρανων|πατρος).*"
      , secDocSearchResultsP01a: "Below is an example of the result of searching for the phrase"
      , secDocSearchResultsP01b: "your kingdom of"
      , secDocSearchResultsP02: "There are many things to note about the screen shot above..."
      , secDocSearchResultsP03: "Directly below the search text box, the Search Result line tells you how many docs matched your search request. In this case, it found three docs."
      , secDocSearchResultsP04: "Each matching doc is shown as its own row."
      , secDocSearchResultsP05: "Below the rows of matching docs is a message that tells you how many rows are being displayed. In this case, it is showing rows 1 to 3 of 3. That means all the matching docs fit on a single web page. (See below about what happens if the rows don't all fit on a page)."
      , secDocSearchResultsP06: "Notice that the search phrase your kingdom of is all lowercase and has no punctuation. But, the search result was Your kingdom, of and your kingdom, of. The simple search ignores capitalization, diacritics, and punctuation."
      , secDocSearchResultsP07: "Note that below the Search Result line there is a text box that says type here to filter search results.... Once you have found docs, you can filter them by typing additional words."
      , secDocSearchResultsP08: "The column headings of the results table have small up and down arrows. Click these to sort the results by a particular column."
      , secDocSearchResultsP09: "The first column in each row has a radio button. If you click the radio button, a popup appears and the you will see a new table that shows you all the docs that have the same topic and key. In other words, the app uses the ID of the doc you select to do a new search, but ignores the domain. This allows you to easily compare translations."
      , secDocSearchResultsP10: "Note that if the number of docs found are too many to fit on a single page, you will see something like this:"
      , secDocSearchResultsP11: "This tells you that there are 746 rows (i.e. docs) and it is showing rows 1 to 30. Notice on the right there are page numbers. You can jump directly to a page. Or you can go to the next page using the > button, or to the last page using the >> button. Keep in mind that page here refers to a page of search results, not a page in a biblical or liturgical book."
      , secDocSearchTypes: "Doc Search Types"
      , secDocSearchTypesP01: "There are two types of searches available--simple and advanced. They are shown below:There are two types of searches available--simple and advanced. They are shown below:"
      , secDocSearchTypesP02: "When on the Search page, you can click on the blue links to access the search type that you want."
      , secDocSimpleSearchP01: "The simple search displays automatically when you first access the Search page. If you have switched to the Advanced search or the ID Parts search, click on the link for Simple to return to the Simple search."
      , secDocSimpleSearchP02: "To use it:"
      , secDocSimpleSearchP03: "In the text box, type a word or phrase."
      , secDocSimpleSearchP04: "Click the search button"
      , secDocSimpleSearchP05: "Note that the word or phrase you enter does not need to be capitalized, or (if Greek) accented. The simple search uses the doc property nnp."
      , secDocSimpleSearchP06: "Also note that the simple search only searches docs that are liturgical. It does not search the biblical docs."
      , secSimpleSearch: "Simple Search"
      , secDocIdP01: "When the Bible was written, it did not have chapter and verse numbers. These were added centuries later so that people have a common, standardized way to talk about a specific part of the Bible. A biblical chapter and verse number uniquely identifies a small document (or, doc for short). For biblical text, we call that kind of doc a verse."
      , secDocIdP02: "Fr. Seraphim Dedes has created the equivalent of chapter and verse identifiers for the Eastern Orthodox Christian liturgical texts. This identification scheme is used in AGES Liturgical Workbench (ALWB), jointly developed by AGES, Initiatives, Inc. and OCMC."
      , secDocIdP03: "Each doc in the database has an ID that uniquely identifies it. The ID is composed of three parts:"
      , secDocIdP04: "The domain is equivalent to the version of a Bible translation. For example, KJV for the King James Version of the Bible. The topic is equivalent to a Bible book name. For example the book of Genesis. The key is equivalent to the chapter and verse number."
      , secDocIdP05: "In order to understand how each doc is uniquely identified in the database, consider the following:"
      , secDocIdP06: "The text is from the Menaion, Month 1, Day 6, that is, the Theophany of our Lord. Let's look at the ID. The ID is composed of the domain, topic, and key."
      , secDocIdP07: "Let's start with the topic. In this case, the topic part of the ID is me.m01.d06. Note that topics often have parts separated by a period. The first part me means Menaion. The second part m01 means Month 1. The last part d06 means Day 6."
      , secDocIdP08: "Now, look at the key meVE.Apolytikion1.text. Again, me means Menaion. VE means Vespers. The key also indicates this is Apolytikion 1, which is the dismissal hymn for Vespers."
      , secDocIdP09: "Lastly, look at the domain. Notice that the two rows (one English and one Greek) have the different domains, but the same topic and key."
      , secDocIdP10: "A domain is equivalent to a Bible version, for example, RSV, the Revised Standard Version. A domain has three parts:"
      , secDocIdP11: "Language Code"
      , secDocIdP12: "Country Code"
      , secDocIdP13: "Realm"
      , secDocIdP14: "The language code is a 2-3 character code from the International Standards Organization (ISO) and uniquely identifies a language. The country code is from the ISO country code table. A realm is an identifier for a particular translator, a particular diocese, or metropolis."
      , secDocIdP15: "Let's look at the domain gr gr cog. The first gr is the language code, and means Greek. Note that the ISO code for modern Greek is el, so gr signifies non-modern Greek, e.g. Classical, or Hellenistic, or Byzantine. The second gr means the country Greece. The realm cog is an acronymn and means Common Orthodox Greek, in other words, the Greek liturgical text commonly used by Orthodox Christians around the world."
      , secDocIdP16: "The domain en us dedes means, English as spoken in the United States, translation by Fr. Seraphim Dedes. Although it is not shown here, another example is en uk lash, which means English as spoken in the United Kingdom, translation by Fr. Ephrem Lash (of blessed memory)."
      , secAdvancedSearch: "Advanced Search"
      , secDocIdPartsSearch: "Αναγνωριστικά μέρη έρευνας"
      , secDocVersionComparisonTitle: "Comparing Versions"
      , secDocVersionComparisonP01: "The search results show each doc as a separate row.  What if you want to compare versions, using the same topic and key?  Note that the first column of each row has a radio button.  If you click the radio button of the row you want to compare, a popup window appears and shows all the versions that have the same topic and key for the row you selected."
      , headerDomain: "Library"
      , headerKey: "Key"
      , headerTopic: "Topic"
      , headerValue: "Value"
      , matchesAtTheStart: "at the beginning"
      , matchesAtTheEnd: "at the end"
      , matchesAnywhere: "anywhere"
      , matchesRegEx: "as a regular expression"
     }
    }
    , search: {
      advanced: "Advanced Search"
      , bookIs: "and the book is..."
      , chapterIs: "and the chapter is..."
      , clickTheButton: "Click the button below to submit your search criteria..."
      , close: "Close"
      , creating: "Creating..."
      , created: "Created"
      , dayIs: "and the day is..."
      , domainIs: "and the domain is..."
      , exists: "already exists..."
      , findWhereTypeIs: "Find doc(s) where type is..."
      , IdParts: {
        title: "Build the Parts of the ID"
        , msg1: "All items in the database must have an identifier (ID).  An ID has three parts: a library, a topic, and a key. Depending on the type of item, you will need to either select or type in one or more parts of the ID.  Click the title below to build the ID parts."
        , msg2: "Follow the instructions below to build the parts of the ID for this item..."
        , topic: "Topic"
        , key: "Key"
        , BIBLICAL_BOOK_ABBREVIATION: {
          prompt: "Select the name of the book..."
          , topic: "Topic: Abbreviation for the name of the book"
          , topicValue: "Book abbreviation"
          , key: ""
          , keyValue: ""
        }
        , BIBLICAL_CHAPTER_VERSE: {
          prompt: "Select the chapter, verse, and (optional) verse subpart"
          , topic: ""
          , topicValue: ""
          , key: "Key: Chapter:Verse"
          , keyValue: "Chapter:Verse"
          , chapter: "Chapter"
          , verse: "Verse"
          , versePart: "Verse Part"
        }
        , ID_OF_SELECTED_BIBLICAL_VERSE:{
          prompt: "Select the Biblical Verse..."
          , topic: "Topic: ID of the Biblical Verse"
          , topicValue: "Biblical Verse"
          , key: "Key: ID of the Biblical Verse"
          , keyValue: "Biblical Verse"
        }
        , ID_OF_SELECTED_LITURGICAL_TEXT: {
          prompt: "Select the Liturgical text..."
          , topic: "Topic: ID of the Liturgical Text"
          , topicValue: "Liturgical Text"
          , key: "Key: ID of the Liturgical Text"
          , keyValue: "Liturgical Text"
        }
        , ID_OF_SELECTED_ONTOLOGY_INSTANCE: {
          prompt: "Select the Ontology Item..."
          , topic: "Topic: ID of Ontology Item"
          , topicValue: "Ontology Item"
          , key: "Key: ID of the Ontology Item"
          , keyValue: "Ontology Item"
        }
        , KEY_FROM_ID_OF_SELECTED_BIBLICAL_VERSE: {
          prompt: ""
          , topic: ""
          , topicValue: ""
          , key: "Key: from the ID of the selected Biblical verse"
          , keyValue: "Value of Selected Text"
        }
        , KEY_FROM_ID_OF_SELECTED_LITURGICAL_TEXT: {
          prompt: ""
          , topic: ""
          , topicValue: ""
          , key: "Key: from the ID of the selected Liturgical text"
          , keyValue: "Value of Selected Text"
        }
        , ONTOLOGY_TOPIC: {
          prompt: ""
          , library: "Library:"
          , topic: "Topic: Ontology Type"
          , topicValue: ""
          , key: "Key: Name"
          , keyValue: ""
        }
        , NOTE_USING_ID_OF_SELECTED_TEXT: {
          prompt: "Select the Liturgical text..."
          , library: "Library: your personal library"
          , topic: "Topic: ID of the selected Liturgical Text"
          , topicValue: "Liturgical Text"
          , key: "Key: system generated timestamp"
          , keyValue: "Timestamp"
        }
        , TIMESTAMP: {
          prompt: "System generated timestamp..."
          , topic: ""
          , topicValue: ""
          , key: "Key: system generated timestamp"
          , keyValue: "Timestamp"
        }
        , TOPIC_FROM_ID_OF_SELECTED_BIBLICAL_VERSE: {
          prompt: "Select the ID of the Biblical verse..."
          , topic: "Topic: from the ID of the selected Biblical verse"
          , topicValue: "Value of Selected Text"
          , key: "Key: from the ID of the selected Biblical verse"
          , keyValue: "Value of Selected Text"
        }
        , TOPIC_FROM_ID_OF_SELECTED_LITURGICAL_TEXT: {
          prompt: "Select the ID of the Liturgical text..."
          , topic: "Topic: from the ID of the selected Liturgical text"
          , topicValue: "Value of Selected Text"
          , key: "Key: from the ID of the selected Liturgical text"
          , keyValue: "Value of Selected Text"
        }
        , USER_TEXT: {
          prompt: "enter text here..."
          , topic: "Topic: text that you enter"
          , topicValue: ""
          , key: "Key: text that you enter"
          , keyValue: ""
          , button: "Set "
        }
      }
      , matcherIs: "that matches..."
      , matchesAnywhere: "anywhere"
      , matchesAtTheEnd: "at the end"
      , matchesAtTheStart: "at the beginning"
      , matchesRegEx: "as a regular expression"
      , modeIs: "and the mode is..."
      , monthIs: "and the month is..."
      , msg1: "Important messages will appear here..."
      , msg2: "searching..."
      , msg3: "Found"
      , msg4: "Docs"
      , msg5: "You can use the box(es) below to filter the results."
      , msg6: "To view docs with the same topic and key, click the radio button of the row you are interested in."
      , pageTitle: "Search the Database"
      , prompt: "enter a word or phrase"
      , propertyIs: "and the property is..."
      , propertyTextIs: "and has this text..."
      , resultLabel: "Search Result"
      , sectionIs: "and the section is..."
      , serviceIs: "and the service is..."
      , selectVersion: "Select the version you want.  Normally it should be Greek."
      , selectedId: "ID of Selection"
      , selectedValue: "Value of Selection"
      , simple: "Simple Search"
      , submit: "Submit"
      , submitting: "Submitting..."
      , typeIs: "and the type is..."
      , weekIs: "and the week is..."
      , searchToSelectInstructions: "Search the database to select the doc you want. When you find it, click the 'Select' button."
      , loadingDropdowns: "Loading dropdowns for search..."
    }
    , searchNotes: {
      prompt: "enter a word or phrase"
      , clickTheButton: "Click the button below to submit your search criteria..."
      , findWhereTypeIs: "Find where the note type is..."
      , findWhereGenericTypeIs: "and the generic type is..."
      , typeAny: "any"
      , propertyIs: "and the property is..."
      , propertyTextIs: "and has this text..."
      , matcherIs: "that matches..."
      , matchesAtTheStart: "at the beginning"
      , matchesAtTheEnd: "at the end"
      , matchesAnywhere: "anywhere"
      , matchesRegEx: "as a regular expression"
      , msg1: "Important messages will appear here..."
      , msg2: "searching..."
      , msg3: "Found"
      , msg4: "Notes"
      , msg5: "You can use the box(es) below to filter the results."
      , msg6: "To edit a link, click the radio button of the row you are interested in."
      , pageTitle: "Search the Database for Notes"
      , resultLabel: "Search Result"
      , close: "Close"
      , has: "and has"
      , tags: "of the these tags"
      , typeAll: "all"
      , tagsAny: "any"
      , creating: "Creating..."
      , created: "Created"
      , submit: "Submit"
      , submitting: "Submitting..."
      , exists: "already exists..."
      , textPrompt: "enter text to search for here"
    }
    , searchTemplates: {
      prompt: "enter a word or phrase"
      , clickTheButton: "Click the button below to submit your search criteria..."
      , findWhereTypeIs: "Find where the generation unit type is..."
      , findWhereGenericTypeIs: "and the generic type is..."
      , typeAny: "any"
      , propertyIs: "and the property is..."
      , propertyTextIs: "and has this text..."
      , matcherIs: "that matches..."
      , matchesAtTheStart: "at the beginning"
      , matchesAtTheEnd: "at the end"
      , matchesAnywhere: "anywhere"
      , matchesRegEx: "as a regular expression"
      , msg1: "Important messages will appear here..."
      , msg2: "searching..."
      , msg3: "Found"
      , msg4: "Notes"
      , msg5: "You can use the box(es) below to filter the results."
      , msg6: "To edit a link, click the radio button of the row you are interested in."
      , pageTitle: "Search the Database for Templates"
      , resultLabel: "Search Result"
      , close: "Close"
      , has: "and has"
      , tags: "of the these tags"
      , typeAll: "all"
      , tagsAny: "any"
      , creating: "Creating..."
      , created: "Created"
      , submit: "Submit"
      , submitting: "Submitting..."
      , exists: "already exists..."
    }
    , searchTreebanks: {
      prompt: "enter a word or phrase"
      , clickTheButton: "Click the button below to submit your search criteria..."
      , searchResultsType: "token analyses"
      , findWhereTypeIs: "Find where the treebank type is..."
      , findWhereGenericTypeIs: "and the generic type is..."
      , typeAny: "any"
      , propertyIs: "and the property is..."
      , propertyTextIs: "and has this text..."
      , matcherIs: "that matches..."
      , matchesAtTheStart: "at the beginning"
      , matchesAtTheEnd: "at the end"
      , matchesAnywhere: "anywhere"
      , matchesRegEx: "as a regular expression"
      , msg1: "Important messages will appear here..."
      , msg2: "searching..."
      , msg3: "Found"
      , msg4: "Token analyses"
      , msg5: "You can use the boxes below to filter the results."
      , msg6: "To view a DependencyTree, click the radio button of the row you are interested in."
      , pageTitle: "Search the Database for Treebank Data"
      , resultLabel: "Search Result"
      , close: "Close"
      , has: "and has"
      , tags: "of the these tags"
      , typeAll: "all"
      , tagsAny: "any"
      , creating: "Creating..."
      , created: "Created"
      , submit: "Submit"
      , submitting: "Submitting..."
      , exists: "already exists..."
    }
    , searchOntology: {
      prompt: "enter a word or phrase"
      , clickTheButton: "Click the button below to submit your search criteria..."
      , findWhereTypeIs: "Find where entry type is..."
      , findWhereGenericTypeIs: "and the generic type is..."
      , typeAny: "any"
      , propertyIs: "and the property is..."
      , propertyTextIs: "and has this text..."
      , matcherIs: "that matches..."
      , matchesAtTheStart: "at the beginning"
      , matchesAtTheEnd: "at the end"
      , matchesAnywhere: "anywhere"
      , matchesRegEx: "as a regular expression"
      , msg1: "Important messages will appear here..."
      , msg2: "searching..."
      , msg3: "Found"
      , msg4: "Ontology Entries"
      , msg5: "You can use the box(es) below to filter the results."
      , msg6: "To edit a link, click the radio button of the row you are interested in."
      , pageTitle: "Search the Database for Ontology Entries"
      , resultLabel: "Search Result"
      , close: "Close"
      , has: "and has"
      , tags: "of the these tags"
      , typeAll: "all"
      , tagsAny: "any"
      , creating: "Creating..."
      , created: "Created"
      , submit: "Submit"
      , submitting: "Submitting..."
      , exists: "already exists..."
    }
    , searchLinks: {
      prompt: "enter a word or phrase"
      , clickTheButton: "Click the button below to submit your search criteria..."
      , findWhereTypeIs: "Find link(s) where type is..."
      , typeAny: "any"
      , domainIs: "and the domain is..."
      , propertyIs: "and the property is..."
      , propertyTextIs: "and has this text..."
      , matcherIs: "that matches..."
      , matchesAtTheStart: "at the beginning"
      , matchesAtTheEnd: "at the end"
      , matchesAnywhere: "anywhere"
      , matchesRegEx: "as a regular expression"
      , msg1: "Important messages will appear here..."
      , msg2: "searching..."
      , msg3: "Found"
      , msg4: "Links"
      , msg5: "You can use the box(es) below to filter the results."
      , msg6: "To edit a link, click the radio button of the row you are interested in."
      , pageTitle: "Search the Database for Links between Docs"
      , resultLabel: "Search Result"
      , close: "Close"
      , has: "and has"
      , tags: "of the these tags"
      , typeAll: "all"
      , tagsAny: "any"
      , creating: "Creating..."
      , created: "Created"
      , submit: "Submit"
      , submitting: "Submitting..."
      , exists: "already exists..."
    }
    , DependencyDiagram: {
      title: "Dependency Diagram for"
      , about: "Dependency Diagrams provide information about the grammar of words or punctuation marks and their syntactic role."
      , instructions: "Scroll left or right and up and down to see more of the diagram.  Double-click a node to contract or expand it."
      , toLearn: "To learn about dependency diagrams see"
      , this: "this"
      , and: "and"
    }
    , Grammar: {
      title: "Grammar Explorer for "
      , button: "Grammar Explorer"
      , instructions: "Use this section to view grammatical information about Greek words..."
      , panelCompare: "Greek Text and Translations"
      , panelDependency: "Dependency Diagram"
      , panelAnalyses: "Potential Analyses"
      , panelPerseusSite: "Perseus Web Site"
      , panelLexigramSite: "Lexigram Web Site (in Greek)"
      , panelLogeionSite: "Logeion Web Site"
      , panelLaParola: "LaParola Web Site"
      , panelKriaras: "Kriaras (in Greek)"
      , panelTriantafyllides: "Triantafyllides (in Greek)"
      , panelBasicLexicon: "Basic Lexicon of Ancient Greek (in Greek)"
      , panelTig: "TLG Corpus Search (requires subscription to TLG)"
      , panelTreebanks: "Sample Treebanks"
      , panelSmyth: "Smyth Greek Grammar"
      , panelOald: "Oxford Advanced Learner's Dictionary"
      , colLemma: "Lemma"
      , colParse: "Parse"
      , colGlosses: "Glosses"
      , colAnalyses: "ExPex"
      , colSource: "Source"
    }
    , HyperTokenText: {
      title: "Text For "
      , instructions: "Click on a token (e.g. a word) to get information about it..."
    }
    , ldp: {
      prompt: "Pick the calendar type and date for which you want to view Liturgical Day Properties..."
      , calendar: "Calendar"
      , julian: "Julian (Old) Calendar"
      , gregorian: "Gregorian (New) Calendar"
    }
    , httpCodes: {
      200: "OK"
      , 201: "Created"
      , 400: "Bad request"
      , 401: "Not authorized"
      , 404: "Not found"
      , 405: "Not authorized"
      , 409: "Already exists"
      , 500: "Server error"
    }
    , NewEntry: {
      panels: {
        main: "Create a New Entry"
        , form: "View the Form"
      }
      , formSelector: "Select the Form for the new entry you want to create..."
      , paraTextPanelTitle: "View Parallel Texts"
    }
    , ParaTextEditor: {
      panelTitle: "View Parallel Texts in Rows"
      , msg1: ""
      , msg2: ""
      , showingMatchesFor: "Showing matches for "
      , yourTranslation: "Your Translation"
      , valueFor: "Value for"
      , submit: "Submit"
      , biblicalLinksPanelTitle: "Biblical References Made By the Greek Text"
      , grammarPanelTitle: "Grammar Explorer"
      , ontologyLinksPanelTitle: "Ontology References Made By the Greek Text"
      , textualNotesPanelTitle: "Textual Notes"
      , userNotesPanelTitle: "Personal Notes"
    }
    , FormattedTextNote: {

    }
    , ModalAgesServiceSelector: {
      panelTitle: "Sacraments and Services Available from the AGES Website"
      , msg1: "Select a Sacrament or Dated Service by clicking the radio-button in the first column of that row. "
      , msg2: "Click the up and down triangles to sort a column. "
      , msg3: "Enter part or all of a word or use a Regular Expression to filter the rows. "
      , msg4: "Type 'any' into the Date or Day of Week filter to view available Sacraments.  Type 'daily' into the Type filter to view daily readings for each month. Type 'Menaion', 'Triodion', 'Pentecostarion', or 'Synaxarion' to view those books."
      , type: "Type"
      , date: "Date"
      , dayOfWeek: "Day of Week"
      , close: "Close"
    }
    , ModalReactSelector: {
      panelTitle: "Selector"
      , msg1: "Make a selection..."
      , close: "Close"
    }
    , ModalTemplateNodeEditor: {
      panelTitle: "Template Node Editor"
      , msg1: "Use this form to enter information about the node... "
      , msg2: " "
      , msg3: " "
      , msg4: ""
      , editProperties: "Properties:"
      , nodeTypePrompt: "Node type:"
      , nodeSubtitle: "Node ID:"
      , selectTextId: "Select Text ID"
      , selectInsertId: "Select Template or Section ID"
      , close: "Close"
    }
    , AgesEditor: {
      panelTitle: "View and Edit a Service or Sacrament from the AGES Initiatives website"
      , msg1: " Double-click on text to open an editor window."
      , msg2: "Fetched: "
      , agesGreek: "Below, the left column is Greek from AGES, "
      , agesEnglish: "and the right column is English from AGES."
      , yourTranslationA: "the center column is your translation ("
      , yourTranslationB: "), "
      , select: "Select the Service or Sacrament"
      , selectLibrary: "Select your translation library..."
      , fetch: "Fetch the Service or Sacrament"
      , selected: "You selected: "
    }
    , AgesViewer: {
      panelTitle: "View a Service or Sacrament from the AGES Initiatives website"
      , msg1: " Select the service or sacrament that you want.  And, select one, two, or three libraries.  If a library does not have a translation for a particular text, it will fallback to Greek or English based on your fallback selection. After you have made your selections, click the Fetch button."
      , msg2: "Fetched: "
      , agesGreek: "AGES Greek"
      , agesEnglish: "AGES English Translations"
      , select: "Select the Service or Sacrament"
      , selectFirstLibrary: "Select library for column 1..."
      , selectFirstLibraryFallback: "Select fallback library for column 1..."
      , selectSecondLibrary: "Select library for column 2..."
      , selectSecondLibraryFallback: "Select fallback library for column 2..."
      , selectThirdLibrary: "Select library for column 3..."
      , selectThirdLibraryFallback: "Select fallback library for column 3..."
      , fetch: "Fetch the Service or Sacrament"
      , selected: "You selected: "
    }
    , ModalParaRowEditor: {
      panelTitle: "Text Editor"
      , msg1: "The text editor has three sections. The first section is a table that shows the Greek text and translations of the text. The second section has a text box for you to enter your translation. When you are ready, click the Submit button to update the database with your changes.  The third section is the Grammar Explorer.  Click on the title of the Grammar Explorer to expand it. Click again on the title to hide it. Close this window by using the X at the upper right, or by clicking the Close button at the bottom, or by pressing the Escape key."
      , msg2: "The text editor has three sections. The first section is a table that shows the Greek text and translations of the text. The second section has a text box with the current value of the translation of the selected library.  However, you do not have authority to edit it. The third section is the Grammar Explorer.  Click on the title of the Grammar Explorer to expand it. Click again on the title to hide it. Close this window by using the X at the upper right, or by clicking the Close button at the bottom, or by pressing the Escape key."
      , close: "Close"
    }
    , ParaColTextEditor: {
      panelTitle: "View and Edit Parallel Texts in Columns"
      , msg1: "Select a topic, then select one or more libraries.  Then click the button."
      , msg2: "Double-Click to edit a cell. You can sort the columns using the up and down triangles. You can filter a column by typing in the box below the column name. Clear the filters using the button to the right."
      , key: "Key"
      , view: "Select a topic..."
      , including: "Including"
      , select: "you may select up to "
      , libraries: "libraries."
      , sourceRequired: "You must include the source library "
      , maxLibraries: "The maximum of number of libraries you may select is"
    }
    , TopicsSelector : {
      panelTitle: "Text Topic Selector"
      , instructions: "Use the Text Topic Selector to select the Topic you want."
    }
    , ViewRelationships: {
      panelTitle: "Links for "
      , msg1: ""
    }
    , NewEntryForm: {
      title: "New Entry Form"
    }
    , ViewReferences: {
      panelTitle: "made by"
      , biblicalRef: "Biblical References"
      , library: "recorded in the library"
      , ontologyRef: "Ontology References"
      , theText: "The text..."
      , textualReference: "Textual Reference"
      , refersTo: "refers to..."
      , infoBelow: "Information about the reference is below..."
      , prompt: "The default library for references is en_sys_ontology.  If you have authorization to view a different library, you may select it from the dropdown below."
    }
    , GlossBuilder: {
      panelTitle: "Gloss Builder"
      , instructions: "Use the Gloss Builder to add words to the gloss, and indicate their sense."
      , gloss: "Gloss"
      , bracket: "[]?"
      , wnSense: "WN Sense"
      , oxSense: "Ox Sense"
    }
    , TemplateEditor: {
      panelTitle: "Template Editor"
      , instructions: "Use the Template Editor to create reusable templates to generate Liturgical books or services."
      , expandAll: "Expand All"
      , collapseAll: "Collapse"
    }
    , TokenTagger: {
      panelTitle: "Token Tagger"
      , instructions: "Use the Token Tagger to set the grammatical tags, lemma, gloss, and dependency information for the selected token (e.g. word or punctuation mark).  After you select the Part of Speech, you will see additional lists to select from.  When you are finished, click the 'Submit' button to save your work and update the Dependency Diagram."
      , lemma: "Lemma"
      , gloss: "Gloss"
      , help: "Tagging Guidelines"
      , examples: "Tagging Examples"
      , leipzig: "Leipzig Glossing Rules"
      , oxford: "Oxford English Dictionary"
    }
    , WorkflowAssignment: {
      title: "Workflow Assignment"
      , instructions: "Use this section to set the status and assignedToUser fields of the form..."
      , status: "Selected status:"
      , user: {
        EDITING: "Select a user to do the editing:"
        , HOLDING: ""
        , READY_TO_REVIEW: "Select an Admin to assign someone to do the review:"
        , REVIEWING: "Select a user to do the review:"
        , READY_TO_EDIT: "Select an Admin to assign someone to do the editing:"
        , READY_TO_FINALIZE: "Select an Admin to to the finalizing:"
        , FINALIZED: ""
      }
      , submit: "Set status and assigned user"
    }
    , RichEditor: {

    }
    , messages: {
      initial: "Important messages will appear here..."
      , creating: "Creating..."
      , created: "Created..."
      , requiredNotCompleted: "You have not completed required fields"
      , status: "Status"
      , retrieving: "retrieving..."
      , searching: "searching..."
      , updating: "updating..."
      , updated: "updated..."
      , resultLabel: "Search Result"
      , found: "Found"
      , docs: "docs"
      , submit: "Submit"
      , regEx: "Enter Regex"
      , clearFilters: "Clear Filters"
      , filter: "You can use the box(es) below to filter the results."
      , click: "Click the radio button of the row you are interested in."
      , readOnly: "You do can view this, but not edit it."
      , ok: "OK"
      , preparingPdf: "Preparing the PDF"
    }
    , grammarTerms: {
      case: {
        title: "Case"
        , values: {
          "ACC": "accusative "
          , "DAT": "dative"
          , "GEN": "genitive"
          , "NOM": "nominative"
          , "VOC": "vocative "
        }
      }
      , categories: {
        title: "Syntactic Category"
        , values: {
          "ADV": "adverb"
          , "APOS": "apposing element"
          , "ATR": "attributive"
          , "ATV": "complement"
          , "AuxC": "conjunction"
          , "AuxG": "bracketing punctuation"
          , "AuxK": "terminal punctuation"
          , "AuxP": "preposition"
          , "AuxV": "auxiliary verb"
          , "AuxX": "commas"
          , "AuxY": "sentence adverbials"
          , "AuxZ": "emphasizing particles"
          , "COORD": "coordinator"
          , "ExD": "ellipsis"
          , "OBJ": "object"
          , "OCOMP": "object complement"
          , "MWE": "multi-word expression"
          , "PNOM": "predicate nominal"
          , "PRED": "predicate"
          , "PRED-CO": "predicate complement"
          , "ROOT" : "root of the dependency tree"
          , "SBJ": "subject"
          , "SCAN": "scansion (metrical pattern marker)"
        }
      }
      , gender: {
        title: "Gender"
        , values: {
          "F": "feminine"
          , "M": "masculine"
          , "N": "neuter"
        }
      }
      , mood: {
        title: "Mood"
        , values: {
          "IMP": "imperative"
          , "IND": "indicative"
          , "OPT": "optative"
          , "SBJV": "subjunctive"
        }
      }
      , number: {
        title: "Number"
        , values: {
          "DU": "dual"
          , "PL": "plural"
          , "SG": "singular"
        }
      }
      , person: {
        title: "Person"
        , values: {
          "1": "first person"
          , "2": "second person"
          , "3": "third person"
        }
      }
      , pos: {
        title: "Part of Speech"
        , values: {
          "ABRV": "abbreviation"
          ,"ADJ": "adjective"
          , "ADJ.COMP": "adjective (comparative)"
          , "ADJ.SUP.ABS": "adjective (absolute superlative)"
          , "ADJ.SUP.REL": "adjective (relative superlative)"
          , "ADV": "adverb(ial)"
          , "ART": "article"
          , "ART.DEF": "article (definite)"
          , "ART.INDF": "article (indefinite)"
          , "CONJ": "conjunction"
          , "DEM": "demonstrative"
          , "DET": "determiner"
          , "EXCLM": "exclamation"
          , "INF": "infinitive"
          , "NEG": "negation, negative"
          , "NOUN": "noun"
          , "NUM": "number"
          , "PM": "punctuation mark"
          , "PREP": "preposition"
          , "PRON": "pronoun"
          , "PRON.COR": "pronoun (correlative)"
          , "PRON.DEF": "pronoun (definite)"
          , "PRON.DEM": "pronoun (demonstrative)"
          , "PRON.INDF": "pronoun (indefinite)"
          , "PRON.Q": "pronoun (interrogative)"
          , "PRON.PERS": "pronoun (personal)"
          , "PRON.POSS": "pronoun (possessive)"
          , "PRON.REFL": "pronoun (reflexive)"
          , "PRON.REL": "pronoun (relative)"
          , "PTCP": "participle"
          , "Q": "question particle/marker"
          , "SUF": "suffix"
          , "SYMB": "symbol"
          , "VERB": "verb"
          , "VERB.AUX": "auxiliary verb"
          , "VERB.MOD": "modal verb"
          , "VERB.PHRS": "phrasal verb"
        }
      }
      , tense: {
        title: "Tense"
        , values: {
          "AOR": "aorist"
          , "FUT": "future"
          , "IMPRF": "imperfect"
          , "PFV": "perfective"
          , "PLUP": "pluperfect"
          , "PRF": "perfect"
          , "PRS": "present"
        }
      }
      , voice: {
        title: "Voice"
        , values: {
          "ACT": "active "
          , "MID": "middle"
          , "MP": "middle/passive"
          , "PASS": "passive"
        }
      }
    }
    , template: {} // place holder
    , templateForTable: {
      pageTitle: "Example Table"
    } // place holder
  }
    , el: {
    button: {
      cancel: "Ματαίωσε"
      , close: "Κλείστε"
      , downloadAsPdf: "Διαβίβαζε ως PDF"
      , downloadAsTex: "Διαβίβαζε ως LaTeX"
      , remove: "Βγάλε"
      , removeAll: "Βγάλε όλων"
      , saveAsDraft: "Αποθηκεύσετε ως πρόχειρο"
      , search: "Αναζήτηση"
      , select: "Επίλεξε"
      , submit: "Να Στέιλει"
      , update: "Να Ανανεώσει"
    }
    , schemaBasedAddButton: {

    }
    , ChangePasswordPage: {
      doNotMatch: "The new password and reentered password do not match."
      , changed: "Your password was sucessfully changed."
    }
    , TextNoteEditor: {
      type: "Type"
      , bibleRef: "Bible Ref"
      , biblicalScope: "Biblical Scope"
      , biblicalLemma: "Biblical Lemma"
      , ids: "IDs"
      , settings: "Settings"
      , typeLabel: "please set the note type in the settings tab"
      , dbIds: "Use the dropdowns below to select the libraries you are using for the note..."
      , noteLibrary: "Note"
      , liturgicalGreekLibrary: "Liturgical Greek"
      , liturgicalTranslationLibrary: "Liturgical Translation"
      , biblicalGreekLibrary: "Biblical Greek"
      , biblicalTranslationLibrary: "Biblical Translation"
      , liturgicalScope: "Liturgical Scope"
      , liturgicalLemma: "Liturgical Lemma"
      , note: "Σημείωση"
      , title: "Title"
      , refersTo: "Refers to"
      , revisions: "Revisions"
      , setTypeScope: "Set Type, Scope, Lemma, Title"
      , viewLiturgicalText: "View Liturgical Text"
      , viewBiblicalText: "View Biblical Text"
      , viewFormattedNote: "Preview"
      , tags: "Tags"
      , workflow: "Workflow"
      , requiredMsg: "The note and fields in the settings tab are required."
    }
    , WorkflowForm: {
      visibility: "Visibility"
      , status: "Status"
      , AssignedTo: "Assigned to"
      , statusTypes: {
        edit: "Edit"
        , review: "Review"
        , final: "Final"
      }
      , visibilityTypes: {
        personal: "Personal - only the library owner can see/edit it"
        , private: "Private - only those granted access can see/edit it"
        , public: "Public - anyone can see it, but not edit it"
      }
    }
    , BibleRefSelector: {
        book: "το βιβλίο"
        , chapter: "το κεφάλαιο"
        , verse: "Verse"
        }
    , OntologyRefSelector: {
      type: "Οντολογικού τύπου"
      , entity: "Οντότητα"
    }
    , liturgicalAcronyms: {
      baptism: "Baptism"
      , funeral: "Funeral"
      , funeral_brightweek: "Funeral (Brightweek)"
      , li: "Divine Liturgy"
      , greatwaterblessing: "Blessing of the Waters (Great)"
      , hymnbystnektarios: "Hymn by Saint Nektarios"
      , ma: "Matins"
      , matinsordinary: "Matins (Ordinary)"
      , matinsordinary_paschal: "Matins (Ordinary - Paschal)"
      , matinsordinary_ascension: "Matins (Ordinary - Ascension)"
      , ma2: "Matins - full options"
      , memorial: "Memorial"
      , smallwaterblessing: "Blessing of the Waters (Small)"
      , unction: "Unction"
      , ve: "Vespers"
      , wedding: "Wedding"
    }
    , treebanksResultsTable: {
      filterPrompt: "πληκτρολογήστε εδώ για να φιλτράρετε τα αποτελέσματα αναζήτησης..."
      , headerParentLabel: "Γ.Σχέση"
      , headerParentToken: "Γ.Λέξη"
      , headerParentLemma: "Γ.Λέμα"
      , headerParentGrammar: "Γ.Γραμματική"
      , headerLabel: "Σχέση"
      , headerToken: "Λέξη"
      , headerLemma: "Λεμμά"
      , headerGrammar: "Γραμματική"
      , headerChildLabel: "Π.Σσχέση"
      , headerChildToken: "Π.Λέξη"
      , headerChildLemma: "Π.Λεμμά"
      , headerChildGrammar: "Π.Γραμματική"
    }
    , resultsTable: {
      filterPrompt: "πληκτρολογήστε εδώ για να φιλτράρετε τα αποτελέσματα αναζήτησης..."
      , headerComments: "Σχόλια"
      , headerDate: "Ημερομηνία"
      , headerDesc: "Περιγραφή"
      , headerDomain: "Συλλογλή"
      , headerKey: "Κλειδί"
      , headerLemma: "Πηγή"
      , headerLink: "Σύνδεσμος"
      , headerName: "Όνομα"
      , headerNote: "Σημείωση"
      , headerOntologyInstance: "Οντολογική περίπτωση"
      , headerOntologyType: "Οντολογική Κατηγορία"
      , headerScope: "Θέμα"
      , headerTags: "Ετικέτες"
      , headerText: "Κείμενο"
      , headerTo: "Αναφέρεται Σε"
      , headerTopic: "Θέμα"
      , headerType: "Τύπος"
      , headerValue: "Τιμή"
    }
    , linkSearchResultsTable: {
      filterPrompt: "πληκτρολογήστε εδώ για να φιλτράρετε τα αποτελέσματα αναζήτησης..."
      , headerDomain: "Συλλογλή"
      , headerFromId: "Από (Θέμα)"
      , headerType: "Τύπος"
      , headerToId: "Προς (Κλειδί)"
      , headerTags: "Ετικέτες"
    }
    , header: {
      about: "Σχετικά"
      , browser: "Σαΐφερ"
      , myRecords: "Τα αρχεία μου"
      , help: "Βοήθεια"
      , login: "Σύνδεση"
      , logout: "Αποσύνδεση"
      , search: "Αναζήτηση"
      , password: "Κωδικός χρήστη"
    }
    , pageAbout: {
      DbServer: "Βάση Δεδομένων διακομιστής στο"
      , RestServer: "REST διακομιστής στο"
      , wsVersion: "REST έκδοση διακομιστής"
      , appVersion: "Front-end έκδοση εφαρμογής"
      , synchEnabled: "Ο συγχρονισμός είναι ενεργοποιημένος"
      , synchDbConnectionOk: "DB Synchronization service running"
      , pageTitle: "Σχετικά με τη βάση δεδομένων"
      , para01: "Η Λειτουργική βάση δεδομένων  περιέχει την κοινή ελληνική εκδοχή από τα Ανατολικά Ορθόδοξα Χριστιανικά Λειτουργικά κείμενα και μεταφράσεις από το ελληνικό κείμενο. Επειδή τα Λειτουργικά κείμενα κάνουν αναφορά στη Βίβλο, η βάση δεδομένων περιέχει επίσης βιβλικά κείμενα, τα οποία περιλαμβάνουν τη Μετάφραση των Εβδομήκοντα (Ελληνική Παλαιά Διαθήκη), την Πατριαρχική Ελληνική Καινή Διαθήκη, και μεταφράσεις"
      , para02: "Όλες οι μεταφράσεις στη βάση δεδομένων είναι είτε από δημόσια διεύθυνση διαδικτύου ή διατίθενται με την άδειά τους, ή χρησιμοποιούνται με άδεια."
      , para03s1: "Η βάση δεδομένων αναπτύχθηκε και συντηρείται από το προσωπικό του Χριστιανικού Ορθόδοξου Αποστολικού Κέντρου"
      , para03s2: "Ο πρωταρχικός σκοπός της βάσης δεδομένων είναι να παρέχει εργαλεία για τη μετάφραση της Λειτουργίας και τη δημιουργία υπηρεσιών και βιβλίων της Λειτουργίας. Ωστόσο, παρέχεται ως δημόσια υπηρεσία για τους Ορθόδοξους Χριστιανούς σε όλο τον κόσμο."
      , para04s1: "Τα αναγνωριστικά που χρησιμοποιούνται για τον εντοπισμό μερών των κειμένων των Ακολουθειών δημιουργήθηκαν από τον Πατέρα Σεραφείμ Δέδες και χρησιμοποιούνται στο AGES Liturgical Workbench  (AWB). Το AWB αναπτύχθηκε από το OCMC και"
      , para04s2: "το ALWB χρησιμοποιείται για την παραγωγή του δικτυακού τόπου των υπηρεσιών που εντοπίζονται στο"
      , para04s3: "ALWB και άλλα λογισμικά που δημιουργήθηκαν από το OCMC έχουν ως στόχο να υποστηρίξουν οποιαδήποτε γλώσσα ομιλείται σε οποιαδήποτε χώρα για οποιαδήποτε δικαιοδοσία. Αυτός είναι ο λόγος που ένα αναγνωριστικό αποτελείται από τρία μέρη: έναν ISO κωδικό γλώσσας, έναν ISO κωδικό χώρας, και μια χώρα. Αυτό το ίδιο σύστημα αναγνώρισης χρησιμοποιείται και στα βιβλικά κείμενα."
      , contact: "Eπικοινωνήστε μαζί μας στο ηλεκτρονικό ταχυδρομείο:"
      , acknowledgements: "Ευχαριστίες"
      , ackPara01s1: "Τα ελληνικά Λειτουργικά κείμενα και οι μεταφράσεις από τα Λειτουργικά κείμενα σε αυτήν τη βάση δεδομένων είναι από το AGES Liturgical Workbench, δημιουργήθηκε από το AGES, Initiatives και OCMC.  Παρακαλούμε όπως ανατρέξετε στο"
      , ackPara01s2: "Σχετικά"
      , ackPara01s3: "σελίδα στην ιστοσελίδα AGES σχετικά με τα πνευματικά δικαιώματα."
      , ackPara02s1: "Τα ελληνικα LXX κείμενα είναι από το Πανεπιστήμιο της Πενσυλβάνια (UP), Κέντρο ανάλυσης υπολογιστών για τα κείμενα (CCAT)."
      , ackPara03s1: "Η παγκόσμια αγγλική έκδοση της Βίβλου με το Deuterocanon (webbe) είναι δημόσιος τομέας."
      , ackPara04s1: "Η μετάφραση των Εβδομήκοντα σε αμερικάνικα αγγλικά 2012 (lxx2012) είναι δημόσιος τομέας."
      , ackHebrew: "The Hebrew Old Testament (heb_il_wlc) is public domain.  It is the text as found in the Westminster Leningrad Codex (wlc). It was made available by the J. Alan Groves Center for Advanced Biblical Research."
      , website: "Ιστοσελίδα"
    }
    , pageLogin: {
      password: "κωδικός"
      , prompt: "Παρακαλώ εισάγετε τις παρακάτω πληροφορίες για να συνδεθείτε..."
      , username: "όνομα χρήστη"
      , good: "Εντάξει..."
      , bad: "Το όνομα χρήστη ή ο κωδικός δεν είναι σωστό."
    }
    , help: {
      search: {
      pageTitle: "Πώς να Κάνετε Αναζήτηση στο Λειτουργικής Βάσης Δεδομένων"
      , para01: "Παρακαλώ να έχετε κατά νου ότι πρωταρχικός σκοπός της Βάσης Δεδομένων έιναι να αποτελεί την περάτωση των εφαρμογών που παρέχει εργαλεία για μετάφραση των Λειτουργικών κειμένων, και την παραγωγή υπηρεσιών και βιβλίων. Τα κείμενα δεν αποθηκεύονται σαν βιβλία. Το Λειτουργικό κείμενο είναι χωρισμένο σε παραγράφους, και μερικές φορές σε μία μόνο λέξη ή φράση."
      , para02: "Παρόλο που ο πρωταρχικός σκοπός της Βάσης Δεδομένων είναι η χρήση σε εφαρμογές, σαν κοινή υπηρεσία με την Ορθόδοξη Χριστιανική κοινότητα παγκοσμίως, εμείς παρέχουμε τη δυνατότητα αναζήτησης στην ιστοσελίδα. Παρακάτω είναι η πληροφορία που θα σε βοηθήσει να χρησιμοποιήσεις τη λειτουργία της αναζήτησης. Κάνε κλικ σε ένα θέμα για να ανοίξουν τα περιεχόμενά του. Κάνε ξανά κλικ για να τα κρύψεις."
      , para03: "Το περιβάλλον εργασίας του χρήστη στην αναζήτηση βάσης δεδομένων συνεχίζει να δουλεύει. Αυτό που βλέπεις στις οθόνες και πως φαίνονται στη βοηθητική σελίδα μπορεί να είναι διαφορετικό ανά τακτά χρονικά διαστήματα."
      , secAdvancedSearch: "Αναζήτηση για προχωρημένους"
      , secDocIdP01: "Όταν γράφτηκε η Βίβλος, δεν είχε κεφάλαια και αριθμούς στους στίχους. Αυτά προστέθηκαν αιώνες αργότερα ώστε οι άνθρωποι να έχουν έναν κοινό, τυποποιημένο τρόπο να συζητούν για ένα συγκεκριμέν μέρος της Βίβλου. Ένα κεφάλαιο της Βίβλου και ένας αριθμός στίχου προσδιορίζουν μοναδικά ένα μικρό έγγραφο( ή doc εν συντομία). Για ένα κείμενο της Βίβλου, καλούμε αυτού του είδους το αρχείο στίχο."
      , secDocIdP02: "Ο πατήρ Σεραφείμ Δέδες δημιούργησε τα ισοδύναμα αναγνωριστικά του κεφαλαίου και του στίχου για τα Ανατολικά Ορθόδοξα Χριστιανικά Λειτουργικά κείμενα. Αυτό το αναγνωριστικό σχήμα χρησιμοποιείται στις  AGES Liturgical Workbench (ALWB), αναπτυγμένα από κοινού από τα AGES, Initiatives, Inc. and OCMC."
      , secDocIdP04: "Η περιοχή είναι ισοδύναμη με την έκδοση της μετάφρασης της Βίβλου. Για παράδειγμα, KJV για τον Βασιλιά Τζέιμς Έκδοση της Βίβλου. Το θέμα είναι ισοδύναμο με ένα όνομα από το βιβλίο της Βίβλου. Για παράδειγμα, το βιβλίο της Γένεσης. Το κλειδί είναι ισοδύναμο με το κεφάλαιο και τον αριθμό στίχου."
      , secDocIdP06: "Το κείμενο είναι από το Μηναίον,  Μήνας πρώτος, Ημέρα έκτη, δηλαδή, τα Θεοφάνεια του Κυρίου μας. Ας δούμε το ID. Το ID αναγνωριστικό αποτελείται από τον τομέα, το θέμα, και το κλειδί."
      , secDocIdP07: "Ας ξεκινήσουμε με το θέμα. Σε αυτήν την περίπτωση, το μέρος του θέματος του ID αναγνωριστικού έιναι me.m01.d06. Σημειώστε ότι συχνά τα θέματα έχουν μέρη που χωρίζονται από μια τελεία. Το πρώτο μέρος me σημαίνει Μηναίον. Το δεύτερο μέρος M01 σημαίνει  Μήνας 1. Το τελευταίο μέρος d06 σημαίνει Ημέρα 6."
      , secDocIdP08: "Τώρα, κοιτάξτε το κλειδί meVE.Apolytikion1.text. Πάλι το me σημαίνει Μηναίον. VE σημαίνει Εσπερινός. Το κλειδί δείχνει επίσης ότι αυτό είναι το Απολυτίκιον 1, το οποίο είναι ο ύμνος απόλυσης του Εσπερινού."
      , secDocIdP09: "Τέλος κοιτάξτε την περιοχή. Παρατηρήστε ότι οι δύο σειρές (μία στα αγγλικά και μία στα ελληνικά) έχουν τους διαφορετικούς τομείς, αλλά το ίδιο θέμα και κλειδί."
      , secDocIdP10: "Ένας τομέας είναι ισοδύναμος με μια έκδοση της Βίβλου, για παράδειγμα, RSV, η αναθεωρημένη πρότυπη έκδοση. Ένας τομέας έχει τρία μέρη:"
      , secDocIdP11: "Κωδικός γλώσσας"
      , secDocIdP12: "Κωδικός χώρας"
      , secDocIdP13: "Περιοχή"
      , secDocIdP14: "Ο κωδικός της γλώσσας είναι ένας κωδικός 2-3 χαρακτήρων από το Διεθνή Οργανισμό Τυποποίησης (ISO) και προσδιορίζει μοναδικά μια γλώσσα. Ο κωδικός χώρας είναι από τον ISO πίνακα κωδικού της χώρας. Η περιοχή είναι ένα αναγνωριστικό για έναν συγκεκριμένο μεταφραστή, ιδίως επισκοπή ή μητρόπολη."
      , secDocIdP15: "Ας δούμε τον τομέα gr gr cog. Το πρώτο gr είναι ο κωδικός γλώσσας, και σημαίνει ελληνικά. Σημειώστε ότι ο κωδικός ISO για τη σύγχρονη Ελληνική είναι el, έτσι το gr υποδηλώνει μη-σύγχρονη ελληνική, π.χ. Κλασική, ή Ελληνιστική, ή Βυζαντινή. Το δεύτερο gr σημαίνει τη χώρα Ελλάδα. Η περιοχή cog είναι ένα ακρωνύμιο και σημαίνει κοινή ορθόδοξη ελληνική , με άλλα λόγια, το ελληνική Λειτουργικό κείμενο που χρησιμοποιείται συνήθως από τους Ορθόδοξους Χριστιανούς ανά τον κόσμο."
      , secDocIdP16: "Ο τομέας en us dedes σημαίνει, αγγλική όπως ομιλείται στις Ηνωμένες Πολιτείες, μετάφραση του π. Σεραφείμ Δέδες. Αν και δεν παρουσιάζεται εδώ, ένα άλλο παράδειγμα είναι en uk lash, το οποίο σημαίνει αγγλική όπως ομιλείται στο Ηνωμένο Βασίλειο, μετάφραση του π Εφραίμ Lash (αιωνία η μνήμη)."
      , secDocIdPartsSearch: "Αναγνωριστικά μέρη έρευνας"
      , secDocIds: "Αναγνωριστικά Εγγράφου"
      , secDocProps: "Ιδιότητες Εγγράφου"
      , secDocPropsP01: "Κάθε βιβλικό και λειτουργικό κείμενο αποθηκευμένο στη βάση δεδομένων έχει τις ακόλουθες ιδιότητες:"
      , secDocPropsP02: "Το ID αναγνωριστικό έχει περιγραφεί παραπάνω. Η αξία είναι το ίδιο το κείμενο του εγγράφου. Το nnp σημαίνει Κανονικοποιημένη, μη στίξη. Δεν εμφανίζεται σε σας, αλλά είναι μια εκδοχή του κειμένου με τα διακριτικά (π.χ., σημάδια τονισμού) ναέχουν αφαιρεθεί, τακεφαλαία μετατρέπονται σε πεζά, και τα σημεία στίξης να έχουν αφαιρεθεί. Η σημασία της nnp ιδιότητας είναι ότι σας επιτρέπει να ψάξετε χωρίς να ανησυχείτε για την πτώση, τους τόνους, ή τα σημεία στίξης. Αυτό που επιστρέφεται από μια αναζήτηση είναι το ίδιο το κείμενο, όχι το nnp."
      , secDocPropsP03: "Σημειώστε ότι στη λειτουργία αναζήτησης (περιγράφεται παρακάτω), η φράση Αξία (nonsensitive) σημαίνει ότι η αναζήτηση χρησιμοποιεί την ιδιότητα nnp, και η φράση αναζήτησης (sensitive) σημαίνει ότι η αναζήτηση χρησιμοποιεί την ιδιότητα της Αξίας."
      , secDocRegExSearch: "Κανονική Αναζήτηση Έκφρασης"
      , secDocSearchAdvancedP01: "Η προηγμένη αναζήτηση εμφανίζεται αφού κάνετε κλικ στο σύνδεσμο που λέει Σύνθετη όταν είστε στη σελίδα αναζήτησης."
      , secDocSearchAdvancedP02: "Για να το χρησιμοποιήσετε:"
      , secDocSearchAdvancedP03: "Επιλέξτε τον τύπο του εγγράφου που θέλετε να αναζητήσετε από την αναπτυσσόμενη επισήμανση Βρες Έγγραφο(-α) όπου ο τύπος είναι ...."
      , secDocSearchAdvancedP04: "Οποιοδήποτε"
      , secDocSearchAdvancedP05: "Βιβλικό"
      , secDocSearchAdvancedP06: "Λειτουργικό"
      , secDocSearchAdvancedP07: "Επιλέξτε τον τομέα από την αναπτυσσόμενη επισήμανση «και ο τομέας είναι:»."
      , secDocSearchAdvancedP08: "Εάν επιλέξετε Βιβλικό doc ως τύπο αναζήτησης εγγράφου και επιλέξτε το «ΝΤ - Ελληνική - Πατριαρχική» τομέα, και το βιβλίο των «Πράξεων», και στο κεφάλαιο 1, θα δείτε τα ακόλουθα:"
      , secDocSearchAdvancedP09: "Εάν επιλέξετε Λειτουργικό ως τύπο αναζήτησης εγγράφου, και «Κοινή Ελληνική Ορθόδοξη», ως τομέα, και «Μηναίο», ως το βιβλίο, και Ιανουάριος », ως μήνα, θα δείτε τα ακόλουθα:"
      , secDocSearchAdvancedP10: "Μόλις φτάσετε μέχρι εδώ, μπορείτε είτε να κάνετε κλικ στο εικονίδιο αναζήτησης,"
      , secDocSearchAdvancedP11: "ή μπορείτε να ορίσετε τις επιλογές ιδιότητας."
      , secDocSearchAdvancedP12: "Για να ορίσετε τις επιλογές ιδιότητας για μια σύνθετη αναζήτηση, κάντε τα εξής:"
      , secDocSearchAdvancedP13: "Επιλέξτε την ιδιότητα:"
      , secDocSearchAdvancedP14: "Επιλέξτε το μέρος της ιδιότητας για την αναζήτηση:"
      , secDocSearchAdvancedP15: "περιέχει"
      , secDocSearchAdvancedP16: "ξεκινάει με"
      , secDocSearchAdvancedP17: "τελειώνει με"
      , secDocSearchAdvancedP18: "ταιριάζει με κανονική έκφραση"
      , secDocSearchAdvancedP19: "Εισάγετε τη λέξη ή φράση για να αναζητήσετε, ή αν είναι μια κανονική έκφραση, πληκτρολογήστε την κανονική έκφραση."
      , secDocSearchAdvancedP20: "Κάντε κλικ στο κουμπί αναζήτησης"
      , secDocSearchAdvancedP21: "Σημειώσεις"
      , secDocSearchAdvancedP22: "περιέχει σημαίνει η ιδιότητα έχει αυτή τη λέξη ή φράση σε οποιαδήποτε αξία της ιδιότητας"
      , secDocSearchAdvancedP23: "ξεκινά με σημαίνει η επιθυμητή λέξη ή φράση πρέπει να λαμβάνει χώρα από την έναρξη της ιδιότητας"
      , secDocSearchAdvancedP24: "τελειώνει με σημαίνει η επιθυμητή λέξη ή φράση πρέπει να γίνει στο τέλος της αξίας της ιδιότητας."
      , secDocSearchAdvancedP25: "ταιριάζει με κανονική έκφραση  σημαίνει ότι δεν εισάγετε μια απλή λέξη ή φράση, αλλά χρησιμοποιείτε ένα ειδικό εργαλείο γνωστό ως κανονική έκφραση. Δείτε παρακάτω."
      , secDocSearchAdvancedP26: "Συμβουλή: Σε ένα αναπτυσσόμενο, αν αρχίσετε να πληκτρολογείτε, θα φιλτράρει τις τιμές του dropdown για να ταιριάζει με ό, τι πληκτρολογείτε."
      , secDocSearchRegExP01: "Η χρήση των κανονικών εκφράσεων είναι ένα ισχυρό, αλλά πολύ προηγμένο χαρακτηριστικό. Για να μάθετε σχετικά με τις κανονικές εκφράσεις σε γενικές γραμμές, αναζητήστε στο Internet. Οι ακόλουθες πληροφορίες ειδικά για αυτήν τη βάση δεδομένων είναι προσαρμοσμένες σε ένα εγχειρίδιο Neo4j:"
      , secDocSearchRegExP02: "Η τακτική έκφραση σύνταξης που χρησιμοποιείται από τη βάση δεδομένων κληρονομείται από τις κανονικές εκφράσεις Java. Αυτό περιλαμβάνει υποστήριξη για σημαίες που αλλάζουν τον τρόπο που ταιριάζουν οι συμβολοσειρές, συμπεριλαμβανομένων τη διάκριση πεζών-κεφαλαίων (?i), πολλών γραμμών (?m) και όλων των σημείων στίξης (?s). Οι σημαίες δίνονται κατά την έναρξη της κανονικής έκφρασης."
      , secDocSearchRegExP03: "Αν η συμβολοσειρά που θέλετε δεν εμφανίζεται στην αρχή της ιδιότητας, είναι απαραίτητο να τεθεί. * Πριν από τη συμβολοσειρά. Και, εάν αυτό δεν συμβεί, στο τέλος, είναι απαραίτητο να τεθεί. * Στο τέλος. Για παράδειγμα, κάνοντας μια κανονική αναζήτηση έκφρασης χρησιμοποιώντας την έκφραση ευλογημένο θα βρεί μόνο έγγραφα που ξεκινούν με και τελειώνουν με το ευλογημένο. Δεν υπάρχουν. Η έκφραση ευλογημένο. * Θα βρεί έγγραφα που ξεκινούν με τη λέξη ευλογημένο. Η έκφραση. * Ευλογημένος θα βρεί έγγραφα που τελειώνουν με τη λέξη ευλογημένο. Και η έκφραση. * Ευλογημένο. * Θα βρει έγγραφα που έχουν τη λέξη ευλογημένο  οπουδήποτε στο κείμενο. Αυτό είναι ένα τόσο απλό παράδειγμα ότι δεν θα χρησιμοποιείτε μια κανονική έκφραση. Αλλά, απεικονίζει τη χρήση του. * όταν δημιουργεί κανονικές εκφράσεις."
      , secDocSearchRegExP04: "Κανονικές εκφράσεις μπορεί να διαφεύγουν χρησιμοποιώντας μια κάθετο. Να θυμάστε ότι η πίσω κάθετος πρέπει να διαφεύγει στην κατεξοχήν συμβολοσειρά."
      , secDocSearchRegExP05: "Από την προ-εκκρεμή κανονική έκφραση με (?i), η όλη έκφραση μετατρέπεται σε διάκριση πεζών-κεφαλαίων."
      , secDocSearchRegExP06: "*Ας εξετάσουμε ένα παράδειγμα της χρήσης μιας κανονικής έκφρασης. Ας πούμε ότι ενδιαφερόμαστε να δουμε μέρη στο λειτουργικό κείμενο, όπου ζητάμε από τον Θεό να κάνει κάτι μέσα από τις προσευχές ή τις μεσιτείες κάποιου .. Θα μπορούσαμε να χρησιμοποιήσουμε την εξής κανονική έκφραση :. * Μέσω των (προσευχών | μεσιτειών). του/της *"
      , secDocSearchRegExP07: "Έχουμε. * Στην αρχή και στο τέλος να ψάξετε για την εμφάνισή του οπουδήποτε στο έγγραφο. Και, θέλουμε να αναζητήσουμε είτε για προσευχές ή μεσιτείες, για να μπορούμε να τις βάλουμε σε παρένθεση και να διαχωρίσουμε τις δύο λέξεις χρησιμοποιώντας το σύμβολο της ορθής καθέτου γραμμής | Η οποία σε μια κανονική έκφραση σημαίνει ή."
      , secDocSearchRegExP08: "Μετά την εκτέλεση της αναζήτησης, χρησιμοποιώντας την κανονική έκφραση, το αποτέλεσμα είναι:"
      , secDocSearchRegExP09: "Όταν εξετάζουμε τα αποτελέσματα της αναζήτησης, μπορούμε να δούμε ότι η φράση «μέσα από τις προσευχές του» ή τη φράση «μέσω των μεσιτειών του« αναφέρει τους εξής:"
      , secDocSearchRegExP10: "Απόστολοι"
      , secDocSearchRegExP11: "Αρχάγγελοι"
      , secDocSearchRegExP12: "Ύψιστη ιεραρχία"
      , secDocSearchRegExP13: "Άγια Μητέρα"
      , secDocSearchRegExP14: "Μάρτυρες"
      , secDocSearchRegExP15: "Άγιοι"
      , secDocSearchRegExP16: "Θεοτόκος"
      , secDocSearchRegExP17: "ο Πρόδρομος"
      , secDocSearchRegExP18: "κτλ."
      , secDocSearchRegExP19: "Μπορείτε επίσης να χρησιμοποιήσετε τις συνήθεις εκφράσεις για να αναζητήσετε τα ελληνικά έγγραφα. Η ελληνική ισοδύναμος κανονική έκφραση για να βρεί τις παραλλαγές της φράσης βασιλεία του Θεού ή ουρανός ή Πατέρας στο ελληνικό κείμενο είναι * βασιλεια * (Θεια | οθρανων | πατρος)... *"
      , secDocSearchResultsP01a: "Παρακάτω είναι ένα παράδειγμα από το αποτέλεσμα αναζήτησης μιας φράσης"
      , secDocSearchResultsP01b: "Η βασιλεία σου από"
      , secDocSearchResultsP02: "Υπάρχουν πολλά πράγματα που πρέπει να σημειωθούν σχετικά με την παραπάνω οθόνη..."
      , secDocSearchResultsP03: "Ακριβώς κάτω από το πλαίσιο κειμένου αναζήτησης, η γραμμή Αποτέλεσμα αναζήτησης σάς λέει πόσα έγγραφα ταιριάζουν στην αναζήτησή σας. Σε αυτήν την περίπτωση, βρέθηκαν τρία έγγραφα."
      , secDocSearchResultsP04: "Κάθε αντιπαραβαλλόμενο έγγραφο εμφανίζεται με τη δική του σειρά."
      , secDocSearchResultsP05: "Κάτω από τις σειρές που των αντιπαραβαλλομένων εγγράφων είναι ένα μήνυμα που σας λέει πόσες σειρές απεικονίζονται. Σε αυτήν την περίπτωση, αυτό δείχνει σειρές 1 έως 3 από 3. Αυτό σημαίνει ότι όλα τα έγγραφα που ταιριάζουν, χωράνε σε μία μόνο ιστοσελίδα. (Δείτε παρακάτω τι συμβαίνει αν οι σειρές δεν χωράνε όλες σε μια σελίδα)"
      , secDocSearchResultsP06: "Σημειώστε ότι η φράση αναζήτησης η βασιλεία σου από είναι όλα πεζά και δεν έχει σημεία στίξης. Όμως, το αποτέλεσμα της αναζήτησης ήταν Η βασιλεία σου, από και η βασιλεία σου, από. Η απλή αναζήτηση αγνοεί κεφαλαία, διακριτικά, και σημεία στίξης."
      , secDocSearchResultsP07: "Σημειώστε ότι κάτω από τη γραμμή των αποτελεσμάτων αναζήτησης υπάρχει ένα πλαίσιο κειμένου που λέει πληκτρολογήστε εδώ για να φιλτράρετε τα αποτελέσματα της αναζήτησης .... Μόλις βρείτε τα έγγραφα, μπορείτε να τα φιλτράρετε πληκτρολογώντας επιπλέον λέξεις."
      , secDocSearchResultsP08: "Οι επικεφαλίδες των στηλών του πίνακα αποτελεσμάτων έχουν μικρά βέλη πάνω και κάτω. Κάντε κλικ σε αυτά για να ταξινομήσετε τα αποτελέσματα από μια συγκεκριμένη στήλη."
      , secDocSearchResultsP09: "Η πρώτη στήλη σε κάθε σειρά έχει ένα κουμπί επιλογής. Εάν κάνετε κλικ στο κουμπί, εμφανίζεται ένα pop-up  και εκεί θα δείτε ένα νέο πίνακα που σας δείχνει όλα τα έγγραφα που έχουν το ίδιο θέμα και κλειδί. Με άλλα λόγια, η εφαρμογή χρησιμοποιεί το αναγνωριστικό του εγγράφου που επιλέξατε για να κάνετε μια νέα αναζήτηση, αλλά αγνοεί τον τομέα. Αυτό σας επιτρέπει να συγκρίνετε εύκολα μεταφράσεις."
      , secDocSearchResultsP10: "Σημειώστε ότι εάν ο αριθμός των εγγράφων που βρέθηκαν είναι πάρα πολύς για να χωρέσει σε μία σελίδα, θα δείτε κάτι σαν αυτό:"
      , secDocSearchResultsP11: "Αυτό σας λέει ότι υπάρχουν 746 γραμμές (δηλαδή έγγραφα) και δείχνει τις σειρές 1 έως 30. Παρατηρήστε στα δεξιά υπάρχουν αριθμοί σελίδων. Μπορείτε να μεταβείτε απευθείας σε μια σελίδα. Ή μπορείτε να πάτε στην επόμενη σελίδα χρησιμοποιώντας το πλήκτρο>, ή στην τελευταία σελίδα χρησιμοποιώντας το κουμπί >>. Λάβετε υπόψη ότι η σελίδα εδώ αναφέρεται σε μια σελίδα των αποτελεσμάτων αναζήτησης, δεν είναι μια σελίδα σε ένα βιβλικό ή λειτουργικό βιβλίο."
      , secDocSearchTypes: "Tύποι Aναζήτησης Eγγράφου"
      , secDocSearchTypesP01: "Υπάρχουν διαθέσιμοι δύο τύποι αναζητήσεων- απλή και σύνθετη. Αυτοί έχουν ως εξής:"
      , secDocSearchTypesP02: "Όταν βρίσκεστε στη σελίδα αναζήτησης, μπορείτε να κάνετε κλικ στους μπλε συνδέσμους για να αποκτήσετε πρόσβαση στον τύπο αναζήτησης που θέλετε."
      , secDocSimpleSearchP01: "Η απλή αναζήτηση εμφανίζεται αυτόματα όταν ξεκινάτε την πρώτη πρόσβαση στη σελίδα αναζήτησης. Εάν έχετε ενεργοποιημένη την Προηγμένη αναζήτηση ή την αναζήτηση ID αναγνωριστικού μέρους, κάντε κλικ στο σύνδεσμο Απλή για να επιστρέψετε στην απλή αναζήτηση."
      , secDocSimpleSearchP02: "Για να το χρησιμοποιήσετε"
      , secDocSimpleSearchP03: "Στο πλαίσιο κειμένου, πληκτρολογήστε μια λέξη ή μια φράση."
      , secDocSimpleSearchP04: "Κάντε κλικ στο κουμπί αναζήτησης"
      , secDocSimpleSearchP05: "Σημειώστε ότι η λέξη ή η φράση που εισάγετε δε χρειάζεται να είναι στα κεφαλαία, ή (εάν είναι Ελληνικά) με τόνους Η απλή αναζήτηση χρησιμοποιεί τις ιδιότητες του εγγράφου nnp."
      , secDocSimpleSearchP06: "Επίσης, σημειώστε ότι η απλή αναζήτηση ψάχνει μόνο έγγραφα που είναι Λειτουργικά. Δεν κάνει αναζήτηση στα Βιβλικά έγγραφα."
      , secSimpleSearch: "Απλή αναζήτηση"
      , secSearchResults: "Αποτέλεσμα Αναζήτησης"
      , secDocVersionComparisonTitle: "Συγκρίνοντας Εκδόσεις"
      , secDocVersionComparisonP01: "  Τα αποτελέσματα της αναζήτησης εμφανίζουν κάθε έγγραφο σε ξεχωριστή σειρά. Τι γίνεται αν θέλετε να συγκρίνετε εκδόσεις, χρησιμοποιώντας το ίδιο θέμα και κλειδί; Σημειώστε ότι η πρώτη στήλη κάθε σειράς έχει ένα κουμπί επιλογής. Εάν πληκτρολογήσετε το κουμπί επιλογής της γραμμής που θέλετε να συγκρίνετε, εμφανίζεται ένα αναδυόμενο παράθυρο και δείχνει όλες τις εκδόσεις που έχουν το ίδιο θέμα και κλειδί για τη γραμμή που έχετε επιλέξει."
      , headerDomain: "Συλλογλή"
      , headerKey: "Κλειδί"
      , headerTopic: "Θέμα"
      , headerValue: "Τιμή"
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      }
    }
    , search: {
      advanced: "Προχωρημένη αναζήτηση"
      , prompt: "εισάγετε μία λέξη ή φράση"
      , findWhereTypeIs: "Βρες Έγγραφο(-α) όπου ο τύπος είναι..."
      , docTypeAny: "οποιαδήποτε"
      , biblical: "βιβλικό"
      , clickTheButton: "Κάντε κλικ στο παρακάτω κουμπί για να υποβάλετε τα κριτήρια αναζήτησής σας..."
      , liturgical: "λειτουργική"
      , domainIs: "και ο τομέας είναι..."
      , bookIs: "και το βιβλίο είναι..."
      , monthIs: "και το μήνα είναι..."
      , weekIs: "και το εβδομάδα είναι..."
      , dayIs: "και η ημέρα είναι..."
      , chapterIs: "και το κεφάλαιο είναι..."
      , sectionIs: "και το τμήμα είναι..."
      , serviceIs: "και η ακολουθία είναι..."
      , modeIs: "και ο ἦχος είναι..."
      , typeIs: "και ο τύπος είναι..."
      , propertyIs: "και η ιδιότητα είναι:"
      , propertyTextIs: "και έχει αυτό το κείμενο..."
      , matcherIs: "που ταιριάζει..."
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      , msg1: "Σημαντικά μηνύματα θα εμφανίζονται εδώ..."
      , msg2: "αναζήτηση..."
      , msg3: "Βρέθηκε"
      , msg4: "Έγγραφα"
      , msg5: "Μπορείτε να χρησιμοποιήσετε το παρακάτω πλαίσιο για να φιλτράρετε τα αποτελέσματα."
      , msg6: "Για να δείτε έγγραφα με το ίδιο θέμα και κλειδί, πατήστε το κουμπί της γραμμής που σας ενδιαφέρει."
      , pageTitle: "Αναζητήστε τη βάση δεδομένων"
      , resultLabel: "Αποτέλεσμα αναζήτησης"
      , simple: "Απλή αναζήτηση"
      , close: "Κλείστε"
      , creating: "Δημιουργώντας το..."
      , created: "Το δημιούργησε"
      , submit: "Να Στέιλει"
      , submitting: "Έστειλε..."
      , exists: "υπάρχει ήδη..."
      , selectVersion: "Επιλέξτε την έκδοση που θέλετε.  Συνήθως θα πρέπει να είναι η ελληνική."
      , selectedId: "ID της επιλογής"
      , selectedValue: "Κείμενο της επιλογής"
      , IdParts: {
        title: "ID Parts Builder"
        , msg1: "All items in the database must have an ID.  An ID has three parts: a library, a topic, and a key. Depending on the type of item, you will need to either select or type in one or more parts of the ID."
        , msg2: "Follow the instructions below to build the parts of the ID for this item..."
        , topic: "Topic"
        , key: "Key"
        , BIBLICAL_BOOK_ABBREVIATION: {
          prompt: "Select the name of the book..."
          , topic: "Topic: Abbreviation for the name of the book"
          , topicValue: "Book abbreviation"
          , key: ""
          , keyValue: ""
        }
        , BIBLICAL_CHAPTER_VERSE: {
          prompt: "Select the chapter, verse, and (optional) verse subpart"
          , topic: ""
          , topicValue: ""
          , key: "Key: Chapter:Verse"
          , keyValue: "Chapter:Verse"
          , chapter: "Chapter"
          , verse: "Verse"
          , versePart: "Verse Part"
        }
        , ID_OF_SELECTED_BIBLICAL_VERSE:{
          prompt: "Select the Biblical Verse..."
          , topic: "Topic: ID of the Biblical Verse"
          , topicValue: "Biblical Verse"
          , key: "Key: ID of the Biblical Verse"
          , keyValue: "Biblical Verse"
        }
        , ID_OF_SELECTED_LITURGICAL_TEXT: {
          prompt: "Select the Liturgical text..."
          , topic: "Topic: ID of the Liturgical Text"
          , topicValue: "Liturgical Text"
          , key: "Key: ID of the Liturgical Text"
          , keyValue: "Liturgical Text"
        }
        , ID_OF_SELECTED_ONTOLOGY_INSTANCE: {
          prompt: ""
          , topic: ""
          , topicValue: ""
          , key: ""
          , keyValue: ""
        }
        , KEY_FROM_ID_OF_SELECTED_BIBLICAL_VERSE: {
          prompt: ""
          , topic: ""
          , topicValue: ""
          , key: ""
          , keyValue: ""
        }
        , KEY_FROM_ID_OF_SELECTED_LITURGICAL_TEXT: {
          prompt: ""
          , topic: ""
          , topicValue: ""
          , key: ""
          , keyValue: ""
        }
        , ONTOLOGY_TOPIC: {
          prompt: ""
          , library: "Library:"
          , topic: "Topic: Ontology Type"
          , topicValue: ""
          , key: "Key: Name"
          , keyValue: ""
        }
        , NOTE_USING_ID_OF_SELECTED_TEXT: {
          prompt: "Select the Liturgical text..."
          , library: "Library: your personal library"
          , topic: "Topic: ID of the selected Liturgical Text"
          , topicValue: "Liturgical Text"
          , key: "Key: system generated timestamp"
          , keyValue: "Timestamp"
        }
        , TIMESTAMP: {
          prompt: "System generated timestamp..."
          , topic: ""
          , topicValue: ""
          , key: "Key: system generated timestamp"
          , keyValue: "Timestamp"
        }
        , TOPIC_FROM_ID_OF_SELECTED_BIBLICAL_VERSE: {
          prompt: "Select the ID of the Biblical verse..."
          , topic: ""
          , topicValue: ""
          , key: ""
          , keyValue: ""
        }
        , TOPIC_FROM_ID_OF_SELECTED_LITURGICAL_TEXT: {
          prompt: ""
          , topic: ""
          , topicValue: ""
          , key: ""
          , keyValue: ""
        }
        , USER_TEXT: {
          prompt: "enter text here..."
          , topic: "Topic: text that you enter"
          , topicValue: ""
          , key: "Key: text that you enter"
          , keyValue: ""
          , button: "Set "
        }
      }
      , searchToSelectInstructions: "Search the database to select the doc you want. When you find it, click the 'Select' button."
      , loadingDropdowns: "Loading dropdowns for search..."
    }
    , searchNotes: {
      prompt: "Βρείτε σημειώσεις"
      , clickTheButton: "Κάντε κλικ στο παρακάτω κουμπί για να υποβάλετε τα κριτήρια αναζήτησής σας..."
      , findWhereTypeIs: "Βρες σχέσεις όπου το θέμα είναι..."
      , findWhereGenericTypeIs: "και το γενικό θέμα είναι..."
      , docTypeAny: "οποιαδήποτε"
      , propertyIs: "και η ιδιότητα είναι:"
      , propertyTextIs: "και έχετε αυτό το κείμενο..."
      , matcherIs: "που ταιριάζει..."
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      , msg1: "Σημαντικά μηνύματα θα εμφανίζονται εδώ..."
      , msg2: "αναζήτηση..."
      , msg3: "Βρέθηκε"
      , msg4: "σχέσεις"
      , msg5: "Μπορείτε να χρησιμοποιήσετε το παρακάτω πλαίσιο για να φιλτράρετε τα αποτελέσματα."
      , msg6: "Για να επεξεργαστείτε μια σχέση, πατήστε το κουμπί της γραμμής που σας ενδιαφέρει."
      , pageTitle: "Αναζητήστε τη βάση δεδομένων για στις σημειώσεις σας"
      , resultLabel: "Αποτέλεσμα αναζήτησης"
      , close: "Κλείστε"
      , has: "και έχει"
      , tags: "αυτές τις ετκέτες"
      , tagsAll: "όλες"
      , tagsAny: "οποιαδήποτε από"
      , creating: "Δημιουργώντας το..."
      , created: "Το δημιούργησε"
      , submit: "Να Στέιλει"
      , submitting: "Έστειλε..."
      , exists: "υπάρχει ήδη..."
      , textPrompt: "πληκτρολογήστε κείμενο για αναζήτηση εδώ"
    }
    , searchTemplates: {
      prompt: "Βρείτε κομμάτια"
      , clickTheButton: "Κάντε κλικ στο παρακάτω κουμπί για να υποβάλετε τα κριτήρια αναζήτησής σας..."
      , findWhereTypeIs: "Βρείτε κομμάτια όπου βρίσκεται ο τύπος..."
      , findWhereGenericTypeIs: "και το γενικό θέμα είναι..."
      , docTypeAny: "οποιαδήποτε"
      , propertyIs: "και η ιδιότητα είναι:"
      , propertyTextIs: "και έχετε αυτό το κείμενο..."
      , matcherIs: "που ταιριάζει..."
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      , msg1: "Σημαντικά μηνύματα θα εμφανίζονται εδώ..."
      , msg2: "αναζήτηση..."
      , msg3: "Βρέθηκε"
      , msg4: "σχέσεις"
      , msg5: "Μπορείτε να χρησιμοποιήσετε το παρακάτω πλαίσιο για να φιλτράρετε τα αποτελέσματα."
      , msg6: "Για να επεξεργαστείτε μια σχέση, πατήστε το κουμπί της γραμμής που σας ενδιαφέρει."
      , pageTitle: "Αναζητήστε τη βάση δεδομένων για πρότυπα"
      , resultLabel: "Αποτέλεσμα αναζήτησης"
      , close: "Κλείστε"
      , has: "και έχει"
      , tags: "αυτές τις ετκέτες"
      , tagsAll: "όλες"
      , tagsAny: "οποιαδήποτε από"
      , creating: "Δημιουργώντας το..."
      , created: "Το δημιούργησε"
      , submit: "Να Στέιλει"
      , submitting: "Έστειλε..."
      , exists: "υπάρχει ήδη..."
    }
    , searchTreebanks: {
      prompt: "Βρείτε σημειώσεις"
      , clickTheButton: "Κάντε κλικ στο παρακάτω κουμπί για να υποβάλετε τα κριτήρια αναζήτησής σας..."
      , findWhereTypeIs: "Βρες σχέσεις όπου ο τύπος είναι..."
      , findWhereGenericTypeIs: "και το γενικό θέμα είναι..."
      , docTypeAny: "οποιαδήποτε"
      , propertyIs: "και η ιδιότητα είναι:"
      , propertyTextIs: "και έχετε αυτό το κείμενο..."
      , matcherIs: "που ταιριάζει..."
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      , msg1: "Σημαντικά μηνύματα θα εμφανίζονται εδώ..."
      , msg2: "αναζήτηση..."
      , msg3: "Βρέθηκε"
      , msg4: "αναλύσεις"
      , msg5: "Μπορείτε να χρησιμοποιήσετε το παρακάτω πλαίσιο για να φιλτράρετε τα αποτελέσματα."
      , msg6: "Για να επεξεργαστείτε μια σχέση, πατήστε το κουμπί της γραμμής που σας ενδιαφέρει."
      , pageTitle: "Αναζητήστε τη βάση δεδομένων για στις σημειώσεις σας"
      , resultLabel: "Αποτέλεσμα αναζήτησης"
      , close: "Κλείστε"
      , has: "και έχει"
      , tags: "αυτές τις ετκέτες"
      , tagsAll: "όλες"
      , tagsAny: "οποιαδήποτε από"
      , creating: "Δημιουργώντας το..."
      , created: "Το δημιούργησε"
      , submit: "Να Στέιλει"
      , submitting: "Έστειλε..."
      , exists: "υπάρχει ήδη..."
    }
    , searchOntology: {
      prompt: "εισάγετε μία λέξη ή φράση"
      , clickTheButton: "Κάντε κλικ στο παρακάτω κουμπί για να υποβάλετε τα κριτήρια αναζήτησής σας..."
      , findWhereTypeIs: "Βρες σχέσεις όπου το θέμα είναι..."
      , findWhereGenericTypeIs: "και το γενικό θέμα είναι..."
      , docTypeAny: "οποιαδήποτε"
      , propertyIs: "και η ιδιότητα είναι:"
      , propertyTextIs: "και έχει αυτό το κείμενο..."
      , matcherIs: "που ταιριάζει..."
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      , msg1: "Σημαντικά μηνύματα θα εμφανίζονται εδώ..."
      , msg2: "αναζήτηση..."
      , msg3: "Βρέθηκε"
      , msg4: "σχέσεις"
      , msg5: "Μπορείτε να χρησιμοποιήσετε το παρακάτω πλαίσιο για να φιλτράρετε τα αποτελέσματα."
      , msg6: "Για να επεξεργαστείτε μια σχέση, πατήστε το κουμπί της γραμμής που σας ενδιαφέρει."
      , pageTitle: "Αναζητήστε τη βάση δεδομένων για τα Οντολογικά Θέματα"
      , resultLabel: "Αποτέλεσμα αναζήτησης"
      , close: "Κλείστε"
      , has: "και έχει"
      , tags: "αυτές τις ετκέτες"
      , tagsAll: "όλες"
      , tagsAny: "οποιαδήποτε από"
      , creating: "Δημιουργώντας το..."
      , created: "Το δημιούργησε"
      , submit: "Να Στέιλει"
      , submitting: "Έστειλε..."
      , exists: "υπάρχει ήδη..."
    }
    , searchLinks: {
      prompt: "εισάγετε μία λέξη ή φράση"
      , clickTheButton: "Κάντε κλικ στο παρακάτω κουμπί για να υποβάλετε τα κριτήρια αναζήτησής σας..."
      , findWhereTypeIs: "Βρες σχέσεις όπου ο τύπος είναι..."
      , docTypeAny: "οποιαδήποτε"
      , propertyIs: "και η ιδιότητα είναι:"
      , propertyTextIs: "και έχει αυτό το κείμενο..."
      , matcherIs: "που ταιριάζει..."
      , matchesAtTheStart: "στην αρχή"
      , matchesAtTheEnd: "στο τέλος"
      , matchesAnywhere: "παντού"
      , matchesRegEx: "σαν ένα regular expression"
      , msg1: "Σημαντικά μηνύματα θα εμφανίζονται εδώ..."
      , msg2: "αναζήτηση..."
      , msg3: "Βρέθηκε"
      , msg4: "σχέσεις"
      , msg5: "Μπορείτε να χρησιμοποιήσετε το παρακάτω πλαίσιο για να φιλτράρετε τα αποτελέσματα."
      , msg6: "Για να επεξεργαστείτε μια σχέση, πατήστε το κουμπί της γραμμής που σας ενδιαφέρει."
      , pageTitle: "Αναζητήστε τη βάση δεδομένων για τα κείμενα"
      , resultLabel: "Αποτέλεσμα αναζήτησης"
      , close: "Κλείστε"
      , has: "και έχει"
      , tags: "αυτές τις ετκέτες"
      , tagsAll: "όλες"
      , tagsAny: "οποιαδήποτε από"
      , creating: "Δημιουργώντας το..."
      , created: "Το δημιούργησε"
      , submit: "Να Στέιλει"
      , submitting: "Έστειλε..."
      , exists: "υπάρχει ήδη..."
    }
    , DependencyDiagram: {
      title: "Dependency Diagram for"
      , about: "Dependency Diagrams provide information about the grammar of words or punctuation marks and their syntactic role."
      , instructions: "Scroll left or right and up and down to see more of the diagram.  Double-click a node to contract or expand it."
      , toLearn: "To learn about dependency diagrams see"
      , this: "this"
      , and: "and"
    }
    , Grammar: {
      title: "Grammar Explorer for "
      , button: "Grammar Explorer"
      , instructions: "Use this section to view grammatical information about Greek words..."
      , panelCompare: "Greek Text and Translations"
      , panelDependency: "Dependency Diagram"
      , panelAnalyses: "Potential Analyses"
      , panelPerseusSite: "Perseus Web Site"
      , panelLexigramSite: "Lexigram Web Site (στα Ελληνικά)"
      , panelLogeion: "Logeion Web Site"
      , panelLaParola: "LaParola Web Site"
      , panelKriaras: "Kriaras (στα Ελληνικά)"
      , panelTriantafyllides: "Triantafyllides (στα Ελληνικά)"
      , panelBasicLexicon: "Basic Lexicon of Ancient Greek (στα Ελληνικά)"
      , panelTig: "TLG Corpus Search (requires subscription to TLG)"
      , panelTreebanks: "Sample Treebanks"
      , panelSmyth: "Smyth Greek Grammar"
      , panelOald: "Oxford Advanced Learner's Dictionary"
      , colLemma: "Lemma"
      , colParse: "Parse"
      , colGlosses: "Glosses"
      , colAnalyses: "ExPex"
      , colSource: "Source"
    }
    , HyperTokenText: {
      title: "Text For "
      , instructions: "Click on a token (e.g. a word) to get information about it..."
    }
    , ldp: {
      prompt: "Επιλέξτε τον τύπο ημερολογίου και ημερομηνιών από τον οποίο θέλετε να δείτε τα Λειτουργικά Θέματα των Ημερών..."
      , calendar: "Ημερολόγιο"
      , julian: "Ιουλιανό ( Παλιό) Ημερολόγιο"
      , gregorian: "Γρηγοριανό (Νέο) Ημερολόγιο"
    }
    , httpCodes: {
      200: "OK"
      , 201: "Created"
      , 400: "Bad request"
      , 401: "Not authorized"
      , 404: "Not found"
      , 405: "Not authorized"
      , 409: "Already exists"
      , 500: "Server error"
    }
    , NewEntry: {
      submit: "Submit"
    }
    , ParaTextEditor: {
      panelTitle: "View Parallel Texts in Rows"
      , msg1: ""
      , msg2: ""
      , showingMatchesFor: "Showing matches for "
      , yourTranslation: "Your Translation"
      , valueFor: "Value for"
      , submit: "Submit"
      , biblicalLinksPanelTitle: "Biblical References Made By the Greek Text"
      , grammarPanelTitle: "Grammar Explorer"
      , ontologyLinksPanelTitle: "Ontology References Made By the Greek Text"
      , textualNotesPanelTitle: "Textual Notes"
      , userNotesPanelTitle: "Personal Notes"
    }
    , TopicsSelector : {
      panelTitle: "Text Topic Selector"
      , instructions: "Use the Text Topic Selector to select the Topic you want."
    }
    , FormattedTextNote: {

    }
    , ModalAgesServiceSelector: {
      panelTitle: "Sacraments and Services Available from the AGES Website"
      , msg1: "Select a Sacrament or Dated Service by clicking the radio-button in the first column of that row. "
      , msg2: "Click the up and down triangles to sort a column. "
      , msg3: "Enter part or all of a word or use a Regular Expression to filter the rows. "
      , msg4: "Type 'any' into the Date or Day of Week filter to view available Sacraments.  Type 'daily' into the Type filter to view daily readings for each month. Type 'Menaion', 'Triodion', 'Pentecostarion', or 'Synaxarion' to view those books."
      , type: "Type"
      , date: "Date"
      , dayOfWeek: "Day of Week"
      , close: "Close"
    }
    , ModalReactSelector: {
      panelTitle: "Selector"
      , msg1: "Make a selection..."
      , close: "Close"
    }
    , ModalTemplateNodeEditor: {
      panelTitle: "Template Node Editor"
      , msg1: "Use this form to enter information about the node... "
      , msg2: " "
      , msg3: " "
      , msg4: ""
      , editProperties: "Properties:"
      , nodeTypePrompt: "Node type:"
      , nodeSubtitle: "Node ID:"
      , selectTextId: "Select Text ID"
      , selectInsertId: "Select Template or Section ID"
      , close: "Close"
    }
    , AgesEditor: {
      panelTitle: "View and Edit a Service or Sacrament from the AGES Initiatives website"
      , msg1: " Double-click on text to open an editor window."
      , msg2: "Fetched: "
      , agesGreek: "Below, the left column is Greek from AGES, "
      , agesEnglish: "and the right column is English from AGES."
      , yourTranslationA: "the center column is your translation ("
      , yourTranslationB: "), "
      , select: "Select the Service or Sacrament"
      , selectLibrary: "Select your translation library..."
      , fetch: "Fetch the Service or Sacrament"
      , selected: "The selected service is: "
    }
    , AgesViewer: {
      panelTitle: "View a Service or Sacrament from the AGES Initiatives website"
      , msg1: " Select the service or sacrament that you want.  And, select one, two, or three libraries.  If a library does not have a translation for a particular text, it will fallback to Greek or English based on your fallback selection. After you have made your selections, click the Fetch button."
      , msg2: "Fetched: "
      , agesGreek: "AGES Greek"
      , agesEnglish: "AGES English Translations"
      , select: "Select the Service or Sacrament"
      , selectFirstLibrary: "Select library for column 1..."
      , selectFirstLibraryFallback: "Select fallback library for column 1..."
      , selectSecondLibrary: "Select library for column 2..."
      , selectSecondLibraryFallback: "Select fallback library for column 2..."
      , selectThirdLibrary: "Select library for column 3..."
      , selectThirdLibraryFallback: "Select fallback library for column 3..."
      , fetch: "Fetch the Service or Sacrament"
      , selected: "The selected service is: "
    }
    , ModalParaRowEditor: {
      panelTitle: "Text Editor"
      , msg1: "The text editor has three sections. The first section is a table that shows the Greek text and translations of the text. The second section has a text box for you to enter your translation. When you are ready, click the Submit button to update the database with your changes.  The third section is the Grammar Explorer.  Click on the title of the Grammar Explorer to expand it. Click again on the title to hide it. Close this window by using the X at the upper right, or by clicking the Close button at the bottom, or by pressing the Escape key."
      , msg2: "The text editor has three sections. The first section is a table that shows the Greek text and translations of the text. The second section has a text box with the current value of the translation of the selected library.  However, you do not have authority to edit it. The third section is the Grammar Explorer.  Click on the title of the Grammar Explorer to expand it. Click again on the title to hide it. Close this window by using the X at the upper right, or by clicking the Close button at the bottom, or by pressing the Escape key."
      , close: "Close"
    }
    , NewEntryForm: {
      title: "New Entry Form"
    }
    , ParaColTextEditor: {
      panelTitle: "View and Edit Parallel Texts in Columns"
      , msg1: "Select a topic, then select one or more libraries.  Then click the button."
      , msg2: "Double-Click to edit a cell. You can sort the columns using the up and down triangles. You can filter a column by typing in the box below the column name. Clear the filters using the button to the right."
      , key: "Key"
      , view: "Select a topic..."
      , including: "Including"
      , select: "you may select up to "
      , libraries: "libraries."
      , sourceRequired: "You must include the source library "
      , maxLibraries: "The maximum of number of libraries you may select is"
    }
    , GlossBuilder: {
      panelTitle: "Gloss Builder"
      , instructions: "Use the Gloss Builder to add words to the gloss, and indicate their sense."
      , gloss: "Gloss"
      , bracket: "[]?"
      , wnSense: "WN Sense"
      , oxSense: "Ox Sense"
    }
    , ViewRelationships: {
      panelTitle: "Links for "
      , msg1: ""
    }
    , ViewReferences: {
      panelTitle: "made by"
      , biblicalRef: "Biblical References"
      , library: "recorded in the library library"
      , liturgicalText: "Liturgical text..."
      , ontologyRef: "Ontology References"
      , theText: "Το κείμενο..."
      , textualReference: "Αναφορά Κειμένου"
      , refersTo: "αναφέρεται σε..."
      , infoBelow: "Πληροφορίες σχετικά με την αναφορά είναι παρακάτω...."
      , prompt: "The default library for references is en_sys_ontology.  If you have authorization to view a different library, you may select it from the dropdown below."
    }
      , TemplateEditor: {
      panelTitle: "Template Editor"
      , instructions: "Use the Template Editor to create reusable templates to generate Liturgical books or services."
      , expandAll: "Expand All"
      , collapseAll: "Collapse"
    }
    , TokenTagger: {
      panelTitle: "Token Tagger"
      , instructions: "Use the Token Tagger to set the grammatical tags, lemma, gloss, and dependency information for the selected token (e.g. word or punctuation mark).  After you select the Part of Speech, you will see additional lists to select from.  When you are finished, click the 'Submit' button to save your work and update the Dependency Diagram."
      , lemma: "Lemma"
      , gloss: "Gloss"
      , help: "Tagging Guidelines"
      , examples: "Tagging Examples"
      , leipzig: "Leipzig Glossing Rules"
      , oxford: "Oxford English Dictionary"
    }
    , WorkflowAssignment: {
      title: "Workflow Assignment"
      , instructions: "Use this section to set the status and assignedToUser fields of the form..."
      , status: "Selected status:"
      , user: {
        EDITING: "Select a user to do the editing:"
        , HOLDING: ""
        , READY_TO_REVIEW: "Select an Admin to assign someone to do the review:"
        , REVIEWING: "Select a user to do the review:"
        , READY_TO_EDIT: "Select an Admin to assign someone to do the editing:"
        , READY_TO_FINALIZE: "Select an Admin to to the finalizing:"
        , FINALIZED: ""
      }
      , submit: "Submit"
    }
    , RichEditor: {

    }
    , messages: {
      initial: "Important messages will appear here..."
      , creating: "Creating"
      , created: "Created"
      , requiredNotCompleted: "You have not completed required fields"
      , status: "Status: "
      , retrieving: "retrieving..."
      , searching: "searching..."
      , updating: "updating..."
      , updated: "updated..."
      , resultLabel: "Search Result"
      , found: "Found"
      , docs: "docs"
      , submit: "Submit"
      , regEx: "Enter Regex"
      , clearFilters: "Clear Filters"
      , filter: "You can use the box(es) below to filter the results."
      , click: "Click the radio button of the row you are interested in."
      , readOnly: "Μπορείτε να το δείτε αλλά να μην το επεξεργαστείτε"
      , ok: "Εντάξει"
      , preparingPdf: "Preparing the PDF"
    }
    , grammarTerms: {
      case: {
        title: "Case"
        , values: {
          "ACC": "accusative "
          , "DAT": "dative"
          , "GEN": "genitive"
          , "NOM": "nominative"
          , "VOC": "vocative "
        }
      }
      , categories: {
        title: "Syntactic Category"
        , values: {
          "ADV": "adverb"
          , "APOS": "apposing element"
          , "ATR": "attributive"
          , "ATV": "complement"
          , "AuxC": "conjunction"
          , "AuxG": "bracketing punctuation"
          , "AuxK": "terminal punctuation"
          , "AuxP": "preposition"
          , "AuxV": "auxiliary verb"
          , "AuxX": "commas"
          , "AuxY": "sentence adverbials"
          , "AuxZ": "emphasizing particles"
          , "COORD": "coordinator"
          , "ExD": "ellipsis"
          , "MWE": "multi-word expression"
          , "OBJ": "object"
          , "OCOMP": "object complement"
          , "PNOM": "predicate nominal"
          , "PRED": "predicate"
          , "PRED-CO": "predicate complement"
          , "ROOT" : "root of the dependency tree"
          , "SBJ": "subject"
          , "SCAN": "scansion (metrical pattern marker)"
        }
      }
      , gender: {
        title: "Gender"
        , values: {
          "F": "feminine"
          , "M": "masculine"
          , "N": "neuter"
        }
      }
      , mood: {
        title: "Mood"
        , values: {
          "IMP": "imperative"
          , "IND": "indicative"
          , "OPT": "optative"
          , "SBJV": "subjunctive"
        }
      }
      , number: {
        title: "Number"
        , values: {
          "DU": "dual"
          , "PL": "plural"
          , "SG": "singular"
        }
      }
      , person: {
        title: "Person"
        , values: {
          "1": "first person"
          , "2": "second person"
          , "3": "third person"
        }
      }
      , pos: {
        title: "Part of Speech"
        , values: {
          "ABRV": "abbreviation"
          , "ADJ": "adjective"
          , "ADJ.COMP": "adjective (comparative)"
          , "ADJ.SUP.ABS": "adjective (absolute superlative)"
          , "ADJ.SUP.REL": "adjective (relative superlative)"
          , "ADV": "adverb(ial)"
          , "ART": "article"
          , "ART.DEF": "article (definite)"
          , "ART.INDF": "article (indefinite)"
          , "AUX": "auxiliary"
          , "CONJ": "conjunction"
          , "DEM": "demonstrative"
          , "DET": "determiner"
          , "EXCLM": "exclamation"
          , "INF": "infinitive"
          , "NEG": "negation, negative"
          , "NOUN": "noun"
          , "NUM": "number"
          , "PM": "punctuation mark"
          , "PREP": "preposition"
          , "PRON": "αντωνυμία"
          , "PRON.COR": "αντωνυμία (συσχετική)"
          , "PRON.DEF": "αντωνυμία (οριστική)"
          , "PRON.DEM": "αντωνυμία (δεικτική)"
          , "PRON.INDF": "αντωνυμία (αόριστη)"
          , "PRON.Q": "αντωνυμία (ερωτηματική)"
          , "PRON.PERS": "αντωνυμία (προωπική)"
          , "PRON.POSS": "αντωνυμία (κτητική)"
          , "PRON.REFL": "αντωνυμία (αυτοπαθής)"
          , "PRON.REL": "αντωνυμία (αναφορική)"
          , "PTCP": "participle"
          , "Q": "question particle/marker"
          , "SUF": "suffix"
          , "SYMB": "symbol"
          , "VERB": "verb"
          , "VERB.AUX": "auxiliary verb"
          , "VERB.MOD": "modal verb"
          , "VERB.PHRS": "phrasal verb"
         }
      }
      , tense: {
        title: "Tense"
        , values: {
          "AOR": "aorist"
          , "FUT": "future"
          , "IMPRF": "imperfect"
          , "PFV": "perfective"
          , "PLUP": "pluperfect"
          , "PRF": "perfect"
          , "PRS": "present"
        }
      }
      , voice: {
        title: "Voice"
        , values: {
          "ACT": "active "
          , "MID": "middle"
          , "MP": "middle/passive"
          , "PASS": "passive"
        }
      }
    }
    , template: {} // place holder
    , templateForTable: {
      pageTitle: "Example Table"
    } // place holder
  }
}

module.exports = {
  labels : labels
  , getAllLabels: (code) => {
    return labels[code];
    }
  , getAllLabelsAppended: (code, localEng, local) => {
    return labels[code];
  }
  , getChangePasswordPageLabels: (code) => { return labels[code].ChangePasswordPage }
  , getMessageLabels: (code) => { return labels[code].messages }
  , getButtonLabels: (code) => { return labels[code].button }
  , getResultsTableLabels: (code) => { return labels[code].resultsTable;}
  , getTreebankSearchResultsTableLabels: (code) => { return labels[code].treebanksResultsTable;}
  , getLinkSearchResultsTableLabels: (code) => { return labels[code].linkSearchResultsTable;}
  , getHeaderLabels: (code) => { return labels[code].header;}
  , getHelpLabels: (code) => { return labels[code].help;}
  , getDependencyDiagramLabels: (code) => { return labels[code].DependencyDiagram;}
  , getGrammarLabels: (code) => { return labels[code].Grammar;}
  , getGrammarTerms: (code, category) => {
      if (category) {
        return labels[code].grammarTerms[category];
      } else {
        return labels[code].grammarTerms;
      }
    }
  , getGrammarTermsCase: (code) => { return labels[code].grammarTerms.case;}
  , getGrammarTermsCategories: (code) => { return labels[code].grammarTerms.categories;}
  , getGrammarTermsGender: (code) => { return labels[code].grammarTerms.gender;}
  , getGrammarTermsMood: (code) => { return labels[code].grammarTerms.mood;}
  , getGrammarTermsNumber: (code) => { return labels[code].grammarTerms.number;}
  , getGrammarTermsPerson: (code) => { return labels[code].grammarTerms.person;}
  , getGrammarTermsPartsOfSpeech: (code) => {return labels[code].grammarTerms.pos;}
  , getGrammarTermsTense: (code) => { return labels[code].grammarTerms.tense;}
  , getGrammarTermsVoice: (code) => { return labels[code].grammarTerms.voice;}
  , getHyperTokenTextLabels: (code) => { return labels[code].HyperTokenText;}
  , getComponentNewEntryLabels: (code) => { return labels[code].NewEntry;}
  , getComponentParaTextEditorLabels: (code) => { return labels[code].ParaTextEditor;}
  , getAgesEditorLabels: (code) => { return labels[code].AgesEditor;}
  , getAgesViewerLabels: (code) => { return labels[code].AgesViewer;}
  , getBibleRefSelectorLabels: (code) => { return labels[code].BibleRefSelector;}
  , getFormattedTextNoteLabels: (code) => { return labels[code].FormattedTextNote;}
  , getOntologyRefSelectorLabels: (code) => { return labels[code].OntologyRefSelector;}
  , getNewEntryFormLabels: (code) => { return labels[code].NewEntryForm;}
  , getParaColTextEditorLabels: (code) => { return labels[code].ParaColTextEditor;}
  , getModalAgesServiceSelectorLabels: (code) => { return labels[code].ModalAgesServiceSelector;}
  , getModalParaRowEditorLabels: (code) => { return labels[code].ModalParaRowEditor;}
  , getModalReactSelectorLabels: (code) => { return labels[code].ModalReactSelector;}
  , getModalTemplateNodeEditorLabels: (code) => { return labels[code].ModalTemplateNodeEditor;}
  , getWorkflowAssignmentLabels: (code) => { return labels[code].WorkflowAssignment;}
  , getPageAboutLabels: (code) => { return labels[code].pageAbout;}
  , getPageLoginLabels: (code) => { return labels[code].pageLogin;}
  , getRichEditorLabels: (code) => { return labels[code].RichEditor;}
  , getSchemaBasedAddButtonLabels: (code) => { return labels[code].schemaBasedAddButton;}
  , getSearchLabels: (code) => { return labels[code].search;}
  , getSearchLinksLabels: (code) => { return labels[code].searchLinks;}
  , getSearchNotesLabels: (code) => { return labels[code].searchNotes;}
  , getSearchTemplatesLabels: (code) => { return labels[code].searchTemplates;}
  , getSearchOntologyLabels: (code) => { return labels[code].searchOntology;}
  , getSearchTreebanksLabels: (code) => { return labels[code].searchTreebanks;}
  , getTextNoteEditorLabels: (code) => { return labels[code].TextNoteEditor;}
  , getWorkflowFormLabels: (code) => { return labels[code].WorkflowForm;}
  , getGlossBuilderLabels: (code) => { return labels[code].GlossBuilder;}
  , getTopicsSelectorLabels: (code) => { return labels[code].TopicsSelector;}
  , getViewReferencesLabels: (code) => { return labels[code].ViewReferences;}
  , getViewRelationshipsLabels: (code) => { return labels[code].ViewRelationships;}
  , getTemplateEditorLabels: (code) => { return labels[code].TemplateEditor;}
  , getTokenTaggerLabels: (code) => { return labels[code].TokenTagger;}
  , getLdpLabels: (code) => { return labels[code].ldp;}
  , getLiturgicalAcronymsLabels: (code) => { return labels[code].liturgicalAcronyms;}
  , getHttpCodeLabels: (code) => { return labels[code].httpCodes;}
  , getHttpMessage: (languageCode, errorCode, errorMessage) => {
    if (labels[languageCode].httpCodes[errorCode]) {
      message = labels[languageCode].httpCodes[errorCode];
    } else {
      message = errorMessage;
    }
    return message;
  }
  , getTemplateLabels: (code) => { return labels[code].template }
  , getTemplateForTableLabels: (code) => { return labels[code].templateForTable }
}
