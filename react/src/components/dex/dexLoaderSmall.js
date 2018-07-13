import React from 'react';

class DexLoaderSmall extends React.Component {
  render() {
    return (
      <span
        className="coinList-coin_action_loader"
        style={{ opacity: '1', width: '86px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-flickr" style={{ background: 'none' }}>
          <circle ng-attr-cx="{{config.cx1}}" cy="50" ng-attr-fill="{{config.c1}}" ng-attr-r="{{config.radius}}" cx="54.6667" fill="#FFF" r="20">
            <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="2" begin="-1s" repeatCount="indefinite"></animate>
          </circle>
          <circle ng-attr-cx="{{config.cx2}}" cy="50" ng-attr-fill="{{config.c2}}" ng-attr-r="{{config.radius}}" cx="45.3333" fill="#000" r="20">
            <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="2" begin="0s" repeatCount="indefinite"></animate>
          </circle>
          <circle ng-attr-cx="{{config.cx1}}" cy="50" ng-attr-fill="{{config.c1}}" ng-attr-r="{{config.radius}}" cx="54.6667" fill="#FFF" r="20">
            <animate attributeName="cx" calcMode="linear" values="30;70;30" keyTimes="0;0.5;1" dur="2" begin="-1s" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" values="0;0;1;1" calcMode="discrete" keyTimes="0;0.499;0.5;1" ng-attr-dur="{{config.speed}}s" repeatCount="indefinite" dur="2s"></animate>
          </circle>
        </svg>
      </span>
    );
  }
}

export default DexLoaderSmall;