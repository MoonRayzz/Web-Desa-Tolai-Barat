import {
  collection, addDoc, getDocs, getDoc,
  doc, setDoc, updateDoc, query,
  orderBy, limit, Timestamp,
} from "firebase/firestore";
import { db } from "./config";

export interface DailyStat {
  date:    string;
  count:   number;
  cities:  Record<string, number>;
  regions: Record<string, number>;
}

export async function logVisit(data: {
  page:    string;
  city:    string;
  region:  string;
  country: string;
}): Promise<void> {
  try {
    await addDoc(collection(db, "analytics_visits"), {
      ...data,
      timestamp: Timestamp.now(),
    });

    const today  = new Date().toISOString().split("T")[0];
    const dayRef = doc(db, "analytics_daily", today);
    const daySnap = await getDoc(dayRef);

    if (daySnap.exists()) {
      const d = daySnap.data();
      const cities  = { ...(d.cities  || {}), [data.city]:   ((d.cities  || {})[data.city]   || 0) + 1 };
      const regions = { ...(d.regions || {}), [data.region]: ((d.regions || {})[data.region] || 0) + 1 };
      await updateDoc(dayRef, { count: (d.count || 0) + 1, cities, regions });
    } else {
      await setDoc(dayRef, {
        date:    today,
        count:   1,
        cities:  { [data.city]:   1 },
        regions: { [data.region]: 1 },
      });
    }
  } catch {
    // silent fail — jangan sampai break halaman publik
  }
}

export async function getTotalVisitors(): Promise<number> {
  try {
    const snap = await getDocs(collection(db, "analytics_daily"));
    return snap.docs.reduce((sum, d) => sum + (d.data().count || 0), 0);
  } catch { return 0; }
}

export async function getTodayCount(): Promise<number> {
  try {
    const today   = new Date().toISOString().split("T")[0];
    const snap    = await getDoc(doc(db, "analytics_daily", today));
    return snap.exists() ? (snap.data().count || 0) : 0;
  } catch { return 0; }
}

export async function getThisMonthCount(): Promise<number> {
  try {
    const prefix = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const snap   = await getDocs(collection(db, "analytics_daily"));
    return snap.docs
      .filter((d) => d.id.startsWith(prefix))
      .reduce((sum, d) => sum + (d.data().count || 0), 0);
  } catch { return 0; }
}

export async function getLast7Days(): Promise<DailyStat[]> {
  try {
    const q    = query(collection(db, "analytics_daily"), orderBy("date", "desc"), limit(7));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ date: d.id, ...d.data() } as DailyStat))
      .reverse(); // ascending untuk chart
  } catch { return []; }
}

export async function getTopCities(n = 10): Promise<{ city: string; count: number }[]> {
  try {
    const snap    = await getDocs(collection(db, "analytics_daily"));
    const cityMap: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const cities = d.data().cities || {};
      Object.entries(cities).forEach(([city, count]) => {
        cityMap[city] = (cityMap[city] || 0) + (count as number);
      });
    });
    return Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  } catch { return []; }
}

export async function getTopRegions(n = 10): Promise<{ region: string; count: number }[]> {
  try {
    const snap      = await getDocs(collection(db, "analytics_daily"));
    const regionMap: Record<string, number> = {};
    snap.docs.forEach((d) => {
      const regions = d.data().regions || {};
      Object.entries(regions).forEach(([region, count]) => {
        regionMap[region] = (regionMap[region] || 0) + (count as number);
      });
    });
    return Object.entries(regionMap)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  } catch { return []; }
}