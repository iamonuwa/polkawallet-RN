import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Picker,
  AsyncStorage,
} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import Keyring from '@polkadot/keyring'
import { mnemonicToSeed, mnemonicValidate, naclKeypairFromSeed, randomAsU8a,randomAsHex } from '@polkadot/util-crypto';

import { hexToU8a, isHex, stringToU8a, u8aToHex }  from '@polkadot/util'
import { type } from 'os';
// import Keyring from '@polkadot/keyring'
const keyring = new Keyring();
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Polkawallet extends Component {
  constructor(props)
  {
    super(props)
    this.json
    this.pair
    this.state={
      way:'Mnemonic',
      way_change:'Mnemonic',
      isModel:false,
      key:'',
      name:'',
      password:'',
      address:'xxxxxxxxxxxxxxxxxxxxxxxx'
    }
    this.Save_Account=this.Save_Account.bind(this)
    this.onChangekey=this.onChangekey.bind(this)
    this.onChangename=this.onChangename.bind(this)
    this.onChangepassword=this.onChangepassword.bind(this)

    this.Reset=this.Reset.bind(this)

  }
  onChangekey(Changekey){
    
    SEED=Changekey.padEnd(32,' ')
    SEEDu8a = stringToU8a(SEED)
    this.pair = keyring.addFromSeed(SEEDu8a)
    
    this.setState({
      key:Changekey,
      address:this.pair.address()
    }) 
  }
  onChangename(Changename){
    this.setState({
      name:Changename
    }) 
  }
  onChangepassword(Changepassword){
    this.setState({
      password:Changepassword
    }) 
  }
  Reset(){
    alert(this.props.t.state.isfirst)
  }
  Save_Account(){
    // alert(this.pair.address())
    this.pair.setMeta({'name':this.state.name})
    this.json = this.pair.toJson(this.state.password)
    this.json.meta = this.pair.getMeta()
    SInfo.setItem(this.state.address, JSON.stringify(this.json),{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'});  
    this.props.rootStore.stateStore.isfirst=1
    this.props.navigation.navigate('Backup_Account')
    this.props.rootStore.stateStore.Accounts.push({account:this.state.name,address:this.pair.address()})
  }
  render() {
    return (
      <View style={styles.container}>
        {/* 标题栏 */}
        <View style={styles.title}>
          <TouchableOpacity
            onPress={()=>{
              this.props.navigation.navigate('Tabbed_Navigation')
            }}
          >
            <Image
              style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,resizeMode:'contain'}}
              source={require('../../../images/Assetes/Create_Account/back.png')}
              />
          </TouchableOpacity>
          <Text style={styles.text_title}>Create Account</Text>
          <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35}}/>
    
        </View>
        <ScrollView>
          <View style={{height:ScreenHeight/3.5,alignItems:'center'}}>
              {/* 头像 */}
              <View style={[styles.imageview]}>
                <Image
                  style={styles.image}
                  source={require('../../../images/Assetes/accountIMG.png')}
                />
              </View>
              {/* 地址 */}
              <View style={styles.address_text}>
                <Text 
                  style={{width:ScreenWidth/2.5,fontSize:ScreenHeight/40,color:'#171717',}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >
                  {this.state.address}
                </Text>
              </View>
              <Text style={styles.text1}>balance 0</Text>
              <Text style={[styles.text1,{marginTop:ScreenHeight/200}]}>transactions 0</Text>
          </View>
          {/* 密钥 */}
          <View style={[styles.NandP,{height:ScreenHeight/5}]}>
            <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/23}}>
              <Text style={{fontSize:ScreenWidth/33}}>create from the following mnemonic or seed</Text>
              {/* 选择方式 */}
              <TouchableOpacity style={styles.Choose_way}
                onPress={()=>{
                  this.setState({
                    isModel:true
                  })
                }}
              >
                <View style={[styles.middle,{flex:1}]}>
                  <Text style={{color:'white'}}>{this.state.way}</Text>
                </View>
                <Image
                  style={{backgroundColor:'white',marginRight:1,height:ScreenHeight/23-2,width:ScreenHeight/35,resizeMode:'center'}}
                  source={require('../../../images/Assetes/Create_Account/next.png')}
                />
              </TouchableOpacity>
            </View>
            <TextInput style = {[styles.textInputStyle,{height:ScreenHeight/10,fontSize:ScreenHeight/40}]}
                placeholder = "magic trap help enlist solve manual crush win base creek angry gate"
                placeholderTextColor = "black"
                underlineColorAndroid="#ffffff00"
                multiline={true}
                maxLength={100}
                onChangeText = {this.onChangekey}
            />
          </View>
          {/* name */}
          <View style={styles.NandP}>
            <Text style={{fontSize:ScreenWidth/30}}>name the account</Text>
            <TextInput style = {[styles.textInputStyle,{fontSize:ScreenHeight/45}]}
                placeholder = "New Keypair"
                placeholderTextColor = "#666666"
                underlineColorAndroid="#ffffff00"
                onChangeText = {this.onChangename}
            />
          </View>
          {/* pass */}
          <View style={styles.NandP}>
            <Text style={{fontSize:ScreenWidth/30}}>enxrypt it using a password</Text>
            <TextInput style = {[styles.textInputStyle,{fontSize:ScreenHeight/45,borderColor:'red'}]}
                placeholder = "Please enter your password"
                placeholderTextColor = "#666666"
                underlineColorAndroid="#ffffff00"
                onChangeText = {this.onChangepassword}
            />
          </View>
          {/* Reset or Save */}
          <View style={{height:ScreenHeight/6,width:ScreenWidth,justifyContent:'center',alignItems:'flex-end'}}>
            <View style={{flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.5,alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#696969',height:ScreenHeight/20,width:ScreenWidth*0.2}}
              onPress={this.Reset}
            >
              
              <Text style={{fontWeight:'bold',fontSize:ScreenHeight/50,color:'white'}}>
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#FF4081',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.2}}
              onPress={this.Save_Account}
            >
              
              <Text style={{fontWeight:'bold',fontSize:ScreenHeight/50,color:'white'}}>
                Save
              </Text>
            </TouchableOpacity>
            <View style={{borderRadius:ScreenHeight/24/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/24/7*4,width:ScreenHeight/24/7*4,alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:ScreenHeight/70}}>
                or
              </Text>
            </View>
            </View>
          </View>

        </ScrollView>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.isModel}
        >
          <View style={{flex:1}}/>
          <View style={styles.chooses}>
            <TouchableOpacity
              onPress={()=>{
                this.setState({
                  isModel:false,
                })
              }}
            > 
              <Text style={styles.choose_Text}>cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                this.setState({
                  isModel:false,
                  way:this.state.way_change
                })
              }}
            > 
              <Text style={styles.choose_Text}>confirm</Text>
            </TouchableOpacity>
          </View>
          <Picker
            style={{width:ScreenWidth,backgroundColor:'#C0C0C0'}}
            selectedValue={this.state.way_change}
            onValueChange={(value) => this.setState({way_change: value})}
          >
            <Picker.Item label="Menemonic" value="Menemonic" />
            <Picker.Item label="Raw Seed" value="Raw Seed" />
          </Picker>
        </Modal>
      </View>    
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  middle:{
    justifyContent:'center',
    alignItems:'center'
  },
  imageview:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:ScreenHeight/55,
    width:ScreenWidth,
    height:ScreenHeight/3.81/2.5
  },
  image:{
    marginTop:ScreenHeight/30,
    backgroundColor:'white',
    borderRadius:ScreenHeight/28,
    height:ScreenHeight/14,
    width:ScreenHeight/14,
    resizeMode:'contain'
  },
  address_text:{
    marginTop:ScreenHeight/70,
    height:ScreenHeight/3.81/6,
    width:ScreenWidth,
    alignItems:'center',
    justifyContent:'center',
  },
  title:{
    padding:ScreenHeight/50,
    height:ScreenHeight/9,
    backgroundColor:'#776f71',
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'space-between'
  },
  text_title:{
    fontSize:ScreenHeight/37,
    fontWeight:'bold',
    color:'#e6e6e6'
  },
  text1:{
    fontSize:ScreenHeight/45,
    color:'#666666'
  },
  textInputStyle:{
    height:ScreenHeight/18,
    width:ScreenWidth*0.8,
    borderWidth:1,
    borderColor:'grey',
    borderRadius:ScreenHeight/100,
    paddingLeft:ScreenHeight/100,
    marginTop:ScreenHeight/70
  },
  NandP:{
    paddingTop:ScreenHeight/100,
    paddingLeft:ScreenWidth/20,
    height:ScreenHeight/8,
  },
  Choose_way:{
    alignItems:'center',
    marginLeft:ScreenWidth/70,
    width:ScreenWidth*0.25,
    height:ScreenHeight/23,
    borderWidth:1,
    borderRadius:ScreenHeight/200,
    borderColor:'red',
    flexDirection:'row',
    backgroundColor:'#FF4081'
  },
  chooses:{
    paddingLeft:ScreenWidth/20,
    paddingRight:ScreenWidth/20,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    height:ScreenHeight/18,
    backgroundColor:'#DCDCDC'
  },
  choose_Text:{
    fontWeight:'500',
    fontSize:ScreenHeight/50,
    color:'#4169E1'
  }
});