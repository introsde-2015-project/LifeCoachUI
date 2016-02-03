"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DailyStats = React.createClass({
  displayName: "DailyStats",

  getInitialState: function getInitialState() {
    return {
      sleep: false,
      calories: false,
      steps: false,
      timeline: []
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.sleep != false && this.state.calories != false && this.state.steps != false) {
      this.props.callback(true, this.state.timeline);
    }
  },
  createNewMeasure: function createNewMeasure(value) {
    var measure = {
      "value": +value
    };
    return JSON.stringify(measure);
  },
  onStatsChange: function onStatsChange(stat, value) {
    if (value != null && value != 0) {
      var measure = this.createNewMeasure(value);
      var self = this;
      var timeline = this.state.timeline;
      $.ajax({
        url: processBaseUrl + "persons/" + this.props.personId + "/" + stat,
        type: "POST",
        data: measure,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function success(data) {
          var _self$setState;

          timeline.push(data);
          self.setState((_self$setState = {}, _defineProperty(_self$setState, stat, value), _defineProperty(_self$setState, "timeline", timeline), _self$setState));
        }
      });
    } else {
      this.setState(_defineProperty({}, stat, true));
    }
  },
  render: function render() {
    var statsForm;
    if (this.state.sleep == false) {
      statsForm = React.createElement(StatsForm, { question: "How many hours did you sleep last night?", callback: this.onStatsChange.bind(this, "sleep") });
    } else if (this.state.steps == false) {
      statsForm = React.createElement(StatsForm, { question: "How many steps did you take yesterday?", callback: this.onStatsChange.bind(this, "steps") });
    } else if (this.state.calories == false) {
      statsForm = React.createElement(StatsForm, { question: "How many calories did you eat yesterday?", callback: this.onStatsChange.bind(this, "calories") });
    } else {
      statsForm = React.createElement("div", null);
    }
    return React.createElement(
      "div",
      { className: "dailyStats" },
      React.createElement(
        "h3",
        null,
        "Tell me about your day!"
      ),
      statsForm
    );
  }
});

var StatsForm = React.createClass({
  displayName: "StatsForm",

  getInitialState: function getInitialState() {
    return {
      statValue: null
    };
  },
  componentDidMount: function componentDidMount() {
    this.setState({
      statValue: null
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      statValue: null
    });
  },
  onValueChange: function onValueChange(event) {
    this.setState({
      statValue: event.target.value
    });
  },
  setValue: function setValue() {
    this.props.callback(this.state.statValue);
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h4",
        null,
        this.props.question
      ),
      React.createElement("input", { type: "number", value: this.state.statValue, onChange: this.onValueChange }),
      React.createElement(
        "button",
        { onClick: this.setValue },
        "OK"
      ),
      React.createElement(
        "div",
        { onClick: this.setValue },
        "Skip"
      )
    );
  }
});
"use strict";

var GoalsView = React.createClass({
  displayName: "GoalsView",

  getInitialState: function getInitialState() {
    return {
      goalData: {}
    };
  },
  componentWillMount: function componentWillMount() {
    this.loadMeasureData();
  },
  loadMeasureData: function loadMeasureData() {
    var self = this;
    var goalsUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals";
    $.getJSON(goalsUrl, function (goals) {
      self.setState({
        goalData: goals
      });
    });
  },
  render: function render() {
    var goalData = this.state.goalData;
    var initGoalData = Object.keys(goalData).length > 0;
    if (!initGoalData) {
      return React.createElement("div", null);
    }

    var goalRows = $.map(goalData, function (goalObj, index) {
      return React.createElement(
        "tr",
        { key: index },
        React.createElement(
          "td",
          null,
          goalObj.goalName
        ),
        React.createElement(
          "td",
          null,
          goalObj.value
        ),
        React.createElement(
          "td",
          null,
          goalObj.created
        ),
        React.createElement(
          "td",
          null,
          goalObj.end
        )
      );
    });

    return React.createElement(
      "div",
      { className: "panel panel-default" },
      React.createElement(
        "div",
        { className: "panel-heading" },
        "Goals",
        React.createElement("span", { className: "addGoal glyphicon glyphicon-plus", "aria-hidden": "true" })
      ),
      React.createElement(
        "table",
        { className: "table" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "Goal"
            ),
            React.createElement(
              "th",
              null,
              "Value"
            ),
            React.createElement(
              "th",
              null,
              "Created"
            ),
            React.createElement(
              "th",
              null,
              "Ends"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          goalRows
        )
      )
    );
  }
});

