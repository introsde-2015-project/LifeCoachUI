
var LifeCoach = React.createClass({ 
  // Init initial variables
  getInitialState: function() {
    return {
      personId: null,
      dailyStatsSet: false,
      personsData: [],
      timeline: []
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
    // Start spinner
    var self = this;
    var lifecoachPersons = logicBaseUrl + "persons";
    $.getJSON(lifecoachPersons, function(data) {
      self.setState({
        personsData: data
      });
    }).fail(function() {
      console.error("Cannot load persons data");
    });
  },
  dailyStatsSet: function(statsSet, timeline) {
    this.setState({
      dailyStatsSet: statsSet,
      timeline: timeline
    });
  },
  // Render function
  render: function() {
    var mainView;
    var personId = this.state.personId
    var header = <Header personId={personId} resetPerson={this.setPersonId.bind(this,null)} skipStatsSet={this.dailyStatsSet.bind(this,true,[])}/>
    if (!this.state.personsData) {
      return (
        <div></div>
      )
    }
    if (personId == null) {
      mainView = <ProfileSelect personsData={this.state.personsData} callback={this.setPersonId}/>
    } else if (!this.state.dailyStatsSet){
      mainView = <DailyStats personId={this.state.personId} callback={this.dailyStatsSet}/>
    } else {
      mainView = <div><ProfileView personId={this.state.personId} timeline={this.state.timeline}/></div>
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


