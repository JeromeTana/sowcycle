import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getSowById } from "../../../services/sow";
import { Sow } from "../../../types/sow";
import { format } from "date-fns";
import { Colors } from "../../../constants/Colors";

export default function SowDetails() {
  const { id } = useLocalSearchParams();
  const [sow, setSow] = useState<Sow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSow = async () => {
      try {
        if (id) {
          const data = await getSowById(Number(id));
          setSow(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSow();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!sow) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sow not found</Text>
      </View>
    );
  }

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{sow.name}</Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: sow.is_active
                    ? Colors.light.primary
                    : Colors.light.muted,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: sow.is_active
                      ? Colors.light.primaryForeground
                      : Colors.light.mutedForeground,
                  },
                ]}
              >
                {sow.is_active ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <DetailRow
            label="Created At"
            value={format(new Date(sow.created_at), "PPP")}
          />
          {/* Add more details here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  errorText: {
    color: Colors.light.destructive,
    fontSize: 16,
  },
});
