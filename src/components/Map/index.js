import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Row, Col} from 'antd'
import * as d3 from 'd3';
import {Link} from 'dva/router'
import styles from './index.less'


const colors = ['#FFC125', '#FF82AB', '#6dff89', '#FF3E96', '#CDCD00', '#B0E2FF', '#76EEC6', '#D2B48C', '#53868B', '#4169E1'];


let simulation;

class Chart extends Component {
  constructor(props, context) {
    super(props, context);
    this.print = this.print.bind(this);
    this.forceChart = this.forceChart.bind(this);
    this.state = {
      showToolbar: true,
      selected: null
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.print();
  }

  componentWillReceiveProps(newProps) {
    if ("data" in newProps) {
      this.print(newProps.data)
    }
  }

  print(source = this.props.data) {
    this.setState({selected: null})
    let callback = (res) => { // callback获取后台返回的数据，并存入state
      this.forceChart(res.nodes, res.edges); // d3力导向图内容
    };
    callback(source)
  }


  // func
  forceChart(nodes, edges) {
    const WIDTH = window.innerWidth - 100
    const HEIGHT = window.innerHeight - 100
    const R = 10;
    console.log(nodes, edges)
    this.refs['theChart'].innerHTML = '';
    const that = this;

    function onZoomStart(d) {
      // console.log('start zoom');
    }

    function zooming(d) {
      // 缩放和拖拽整个g
      // console.log('zoom ing', d3.event.transform, d3.zoomTransform(this));
      g.attr('transform', d3.event.transform); // 获取g的缩放系数和平移的坐标值。
    }

    function onZoomEnd() {
      // console.log('zoom end');
    }

    const zoom = d3.zoom()
    // .translateExtent([[0, 0], [WIDTH, HEIGHT]]) // 设置或获取平移区间, 默认为[[-∞, -∞], [+∞, +∞]]
      .scaleExtent([1 / 10, 10]) // 设置最大缩放比例
      .on('start', onZoomStart)
      .on('zoom', zooming)
      .on('end', onZoomEnd);

    function onDragStart(d) {
      // console.log('start');
      // console.log(d3.event.active);
      if (!d3.event.active) {
        simulation.alphaTarget(0.5) // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
          .restart();  // 拖拽节点后，重新启动模拟
      }
      d.fx = d.x;    // d.x是当前位置，d.fx是静止时位置
      d.fy = d.y;
    }

    function dragging(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function onDragEnd(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;       // 解除dragged中固定的坐标
      d.fy = null;
    }

    const drag = d3.drag()
      .on('start', onDragStart)
      .on('drag', dragging) // 拖拽过程
      .on('end', onDragEnd);

    // 函数内其余代码请看下文的**【拆解代码】**


    simulation = d3.forceSimulation(nodes) // 指定被引用的nodes数组
      .force('link', d3.forceLink(edges).id(d => d.id).distance(150))
      .force('collision', d3.forceCollide(1).strength(0.1))
      .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
      .force('charge', d3.forceManyBody().strength(-500).distanceMax(500));

    const svg = d3.select('#theChart').append('svg') // 在id为‘theChart’的标签内创建svg
      .style('width', WIDTH)
      .style('height', HEIGHT * 0.9)
      .on('click', () => {
        if (d3.event.target.tagName === 'svg') {
          that.setState({selected: null})
          edgesLine.style("stroke-width", 2)
        }
      })
      .call(zoom); // 缩放
    const g = svg.append('g'); // 则svg中创建g

    const edgesLine = svg.select('g')
      .selectAll('line')
      .data(edges) // 绑定数据
      .enter() // 为数据添加对应数量的占位符
      .append('path') // 在占位符上面生成折线（用path画）
      .attr('d', (d) => {
        return d && 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
      }) //遍历所有数据。d表示当前遍历到的数据，返回绘制的贝塞尔曲线
      .attr('id', (d, i) => {
        return i && 'edgepath' + i;
      }) // 设置id，用于连线文字
      .style('stroke', '#dfdfdf') // 颜色
      .style('stroke-width', 2); // 粗细

    const edgesText = svg.select('g').selectAll('.edgelabel')
      .data(edges)
      .enter()
      .append('text') // 为每一条连线创建文字区域
      .attr('dx', 60)
      .attr('dy', 0);
    edgesText.append('textPath')
      .attr('xlink:href', (d, i) => {
        return i && '#edgepath' + i;
      }) // 文字布置在对应id的连线上
      .style('font-size', 9)
      .style('fill', '#8a8a8a') // 颜色
      .style('pointer-events', 'none') // 禁止鼠标事件
      .text((d) => {
        return d && d.tag;
      }); // 设置文字内容
    const nodesCircle = svg.select('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle') // 创建圆
      .attr('r', function (d) {
        if (d.main) return R * 2;
        else return R;
      }) // 半径
      .attr("fill", function (d) {
        return colors[d.type ? d.type.charCodeAt(0) % 10 : 0]
      })
      .style('stroke', '#ffffff') // 边框颜色
      .style('stroke-width', 2) // 边框粗细
      .call(drag); // 拖拽单个节点带动整个图
    // nodesCircle.append('title')
    //   .text((node) => { // .text设置气泡提示内容
    //     return node && node.name; // 气泡提示为node的名称
    //   });

    const nodesTexts = svg.select('g')
      .selectAll('.label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .attr('dy', function (d) {
        return (d.main) ? 30 : 20
      }) // 节点名称放在圆圈中间位置
      .style("fill", function (d) {
        return colors[d.type ? d.type.charCodeAt(0) % 10 : 0]
      })
      .style('pointer-events', 'none') // 禁止鼠标事件
      .text((d) => { // 文字内容
        return d && d.name; // 遍历nodes每一项，获取对应的name
      })
    simulation.on('tick', () => {
      // 更新节点坐标
      nodesCircle.attr('transform', (d) => {
        return d && 'translate(' + d.x + ',' + d.y + ')';
      });
      // 更新节点文字坐标
      nodesTexts.attr('transform', (d) => {
        return 'translate(' + (d.x) + ',' + d.y + ')';
      });
      // 更新连线位置
      edgesLine.attr('d', (d) => {
        const path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        return path;
      });
      // 更新连线文字位置
      edgesText.attr('transform', (d, i) => {
        return 'rotate(0)';
      });

      nodesCircle.on('click', (node) => {
        that.setState({selected: node})
        edgesLine.style("stroke-width", function (line) {
          if (line.source.name === node.name || line.target.name === node.name) {
            return 8;
          } else {
            return 2;
          }
        });
      })
      edgesLine.on('click', (node) => {
        that.setState({selected: node})
      })
    });
  }

  render() {
    const {selected} = this.state
    const renderElement = (element) => {
      return [<div className={styles.box} key={0}
                   style={{background: colors[element.type ? element.type.charCodeAt(0) % 10 : 0]}}/>,
        <div className={styles.name} key={1}>{element.name}</div>,
        <div className={styles.type} key={2}>{element.type}</div>,
        <div key={3}>
          <Link to={`/detail/id/${element.id}`}>GOTO</Link>&nbsp;&nbsp;&nbsp;
          <Link to={`/similar/${element.id}`}>SIMILAR</Link>
        </div>,
      ]
    }
    const renderSelected = (selected) => {
      if (selected.source)
        return (
          <div className={styles.selectedNode}>
            {renderElement(selected.source)}
            <div className={styles.relation}>{selected.tag}</div>
            {renderElement(selected.target)}
          </div>
        )
      return (
        <div className={styles.selectedNode}>
          {renderElement(selected)}
        </div>
      )
    }

    return (
      <Row style={{width: '100%'}}>
        <div className={styles.outer}>
          <div className="theChart" id="theChart" ref="theChart">
          </div>
          <div className={styles.toolbar}>
            {selected ? renderSelected(selected) : (
              <div className={styles.selectedNode}>
                <div className={styles.box}
                     style={{background: 'black'}}/>
                <div className={styles.name}>{this.props.title}</div>
              </div>
            )}
            {this.props.menu}
          </div>
        </div>
      </Row>
    );
  }
}

export default Chart;
