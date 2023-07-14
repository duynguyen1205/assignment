import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableHighlight,
  Pressable,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../consts/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const CartScreen = ({ navigation }) => {
  const [favoriteFlowers, setFavoriteFlowers] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const loadFavoriteFlowers = async () => {
        try {
          const favorData = await AsyncStorage.getItem("favoriteFlowers");
          if (favorData) {
            setFavoriteFlowers(JSON.parse(favorData));
          }
        } catch (error) {
          console.log(error);
        }
      };

      loadFavoriteFlowers();
    }, [])
  );

  const removeFavoriteFlower = (flower) => {
    Alert.alert(
      "Xác nhận",
      "Have you stopped liking this flower?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Over",
          onPress: async () => {
            try {
              const updatedFlowers = favoriteFlowers.filter(
                (f) => f.id !== flower.id
              );
              await AsyncStorage.setItem(
                "favoriteFlowers",
                JSON.stringify(updatedFlowers)
              );
              setFavoriteFlowers(updatedFlowers);
            } catch (e) {
              console.log("Lỗi ở xóa hoa", err);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleClearAsyncStorage = async () => {
    try {
      let empty = []
      await AsyncStorage.setItem('favoriteFlowers',JSON.stringify(empty))
      setFavoriteFlowers([])
    } catch (error) {
      console.log(error);
      // Xử lý lỗi nếu có
    }
  };
  const CartCard = ({ flower }) => {
    return (
      <TouchableHighlight
        underlayColor={COLORS.white}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("DetailsScreen", flower)}
      >
        <View style={style.cartCard}>
          <Image source={flower.image} style={{ height: 80, width: 80 }} />
          <View
            style={{
              height: 100,
              marginLeft: 10,
              paddingVertical: 20,
              flex: 1,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {flower.name}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.grey }}>
              {flower.category}
            </Text>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              ${flower.price}
            </Text>
          </View>
          <Pressable onPress={() => removeFavoriteFlower(flower)}>
            <View style={{ marginRight: 20, alignItems: "center" }}>
              <View style={style.actionBtn}>
                <Icon name="remove" size={30} color={COLORS.white} />
              </View>
            </View>
          </Pressable>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>List</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginRight: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ margin: 10, fontSize: 22, color: COLORS.primary, fontWeight: "bold" }}>
          Your favorite orchid:
        </Text>
        <Pressable onPress={()=> handleClearAsyncStorage()}>
           <Icon name="delete" size={30} color={COLORS.primary} />
        </Pressable>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={favoriteFlowers}
        renderItem={({ item }) => {
          return <CartCard flower={item} />;
        }}
        ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  cartCard: {
    height: 100,
    elevation: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    width: 40,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  emptyList: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.dark,
    flexDirection: "row",
  },
});

export default CartScreen;
