import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Users, CheckCircle2, Clock, XCircle, Search, Filter, Download,
  Eye, Edit3, Trash2, QrCode, LogOut, ExternalLink, RefreshCw, AlertTriangle,
  Building, GraduationCap, MapPin, Phone, Mail, Calendar, Briefcase, FileSpreadsheet,
  Check, X, ChevronLeft, ChevronRight, Layers, UserCheck, Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Authentication State
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // Active Tab: 'dashboard' | 'candidates' | 'jobcard' | 'export'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data States
  const [stats, setStats] = useState({
    total: 0,
    todayCount: 0,
    jobCardsCount: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [districtStats, setDistrictStats] = useState([]);
  const [qualificationStats, setQualificationStats] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [qualificationFilter, setQualificationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Job Card Verification Tab States
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editCandidate, setEditCandidate] = useState(null);
  const [editStatus, setEditStatus] = useState('Pending');
  const [editNotes, setEditNotes] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Initial Authentication Check
  useEffect(() => {
    const savedToken = localStorage.getItem('yuvahub_admin_token');
    if (!savedToken) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setToken(savedToken);

    fetch('/api/admin/me', {
      headers: { 'Authorization': `Bearer ${savedToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.admin) {
          setAdmin(data.admin);
          setAuthLoading(false);
        } else {
          localStorage.removeItem('yuvahub_admin_token');
          localStorage.removeItem('yuvahub_admin_user');
          navigate('/admin/login', { replace: true });
        }
      })
      .catch(() => {
        localStorage.removeItem('yuvahub_admin_token');
        navigate('/admin/login', { replace: true });
      });
  }, [navigate]);

  // 2. Fetch Dashboard & Candidates Data
  const fetchData = async () => {
    if (!token) return;
    setDataLoading(true);

    try {
      const [statsRes, candidatesRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/candidates', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const statsData = await statsRes.json();
      const candidatesData = await candidatesRes.json();

      if (statsData.success) {
        setStats(statsData.stats || {});
        setDistrictStats(statsData.districtStats || []);
        setQualificationStats(statsData.qualificationStats || []);
      }

      if (candidatesData.success) {
        setCandidates(candidatesData.candidates || []);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
      showToast('डेटा लोड करताना त्रुटी आली.', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (token && !authLoading) {
      fetchData();
    }
  }, [token, authLoading]);

  // 3. Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      // Continue anyway
    }
    localStorage.removeItem('yuvahub_admin_token');
    localStorage.removeItem('yuvahub_admin_user');
    navigate('/admin/login', { replace: true });
  };

  // 4. Job Card Quick Verify
  const handleVerifySearch = async (e) => {
    if (e) e.preventDefault();
    if (!verifyCode.trim()) return;

    setVerifyLoading(true);
    setVerifyError('');
    setVerifyResult(null);

    try {
      const res = await fetch(`/api/admin/job-card/${encodeURIComponent(verifyCode.trim())}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success && data.candidate) {
        setVerifyResult(data.candidate);
      } else {
        setVerifyError(data.error || 'या कोडसाठी उमेदवार नोंदणी आढळली नाही.');
      }
    } catch (err) {
      setVerifyError('पडताळणी करताना तांत्रिक अडचण आली.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // 5. Update Candidate Status
  const handleSaveEdit = async () => {
    if (!editCandidate) return;
    setEditLoading(true);

    const id = editCandidate.candidateId || editCandidate._id || editCandidate.id;

    try {
      const res = await fetch(`/api/admin/candidates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editNotes
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`उमेदवार ${editCandidate.fullName} ची स्थिती '${editStatus}' म्हणून जतन केली.`);
        setEditCandidate(null);
        fetchData();
        if (verifyResult && (verifyResult._id === id || verifyResult.candidateId === id)) {
          setVerifyResult({ ...verifyResult, status: editStatus, adminNotes: editNotes });
        }
      } else {
        showToast(data.error || 'अपडेट करण्यात अडचण आली.', 'error');
      }
    } catch (err) {
      showToast('सर्व्हर एरर. पुन्हा प्रयत्न करा.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  // 6. Delete Candidate
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleteLoading(true);

    const id = deleteCandidate.candidateId || deleteCandidate._id || deleteCandidate.id;

    try {
      const res = await fetch(`/api/admin/candidates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        showToast(`उमेदवार ${deleteCandidate.fullName} ची नोंदणी हटवण्यात आली.`);
        setDeleteCandidate(null);
        fetchData();
        if (verifyResult && (verifyResult._id === id || verifyResult.candidateId === id)) {
          setVerifyResult(null);
        }
      } else {
        showToast(data.error || 'हटवण्यात अडचण आली.', 'error');
      }
    } catch (err) {
      showToast('सर्व्हर एरर. पुन्हा प्रयत्न करा.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // 7. CSV Export Trigger
  const handleExportCSV = () => {
    if (!candidates || candidates.length === 0) {
      showToast('निर्यात करण्यासाठी उमेदवार डेटा उपलब्ध नाही.', 'error');
      return;
    }

    const headers = [
      'Candidate ID', 'Full Name', 'Gender', 'DOB', 'Mobile', 'Email', 
      'District', 'Pincode', 'Address', 'Qualification', 'Stream', 
      'Passing Year', 'Work Status', 'Experience (Yrs)', 'Skills', 
      'Target Industry', 'Preferred Location', 'Status', 'Registration Date'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = [headers.join(',')];
    candidates.forEach(r => {
      rows.push([
        escapeCsv(r.candidateId || r._id || r.id),
        escapeCsv(r.fullName),
        escapeCsv(r.gender),
        escapeCsv(r.dateOfBirth),
        escapeCsv(r.contactNumber),
        escapeCsv(r.emailAddress),
        escapeCsv(r.district),
        escapeCsv(r.pincode),
        escapeCsv(r.permanentAddress),
        escapeCsv(r.educationalQualification || r.qualification),
        escapeCsv(r.coreStream),
        escapeCsv(r.yearOfPassing),
        escapeCsv(r.professionalStatus),
        escapeCsv(r.totalWorkExperience),
        escapeCsv(r.skillsSummary),
        escapeCsv(r.targetIndustries),
        escapeCsv(r.preferredJobLocation),
        escapeCsv(r.status || 'Pending'),
        escapeCsv(r.createdAt)
      ].join(','));
    });

    const csvBlob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `YuvaHub_Candidates_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('उमेदवार नोंदणी CSV फाइल यशस्वीरित्या डाऊनलोड झाली!');
  };

  // Filtered Candidates List
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = (c.candidateId || c._id || c.id || '').toLowerCase().includes(q);
        const nameMatch = (c.fullName || '').toLowerCase().includes(q);
        const phoneMatch = (c.contactNumber || '').toLowerCase().includes(q);
        const emailMatch = (c.emailAddress || '').toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !phoneMatch && !emailMatch) return false;
      }

      // Status Filter
      if (statusFilter !== 'all') {
        const st = (c.status || 'Pending').toLowerCase();
        if (st !== statusFilter.toLowerCase()) return false;
      }

      // District Filter
      if (districtFilter !== 'all') {
        const d = (c.district || '').toLowerCase();
        if (!d.includes(districtFilter.toLowerCase())) return false;
      }

      // Qualification Filter
      if (qualificationFilter !== 'all') {
        const q = (c.educationalQualification || c.qualification || '').toLowerCase();
        if (!q.includes(qualificationFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [candidates, searchQuery, statusFilter, districtFilter, qualificationFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage) || 1;
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(start, start + itemsPerPage);
  }, [filteredCandidates, currentPage]);

  // Unique Districts & Qualifications for filters
  const uniqueDistricts = useMemo(() => {
    const set = new Set();
    candidates.forEach(c => {
      if (c.district) set.add(c.district.trim());
    });
    return Array.from(set);
  }, [candidates]);

  const uniqueQualifications = useMemo(() => {
    const set = new Set();
    candidates.forEach(c => {
      const q = c.educationalQualification || c.qualification;
      if (q) set.add(q.trim());
    });
    return Array.from(set);
  }, [candidates]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">प्रशासकीय पॅनल लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 animate-bounce transition-all ${
          toastMessage.type === 'error'
            ? 'bg-red-900 text-white border-red-700'
            : 'bg-slate-900 text-white border-orange-500/40'
        }`}>
          {toastMessage.type === 'error' ? (
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">YuvaHub</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                नोकरी महोत्सव २०२६ • प्रशासकीय व्यवस्थापन कक्ष
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>मुख्य वेबसाइट</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-emerald-400 leading-none">
                  सुपर ॲडमिन (SuperAdmin)
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 px-3 py-1.5 rounded-lg transition-colors"
                title="लॉगआउट करा"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>डॅशबोर्ड (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'candidates'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>उमेदवार यादी ({candidates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('jobcard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'jobcard'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>जॉब कार्ड पडताळणी (Verify Pass)</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'export'
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>डेटा निर्यात (CSV Export)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Control Bar with Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'प्रशासकीय आढावा आणि आकडेवारी (Dashboard)'}
              {activeTab === 'candidates' && 'नोंदणीकृत उमेदवार व्यवस्थापन (Candidate Management)'}
              {activeTab === 'jobcard' && 'जॉब कार्ड युनिक कोड पडताळणी (Job Card Verification)'}
              {activeTab === 'export' && 'उमेदवार डेटा निर्यात (Candidate Data Export)'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              धाराशिव नोकरी महोत्सव २०२६ • युवाहब डेटाबेस
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={dataLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 shadow-sm transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin text-orange-600' : ''}`} />
              <span>रिफ्रेश करा</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm shadow-orange-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV डाऊनलोड</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Total Candidates */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">एकूण उमेदवार</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.total || 0}</div>
                <p className="text-[11px] text-slate-400 mt-1">Total Registrations</p>
              </div>

              {/* Today's Registrations */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">आजची नोंदणी</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-orange-600">{stats.todayCount || 0}</div>
                <p className="text-[11px] text-slate-400 mt-1">Today's New</p>
              </div>

              {/* Job Cards Generated */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">जॉब कार्ड्स</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-indigo-700">{stats.jobCardsCount || stats.total || 0}</div>
                <p className="text-[11px] text-slate-400 mt-1">Job Cards Issued</p>
              </div>

              {/* Approved */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">मंजूर / पात्र</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600">{stats.approved || 0}</div>
                <p className="text-[11px] text-slate-400 mt-1">Approved</p>
              </div>

              {/* Pending */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">प्रलंबित</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600">{stats.pending || 0}</div>
                <p className="text-[11px] text-slate-400 mt-1">Pending Verification</p>
              </div>

              {/* Rejected */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">नाकारलेले</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-red-600">{stats.rejected || 0}</div>
                <p className="text-[11px] text-slate-400 mt-1">Rejected</p>
              </div>
            </div>

            {/* Breakdown Charts / Progress Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* District Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-sm text-slate-900">जिल्हावार नोंदणी (District Distribution)</h3>
                  </div>
                  <span className="text-xs text-slate-400">{districtStats.length} जिल्हे</span>
                </div>
                <div className="space-y-3">
                  {districtStats.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">माहिती उपलब्ध नाही</p>
                  ) : (
                    districtStats.map((item, idx) => {
                      const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{item.district}</span>
                            <span>{item.count} उमेदवार ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Qualification Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-sm text-slate-900">शैक्षणिक पात्रता (Qualifications)</h3>
                  </div>
                  <span className="text-xs text-slate-400">{qualificationStats.length} प्रवर्ग</span>
                </div>
                <div className="space-y-3">
                  {qualificationStats.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">माहिती उपलब्ध नाही</p>
                  ) : (
                    qualificationStats.map((item, idx) => {
                      const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span className="truncate pr-2">{item.qualification}</span>
                            <span className="flex-shrink-0">{item.count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    अलीकडील नोंदणी (Recent Candidate Registrations)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    नुकत्याच झालेल्या नोंदणींची संक्षिप्त यादी
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>सर्व पहा</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">कॅंडिडेट आयडी</th>
                      <th className="py-3 px-4">नाव (Full Name)</th>
                      <th className="py-3 px-4">मोबाईल</th>
                      <th className="py-3 px-4">जिल्हा</th>
                      <th className="py-3 px-4">पात्रता</th>
                      <th className="py-3 px-4">स्थिती</th>
                      <th className="py-3 px-4 text-right">कृती (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidates.slice(0, 5).map((candidate, idx) => (
                      <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 text-xs">
                          {candidate.candidateId || candidate._id || candidate.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {candidate.fullName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {candidate.contactNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {candidate.district || 'धाराशिव'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {candidate.educationalQualification || candidate.qualification || 'Graduate'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            (candidate.status || 'Pending').toLowerCase() === 'approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : (candidate.status || 'Pending').toLowerCase() === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {candidate.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="तपशील पहा"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {candidates.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                          कोणतीही नोंदणी आढळली नाही.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CANDIDATES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'candidates' && (
          <div className="space-y-4">
            {/* Search and Filter Panel */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="नाव, आयडी, मोबाईल किंवा ईमेल..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="all">सर्व स्थिती (All Status)</option>
                    <option value="Pending">प्रलंबित (Pending)</option>
                    <option value="Approved">मंजूर (Approved)</option>
                    <option value="Rejected">नाकारलेले (Rejected)</option>
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <select
                    value={districtFilter}
                    onChange={(e) => {
                      setDistrictFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="all">सर्व जिल्हे (All Districts)</option>
                    {uniqueDistricts.map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Qualification Filter */}
                <div>
                  <select
                    value={qualificationFilter}
                    onChange={(e) => {
                      setQualificationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    <option value="all">सर्व पात्रता (All Qualifications)</option>
                    {uniqueQualifications.map((q, idx) => (
                      <option key={idx} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Info & Reset Button */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                <div>
                  <span>एकूण शोध निकाल: </span>
                  <span className="font-bold text-slate-900">{filteredCandidates.length}</span>
                  <span> पैकी </span>
                  <span className="font-bold text-slate-900">{candidates.length}</span>
                  <span> उमेदवार</span>
                </div>

                {(searchQuery || statusFilter !== 'all' || districtFilter !== 'all' || qualificationFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDistrictFilter('all');
                      setQualificationFilter('all');
                      setCurrentPage(1);
                    }}
                    className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>फिल्टर्स काढा (Reset)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3.5 px-4">कॅंडिडेट आयडी / जॉब कोड</th>
                      <th className="py-3.5 px-4">उमेदवाराचे नाव</th>
                      <th className="py-3.5 px-4">संपर्क व ईमेल</th>
                      <th className="py-3.5 px-4">जिल्हा</th>
                      <th className="py-3.5 px-4">पात्रता आणि शाखा</th>
                      <th className="py-3.5 px-4">अनुभव</th>
                      <th className="py-3.5 px-4">नोंदणी तारीख</th>
                      <th className="py-3.5 px-4">स्थिती</th>
                      <th className="py-3.5 px-4 text-right">कृती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedCandidates.map((candidate, idx) => (
                      <tr key={idx} className="hover:bg-orange-50/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                            {candidate.candidateId || candidate._id || candidate.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {candidate.fullName}
                          {candidate.gender && (
                            <span className="block text-[11px] font-normal text-slate-400">
                              {candidate.gender}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-semibold text-slate-800">{candidate.contactNumber}</div>
                          {candidate.emailAddress && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                              {candidate.emailAddress}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {candidate.district || 'धाराशिव'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="font-medium">{candidate.educationalQualification || candidate.qualification || 'Graduate'}</div>
                          {candidate.coreStream && (
                            <div className="text-[11px] text-slate-400">{candidate.coreStream}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {candidate.professionalStatus || (candidate.totalWorkExperience ? `${candidate.totalWorkExperience} वर्षे` : 'नवशिक्या')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {candidate.createdAt
                            ? new Date(candidate.createdAt).toLocaleDateString('mr-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            (candidate.status || 'Pending').toLowerCase() === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : (candidate.status || 'Pending').toLowerCase() === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {candidate.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setSelectedCandidate(candidate)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="संपूर्ण तपशील पहा"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditCandidate(candidate);
                                setEditStatus(candidate.status || 'Pending');
                                setEditNotes(candidate.adminNotes || '');
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                              title="स्थिती बदला"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(candidate)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="हटवा"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedCandidates.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          <p className="text-sm font-semibold">कोणतेही उमेदवार सापडले नाहीत.</p>
                          <p className="text-xs mt-1">कृपया शोध शब्द किंवा फिल्टर बदलून पहा.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 bg-slate-50/50">
                  <div>
                    पान <span className="font-bold text-slate-900">{currentPage}</span> पैकी{' '}
                    <span className="font-bold text-slate-900">{totalPages}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors ${
                          currentPage === page
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: JOB CARD VERIFICATION TOOL */}
        {/* ======================================================== */}
        {activeTab === 'jobcard' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                जॉब कार्ड त्वरित पडताळणी (Quick Job Card Lookup)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                उमेदवाराचा जॉब कार्ड युनिक कोड (उदा. MP-JOB-2026-XXXXXX) किंवा नोंदणीकृत मोबाईल नंबर टाकून माहिती तपासा.
              </p>

              <form onSubmit={handleVerifySearch} className="mt-6 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="उदा. MP-JOB-2026-272100 किंवा 9823456789"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {verifyLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>पडताळणी करा</span>
                </button>
              </form>

              {verifyError && (
                <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 justify-center">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}
            </div>

            {/* Verification Result Card */}
            {verifyResult && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
                {/* Header Band */}
                <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-orange-400 font-semibold tracking-wide">
                        महाराष्ट्र शासन अधिकृत जॉब कार्ड
                      </p>
                      <h3 className="text-lg font-bold">{verifyResult.fullName}</h3>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    (verifyResult.status || 'Pending').toLowerCase() === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : (verifyResult.status || 'Pending').toLowerCase() === 'rejected'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {verifyResult.status || 'Pending'}
                  </span>
                </div>

                {/* Candidate Info Grid */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block text-[11px]">जॉब कार्ड युनिक कोड</span>
                      <span className="font-mono font-bold text-orange-600 text-sm">
                        {verifyResult.candidateId || verifyResult._id}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">मोबाईल नंबर</span>
                      <span className="font-bold text-slate-800">{verifyResult.contactNumber}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">ईमेल आयडी</span>
                      <span className="text-slate-800">{verifyResult.emailAddress || 'नोंद नाही'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">जिल्हा / राज्य</span>
                      <span className="text-slate-800">{verifyResult.district || 'धाराशिव'}, Maharashtra</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">शैक्षणिक पात्रता</span>
                      <span className="font-bold text-slate-800">{verifyResult.educationalQualification || verifyResult.qualification}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">शाखा (Stream)</span>
                      <span className="text-slate-800">{verifyResult.coreStream || 'General'}</span>
                    </div>
                  </div>

                  {verifyResult.skillsSummary && (
                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 block text-[11px]">कौशल्ये (Skills)</span>
                      <span className="text-slate-700 font-medium">{verifyResult.skillsSummary}</span>
                    </div>
                  )}

                  {/* Actions for this candidate */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditCandidate(verifyResult);
                        setEditStatus(verifyResult.status || 'Pending');
                        setEditNotes(verifyResult.adminNotes || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>स्थिती बदला</span>
                    </button>

                    <button
                      onClick={() => setSelectedCandidate(verifyResult)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>संपूर्ण डिजिटल पास पहा</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CSV EXPORT DETAILS */}
        {/* ======================================================== */}
        {activeTab === 'export' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                उमेदवार नोंदणी संपूर्ण डेटा निर्यात (CSV Format)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                सर्व नोंदणीकृत उमेदवारांची संपूर्ण माहिती एक्सेल / सीएसव्ही (Excel Compatible CSV) स्वरूपात थेट डाऊनलोड करा.
              </p>

              <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  निर्यात केल्या जाणाऱ्या स्तंभांची यादी (Export Columns):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 pt-2 font-mono text-[11px]">
                  <span>• Candidate ID</span>
                  <span>• Full Name</span>
                  <span>• Gender & DOB</span>
                  <span>• Mobile Number</span>
                  <span>• Email Address</span>
                  <span>• District & Pincode</span>
                  <span>• Address Details</span>
                  <span>• Qualification</span>
                  <span>• Core Stream</span>
                  <span>• Passing Year</span>
                  <span>• Work Status</span>
                  <span>• Experience (Yrs)</span>
                  <span>• Skills Summary</span>
                  <span>• Target Industries</span>
                  <span>• Registration Status</span>
                  <span>• Timestamp (ISO)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>सर्व उमेदवारांची CSV डाऊनलोड करा ({candidates.length} नोंदी)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: CANDIDATE VIEW DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 to-blue-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{selectedCandidate.fullName}</h3>
                  <p className="text-xs text-orange-400 font-mono">
                    ID: {selectedCandidate.candidateId || selectedCandidate._id || selectedCandidate.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              {/* Section 1: Personal Information */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-1.5 border-b pb-1">
                  <UserCheck className="w-4 h-4" />
                  <span>वैयक्तिक माहिती (Personal Details)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">पूर्ण नाव</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">लिंग (Gender)</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">जन्मतारीख (DOB)</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.dateOfBirth || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">मोबाईल नंबर</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.contactNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">ईमेल पत्ता</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.emailAddress || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Address Information */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-1.5 border-b pb-1">
                  <MapPin className="w-4 h-4" />
                  <span>पत्ता आणि निवास (Address)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">कायमचा पत्ता</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.permanentAddress || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">जिल्हा</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.district || 'धाराशिव'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">पिनकोड</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.pincode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">राज्य</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.state || 'Maharashtra'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Educational Qualifications */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-1.5 border-b pb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>शिक्षण आणि पात्रता (Education)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">शैक्षणिक पात्रता</span>
                    <span className="font-semibold text-slate-800">
                      {selectedCandidate.educationalQualification || selectedCandidate.qualification || 'Graduate'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">मुख्य शाखा / विषय</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.coreStream || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">उत्तीर्ण वर्ष</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.yearOfPassing || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Professional & Preferences */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-1.5 border-b pb-1">
                  <Briefcase className="w-4 h-4" />
                  <span>अनुभव आणि प्राधान्ये (Career & Preferences)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">सद्य स्थिती</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.professionalStatus || 'Fresher'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">कामाचा अनुभव</span>
                    <span className="font-semibold text-slate-800">
                      {selectedCandidate.totalWorkExperience ? `${selectedCandidate.totalWorkExperience} वर्षे` : '0 वर्षे'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">पसंतीचे ठिकाण</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.preferredJobLocation || 'Dharashiv'}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-400 block text-[11px]">कौशल्ये (Skills)</span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.skillsSummary || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Admin Status & Registration Date */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">नोंदणी दिनांक</span>
                    <span className="font-medium text-slate-700">
                      {selectedCandidate.createdAt
                        ? new Date(selectedCandidate.createdAt).toLocaleString('mr-IN')
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">सद्य स्थिती</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      (selectedCandidate.status || 'Pending').toLowerCase() === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : (selectedCandidate.status || 'Pending').toLowerCase() === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedCandidate.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {selectedCandidate.adminNotes && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-700">प्रशासकीय टिप्पणी (Admin Notes): </span>
                    {selectedCandidate.adminNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditCandidate(selectedCandidate);
                  setEditStatus(selectedCandidate.status || 'Pending');
                  setEditNotes(selectedCandidate.adminNotes || '');
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>स्थिती संपादित करा</span>
              </button>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT CANDIDATE STATUS */}
      {/* ======================================================== */}
      {editCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base">उमेदवार स्थिती बदला</h3>
              </div>
              <button
                onClick={() => setEditCandidate(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500">उमेदवाराचे नाव:</p>
                <p className="font-bold text-slate-900 text-sm">{editCandidate.fullName}</p>
                <p className="text-[11px] font-mono text-orange-600">
                  {editCandidate.candidateId || editCandidate._id}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  नवीन स्थिती निवडा (Change Status)
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                >
                  <option value="Pending">प्रलंबित (Pending)</option>
                  <option value="Approved">मंजूर / पात्र (Approved)</option>
                  <option value="Rejected">नाकारलेले (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  प्रशासकीय टिप्पणी किंवा शेरा (Remarks / Notes)
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="उदा. कागदपत्रे तपासली, नोकरी मेळाव्यास पात्र..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                ></textarea>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditCandidate(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                रद्द करा
              </button>
              <button
                type="button"
                disabled={editLoading}
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
              >
                {editLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>बदल सेव्ह करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">नोंदणी कायमस्वरूपी हटवायची?</h3>
            <p className="text-xs text-slate-500 mt-1">
              तुम्ही उमेदवार <strong className="text-slate-800">{deleteCandidate.fullName}</strong> (
              <span className="font-mono text-orange-600">{deleteCandidate.candidateId || deleteCandidate._id}</span>
              ) ची नोंदणी हटवत आहात. ही कृती पूर्ववत करता येणार नाही.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                रद्द करा
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {deleteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>होय, हटवा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © 2026 YuvaHub • धाराशिव नोकरी महोत्सव २०२६ • सर्व हक्क सुरक्षित
      </footer>
    </div>
  );
}
