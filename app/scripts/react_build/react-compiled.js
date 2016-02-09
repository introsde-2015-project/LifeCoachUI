"use strict";

var About = React.createClass({
  displayName: "About",

  render: function render() {
    return React.createElement(
      "div",
      { className: "about row" },
      React.createElement(
        "div",
        { className: "app-description" },
        React.createElement(
          "h4",
          null,
          "What is Lifecoach application?"
        ),
        React.createElement(
          "p",
          null,
          "The Lifecoach application allows user follow his/hers health measurements and get motivational suggestions based on the performance of the user."
        ),
        React.createElement(
          "p",
          null,
          "The application starts by picking up a dummy profile. User can then add daily measurements (steps, sleep, calories) which are saved for the user. The application visualizes the measure history of user by showing charts that show the values of the measure over time."
        ),
        React.createElement(
          "p",
          null,
          "User can also define specific daily goals (f.ex. ”daily steps count 8000”) that the application follows. Based on whether the goals are reached or not, the application will motivate (through jokes) or suggest actions (recipes, new music) to support user to reach the goals. These are shown in the user’s timeline."
        ),
        React.createElement(
          "p",
          null,
          "Read more about the application from ",
          React.createElement(
            "a",
            { link: true, href: "https://github.com/introsde-2015-project", target: "_blank" },
            " GitHub"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "author row" },
        React.createElement(
          "h4",
          { className: "col s12" },
          "Who is behind this?"
        ),
        React.createElement(
          "div",
          { className: "author-img col s12 m4" },
          React.createElement("img", { src: "http://gravatar.com/avatar/775d7fbbe7e5fe487de01c2670076269.jpg?s=600" })
        ),
        React.createElement(
          "div",
          { className: "author-text col s12 m8" },
          React.createElement(
            "p",
            null,
            "This application was developed as the final project for the course Introduction to Service Design and Engineering of University of Trento."
          ),
          React.createElement(
            "p",
            null,
            "The application is developed by ",
            React.createElement(
              "b",
              null,
              "Toomas Kallioja"
            )
          ),
          React.createElement(
            "p",
            null,
            "Contact: ",
            React.createElement(
              "a",
              { href: "mailto:toomas.kallioja@gmail.com" },
              "toomas.kallioja@gmail.com"
            )
          )
        )
      )
    );
  }
});
"use strict";

var myChart = null;

var Chart = React.createClass({
	displayName: "Chart",

	getInitialState: function getInitialState() {
		return {
			chartInitialized: false
		};
	},
	componentDidMount: function componentDidMount() {
		this.initChart(this.props.data);
	},
	componentDidUpdate: function componentDidUpdate() {
		if (!this.state.chartInitialized) {
			this.initChart(this.props.data);
		} else {
			myChart.data = this.props.data;
			myChart.draw();
			myChart.axes[1].shapes.selectAll("text").attr("x", "-15");
			myChart.axes[0].titleShape.text("Date");
			myChart.axes[1].titleShape.text("Value");
		}
	},
	initChart: function initChart(data) {
		var width = $(".tab-container").width() - 20;
		if (width == 0) {
			return;
		}
		var height = width * 0.7;
		var svg = dimple.newSvg("#measureChart", width, height);
		myChart = new dimple.chart(svg, data);
		myChart.setBounds(50, 10, width - 70, height - 95);
		var x = myChart.addCategoryAxis("x", "date");
		x.addOrderRule("Date");
		var y = myChart.addMeasureAxis("y", "value");
		var mySeries = myChart.addSeries(null, dimple.plot.bar);
		myChart.draw();
		x.titleShape.text("Date");
		y.titleShape.text("Value");
		y.shapes.selectAll("text").attr("x", "-15");
		this.setState({
			chartInitialized: true
		});
	},
	render: function render() {
		return React.createElement("div", { id: "measureChart" });
	}
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DailyStats = React.createClass({
  displayName: "DailyStats",

  getInitialState: function getInitialState() {
    return {
      sleep: false,
      calories: false,
      steps: false,
      dailyStats: []
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.sleep != false && this.state.calories != false && this.state.steps != false) {
      setTimeout(function () {
        this.postDailyStats();
      }.bind(this), 10);
    }
  },
  onStatsChange: function onStatsChange(stat, value) {
    var _setState;

    var measure = { "measure": stat, "value": value };
    var dailyStats = this.state.dailyStats;
    dailyStats.push(measure);
    this.setState((_setState = {}, _defineProperty(_setState, stat, true), _defineProperty(_setState, "dailyStats", dailyStats), _setState));
  },
  createNewMeasure: function createNewMeasure(value) {
    var measure = {
      "value": +value
    };
    return JSON.stringify(measure);
  },
  postDailyStats: function postDailyStats() {
    var dailyStats = this.state.dailyStats;
    for (var i = 0; i < dailyStats.length; i++) {
      var measureType = dailyStats[i].measure;
      var value = dailyStats[i].value;
      if (value != null && value != 0) {
        var measureObj = this.createNewMeasure(value);
        var self = this;
        $.ajax({
          async: false,
          global: false,
          url: processBaseUrl + "persons/" + this.props.personId + "/" + measureType,
          type: "POST",
          data: measureObj,
          contentType: "application/json; charset=utf-8",
          dataType: "json"
        });
      }
    }
    this.props.setDailyStats();
  },
  render: function render() {
    var statsForm;
    var questionNbr;
    if (this.state.sleep == false) {
      questionNbr = 1;
      statsForm = React.createElement(StatsForm, { question: "How many hours did you sleep last night?", callback: this.onStatsChange.bind(this, "sleep") });
    } else if (this.state.steps == false) {
      questionNbr = 2;
      statsForm = React.createElement(StatsForm, { question: "How many steps did you take yesterday?", callback: this.onStatsChange.bind(this, "steps") });
    } else if (this.state.calories == false) {
      questionNbr = 3;
      statsForm = React.createElement(StatsForm, { question: "How many calories did you eat yesterday?", callback: this.onStatsChange.bind(this, "calories") });
    } else {
      return React.createElement(Spinner, null);
    }
    return React.createElement(
      "div",
      { className: "dailyStats" },
      React.createElement(
        "h3",
        { className: "statsHeading" },
        "Tell me about your day!"
      ),
      React.createElement(
        "ul",
        { className: "pagination" },
        React.createElement(
          "div",
          { className: "breadcrumb" },
          React.createElement(
            "li",
            { className: questionNbr == 1 ? "active" : null },
            React.createElement(
              "a",
              null,
              "Sleep"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "breadcrumb" },
          React.createElement(
            "li",
            { className: questionNbr == 2 ? "active" : null },
            React.createElement(
              "a",
              null,
              "Steps"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "breadcrumb" },
          React.createElement(
            "li",
            { className: questionNbr == 3 ? "active" : null },
            React.createElement(
              "a",
              null,
              "Calories"
            )
          )
        )
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
    } else if ($.inArray(event.which, [46, 8, 9, 27, 13, 110, 190]) !== -1) {
      return;
    } else if (event.which < 48 || event.which > 57) {
      event.preventDefault();
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
        React.createElement("input", { autoFocus: true, type: "number", value: this.state.statValue, onChange: this.onValueChange, onKeyDown: this.handleKeyDown })
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
			goalType: "",
			goalValue: "",
			spinner: false
		};
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
		event.preventDefault();
		this.setState({
			spinner: true
		}, function () {
			this.postGoal();
		});
	},
	postGoal: function postGoal() {
		var self = this;
		var goal = this.createNewGoal(this.state.goalValue, this.state.goalType);
		$.ajax({
			url: processBaseUrl + "persons/" + this.props.personId + "/goals",
			type: "POST",
			data: goal,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function success(data) {
				self.setState({
					spinner: false
				}, function () {
					$('#goalModal').closeModal();
					self.props.cbLoadData();
				});
			},
			fail: function fail() {
				console.log("Failed to add goal");
				self.setState({
					spinner: false
				}, function () {
					$('#goalModal').closeModal();
				});
			}
		});
	},
	checkOnlyNumbers: function checkOnlyNumbers(event) {
		if ($.inArray(event.which, [46, 8, 9, 27, 13, 110, 190]) !== -1) {
			return;
		} else if (event.which < 48 || event.which > 57) {
			event.preventDefault();
		}
	},
	closeModal: function closeModal() {
		$('#goalModal').closeModal();
	},
	render: function render() {
		var goalTypes = this.props.goalTypes;

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
						React.createElement("input", { id: "goalValue", placeholder: "Value in numbers", type: "number", className: "validate", onKeyDown: this.checkOnlyNumbers, value: this.state.goalValue, onChange: this.onValueChange, required: true, "aria-required": "true" }),
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
					),
					this.state.spinner ? React.createElement(Spinner, { overlay: true }) : null
				)
			)
		);
	}
});
"use strict";

var GoalsView = React.createClass({
  displayName: "GoalsView",

  getInitialState: function getInitialState() {
    return null;
  },
  componentDidMount: function componentDidMount() {
    //this.loadGoalData();
  },
  deleteGoal: function deleteGoal(goalId) {
    var self = this;
    var goalUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals/" + goalId;
    $.ajax({
      url: goalUrl,
      type: 'DELETE',
      success: function success(result) {
        self.props.cbLoadData();
      }
    });
  },
  openModal: function openModal() {
    $('#goalModal').openModal();
  },
  render: function render() {
    var self = this;
    var goalData = this.props.goalData;

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
          goalObj.date
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "a",
            { href: "#", onClick: this.deleteGoal.bind(this, goalObj.gid) },
            React.createElement(
              "i",
              { className: "material-icons red-icon" },
              "clear"
            )
          )
        )
      );
    }, this);

    var goalsView;

    if (goalData.length > 0) {
      goalsView = React.createElement(
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
              "Date"
            ),
            React.createElement("th", null)
          )
        ),
        React.createElement(
          "tbody",
          null,
          goalRows
        )
      );
    } else {
      goalsView = React.createElement(
        "div",
        { className: "goals-view" },
        "No goals added yet."
      );
    }

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
      goalsView,
      React.createElement(GoalModal, { personId: this.props.personId, goalTypes: this.props.goalTypes, cbLoadData: this.props.cbLoadData })
    );
  }
});
"use strict";

