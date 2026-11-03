import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ModalPortal from '../components/ModalPortal';
import {
  ListOrdered,
  Search,
  PlusCircle,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TestsCatalogPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E2EC] shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1F1F] tracking-tight flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D3E3FD] text-[#0B57D0] flex items-center justify-center">
              <ListOrdered className="w-4 h-4" />
            </div>
            <span>Master Test Tariff (74 Investigations)</span>
          </h1>
          <p className="text-xs text-[#74777F] mt-1">
            Preloaded with 74 standard laboratory tests from reference tariff sheet, biological reference intervals, and sample criteria.
          </p>
        </div>

        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm flex items-center space-x-2 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Test</span>
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E0E2EC] shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            placeholder="Search test name or code (e.g. CBC, LFT, Sugar F, ECG, Dengue, USG)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#F0F4F9] border border-[#E0E2EC] rounded-full text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B57D0] font-medium"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition text-xs ${
                activeCategory === cat
                  ? 'bg-[#C2E7FF] text-[#001D35] border border-[#7FCFFF] shadow-xs'
                  : 'bg-[#F0F4F9] text-[#444746] hover:bg-[#E3E8EF]'
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
          <div className="col-span-full py-16 text-center text-[#74777F]">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-5 h-5 border-2 border-[#0B57D0] border-t-transparent rounded-full animate-spin" />
              <span>Loading diagnostic catalog...</span>
            </div>
          </div>
        ) : tests.length > 0 ? (
          tests.map((test) => {
            const isExpanded = expandedTestId === test._id;
            return (
              <div
                key={test._id}
                className="bg-white rounded-3xl border border-[#E0E2EC] shadow-sm hover:shadow-m3-1 transition overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#0B57D0] bg-[#E8F0FE] px-2.5 py-0.5 rounded-full border border-[#D2E3FC]">
                        {test.code}
                      </span>
                      <span className="text-[10px] bg-[#F0F4F9] text-[#444746] font-semibold px-2.5 py-0.5 rounded-full ml-1.5 border border-[#E0E2EC]">
                        {test.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-base text-[#1F1F1F]">
                        ₹{test.price}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[#1F1F1F] text-xs mt-1 mb-2">
                    {test.name}
                  </h3>

                  {/* Meta */}
                  <div className="text-[11px] text-[#74777F] space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#74777F]" />
                      <span>Sample: <strong className="text-[#1F1F1F]">{test.sampleType || 'Venous Blood'}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#74777F]" />
                      <span>TAT: {test.turnaroundTime || 'Same Day'}</span>
                    </div>
                  </div>

                  {/* Parameters Accordion */}
                  {test.parameters && test.parameters.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-[#F0F4F9]">
                      <button
                        onClick={() => setExpandedTestId(isExpanded ? null : test._id)}
                        className="text-[11px] font-bold text-[#0B57D0] hover:underline flex items-center justify-between w-full"
                      >
                        <span>{test.parameters.length} Test Parameter(s) & Ranges</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {test.parameters.map((p, idx) => (
                            <div key={idx} className="bg-[#F8FAFD] p-2 rounded-xl text-[10px] text-[#444746] border border-[#E0E2EC]">
                              <div className="font-bold text-[#1F1F1F] flex justify-between">
                                <span>{p.name}</span>
                                {p.unit && <span className="font-mono text-[#74777F]">{p.unit}</span>}
                              </div>
                              <div className="text-[#74777F] text-[10px] mt-0.5">
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
                <div className="px-5 py-3 bg-[#F8FAFD] border-t border-[#E0E2EC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#74777F]">
                    Tariff Rate: <strong className="text-[#1F1F1F]">₹{test.price}</strong>
                  </span>

                  {user?.role === 'Admin' ? (
                    <button
                      onClick={() => {
                        setEditingTest(test);
                        setNewPrice(test.price);
                      }}
                      className="text-[#0B57D0] hover:text-[#0842A0] font-bold text-xs flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Price</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#74777F]">Standard Rate</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-[#74777F]">
            No diagnostic tests found in category "{activeCategory}".
          </div>
        )}
      </div>

      {/* EDIT PRICE MODAL (Material Light Theme) */}
      {editingTest && (
        <ModalPortal isOpen={!!editingTest} onClose={() => setEditingTest(null)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingTest(null);
            }}
          >
            <div className="bg-white rounded-3xl shadow-m3-4 max-w-sm w-full overflow-hidden border border-[#E0E2EC] my-auto">
              <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
                <h3 className="font-bold text-sm text-[#1F1F1F]">Update Tariff Price</h3>
                <button onClick={() => setEditingTest(null)} className="text-[#74777F] hover:text-[#1F1F1F]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePrice} className="p-6 space-y-4 text-xs">
                <div>
                  <div className="font-bold text-[#1F1F1F] text-sm">{editingTest.name}</div>
                  <div className="text-[11px] text-[#74777F] font-mono">{editingTest.code}</div>
                </div>

                <div>
                  <label className="block font-bold text-[#444746] mb-1">New Test Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl font-mono font-bold text-sm bg-[#F8FAFD] focus:bg-white focus:border-[#0B57D0]"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingTest(null)}
                    className="px-4 py-2 border border-[#C4C7C5] rounded-full text-[#444746] font-bold hover:bg-[#F0F4F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPrice}
                    className="px-5 py-2 bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold rounded-full shadow-sm disabled:opacity-50"
                  >
                    {savingPrice ? 'Updating...' : 'Save Price'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ADD NEW TEST MODAL (Material Light Theme) */}
      {showAddModal && (
        <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
          >
            <div className="bg-white rounded-3xl shadow-m3-4 max-w-lg w-full overflow-hidden border border-[#E0E2EC] my-auto">
              <div className="px-6 py-4 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between text-[#1F1F1F]">
                <h3 className="font-bold text-base text-[#1F1F1F]">Add Diagnostic Investigation</h3>
                <button onClick={() => setShowAddModal(false)} className="text-[#74777F] hover:text-[#1F1F1F]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTest} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#444746] mb-1">Test Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SERUM_FE"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl uppercase font-mono bg-[#F8FAFD]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#444746] mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl bg-white"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#444746] mb-1">Full Investigation Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SERUM IRON & TIBC PANEL"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl uppercase bg-[#F8FAFD]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#444746] mb-1">Tariff Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl font-mono font-bold bg-[#F8FAFD]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#444746] mb-1">Sample Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Serum"
                      value={formData.sampleType}
                      onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl bg-[#F8FAFD]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#444746] mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Hours"
                      value={formData.turnaroundTime}
                      onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#C4C7C5] rounded-2xl bg-[#F8FAFD]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E0E2EC] flex justify-end space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2 border border-[#C4C7C5] rounded-full text-[#444746] font-bold hover:bg-[#F0F4F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold rounded-full shadow-sm"
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
