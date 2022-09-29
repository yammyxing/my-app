import React, { Component } from "react";
import { Defs, Line, LinearGradient, Stop, Text } from "react-native-svg";
export const DEFAULT_X_LABELS_HEIGHT_PERCENTAGE = 0.75;
class AbstractChart extends Component {
  constructor() {
    super(...arguments);
    this.calcScaler = (data) => {
      if (this.props.fromZero && this.props.fromNumber) {
        return (
          Math.max(...data, this.props.fromNumber) - Math.min(...data, 0) || 1
        );
      } else if (this.props.fromZero) {
        return Math.max(...data, 0) - Math.min(...data, 0) || 1;
      } else if (this.props.fromNumber) {
        return (
          Math.max(...data, this.props.fromNumber) -
            Math.min(...data, this.props.fromNumber) || 1
        );
      } else {
        return Math.max(...data) - Math.min(...data) || 1;
      }
    };
    this.calcBaseHeight = (data, height) => {
      const min = Math.min(...data);
      const max = Math.max(...data);
      if (min >= 0 && max >= 0) {
        return height;
      } else if (min < 0 && max <= 0) {
        return 0;
      } else if (min < 0 && max > 0) {
        return (height * max) / this.calcScaler(data);
      }
    };
    this.calcHeight = (val, data, height) => {
      const max = Math.max(...data);
      const min = Math.min(...data);
      if (min < 0 && max > 0) {
        return height * (val / this.calcScaler(data));
      } else if (min >= 0 && max >= 0) {
        return this.props.fromZero
          ? height * (val / this.calcScaler(data))
          : height * ((val - min) / this.calcScaler(data));
      } else if (min < 0 && max <= 0) {
        return this.props.fromZero
          ? height * (val / this.calcScaler(data))
          : height * ((val - max) / this.calcScaler(data));
      }
    };
    this.renderHorizontalLines = (config) => {
      const {
        count,
        width,
        height,
        paddingTop,
        paddingLeft,
        paddingRight,
        verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
      } = config;
      const basePosition = height * verticalLabelsHeightPercentage;
      return [...new Array(count + 1)].map((_, i) => {
        const y = (basePosition / count) * i + paddingTop;
        return (
          <Line
            key={Math.random()}
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            {...this.getPropsForBackgroundLines()}
          />
        );
      });
    };
    this.renderHorizontalLine = (config) => {
      const {
        width,
        height,
        paddingTop,
        paddingLeft,
        paddingRight,
        verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
      } = config;
      return (
        <Line
          key={Math.random()}
          x1={paddingLeft}
          y1={height * verticalLabelsHeightPercentage + paddingTop}
          x2={width - paddingRight}
          y2={height * verticalLabelsHeightPercentage + paddingTop}
          {...this.getPropsForBackgroundLines()}
        />
      );
    };
    this.renderHorizontalLabels = (config) => {
      const {
        count,
        data,
        height,
        width,
        paddingTop,
        paddingLeft,
        horizontalLabelRotation = 0,
        decimalPlaces = 2,
        formatYLabel = (yLabel) => yLabel,
        verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
      } = config;
      const {
        yAxisLabel = "",
        yAxisSuffix = "",
        yLabelsOffset = 12,
      } = this.props;
      return new Array(count === 1 ? 1 : count + 1).fill(1).map((_, i) => {
        let yLabel = String(i * count);
        if (count === 1) {
          yLabel = `${yAxisLabel}${formatYLabel(
            data[0].toFixed(decimalPlaces)
          )}${yAxisSuffix}`;
        } else {
          const label = this.props.fromZero
            ? (this.calcScaler(data) / count) * i + Math.min(...data, 0)
            : (this.calcScaler(data) / count) * i + Math.min(...data);
          yLabel = `${yAxisLabel}${formatYLabel(
            label.toFixed(decimalPlaces)
          )}${yAxisSuffix}`;
        }
        const basePosition = height * verticalLabelsHeightPercentage;
        const x = width - yLabelsOffset;
        const y =
          count === 1 && this.props.fromZero
            ? paddingTop + 4
            : height * verticalLabelsHeightPercentage -
              (basePosition / count) * i +
              paddingTop;
        return (
          <Text
            rotation={horizontalLabelRotation}
            origin={`${x}, ${y}`}
            key={Math.random()}
            x={x}
            textAnchor="end"
            y={y}
            {...this.getPropsForLabels()}
            {...this.getPropsForHorizontalLabels()}
          >
            {yLabel}
          </Text>
        );
      });
    };
    this.renderVerticalLabels = ({
      labels = [],
      width,
      height,
      paddingLeft,
      paddingTop,
      horizontalOffset = 0,
      stackedBar = false,
      verticalLabelRotation = 0,
      formatXLabel = (xLabel) => xLabel,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
    }) => {
      const {
        xAxisLabel = "",
        xLabelsOffset = 0,
        hidePointsAtIndex = [],
      } = this.props;
      const fontSize = 12;
      let fac = 1;
      if (stackedBar) {
        fac = 0.71;
      }
      return labels.map((label, i) => {
        if (hidePointsAtIndex.includes(i)) {
          return null;
        }
        const x =
          (((width - paddingLeft) / labels.length) * i +
            paddingLeft +
            horizontalOffset) *
          fac;
        const y =
          height * verticalLabelsHeightPercentage +
          paddingTop +
          fontSize * 2 +
          xLabelsOffset;
        return (
          <Text
            origin={`${x}, ${y}`}
            rotation={verticalLabelRotation}
            key={Math.random()}
            x={x}
            y={y}
            textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
            {...this.getPropsForLabels()}
            {...this.getPropsForVerticalLabels()}
          >
            {`${formatXLabel(label)}${xAxisLabel}`}
          </Text>
        );
      });
    };
    this.renderVerticalLines = ({
      data,
      width,
      height,
      paddingTop,
      paddingLeft,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
    }) => {
      const { yAxisInterval = 1 } = this.props;
      return [...new Array(Math.ceil(data.length / yAxisInterval))].map(
        (_, i) => {
          return (
            <Line
              key={Math.random()}
              x1={Math.floor(
                ((width - paddingLeft) / (data.length / yAxisInterval)) * i +
                  paddingLeft
              )}
              y1={0}
              x2={Math.floor(
                ((width - paddingLeft) / (data.length / yAxisInterval)) * i +
                  paddingLeft
              )}
              y2={height * verticalLabelsHeightPercentage + paddingTop}
              {...this.getPropsForBackgroundLines()}
            />
          );
        }
      );
    };
    this.renderVerticalLine = ({
      height,
      paddingTop,
      paddingLeft,
      verticalLabelsHeightPercentage = DEFAULT_X_LABELS_HEIGHT_PERCENTAGE,
    }) => (
      <Line
        key={Math.random()}
        x1={Math.floor(paddingLeft)}
        y1={0}
        x2={Math.floor(paddingLeft)}
        y2={height * verticalLabelsHeightPercentage + paddingTop}
        {...this.getPropsForBackgroundLines()}
      />
    );
    this.renderDefs = (config) => {
      const {
        width,
        height,
        backgroundGradientFrom,
        backgroundGradientTo,
        useShadowColorFromDataset,
        data,
      } = config;
      const fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
        ? config.backgroundGradientFromOpacity
        : 1.0;
      const toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
        ? config.backgroundGradientToOpacity
        : 1.0;
      const fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
        ? config.fillShadowGradient
        : this.props.chartConfig.color(1.0);
      const fillShadowGradientOpacity = config.hasOwnProperty(
        "fillShadowGradientOpacity"
      )
        ? config.fillShadowGradientOpacity
        : 0.1;
      const fillShadowGradientFrom = config.hasOwnProperty(
        "fillShadowGradientFrom"
      )
        ? config.fillShadowGradientFrom
        : fillShadowGradient;
      const fillShadowGradientFromOpacity = config.hasOwnProperty(
        "fillShadowGradientFromOpacity"
      )
        ? config.fillShadowGradientFromOpacity
        : fillShadowGradientOpacity;
      const fillShadowGradientFromOffset = config.hasOwnProperty(
        "fillShadowGradientFromOffset"
      )
        ? config.fillShadowGradientFromOffset
        : 0;
      const fillShadowGradientTo = config.hasOwnProperty("fillShadowGradientTo")
        ? config.fillShadowGradientTo
        : this.props.chartConfig.color(1.0);
      const fillShadowGradientToOpacity = config.hasOwnProperty(
        "fillShadowGradientToOpacity"
      )
        ? config.fillShadowGradientToOpacity
        : 0.1;
      const fillShadowGradientToOffset = config.hasOwnProperty(
        "fillShadowGradientToOffset"
      )
        ? config.fillShadowGradientToOffset
        : 1;
      return (
        <Defs>
          <LinearGradient
            id="backgroundGradient"
            x1={0}
            y1={height}
            x2={width}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0"
              stopColor={backgroundGradientFrom}
              stopOpacity={fromOpacity}
            />
            <Stop
              offset="1"
              stopColor={backgroundGradientTo}
              stopOpacity={toOpacity}
            />
          </LinearGradient>
          {useShadowColorFromDataset ? (
            data.map((dataset, index) => (
              <LinearGradient
                id={`fillShadowGradientFrom_${index}`}
                key={`${index}`}
                x1={0}
                y1={0}
                x2={0}
                y2={height}
                gradientUnits="userSpaceOnUse"
              >
                <Stop
                  offset={fillShadowGradientFromOffset}
                  stopColor={
                    dataset.color ? dataset.color(1.0) : fillShadowGradientFrom
                  }
                  stopOpacity={fillShadowGradientFromOpacity}
                />
                <Stop
                  offset={fillShadowGradientToOffset}
                  stopColor={
                    dataset.color
                      ? dataset.color(fillShadowGradientFromOpacity)
                      : fillShadowGradientFrom
                  }
                  stopOpacity={fillShadowGradientToOpacity || 0}
                />
              </LinearGradient>
            ))
          ) : (
            <LinearGradient
              id="fillShadowGradientFrom"
              x1={0}
              y1={0}
              x2={0}
              y2={height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset={fillShadowGradientFromOffset}
                stopColor={fillShadowGradientFrom}
                stopOpacity={fillShadowGradientFromOpacity}
              />
              <Stop
                offset={fillShadowGradientToOffset}
                stopColor={fillShadowGradientTo || fillShadowGradientFrom}
                stopOpacity={fillShadowGradientToOpacity || 0}
              />
            </LinearGradient>
          )}
        </Defs>
      );
    };
  }
  getPropsForBackgroundLines() {
    const { propsForBackgroundLines = {} } = this.props.chartConfig;
    return {
      stroke: this.props.chartConfig.color(0.2),
      strokeDasharray: "5, 10",
      strokeWidth: 1,
      ...propsForBackgroundLines,
    };
  }
  getPropsForLabels() {
    const {
      propsForLabels = {},
      color,
      labelColor = color,
    } = this.props.chartConfig;
    return {
      fontSize: 12,
      fill: labelColor(0.8),
      ...propsForLabels,
    };
  }
  getPropsForVerticalLabels() {
    const {
      propsForVerticalLabels = {},
      color,
      labelColor = color,
    } = this.props.chartConfig;
    return {
      fill: labelColor(0.8),
      ...propsForVerticalLabels,
    };
  }
  getPropsForHorizontalLabels() {
    const {
      propsForHorizontalLabels = {},
      color,
      labelColor = color,
    } = this.props.chartConfig;
    return {
      fill: labelColor(0.8),
      ...propsForHorizontalLabels,
    };
  }
}
export default AbstractChart;
