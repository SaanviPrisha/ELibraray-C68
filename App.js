import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import TransactionScreen from './Screens/TransactionScreen'
import SearchScreen from './Screens/SearchScreen'
import { Image } from 'react-native'

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}

const tabNavigator = createBottomTabNavigator({
  Transaction: {screen: TransactionScreen},
  Search: {screen: SearchScreen},
}, {
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: () => {
      var routeName = navigation.state.routeName
      if(routeName == "Transaction") {
        return(
          <Image style={{width: 40,height: 40}}source={require('./assets/book.png')}></Image>
        )
      } else if(routeName == "Search") {
        return(
          <Image style={{width: 40,height: 40}} source={require('./assets/searchingbook.png')}></Image>
        )
      }
    }
  }) 
}

)

const AppContainer = createAppContainer(tabNavigator)
