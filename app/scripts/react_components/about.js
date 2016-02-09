var About = React.createClass({
  render: function () {
      return (
        <div className="about row">
          <div className="app-description">
            <h4>What is Lifecoach application?</h4>
            <p>
              The Lifecoach application allows user follow his/hers health measurements 
              and get motivational suggestions based on the performance of the user.
            </p>
            <p>
              The application starts by picking up a dummy profile. User can then add daily 
              measurements (steps, sleep, calories) which are saved for the user. The application 
              visualizes the measure history of user by showing charts that show the values of 
              the measure over time.
            </p>
            <p>
            User can also define specific daily goals (f.ex. ”daily steps count 8000”) that 
            the application follows. Based on whether the goals are reached or not, the application 
            will motivate (through jokes) or suggest actions (recipes, new music) to support user 
            to reach the goals. These are shown in the user’s timeline.
            </p>
            <p>Read more about the application from <a link href="https://github.com/introsde-2015-project" target="_blank"> GitHub</a></p>
          </div>
          <div className="author row">
            <h4 className="col s12">Who is behind this?</h4>
            <div className="author-img col s12 m4">
              <img src="http://gravatar.com/avatar/775d7fbbe7e5fe487de01c2670076269.jpg?s=600"/>
            </div>
            <div className="author-text col s12 m8">
              <p>This application was developed as the final project for the 
              course Introduction to Service Design and Engineering of University of Trento.</p>
              <p>The application is developed by <b>Toomas Kallioja</b></p>
              <p>Contact: <a href="mailto:toomas.kallioja@gmail.com">toomas.kallioja@gmail.com</a></p>
            </div>
          </div>
        </div>
      );
  } 
});