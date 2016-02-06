"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DailyStats = React.createClass({
  displayName: "DailyStats",

  getInitialState: function getInitialState() {
    return {
      sleep: false,
      calories: false,
      steps: false
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.sleep != false && this.state.calories != false && this.state.steps != false) {
      this.props.callback(true);
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
          self.setState(_defineProperty({}, stat, value));
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
        { className: "statsHeading" },
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
  handleKeyDown: function handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.setValue();
    }
  },
  setValue: function setValue() {
    this.props.callback(this.state.statValue);
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "statsForm" },
      React.createElement(
        "h4",
        null,
        this.props.question
      ),
      React.createElement(
        "div",
        { className: "input-field col s6" },
        React.createElement("input", { type: "number", value: this.state.statValue, onChange: this.onValueChange, onKeyDown: this.handleKeyDown })
      ),
      React.createElement(
        "a",
        { className: "waves-effect waves-light btn", onClick: this.setValue },
        "OK"
      ),
      React.createElement(
        "a",
        { className: "skip-btn btn-flat", onClick: this.setValue },
        "Skip"
      )
    );
  }
});
"use strict";

var GoalModal = React.createClass({
	displayName: "GoalModal",

	getInitialState: function getInitialState() {
		return {
			goalTypes: [],
			goalType: "",
			goalValue: ""
		};
	},
	componentDidMount: function componentDidMount() {
		this.loadGoalTypes();
	},
	loadGoalTypes: function loadGoalTypes() {
		var self = this;
		var goalTypesUrl = logicBaseUrl + "goaltypes";
		$.getJSON(goalTypesUrl, function (goalTypes) {
			console.log(goalTypes);
			self.setState({
				goalTypes: goalTypes
			});
		});
	},
	onGoalTypeChange: function onGoalTypeChange(event) {
		this.setState({
			goalType: event.target.value
		});
	},
	onValueChange: function onValueChange(event) {
		this.setState({
			goalValue: event.target.value
		});
	},
	createNewGoal: function createNewGoal(value, goalType) {
		var goal = {
			"value": +value,
			"goalName": goalType
		};
		return JSON.stringify(goal);
	},
	handleSubmit: function handleSubmit(event) {
		var self = this;
		event.preventDefault();
		var goal = this.createNewGoal(this.state.goalValue, this.state.goalType);
		$.ajax({
			url: processBaseUrl + "persons/" + this.props.personId + "/goals",
			type: "POST",
			data: goal,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function success(data) {
				$('#goalModal').closeModal();
				self.props.cbDataInit(false);
			},
			fail: function fail() {
				$('#goalModal').closeModal();
			}
		});
	},
	closeModal: function closeModal() {
		$('#goalModal').closeModal();
	},
	render: function render() {
		var goalTypes = this.state.goalTypes;

		var goalOptions = $.map(goalTypes, function (goalType, index) {
			return React.createElement(
				"option",
				{ key: index, className: "goalOption", value: goalType },
				goalType
			);
		});

		return React.createElement(
			"div",
			{ id: "goalModal", className: "modal" },
			React.createElement(
				"div",
				{ className: "modal-content" },
				React.createElement(
					"a",
					{ className: "modal-close-btn", onClick: this.closeModal },
					React.createElement(
						"i",
						{ className: "material-icons" },
						"clear"
					)
				),
				React.createElement(
					"div",
					{ className: "col s12" },
					React.createElement(
						"h4",
						null,
						"Add new goal"
					)
				),
				React.createElement(
					"form",
					{ onSubmit: this.handleSubmit },
					React.createElement(
						"div",
						{ className: "col s12 m6 l6" },
						React.createElement(
							"label",
							null,
							"Goal type"
						),
						React.createElement(
							"select",
							{ value: this.state.goalType, onChange: this.onGoalTypeChange, className: "browser-default", required: true, "aria-required": "true" },
							React.createElement(
								"option",
								{ value: "", disabled: true },
								"Choose goal"
							),
							goalOptions
						)
					),
					React.createElement(
						"div",
						{ className: "input-field col s12 m6 l6" },
						React.createElement("input", { id: "goalValue", placeholder: "Value in numbers", type: "number", className: "validate", value: this.state.goalValue, onChange: this.onValueChange, required: true, "aria-required": "true" }),
						React.createElement(
							"label",
							{ className: "active", htmlFor: "goalValue" },
							"Goal value"
						)
					),
					React.createElement(
						"div",
						{ className: "col s12 modalBtnContainer" },
						React.createElement(
							"button",
							{ className: "btn waves-effect waves-light", type: "submit" },
							"OK",
							React.createElement(
								"i",
								{ className: "material-icons right" },
								"send"
							)
						)
					)
				)
			)
		);
	}
});
"use strict";

