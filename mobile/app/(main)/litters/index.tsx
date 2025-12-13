import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getAllLitters } from "../../../services/litter";
import { Litter } from "../../../types/litter";
import { format } from "date-fns";
import { Colors } from "../../../constants/Colors";

export default function LittersList() {
  const [litters, setLitters] = useState<Litter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLitters = async () => {
    try {
      const data = await getAllLitters();
      setLitters(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLitters();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLitters();
  };

  const renderItem = ({ item }: { item: Litter }) => (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.sowId}>Sow #{item.sow_id}</Text>
        <Text style={styles.date}>
          {item.birth_date
            ? format(new Date(item.birth_date), "MMM d, yyyy")
            : "N/A"}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Piglets Born</Text>
          <Text style={styles.value}>{item.piglets_born_count}</Text>
        </View>
      </View>
    </View>
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
        data={litters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No litters found</Text>
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
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.muted,
  },
  sowId: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  date: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  details: {
    padding: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
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
