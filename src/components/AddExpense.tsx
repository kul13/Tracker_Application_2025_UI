import React, { useState, useEffect, use, useRef } from 'react';
import { categoryService, expenseService } from '../services/api';
import { Category, Item, ExpenseEntry } from '../type';
import toast from 'react-hot-toast';
import { Modal } from '../components/Modal';
import { Navigate, useNavigate } from 'react-router-dom';

const AddExpenseUI = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [selectedItemId, setSelectedItemId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState<string | ''>('');
  const [gridEntries, setGridEntries] = useState<ExpenseEntry[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const [expenseDate, setExpenseDate] = useState<string>(today);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const Navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId = Number(e.target.value);

    setSelectedCategoryId(categoryId);
    setSelectedItemId('');
    setItems([]);

    if (!categoryId) return;

    try {
      const data = await categoryService.getItemsByCategory(categoryId);
      setItems(data);
    } catch (error) {
      console.error('Failed to load items', error);
    }
  };
  const addToGrid = async () => {
    if (!categories || (!items) || !amount) {
      toast.error('Please fill all required fields');
      return;
    }
    const category = categories.find(c => c.id === selectedCategoryId);
    const item = items.find(i => i.id === selectedItemId);

    if (!category || !item) return;

    //EDITING LOGIC

    if (editingRowId !== null) {
      setGridEntries(prev =>
        prev.map(e =>
          e.id === editingRowId
            ? {
              ...e,
              categoryId: Number(category.id),
              categoryName: category.name,
              itemId: Number(item.id),
              itemName: item.name,
              amount: Number(amount),
              notes: notes?.trim() || '',
              expenseDate
            }
            : e
        )

      );

      setEditingRowId(null);
      toast.success('Entry updated successfully!');
    }
    else {


      const newEntry: ExpenseEntry = {
        id: Date.now(),
        categoryId: Number(category.id),
        categoryName: category.name,
        itemId: Number(item.id),
        itemName: item.name,
        amount: Number(amount),
        totalAmount: Number(totalAmount),
        notes: notes?.trim() || "",
        expenseDate
      };

      setGridEntries(prev => [...prev, newEntry]);
      // TOAST SUCCESS MESSAGE
      toast.success('Entry added to grid');
    }

    // reset inputs
    setSelectedItemId('');
    setAmount('');
    setNotes('');
  };
  const updateEntryAmount = (id: number, value: string) => {
    setGridEntries(prev =>
      prev.map(e =>
        e.id === id ? { ...e, amount: Number(value) } : e
      )
    );
  };
  const totalAmount = gridEntries.reduce((sum, e) => sum + e.amount, 0);
  const removeFromGrid = (id: number) => {
    setGridEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSaveAll = async () => {
    if (gridEntries.length === 0) {
      toast.error('No entries to submit');
      return;
    }

    const payloadExpenses = gridEntries.map(e => ({
      amount: e.amount,
      date: e.expenseDate,
      categoryId: e.categoryId,
      itemId: e.itemId,
      notes: e.notes || undefined,
      totalAmount: totalAmount
    }));

    try {
      await expenseService.addBulkExpenses(payloadExpenses);
      toast.success('Expenses submitted successfully!');
      toast.success('Click on View Audit to see details', { duration: 4000 });
      setGridEntries([]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to submit expenses', error);
      toast.error('Failed to submit expenses');
    }
  };

  const handleEdit = (entry: ExpenseEntry) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedCategoryId(entry.categoryId);
    setSelectedItemId(entry.itemId);
    setAmount(entry.amount.toString());
    setNotes(entry.notes || '');
    setExpenseDate(entry.expenseDate);

    setEditingRowId(entry.id);
  };

  const cancelEdit = () => {
    setSelectedCategoryId('');
    setSelectedItemId('');
    setAmount('');
    setNotes('');
    setExpenseDate(today);
    setEditingRowId(null);
  }

  const clearGrid = () => {
    setGridEntries([]);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

      {/* INPUT SECTION */}
      <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">+</span>
          Enter Expense Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* CATEGORY */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              className="w-full bg-black text-white rounded-lg px-4 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* ITEM */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Item</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedItemId}
                disabled={!selectedCategoryId}
                onChange={(e) => setSelectedItemId(Number(e.target.value))}
                className="flex-1 bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              {/* <button className="bg-gray-100 px-4 py-2 rounded-lg border">+</button> */}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              max={today}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full bg-black text-white rounded-lg px-4 py-2 [color-scheme:dark]"
            />
          </div>
          {/* AMOUNT */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/70 font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black text-white rounded-lg pl-8 pr-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* NOTES */}
        <div className="mt-4 sm:mt-6">
          <label className="text-sm font-medium text-gray-700">
            Notes / Description (Optional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
            placeholder="Add any specific details..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {/* <button onClick={addToGrid} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all">
            {editingRowId ? 'Update Entry' : 'Add to Grid'}
          </button> */}
          {editingRowId && (
            <button
              onClick={cancelEdit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-2.5 rounded-lg font-semibold border border-gray-300 shadow-sm transition-all active:scale-95 active:scale-95">
              Cancel
            </button>
          )}
          <button
            onClick={addToGrid}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95">
            {editingRowId ? 'Update Entry' : 'Add to Grid'}
          </button>
        </div>

      </section>
      {/* GRID SECTION */}
      {gridEntries.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Review Entries</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {gridEntries.length} {gridEntries.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">SlNo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount (₹)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Notes</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gridEntries.map((e, index) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{e.expenseDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{e.categoryName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{e.itemName}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={e.amount}
                        onChange={(ev) => updateEntryAmount(e.id, ev.target.value)}
                        className="w-32 bg-black text-white border border-black rounded px-2 py-1 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {e.notes ? (
                        <button
                          onClick={() => setSelectedNote(e.notes)}
                          className="text-indigo-500 hover:text-indigo-700 p-1.5 rounded-full hover:bg-indigo-50 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeFromGrid(e.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-all"
                        title="Delete Entry"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <button
                        onClick={() => handleEdit(e)}
                        className="text-indigo-500 hover:text-indigo-700 p-1.5 rounded-full hover:bg-indigo-50 transition-all"
                        title="Edit Entry"
                      >
                        {/* Pencil Icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M11 5h2m-1 0v14m-7-7h14" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-indigo-50 font-bold">
                <tr>
                  <td colSpan={4} className="px-6 py-4  text-right text-indigo-700 uppercase tracking-wider">Total Amount:</td>
                  <td className="px-6 py-4 bg-indigo-100 text-lg text-indigo-900" colSpan={3}>₹{totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
            <button
              onClick={clearGrid}
              className="px-6 py-2 text-gray-600 font-medium hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleSaveAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2.5 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all"
            >
              Submit Expenses
            </button>
          </div>
        </section>
        
      )}
      <div ref={bottomRef}></div>
      {/* NOTES MODAL */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title="Expense Note"
      >
        {selectedNote}
      </Modal>

    </div>


  );
};

export default AddExpenseUI;