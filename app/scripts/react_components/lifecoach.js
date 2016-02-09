var ajaxErrorCount = 0;

var LifeCoach = React.createClass({ 
  // Init initial variables
  getInitialState: function() {
    return {
      personId: null,
      dailyStatsSet: false,
      personsData: [],
      measureTypes: [],
      goalTypes: [],
      about: false
    }
  },
  componentDidMount: function() {
    this.loadPersonsData();
  },
  // With every state update, call external functions to handle resize and autoscroll
  componentDidUpdate: function(prevProps, prevState) {

  },
  setPersonId: function(personId) {
    this.setState({
      personId: personId,
      dailyStatsSet: false,
      about: false
    });
  },
  loadPersonsData: function() {
    var self = this;
    var lifecoachPersonsUrl = logicBaseUrl + "persons";
    $.ajax({
      url: lifecoachPersonsUrl,
      success: function(data) {
        ajaxErrorCount = 0;
        self.setState({
          personsData: data
        }, function() {
          this.loadTypes();
        });
      },
      timeout: 10000,
      error: function(jqXHR, textStatus, errorThrown) {
        ajaxErrorCount++;
          console.log("Error: " + textStatus);
          console.log(jqXHR);
          if (ajaxErrorCount < 5) {
            self.loadPersonsData();
          }
      },
    })
  },
  loadTypes: function() {
    var self = this;
    var measureTypesUrl = logicBaseUrl + "measuretypes";
    var goalTypesUrl = logicBaseUrl + "goaltypes";
    $.ajax({
      url: measureTypesUrl,
      success: function(measureTypes) {
        $.ajax({
          url: goalTypesUrl,
          success: function(goalTypes) {
            self.setState({
              measureTypes: measureTypes,
              goalTypes: goalTypes
            });
          }
        });
      }
    });
  },
  setDailyStats: function() {
    this.setState({
      dailyStatsSet: true,
      about: false
    });
  },
  openAbout: function() {
    this.setState({
      about: true
    })
  },
  // Render function
  render: function() {
    var mainView;
    var personId = this.state.personId
    var header = <Header personId={personId} resetPerson={this.setPersonId.bind(this,null)} skipStatsSet={this.setDailyStats} openAbout={this.openAbout}/>
    if (!this.state.personsData.length > 0) {
      return (
        <div>
          {header}
          <Spinner/>
        </div>  
      )
    }
    if (this.state.about) {
      mainView = <About/>
    }
    else if (personId == null) {
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


