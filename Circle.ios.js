'use strict';

const React = require('react-native');

const {Component, PropTypes, StyleSheet, View} = React;

class Circle extends Component {
  getDefaultProps() { return {radius: 5, x: 0, y: 0, style: {}}; }
  render() {
    const {radius, y, x, style, children} = this.props;
    const size = {
      position: 'absolute',
      width: 2 * radius,
      height: 2 * radius,
      borderRadius: radius,
      top: y - radius,
      left: x - radius,
    };
    return <View style={[size, style]}>
      {children}
    </View>;
  }
}

Circle.propTypes = {
  style: View.propTypes.style,
  radius: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

module.exports = Circle;
