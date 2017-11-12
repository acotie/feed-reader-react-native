import React from 'react';
import { StyleSheet, Text, TextInput, ListView, View, Image, WebView, TouchableOpacity, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';
var REQUEST_XML_URL = 'http://www.wsj.com/xml/rss/3_7085.xml';
var MOCKED_MOVIES_DATA = [
    {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
    {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
    {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];
var movie = MOCKED_MOVIES_DATA[0];

var styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 100,
    height: 70,
  },
  rightContainer: {
    paddingLeft: 5,
    paddingRight:5,
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'left',
  },
  description: {
    fontSize: 12,
    textAlign: 'left',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  }
});


export default class App extends React.Component {

  constructor(props){
      super(props);
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        loaded: false,
        text: REQUEST_XML_URL,
      };
  }

  componentDidMount() {
    this.fetchData(REQUEST_XML_URL);
  }

  reloadURL(NEW_URL) {
    //this.setState({loaded: false});
    this.fetchData(NEW_URL);
  }
  
  fetchData(URL) {
    const targetURL = 'https://api.rss2json.com/v1/api.json?rss_url=';
    
    fetch(targetURL + URL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);

        this.setState({
          //movies: responseData.movies,
          dataSource: this.state.dataSource.cloneWithRows(responseData.items),
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    //var movie = this.state.movies[0];
    return (
      //this.renderMovie(movie);
      <View>
        <SearchBar
          round
          onChangeText={(text) => this.setState({text})}
          onClearText={(text) => this.setState({text})}
          onEndEditing={ () => this.onPressLearnMore(this.state.text) }
          placeholder={"Type URL Here..."}
        />
        <ListView
          dataSource={this.state.dataSource}
          //renderRow={this.renderMovie}
          renderRow={this.renderFeed}
          style={styles.ListView}
        />
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading Feed...
        </Text>
      </View>
    );
  }

  renderFeed(item) {
    return (
      <TouchableOpacity onPress={() => {Alert.alert(item.title, item.description)}}>
        <View style={styles.container}>
          <Image
            source={{uri: item.enclosure.link}}
            style={styles.thumbnail}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }


  onPressLearnMore(text) {
    console.log(text);
    this.reloadURL(text);
  }

}