var Header = React.createClass({
  displayName: "Header",

  render: function render() {
    return React.createElement(
      "nav",
      null,
      React.createElement(
        "div",
        { className: "nav-wrapper" },
        React.createElement(
          "div",
          { className: "brand-logo left" },
          React.createElement(
            "a",
            { href: "#", onClick: this.props.skipStatsSet },
            "LifeCoach"
          )
        ),
        React.createElement(
          "ul",
          { className: "right" },
          this.props.personId != null ? React.createElement(
            "li",
            { onClick: this.props.resetPerson },
            React.createElement(
              "a",
              null,
              React.createElement(
                "i",
                { className: "material-icons" },
                "exit_to_app"
              )
            )
          ) : null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { onClick: this.props.openAbout },
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
			measureValue: "",
			spinner: false
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
	checkOnlyNumbers: function checkOnlyNumbers(event) {
		if ($.inArray(event.which, [46, 8, 9, 27, 13, 110, 190]) !== -1) {
			return;
		} else if (event.which < 48 || event.which > 57) {
			event.preventDefault();
		}
	},
	createNewMeasure: function createNewMeasure(value) {
		var measure = {
			"value": +value
		};
		return JSON.stringify(measure);
	},
	handleSubmit: function handleSubmit(event) {
		event.preventDefault();
		this.setState({
			spinner: true
		}, function () {
			this.postMeasure();
		});
	},
	postMeasure: function postMeasure() {
		var self = this;
		var measure = this.createNewMeasure(this.state.measureValue);
		$.ajax({
			url: processBaseUrl + "persons/" + this.props.personId + "/" + this.state.measureType,
			type: "POST",
			data: measure,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			timeout: 10000,
			success: function success(data) {
				self.setState({
					spinner: false
				}, function () {
					$('#measureModal').closeModal();
					self.props.cbLoadData();
				});
			},
			fail: function fail() {
				console.log("Failed to add measure");
				self.setState({
					spinner: false
				}, function () {
					$('#measureModal').closeModal();
				});
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
						React.createElement("input", { id: "measureValue", placeholder: "Value in numbers", type: "number", className: "validate", onKeyDown: this.checkOnlyNumbers, value: this.state.measureValue, onChange: this.onValueChange, required: true, "aria-required": "true" }),
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
					),
					this.state.spinner ? React.createElement(Spinner, { overlay: true }) : null
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
        React.createElement("img", { src: person.imageUrl, alt: "", className: "circle" }),
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
      activeTab: "timeline",
      timelineData: null,
      measuresData: null,
      goalData: null
    };
  },
  componentWillMount: function componentWillMount() {
    this.loadData();
  },
  componentDidMount: function componentDidMount() {
    $('ul.tabs').tabs();
  },
  changeTab: function changeTab(tabName) {
    this.setState({
      activeTab: tabName
    });
  },
  loadData: function loadData() {
    this.loadTimelineData();
  },
  loadTimelineData: function loadTimelineData() {
    var self = this;
    var timelinesUrl = logicBaseUrl + "persons/" + this.props.personId + "/timelines";
    $.getJSON(timelinesUrl, function (timelines) {
      self.setState({
        timelineData: timelines
      }, function () {
        this.loadMeasuresData();
      });
    });
  },
  loadMeasuresData: function loadMeasuresData() {
    var self = this;
    var measureTypes = this.props.measureTypes;
    var measureBaseUrl = logicBaseUrl + "persons/" + this.props.personId + "/";
    var measuresJsonArray = {};
    var count = 0;
    for (var i = 0; i < measureTypes.length; i++) {
      $.ajax({
        'async': false,
        'global': false,
        'url': measureBaseUrl + measureTypes[i],
        'success': function success(measureData) {
          measuresJsonArray[measureTypes[i]] = measureData;
          count++;
          if (count == measureTypes.length) {
            self.setState({
              measuresData: measuresJsonArray
            }, function () {
              self.loadGoalData();
            });
          }
        }
      });
    }
  },
  loadGoalData: function loadGoalData() {
    var self = this;
    var goalsUrl = logicBaseUrl + "persons/" + this.props.personId + "/goals";
    $.getJSON(goalsUrl, function (goals) {
      self.setState({
        goalData: goals
      });
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
          this.state.timelineData ? React.createElement(TimelineView, { personId: this.props.personId, timelineData: this.state.timelineData }) : React.createElement(Spinner, null)
        ),
        React.createElement(
          "div",
          { id: "stats", className: "col s12" },
          this.state.measuresData ? React.createElement(StatsView, { personId: this.props.personId, measuresData: this.state.measuresData, measureTypes: this.props.measureTypes, cbLoadData: this.loadData }) : React.createElement(Spinner, null)
        ),
        React.createElement(
          "div",
          { id: "goals", className: "col s12" },
          this.state.goalData ? React.createElement(GoalsView, { personId: this.props.personId, goalData: this.state.goalData, goalTypes: this.props.goalTypes, cbLoadData: this.loadData }) : React.createElement(Spinner, null)
        )
      )
    );
  }
});
"use strict";

var Spinner = React.createClass({
  displayName: "Spinner",

  render: function render() {
    return React.createElement(
      "div",
      { className: this.props.overlay ? "overlay-spinner" : "spinner" },
      React.createElement(
        "div",
        { className: "loader-screen" },
        React.createElement(
          "div",
          { className: "preloader-wrapper big active" },
          React.createElement(
            "div",
            { className: "spinner-layer" },
            React.createElement(
              "div",
              { className: "circle-clipper left" },
              React.createElement("div", { className: "circle" })
            ),
            React.createElement(
              "div",
              { className: "gap-patch" },
              React.createElement("div", { className: "circle" })
            ),
            React.createElement(
              "div",
              { className: "circle-clipper right" },
              React.createElement("div", { className: "circle" })
            )
          )
        )
      )
    );
  }
});
'use strict';

var StatsView = React.createClass({
  displayName: 'StatsView',

  getInitialState: function getInitialState() {
    return {
      activeMeasure: "weight"
    };
  },
  componentDidMount: function componentDidMount() {
    $('.collapsible').collapsible({});
  },
  openModal: function openModal() {
    $('#measureModal').openModal();
  },
  setActiveMeasure: function setActiveMeasure(measure) {
    this.setState({
      activeMeasure: measure
    });
  },
  render: function render() {
    var measureData = this.props.measuresData[this.state.activeMeasure];
    var measures = $.map(this.props.measureTypes, function (measureName, index) {
      return React.createElement(
        'li',
        { key: index, className: this.state.activeMeasure == measureName ? "active" : null },
        React.createElement(
          'a',
          { onClick: this.setActiveMeasure.bind(this, measureName) },
          measureName
        )
      );
    }.bind(this));

    var measureView;
    if (measureData.length > 0) {
      measureView = React.createElement(Chart, { data: measureData });
    } else {
      measureView = React.createElement(
        'div',
        { className: 'measure-view' },
        'No measures added yet.'
      );
    }

    return React.createElement(
      'div',
      { className: 'statsView' },
      React.createElement(
        'nav',
        { className: 'sub-nav' },
        React.createElement(
          'div',
          { className: 'nav-wrapper' },
          React.createElement(
            'div',
            { className: 'brand-logo left' },
            'Your current statistics'
          ),
          React.createElement(
            'ul',
            { className: 'right' },
            React.createElement(
              'li',
              null,
              React.createElement(
                'a',
                { onClick: this.openModal, className: 'btn-floating waves-effect waves-light' },
                React.createElement(
                  'i',
                  { className: 'material-icons' },
                  'add'
                )
              )
            )
          )
        )
      ),
      React.createElement(
        'ul',
        { className: 'pagination' },
        measures
      ),
      measureView,
      React.createElement(MeasureModal, { personId: this.props.personId, cbLoadData: this.props.cbLoadData, measureTypes: this.props.measureTypes })
    );
  }
});
"use strict";

var TimelineView = React.createClass({
  displayName: "TimelineView",

  render: function render() {
    var timelineData = this.props.timelineData;
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
                item.date
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
        "p",
        { className: "timeline-header" },
        "No actions yet. ",
        React.createElement("br", null),
        "Go add your goals and daily results!"
      );
    }

    return React.createElement(
      "div",
      { className: "timeline" },
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

var ajaxErrorCount = 0;

var LifeCoach = React.createClass({
  displayName: "LifeCoach",

  // Init initial variables
  getInitialState: function getInitialState() {
    return {
      personId: null,
      dailyStatsSet: false,
      personsData: [],
      measureTypes: [],
      goalTypes: [],
      about: false
    };
  },
  componentDidMount: function componentDidMount() {
    this.loadPersonsData();
  },
  // With every state update, call external functions to handle resize and autoscroll
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {},
  setPersonId: function setPersonId(personId) {
    this.setState({
      personId: personId,
      dailyStatsSet: false,
      about: false
    });
  },
  loadPersonsData: function loadPersonsData() {
    var self = this;
    var lifecoachPersonsUrl = logicBaseUrl + "persons";
    $.ajax({
      url: lifecoachPersonsUrl,
      success: function success(data) {
        ajaxErrorCount = 0;
        self.setState({
          personsData: data
        }, function () {
          this.loadTypes();
        });
      },
      timeout: 10000,
      error: function error(jqXHR, textStatus, errorThrown) {
        ajaxErrorCount++;
        console.log("Error: " + textStatus);
        console.log(jqXHR);
        if (ajaxErrorCount < 5) {
          self.loadPersonsData();
        }
      }
    });
  },
  loadTypes: function loadTypes() {
    var self = this;
    var measureTypesUrl = logicBaseUrl + "measuretypes";
    var goalTypesUrl = logicBaseUrl + "goaltypes";
    $.ajax({
      url: measureTypesUrl,
      success: function success(measureTypes) {
        $.ajax({
          url: goalTypesUrl,
          success: function success(goalTypes) {
            self.setState({
              measureTypes: measureTypes,
              goalTypes: goalTypes
            });
          }
        });
      }
    });
  },
  setDailyStats: function setDailyStats() {
    this.setState({
      dailyStatsSet: true,
      about: false
    });
  },
  openAbout: function openAbout() {
    this.setState({
      about: true
    });
  },
  // Render function
  render: function render() {
    var mainView;
    var personId = this.state.personId;
    var header = React.createElement(Header, { personId: personId, resetPerson: this.setPersonId.bind(this, null), skipStatsSet: this.setDailyStats, openAbout: this.openAbout });
    if (!this.state.personsData.length > 0) {
      return React.createElement(
        "div",
        null,
        header,
        React.createElement(Spinner, null)
      );
    }
    if (this.state.about) {
      mainView = React.createElement(About, null);
    } else if (personId == null) {
      mainView = React.createElement(ProfileSelect, { personsData: this.state.personsData, callback: this.setPersonId });
    } else if (!this.state.dailyStatsSet) {
      mainView = React.createElement(DailyStats, { personId: this.state.personId, setDailyStats: this.setDailyStats });
    } else {
      mainView = React.createElement(ProfileView, { personId: this.state.personId, goalTypes: this.state.goalTypes, measureTypes: this.state.measureTypes });
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
