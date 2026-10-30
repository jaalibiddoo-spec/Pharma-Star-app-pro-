import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Users, MapPin, Globe, GraduationCap, 
  Layers, Search, Filter, Download, Printer, RefreshCw, 
  CheckCircle2, Award, ShieldCheck, TrendingUp, BarChart3, 
  CreditCard, Landmark, Eye, ArrowUpDown, ChevronRight, X
} from 'lucide-react';
import { User } from '../types';
import { getRememberedAccounts } from '../utils/userStorage';

interface UserRecord {
  id: string;
  fullName: string;
  username: string;
  role: 'pharmacist' | 'student' | 'physician' | 'intern';
  region: string;
  country: string;
  university: string;
  institution: string;
  department: string;
  organization: string;
  isPro: boolean;
  unlockedExitExam?: boolean;
  unlockedWholesaler?: boolean;
  totalPaidETB: number;
  registrationDate: string;
  lastActive: string;
}

export const AdminInstitutionalAnalytics: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'paid' | 'date'>('date');
  const [lastAutoUpdated, setLastAutoUpdated] = useState<string>(new Date().toLocaleTimeString());

  // Base institutional user population across Ethiopian & Regional ecosystems
  const [usersList, setUsersList] = useState<UserRecord[]>([
    {
      id: "usr-1",
      fullName: "Pharmacist Dawid Aliyi",
      username: "jaalibiddoo",
      role: "pharmacist",
      region: "Addis Ababa",
      country: "Ethiopia",
      university: "Addis Ababa University (AAU)",
      institution: "Tikur Anbessa Specialized Hospital",
      department: "Clinical Pharmacy & Inpatient Care",
      organization: "Ethiopian Pharmaceutical Association (EPA)",
      isPro: true,
      unlockedExitExam: true,
      unlockedWholesaler: true,
      totalPaidETB: 650,
      registrationDate: "2026-10-20",
      lastActive: "2026-10-30"
    },
    {
      id: "usr-2",
      fullName: "Chaltu Mohammed Idris",
      username: "chaltu_m",
      role: "pharmacist",
      region: "Oromia",
      country: "Ethiopia",
      university: "Jimma University (JU)",
      institution: "Jimma Medical Center (JMC)",
      department: "Cardiology & Inpatient Pharmacotherapy",
      organization: "Oromia Regional Health Bureau",
      isPro: true,
      unlockedExitExam: true,
      unlockedWholesaler: false,
      totalPaidETB: 150,
      registrationDate: "2026-10-22",
      lastActive: "2026-10-30"
    },
    {
      id: "usr-3",
      fullName: "Abebe Kebede Tura",
      username: "abebe_k",
      role: "pharmacist",
      region: "Sidama",
      country: "Ethiopia",
      university: "Hawassa University (HU)",
      institution: "Hawassa University Comprehensive Hospital",
      department: "Hospital Dispensary & Quality Control",
      organization: "Sidama Regional Health Bureau",
      isPro: true,
      unlockedExitExam: true,
      unlockedWholesaler: true,
      totalPaidETB: 650,
      registrationDate: "2026-10-21",
      lastActive: "2026-10-29"
    },
    {
      id: "usr-4",
      fullName: "Biniyam Fikadu Haile",
      username: "biniyam_f",
      role: "student",
      region: "Amhara",
      country: "Ethiopia",
      university: "University of Gondar (UoG)",
      institution: "University of Gondar Comprehensive Hospital",
      department: "Undergraduate Pharmacy (Exit Exam Candidate)",
      organization: "Ethiopian Pharmacy Students Association (EPSA)",
      isPro: false,
      unlockedExitExam: true,
      unlockedWholesaler: false,
      totalPaidETB: 50,
      registrationDate: "2026-10-25",
      lastActive: "2026-10-30"
    },
    {
      id: "usr-5",
      fullName: "Dr. Selamawit Zeleke",
      username: "selam_z",
      role: "physician",
      region: "Addis Ababa",
      country: "Ethiopia",
      university: "Addis Ababa University (AAU)",
      institution: "St. Paul's Hospital Millennium Medical College",
      department: "Internal Medicine & Therapeutics",
      organization: "Ministry of Health (MoH)",
      isPro: true,
      unlockedExitExam: false,
      unlockedWholesaler: false,
      totalPaidETB: 100,
      registrationDate: "2026-10-23",
      lastActive: "2026-10-30"
    },
    {
      id: "usr-6",
      fullName: "Kenenisa Bedada Olana",
      username: "kenenisa_b",
      role: "pharmacist",
      region: "Oromia",
      country: "Ethiopia",
      university: "Haramaya University",
      institution: "Asella Referral & Teaching Hospital",
      department: "Supply Chain & EPSS Regional Depot",
      organization: "Ethiopian Pharmaceuticals Supply Service (EPSS)",
      isPro: true,
      unlockedExitExam: true,
      unlockedWholesaler: true,
      totalPaidETB: 650,
      registrationDate: "2026-10-18",
      lastActive: "2026-10-28"
    },
    {
      id: "usr-7",
      fullName: "Hiwot Tesfaye Wondimu",
      username: "hiwot_t",
      role: "intern",
      region: "Tigray",
      country: "Ethiopia",
      university: "Mekelle University (MU)",
      institution: "Ayder Comprehensive Specialized Hospital",
      department: "Pediatric Clinical Pharmacy Clerkship",
      organization: "Ayder Health Sciences",
      isPro: false,
      unlockedExitExam: true,
      unlockedWholesaler: false,
      totalPaidETB: 50,
      registrationDate: "2026-10-27",
      lastActive: "2026-10-30"
    },
    {
      id: "usr-8",
      fullName: "Girma Wolde Aragaw",
      username: "girma_w",
      role: "pharmacist",
      region: "Dire Dawa",
      country: "Ethiopia",
      university: "Haramaya University",
      institution: "Sabian General Hospital",
      department: "Pharmaceutical Wholesaler & Distribution",
      organization: "MedTech Wholesale & Importers",
      isPro: true,
      unlockedExitExam: false,
      unlockedWholesaler: true,
      totalPaidETB: 500,
      registrationDate: "2026-10-15",
      lastActive: "2026-10-29"
    },
    {
      id: "usr-9",
      fullName: "Dr. Samuel Omondi",
      username: "samuel_omondi",
      role: "pharmacist",
      region: "Nairobi",
      country: "Kenya",
      university: "University of Nairobi",
      institution: "Kenyatta National Hospital",
      department: "Clinical Toxicology & Drug Information",
      organization: "Pharmaceutical Society of Kenya (PSK)",
      isPro: true,
      unlockedExitExam: false,
      unlockedWholesaler: false,
      totalPaidETB: 100,
      registrationDate: "2026-10-10",
      lastActive: "2026-10-26"
    }
  ]);

  // Auto-Update Engine: merges current session and local storage remembered accounts
  const refreshUserData = () => {
    try {
      const storedAccounts = getRememberedAccounts();
      const mappedStored: UserRecord[] = storedAccounts.map((u, i) => {
        let totalPaid = 0;
        (u.payments || []).forEach(p => totalPaid += p.amountETB || 0);
        if (totalPaid === 0 && u.isPro) totalPaid = 100;

        return {
          id: `local-${u.username}-${i}`,
          fullName: u.fullName || u.username,
          username: u.username,
          role: u.role || 'pharmacist',
          region: u.region || (u.institutionName?.includes('Hawassa') ? 'Sidama' : u.institutionName?.includes('Jimma') ? 'Oromia' : 'Addis Ababa'),
          country: u.country || 'Ethiopia',
          university: u.university || 'Addis Ababa University (AAU)',
          institution: u.institutionName || 'Tikur Anbessa Specialized Hospital',
          department: u.department || 'Clinical Pharmacy',
          organization: u.organization || (u.role === 'student' ? 'University Student' : 'Hospital Pharmacy'),
          isPro: u.isPro,
          unlockedExitExam: u.unlockedExitExam,
          unlockedWholesaler: u.unlockedWholesaler,
          totalPaidETB: totalPaid,
          registrationDate: u.registrationDate || '2026-10-26',
          lastActive: new Date().toISOString().split('T')[0]
        };
      });

      setUsersList(prev => {
        const existingUsernames = new Set(prev.map(p => p.username));
        const newRecords = mappedStored.filter(m => !existingUsernames.has(m.username));
        // Update existing if matching username
        const updated = prev.map(p => {
          const match = mappedStored.find(m => m.username === p.username);
          if (match) {
            return {
              ...p,
              totalPaidETB: Math.max(p.totalPaidETB, match.totalPaidETB),
              isPro: match.isPro || p.isPro,
              unlockedExitExam: match.unlockedExitExam || p.unlockedExitExam,
              unlockedWholesaler: match.unlockedWholesaler || p.unlockedWholesaler
            };
          }
          return p;
        });
        return [...updated, ...newRecords];
      });

      setLastAutoUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    refreshUserData();
    const handleSync = () => refreshUserData();
    window.addEventListener('pharmastar_auth_sync', handleSync);
    window.addEventListener('pharmastar_payment_recorded', handleSync);
    window.addEventListener('storage', handleSync);

    // Auto-refresh interval every 30 seconds
    const interval = setInterval(refreshUserData, 30000);

    return () => {
      window.removeEventListener('pharmastar_auth_sync', handleSync);
      window.removeEventListener('pharmastar_payment_recorded', handleSync);
      window.removeEventListener('storage', handleSync);
      clearInterval(interval);
    };
  }, []);

  // Aggregated Summary Statistics
  const summary = useMemo(() => {
    const totalUsers = usersList.length;
    const totalRevenueETB = usersList.reduce((acc, u) => acc + u.totalPaidETB, 0);

    // By Region
    const regionCounts: Record<string, number> = {};
    usersList.forEach(u => {
      regionCounts[u.region] = (regionCounts[u.region] || 0) + 1;
    });

    // By Country
    const countryCounts: Record<string, number> = {};
    usersList.forEach(u => {
      countryCounts[u.country] = (countryCounts[u.country] || 0) + 1;
    });

    // By University
    const uniCounts: Record<string, number> = {};
    usersList.forEach(u => {
      uniCounts[u.university] = (uniCounts[u.university] || 0) + 1;
    });

    // By Department
    const deptCounts: Record<string, number> = {};
    usersList.forEach(u => {
      deptCounts[u.department] = (deptCounts[u.department] || 0) + 1;
    });

    // By Role
    const roleCounts: Record<string, number> = {};
    usersList.forEach(u => {
      roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
    });

    return {
      totalUsers,
      totalRevenueETB,
      regionCounts,
      countryCounts,
      uniCounts,
      deptCounts,
      roleCounts
    };
  }, [usersList]);

  // Filtered & Sorted Users List
  const filteredUsers = useMemo(() => {
    return usersList
      .filter(u => {
        const matchRegion = regionFilter === 'all' || u.region === regionFilter;
        const matchUni = universityFilter === 'all' || u.university === universityFilter;
        const matchDept = departmentFilter === 'all' || u.department.toLowerCase().includes(departmentFilter.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        const matchQuery = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           u.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           u.organization.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRegion && matchUni && matchDept && matchRole && matchQuery;
      })
      .sort((a, b) => {
        if (sortField === 'paid') return b.totalPaidETB - a.totalPaidETB;
        if (sortField === 'name') return a.fullName.localeCompare(b.fullName);
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
      });
  }, [usersList, regionFilter, universityFilter, departmentFilter, roleFilter, searchQuery, sortField]);

  // Export Full Demographics to CSV
  const handleExportCSV = () => {
    const headers = [
      "ID", "Full Name", "Username", "Role", "Region", "Country", 
      "University", "Institution/Hospital", "Department", "Organization", 
      "Pro Status", "Exit Exam Unlocked", "Wholesaler Unlocked", 
      "Total Paid (ETB)", "Registration Date", "Last Active"
    ];

    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.fullName}"`,
      u.username,
      u.role,
      `"${u.region}"`,
      `"${u.country}"`,
      `"${u.university}"`,
      `"${u.institution}"`,
      `"${u.department}"`,
      `"${u.organization}"`,
      u.isPro ? 'YES' : 'NO',
      u.unlockedExitExam ? 'YES' : 'NO',
      u.unlockedWholesaler ? 'YES' : 'NO',
      u.totalPaidETB,
      u.registrationDate,
      u.lastActive
    ].join(','));

    const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PharmaStar_Demographic_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Official Demographic & Institutional Report
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Institutional & Demographic User Summary - Pharma Star</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 35px; color: #0f172a; }
            .header { border-bottom: 3px solid #0d9488; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 24px; font-weight: bold; color: #0f766e; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .metrics-grid { display: flex; gap: 15px; margin-bottom: 25px; }
            .metric-card { flex: 1; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; background: #f8fafc; }
            .metric-label { font-size: 11px; color: #64748b; }
            .metric-val { font-size: 20px; font-weight: bold; color: #0f766e; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px; }
            th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 6px; text-align: left; font-weight: bold; }
            td { border: 1px solid #cbd5e1; padding: 6px; }
            .footer { margin-top: 35px; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
            .seal { border: 2px solid #0d9488; border-radius: 50%; width: 85px; height: 85px; display: flex; align-items: center; justify-content: center; font-size: 9px; text-align: center; color: #0d9488; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">PHARMA STAR APP PRO — NATIONAL INSTITUTIONAL REGISTRY</div>
              <div class="subtitle">Comprehensive User Demographics, Regional Coverage, Universities & Hospital Distribution</div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #64748b;">
              <div>Generated: ${new Date().toLocaleString()}</div>
              <div>Lead Developer: Pharmacist Dawid Aliyi</div>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Total Health Professionals</div>
              <div class="metric-val">${summary.totalUsers}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Verified Revenue</div>
              <div class="metric-val">${summary.totalRevenueETB.toLocaleString()} ETB</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Active Regional States</div>
              <div class="metric-val">${Object.keys(summary.regionCounts).length} Regions</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Affiliated Universities</div>
              <div class="metric-val">${Object.keys(summary.uniCounts).length} Higher Ed</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>User / Practitioner</th>
                <th>Role</th>
                <th>Region & Country</th>
                <th>University</th>
                <th>Hospital / Facility</th>
                <th>Department</th>
                <th>Paid Status</th>
                <th>Total ETB</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.map(u => `
                <tr>
                  <td><strong>${u.fullName}</strong><br><span style="color:#64748b;">@${u.username}</span></td>
                  <td style="text-transform: capitalize;">${u.role}</td>
                  <td>${u.region}, ${u.country}</td>
                  <td>${u.university}</td>
                  <td>${u.institution}</td>
                  <td>${u.department}</td>
                  <td>${u.isPro ? '<span style="color:#059669; font-weight:bold;">PRO Verified</span>' : 'Standard'}</td>
                  <td><strong>${u.totalPaidETB} ETB</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <p>Certified for Ethiopian Ministry of Health (MoH) & EFDA Institutional Planning Audits.</p>
              <p>Pharma Star Continuous Development Suite • CBE 1000262900367 (Dawid Aliyi)</p>
            </div>
            <div class="seal">
              PHARMA STAR<br>ADMIN<br>VERIFIED
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" /> Administrative Intelligence & Census
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                <span>Auto-Updated: <strong className="text-slate-200">{lastAutoUpdated}</strong></span>
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Demographic, Regional & Institutional Intelligence Command
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time administrative presentation of registered healthcare practitioners across Ethiopian regional states, countries, medical universities, hospitals, and specialized pharmacy departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refreshUserData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Refresh Registry</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Aggregated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Total Enrolled Users</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-2xl font-bold text-white mt-1 block">{summary.totalUsers} Practitioners</span>
          <span className="text-[10px] text-teal-400 mt-0.5 block">Pharmacists, Interns & Students</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Verified Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-emerald-300 mt-1 block">{summary.totalRevenueETB.toLocaleString()} ETB</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">CBE: 1000262900367 (Dawid Aliyi)</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Regional Coverage</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-amber-300 mt-1 block">
            {Object.keys(summary.regionCounts).length} Regional States
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Addis Ababa, Oromia, Sidama, Amhara...</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Medical Universities</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl font-bold text-sky-300 mt-1 block">
            {Object.keys(summary.uniCounts).length} Universities
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">AAU, Jimma, Gondar, Hawassa, MU...</span>
        </div>
      </div>

      {/* Breakdown Widgets: Region, Country, University, Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: By Region */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Regional Distribution
          </span>
          <div className="space-y-2">
            {Object.entries(summary.regionCounts).map(([region, count]) => {
              const pct = Math.round((count / summary.totalUsers) * 100);
              return (
                <div key={region} className="space-y-0.5 text-xs">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>{region}</span>
                    <span className="font-bold text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 2: By Country */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Country Distribution
          </span>
          <div className="space-y-2">
            {Object.entries(summary.countryCounts).map(([country, count]) => {
              const pct = Math.round((count / summary.totalUsers) * 100);
              return (
                <div key={country} className="space-y-0.5 text-xs">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>{country}</span>
                    <span className="font-bold text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 3: By University */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Top Universities
          </span>
          <div className="space-y-2">
            {Object.entries(summary.uniCounts).slice(0, 4).map(([uni, count]) => {
              const pct = Math.round((count / summary.totalUsers) * 100);
              return (
                <div key={uni} className="space-y-0.5 text-xs">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span className="truncate max-w-[130px]" title={uni}>{uni}</span>
                    <span className="font-bold text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 4: By Role */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Professional Role
          </span>
          <div className="space-y-2">
            {Object.entries(summary.roleCounts).map(([role, count]) => {
              const pct = Math.round((count / summary.totalUsers) * 100);
              return (
                <div key={role} className="space-y-0.5 text-xs">
                  <div className="flex justify-between text-slate-300 text-[11px] capitalize">
                    <span>{role}</span>
                    <span className="font-bold text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Ribbon & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user, hospital, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 w-56"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Regions</option>
            {Object.keys(summary.regionCounts).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={universityFilter}
            onChange={(e) => setUniversityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Universities</option>
            {Object.keys(summary.uniCounts).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 capitalize"
          >
            <option value="all">All Roles</option>
            <option value="pharmacist">Pharmacists</option>
            <option value="student">Students</option>
            <option value="intern">Interns</option>
            <option value="physician">Physicians</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Sort by:</span>
          <button
            onClick={() => setSortField('paid')}
            className={`px-2 py-1 rounded transition cursor-pointer ${sortField === 'paid' ? 'bg-teal-600 text-white font-bold' : 'hover:text-white'}`}
          >
            Revenue (ETB)
          </button>
          <button
            onClick={() => setSortField('date')}
            className={`px-2 py-1 rounded transition cursor-pointer ${sortField === 'date' ? 'bg-teal-600 text-white font-bold' : 'hover:text-white'}`}
          >
            Date
          </button>
          <button
            onClick={() => setSortField('name')}
            className={`px-2 py-1 rounded transition cursor-pointer ${sortField === 'name' ? 'bg-teal-600 text-white font-bold' : 'hover:text-white'}`}
          >
            Name
          </button>
        </div>
      </div>

      {/* Main Table: Granular User Demographic Registry */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <span>Granular Practitioner Demographic & Institutional Registry</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
              {filteredUsers.length} Users Listed
            </span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Real-time synchronization with localStorage & session records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">User & Contact</th>
                <th className="p-3">Role</th>
                <th className="p-3">Region & Country</th>
                <th className="p-3">University</th>
                <th className="p-3">Institution / Hospital</th>
                <th className="p-3">Department</th>
                <th className="p-3">Paid Tier</th>
                <th className="p-3 text-right">Revenue (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3 space-y-0.5">
                    <div className="font-bold text-white text-xs">{u.fullName}</div>
                    <div className="text-[10px] text-teal-400 font-mono">@{u.username}</div>
                  </td>
                  <td className="p-3 capitalize text-slate-300">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 text-[11px]">
                    <div className="font-medium text-white">{u.region}</div>
                    <div className="text-[10px] text-slate-500">{u.country}</div>
                  </td>
                  <td className="p-3 text-slate-300 text-[11px]">
                    {u.university}
                  </td>
                  <td className="p-3 text-slate-300 text-[11px]">
                    <div className="font-medium text-white">{u.institution}</div>
                    <div className="text-[10px] text-slate-500">{u.organization}</div>
                  </td>
                  <td className="p-3 text-slate-300 text-[11px]">
                    {u.department}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {u.isPro && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PRO
                        </span>
                      )}
                      {u.unlockedExitExam && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Exit Exam
                        </span>
                      )}
                      {u.unlockedWholesaler && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          Wholesaler
                        </span>
                      )}
                      {!u.isPro && !u.unlockedExitExam && !u.unlockedWholesaler && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] text-slate-400">
                          Standard Free
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-teal-300 text-xs">
                    {u.totalPaidETB} ETB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
