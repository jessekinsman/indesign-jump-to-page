/*jslint nomen: true, plusplus: true */
/*global app: false, alert: false, UserInteractionLevels: false, File: false, Window: false, SaveOptions: false */

function findPageInDoc(page) {
    "use strict";
    var myDoc,
        book,
        myBook,
        pgRng = [],
        aDoc,
        docs,
        _parsePageRange,
        _checkRange,
        _goToPage;
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
    _parsePageRange = function (range) {
        var arr = [];
        if (range.indexOf("-") > -1) {
            arr = range.split("-");
        } else {
            arr[0] = range;
        }
        return arr;
    };
    _checkRange = function (range, page) {
        var pgNum, start, end;
        pgNum = parseInt(page, 10);
        start = parseInt(range[0], 10);
        //alert("range length " + range.length + "range: " + range.toString() + "page: " + page);
        if (range.length === 1) {
            if (start === pgNum) {
                return true;
            }
        } else {
            end = parseInt(range[1], 10);
            if (start <= pgNum && end >= pgNum) {
                return true;
            }
        }
        return false;
    };
    _goToPage = function (page, doc) {
        var items,
            i,
            pg;
        items = doc.pages;
        for (i = 0; i < items.length; i++) {
            if (items[i].name === page) {
                app.activeWindow.activePage = items[i];
            }
        }
    };
    
    if (app.books.length > 0) {
        myBook = app.activeBook;
        book = myBook.bookContents;
    } else {
        book = app.activeDocument;
    }

    if (book.reflect.name === "BookContents") {
        for (docs = 0; docs < book.length; docs++) {
            myDoc = book.item(docs);

            pgRng = _parsePageRange(myDoc.documentPageRange);
            if (_checkRange(pgRng, page) === true) {
                aDoc = app.open(File(myDoc.fullName), true);
                _goToPage(page, aDoc);
                docs = book.length;
            } else if (docs + 1 === book.length) {
                alert("Page " + page + " does not exist in this book");
            }
        }
    }
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
}

function closeDoc(doc) {
    "use strict";
    if (doc.visible === false) {
        doc.close(SaveOptions.yes);
    }
}

function trim(str) {
    "use strict";
    return str.replace(/^\s+|\s+$/g, '');
}

function searchDialog() {
    "use strict";
    var myDialog = new Window("dialog", "Jump to page", undefined, {
            closeButton: true
        }),
        linkedStr = "",
        result,
        mText,
        lText,
        bGroup,
        mGroup,
        lGroup,
        term;
    lGroup = myDialog.add("group");
    lGroup.orientation = "row";
    lText = lGroup.add("editText", [0, 0, 50, 20], "", {
        multiline: false
    });
    lText.text = "#";
    lText.active = true;
    bGroup = myDialog.add("group");
    lGroup.add("button", undefined, "OK");
    lGroup.add("button", undefined, "Cancel");
    result = myDialog.show();
    if (result === 1) {
        term = lText.text;
        if (term === "Search Term" || term === "") {
            alert("No page number");
        } else {
            findPageInDoc(trim(term));
        }
    }
}



function inspectObject(targ) {
    "use strict";
    var key,
        objOut = "";
    for (key in targ) {
        if (targ.hasOwnProperty(key)) {
            objOut += key + " -> " + targ[key] + "\n";
        }
    }
    objOut !== "" && alert(objOut);
}

searchDialog();