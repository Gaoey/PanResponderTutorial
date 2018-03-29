import React, { Component } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  TouchableOpacity,
  Text,
  Dimensions,
  Button
} from "react-native";

const { width, height } = Dimensions.get("window")
const videoHeight = width * 0.5625;
const videoWidth = width * 0.45
const minimumScreenX = 0
const minimumScreenY = 0
const middleScreenX = width / 2
const middleScreenY = height / 2
const maxScreenX = width
const maxScreenY = height
const corner = {
  topLeft: { x: 0, y: 0 },
  topRight: { x: width - videoWidth, y: 0 },
  bottomLeft: { x: 0, y: height - videoHeight },
  bottomRight: { x: width - videoWidth, y: height - videoHeight },
}

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      width,
      height,
      isFullScreen: true,
      pan: new Animated.ValueXY({ x: 0, y: 0 }),
    }
    this.selectWhichCorner = this.selectWhichCorner.bind(this)
    this.updateVideoSize = this.updateVideoSize.bind(this)

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y },
      ]),

      onPanResponderRelease: (e, { vx, vy }) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
        Animated.spring(this.state.pan, {
          toValue: this.selectWhichCorner(),
          friction: 5
        }).start();
      }
    });
  }

  selectWhichCorner() {
    const { pan } = this.state;
    const middleComponentX = (pan.x._value + videoWidth) / 2
    const middleComponentY = (pan.y._value + videoHeight) / 2
    // select quadrant
    const QuantdrantOne = (middleComponentX >= minimumScreenX && middleComponentX <= middleScreenX) && (middleComponentY >= minimumScreenY && middleComponentY <= middleScreenY)
    const QuandrantTwo = (middleComponentX >= middleScreenX && middleComponentX <= maxScreenX) && (middleComponentY >= minimumScreenY && middleComponentY <= middleScreenY)
    const QuandrantThree = (middleComponentX >= minimumScreenX && middleComponentX <= middleScreenX) && (middleComponentY >= middleScreenY && middleComponentY <= maxScreenY)
    const QuandrantFour = (middleComponentX >= middleScreenX && middleComponentX <= maxScreenX) && (middleComponentY >= middleScreenY && middleComponentY <= maxScreenY)

    if (QuantdrantOne) {
      return corner.topLeft
    } else if (QuandrantTwo) {
      return corner.topRight
    } else if (QuandrantThree) {
      return corner.bottomLeft
    } else if (QuandrantFour) {
      return corner.bottomRight
    }
  }

  updateVideoSize() {
    if (this.state.isFullScreen) {
      this.state.pan.setValue({ x: width - videoWidth, y: 0 })
      this.setState({
        isFullScreen: false,
        width: videoWidth,
        height: videoHeight
      })
    } else {
      this.state.pan.setValue({ x: 0, y: 0 })
      this.setState({
        isFullScreen: true,
        width: width,
        height: height
      })
    }
  }

  render() {
    let { pan, height, width, isFullScreen } = this.state
    let imageStyle = { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <Text>Background View</Text>
        </TouchableOpacity>
        <View style={styles.absoluteFill}>
          {
            isFullScreen
              ? <View style={[styles.absoluteFill, styles.box]} >
                  <Button
                    onPress={() => this.updateVideoSize()}
                    title={isFullScreen ? "let small screen" : "let full screen"} />
                  Video component here
                </View>
              : <Animated.View
                {...this._panResponder.panHandlers}
                style={[{
                  height,
                  width
                }, imageStyle]}>
                <View style={[styles.absoluteFill, styles.box]} >
                  <Button
                    onPress={() => this.updateVideoSize()}
                    title={isFullScreen ? "let small screen" : "let full screen"}
                  />
                  Video component here
             </View>
              </Animated.View>
          }
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  absoluteFill: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  normalFill: {
    flex: 1
  },
  box: {
    backgroundColor: 'black'
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFF",
  },
})

// ------------------------ Youtube Component ---------------- //
// import React, { Component } from "react";
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
//   PanResponder,
//   Animated,
// } from "react-native";

// const { width, height: screenHeight } = Dimensions.get("window");
// const height = width * 0.5625;

// export default class App extends Component {

//   constructor(props) {
//     super(props)
//     this._y = 0;
//     this._animation = new Animated.Value(0);
//     this._animation.addListener(({ value }) => {
//       console.log('in addListener', value)
//       this._y = value;
//     })

//     this._panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event([
//         null,
//         {
//           dy: this._animation
//         },
//       ]),
//       onPanResponderRelease: (e, gestureState) => {
//         console.log('onPanResponderRelease ', gestureState)
//         if (gestureState.dy > 100) {
//           console.log('a')
//           Animated.timing(this._animation, {
//             toValue: 300,
//             duration: 200,
//           }).start();
//           this._animation.setOffset(300);
//         } else {
//           console.log('b')
//           this._animation.setOffset(0);
//           Animated.timing(this._animation, {
//             toValue: 0,
//             duration: 200,
//           }).start();
//         }
//       },
//     })
//   }

//   render() {
//     const opacityInterpolate = this._animation.interpolate({
//       inputRange: [0, 300],
//       outputRange: [1, 0],
//     })

//     const translateYInterpolate = this._animation.interpolate({
//       inputRange: [0, 300],
//       outputRange: [0, screenHeight - height + 40],
//       extrapolate: "clamp",
//     })

//     const scaleInterpolate = this._animation.interpolate({
//       inputRange: [0, 300],
//       outputRange: [1, 0.5],
//       extrapolate: "clamp",
//     })

//     const translateXInterpolate = this._animation.interpolate({
//       inputRange: [0, 300],
//       outputRange: [0, 85],
//       extrapolate: "clamp",
//     })
//     const scrollStyles = {
//       opacity: opacityInterpolate,
//       transform: [
//         {
//           translateY: translateYInterpolate,
//         },
//       ],
//     }

//     const videoStyles = {
//       transform: [
//         {
//           translateY: translateYInterpolate,
//         },
//         {
//           translateX: translateXInterpolate,
//         },
//         {
//           scale: scaleInterpolate,
//         },
//       ],
//     }

//     console.log('videoStyle', videoStyles)
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity>
//           <Text>Background View</Text>
//         </TouchableOpacity>

//         <View style={styles.absoluteFill}>
//           {
//             this._panResponder && (
//               <Animated.View
//                 style={[{ width, height }, videoStyles]}
//                 {...this._panResponder.panHandlers}>
//                 <View style={[StyleSheet.absoluteFill, styles.box]} >
//                   xxx
//             </View>
//               </Animated.View>
//             )
//           }
//         </View>

//       </View >
//     )
//   }
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   absoluteFill: {
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     position: 'absolute'
//   },
//   box: {
//     backgroundColor: 'black'
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#FFF",
//   },
// });

