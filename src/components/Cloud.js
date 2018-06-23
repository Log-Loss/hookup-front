import React from 'react';
import {Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape} from 'bizcharts';
import DataSet from '@antv/data-set';
import { routerRedux } from 'dva/router';

const GenreChart = ({data, dispatch}) => {
  if (!data || !data.length) return null
  function getTextAttrs(cfg) {
    return {
      fillOpacity: cfg.opacity,
      fontSize: cfg.origin._origin.size,
      rotate: cfg.origin._origin.rotate,
      text: cfg.origin._origin.text,
      textAlign: 'center',
      fontFamily: cfg.origin._origin.font,
      fill: cfg.color,
      textBaseline: 'Alphabetic',
      ...cfg.style
    };
  }

  function goto(ev) {
    dispatch(routerRedux.push(`detail/type/${ev.data._origin.type}`));
  }

  // 给point注册一个词云的shape
  Shape.registerShape('point', 'cloud', {
    drawShape(cfg, container) {
      const attrs = getTextAttrs(cfg);
      return container.addShape('text', {
        attrs: {
          ...attrs,
          x: cfg.x,
          y: cfg.y
        }
      });
    }
  });

  const dv = new DataSet.View().source(data);
  const range = dv.range('count');
  const min = range[0];
  const max = range[1];
  dv.transform({
    type: 'tag-cloud',
    fields: ['type', 'count'],
    size: [700, 800],
    font: 'Verdana',
    padding: 0,
    timeInterval: 5000, // max execute time
    rotate() {
      let random = ~~(Math.random() * 4) % 4;
      if (random == 2) {
        random = 0;
      }
      return random * 90; // 0, 90, 270
    },
    fontSize(d) {
      if (d.count) {
        return ((d.count - min) / (max - min)) * (50 - 14) + 14;
      }
      return 0;
    }
  });
  const scale = {
    x: {nice: false},
    y: {nice: false}
  };

  return (
    <div>
      <Chart height={500} width={800} data={dv}
             scale={scale} padding={0} forceFit
             onPointClick={(ev) => goto(ev)}>
        <Coord reflect="y"/>
        <Geom type='point' position="x*y"
              color="type" shape='cloud' tooltip='type*count'/>
      </Chart>
    </div>
  );
};

export default GenreChart;