var GoalsView = React.createClass({
  displayName: "GoalsView",

  getInitialState: function getInitialState() {
    return {
      dataInit: false,
      goalData: {}
    };
  },
  componentDidMount: function componentDidMount() {
    //this.loadGoalData();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!this.state.dataInit) {
      this.loadGoalData();
    }
  },
  setDataInit: function setDataInit(dataInit) {
    this.setState({
      dataInit: dataInit
    });
  },
  loadGoalData: function loadGoalData() {
    var self = this;
    var goalsUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals";
    $.getJSON(goalsUrl, function (goals) {
      self.setState({
        goalData: goals,
        dataInit: true
      }, function () {
        $('.modal-trigger').leanModal();
      });
    });
  },
  deleteGoal: function deleteGoal(goalId) {
    var self = this;
    var goalUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals/" + goalId;
    $.ajax({
      url: goalUrl,
      type: 'DELETE',
      success: function success(result) {
        self.setState({
          dataInit: false
        });
      }
    });
  },
  openModal: function openModal() {
    $('#goalModal').openModal();
  },
  render: function render() {
    var self = this;
    var goalData = this.state.goalData;
    var initGoalData = Object.keys(goalData).length > 0;
    if (!initGoalData) {
      return React.createElement("div", null);
    }

    var goalRows = goalData.map(function (goalObj, index) {
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
          React.createElement(
            "a",
            { href: "#", onClick: this.deleteGoal.bind(this, goalObj.gid) },
            React.createElement(
              "i",
              { className: "material-icons" },
              "clear"
            )
          )
        )
      );
    }, this);

    return React.createElement(
      "div",
      null,
      React.createElement(
        "nav",
        { className: "sub-nav" },
        React.createElement(
          "div",
          { className: "nav-wrapper" },
          React.createElement(
            "div",
            { className: "brand-logo left" },
            "Your goals"
          ),
          React.createElement(
            "ul",
            { className: "right" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: this.openModal, className: "btn-floating waves-effect waves-light" },
                React.createElement(
                  "i",
                  { className: "material-icons" },
                  "add"
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "table",
        { className: "bordered" },
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
            React.createElement("th", null)
          )
        ),
        React.createElement(
          "tbody",
          null,
          goalRows
        )
      ),
      React.createElement(GoalModal, { personId: this.props.personId, cbDataInit: this.setDataInit, goalData: goalData })
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
      "nav",
      null,
      React.createElement(
        "div",
        { className: "nav-wrapper" },
        React.createElement(
          "div",
          { className: "brand-logo left", onClick: this.resetPerson },
          React.createElement(
            "a",
            { href: "#" },
            "LifeCoach"
          )
        ),
        React.createElement(
          "ul",
          { className: "right" },
          this.props.personId != null ? React.createElement(
            "li",
            { onClick: this.skipStatsSet },
            React.createElement(
              "a",
              null,
              React.createElement(
                "i",
                { className: "material-icons" },
                "account_circle"
              )
            )
          ) : null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              null,
              React.createElement(
                "i",
                { className: "material-icons" },
                "help"
              )
            )
          )
        )
      )
    );
  }
});
"use strict";

