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
import { Link, useRouter } from "expo-router";
import { getAllSows } from "../../../services/sow";
import { Sow } from "../../../types/sow";
import { Colors } from "../../../constants/Colors";
import { ChevronRight } from "lucide-react-native";

export default function SowsList() {
  const [sows, setSows] = useState<Sow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSows = async () => {
    try {
      const data = await getAllSows();
      setSows(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSows();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSows();
  };

  const renderItem = ({ item }: { item: Sow }) => (
    <Link href={`/(main)/sows/${item.id}`} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.name}>{item.name}</Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: item.is_active
                  ? Colors.light.primary
                  : Colors.light.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: item.is_active
                    ? Colors.light.primaryForeground
                    : Colors.light.mutedForeground,
                },
              ]}
            >
              {item.is_active ? "Active" : "Inactive"}
            </Text>
          </View>
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
        data={sows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sows found</Text>
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
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
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
