import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';

export default function App() {
  const [adatok, setAdatok] = useState([])
  const [szoveg, setSzoveg] = useState("")
  const [datum, setDatum] = useState("")
  const [isChecked, setChecked] = useState(false);
  
  useEffect(()=> {
    /*let feladatok = [
      {
        "id":0,
        "feladat":"Verseny",
        "datum":"2024.11.08.",
        "kesz":0
      },
      {
        "id":1,
        "feladat":"Fogászat",
        "datum":"2024.11.12.",
        "kesz":0
      },
    ]
   
    

    storeData(feladatok)*/
    getData().then(adat => {
      //alert(JSON.stringify(adat))
      setAdatok(adat)
    })
  }, [])

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('feladatok', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('feladatok');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  const felvitel = () =>
  {
    let uj = [...adatok]

    uj.push({
      "id":uj.length,
      "feladat":szoveg,
      "datum":datum,
      "kesz":0
    }) 

    uj.sort((a, b) => new Date(a.datum) - new Date(b.datum))

    setAdatok(uj)
    storeData(uj)

    //alert("Sikeres felvitel")
  }

  const torles = () => {
    let uj = []

    setAdatok(uj)
    storeData(uj)

    alert("Sikeres törlés")
  }

  const befejezVagyVissza = (id) => {
    let uj = [...adatok]

    for (const item of uj)
    {
      if (item.id == id)
      {
        if (item.kesz == 0)
        {
          item.kesz = 1
        }
        else
        {
          item.kesz = 0
        }
      }
    }

    setAdatok(uj)
    storeData(uj)
  }

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const valtozikDatum = (event, datum) => {
    setShow(false);
    setDate(datum);
    //setDatum(datum.toLocaleString().split(',')[0])
    setDatum(datum.getFullYear() + "-" + (datum.getMonth() + 1) + "-" + datum.getDate())
  };

  const showMode = () => {
    setShow(true);
    setMode('date');
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.bemenet}>
        <Text style={{color: 'blue',fontSize: 20}}>Feladat:</Text>
        <View style={{flexDirection:'row', marginRight: 10,marginBottom:10}}>
          <View style={{flex: 10, marginRight:150}}>
            <TextInput
              style={styles.input}
              onChangeText={setSzoveg}
              value={szoveg}
            />
          </View>

          <View style={{flex: 1, marginLeft: 160, marginVertical:'auto',marginRight:20}}>
            <Pressable style={{backgroundColor:'darkred', width:35}} onPress={()=>setSzoveg("")}>
              <Text style={{color:'white',textAlign:'center',fontSize:24,}}>X</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{marginBottom: 30, width: 200}}>
        <View style={{width:100, marginHorizontal: 'auto'}}>
          <Button onPress={showMode} title="Dátum"/>
        </View>
        
        <Text style={styles.datum}>{datum}</Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={(event, datum) => valtozikDatum(event, datum)}
          />
        )}

        <Button title='Új feladat felvitele' onPress={felvitel}/>
      </View>

      <View
        style={{flexDirection: 'row',marginBottom: 20,}}>
 

          <View style={{flex: 5}}>
            <Text style={{marginLeft:20}}>Korábbiak</Text>
          </View>

          <View style={{flex: 1,marginLeft:5}}>
            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked}/>
          </View>
       
          <View style={{flex: 15}}>
            <Pressable onPress={torles} style={{width:100, marginLeft: 140,}}>
              <Text style={styles.torles}>Mind törlése</Text>
            </Pressable>
          </View>

        </View>
      

      <FlatList
        data={adatok}
        renderItem={({item, index}) => 
        <View>
          {
            isChecked || !item.kesz ? 
            <View style={styles.doboz}>
            <Text style={{color:'blue', fontStyle: 'italic',}}>{item.datum}</Text>
            <Text style={{fontSize: 24,}}>{item.feladat}</Text>
            {
              item.kesz ? 
              <Pressable onPress={()=>befejezVagyVissza(item.id)}>
                <Text style={styles.gomb}>Visszaállít</Text>
              </Pressable>
              : 
              <Pressable onPress={()=>befejezVagyVissza(item.id)}>
                <Text style={styles.gomb2}>Befejez</Text>
              </Pressable>
            }
          </View>   
          : 
            null
          }
        </View>
        }
        keyExtractor={(item, index) => index}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doboz:{
    borderColor: '#ecd4ff',
    borderWidth: 2,
    borderRadius: 10,
    paddingRight: 100,
    paddingLeft: 10,
    paddingVertical: 10,
    marginBottom: 10,
    width: 350,
  },
  input: {
    height: 40,
    //margin: 12,
    borderWidth: 1,
    //padding: 10,
    width: 300,
    borderColor: 'blue',
    borderRadius: 8,
    padding: 10,
  },
  gomb:{
    backgroundColor: 'grey',
    fontSize: 18,
    width: 100,
    textAlign: 'center',
    borderRadius: 10,
    padding: 5,
    fontStyle: 'italic',
  },
  gomb2:{
    backgroundColor: 'orange',
    fontSize: 18,
    width: 100,
    textAlign: 'center',
    borderRadius: 10,
    padding: 5,
    fontStyle: 'italic',
  },
  torles:{
    backgroundColor: 'darkred',
    color: 'white',
    padding: 5,
    borderRadius: 5,
  },
  datum:{
    textAlign:'center',
    marginVertical:10,
    fontSize:20,
    backgroundColor: 'yellow',
    padding: 5,
    fontWeight: 'bold',
    width: 150,
    marginHorizontal: 'auto'
  },
  bemenet:{
    marginTop: 50,
  },
});