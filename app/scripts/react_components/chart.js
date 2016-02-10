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
		d3.select("svg").selectAll("svg > text").remove();
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
		mySeries.getTooltipText = function (e) {
			console.log(e);
			return [
			"Date: " + e.x,
			"Value: " + e.y
			];
		};
		mySeries.afterDraw = function (shape, data) {
	        // Get the shape as a d3 selection
	        var s = d3.select(shape);
	        var rect = {
	            x: parseFloat(s.attr("x")),
	            y: parseFloat(s.attr("y")),
	            width: parseFloat(s.attr("width")),
	            height: parseFloat(s.attr("height"))
	          };
	        // Only label bars where the text can fit
	        if (rect.height >= 8 && width > 29) {
	          // Add a text label for the value
	          svg.append("text")
	            // Position in the centre of the shape (vertical position is
	            // manually set due to cross-browser problems with baseline)
	            .attr("x", rect.x + rect.width / 2)
	            .attr("y", rect.y + rect.height / 2 + 3.5)
	            // Centre align
	            .style("text-anchor", "middle")
	            .style("font-size", "10px")
	            .style("font-family", "sans-serif")
	            // Make it a little transparent to tone down the black
	            .style("opacity", 0.6)
	            // Format the number
	            .text(data.yValue);
	        }
	      };
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