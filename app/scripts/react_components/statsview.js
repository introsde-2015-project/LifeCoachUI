var StatsView = React.createClass({
    getInitialState: function () {  
      return {
        measuresData: {}
      }
    },
    componentWillMount: function() {
      this.loadMeasureData();
    },
    loadMeasureData: function() {
      var self = this;
      var measureTypesUrl = logicBaseUrl + "measuretypes";
      var measureBaseUrl = logicBaseUrl + "persons/" + this.props.personId + "/";
      $.getJSON(measureTypesUrl, function(measureTypes) {
        var measureJsonArray = {};
        var count = 0;
        
        for (var i = 0; i < measureTypes.length; i++) {
            $.ajax({
                'async': false,
                'global': false,
                'url': measureBaseUrl+measureTypes[i],
                'success': function (measureData) {
                    measureJsonArray[measureTypes[i]] = measureData;
                    count++;
                    if (count == measureTypes.length) {
                      self.setState({
                        measuresData: measureJsonArray
                      });
                    }
                }
            });
        }
      });  
    },
    componentDidUpdate: function() {
    },
    render: function () {
      var measuresData = this.state.measuresData;
      var initMeasuresData = Object.keys(measuresData).length > 0;
      if (!initMeasuresData) {
        return (
          <div></div>
        )
      }

      var measureTables = $.map(measuresData, function(measureData, measureName) {

        var measureRows = $.map(measureData, function(measureObj, index) {
          return (
            <tr key={index}>
              <td>{measureObj.value}</td>
              <td>{measureObj.created}</td>
              <td></td>
            </tr>
          )
        })

        return (
          <div key={measureName} className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-heading">{measureName}</div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Value</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {measureRows}
                  <tr>
                    <td colSpan="3"><button className="btn btn-success">Add measure</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })

      return (
        <div>
            <div className="row">
              {measureTables}
            </div>
        </div> 
      );
    }
});