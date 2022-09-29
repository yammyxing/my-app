import React from "react";
import { Dimensions, ScrollView, Text } from "react-native";
import FlashMessage, {
  showMessage
} from "react-native-flash-message";

import { data } from "./data";
import LineChart from "./components/line-chart";

// in Expo - swipe left to see the following styling, or create your own
const chartConfig = {
  backgroundColor: "#000000",
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export default function App() {
  const { width } = Dimensions.get("window");
  const height = 256;

  const labelStyle = {
    color: chartConfig.color(),
    marginVertical: 10,
    textAlign: "center",
    fontSize: 16,
  };
  const graphStyle = {
    marginVertical: 8,
    ...chartConfig.style,
  };

  return (
    <ScrollView
      key={Math.random()}
      style={{
        backgroundColor: chartConfig.backgroundColor,
      }}
    >
      <Text style={labelStyle}>Bezier Line Chart</Text>
      <LineChart
        bezier
        data={data}
        width={width}
        height={height}
        yAxisLabel="$"
        yAxisSuffix="k"
        chartConfig={chartConfig}
        style={graphStyle}
        verticalLabelRotation={20}
        onDataPointClick={({ value, getColor }) =>
          showMessage({
            message: `${value}`,
            description: "You selected this value",
            backgroundColor: getColor(0.9),
          })
        }
        formatXLabel={(label) => label.toUpperCase()}
      />
      <FlashMessage duration={1000} />
      <Text style={labelStyle}>Line Chart</Text>
      <LineChart
        data={data}
        width={width}
        height={height}
        yAxisLabel="$"
        chartConfig={chartConfig}
        style={graphStyle}
      />
      <Text style={labelStyle}>Line Chart</Text>
      <LineChart
        data={data}
        width={width}
        height={height}
        yAxisLabel="$"
        segments={5}
        chartConfig={chartConfig}
        style={graphStyle}
        hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
      />
      <Text style={labelStyle}>
        Line Chart with shadow background as line color
      </Text>
      <LineChart
        bezier
        data={data}
        width={width}
        height={height}
        yAxisLabel="$"
        segments={5}
        chartConfig={{
          ...chartConfig,
          useShadowColorFromDataset: true,
        }}
        style={graphStyle}
        hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
      />

      <Text style={labelStyle}>Scrollable Line Chart</Text>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        withInnerLines={false}
        withDots={false}
        withShadow={false}
        withScrollableDot={true}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundGradientFrom: "#1F1F1F",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => "#FF5500",
          labelColor: (opacity = 1) => "#A0A0A0",
          linejoinType: "round",

          scrollableDotFill: "#fff",
          scrollableDotRadius: 6,
          scrollableDotStrokeColor: "#FF5500",
          scrollableDotStrokeWidth: 3,

          scrollableInfoViewStyle: {
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "#121212",
            borderRadius: 2,
          },
          scrollableInfoTextStyle: {
            color: "#C4C4C4",
            marginHorizontal: 4,
            flex: 1,
            textAlign: "center",
          },
          scrollableInfoSize: { width: 65, height: 30 },
          scrollableInfoOffset: 15,
        }}
        style={{
          marginVertical: 8,
        }}
      />
    </ScrollView>
  );
}
