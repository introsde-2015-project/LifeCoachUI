
var LifeCoach = React.createClass({ 
  // Init initial variables
  getInitialState: function() {
    return {
      personId: null,
      dailyStatsSet: false,
      personsData: [],
      measureTypes: [],
      goalTypes: []
    }
  },
  componentWillMount: function() {
    this.loadPersonsData();
  },
  // On first mount, load game data of selected game and set 5min interval
  componentDidMount: function() {
  },
  // With every state update, call external functions to handle resize and autoscroll
  componentDidUpdate: function(prevProps, prevState) {

  },
  setPersonId: function(personId) {
    this.setState({
      personId: personId,
      dailyStatsSet: false
    });
  },
  loadPersonsData: function() {
    var self = this;
    var lifecoachPersons = logicBaseUrl + "persons";
    $.getJSON(lifecoachPersons, function(data) {
      self.setState({
        personsData: data
      }, function() {
        this.loadTypes();
        }
      );
    }).fail(function() {
      console.error("Cannot load persons data");
    });
  },
  loadTypes: function() {
    var self = this;
    var measureTypesUrl = logicBaseUrl + "measuretypes";
    var goalTypesUrl = logicBaseUrl + "goaltypes";
    $.getJSON(measureTypesUrl, function(measureTypes) {
      $.getJSON(goalTypesUrl, function(goalTypes) {
        self.setState({
          measureTypes: measureTypes,
          goalTypes: goalTypes
        });
      });
    });
  },
  setDailyStats: function() {
    this.setState({
      dailyStatsSet: true
    });
  },
  // Render function
  render: function() {
    var mainView;
    var personId = this.state.personId
    var header = <Header personId={personId} resetPerson={this.setPersonId.bind(this,null)} skipStatsSet={this.setDailyStats}/>
    if (!this.state.personsData.length > 0) {
      return (
        <div></div>
      )
    }
    if (personId == null) {
      mainView = <ProfileSelect personsData={this.state.personsData} callback={this.setPersonId}/>
    } else if (!this.state.dailyStatsSet){
      mainView = <DailyStats personId={this.state.personId} setDailyStats={this.setDailyStats}/>
    } else {
      mainView = <ProfileView personId={this.state.personId} goalTypes={this.state.goalTypes} measureTypes={this.state.measureTypes}/>
    }
    return (
      <div>
        {header}
        {mainView}
      </div>
    );
  }
});




ReactDOM.render(
  <LifeCoach />,
  document.getElementById('react-container')
);


