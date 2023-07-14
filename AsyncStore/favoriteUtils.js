// Trong favoriteUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const toggleFavorite = async (flower) => {
  try {
    // Lấy danh sách hoa yêu thích từ AsyncStorage
    const favoriteFlowers = await AsyncStorage.getItem('favoriteFlowers');
    let updatedFlowers = [];

    if (favoriteFlowers) {
      // Nếu danh sách hoa yêu thích đã tồn tại, chuyển đổi thành mảng
      updatedFlowers = JSON.parse(favoriteFlowers);

      // Kiểm tra xem hoa đã tồn tại trong danh sách yêu thích chưa
      const existingIndex = updatedFlowers.findIndex((item) => item.id === flower.id);

      if (existingIndex !== -1) {
        // Hoa đã tồn tại trong danh sách yêu thích, xóa khỏi danh sách
        updatedFlowers.splice(existingIndex, 1);
      } else {
        // Hoa chưa tồn tại trong danh sách yêu thích, thêm vào danh sách
        updatedFlowers.push(flower);
      }
    } else {
      // Nếu danh sách hoa yêu thích chưa tồn tại, tạo mảng mới và thêm hoa vào
      updatedFlowers = [flower];
    }

    // Lưu danh sách hoa yêu thích mới vào AsyncStorage
    await AsyncStorage.setItem('favoriteFlowers', JSON.stringify(updatedFlowers));

    return updatedFlowers;
  } catch (error) {
    console.error('Lỗi khi cập nhật danh sách hoa yêu thích:', error);
  }
};
