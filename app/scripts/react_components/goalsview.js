var GoalsView = React.createClass({
    getInitialState: function () {  
      return {
        goalData: {}
      }
    },
    componentWillMount: function() {
      this.loadMeasureData();
    },
    loadMeasureData: function() {
      var self = this;
      var goalsUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals";
      $.getJSON(goalsUrl, function(goals) {
        self.setState({
          goalData: goals
        });
      });
    },
    render: function () {
      var goalData = this.state.goalData;
      var initGoalData = Object.keys(goalData).length > 0;
      if (!initGoalData) {
        return (
          <div></div>
        )
      }

      var goalRows = $.map(goalData, function(goalObj, index) {
        return (
          <tr key={index}>
            <td>{goalObj.goalName}</td>
            <td>{goalObj.value}</td>
            <td>{goalObj.created}</td>
            <td>{goalObj.end}</td>
          </tr>
        )
      })

      return (
        <div className="panel panel-default">
          <div className="panel-heading">Goals<span className="addGoal glyphicon glyphicon-plus" aria-hidden="true"></span></div>
          <table className="table">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Value</th>
                <th>Created</th>
                <th>Ends</th>
              </tr>
            </thead>
            <tbody>
              {goalRows}
            </tbody>
          </table>
        </div>
      );
    }
});




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