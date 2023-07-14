import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "../consts/colors";
import { SecondaryButton } from "./Button";
import { toggleFavorite } from "../AsyncStore/favoriteUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Detail({ navigation, route }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const item = route.params;
  const checkIsFavorite = async () => {
    try {
      const favoriteFlowers = JSON.parse(
        await AsyncStorage.getItem("favoriteFlowers")
      );
      const existingIndex = favoriteFlowers.findIndex((c) => c.id === item.id);

      if (existingIndex !== -1) {
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Lỗi khi check list:", err);
    }
  };
  useEffect(() => {
    checkIsFavorite();
  }, [isFavorite]);
  const onClickFavorite = async (flower) => {
    try {
      await toggleFavorite(flower);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Lỗi khi xử lý yêu thích hoa:", error);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 280,
          }}
        >
          <Image source={item.image} style={{ height: 220, width: 220 }} />
        </View>
        <View style={style.details}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", color: COLORS.white }}
            >
              {item.name}
            </Text>
            <Pressable onPress={() => onClickFavorite(item)}>
              <View style={style.iconContainer}>
                {isFavorite ? (
                  <Icon name="favorite" size={30} color={COLORS.primary} />
                ) : (
                  <Icon
                    name="favorite-border"
                    color={COLORS.primary}
                    size={30}
                  />
                )}
              </View>
            </Pressable>
          </View>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: COLORS.white }}
          >
            Type: {item.category}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: COLORS.white,
              marginTop: 5,
            }}
          >
            Price: {item.price} $
          </Text>
          <Text style={style.detailsText}>{item.des}</Text>
          <View style={{ marginTop: 40, marginBottom: 40 }}>
            <SecondaryButton
              onPress={() => navigation.navigate("HomeScreen")}
              title="Back to home"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
  },
  iconContainer: {
    backgroundColor: COLORS.white,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  detailsText: {
    marginTop: 20,
    lineHeight: 22,
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "bold",
  },
});
