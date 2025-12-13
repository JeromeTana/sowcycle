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
import { getAllBreedings } from "../../../services/breeding";
import { Breeding } from "../../../types/breeding";
import { format } from "date-fns";
import { Colors } from "../../../constants/Colors";

export default function BreedingList() {
  const [breedings, setBreedings] = useState<Breeding[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBreedings = async () => {
    try {
      const data = await getAllBreedings();
      setBreedings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBreedings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBreedings();
  };

  const renderItem = ({ item }: { item: Breeding }) => (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.sowId}>Sow #{item.sow_id}</Text>
        <Text style={styles.date}>
          {format(new Date(item.breed_date), "MMM d, yyyy")}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Expected Farrow</Text>
          <Text style={styles.value}>
            {format(new Date(item.expected_farrow_date), "MMM d, yyyy")}
          </Text>
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
        data={breedings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No breeding records found</Text>
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
