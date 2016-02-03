var TimelineView = React.createClass({
    getInitialState: function () {  
      return null;
    },
    componentDidUpdate: function() {
    },
    changeTab: function(tabName) {
    },
    render: function () {
      console.log(this.props.timeline);
      var timeline = this.props.timeline.map(function(item, index) {
          var timelineItem;
          if (item.mediaType == "joke") {
            timelineItem = <Joke joke={item}/>
          } else if (item.mediaType == "sleepMusic" || item.mediaType == "runningMusic") {
            timelineItem = <Music music={item}/>
          } else if (item.mediaType == "recipe") {
            timelineItem = <Recipe recipe={item}/>
          }


        return (
          <div key={index}>
            <div>FOR {item.goalReached ? "REACHING" : "NOT REACHING"} YOUR GOAL {item.measureType}</div>
            {timelineItem}
          </div>
        )
      });

      var header;
      if (timeline.length > 0) {
        header =  <h3>Your recommendations:</h3>
      } else {
        header = <h3>No recommendations yet. Go add your daily results!</h3>
      }

      return (
        <div>
          {header}
          {timeline}
        </div> 
      );
    }
});

var Joke = React.createClass({
    getInitialState: function () {  
      return null;
    },
    componentDidUpdate: function() {
    },
    changeTab: function(tabName) {
    },
    render: function () {
      var joke = this.props.joke;
      return (
        <div>
            <p>Keep up the good work! Did you know that...</p>
            <p>{joke.joke}</p>
        </div> 
      );
    }
});

var Music = React.createClass({
    getInitialState: function () {  
      return null;
    },
    componentDidUpdate: function() {
    },
    changeTab: function(tabName) {
    },
    render: function () {
      var music = this.props.music;
      return (
        <div>
            <p>{music.mediaType == "sleepMusic" ? 
              "Music recommendation to make you sleep better:" :
              "Music recommendation to cheer you in your next sports activity:"}</p>
            <p>{music.artists[0].name} - {music.name}</p>
            <p><a href={music.href}>Spotify url</a></p>
        </div> 
      );
    }
});

var Recipe = React.createClass({
    getInitialState: function () {  
      return null;
    },
    componentDidUpdate: function() {
    },
    changeTab: function(tabName) {
    },
    render: function () {
      var recipe = this.props.recipe;
      return (
        <div>
            <p>New delicious and healthy recipe recommendation for your next meal:</p>
            <p>{recipe.label}</p>
            <p>Calories per serving: {recipe.calories / recipe.yield}</p>
            <p><img src={recipe.image}/></p>
            <p><a href={recipe.url}>Recipe url</a></p>
        </div> 
      );
    }
});