
  var VDT = (function(_) {

    // collate_statistic(indata,collate,stat)
    // Collate collects data in array 'indata' and returns an
    // object with properties
    _.collate_statistic = function(indata,collate,stat) {
      var statresult = { 'collated': {}, 'count': 0, 'total': 0 };
      $(indata).each(function(i,d) {
        var collate_by = collate(d);
        var collate_val = Number(stat(d));
        statresult['count'] += 1;
        statresult['total'] += collate_val;
        if ( ! statresult['collated'][collate_by] ) {
          statresult['collated'][collate_by] = {
            'key': collate_by, 'count': 1, 'total': collate_val
          };
        } else {
          statresult['collated'][collate_by]['count'] += 1;
          statresult['collated'][collate_by]['total'] += collate_val;
        }
      });
      return statresult;
    };

    _.zeromat = function(nr,nc) {
      var i, j, out = [];

      for ( i = 0; i < nr; i++ ) {
        out[i] = [];
        for ( j = 0; j < nc; j++ ) {
          out[i][j] = 0;
        }
      }
      return out;
    };

    // collate_matrix(indata,r_collate,c_collate,stat)
    // collate_matrix 
    // 
    _.collate_tuples = function(indata,r_collate,c_collate,stat,opts) {
      var m = {
        'count': 0,
        'total': 0,
        'tuples': [],
        'rowspace': [],
	'colspace': [],
        'rowkeymap': {},
        'colkeymap': {}
      }, rowset = {}, colset = {}, urcset = {};
      $(indata).each(function(i,d) {
        var r_key = String(r_collate(d));
        var c_key = String(c_collate(d));
        var stat_val = Number(stat(d));

        // Gather sets of row and column keys, plus a union set
        // Collect data into a tuple list, along with a total
        // sum and count of the statistic
	var tuple = { 'r_key': r_key, 'c_key': c_key, 'val': stat_val };
        rowset[r_key] = r_key;
	colset[c_key] = c_key;
        urcset[r_key] = 1;
        urcset[c_key] = 1;
        m['tuples'].push(tuple);
        m['count'] += 1;
        m['total'] += stat_val;
      });

      // Generate maps from row/column indexes to and from keys,
      // and vice versa
      $(Object.keys(urcset)).each( function(i,d) {
        m['rowspace'].push(d);
	m['rowkeymap'][d] = i;
        m['colspace'].push(d);
        m['colkeymap'][d] = i;
      });

      return m;
    }; // END collate_tuples

    _.collate_tupgenmats = function(tupset,r_collate,c_collate,stat,opts) {
      // 
      var i, j;

      tupset['counts'] = [];
      tupset['totals'] = [];
      for ( i = 0; i < tupset['rowspace'].length; i++ ) {
        tupset['counts'][i] = [];
        tupset['totals'][i] = [];
        for ( j = 0; j < tupset['colspace'].length; j++ ) {
          tupset['counts'][i].push(0);
          tupset['totals'][i].push(0);
        }
      }

      $(tupset['tuples']).each(function(i,d) {
        var
	  r = tupset['rowkeymap'][d['r_key']],
	  c = tupset['colkeymap'][d['c_key']];
	  
        tupset['counts'][r][c] += 1;
        tupset['totals'][r][c] += d['val'];
      });
      return tupset;
    }; // END collate_tupgenmats

    _.collate_matrix = function(indata,r_collate,c_collate,stat,opts) {
      var m = _.collate_tuples(indata,r_collate,c_collate,stat,opts);
      return _.collate_tupgenmats(m,r_collate,c_collate,stat,opts);
    };

    return _;
  })({});