var MeasureModal = React.createClass({
	displayName: "MeasureModal",

	getInitialState: function getInitialState() {
		return {
			measureType: "",
			measureValue: ""
		};
	},
	onMeasureTypeChange: function onMeasureTypeChange(event) {
		this.setState({
			measureType: event.target.value
		});
	},
	onValueChange: function onValueChange(event) {
		this.setState({
			measureValue: event.target.value
		});
	},
	createNewMeasure: function createNewMeasure(value) {
		var measure = {
			"value": +value
		};
		return JSON.stringify(measure);
	},
	handleSubmit: function handleSubmit(event) {
		var self = this;
		event.preventDefault();
		var measure = this.createNewMeasure(this.state.measureValue);
		$.ajax({
			url: processBaseUrl + "persons/" + this.props.personId + "/" + this.state.measureType,
			type: "POST",
			data: measure,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function success(data) {
				$('#measureModal').closeModal();
				self.props.cbDataInit(false);
			},
			fail: function fail() {
				$('#measureModal').closeModal();
			}
		});
	},
	closeModal: function closeModal() {
		$('#measureModal').closeModal();
	},
	render: function render() {
		var measureTypes = this.props.measureTypes;

		var measureOptions = $.map(measureTypes, function (measureType, index) {
			return React.createElement(
				"option",
				{ key: index, className: "measureOption", value: measureType },
				measureType
			);
		});

		return React.createElement(
			"div",
			{ id: "measureModal", className: "modal" },
			React.createElement(
				"div",
				{ className: "modal-content" },
				React.createElement(
					"a",
					{ className: "modal-close-btn", onClick: this.closeModal },
					React.createElement(
						"i",
						{ className: "material-icons" },
						"clear"
					)
				),
				React.createElement(
					"div",
					{ className: "col s12" },
					React.createElement(
						"h4",
						null,
						"Add new measure"
					)
				),
				React.createElement(
					"form",
					{ onSubmit: this.handleSubmit },
					React.createElement(
						"div",
						{ className: "col s12 m6 l6" },
						React.createElement(
							"label",
							null,
							"Measure type"
						),
						React.createElement(
							"select",
							{ value: this.state.measureType, onChange: this.onMeasureTypeChange, className: "browser-default", required: true, "aria-required": "true" },
							React.createElement(
								"option",
								{ value: "", disabled: true },
								"Choose measure"
							),
							measureOptions
						)
					),
					React.createElement(
						"div",
						{ className: "input-field col s12 m6 l6" },
						React.createElement("input", { id: "measureValue", placeholder: "Value in numbers", type: "number", className: "validate", value: this.state.measureValue, onChange: this.onValueChange, required: true, "aria-required": "true" }),
						React.createElement(
							"label",
							{ className: "active", htmlFor: "measureValue" },
							"Measure value"
						)
					),
					React.createElement(
						"div",
						{ className: "col s12 modalBtnContainer" },
						React.createElement(
							"button",
							{ className: "btn waves-effect waves-light", type: "submit" },
							"OK",
							React.createElement(
								"i",
								{ className: "material-icons right" },
								"send"
							)
						)
					)
				)
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
        "li",
        { key: personIndex, className: "collection-item avatar", onClick: this.selectPerson.bind(this, person.idPerson) },
        React.createElement("img", { src: "", alt: "", className: "circle" }),
        React.createElement(
          "span",
          { className: "title" },
          person.firstname + " " + person.lastname
        ),
        React.createElement(
          "p",
          null,
          "Birthdate: ",
          person.birthdate
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
        { className: "card-panel" },
        React.createElement(
          "ul",
          { className: "collection" },
          personProfiles
        )
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
  componentDidMount: function componentDidMount() {
    $('ul.tabs').tabs();
  },
  changeTab: function changeTab(tabName) {
    this.setState({
      activeTab: tabName
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col s12" },
        React.createElement(
          "ul",
          { className: "tabs" },
          React.createElement(
            "li",
            { className: "active tab col s4" },
            React.createElement(
              "a",
              { href: "#timeline", onClick: this.changeTab.bind(this, "timeline") },
              "TIMELINE"
            )
          ),
          React.createElement(
            "li",
            { className: "tab col s4" },
            React.createElement(
              "a",
              { href: "#stats", onClick: this.changeTab.bind(this, "stats") },
              "STATISTICS"
            )
          ),
          React.createElement(
            "li",
            { className: "tab col s4" },
            React.createElement(
              "a",
              { href: "#goals", onClick: this.changeTab.bind(this, "goals") },
              "GOALS"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "tab-container" },
        React.createElement(
          "div",
          { id: "timeline", className: "col s12" },
          React.createElement(TimelineView, { personId: this.props.personId })
        ),
        React.createElement(
          "div",
          { id: "stats", className: "col s12" },
          React.createElement(StatsView, { personId: this.props.personId })
        ),
        React.createElement(
          "div",
          { id: "goals", className: "col s12" },
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
      dataInit: false,
      measureTypes: [],
      measuresData: {}
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!this.state.dataInit) {
      this.loadMeasureData();
    }
  },
  componentDidUpdate: function componentDidUpdate() {},
  setDataInit: function setDataInit(dataInit) {
    this.setState({
      dataInit: dataInit
    });
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
                measureTypes: measureTypes,
                measuresData: measureJsonArray,
                dataInit: true
              }, function () {
                $('.collapsible').collapsible();
                $('.modal-trigger').leanModal();
              });
            }
          }
        });
      }
    });
  },
  openModal: function openModal() {
    $('#measureModal').openModal();
  },
  render: function render() {
    var modal = this.state.modalOn;
    var measuresData = this.state.measuresData;
    var measureTypes = this.state.measureTypes;
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
        "li",
        { key: measureName },
        React.createElement(
          "div",
          { className: "collapsible-header" },
          React.createElement(
            "i",
            { className: "material-icons" },
            "filter_drama"
          ),
          React.createElement(
            "p",
            null,
            measureName
          )
        ),
        React.createElement(
          "div",
          { className: "collapsible-body" },
          React.createElement(
            "table",
            null,
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
                )
              )
            ),
            React.createElement(
              "tbody",
              null,
              measureRows
            )
          )
        )
      );
    });
    return React.createElement(
      "div",
      { className: "statsView" },
      React.createElement(
        "nav",
        { className: "sub-nav" },
        React.createElement(
          "div",
          { className: "nav-wrapper" },
          React.createElement(
            "div",
            { className: "brand-logo left" },
            "Your current statistics"
          ),
          React.createElement(
            "ul",
            { className: "right" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: this.openModal, className: "btn-floating waves-effect waves-light" },
                React.createElement(
                  "i",
                  { className: "material-icons" },
                  "add"
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "expandable" },
        measureTables
      ),
      React.createElement(MeasureModal, { personId: this.props.personId, cbDataInit: this.setDataInit, measureTypes: measureTypes })
    );
  }
});
"use strict";

