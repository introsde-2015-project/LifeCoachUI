var myChart = null;

var Chart = React.createClass({
	getInitialState: function() {
		return {
			chartInitialized: false
		}
	},
	componentDidMount: function() {
		this.initChart(this.props.data);
	},
	componentDidUpdate: function() {
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
	initChart: function(data) {
		var width = $(".tab-container").width() - 20;
		if (width == 0) {
			return;
		}
		var height = width * 0.7;
		var svg = dimple.newSvg("#measureChart", width, height);
		myChart = new dimple.chart(svg, data);
		myChart.setBounds(50, 10, width-70, height-95)
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
		})
	},
	render: function () {
	  return (
	    <div id="measureChart"></div>  
	  );
	} 
});