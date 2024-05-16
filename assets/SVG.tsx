import React from 'react';
import {SvgXml} from 'react-native-svg';
import Svg, {Polyline, Rect, Circle, G, Path} from 'react-native-svg';

export function CameraIcon({
  width,
  height,
  color,
  style,
}: {
  width: number;
  height: number;
  color: string;
  style?: any;
}): JSX.Element {
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
      <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
    </svg>
  `;

  return (
    <SvgXml
      color={color}
      style={style}
      xml={svgMarkup}
      width={width}
      height={height}
    />
  );
}
export const Uparrow = ({
  color,
  width,
  height,
}: {
  color: string;
  width: number;
  height: number;
}) => (
  <Svg
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 256 256"
    width={width}
    height={height}
    enableBackground="new 0 0 256 256"
    xmlSpace="preserve">
    <G>
      <G>
        <G>
          <Path
            strokeWidth="1"
            fillOpacity="1"
            stroke={color}
            fill={color}
            d="M123.1,11.1c-3.1,1.7-75.5,76.4-76.9,79.3c-2.1,4.3-0.7,9.7,3.2,13.1
            c4.5,3.9,11.1,3.8,15.3-0.3c1.2-1.2,13.4-13.8,27.2-28l25.1-25.8l0.3,94.1c0.3,103.9,0,95.5,3.9,99.1c2.9,2.7,5.2,3.6,8.9,3.3
            c4.1-0.3,7.5-2.5,9.5-6.2l1.3-2.5v-92.4c0-50.8,0.2-92.4,0.3-92.4c0.2,0,11.9,11.4,26,25.4c22.9,22.6,26,25.4,28.5,26.3
            c5,1.7,10.5-0.2,13.5-4.6c1.4-2.1,1.6-2.8,1.6-6.7c0-3.9-0.2-4.7-1.4-6.5c-2.3-3.2-74.7-73.8-76.8-74.9
            C129.3,9.6,125.9,9.5,123.1,11.1z"
          />
        </G>
      </G>
    </G>
  </Svg>
);
export function GalleryIcon(props: anny) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill={'red'}
      viewBox="0 0 24 24"
      {...props}>
      <Polyline
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        points="22.41 19.41 17 14 14.5 16.5"
      />
      <Polyline
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        points="18 20 9.5 11.5 1.59 19.41"
      />
      <Rect
        width={22}
        height={16}
        x={1}
        y={4}
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        rx={2}
        ry={2}
      />
      <Circle
        cx={17}
        cy={9}
        r={1}
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}
