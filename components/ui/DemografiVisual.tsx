// components/ui/DemografiVisual.tsx
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DusunData } from '@/types';

interface Props {
  totalJiwa: number;
  totalKK?: string; 
  dusunList: DusunData[];
}

const DusunStatsList = ({ dusunList, totalJiwa }: { dusunList: DusunData[], totalJiwa: number }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-display font-bold text-xl text-ocean-900">Distribusi Per Dusun</h3>
      <div className="space-y-5">
        {dusunList.map((dusun) => {
          const safeTotal = isNaN(Number(dusun.total)) ? 0 : Number(dusun.total);
          const safeTotalJiwa = isNaN(Number(totalJiwa)) ? 0 : Number(totalJiwa);
          const persentase = safeTotalJiwa > 0 ? (safeTotal / safeTotalJiwa) * 100 : 0;
          
          return (
            <div key={dusun.id} className="space-y-2 group">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-ocean-800">{dusun.nama}</span>
                <span className="font-bold text-ocean-900">{safeTotal.toLocaleString("id-ID")} Jiwa</span>
              </div>
              
              <div className="w-full h-3 bg-ocean-50 rounded-full overflow-hidden border border-ocean-100/50">
                <div 
                  className="h-full bg-forest-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-gold-500" 
                  style={{ width: `${persentase}%` }}
                />
              </div>

              <div className="flex gap-3 text-[10.5px] font-semibold uppercase tracking-wider text-ocean-500 pt-1">
                <span className="bg-ocean-50 px-2 py-0.5 rounded-md border border-ocean-100/50">
                  🏠 {dusun.kk} KK
                </span>
                <span className="bg-ocean-50 px-2 py-0.5 rounded-md border border-ocean-100/50">
                  ♂️ L: {dusun.lakiLaki}
                </span>
                <span className="bg-ocean-50 px-2 py-0.5 rounded-md border border-ocean-100/50 text-pink-600">
                  ♀️ P: {dusun.perempuan}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DemografiVisual({ totalJiwa, dusunList }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totals = useMemo(() => {
    let l = 0;
    let p = 0;
    dusunList.forEach(d => {
      l += isNaN(Number(d.lakiLaki)) ? 0 : Number(d.lakiLaki);
      p += isNaN(Number(d.perempuan)) ? 0 : Number(d.perempuan);
    });
    return { l, p };
  }, [dusunList]);

  const persentaseLaki = totalJiwa > 0 ? (totals.l / totalJiwa) * 100 : 0;
  const persentasePerem = totalJiwa > 0 ? (totals.p / totalJiwa) * 100 : 0;

  const genderData = [
    { name: 'Laki-Laki', value: totals.l },
    { name: 'Perempuan', value: totals.p },
  ];

  const COLORS = ['var(--color-ocean-600)', 'var(--color-pink-500)'];

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 bg-white rounded-3xl p-10 border border-ocean-100 shadow-card animate-pulse">
        <div className="w-full h-[350px] bg-ocean-50 rounded-full flex items-center justify-center">
           <span className="text-ocean-200">Memuat Grafik...</span>
        </div>
        <div className="space-y-6">
          <div className="h-6 bg-ocean-50 rounded w-1/2"></div>
          <div className="h-4 bg-ocean-50 rounded w-full"></div>
          <div className="h-4 bg-ocean-50 rounded w-full"></div>
          <div className="h-4 bg-ocean-50 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const renderCustomLegend = () => {
    return (
      <div className="flex justify-center gap-10 mt-8">
        {genderData.map((entry, index) => {
          const isLaki = entry.name === 'Laki-Laki';
          const persentase = isLaki ? persentaseLaki : persentasePerem;
          return (
            <div key={entry.name} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest">{entry.name}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-ocean-950">{entry.value.toLocaleString("id-ID")}</span>
                  <span className="text-sm font-medium text-ocean-600">
                    {entry.name === 'Laki-Laki' ? '♂' : '♀'} {persentase.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 bg-white rounded-3xl p-10 border border-ocean-100 shadow-card">
      
      <div className="space-y-6">
        <h3 className="font-display font-bold text-xl text-ocean-900">Komposisi Gender</h3>
        
        {/* PERBAIKAN: Menghapus h-[350px] dari class dan memindahkannya ke style minHeight agar aman,
            serta memberikan height={350} (angka pasti) pada ResponsiveContainer */}
        <div className="w-full relative" style={{ minHeight: 350 }}>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%" 
                cy="50%" 
                labelLine={false} 
                outerRadius={130} 
                innerRadius={60} 
                fill="#8884d8"
                dataKey="value"
                startAngle={90} 
                endAngle={450} 
                isAnimationActive={true}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="text-4xl opacity-20">👥</span>
          </div>
        </div>
        
        {renderCustomLegend()}
        
        <p className="text-xs text-ocean-400 text-center italic mt-4">
          * Perbandingan populasi pria dan wanita dari total {totalJiwa.toLocaleString("id-ID")} jiwa.
        </p>
      </div>

      <DusunStatsList dusunList={dusunList} totalJiwa={totalJiwa} />
    </div>
  );
} 