var StatsView = React.createClass({
  displayName: "StatsView",

  getInitialState: function getInitialState() {
    return {
      measuresData: {}
    };
  },
  componentWillMount: function componentWillMount() {
    this.loadMeasureData();
  },
  loadMeasureData: function loadMeasureData() {
    var self = this;
    var measureTypesUrl = logicBaseUrl + "measuretypes";
    var measureBaseUrl = logicBaseUrl + "persons/" + this.props.personId + "/";
    $.getJSON(measureTypesUrl, function (measureTypes) {
      var measureJsonArray = {};
      var count = 0;

      for (var i = 0; i < measureTypes.length; i++) {
        $.ajax({
          'async': false,
          'global': false,
          'url': measureBaseUrl + measureTypes[i],
          'success': function success(measureData) {
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
  componentDidUpdate: function componentDidUpdate() {},
  render: function render() {
    var measuresData = this.state.measuresData;
    var initMeasuresData = Object.keys(measuresData).length > 0;
    if (!initMeasuresData) {
      return React.createElement("div", null);
    }

    var measureTables = $.map(measuresData, function (measureData, measureName) {

      var measureRows = $.map(measureData, function (measureObj, index) {
        return React.createElement(
          "tr",
          { key: index },
          React.createElement(
            "td",
            null,
            measureObj.value
          ),
          React.createElement(
            "td",
            null,
            measureObj.created
          ),
          React.createElement("td", null)
        );
      });

      return React.createElement(
        "div",
        { key: measureName, className: "col-lg-4 col-md-4 col-sm-4 col-xs-12" },
        React.createElement(
          "div",
          { className: "panel panel-default" },
          React.createElement(
            "div",
            { className: "panel-heading" },
            measureName
          ),
          React.createElement(
            "table",
            { className: "table" },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  null,
                  "Value"
                ),
                React.createElement(
                  "th",
                  null,
                  "Date"
                ),
                React.createElement("th", null)
              )
            ),
            React.createElement(
              "tbody",
              null,
              measureRows,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { colSpan: "3" },
                  React.createElement(
                    "button",
                    { className: "btn btn-success" },
                    "Add measure"
                  )
                )
              )
            )
          )
        )
      );
    });

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "row" },
        measureTables
      )
    );
  }
});
"use strict";

var Header = React.createClass({
  displayName: "Header",

  skipStatsSet: function skipStatsSet() {
    this.props.skipStatsSet();
  },
  resetPerson: function resetPerson() {
    this.props.resetPerson();
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "header" },
      React.createElement(
        "ul",
        { className: "nav nav-pills pull-right" },
        this.props.personId != null ? React.createElement(
          "li",
          null,
          React.createElement("span", { className: "glyphicon glyphicon-user", onClick: this.skipStatsSet })
        ) : null,
        this.props.personId != null ? React.createElement(
          "li",
          null,
          React.createElement("span", { className: "glyphicon glyphicon-log-out", onClick: this.resetPerson })
        ) : null,
        React.createElement(
          "li",
          null,
          React.createElement("span", { className: "glyphicon glyphicon-question-sign" })
        )
      ),
      React.createElement(
        "h3",
        null,
        "LifeCoach"
      )
    );
  }
});
"use strict";

var ProfileSelect = React.createClass({
  displayName: "ProfileSelect",

  getInitialState: function getInitialState() {
    return null;
  },
  // Create test image to test state.src. If that img return error, set state.src empty
  selectPerson: function selectPerson(personId) {
    this.props.callback(personId);
  },
  render: function render() {
    var self = this;
    var personProfiles = this.props.personsData.map(function (person, personIndex) {
      return React.createElement(
        "button",
        { key: personIndex, type: "button", className: "list-group-item", onClick: this.selectPerson.bind(this, person.idPerson) },
        React.createElement(
          "div",
          { className: "media" },
          React.createElement(
            "div",
            { className: "media-left" },
            React.createElement(
              "a",
              { href: "#" },
              React.createElement("img", { className: "media-object", src: "", alt: "..." })
            )
          ),
          React.createElement(
            "div",
            { className: "media-body" },
            React.createElement(
              "h4",
              { className: "media-heading" },
              person.firstname + " " + person.lastname,
              " "
            ),
            "Birthdate: ",
            person.birthdate
          )
        )
      );
    }, this);

    return React.createElement(
      "div",
      { className: "profileSelect" },
      React.createElement(
        "h3",
        null,
        "Choose your profile"
      ),
      React.createElement(
        "div",
        { className: "list-group" },
        personProfiles
      )
    );
  }
});
"use strict";

