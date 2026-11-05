import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ModalPortal from '../components/ModalPortal';
import {
  ListOrdered,
  Search,
  PlusCircle,
  Edit2,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  RotateCcw,
  Check,
  Loader2
} from 'lucide-react';

export default function TestsCatalogPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedTestId, setExpandedTestId] = useState(null);

  // Edit Price Modal
  const [editingTest, setEditingTest] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  // Add Test Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Hematology',
    sampleType: 'Venous Blood',
    price: '',
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    instructions: ''
  });
  const [creating, setCreating] = useState(false);

  const categories = [
    'All',
    'Hematology',
    'Biochemistry',
    'Liver Function',
    'Kidney & Renal',
    'Lipid & Cardiac',
    'Endocrine & Thyroid',
    'Serology & Immunology',
    'Card Tests',
    'Clinical Pathology',
    'Cytology & Biopsy',
    'Radiology & Diagnostic'
  ];

  useEffect(() => {
    fetchTests();
  }, [searchTerm, activeCategory]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await api.getTests({
        category: activeCategory,
        search: searchTerm,
        activeOnly: 'false'
      });
      if (res.success) {
        setTests(res.tests);
      }
    } catch (err) {
      console.error('Failed to load tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOfficialTariff = async () => {
    try {
      setSyncing(true);
      const res = await api.syncTariff();
      if (res.success) {
        setSyncMsg(`Synced ${res.count || 74} official clinic tests!`);
        setTimeout(() => setSyncMsg(''), 4000);
        fetchTests();
      }
    } catch (err) {
      alert(err.message || 'Failed to sync tariff');
    } finally {
      setSyncing(false);
    }
  };

  const handleSavePrice = async (e) => {
    e.preventDefault();
    if (!editingTest || isNaN(newPrice)) return;
    try {
      setSavingPrice(true);
      const res = await api.updateTest(editingTest._id, { price: Number(newPrice) });
      if (res.success) {
        setEditingTest(null);
        fetchTests();
      }
    } catch (err) {
      alert(err.message || 'Failed to update test price');
    } finally {
      setSavingPrice(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.price) return;
    try {
      setCreating(true);
      const res = await api.createTest({
        ...formData,
        price: Number(formData.price)
      });
      if (res.success) {
        setShowAddModal(false);
        setFormData({
          code: '',
          name: '',
          category: 'Hematology',
          sampleType: 'Venous Blood',
          price: '',
          turnaroundTime: 'Same Day',
          testType: 'quantitative',
          instructions: ''
        });
        fetchTests();
      }
    } catch (err) {
      alert(err.message || 'Failed to create test');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ListOrdered className="w-4 h-4" />
            </div>
            <span>Diagnostic Tests & Tariffs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Laboratory test catalog, investigation parameters, reference ranges, and tariff rates.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          {syncMsg && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{syncMsg}</span>
            </span>
          )}

          <button
            onClick={handleSyncOfficialTariff}
            disabled={syncing}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
            title="Reload/Synchronize the 74 tests from the official clinic tariff rate sheet"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Official Tariff (74)'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Test</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search test name or code (e.g. CBC, LFT, Sugar F, ECG, Dengue, USG)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition text-xs ${
                activeCategory === cat
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/40 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Test Tariff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500">
            <div className="flex justify-center items-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span>Loading diagnostic catalog...</span>
            </div>
          </div>
        ) : tests.length > 0 ? (
          tests.map((test) => {
            const isExpanded = expandedTestId === test._id;
            return (
              <div
                key={test._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-4 sm:p-5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/40">
                        {test.code}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2 py-0.5 rounded-md">
                        {test.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        ₹{test.price}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mt-1 mb-2">
                    {test.name}
                  </h3>

                  {/* Meta */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sample: <strong className="text-slate-700 dark:text-slate-300 font-medium">{test.sampleType || 'Venous Blood'}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>TAT: {test.turnaroundTime || 'Same Day'}</span>
                    </div>
                  </div>

                  {/* Parameters Accordion */}
                  {test.parameters && test.parameters.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setExpandedTestId(isExpanded ? null : test._id)}
                        className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between w-full"
                      >
                        <span>{test.parameters.length} Test Parameter(s) & Ranges</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {test.parameters.map((p, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                              <div className="font-medium text-slate-900 dark:text-white flex justify-between">
                                <span>{p.name}</span>
                                {p.unit && <span className="font-mono text-slate-400">{p.unit}</span>}
                              </div>
                              <div className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">
                                Ref: {p.refRangeGeneral || `${p.refRangeMale || ''} / ${p.refRangeFemale || ''}`.trim() || 'Descriptive'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-2.5 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tariff: <strong className="text-slate-900 dark:text-white font-mono">₹{test.price}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setEditingTest(test);
                      setNewPrice(test.price);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Rate</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500">
            No diagnostic tests found in category "{activeCategory}".
          </div>
        )}
      </div>

      {/* EDIT PRICE MODAL */}
      {editingTest && (
        <ModalPortal isOpen={!!editingTest} onClose={() => setEditingTest(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingTest(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Update Tariff Rate</h3>
                <button onClick={() => setEditingTest(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePrice} className="p-5 space-y-4 text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{editingTest.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{editingTest.code}</div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">New Test Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingTest(null)}
                    className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPrice}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs disabled:opacity-50 transition"
                  >
                    {savingPrice ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ADD NEW TEST MODAL */}
      {showAddModal && (
        <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Add Diagnostic Investigation</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTest} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Test Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SERUM_FE"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl uppercase font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Investigation Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SERUM IRON & TIBC PANEL"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl uppercase bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tariff Rate (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Sample Specimen</label>
                    <input
                      type="text"
                      placeholder="e.g. Serum"
                      value={formData.sampleType}
                      onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">TAT</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Hours"
                      value={formData.turnaroundTime}
                      onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition"
                  >
                    {creating ? 'Saving...' : 'Add to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
