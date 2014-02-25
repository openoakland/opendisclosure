function Dataset() {
    this.host = "http://www.socrata.com";
}


// Given a string, look for a properly formatted UID. 
//  returns: false on failure
Dataset.prototype.extractUID = function(url) {
    matches = url.match(/.*([a-z0-9]{4}-[a-z0-9]{4}).*/);
    if ( matches == null || matches.length < 2 ) {
        return false;
    }
    this.uid = matches[1];
    return true;
};

// TODO: Better protocol handling
Dataset.prototype.extractHost = function(url) {
    matches = url.match(/^(?:[^\/]+:\/\/)?([^\/]+)/im);
    if ( matches == null || matches.length < 2 ) {
        return;
    }
    this.host = "http://" + matches[1];
};

Dataset.prototype.columnsCallback = function(data) {
    this.columns = data;
};

Dataset.prototype.rowsCallback = function(data) {
    this.rows = data.data;
}

// Ready a string for use in JSONP callback
Dataset.prototype.jsonWrap = function(url) {
    return this.host + url + 
        (url.indexOf('?') == -1 ? '?' : '&') + 'jsonp=?';
};

// Where to get general information about this dataset
Dataset.prototype.viewDataURL = function() {
    return this.jsonWrap("/views/" + this.uid);
};

// Where to get the rows JSON from
Dataset.prototype.rowsURL = function() {
    return this.jsonWrap("/views/" + this.uid + "/rows.json");
};

// And the columns
Dataset.prototype.columnsURL = function() {
    return this.jsonWrap("/views/" + this.uid + "/columns.json");
};

// A short link to this dataset
Dataset.prototype.shortURL = function() {
    return this.host + "/d/" + this.uid;
};
