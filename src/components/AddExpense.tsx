import React from 'react';

export const AddExpenseUI = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

      {/* INPUT SECTION */}
      <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
            +
          </span>
          Enter Expense Details
        </h2>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* CATEGORY */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select className="w-full bg-black text-white rounded-lg px-4 py-2">
              <option>Select Category</option>
            </select>
          </div>

          {/* ITEM */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Item</label>

            {/* STACK ON MOBILE */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select className="flex-1 bg-black text-white rounded-lg px-4 py-2">
                <option>Select Item</option>
              </select>
              <button className="bg-gray-100 px-4 py-2 rounded-lg border">
                +
              </button>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/70 font-bold">₹</span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-black text-white rounded-lg pl-8 pr-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* NOTES */}
        <div className="mt-4 sm:mt-6">
          <label className="text-sm font-medium text-gray-700">
            Notes / Description
          </label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
            placeholder="Add any specific details..."
          />
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-6 flex justify-end">
          <button className="bg-indigo-600 text-white w-full sm:w-auto px-8 py-2.5 rounded-lg font-semibold">
            Add to Grid
          </button>
        </div>
      </section>

      {/* GRID SECTION */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200">

        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 className="text-lg font-bold">Review Entries</h3>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
            2 Entries
          </span>
        </div>

        {/* HORIZONTAL SCROLL FOR MOBILE */}
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-bold">Category</th>
                <th className="px-4 py-3 text-xs font-bold">Item</th>
                <th className="px-4 py-3 text-xs font-bold">Amount</th>
                <th className="px-4 py-3 text-xs font-bold text-center">Notes</th>
                <th className="px-4 py-3 text-xs font-bold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">Food</td>
                <td className="px-4 py-3">Lunch</td>
                <td className="px-4 py-3">
                  <input
                    className="w-24 bg-black text-white rounded px-2 py-1"
                    value="250"
                    readOnly
                  />
                </td>
                <td className="px-4 py-3 text-center">ℹ️</td>
                <td className="px-4 py-3 text-center">🗑️</td>
              </tr>
            </tbody>

            <tfoot className="bg-indigo-50 font-bold">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-right">
                  Total:
                </td>
                <td colSpan={3} className="px-4 py-3">
                  ₹250.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button className="text-gray-600">Clear All</button>
          <button className="bg-indigo-600 text-white w-full sm:w-auto px-10 py-2.5 rounded-lg font-bold">
            Submit Expenses
          </button>
        </div>
      </section>
    </div>
  );
};
