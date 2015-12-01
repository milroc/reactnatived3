import { Component } from 'React';


function fromProps(layout, props, avialable) {
  for (let key in avialable) {
    if (key in props && key in layout && layout[key]() !== props[key]) {
      layout[key](props[key]);
    }
  }
  return layout;
}

const PROPERTIES = ['values', 'offset', 'order', 'x', 'y', 'out'];

const StackedLayout = (ComposedComponet) => class extends Component {
  constructor(props) {
    super(props);
    this.state = {stack: fromProps(d3.layout.stack(), props, PROPERTIES)};
  }

  componentWillReceiveNewProps(props) {
    this.setState({stack: fromProps(this.state.stack, props, PROPERTIES)});
  }

  render() {
    return (
      <ComposedComponet
        {...this.props}
        data={this.state.stack(this.props.data)}
      />
    );
  }
};

const MarginProperties = (ComposedComponet) => class extends Component {
  render() {
    return <ComposedComponet {...this.props} />;
  }
};


class Axis extends Component {
  render() {
    return (
      <g className="axis x" ref="axis" />
    );
  }
}

class StackedBar extends Component {
  render() {
    const {xScale, yScale, colorScale} = this.props;
    const layers = this.props.data.map((layer, i) => {
      const rects = layer.map(({x, y, y0}, j) => (
        <rect
          key={j}
          x={xScale(x)}
          y={yScale(y + y0)}
          height={yScale(y) - yScale(y + y0)}
          width={xScale.rangeBand() - 1}
          fill={colorScale(i)}
        />
      ));
      return (
        <g key={i} className="layer">
          {rects}
        </g>
      );
    });
    return (
      <svg>
        {layers}
        <Axis {...this.props} type="x" />
        <Axis {...this.props} type="y" />
      </svg>
    );
  }
}

MarginProperties(StackedLayout(StackedBar));
