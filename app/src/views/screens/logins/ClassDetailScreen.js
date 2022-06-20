import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  // Text,
  Image,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  TextInput,
  Text,
  Button,
  Snackbar,
  Headline,
  Paragraph,
  FAB,
  Dialog,
  Badge,
  ActivityIndicator
} from 'react-native-paper';
import COLORS from '../../../consts/colors';
import base_url from '../../../consts/base_url';
import image_url from '../../../consts/image_url';
import STYLES from '../../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ClassDetailScreen({route, navigation}) {
  const {item} = route.params;
  // console.log(item);

  // fabs
  const [state, setState] = useState({open: false});

  const onStateChange = ({open}) => setState({open});

  const {open} = state;
  // fabs end
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [userList, setUserList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [displayEmail, setdisplayEmail] = useState('none');

  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  // snackbar

  const [visible, setVisible] = useState(false);
  const [snackbarValue, setsnackbarValue] = useState({value: '', color: ''});
  const onDismissSnackBar = () => setVisible(false);

  // login api call
  const [loading, setloading] = useState(0);
  const [disable, setdisable] = useState(0);

  // check logins
  const [login, setlogin] = useState(1);

  // check logins end

  // rb sheets
  const refRBSheet = useRef();
  const refRBSheet2 = useRef();

  // get object values from async storage
  const getData = async () => {
    await AsyncStorage.getItem('resturantDetail').then(value => {
      var x = JSON.parse(value);

      // splitString(x.fullname);
      setUsername(x.fullname);
      setUserid(x.id);
      getClasses(x.id);
    });
  };
  // store objcet values in async storage end
  // flat lsit

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        paddingVertical: 5,
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <Text>Name : {item.fullname}</Text>
        <Text>Email : {item.email}</Text>
        <Text>Address: {item.address}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <Text>
          Current Status :{' '}
          {item.status != 'notapprove' ? 'Approve' : 'Not Approved'}
        </Text>
        {item.status == 'notapprove' ? (
          <TouchableOpacity
          onPress={() => {
            approve(item.id);
          }}
          >
            <Badge>Approve Now</Badge>
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={{
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          paddingVertical: 10,
          borderBottomColor: COLORS.greylight,
        }}></View>
    </View>
  );

  const getAllUsers = id => {
    // setloading(true);

    var InsertAPIURL = base_url + '/class/getAllAppliedUsers.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var Data = {
      classid: item.id,
    };
    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        setUserList(response);

        console.log(response);
      })
      .catch(error => {
        alert('error' + error);
      });
  };
  // get alll videos
  

  // add user
  const approve = (applied_id) => {
    
    setloading(1);
    setdisable(1);
    var InsertAPIURL = base_url + '/class/approveJob.php';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var Data = {
      applied_id:applied_id,
  
    };
    fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Data),
    })
      .then(response => response.json())
      .then(response => {
        // refRBSheet.current.close();
        getAllUsers();
        console.log(response);
        setloading(0);
        setdisable(0);
      })
      .catch(error => {
        alert('error' + error);
      });
  };
 
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    // <ScrollView>
    <View
      style={{
        // marginHorizontal: '4%',
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
    
      
      {
        loading == 1 ? (
          <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >

            <ActivityIndicator 
          animating={loading}
          color={COLORS.primary}
          size="large"
          />
          </View>
        ) : 
        <FlatList
        data={userList}
        ListHeaderComponent={() => (
          <SafeAreaView>
            <Snackbar
              duration={200}
              visible={visible}
              onDismiss={onDismissSnackBar}
              action={
                {
                  // label: 'Undo',
                  // onPress: () => {
                  //   // Do something
                  // },
                }
              }
              style={{
                backgroundColor: snackbarValue.color,
                marginBottom: height / 4,
                zIndex: 999,
              }}>
              {snackbarValue.value}
            </Snackbar>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="arrow-left" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 17,
                }}>
                My Job Detail
              </Text>
            </View>
            <View
              style={{
                felxDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  width: '100%',
                }}>
                <FastImage
                  style={{
                    width: '100%',
                    height: 200,
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: image_url + '/' + item.image,

                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'column',
                // marginHorizontal: '5%',
                justifyContent: 'center',
              }}>
              <TextInput
                label="Class Name"
                mode="flat"
                style={{backgroundColor: COLORS.white, borderRadius: 40}}
                activeOutlineColor={COLORS.primary}
                activeUnderlineColor={COLORS.primary}
                value={item.name}
                disabled={true}
                onChangeText={e => {
                  setclassName(e);
                }}
              />
              <TextInput
                label="Class Description"
                mode="flat"
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 40,
                  textAlignVertical: 'top',
                }}
                activeOutlineColor={COLORS.primary}
                activeUnderlineColor={COLORS.primary}
                multiline={true}
                clearTextOnFocus={true}
                value={item.description}
                disabled={true}
                onChangeText={e => {
                  setDescription(e);
                }}
              />
            </View>
            <Headline
              style={{
                paddingHorizontal: '3%',
              }}>
              Applied Student List
            </Headline>
          </SafeAreaView>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              height: height / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: COLORS.pink,
            }}>
            <Text
              style={{
                color: COLORS.light,
              }}>
              No Student Applied
            </Text>
          </View>
        )}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{
          marginHorizontal: '4%',
          backgroundColor: COLORS.white,
        }}
      />
      }
        
      
    </View>
  );
}

export default ClassDetailScreen;
