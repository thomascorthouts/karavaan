import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, BackHandler, Alert, AsyncStorage } from 'react-native';
import { GroupItem } from '../../components/GroupFeedItem';

class Groups extends Component<IDefaultNavProps, IGroupState> {
  state = { 
    groupArray: [] as GroupList,
    isLoading: true
  };
  
  constructor(props: IDefaultNavProps, state: IGroupState){
    super(props, state);
  }
  
  render() {
    const { navigate } = this.props.navigation;

    let groups = this.state.groupArray.map((val,key) => {
      return <GroupItem key={key} keyval={key} val={val} viewDetails={() => this.viewDetails(key)} />;
    });

    return (
      <View style = {styles.container}>
        <ScrollView style = {styles.ScrollContainer}>
          {groups}
        </ScrollView>
        <KeyboardAvoidingView behavior = 'padding' style={styles.footer} >
          <TouchableOpacity onPress={ () => this.props.navigation.navigate('AddGroup', {})} style={styles.addButton}> 
            <Text style={styles.addButtonText}> + </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }

  viewDetails(key:number) {
    
  }

  addGroup(group: Group){
    this.state.groupArray.push({ 'name': group.name, 'date': group.date, 'personArray': group.personArray});
    this.setState({ groupArray: this.state.groupArray});
    
  }
  componentDidMount(){
    AsyncStorage.getItem('groups')
      .then((value) => {
        if (value !== null) {
          this.setState({
            groupArray: JSON.parse(value)
          });
        };
      });

      this.setState({
        isLoading: false
      });
  }
}


export default Groups;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    ScrollContainer: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0
    },
    addButton: {
        backgroundColor: '#287E6F',
        width: 90,
        height: 90,
        borderRadius: 50,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        zIndex: 10
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 24
    }
});