import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  save: async (key, value) => await AsyncStorage.setItem(key, JSON.stringify(value)),
  get: async (key) => {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  remove: async (key) => await AsyncStorage.removeItem(key),
};