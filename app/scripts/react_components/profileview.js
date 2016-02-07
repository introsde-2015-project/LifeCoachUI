var ProfileView = React.createClass({
    getInitialState: function () {  
      return {
        activeTab: "timeline",
        timelineData: null,
        measuresData: null,
        goalData: null
      }
    },
    componentWillMount: function() {
      this.loadData();
    },
    componentDidMount: function() {
        $('ul.tabs').tabs();
    },
    changeTab: function(tabName) {
      this.setState({
        activeTab: tabName
      });
    },
    loadData: function() {
      this.loadTimelineData();
    },
    loadTimelineData: function() {
      var self = this;
      var timelinesUrl = logicBaseUrl + "persons/" + this.props.personId + "/timelines";
      $.getJSON(timelinesUrl, function(timelines) {
        self.setState({
          timelineData: timelines
        }, function() {
          this.loadMeasuresData();
        });
      });
    },
    loadMeasuresData: function() {
      var self = this;
      var measureTypes = this.props.measureTypes;
      var measureBaseUrl = logicBaseUrl + "persons/" + this.props.personId + "/";
      var measuresJsonArray = {};
      var count = 0;
        for (var i = 0; i < measureTypes.length; i++) {
          $.ajax({
            'async': false,
            'global': false,
            'url': measureBaseUrl+measureTypes[i],
            'success': function (measureData) {
                measuresJsonArray[measureTypes[i]] = measureData;
                count++;
                if (count == measureTypes.length) {
                  self.setState({
                    measuresData: measuresJsonArray
                  }, function() {
                    self.loadGoalData();
                  });
                }
              }
          });
        }
    },
    loadGoalData: function() {
      var self = this;
      var goalsUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals";
      $.getJSON(goalsUrl, function(goals) {
        self.setState({
          goalData: goals
        });
      });
    },
    render: function () {
      return (
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              <li className="active tab col s4"><a href="#timeline" onClick={this.changeTab.bind(this, "timeline")}>TIMELINE</a></li>
              <li className="tab col s4"><a href="#stats" onClick={this.changeTab.bind(this, "stats")}>STATISTICS</a></li>
              <li className="tab col s4"><a href="#goals" onClick={this.changeTab.bind(this, "goals")}>GOALS</a></li>
            </ul>
          </div>
          <div className="tab-container">
            <div id="timeline" className="col s12">
              {this.state.timelineData ? 
                <TimelineView personId={this.props.personId} timelineData={this.state.timelineData}/> 
              : 
                <Spinner/>}
            </div>
            <div id="stats" className="col s12">
              {this.state.measuresData ?
                <StatsView personId={this.props.personId} measuresData={this.state.measuresData} measureTypes={this.props.measureTypes} cbLoadData={this.loadData}/>
              :
                <Spinner/>
              }
            </div>
            <div id="goals" className="col s12">
              {this.state.goalData ?
                <GoalsView personId={this.props.personId} goalData={this.state.goalData} goalTypes={this.props.goalTypes} cbLoadData={this.loadData}/>
              :
                <Spinner/>
              }
            </div>
          </div>
        </div>
      );
    }
});