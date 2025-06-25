import React, { useEffect, useState } from 'react';
import LoggedinLayout from '../../components/LoggedinLayout';
import { toast } from 'react-toastify';
import { fetchUserProfile, updateUserProfile } from '../../services/settings.api';

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const ProductMonthTemplates = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setUserProfile(response);
        setSelectedMonth(response.templateMonth);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (!month) return;

    setSaveLoading(true);
    try {
      const response = await updateUserProfile({ templateMonth: month });
      if (response) {
        toast.success(`Template month updated to ${month}`);
        setUserProfile(prev => ({ ...prev, templateMonth: month }));
      }
    } catch (error) {
      console.error("Failed to update month:", error);
      toast.error("Failed to update template month");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <LoggedinLayout>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Product Month Templates</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={saveLoading}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Month --</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {selectedMonth && (
          <p className="text-sm text-gray-600">
            Selected month: <span className="font-semibold capitalize">{selectedMonth}</span>
          </p>
        )}

      </div>
    </LoggedinLayout>
  );
};

export default ProductMonthTemplates;
