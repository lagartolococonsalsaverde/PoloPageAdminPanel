import React, { useEffect, useState } from 'react';
import LoggedinLayout from '../../components/LoggedinLayout';
import { fetchSmsTemplates, updateSmsTemplates } from '../../services/templates.api';
import { toast } from 'react-toastify';

const SMSTemplates = () => {
    const [smsTemplates, setSmsTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('confirmation');
    const [templateBody, setTemplateBody] = useState('');

    useEffect(() => {
        const getSmsTemplates = async () => {
            try {
                const response = await fetchSmsTemplates();

                const selectedTemplate = response.find(t => t.purpose.toLowerCase() === activeTab);
                setTemplateBody(selectedTemplate ? selectedTemplate.body : '');

                setSmsTemplates(response);
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setLoading(false);
            }
        };
        getSmsTemplates();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const selectedTemplate = smsTemplates.find(t => t.purpose.toLowerCase() === tab);
        setTemplateBody(selectedTemplate ? selectedTemplate.body : '');
    };

    const handleSave = async () => {
        const selectedTemplate = smsTemplates?.find(t => t.purpose.toLowerCase() === activeTab);
        const templateId = selectedTemplate.templateId;
        setSaveLoading(true);
        const response = await updateSmsTemplates(templateId, templateBody);

        if (response) {
            toast.success("Template Updated Successfully")
        }

        setSaveLoading(false);
    };

    return (
        <LoggedinLayout>
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">SMS Templates</h2>

                {/* Tabs */}
                <div className="flex justify-center space-x-4 mb-6 pb-3">
                    <button
                        className={`px-6 py-2 text-lg font-semibold rounded-t-lg ${activeTab === 'confirmation' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => handleTabChange('confirmation')}
                    >
                        Confirmation
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-semibold rounded-t-lg ${activeTab === 'marketing' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => handleTabChange('marketing')}
                    >
                        Marketing
                    </button>
                </div>


                {loading ?
                    <p className='w-full py-4 text-center text-gray-600'>Fetching Template Body...</p>
                    :
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-medium text-gray-700">Template Body</label>
                        <p className="text-xs text-gray-500">
                            To dynamically load data, use placeholders like <span className="font-medium">{'{name}'}</span>, <span className="font-medium">{'{petname}'}</span>, or <span className="font-medium">{'{url}'}</span> to display the respective values.
                        </p>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            value={templateBody}
                            onChange={(e) => setTemplateBody(e.target.value)}
                            placeholder="Enter SMS template..."
                        />
                    </div>}

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                        onClick={handleSave}
                        disabled={saveLoading}
                    >
                        {saveLoading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </LoggedinLayout>
    );
};

export default SMSTemplates;
