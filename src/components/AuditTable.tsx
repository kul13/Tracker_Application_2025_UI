import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { Category, Item, PersistedExpense, TimeFilter } from '../type';

const AuditTable: React.FC = () => {
  const [expenses, setExpenses] = useState<PersistedExpense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [catFilter, setCatFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

//   useEffect(() => {
//     Promise.all([
//       apiService.getExpenses(),
//       apiService.getCategories(),
//       apiService.getItems()
//     ]).then(([exp, cat, item]) => {
//       setExpenses(exp);
//       setCategories(cat);
//       setItems(item);
//     });
//   }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
    //   const matchCat = catFilter ? e.categoryId === catFilter : true;
    //   const matchItem = itemFilter ? e.itemId === itemFilter : true;

      let matchTime = true;
      if (timeFilter !== 'all') {
        const date = new Date(e.createdAt);
        const now = new Date();

        if (timeFilter === 'day')
          matchTime = date.toDateString() === now.toDateString();
        else if (timeFilter === 'week') {
          const d = new Date();
          d.setDate(now.getDate() - 7);
          matchTime = date >= d;
        } else if (timeFilter === 'month')
          matchTime = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        else if (timeFilter === 'year')
          matchTime = date.getFullYear() === now.getFullYear();
      }

      return 
    //   matchCat && matchItem && 
    //   matchTime;
    });
  }, [expenses, catFilter, itemFilter, timeFilter]);

  const filteredItems = useMemo(() => {
    return catFilter ? items.filter(i => i.categoryId === catFilter) : items;
  }, [items, catFilter]);

  const grandTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleExport = () => {
    const headers = ['Sl. No', 'User', 'Category', 'Item', 'Amount', 'Date'];
    const rows = filteredExpenses.map((e, i) => [
      i + 1,
      e.userName,
      e.categoryName,
      e.itemName,
      e.amount.toFixed(2),
      new Date(e.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_audit_${timeFilter}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Expense Audit Trail
          <span className="ml-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Read-Only
          </span>
        </h2>

        <button
          onClick={handleExport}
          title="Export filtered audit data as CSV"
          className="flex items-center bg-white border border-gray-300 px-5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
          <select
            value={catFilter}
            onChange={e => { setCatFilter(e.target.value); setItemFilter(''); }}
            className="w-full mt-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item</label>
          <select
            disabled={!catFilter}
            value={itemFilter}
            onChange={e => setItemFilter(e.target.value)}
            className="w-full mt-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Items</option>
            {filteredItems.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Timeframe</label>
          <div className="mt-1 flex bg-gray-100 p-1 rounded-lg">
            {(['all', 'day', 'week', 'month', 'year'] as TimeFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition
                ${timeFilter === f ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {{ all: 'All', day: 'Today', week: 'Last 7 Days', month: 'This Month', year: 'This Year' }[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Sl. No', 'User', 'Category', 'Item', 'Date', 'Amount (₹)'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((e, i) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{e.userName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                        {e.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{e.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      ₹{e.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-gray-900 text-white border-t-4 border-indigo-600">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">
                  Grand Total
                </td>
                <td className="px-6 py-4 text-lg font-bold text-right">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTable;
