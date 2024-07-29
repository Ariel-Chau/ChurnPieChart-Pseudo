import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ChurnPieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.(ref.current)
      .attr('width', 400)
      .attr('height', 400)
      .append('g')
      .attr('transform', 'translate(200,200)');

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data.category);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default ;
