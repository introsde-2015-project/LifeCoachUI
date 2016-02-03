var DailyStats = React.createClass({
    getInitialState: function () {  
      return {
        sleep: false,
        calories: false,
        steps: false,
        timeline: []
      }
    },
    componentDidUpdate: function() {
      if (this.state.sleep != false && this.state.calories != false && this.state.steps != false) {
        this.props.callback(true, this.state.timeline);
      }
    },
    createNewMeasure: function(value) {
      var measure = {
        "value" : + value
      }
      return JSON.stringify(measure);
    },
    onStatsChange: function(stat, value) {
      if (value != null && value != 0) {
        var measure = this.createNewMeasure(value);
        var self = this;
        var timeline = this.state.timeline;
        $.ajax({
          url:processBaseUrl+"persons/"+this.props.personId+"/"+stat,
          type:"POST",
          data:measure,
          contentType:"application/json; charset=utf-8",
          dataType:"json",
          success: function(data){
            timeline.push(data);
            self.setState({
              [stat]: value,
              timeline: timeline
            });
          }
        })
      } else {
        this.setState({
          [stat]: true
        });
      }
    },
    render: function () {
      var statsForm;
      if (this.state.sleep == false) {
        statsForm = <StatsForm question="How many hours did you sleep last night?" callback={this.onStatsChange.bind(this, "sleep")}/>
      } else if (this.state.steps == false) {
        statsForm = <StatsForm question="How many steps did you take yesterday?" callback={this.onStatsChange.bind(this, "steps")}/>
      } else if (this.state.calories == false) {
        statsForm = <StatsForm question="How many calories did you eat yesterday?" callback={this.onStatsChange.bind(this, "calories")}/>
      } else {
        statsForm = <div></div>
      }
        return (
            <div className="dailyStats">
              <h3>Tell me about your day!</h3>
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
    setValue: function() {
      this.props.callback(this.state.statValue);
    },
    render: function () {
        return (
            <div>
              <h4>{this.props.question}</h4>
              <input type="number" value={this.state.statValue} onChange={this.onValueChange}/>
              <button onClick={this.setValue}>OK</button>
              <div onClick={this.setValue}>Skip</div>
            </div>
        );
    } 
});