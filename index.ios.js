'use strict';

var d3 = require('d3');

var React = require('react-native');

var {AppRegistry, StyleSheet, Text, View, Component} = React;

var Circle = require('./Circle.ios');
var collide = require('./collide');

var width = 440;
var height = 400;

var fbPalette = true;
var normal = false;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: fbPalette ? '#405D9B' : '#48484F',
    position: 'relative',
    marginTop: 20,
    width: width,
    height: height
  }
});

function palette(min, max) {
    var d = (max-min)/13;
    return d3.scale.threshold()
        .range(['#8b0000','#b61d39','#d84765','#ef738b','#fea0ac','#ffd1c9','#ffffe0','#c7f0ba','#9edba4','#7ac696','#5aaf8c','#399785','#008080'])
        .domain([min+1*d,min+2*d,min+3*d,min+4*d,min+5*d,min+6*d,min+7*d,min+8*d,min+9*d,min+10*d,min+11*d,min+12*d,min+13*d]);
}

var n = 1000;
var color = palette(0, n);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    var nodes = d3.range(n).map(() => {
      return {
        radius: Math.random() * 12 + 4,
        x: Math.random() * width,
        y: Math.random() * height,
      };
    });
    var force = d3.layout.force()
        .gravity(normal ? 0.05 : 0.01)
        .friction(normal ? 0.9 : 0.6)
        .charge((d, i) => i ? 0 : -2000)
        .nodes(nodes)
        .size([width, height]);
    var root = nodes[0];
    root.radius = 10;
    root.fixed = true;
    return {nodes, force, root};
  }

  componentDidMount() {
    var force = this.state.force;
    force.on("tick", () => {
      var {nodes} = this.state;
      var q = d3.geom.quadtree(nodes);
      var i = 0;
      var n = nodes.length;
      while (++i < n) q.visit(collide(width, height, nodes[i]));
      this.setState({}); // very dangerous.
    });
    force.start();
  }
  render() {
    var {nodes} = this.state;
    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={evt => true}
        onResponderRelease={evt => {
          var {root} = this.state;
          root.x = evt.locationX;
          root.y = evt.locationY;
          this.setState({root});
        }}>
        {nodes.map((d, i) => {
          var {radius, x, y} = d;
          return <Circle
            radius={radius}
            x={x}
            y={y}
            style={{backgroundColor: i === 0 ? 'pink' : 'white'}} />;
        })}
      </View>
    );
  }
};

AppRegistry.registerComponent('natived3', () => App);
