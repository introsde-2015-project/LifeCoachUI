var DailyStats = React.createClass({
    getInitialState: function () {  
      return {
        sleep: false,
        calories: false,
        steps: false,
        dailyStats: []
      }
    },
    componentDidUpdate: function() {
      if (this.state.sleep != false && this.state.calories != false && this.state.steps != false) {
        setTimeout(function() {
          this.postDailyStats();
        }.bind(this), 10);
      }
    },
    onStatsChange: function(stat, value) {
      var measure = {"measure": stat, "value": value};
      var dailyStats = this.state.dailyStats;
      dailyStats.push(measure);
      this.setState({
        [stat]: true,
        dailyStats: dailyStats
      });
    },
    createNewMeasure: function(value) {
      var measure = {
        "value" : + value
      }
      return JSON.stringify(measure);
    },
    postDailyStats: function() {
      var dailyStats = this.state.dailyStats;
      for (var i=0; i<dailyStats.length; i++) {
        var measureType = dailyStats[i].measure;
        var value = dailyStats[i].value;
        if (value != null && value != 0) {
          var measureObj = this.createNewMeasure(value);
          var self = this;
          $.ajax({
            async: false,
            global: false,
            url:processBaseUrl+"persons/"+this.props.personId+"/"+measureType,
            type:"POST",
            data:measureObj,
            contentType:"application/json; charset=utf-8",
            dataType:"json"
          });
        } 
      }
      this.props.setDailyStats();
    },
    render: function () {
      var statsForm;
      var questionNbr;
      if (this.state.sleep == false) {
        questionNbr = 1;
        statsForm = <StatsForm question="How many hours did you sleep last night?" callback={this.onStatsChange.bind(this, "sleep")}/>
      } else if (this.state.steps == false) {
        questionNbr = 2;
        statsForm = <StatsForm question="How many steps did you take yesterday?" callback={this.onStatsChange.bind(this, "steps")}/>
      } else if (this.state.calories == false) {
        questionNbr = 3;
        statsForm = <StatsForm question="How many calories did you eat yesterday?" callback={this.onStatsChange.bind(this, "calories")}/>
      } else {
        return <Spinner/>
      }
        return (
            <div className="dailyStats">
              <h3 className="statsHeading">Tell me about your day!</h3>
              <ul className="pagination">
                <div className="breadcrumb"><li className={questionNbr == 1 ? "active" : null}><a>Sleep</a></li></div>
                <div className="breadcrumb"><li className={questionNbr == 2 ? "active" : null}><a>Steps</a></li></div>
                <div className="breadcrumb"><li className={questionNbr == 3 ? "active" : null}><a>Calories</a></li></div>
              </ul>
              {statsForm}
            </div>
        );
    } 
});

var StatsForm = React.createClass({
    getInitialState: function () {  
      return {
        statValue: null
      }
    },
    componentDidMount: function() {
      this.setState({
        statValue: null
      });
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({
        statValue: null
      });
    },
    onValueChange: function(event) {
      this.setState({
        statValue: event.target.value
      });
    },
    handleKeyDown: function(event) {
      if (event.key === 'Enter') {
        this.setValue();
      } else if ($.inArray(event.which, [46, 8, 9, 27, 13, 110, 190]) !== -1) {
        return;
      } else if (event.which < 48 || event.which > 57) {
        event.preventDefault();
      }
    },
    setValue: function() {
      this.props.callback(this.state.statValue);
    },
    render: function () {
        return (
            <div className="statsForm">
              <h4>{this.props.question}</h4>
              <div className="input-field col s6">
                <input autoFocus type="number" value={this.state.statValue} onChange={this.onValueChange} onKeyDown={this.handleKeyDown}/>
              </div>
              <a className="waves-effect waves-light btn" onClick={this.setValue}>OK</a>
              <a className="skip-btn btn-flat" onClick={this.setValue}>Skip</a>
            </div>
        );
    } 
});