var ProfileView = React.createClass({
  displayName: "ProfileView",

  getInitialState: function getInitialState() {
    return {
      activeTab: "timeline"
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.statsSet) {
      this.props.callback(true);
    }
  },
  changeTab: function changeTab(tabName) {
    this.setState({
      activeTab: tabName
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "ul",
        { className: "nav nav-pills nav-justified", role: "tablist" },
        React.createElement(
          "li",
          { role: "presentation", className: "active", onClick: this.changeTab.bind(this, "timeline") },
          React.createElement(
            "a",
            { href: "#timeline", role: "tab", "data-toggle": "tab" },
            "TIMELINE"
          )
        ),
        React.createElement(
          "li",
          { role: "presentation", onClick: this.changeTab.bind(this, "stats") },
          React.createElement(
            "a",
            { href: "#stats", role: "tab", "data-toggle": "tab" },
            "STATISTICS"
          )
        ),
        React.createElement(
          "li",
          { role: "presentation", onClick: this.changeTab.bind(this, "goals") },
          React.createElement(
            "a",
            { href: "#goals", role: "tab", "data-toggle": "tab" },
            "GOALS"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "tab-content" },
        React.createElement(
          "div",
          { role: "tabpanel", className: "tab-pane active", id: "timeline" },
          React.createElement(TimelineView, { personId: this.props.personId, timeline: this.props.timeline })
        ),
        React.createElement(
          "div",
          { role: "tabpanel", className: "tab-pane", id: "stats" },
          React.createElement(StatsView, { personId: this.props.personId })
        ),
        React.createElement(
          "div",
          { role: "tabpanel", className: "tab-pane", id: "goals" },
          React.createElement(GoalsView, { personId: this.props.personId })
        )
      )
    );
  }
});
"use strict";

var StatsView = React.createClass({
  displayName: "StatsView",

  getInitialState: function getInitialState() {
    return {
      measuresData: {}
    };
  },
  componentWillMount: function componentWillMount() {
    this.loadMeasureData();
  },
  loadMeasureData: function loadMeasureData() {
    var self = this;
    var measureTypesUrl = logicBaseUrl + "measuretypes";
    var measureBaseUrl = logicBaseUrl + "persons/" + this.props.personId + "/";
    $.getJSON(measureTypesUrl, function (measureTypes) {
      var measureJsonArray = {};
      var count = 0;

      for (var i = 0; i < measureTypes.length; i++) {
        $.ajax({
          'async': false,
          'global': false,
          'url': measureBaseUrl + measureTypes[i],
          'success': function success(measureData) {
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
  componentDidUpdate: function componentDidUpdate() {},
  render: function render() {
    var measuresData = this.state.measuresData;
    var initMeasuresData = Object.keys(measuresData).length > 0;
    if (!initMeasuresData) {
      return React.createElement("div", null);
    }

    var measureTables = $.map(measuresData, function (measureData, measureName) {

      var measureRows = $.map(measureData, function (measureObj, index) {
        return React.createElement(
          "tr",
          { key: index },
          React.createElement(
            "td",
            null,
            measureObj.value
          ),
          React.createElement(
            "td",
            null,
            measureObj.created
          ),
          React.createElement("td", null)
        );
      });

      return React.createElement(
        "div",
        { key: measureName, className: "col-lg-4 col-md-4 col-sm-4 col-xs-12" },
        React.createElement(
          "div",
          { className: "panel panel-default" },
          React.createElement(
            "div",
            { className: "panel-heading" },
            measureName
          ),
          React.createElement(
            "table",
            { className: "table" },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  null,
                  "Value"
                ),
                React.createElement(
                  "th",
                  null,
                  "Date"
                ),
                React.createElement("th", null)
              )
            ),
            React.createElement(
              "tbody",
              null,
              measureRows,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { colSpan: "3" },
                  React.createElement(
                    "button",
                    { className: "btn btn-success" },
                    "Add measure"
                  )
                )
              )
            )
          )
        )
      );
    });

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "row" },
        measureTables
      )
    );
  }
});
"use strict";

var TimelineView = React.createClass({
  displayName: "TimelineView",

  getInitialState: function getInitialState() {
    return null;
  },
  componentDidUpdate: function componentDidUpdate() {},
  changeTab: function changeTab(tabName) {},
  render: function render() {
    console.log(this.props.timeline);
    var timeline = this.props.timeline.map(function (item, index) {
      var timelineItem;
      if (item.mediaType == "joke") {
        timelineItem = React.createElement(Joke, { joke: item });
      } else if (item.mediaType == "sleepMusic" || item.mediaType == "runningMusic") {
        timelineItem = React.createElement(Music, { music: item });
      } else if (item.mediaType == "recipe") {
        timelineItem = React.createElement(Recipe, { recipe: item });
      }

      return React.createElement(
        "div",
        { key: index },
        React.createElement(
          "div",
          null,
          "FOR ",
          item.goalReached ? "REACHING" : "NOT REACHING",
          " YOUR GOAL ",
          item.measureType
        ),
        timelineItem
      );
    });

    var header;
    if (timeline.length > 0) {
      header = React.createElement(
        "h3",
        null,
        "Your recommendations:"
      );
    } else {
      header = React.createElement(
        "h3",
        null,
        "No recommendations yet. Go add your daily results!"
      );
    }

    return React.createElement(
      "div",
      null,
      header,
      timeline
    );
  }
});

