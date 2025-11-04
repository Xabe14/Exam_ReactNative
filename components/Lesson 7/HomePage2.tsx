import { StyleSheet, Text, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import React from 'react'
type Product= {
        name: string;
        price: number;
        image: ImageSourcePropType;
    }
const Card = ({name, price, image}: Product) => {
    return (
        <View style={styles.container}>

            <Image source={image} style={styles.boxImg}></Image>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.price}>{price}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>Mua Ngay</Text>
            </TouchableOpacity>
        </View>
    )
}
const Sanpham23pnv1b = () => {
  return (
      <View style={styles.productList}>
        <Card name="San1" price={12} image={require('../../assets/images/sweater.jpg')}/>
        <Card name="San2" price={12} image={require('../../assets/images/blue-t-shirt.jpg')}/>
        <Card name="San3" price={12} image={require('../../assets/images/t-shirt.jpg')}/>
        <Card name="San1" price={12} image={require('../../assets/images/t-shirt2.jpg')}/>
        <Card name="San1" price={12} image={require('../../assets/images/sweater.jpg')}/>
        <Card name="San1" price={12} image={require('../../assets/images/t-shirt.jpg')}/>
        <Card name="San1" price={12} image={require('../../assets/images/t-shirt2.jpg')}/>
        <Card name="San1" price={12} image={require('../../assets/images/blue-t-shirt.jpg')}/>
        <Card name="San1" price={12} image={require('../../assets/images/sweater.jpg')}/>
      </View>
   
  )
}

export default Sanpham23pnv1b

const styles = StyleSheet.create({
    container: {
        width:'30%',
        height:'32%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderRadius:15,
        backgroundColor:''
       
    },
    boxImg:{
        width:90,
        height:60,

    },
    productList:{
        flex: 1,
        flexDirection:'row',
        flexWrap:'wrap',
        gap: 5,
        justifyContent: 'center',
        paddingTop: 10
    },
    button: {
        backgroundColor: '#B7A3E3',
        width: 70,
        height: 30,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        color : '#FFF1CB'
    },
    name: {
        color: '#FF8F8F'
    },
    price: {
        color: '#CD2C58'
    }
})