import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useCallback } from "react";
import COLORS from "../consts/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import categories from "../consts/categories";
import flowers from "../consts/flowers";
import { toggleFavorite } from "../AsyncStore/favoriteUtils";
import { useFocusEffect } from "@react-navigation/native";
const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;
export default function Home({ navigation }) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [filterData, setFilterData] = useState(flowers);
  const [favoriteFlowers, setFavoriteFlowers] = useState([]);
  const filterList = (cate) => {
    if (cate === "All") {
      setFilterData(flowers);
    } else {
      setFilterData(flowers.filter((c) => c.category === cate));
    }
  };
  useFocusEffect(
    useCallback(() => {
      const loadFavoriteFlowers = async () => {
        try {
          const favorData = await AsyncStorage.getItem('favoriteFlowers');
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

  const onClickFavorite = async (flower) => {
    try {
      const updatedFlowers = await toggleFavorite(flower);
      setFavoriteFlowers(updatedFlowers);
    } catch (e) {
      console.log("Lỗi ở phần thích hoa", e);
    }
  };

  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesListContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategoryIndex(index), filterList(category.name);
            }}
          >
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex == index
                    ? COLORS.primary
                    : COLORS.secondary,
                ...styles.categoryBtn,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color:
                    selectedCategoryIndex == index
                      ? COLORS.white
                      : COLORS.primary,
                }}
              >
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  const Card = ({ flower, onClickFavorite, isFavorite }) => {
    return (
      <TouchableHighlight
        underlayColor={COLORS.white}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("DetailsScreen", flower)}
      >
        <View style={styles.card}>
          <View style={{ alignItems: "center", top: -40 }}>
            <Image source={flower.image} style={{ height: 120, width: 120 }} />
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {flower.name}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.grey, marginTop: 2 }}>
              {flower.category}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              ${flower.price}
            </Text>
            <Pressable onPress={() => onClickFavorite(flower)}>
              <View style={styles.addToCartBtn}>
                {isFavorite ? (
                  <Icon name="favorite" size={30} color={COLORS.primary} />
                ) : (
                  <Icon name="favorite-border" size={30} />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 28 }}>Hello,</Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", marginLeft: 10 }}>
              Duy
            </Text>
          </View>
          <Text style={{ marginTop: 5, fontSize: 22, color: COLORS.grey }}>
            What is your favorite orchid?
          </Text>
        </View>
        <Image
          source={require("../assets/person.png")}
          style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10}}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.inputContainer}>
          <Icon name="search" size={28} />
          <TextInput
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Search for flowers"
          />
        </View>
      </View>
      <View>
        <ListCategories />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={filterData}
        renderItem={({ item }) => (
          <Card
            flower={item}
            onClickFavorite={onClickFavorite}
            isFavorite={favoriteFlowers.some((f) => f.id === item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: COLORS.light,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 80,
    marginRight: 7,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
