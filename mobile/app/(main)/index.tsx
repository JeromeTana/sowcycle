import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { getAllSows } from "../../services/sow";
import { getAllLitters } from "../../services/litter";
import { getAllBreedings } from "../../services/breeding";
import { Sow } from "../../types/sow";
import { Litter } from "../../types/litter";
import { Breeding } from "../../types/breeding";
import { Colors } from "../../constants/Colors";
import {
  Heart,
  PiggyBank,
  TrendingUp,
  Clock,
  Calendar as CalendarIcon,
  User,
  ChevronRight,
  MoreHorizontal,
  Plus,
} from "lucide-react-native";
import { format, differenceInDays, addDays } from "date-fns";
import { th } from "date-fns/locale";

export default function Dashboard() {
  const [sows, setSows] = useState<Sow[]>([]);
  const [litters, setLitters] = useState<Litter[]>([]);
  const [breedings, setBreedings] = useState<Breeding[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [sowsData, littersData, breedingsData] = await Promise.all([
        getAllSows(),
        getAllLitters(),
        getAllBreedings(),
      ]);
      setSows(sowsData);
      setLitters(littersData);
      setBreedings(breedingsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Calculations
  const pregnantSows = breedings.filter(
    (b) => !b.actual_farrow_date && !b.is_aborted
  );
  const fatteningPiglets = litters.reduce(
    (acc, l) => acc + (l.piglets_born_count || 0), // Simplified logic
    0
  );
  const avgWeight = 110.4; // Mock data as per design
  const avgPigletsBorn = 21.6; // Mock data as per design

  const StatCard = ({
    label,
    value,
    unit,
    icon: Icon,
    iconColor,
    chartColor,
  }: {
    label: string;
    value: string | number;
    unit?: string;
    icon?: any;
    iconColor?: string;
    chartColor?: string;
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>{label}</Text>
        {Icon && <Icon size={20} color={iconColor || Colors.light.text} />}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardValue}>
          {value} <Text style={styles.cardUnit}>{unit}</Text>
        </Text>
        {chartColor && (
          <View style={styles.chartPlaceholder}>
            {/* Simple line to mimic chart */}
            <View style={[styles.chartLine, { backgroundColor: chartColor }]} />
          </View>
        )}
      </View>
    </View>
  );

  const SowCard = ({ breeding }: { breeding: Breeding }) => {
    const sow = sows.find((s) => s.id === breeding.sow_id);
    const daysRemaining = differenceInDays(
      new Date(breeding.expected_farrow_date),
      new Date()
    );
    const breedDate = new Date(breeding.breed_date);
    const dueDate = new Date(breeding.expected_farrow_date);

    return (
      <View style={styles.sowCard}>
        <View style={styles.sowHeader}>
          <View style={styles.sowInfo}>
            <PiggyBank size={20} color={Colors.light.text} />
            <Text style={styles.sowName}>{sow?.name || "Unknown"}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>คลอดใน {daysRemaining} วัน</Text>
            </View>
          </View>
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <CalendarIcon size={16} color={Colors.light.mutedForeground} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>ผสมเมื่อ</Text>
              <Text style={styles.timelineValue}>
                {format(breedDate, "d MMM yyyy", { locale: th })}
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <CalendarIcon size={16} color={Colors.light.mutedForeground} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>กำหนดคลอด</Text>
              <Text style={styles.timelineValue}>
                {format(dueDate, "d MMM yyyy", { locale: th })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>ดูรายละเอียด</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledButton}>
            <Plus size={16} color="#fff" />
            <Text style={styles.filledButtonText}>เพิ่มประวัติผสม</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    // <SafeAreaView style={styles.safeArea}>
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>หน้าหลัก</Text>
        <TouchableOpacity style={styles.profileButton}>
          <User size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            label="แม่พันธุ์ตั้งครรภ์"
            value={pregnantSows.length}
            unit="ตัว"
            icon={Heart}
            iconColor="#ec4899"
          />
          <StatCard
            label="ลูกสุกรขุน"
            value={fatteningPiglets}
            unit="ตัว"
            icon={PiggyBank}
            iconColor="#f97316"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="น้ำหนักขายเฉลี่ย"
            value={avgWeight}
            unit="กก."
            icon={TrendingUp}
            iconColor="#3b82f6"
            chartColor="#3b82f6"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="จำนวนลูกเกิดเฉลี่ย"
            value={avgPigletsBorn}
            unit="ตัว/ครอก"
            icon={TrendingUp}
            iconColor="#22c55e"
            chartColor="#22c55e"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ใน 7 วัน</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>ไม่มีรายการใน 7 วันข้างหน้า</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          แม่พันธุ์ตั้งครรภ์ ({pregnantSows.length})
        </Text>
        {pregnantSows.map((breeding) => (
          <SowCard key={breeding.id} breeding={breeding} />
        ))}
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "center", // Center title
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 36,
    position: "relative",
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 20,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  cardContent: {
    marginTop: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#666",
  },
  chartPlaceholder: {
    height: 20,
    justifyContent: "center",
    marginTop: 8,
  },
  chartLine: {
    height: 2,
    width: "100%",
    borderRadius: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
  sowCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  sowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sowInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sowName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  badge: {
    backgroundColor: "#ec4899",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  timeline: {
    marginLeft: 8,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  timelineConnector: {
    width: 2,
    height: 20,
    backgroundColor: "#e0e0e0",
    marginLeft: 15, // Center of icon container (32/2 - 1)
    marginVertical: -4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  filledButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f8f9fa", // Light gray as per design
  },
  filledButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
