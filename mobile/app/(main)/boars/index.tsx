import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { getAllBoars } from "../../../services/boar";
import { Boar } from "../../../types/boar";
import { Colors } from "../../../constants/Colors";
import { ChevronRight } from "lucide-react-native";

export default function BoarsList() {
  const [boars, setBoars] = useState<Boar[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBoars = async () => {
    try {
      const data = await getAllBoars();
      setBoars(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBoars();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBoars();
  };

  const renderItem = ({ item }: { item: Boar }) => (
    <Link href={`/(main)/boars/${item.id}`} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.breed}>{item.breed}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <ChevronRight size={20} color={Colors.light.mutedForeground} />
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={boars}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No boars found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemContent: {
    flex: 1,
    marginRight: 16,
  },
  breed: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.light.mutedForeground,
    fontSize: 16,
  },
});