var TimelineView = React.createClass({
  displayName: "TimelineView",

  getInitialState: function getInitialState() {
    return {
      timelineData: {}
    };
  },
  componentWillMount: function componentWillMount() {
    this.loadTimelineData();
  },
  loadTimelineData: function loadTimelineData() {
    var self = this;
    var timelinesUrl = logicBaseUrl + "persons/" + this.props.personId + "/timelines";
    $.getJSON(timelinesUrl, function (timelines) {
      self.setState({
        timelineData: timelines
      });
    });
  },
  render: function render() {
    var timelineData = this.state.timelineData;
    var initTimelineData = Object.keys(timelineData).length > 0;
    if (!initTimelineData) {
      return React.createElement("div", null);
    }
    var timelines = $.map(timelineData, function (item, index) {
      var timelineString = item.JSONString.replace(/'/g, '"');
      var timelineObj = JSON.parse(timelineString);
      var timelineCard;
      var goalReached = timelineObj.goalReached;
      var measureType = timelineObj.measureType;
      if (timelineObj.mediaType == "joke") {
        timelineCard = React.createElement(Joke, { joke: timelineObj });
      } else if (timelineObj.mediaType == "sleepMusic" || timelineObj.mediaType == "runningMusic") {
        timelineCard = React.createElement(Music, { music: timelineObj });
      } else if (timelineObj.mediaType == "recipe") {
        timelineCard = React.createElement(Recipe, { recipe: timelineObj });
      }

      return React.createElement(
        "div",
        { className: "row", key: index },
        React.createElement(
          "div",
          { className: "col s12 m12" },
          React.createElement(
            "div",
            { className: "card" },
            React.createElement(
              "div",
              { className: "card-top" },
              React.createElement(
                "div",
                { className: "top-left" },
                React.createElement(
                  "i",
                  { className: goalReached ? "material-icons green-icon" : "material-icons red-icon" },
                  goalReached ? "trending_up" : "trending_down"
                ),
                goalReached ? "Reached" : "Didn't reach",
                " goal:",
                React.createElement(
                  "span",
                  { className: "measure" },
                  " ",
                  measureType
                )
              ),
              React.createElement(
                "div",
                { className: "top-right" },
                item.created
              )
            ),
            timelineCard
          )
        )
      );
    });

    var header;
    if (timelines.length == 0) {
      header = React.createElement(
        "h3",
        null,
        "No actions yet. Go add your goals and daily results!"
      );
    }

    return React.createElement(
      "div",
      null,
      header,
      timelines
    );
  }
});

var Joke = React.createClass({
  displayName: "Joke",

  render: function render() {
    var joke = this.props.joke;
    return React.createElement(
      "div",
      { className: "card-body card-joke" },
      React.createElement(
        "div",
        { className: "card-header" },
        "Keep up the good work!"
      ),
      React.createElement(
        "div",
        { className: "card-content" },
        React.createElement(
          "blockquote",
          null,
          joke.joke
        )
      )
    );
  }
});

var Music = React.createClass({
  displayName: "Music",

  render: function render() {
    var music = this.props.music;
    var spotifyUri = "https://embed.spotify.com/?uri=" + music.uri;
    return React.createElement(
      "div",
      { className: "card-body card-music" },
      React.createElement(
        "div",
        { className: "card-header" },
        music.mediaType == "sleepMusic" ? "This music will help you sleep better" : "Boost your next training with this tune!"
      ),
      React.createElement(
        "div",
        { className: "card-content" },
        React.createElement(
          "div",
          { className: "col l6 m6 s12" },
          React.createElement(
            "p",
            null,
            React.createElement(
              "b",
              null,
              "Artist:"
            ),
            React.createElement("br", null),
            music.artists[0].name
          ),
          React.createElement(
            "p",
            null,
            React.createElement(
              "b",
              null,
              "Track:"
            ),
            React.createElement("br", null),
            music.name
          ),
          React.createElement(
            "p",
            null,
            React.createElement(
              "b",
              null,
              "Album:"
            ),
            React.createElement("br", null),
            music.album.name
          ),
          React.createElement(
            "p",
            null,
            React.createElement(
              "b",
              null,
              "Source:"
            ),
            React.createElement("br", null),
            "Open track in ",
            React.createElement(
              "a",
              { href: music.external_urls.spotify },
              "Spotify"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col l6 m6 s12" },
          React.createElement("iframe", { src: spotifyUri, width: "220", height: "300", frameBorder: "0", allowTransparency: "true" })
        )
      )
    );
  }
});

var Recipe = React.createClass({
  displayName: "Recipe",

  render: function render() {
    var recipe = this.props.recipe;
    var ingredients = $.map(recipe.ingredientLines, function (item, index) {
      return React.createElement(
        "li",
        { key: index },
        item
      );
    });
    return React.createElement(
      "div",
      { className: "card-body card-recipe" },
      React.createElement(
        "div",
        { className: "card-header" },
        "Healthy recipe for your next meal"
      ),
      React.createElement(
        "div",
        { className: "card-image" },
        React.createElement("img", { src: recipe.image }),
        React.createElement(
          "span",
          { className: "card-title" },
          recipe.label
        )
      ),
      React.createElement(
        "div",
        { className: "card-content" },
        React.createElement(
          "p",
          null,
          "Calories per serving: ",
          Math.round(recipe.calories / recipe.yield)
        ),
        React.createElement(
          "ul",
          null,
          "Ingredients:",
          ingredients
        ),
        React.createElement(
          "p",
          null,
          "Read more from: ",
          React.createElement(
            "a",
            { href: recipe.url },
            recipe.source
          )
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
      personsData: []
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
  dailyStatsSet: function dailyStatsSet(statsSet) {
    this.setState({
      dailyStatsSet: statsSet
    });
  },
  // Render function
  render: function render() {
    var mainView;
    var personId = this.state.personId;
    var header = React.createElement(Header, { personId: personId, resetPerson: this.setPersonId.bind(this, null), skipStatsSet: this.dailyStatsSet.bind(this, true) });
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
        React.createElement(ProfileView, { personId: this.state.personId })
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