var Joke = React.createClass({
  displayName: "Joke",

  getInitialState: function getInitialState() {
    return null;
  },
  componentDidUpdate: function componentDidUpdate() {},
  changeTab: function changeTab(tabName) {},
  render: function render() {
    var joke = this.props.joke;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "Keep up the good work! Did you know that..."
      ),
      React.createElement(
        "p",
        null,
        joke.joke
      )
    );
  }
});

var Music = React.createClass({
  displayName: "Music",

  getInitialState: function getInitialState() {
    return null;
  },
  componentDidUpdate: function componentDidUpdate() {},
  changeTab: function changeTab(tabName) {},
  render: function render() {
    var music = this.props.music;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        music.mediaType == "sleepMusic" ? "Music recommendation to make you sleep better:" : "Music recommendation to cheer you in your next sports activity:"
      ),
      React.createElement(
        "p",
        null,
        music.artists[0].name,
        " - ",
        music.name
      ),
      React.createElement(
        "p",
        null,
        React.createElement(
          "a",
          { href: music.href },
          "Spotify url"
        )
      )
    );
  }
});

var Recipe = React.createClass({
  displayName: "Recipe",

  getInitialState: function getInitialState() {
    return null;
  },
  componentDidUpdate: function componentDidUpdate() {},
  changeTab: function changeTab(tabName) {},
  render: function render() {
    var recipe = this.props.recipe;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "New delicious and healthy recipe recommendation for your next meal:"
      ),
      React.createElement(
        "p",
        null,
        recipe.label
      ),
      React.createElement(
        "p",
        null,
        "Calories per serving: ",
        recipe.calories / recipe.yield
      ),
      React.createElement(
        "p",
        null,
        React.createElement("img", { src: recipe.image })
      ),
      React.createElement(
        "p",
        null,
        React.createElement(
          "a",
          { href: recipe.url },
          "Recipe url"
        )
      )
    );
  }
});
"use strict";

var LifeCoach = React.createClass({
  displayName: "LifeCoach",

  // Init initial variables
  getInitialState: function getInitialState() {
    return {
      personId: null,
      dailyStatsSet: false,
      personsData: [],
      timeline: []
    };
  },
  componentWillMount: function componentWillMount() {
    this.loadPersonsData();
  },
  // On first mount, load game data of selected game and set 5min interval
  componentDidMount: function componentDidMount() {},
  // With every state update, call external functions to handle resize and autoscroll
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {},
  setPersonId: function setPersonId(personId) {
    this.setState({
      personId: personId,
      dailyStatsSet: false
    });
  },
  loadPersonsData: function loadPersonsData() {
    // Start spinner
    var self = this;
    var lifecoachPersons = logicBaseUrl + "persons";
    $.getJSON(lifecoachPersons, function (data) {
      self.setState({
        personsData: data
      });
    }).fail(function () {
      console.error("Cannot load persons data");
    });
  },
  dailyStatsSet: function dailyStatsSet(statsSet, timeline) {
    this.setState({
      dailyStatsSet: statsSet,
      timeline: timeline
    });
  },
  // Render function
  render: function render() {
    var mainView;
    var personId = this.state.personId;
    var header = React.createElement(Header, { personId: personId, resetPerson: this.setPersonId.bind(this, null), skipStatsSet: this.dailyStatsSet.bind(this, true, []) });
    if (!this.state.personsData) {
      return React.createElement("div", null);
    }
    if (personId == null) {
      mainView = React.createElement(ProfileSelect, { personsData: this.state.personsData, callback: this.setPersonId });
    } else if (!this.state.dailyStatsSet) {
      mainView = React.createElement(DailyStats, { personId: this.state.personId, callback: this.dailyStatsSet });
    } else {
      mainView = React.createElement(
        "div",
        null,
        React.createElement(ProfileView, { personId: this.state.personId, timeline: this.state.timeline })
      );
    }
    return React.createElement(
      "div",
      null,
      header,
      mainView
    );
  }
});

ReactDOM.render(React.createElement(LifeCoach, null), document.getElementById('react-container'));
//# sourceMappingURL=react-compiled.js.map
