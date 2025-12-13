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
import { getBoarById } from "../../../services/boar";
import { Boar } from "../../../types/boar";
import { format } from "date-fns";
import { Colors } from "../../../constants/Colors";

export default function BoarDetails() {
  const { id } = useLocalSearchParams();
  const [boar, setBoar] = useState<Boar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoar = async () => {
      try {
        if (id) {
          const data = await getBoarById(Number(id));
          setBoar(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoar();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!boar) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Boar not found</Text>
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
          <Text style={styles.title}>{boar.breed}</Text>
          <View style={styles.divider} />
          
          <DetailRow label="Description" value={boar.description} />
          <DetailRow
            label="Created At"
            value={boar.created_at ? format(new Date(boar.created_at), "PPP") : "N/A"}
          />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
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
